import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, User, ArrowRight, Target, Sparkles } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

export const LeaderboardScreen: React.FC = () => {
    const { playerName } = useGameStore();

    // Mock players for UI development
    const mockPlayers = [
        { name: "Tiến Thành", score: 12500, accuracy: 95 },
        { name: "Minh Quân", score: 11200, accuracy: 90 },
        { name: "Hương Giang", score: 10800, accuracy: 88 },
        { name: "Quốc Anh", score: 9500, accuracy: 85 },
        { name: "Thanh Hằng", score: 8900, accuracy: 82 },
        { name: "Hoàng Long", score: 7500, accuracy: 80 },
        { name: "Khánh Linh", score: 6800, accuracy: 75 },
    ];

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
                        {mockPlayers.map((player, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`flex items-center gap-6 p-6 transition-all ${player.name === playerName
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
                                            <h3 className={`font-black text-xl tracking-tight ${player.name === playerName ? 'text-primary' : 'text-neutral-text'}`}>
                                                {player.name.toUpperCase()}
                                            </h3>
                                            {player.name === playerName && (
                                                <span className="bg-primary text-white text-[9px] font-black px-2 py-0.5 uppercase tracking-widest leading-none">
                                                    You
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 mt-1">
                                            <div className="flex items-center gap-1.5 opacity-60">
                                                <Target size={12} className="text-primary" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Precision: {player.accuracy}%</span>
                                            </div>
                                            <div className="w-px h-3 bg-neutral-text/10" />
                                            <div className="flex items-center gap-2">
                                                <Sparkles size={12} className="text-secondary" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-secondary">Tactical Mastery</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right pr-6">
                                    <div className={`text-3xl font-black font-mono leading-none ${index < 3 ? 'text-neutral-text' : 'text-neutral-muted'}`}>
                                        {player.score.toLocaleString()}
                                    </div>
                                    <label className="academic-label !mb-0 mt-1 !text-primary/40">Unit Points</label>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="p-8 bg-neutral-text/5 border-t-2 border-neutral-text/10 flex justify-between items-center">
                        <div className="flex gap-10">
                            <div>
                                <label className="academic-label">Session Status</label>
                                <span className="text-sm font-black uppercase tracking-tighter text-neutral-text">Conclusion Reached</span>
                            </div>
                            <div>
                                <label className="academic-label">Average Accuracy</label>
                                <span className="text-sm font-black uppercase tracking-tighter text-neutral-text">84.2% Theoretical Gain</span>
                            </div>
                        </div>
                        <button className="btn-primary !px-10 !py-4 flex items-center gap-3 group">
                            Archivize Session <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                </div>

                <footer className="mt-12 text-center opacity-40">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em]">Intellectual Integrity • FPT Academic Unit</p>
                </footer>
            </motion.div>
        </div>
    );
};
