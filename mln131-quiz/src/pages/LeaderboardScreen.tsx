import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, User, ArrowRight } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { gameService } from '../lib/gameService';
import type { Player, Room } from '../lib/gameService';

export const LeaderboardScreen: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const navigate = useNavigate();
    const { currentPlayer } = useGameStore();
    const [players, setPlayers] = useState<Player[]>([]);
    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            if (!roomId) return;

            try {
                // Fetch room info
                const rooms = await gameService.getRooms();
                const currentRoom = rooms.find(r => r.id === roomId);
                setRoom(currentRoom || null);

                // Fetch players
                const roomPlayers = await gameService.getPlayers(roomId);
                setPlayers(roomPlayers);
            } catch (err) {
                console.error('Fetch leaderboard error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();

        // Subscribe to player updates for live leaderboard
        if (roomId) {
            const channel = gameService.subscribeToPlayers(roomId, (updatedPlayers) => {
                const sorted = updatedPlayers.sort((a, b) => b.score - a.score);
                setPlayers(sorted);
            });

            return () => {
                channel.unsubscribe();
            };
        }
    }, [roomId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-bg relative overflow-hidden perspective-3d">
                <div className="pixel-star-bg" />
                <div className="text-center space-y-6 relative z-10">
                    <div className="pixel-spinner mx-auto mb-4" />
                    <div className="pixel-dots-loading mx-auto mb-4">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <p className="text-neutral-text font-black uppercase pixel-badge" style={{
                        borderColor: '#DC143C',
                        backgroundColor: '#FFF8E1',
                        padding: '8px 16px'
                    }}>
                        Đang tải bảng xếp hạng...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-16 px-6 flex flex-col items-center max-w-5xl mx-auto relative overflow-hidden bg-neutral-bg perspective-3d">
            <div className="absolute inset-0 pattern-dots opacity-[0.04] text-primary" />
            <div className="pixel-star-bg" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full relative z-10"
            >
                <header className="text-center mb-20 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 opacity-5 select-none pointer-events-none">
                        <Trophy size={200} className="text-primary" />
                    </div>

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
                        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                        transition={{ type: "spring", stiffness: 100 }}
                        className="inline-flex items-center justify-center w-20 h-20 bg-primary text-white mb-8 pixel-border-red star-3d"
                        style={{
                            boxShadow: '0 8px 0 #C8102E, 0 16px 0 rgba(200, 16, 46, 0.5)',
                            transform: 'perspective(500px) rotateX(5deg)'
                        }}
                    >
                        <Trophy size={40} fill="currentColor" className="drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)]" />
                    </motion.div>

                    <label className="academic-label text-center mb-2">Scientific Resolution</label>
                    <h1 className="text-6xl font-serif font-black text-neutral-text tracking-tighter leading-tight uppercase relative inline-block" style={{
                        textShadow: '3px 3px 0px #DC143C, 6px 6px 0px rgba(220, 20, 60, 0.4)',
                        transform: 'perspective(1000px) rotateX(3deg)'
                    }}>
                        Final Standings
                    </h1>
                    <div className="flex items-center justify-center gap-4 mt-6">
                        <div className="h-[3px] w-12 bg-primary pixel-border-red" style={{ boxShadow: '2px 2px 0px #C8102E' }} />
                        <span className="text-[11px] font-black text-primary uppercase tracking-[0.4em] pixel-badge" style={{
                            borderColor: '#DC143C',
                            backgroundColor: '#FFF8E1',
                            padding: '4px 12px'
                        }}>
                            Unit MLN131 • Examination Results
                        </span>
                        <div className="h-[3px] w-12 bg-primary pixel-border-red" style={{ boxShadow: '2px 2px 0px #C8102E' }} />
                    </div>
                </header>

                <div className="glass-card !p-0" style={{
                    border: '4px solid #DC143C',
                    boxShadow: '0 12px 0 #C8102E, 0 24px 0 rgba(200, 16, 46, 0.3)',
                    transform: 'perspective(1000px) rotateX(2deg)'
                }}>
                    <div className="grid grid-cols-1 divide-y-2" style={{ borderColor: 'rgba(220, 20, 60, 0.1)' }}>
                        {players.map((player, index) => (
                            <motion.div
                                key={player.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`flex items-center gap-6 p-6 transition-all relative ${player.id === currentPlayer?.id
                                    ? 'bg-primary/10'
                                    : 'hover:bg-neutral-bg'
                                    }`}
                                style={player.id === currentPlayer?.id ? {
                                    borderLeft: '8px solid #DC143C',
                                    boxShadow: 'inset 4px 0 0 rgba(220, 20, 60, 0.2)'
                                } : {}}
                            >
                                {index < 3 ? (
                                    <div className={`pixel-medal shrink-0 ${index === 0 ? 'pixel-medal-gold' : index === 1 ? 'pixel-medal-silver' : 'pixel-medal-bronze'}`}>
                                        {index === 0 ? '🏆' : index === 1 ? '🥈' : '🥉'}
                                    </div>
                                ) : (
                                    <div className="w-14 h-14 flex items-center justify-center font-black text-2xl shrink-0 pixel-border-red text-neutral-text" style={{
                                        backgroundColor: '#FFF8E1',
                                        border: '3px solid #DC143C',
                                        boxShadow: '0 4px 0 #C8102E'
                                    }}>
                                        {index + 1}
                                    </div>
                                )}

                                <div className="flex-1 flex items-center gap-6">
                                    <div className="w-12 h-12 bg-neutral-text/5 flex items-center justify-center text-neutral-text/20">
                                        <User size={28} />
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-3">
                                            <h3 className={`font-black text-xl tracking-tight ${player.id === currentPlayer?.id ? 'text-primary' : 'text-neutral-text'}`}>
                                                {player.name.toUpperCase()}
                                            </h3>
                                            {player.id === currentPlayer?.id && (
                                                <span className="bg-primary text-white text-[9px] font-black px-2 py-0.5 uppercase tracking-widest leading-none">
                                                    You
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 mt-1">
                                            <span className="text-[10px] font-black text-neutral-muted uppercase tracking-wider">
                                                Rank #{index + 1}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="flex items-baseline gap-1 justify-end">
                                        <span className="font-black text-3xl text-neutral-text leading-none">{player.score.toLocaleString()}</span>
                                        <span className="text-[10px] font-black text-neutral-muted uppercase">pts</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 flex justify-center"
                >
                    <button
                        onClick={() => window.location.reload()}
                        className="btn-primary group"
                    >
                        <span>Chơi lại</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
};
