import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Users, Trophy, RefreshCcw } from 'lucide-react';
import { gameService } from '../../lib/gameService';
import type { Room, Player } from '../../lib/gameService';

export const RoomManagement: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const navigate = useNavigate();
    const [room, setRoom] = useState<Room | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!roomId) return;
        fetchRoomData();

        // Subscribe to player updates
        const channel = gameService.subscribeToPlayers(roomId, (updatedPlayers) => {
            setPlayers(updatedPlayers.sort((a, b) => b.score - a.score));
        });

        return () => {
            channel.unsubscribe();
        };
    }, [roomId]);

    const fetchRoomData = async () => {
        if (!roomId) return;

        try {
            const rooms = await gameService.getRooms();
            const currentRoom = rooms.find(r => r.id === roomId);
            if (currentRoom) {
                setRoom(currentRoom);
                const roomPlayers = await gameService.getPlayers(roomId);
                setPlayers(roomPlayers.sort((a, b) => b.score - a.score));
            }
        } catch (err) {
            console.error('Fetch room data error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStartGame = async () => {
        if (!roomId) return;
        try {
            await gameService.updateRoomStatus(roomId, 'playing');
            await fetchRoomData();
        } catch (err) {
            console.error('Start game error:', err);
        }
    };

    const handleEndGame = async () => {
        if (!roomId) return;
        try {
            await gameService.updateRoomStatus(roomId, 'finished');
            await fetchRoomData();
        } catch (err) {
            console.error('End game error:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-bg">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!room) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-bg">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-neutral-text mb-4">Phòng không tồn tại</h2>
                    <button onClick={() => navigate('/admin')} className="btn-primary">
                        Quay lại Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-bg p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin')}
                            className="w-12 h-12 bg-neutral-text/5 hover:bg-neutral-text/10 flex items-center justify-center transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-4xl font-black text-neutral-text uppercase tracking-tight">
                                {room.room_code}
                            </h1>
                            <p className="text-sm text-neutral-muted font-bold mt-1">
                                Trạng thái: <span className={`uppercase ${room.status === 'waiting' ? 'text-yellow-600' :
                                        room.status === 'playing' ? 'text-green-600' :
                                            'text-gray-600'
                                    }`}>{room.status}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        {room.status === 'waiting' && (
                            <button onClick={handleStartGame} className="btn-primary">
                                <Play size={20} />
                                <span>Bắt đầu</span>
                            </button>
                        )}
                        {room.status === 'playing' && (
                            <button onClick={handleEndGame} className="btn-secondary">
                                <Trophy size={20} />
                                <span>Kết thúc</span>
                            </button>
                        )}
                        <button onClick={fetchRoomData} className="btn-secondary">
                            <RefreshCcw size={20} />
                        </button>
                    </div>
                </div>

                {/* Players List */}
                <div className="glass-card p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Users size={24} className="text-primary" />
                        <h2 className="text-2xl font-black uppercase">
                            Người chơi ({players.length})
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {players.map((player, index) => (
                            <motion.div
                                key={player.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center gap-4 p-4 bg-neutral-bg border-2 border-neutral-text/10"
                            >
                                <div className={`w-12 h-12 flex items-center justify-center font-black text-xl ${index === 0 ? 'bg-primary text-white' :
                                        index === 1 ? 'bg-secondary text-white' :
                                            index === 2 ? 'bg-accent-blue text-white' :
                                                'bg-neutral-text/10 text-neutral-text'
                                    }`}>
                                    {index + 1}
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-bold text-lg">{player.name}</h3>
                                    {player.is_admin && (
                                        <span className="text-xs font-black text-primary uppercase">Admin</span>
                                    )}
                                </div>

                                <div className="text-right">
                                    <div className="font-black text-2xl text-neutral-text">
                                        {player.score.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-neutral-muted font-bold">điểm</div>
                                </div>
                            </motion.div>
                        ))}

                        {players.length === 0 && (
                            <div className="text-center py-12 text-neutral-muted">
                                <Users size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="font-bold">Chưa có người chơi nào</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
