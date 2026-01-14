import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Trophy, Shield, Zap, Sparkles, Ghost, Lightbulb, User, ShieldCheck, Target as TargetIcon, X } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

export const QuizScreen: React.FC = () => {
    const { score, currentQuestionIndex } = useGameStore();
    const [timeLeft, setTimeLeft] = useState(30);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [activeItem, setActiveItem] = useState<{ label: string, color: string } | null>(null);
    const [showTargeting, setShowTargeting] = useState(false);

    // Mock question for UI development
    const question = {
        text: "Học thuyết nào sau đây là 'hòn đá tảng' của kinh tế chính trị học Mác - Lênin?",
        options: [
            "Học thuyết về giá trị thặng dư",
            "Học thuyết về sứ mệnh lịch sử của giai cấp công nhân",
            "Học thuyết về chủ nghĩa duy vật lịch sử",
            "Học thuyết về đấu tranh giai cấp"
        ]
    };

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    const handleItemClick = (label: string, color: 'yellow' | 'red') => {
        if (color === 'red') {
            setShowTargeting(true);
            setActiveItem({ label, color });
        } else {
            // Instant buff
            setActiveItem({ label, color });
            setTimeout(() => setActiveItem(null), 2000);
        }
    };

    const confirmTarget = (targetName: string) => {
        setShowTargeting(false);
        setActiveItem({ label: `Đang dùng ${activeItem?.label} lên ${targetName}`, color: 'red' });
        setTimeout(() => setActiveItem(null), 3000);
    };

    return (
        <div className="min-h-screen py-8 px-6 flex flex-col max-w-6xl mx-auto relative overflow-hidden bg-neutral-bg">
            <div className="absolute inset-0 pattern-dots opacity-[0.03] text-primary" />

            {/* Top Navigation / Status Header */}
            <header className="flex justify-between items-start mb-16 relative z-10 border-b-2 border-neutral-text/5 pb-8">
                <div className="flex gap-10">
                    <div className="flex flex-col">
                        <label className="academic-label">Academic Identity</label>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary flex items-center justify-center text-white font-black">P</div>
                            <div>
                                <p className="font-bold text-sm leading-none">Comrade Researcher</p>
                                <p className="text-[10px] text-primary/60 font-black uppercase tracking-widest mt-1">Section: MLN131-01</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="academic-label">Scientific Output (Score)</label>
                        <div className="flex items-baseline gap-2">
                            <span className="font-black text-4xl text-neutral-text leading-none">{score.toLocaleString()}</span>
                            <Trophy className="text-secondary" size={16} />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="academic-label">Competitive Standing</label>
                        <div className="flex items-baseline gap-1">
                            <span className="font-black text-2xl text-neutral-text">12</span>
                            <span className="text-xs font-bold text-neutral-muted">/ 48</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end w-64">
                    <div className="flex justify-between w-full mb-1">
                        <label className="academic-label">Theoretical Timeframe</label>
                        <span className={`text-xs font-mono font-black ${timeLeft < 10 ? 'text-primary animate-pulse' : 'text-neutral-text'}`}>
                            {timeLeft < 10 ? `0${timeLeft}` : timeLeft}s
                        </span>
                    </div>
                    <div className="w-full h-3 bg-neutral-text/5 border border-neutral-text/10 relative">
                        <motion.div
                            className={`h-full ${timeLeft < 10 ? 'bg-primary' : 'bg-accent-blue'} transition-colors`}
                            initial={{ width: '100%' }}
                            animate={{ width: `${(timeLeft / 30) * 100}%` }}
                            transition={{ duration: 1, ease: "linear" }}
                        />
                        <div className="absolute top-0 left-0 w-full h-full pattern-dots opacity-20" />
                    </div>
                </div>
            </header>

            {/* Item Activation Notification */}
            <AnimatePresence>
                {activeItem && !showTargeting && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`fixed top-32 right-8 p-4 border-l-4 shadow-2xl z-50 bg-white ${activeItem.color === 'yellow' ? 'border-secondary text-secondary' : 'border-primary text-primary'}`}
                    >
                        <div className="flex items-center gap-4">
                            {activeItem.color === 'yellow' ? <ShieldCheck size={24} /> : <TargetIcon size={24} />}
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Tactical Execution</p>
                                <p className="font-black text-sm uppercase tracking-tighter">{activeItem.label} ACTIVE</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Question Section */}
            <main className="flex-1 flex flex-col justify-center gap-16 relative z-10">
                <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="constructivist-box max-w-3xl"
                >
                    <div className="absolute -top-3 -left-1 px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest leading-none">
                        Thesis {currentQuestionIndex + 1}
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Lightbulb size={14} className="text-secondary" />
                            <span className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.3em]">Materialist Dialectics • Unit 04</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif font-black text-neutral-text leading-[1.15] tracking-tight max-w-2xl">
                            {question.text}
                        </h2>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                    {question.options.map((option, index) => (
                        <motion.button
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => setSelectedOption(index)}
                            className={`text-left p-6 border-2 transition-all duration-200 group relative ${selectedOption === index
                                    ? 'border-primary bg-primary/5 shadow-[6px_6px_0px_0px_rgba(153,27,27,1)]'
                                    : 'border-neutral-text/10 bg-white hover:border-neutral-text/20 hover:bg-neutral-bg'
                                }`}
                        >
                            <div className="flex gap-5 items-start relative z-10">
                                <span className={`w-8 h-8 flex items-center justify-center font-black text-sm transition-colors ${selectedOption === index ? 'bg-primary text-white' : 'bg-neutral-text/5 text-neutral-text/40 group-hover:bg-neutral-text/10'
                                    }`}>
                                    {String.fromCharCode(65 + index)}
                                </span>
                                <span className={`font-bold text-lg leading-snug pt-0.5 transition-colors ${selectedOption === index ? 'text-neutral-text' : 'text-neutral-text group-hover:text-primary'
                                    }`}>
                                    {option}
                                </span>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </main>

            {/* Tactical Arsenal (Items) */}
            <footer className="mt-20 pt-10 border-t-2 border-neutral-text/5 flex items-center justify-between relative z-10">
                <div className="flex flex-col">
                    <label className="academic-label mb-4">Strategic Inventory</label>
                    <div className="flex items-center gap-4">
                        <ItemButton icon={<Sparkles size={18} />} label="Amplifier" color="yellow" tooltip="X2 Score Multiplier" onClick={() => handleItemClick('Point Amplifier', 'yellow')} />
                        <ItemButton icon={<Timer size={18} />} label="Extension" color="yellow" tooltip="+5s Temporal Buffer" onClick={() => handleItemClick('Time Extension', 'yellow')} />
                        <ItemButton icon={<Shield size={18} />} label="Aegis" color="yellow" tooltip="Full Debuff Immunity" onClick={() => handleItemClick('Aegis Shield', 'yellow')} />
                        <div className="w-px h-10 bg-neutral-text/10 mx-2" />
                        <ItemButton icon={<Ghost size={18} />} label="Obfuscation" color="red" tooltip="Eliminate Wrong Option" onClick={() => handleItemClick('Option Obfuscator', 'red')} />
                        <ItemButton icon={<Zap size={18} />} label="Disruption" color="red" tooltip="-5s Adversary Window" onClick={() => handleItemClick('Temporal Disruption', 'red')} />
                    </div>
                </div>

                <div className="hidden lg:flex flex-col items-end">
                    <label className="academic-label mb-2">Live Standings</label>
                    <div className="space-y-1 w-48 font-mono text-[10px]">
                        {[
                            { name: '1. TOP_SCORE', score: 14500, color: 'text-secondary' },
                            { name: '2. ELITE_RESEARCHER', score: 12100, color: 'text-neutral-text' },
                            { name: '12. YOU (COMRADE)', score: 8400, color: 'text-primary' },
                        ].map((rank, i) => (
                            <div key={i} className={`flex justify-between py-1 border-b border-neutral-text/5 ${rank.color}`}>
                                <span>{rank.name}</span>
                                <span className="font-black">{rank.score}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </footer>

            {/* Targeting Overlay */}
            <AnimatePresence>
                {showTargeting && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-neutral-bg/95 backdrop-blur-sm z-[100] flex flex-col items-center justify-center p-8"
                    >
                        <div className="absolute inset-0 pattern-dots opacity-10 text-primary" />

                        <button
                            onClick={() => setShowTargeting(false)}
                            className="absolute top-10 right-10 text-neutral-text/40 hover:text-primary transition-colors p-2"
                        >
                            <X size={32} />
                        </button>

                        <div className="text-center mb-16 relative">
                            <div className="w-16 h-16 bg-primary text-white flex items-center justify-center mx-auto mb-6 shadow-2xl">
                                <TargetIcon size={32} />
                            </div>
                            <label className="academic-label text-center mb-2">Tactical Selection</label>
                            <h3 className="text-4xl font-serif font-black text-neutral-text uppercase tracking-tighter">SELECT ADVERSARY</h3>
                            <p className="text-neutral-muted font-medium mt-2 italic">Executing: <span className="text-primary font-bold">{activeItem?.label}</span></p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-4xl w-full">
                            {['Minh Quân', 'Thanh Hằng', 'Hoàng Long', 'Khánh Linh', 'Quốc Anh', 'Hải Nam'].map((name) => (
                                <motion.button
                                    key={name}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => confirmTarget(name)}
                                    className="bg-white border-2 border-neutral-text/10 p-6 hover:border-primary transition-colors group relative overflow-hidden"
                                >
                                    <div className="relative z-10 flex flex-col items-center gap-4">
                                        <div className="w-12 h-12 bg-neutral-text/5 flex items-center justify-center text-neutral-text/40 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                            <User size={24} />
                                        </div>
                                        <div>
                                            <span className="text-neutral-text font-black text-sm block">{name.toUpperCase()}</span>
                                            <span className="text-[9px] text-neutral-muted font-black uppercase tracking-widest">Efficiency: 88%</span>
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-neutral-text/10 group-hover:border-primary transition-colors" />
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ItemButton: React.FC<{ icon: React.ReactNode, label: string, color: 'yellow' | 'red', tooltip: string, onClick?: () => void }> = ({ icon, label, color, tooltip, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center gap-2 group cursor-pointer relative">
        <div className={`w-12 h-12 flex items-center justify-center transition-all duration-200 border-2 ${color === 'yellow'
            ? 'bg-neutral-bg text-secondary border-secondary/20 hover:bg-secondary hover:text-white hover:border-secondary'
            : 'bg-neutral-bg text-primary border-primary/20 hover:bg-primary hover:text-white hover:border-primary'
            }`}>
            {icon}
        </div>
        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-neutral-muted group-hover:text-neutral-text transition-colors">{label}</span>
        <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-neutral-text text-white text-[9px] font-bold rounded-none opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            {tooltip}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-t-4 border-t-neutral-text" />
        </div>
    </button>
);
