import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { Users, Trophy, ChevronRight, GraduationCap, Binary } from 'lucide-react';
import { motion } from 'framer-motion';

export const EntryScreen: React.FC = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const { setPlayerName, setRoomCode, setStatus } = useGameStore();

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && room) {
            setPlayerName(name);
            setRoomCode(room);
            setStatus('waiting');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-neutral-bg">
            {/* Background Effects */}
            <div className="absolute inset-0 pattern-dots opacity-[0.05] text-primary" />
            <div className="absolute top-0 left-0 w-full h-1 bg-primary/20 overflow-hidden">
                <div className="w-1/3 h-full bg-primary animate-scan shadow-[0_0_10px_rgba(153,27,27,0.5)]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="w-full max-w-lg z-10"
            >
                <header className="text-center mb-12 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 opacity-10">
                        <GraduationCap size={160} className="text-primary" />
                    </div>

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="relative inline-block mb-6"
                    >
                        <div className="w-20 h-20 bg-primary flex items-center justify-center text-white shadow-lg">
                            <Trophy size={40} />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-secondary flex items-center justify-center text-white shadow-md">
                            <GraduationCap size={20} />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-2"
                    >
                        <h1 className="text-6xl font-serif font-black text-neutral-text tracking-tighter leading-tight">
                            MLN131 <span className="text-primary italic">QUIZ</span>
                        </h1>
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-[2px] w-8 bg-primary" />
                            <p className="text-primary font-black text-[11px] uppercase tracking-[0.4em]">Scientific Socialism</p>
                            <div className="h-[2px] w-8 bg-primary" />
                        </div>
                    </motion.div>
                </header>

                <motion.form
                    onSubmit={handleJoin}
                    className="glass-card flex flex-col relative"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, ease: "easeOut" }}
                >
                    {/* Constructivist Corner Accents */}
                    <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-primary" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-secondary" />

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="academic-label">Player Designation</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary">
                                    <Users size={18} />
                                </span>
                                <input
                                    type="text"
                                    placeholder="e.g. Comrade Researcher"
                                    className="input-field pl-12"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="academic-label">Examination Room Code</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary">
                                    <Binary size={18} />
                                </span>
                                <input
                                    type="text"
                                    placeholder="MLN131-XXXX"
                                    className="input-field pl-12 uppercase font-mono tracking-widest"
                                    value={room}
                                    onChange={(e) => setRoom(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary mt-8 group text-base py-4">
                        Initialize Session
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button type="button" className="btn-secondary mt-3">
                        View Archival Data
                    </button>
                </motion.form>

                <motion.footer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-16 border-t border-neutral-text/5 pt-6 flex justify-between items-center"
                >
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-primary/40 uppercase tracking-widest">Institution</span>
                        <span className="text-[11px] font-bold text-neutral-text">FPT UNIVERSITY • ACADEMIC UNIT MLN</span>
                    </div>
                    <div className="text-right">
                        <span className="text-[9px] font-black text-primary/40 uppercase tracking-widest">System Time</span>
                        <span className="text-[11px] font-mono font-bold text-neutral-text">EST. 2026.IV</span>
                    </div>
                </motion.footer>
            </motion.div>
        </div>
    );
};
