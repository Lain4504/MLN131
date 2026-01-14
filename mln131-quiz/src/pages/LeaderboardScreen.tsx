import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, User, ArrowRight } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { gameService } from '../lib/gameService';
import type { Player } from '../lib/gameService';

export const LeaderboardScreen: React.FC = () => {
    const { currentRoom, currentPlayer } = useGameStore();
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            if (!currentRoom?.id) return;

            try {
                const roomPlayers = await gameService.getPlayers(currentRoom.id);
                setPlayers(roomPlayers);
            } catch (err) {
                console.error('Fetch leaderboard error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();

        // Subscribe to player updates for live leaderboard
        if (currentRoom?.id) {
            const channel = gameService.subscribeToPlayers(currentRoom.id, (updatedPlayers) => {
                const sorted = updatedPlayers.sort((a, b) => b.score - a.score);
                setPlayers(sorted);
            });

            return () => {
                channel.unsubscribe();
            };
        }
    }, [currentRoom?.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-bg">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-neutral-text font-bold">Đang tải bảng xếp hạng...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-16 px-6 flex flex-col items-center max-w-5xl mx-auto relative overflow-hidden bg-neutral-bg">
            <div className="absolute inset-0 pattern-dots opacity-[0.03] text-primary" />

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
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center justify-center w-20 h-20 bg-primary text-white shadow-2xl mb-8"
                    >
                        <Trophy size={40} />
                    </motion.div>

                    <label className="academic-label text-center mb-2">Scientific Resolution</label>
                    <h1 className="text-6xl font-serif font-black text-neutral-text tracking-tighter leading-tight uppercase">
                        Final Standings
                    </h1>
                    <div className="flex items-center justify-center gap-4 mt-6">
                        <div className="h-[2px] w-12 bg-primary/20" />
                        <span className="text-[11px] font-black text-primary uppercase tracking-[0.4em]">Unit MLN131 • Examination Results</span>
                        <div className="h-[2px] w-12 bg-primary/20" />
                    </div>
                </header>

                <div className="glass-card !p-0 border-2 border-neutral-text/10 shadow-[12px_12px_0px_0px_rgba(153,27,27,0.1)]">
                    <div className="grid grid-cols-1 divide-y-2 divide-neutral-text/5">
                        {players.map((player, index) => (
                            <motion.div
                                key={player.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`flex items-center gap-6 p-6 transition-all ${player.id === currentPlayer?.id
                                    ? 'bg-primary/5 border-l-8 border-primary'
                                    : 'hover:bg-neutral-bg'
                                    }`}
                            >
                                <div className={`w-14 h-14 flex items-center justify-center font-black text-2xl border-2 shrink-0 ${index === 0 ? 'bg-primary text-white border-primary shadow-[4px_4px_0_0_rgba(212,175,55,1)]' :
                                    index === 1 ? 'bg-accent-blue text-white border-accent-blue' :
                                        index === 2 ? 'bg-secondary text-white border-secondary' : 'text-neutral-text border-neutral-text/10 bg-neutral-bg'
                                    }`}>
                                    {index + 1}
                                </div>

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
