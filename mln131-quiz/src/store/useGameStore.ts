import { create } from 'zustand';
import { gameService } from '../lib/gameService';
import type { Room, Player, Question } from '../lib/gameService';

interface GameState {
    playerName: string | null;
    roomCode: string | null;
    status: 'idle' | 'waiting' | 'playing' | 'finished';
    score: number;
    rank: number;
    players: Player[];
    currentQuestionIndex: number;
    questions: Question[];
    currentRoom: Room | null;
    currentPlayer: Player | null;
    itemInventory: Record<string, number>;
    lastRewardedItem: string | null;

    // Actions
    setPlayerName: (name: string) => void;
    setRoomCode: (code: string) => void;
    setStatus: (status: GameState['status']) => void;

    // Async Actions
    joinRoom: (roomCode: string, playerName: string) => Promise<void>;
    submitAnswer: (isCorrect: boolean, timeUsed: number) => Promise<void>;
    setPlayers: (players: Player[]) => void;
    setCurrentQuestionIndex: (index: number) => void;
    startRoom: () => Promise<void>;
}

export const useGameStore = create<GameState>((set, get) => ({
    playerName: null,
    roomCode: null,
    status: 'idle',
    score: 0,
    rank: 1,
    players: [],
    currentQuestionIndex: 0,
    questions: [],
    currentRoom: null,
    currentPlayer: null,
    itemInventory: {
        score_boost: 0,
        time_extend: 0,
        shield: 0,
        confusion: 0,
        time_attack: 0
    },
    lastRewardedItem: null,

    setPlayerName: (name) => set({ playerName: name }),
    setRoomCode: (code) => set({ roomCode: code }),
    setStatus: (status) => set({ status }),

    joinRoom: async (roomCode, playerName) => {
        try {
            const { room, player } = await gameService.joinRoom(roomCode, playerName);
            const questions = await gameService.getQuestions();

            set({
                currentRoom: room,
                currentPlayer: player,
                roomCode,
                playerName,
                questions,
                status: room.status,
                score: player.score
            });

            // Subscribe to room updates
            gameService.subscribeToRoom(room.id, (updatedRoom) => {
                set({
                    currentRoom: updatedRoom,
                    status: updatedRoom.status,
                    currentQuestionIndex: updatedRoom.current_question_index
                });
            });

            // Subscribe to players
            gameService.subscribeToPlayers(room.id, (players) => {
                const rank = players.findIndex(p => p.id === player.id) + 1;
                set({ players, rank });
            });

        } catch (error) {
            console.error('Join room error:', error);
            throw error;
        }
    },

    submitAnswer: async (isCorrect, timeUsed) => {
        const { currentPlayer, questions, currentQuestionIndex } = get();
        if (!currentPlayer || questions.length === 0) return;

        const question = questions[currentQuestionIndex];

        // Simple scoring logic: 100 base + time bonus (up to 100)
        let points = 0;
        if (isCorrect) {
            const timeBonus = Math.max(0, 100 - Math.floor(timeUsed / 100));
            points = 100 + timeBonus;
        }

        try {
            const result = await gameService.submitAnswer(
                currentPlayer.id,
                question.id,
                isCorrect,
                timeUsed,
                points
            );

            set({
                score: result.newScore,
                itemInventory: result.newInventory,
                lastRewardedItem: result.rewardedItem
            });
        } catch (error) {
            console.error('Submit answer error:', error);
        }
    },

    setPlayers: (players) => set({ players }),
    setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),

    startRoom: async () => {
        const { currentRoom } = get();
        if (currentRoom) {
            await gameService.updateRoomStatus(currentRoom.id, 'playing');
        }
    }
}));
