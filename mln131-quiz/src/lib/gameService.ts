import { supabase } from './supabase';

export interface Room {
    id: string;
    room_code: string;
    status: 'waiting' | 'playing' | 'finished';
    current_question_index: number;
}

export interface Player {
    id: string;
    room_id: string;
    name: string;
    score: number;
    is_admin: boolean;
}

export interface Question {
    id: string;
    content: {
        question: string;
        options: string[];
        correct_index: number;
        difficulty: string;
    };
}

export const gameService = {
    // Room Management
    async getRooms() {
        const { data, error } = await supabase
            .from('rooms')
            .select()
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data as Room[];
    },

    async createRoom(roomCode: string) {
        const { data, error } = await supabase
            .from('rooms')
            .insert([{ room_code: roomCode, status: 'waiting' }])
            .select()
            .single();
        if (error) throw error;
        return data as Room;
    },

    async joinRoom(roomCode: string, playerName: string) {
        // 1. Find room
        const { data: room, error: roomError } = await supabase
            .from('rooms')
            .select()
            .eq('room_code', roomCode)
            .single();

        if (roomError || !room) throw new Error('Không tìm thấy phòng chơi này.');
        if (room.status !== 'waiting') throw new Error('Phòng này đã bắt đầu hoặc đã kết thúc.');

        // 2. Add player
        const { data: player, error: playerError } = await supabase
            .from('players')
            .insert([{ room_id: room.id, name: playerName, score: 0 }])
            .select()
            .single();

        if (playerError) throw playerError;

        return { room: room as Room, player: player as Player };
    },

    async updateRoomStatus(roomId: string, status: Room['status']) {
        const { error } = await supabase
            .from('rooms')
            .update({ status })
            .eq('id', roomId);
        if (error) throw error;
    },

    async advanceQuestion(roomId: string, nextIndex: number) {
        const { error } = await supabase
            .from('rooms')
            .update({ current_question_index: nextIndex })
            .eq('id', roomId);
        if (error) throw error;
    },

    // Question Management
    async getQuestions() {
        const { data, error } = await supabase
            .from('questions')
            .select()
            .order('created_at', { ascending: true });
        if (error) throw error;
        return data as Question[];
    },

    // Gameplay
    async submitAnswer(playerId: string, questionId: string, isCorrect: boolean, timeUsed: number, points: number) {
        // 1. Record answer
        const { error: answerError } = await supabase
            .from('answers')
            .insert([{
                player_id: playerId,
                question_id: questionId,
                is_correct: isCorrect,
                time_used: timeUsed,
                points_awarded: points
            }]);
        if (answerError) throw answerError;

        // 2. Update player total score
        const { data: player, error: fetchError } = await supabase
            .from('players')
            .select('score, item_inventory')
            .eq('id', playerId)
            .single();

        if (fetchError) throw fetchError;

        const newScore = (player?.score || 0) + points;

        // 3. Reward random item if answer is correct
        let newInventory = player?.item_inventory || {
            score_boost: 0,
            time_extend: 0,
            shield: 0,
            confusion: 0,
            time_attack: 0
        };

        let rewardedItem: string | null = null;

        if (isCorrect) {
            const itemTypes = ['score_boost', 'time_extend', 'shield', 'confusion', 'time_attack'];
            rewardedItem = itemTypes[Math.floor(Math.random() * itemTypes.length)];
            newInventory = {
                ...newInventory,
                [rewardedItem]: (newInventory[rewardedItem] || 0) + 1
            };
        }

        const { error: scoreError } = await supabase
            .from('players')
            .update({
                score: newScore,
                item_inventory: newInventory
            })
            .eq('id', playerId);

        if (scoreError) throw scoreError;

        return {
            newScore,
            newInventory,
            rewardedItem
        };
    },

    // Item Management
    async getPlayerInventory(playerId: string) {
        const { data, error } = await supabase
            .from('players')
            .select('item_inventory')
            .eq('id', playerId)
            .single();

        if (error) throw error;
        return data?.item_inventory || {
            score_boost: 0,
            time_extend: 0,
            shield: 0,
            confusion: 0,
            time_attack: 0
        };
    },

    async consumeItem(playerId: string, itemType: string) {
        // Get current inventory
        const { data: player, error: fetchError } = await supabase
            .from('players')
            .select('item_inventory')
            .eq('id', playerId)
            .single();

        if (fetchError) throw fetchError;

        const inventory = player?.item_inventory || {};
        const currentCount = inventory[itemType] || 0;

        if (currentCount <= 0) {
            throw new Error(`Không còn ${itemType} trong kho`);
        }

        // Decrease item count
        const newInventory = {
            ...inventory,
            [itemType]: currentCount - 1
        };

        const { error: updateError } = await supabase
            .from('players')
            .update({ item_inventory: newInventory })
            .eq('id', playerId);

        if (updateError) throw updateError;

        return newInventory;
    },

    async useItem(fromPlayerId: string, toPlayerId: string, itemType: string, questionIndex: number) {
        const { error } = await supabase
            .from('items_used')
            .insert([{
                from_player_id: fromPlayerId,
                to_player_id: toPlayerId,
                item_type: itemType,
                question_index: questionIndex
            }]);
        if (error) throw error;
    },

    subscribeToRoom(roomId: string, onUpdate: (room: Room) => void) {
        return supabase
            .channel(`room:${roomId}`)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'rooms',
                filter: `id=eq.${roomId}`
            }, (payload) => {
                onUpdate(payload.new as Room);
            })
            .subscribe();
    },

    subscribeToAllRooms(onUpdate: (payload: any) => void) {
        return supabase
            .channel('all-rooms')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'rooms'
            }, (payload) => {
                onUpdate(payload);
            })
            .subscribe();
    },

    subscribeToPlayers(roomId: string, onUpdate: (players: Player[]) => void) {
        return supabase
            .channel(`players:${roomId}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'players',
                filter: `room_id=eq.${roomId}`
            }, async () => {
                // Fetch all players for the room to get updated standings
                const { data, error } = await supabase
                    .from('players')
                    .select()
                    .eq('room_id', roomId)
                    .order('score', { ascending: false });
                if (!error && data) {
                    onUpdate(data as Player[]);
                }
            })
            .subscribe();
    },

    subscribeToItems(playerId: string, onInvite: (item: any) => void) {
        return supabase
            .channel(`items:${playerId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'items_used',
                filter: `to_player_id=eq.${playerId}`
            }, (payload) => {
                onInvite(payload.new);
            })
            .subscribe();
    }
};
