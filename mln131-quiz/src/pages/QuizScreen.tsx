import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Trophy, Shield, Zap, Sparkles, Ghost, User, ShieldCheck, Target as TargetIcon, X } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { gameService } from '../lib/gameService';

export const QuizScreen: React.FC = () => {
    const {
        score,
        currentQuestionIndex,
        questions,
        currentPlayer,
        players,
        rank,
        submitAnswer,
        currentRoom,
        itemInventory,
        lastRewardedItem,
        updateItemInventory
    } = useGameStore();

    const [timeLeft, setTimeLeft] = useState(30);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [activeItem, setActiveItem] = useState<{ label: string, color: string, type?: string } | null>(null);
    const [showTargeting, setShowTargeting] = useState(false);
    const [activeDebuffs, setActiveDebuffs] = useState<string[]>([]);
    const [timeBonus, setTimeBonus] = useState(0);
    const [showRewardNotification, setShowRewardNotification] = useState(false);
    const [itemQueue, setItemQueue] = useState<any[]>([]);

    const question = questions[currentQuestionIndex] || {
        content: {
            question: "Đang tải câu hỏi...",
            options: ["...", "...", "...", "..."],
            correct_index: 0,
            difficulty: "Bình thường"
        }
    };

    // Subscribe to items used on this player with AUTO-SHIELD
    useEffect(() => {
        if (!currentPlayer?.id) return;

        const channel = gameService.subscribeToItems(currentPlayer.id, async (item: any) => {
            console.log('Received item:', item);

            // AUTO-SHIELD: Check if player has shield and item is a debuff
            const hasShield = itemInventory.shield > 0;
            const isDebuff = item.item_type === 'time_attack' || item.item_type === 'confusion';

            if (hasShield && isDebuff) {
                try {
                    // Auto-consume shield to block attack
                    await gameService.consumeItem(currentPlayer.id, 'shield');

                    // Show shield block notification
                    setActiveItem({
                        label: `🛡️ Shield chặn ${item.item_type}!`,
                        color: 'yellow',
                        type: 'shield_block'
                    });

                    setTimeout(() => setActiveItem(null), 3000);

                    console.log('Shield auto-activated! Attack blocked.');
                    return; // Block the attack - don't queue it
                } catch (err) {
                    console.error('Shield activation failed:', err);
                    // If shield fails, continue to apply debuff
                }
            }

            // No shield or shield failed - add to queue
            setItemQueue(prev => [...prev, item]);

            // Show notification
            setActiveItem({
                label: `${item.item_type} từ đối thủ!`,
                color: 'red',
                type: item.item_type
            });

            setTimeout(() => {
                setActiveItem(null);
            }, 3000);
        });

        return () => {
            channel.unsubscribe();
        };
    }, [currentPlayer?.id, itemInventory.shield]);

    // ITEM QUEUE: Process queued items independently
    useEffect(() => {
        if (itemQueue.length === 0) return;

        const processNextItem = () => {
            const item = itemQueue[0];

            console.log('Processing queued item:', item);

            // Apply debuff effect (works even if already answered)
            if (item.item_type === 'time_attack') {
                setTimeLeft(prev => Math.max(0, prev - 5));
                setActiveDebuffs(prev => {
                    if (!prev.includes('time_attack')) {
                        return [...prev, 'time_attack'];
                    }
                    return prev;
                });
            } else if (item.item_type === 'confusion') {
                setActiveDebuffs(prev => {
                    if (!prev.includes('confusion')) {
                        return [...prev, 'confusion'];
                    }
                    return prev;
                });
            }

            // Remove from queue and clear debuff after 3s
            setTimeout(() => {
                setItemQueue(prev => prev.slice(1));
                setActiveDebuffs(prev => prev.filter(d => d !== item.item_type));
            }, 3000);
        };

        processNextItem();
    }, [itemQueue]);

    // Show reward notification when receiving item
    useEffect(() => {
        if (lastRewardedItem) {
            setShowRewardNotification(true);
            setTimeout(() => setShowRewardNotification(false), 3000);
        }
    }, [lastRewardedItem]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (selectedOption === null) {
            handleAnswer(null);
        }
    }, [timeLeft]);

    useEffect(() => {
        setTimeLeft(30 + timeBonus);
        setSelectedOption(null);
        setTimeBonus(0); // Reset time bonus for new question
    }, [currentQuestionIndex]);

    const handleAnswer = async (index: number | null) => {
        setSelectedOption(index);
        const isCorrect = index === question.content.correct_index;
        const timeUsed = (30 - timeLeft) * 1000;
        await submitAnswer(isCorrect, timeUsed);
    };

    const handleItemClick = async (label: string, type: string, color: 'yellow' | 'red') => {
        if (!currentPlayer || !currentRoom) return;

        // Check if player has this item
        const itemCount = itemInventory[type] || 0;
        if (itemCount <= 0) {
            alert(`Bạn không còn ${label}!`);
            return;
        }

        if (color === 'red') {
            // Debuff - need to select target
            setShowTargeting(true);
            setActiveItem({ label, color, type });
        } else {
            // Buff - apply immediately
            setActiveItem({ label, color, type });

            try {
                // Consume item first
                await gameService.consumeItem(currentPlayer.id, type);

                // Update local state immediately
                updateItemInventory(type, -1);

                await gameService.useItem(
                    currentPlayer.id,
                    currentPlayer.id, // Self-target for buffs
                    type,
                    currentQuestionIndex
                );

                // Apply buff effect
                if (type === 'time_extend') {
                    setTimeLeft(prev => prev + 5);
                    setTimeBonus(5);
                } else if (type === 'shield') {
                    setActiveDebuffs([]); // Clear all debuffs
                }

                setTimeout(() => setActiveItem(null), 2000);
            } catch (err: any) {
                console.error('Use item error:', err);
                alert(err.message || 'Không thể sử dụng vật phẩm');
            }
        }
    };

    const confirmTarget = async (targetPlayerId: string, targetName: string) => {
        if (!currentPlayer || !activeItem?.type) return;

        // Check if player has this item
        const itemCount = itemInventory[activeItem.type] || 0;
        if (itemCount <= 0) {
            alert(`Bạn không còn ${activeItem.label}!`);
            setShowTargeting(false);
            setActiveItem(null);
            return;
        }

        setShowTargeting(false);
        setActiveItem({ label: `Đang dùng ${activeItem.label} lên ${targetName}`, color: 'red', type: activeItem.type });

        try {
            // Consume item first
            await gameService.consumeItem(currentPlayer.id, activeItem.type);

            // Update local state immediately
            updateItemInventory(activeItem.type, -1);

            await gameService.useItem(
                currentPlayer.id,
                targetPlayerId,
                activeItem.type,
                currentQuestionIndex
            );

            setTimeout(() => setActiveItem(null), 3000);
        } catch (err: any) {
            console.error('Use item error:', err);
            alert(err.message || 'Không thể sử dụng vật phẩm');
        }
    };

    return (
        <div className="h-screen bg-neutral-bg relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 pattern-dots opacity-[0.03] text-primary" />

            <div className="absolute -bottom-20 -left-20 w-96 h-96 opacity-[0.05] pointer-events-none grayscale contrast-125 rotate-12 hidden lg:block">
                <img src="/vietnam_academic_motif_lotus.png" alt="Lotus Motif" className="w-full h-full object-contain" />
            </div>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10">
                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Compact Header */}
                    <header className="flex justify-between items-center px-4 lg:px-8 py-3 lg:py-4 border-b-2 border-neutral-text/5 bg-white/50 backdrop-blur-sm flex-shrink-0">
                        <div className="flex gap-4 lg:gap-8 items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary flex items-center justify-center text-white font-black text-sm lg:text-base shadow-lg">
                                    {currentPlayer?.name[0].toUpperCase() || 'P'}
                                </div>
                                <div className="hidden sm:block">
                                    <p className="font-bold text-xs lg:text-sm leading-none uppercase tracking-tight">{currentPlayer?.name || 'Cán bộ'}</p>
                                    <p className="text-[9px] lg:text-[10px] text-primary font-black uppercase tracking-wider mt-0.5">{currentRoom?.room_code || 'MLN131'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-baseline gap-1">
                                    <Trophy className="text-secondary" size={14} />
                                    <span className="font-black text-xl lg:text-2xl text-neutral-text leading-none">{score.toLocaleString()}</span>
                                </div>

                                <div className="hidden md:flex items-baseline gap-1 border-l-2 border-neutral-text/5 pl-4">
                                    <span className="text-[10px] font-black text-neutral-text/40 uppercase">Hạng</span>
                                    <span className="font-black text-lg text-neutral-text">{rank}</span>
                                    <span className="text-xs font-bold text-neutral-muted">/{players.length}</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-32 lg:w-48">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[9px] lg:text-[10px] font-black text-neutral-text/40 uppercase">Thời gian</span>
                                <span className={`text-xs font-mono font-black ${timeLeft < 10 ? 'text-primary animate-pulse' : 'text-neutral-text'}`}>
                                    {timeLeft}s
                                </span>
                            </div>
                            <div className="w-full h-2 bg-neutral-text/5 border border-neutral-text/10 relative overflow-hidden">
                                <motion.div
                                    className={`h-full ${timeLeft < 10 ? 'bg-primary' : 'bg-accent-blue'} transition-colors`}
                                    initial={{ width: '100%' }}
                                    animate={{ width: `${(timeLeft / 30) * 100}%` }}
                                    transition={{ duration: 1, ease: "linear" }}
                                />
                            </div>
                        </div>
                    </header>

                    {/* Question Area */}
                    <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-4 lg:py-6">
                        <motion.div
                            key={currentQuestionIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-4 lg:mb-6"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-3 h-0.5 bg-primary" />
                                <span className="text-[9px] font-black text-primary uppercase tracking-wider">Câu {currentQuestionIndex + 1}</span>
                            </div>
                            <h2 className="text-xl lg:text-3xl font-serif font-black text-neutral-text leading-tight">
                                {question.content.question}
                            </h2>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                            {question.content.options.map((option: string, index: number) => (
                                <motion.button
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => handleAnswer(index)}
                                    disabled={selectedOption !== null}
                                    className={`text-left p-4 lg:p-5 border-2 transition-all duration-300 group relative ${selectedOption === index
                                        ? 'border-primary bg-primary/[0.03] shadow-constructivist-primary -translate-y-0.5'
                                        : 'border-neutral-text/5 bg-white hover:border-primary/40 hover:bg-neutral-bg hover:shadow-lg'
                                        } ${selectedOption !== null && selectedOption !== index ? 'opacity-50 grayscale' : ''}`}
                                >
                                    <div className="flex gap-3 lg:gap-4 items-start relative z-10">
                                        <span className={`w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center font-black text-xs lg:text-sm transition-all flex-shrink-0 ${selectedOption === index
                                            ? 'bg-primary text-white scale-110'
                                            : 'bg-neutral-text/5 text-neutral-text/40 group-hover:bg-primary/10 group-hover:text-primary'
                                            }`}>
                                            {String.fromCharCode(65 + index)}
                                        </span>
                                        <span className={`font-bold text-sm lg:text-lg leading-snug pt-0.5 transition-colors ${selectedOption === index ? 'text-primary' : 'text-neutral-text group-hover:text-primary'}`}>
                                            {option}
                                        </span>
                                    </div>
                                    <div className={`absolute top-0 right-0 w-2 h-full bg-primary transition-transform origin-right duration-300 ${selectedOption === index ? 'scale-x-100' : 'scale-x-0'}`} />
                                </motion.button>
                            ))}
                        </div>
                    </main>

                    {/* Compact Footer */}
                    <footer className="px-4 lg:px-8 py-3 lg:py-4 border-t-2 border-neutral-text/5 bg-white/50 backdrop-blur-sm flex-shrink-0">
                        <div className="flex items-center gap-3 lg:gap-4 overflow-x-auto">
                            <span className="text-[9px] font-black text-neutral-text/40 uppercase tracking-wider flex-shrink-0 hidden sm:block">Vật phẩm:</span>
                            <ItemButton icon={<Sparkles size={16} />} label="Gia tăng" color="yellow" count={itemInventory.score_boost} onClick={() => handleItemClick('Gia tăng Điểm', 'score_boost', 'yellow')} />
                            <ItemButton icon={<Timer size={16} />} label="Hãn chế" color="yellow" count={itemInventory.time_extend} onClick={() => handleItemClick('Kéo dài Thời gian', 'time_extend', 'yellow')} />
                            <ItemButton icon={<Shield size={16} />} label="Miễn dịch" color="yellow" count={itemInventory.shield} onClick={() => handleItemClick('Khiên Miễn dịch', 'shield', 'yellow')} />
                            <div className="w-px h-8 bg-neutral-text/10" />
                            <ItemButton icon={<Ghost size={16} />} label="Gây nhiễu" color="red" count={itemInventory.confusion} onClick={() => handleItemClick('Nhiễu loạn Phương án', 'confusion', 'red')} />
                            <ItemButton icon={<Zap size={16} />} label="Công kích" color="red" count={itemInventory.time_attack} onClick={() => handleItemClick('Công kích Thời gian', 'time_attack', 'red')} />
                        </div>
                    </footer>
                </div>

                {/* Sidebar - Hidden on mobile */}
                <aside className="hidden lg:flex w-80 flex-col gap-4 p-4 bg-neutral-text/5 border-l-2 border-neutral-text/5 overflow-y-auto flex-shrink-0">
                    <div className="bg-neutral-text text-white p-6 relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 w-24 h-24 pattern-dots opacity-10 text-primary rotate-45" />
                        <div className="relative z-10">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-wider mb-4 block">Bảng xếp hạng</label>
                            <div className="space-y-2">
                                {players.slice(0, 5).map((player, i) => {
                                    const isMe = player.id === currentPlayer?.id;
                                    const playerRank = i + 1;
                                    return isMe ? (
                                        <div key={player.id} className="bg-primary p-4 border-l-4 border-white shadow-xl -mx-2 px-4 relative overflow-hidden">
                                            <div className="absolute inset-0 pattern-dots opacity-20" />
                                            <div className="flex justify-between items-center relative z-10">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-black text-base">#{playerRank}</span>
                                                    <div>
                                                        <p className="font-black text-xs uppercase tracking-wide">{player.name}</p>
                                                        <p className="text-[8px] font-bold text-white/60">ĐANG TRANH TÀI</p>
                                                    </div>
                                                </div>
                                                <span className="font-black text-lg">{player.score}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div key={player.id} className="flex justify-between items-center p-3 border-b border-white/10 hover:bg-white/5 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <span className="font-black text-white/20 text-sm">{playerRank}</span>
                                                <div>
                                                    <p className="font-bold text-[10px]">{player.name}</p>
                                                    <p className="text-[8px] font-black text-white/20">TRỰC TUYẾN</p>
                                                </div>
                                            </div>
                                            <span className="font-black text-sm">{player.score}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Item Notification */}
            <AnimatePresence>
                {activeItem && !showTargeting && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`fixed top-20 right-4 p-4 border-l-8 shadow-2xl z-50 bg-white min-w-[240px] ${activeItem.color === 'yellow' ? 'border-secondary text-secondary' : 'border-primary text-primary'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-2 ${activeItem.color === 'yellow' ? 'bg-secondary/10' : 'bg-primary/10'}`}>
                                {activeItem.color === 'yellow' ? <ShieldCheck size={24} /> : <TargetIcon size={24} />}
                            </div>
                            <div>
                                <p className="text-[8px] font-black uppercase tracking-wider opacity-50">Triển khai</p>
                                <p className="font-black text-sm uppercase tracking-tight leading-tight">{activeItem.label}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Targeting Overlay */}
            <AnimatePresence>
                {showTargeting && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-neutral-text/95 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-4 overflow-y-auto"
                    >
                        <div className="absolute inset-0 pattern-dots opacity-10 text-primary" />

                        <button
                            onClick={() => setShowTargeting(false)}
                            className="absolute top-4 right-4 text-white/40 hover:text-primary transition-all p-2 border-2 border-white/10 hover:border-primary"
                        >
                            <X size={24} />
                        </button>

                        <div className="text-center mb-8 relative">
                            <div className="w-16 h-16 bg-primary text-white flex items-center justify-center mx-auto mb-4 shadow-[0_0_40px_rgba(153,27,27,0.4)] relative">
                                <TargetIcon size={32} />
                                <div className="absolute -inset-2 border border-primary/40 animate-ping opacity-20" />
                            </div>
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-wider mb-1 block">Chỉ định Đối tượng</label>
                            <h3 className="text-3xl lg:text-4xl font-serif font-black text-white uppercase tracking-tighter">THỰC THI CÔNG KÍCH</h3>
                            <p className="text-white/60 font-medium mt-2 text-sm">Hành động: <span className="text-primary font-bold uppercase">{activeItem?.label}</span></p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl w-full">
                            {players.filter(p => p.id !== currentPlayer?.id).map((player) => (
                                <motion.button
                                    key={player.id}
                                    whileHover={{ y: -5 }}
                                    onClick={() => confirmTarget(player.id, player.name)}
                                    className="bg-white/5 border-2 border-white/10 p-6 hover:border-primary hover:bg-white/10 transition-all group relative overflow-hidden"
                                >
                                    <div className="relative z-10 flex flex-col items-center gap-4">
                                        <div className="w-12 h-12 bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                                            <User size={24} />
                                        </div>
                                        <div className="text-center">
                                            <span className="text-white font-black text-sm block tracking-tight">{player.name.toUpperCase()}</span>
                                            <span className="text-[8px] text-white/30 font-black uppercase tracking-wider mt-1 group-hover:text-primary transition-colors">Điểm: {player.score}</span>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary transition-all" />
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Reward Notification */}
            <AnimatePresence>
                {showRewardNotification && lastRewardedItem && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 50 }}
                        className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-gradient-to-r from-secondary to-primary text-white px-8 py-4 shadow-2xl z-50 border-2 border-white/20"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 flex items-center justify-center animate-bounce">
                                <Sparkles size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-wider opacity-80">Phần thưởng!</p>
                                <p className="font-black text-lg uppercase tracking-tight">+1 {lastRewardedItem.replace('_', ' ')}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ItemButton: React.FC<{ icon: React.ReactNode, label: string, color: 'yellow' | 'red', count?: number, onClick?: () => void }> = ({ icon, label, color, count = 0, onClick }) => {
    const isDisabled = count <= 0;

    return (
        <button
            onClick={onClick}
            disabled={isDisabled}
            className={`flex flex-col items-center gap-1 lg:gap-2 group cursor-pointer relative flex-shrink-0 ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
            <div className={`w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center transition-all duration-300 border-2 shadow-sm relative ${color === 'yellow'
                ? 'bg-neutral-bg text-secondary border-secondary/20 hover:bg-secondary hover:text-white hover:border-secondary hover:shadow-secondary/20 hover:shadow-lg'
                : 'bg-neutral-bg text-primary border-primary/20 hover:bg-primary hover:text-white hover:border-primary hover:shadow-primary/20 hover:shadow-lg'
                } ${isDisabled ? 'grayscale' : ''}`}>
                {icon}
                {/* Count Badge */}
                {count > 0 && (
                    <div className={`absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[10px] font-black ${color === 'yellow' ? 'bg-secondary' : 'bg-primary'} text-white rounded-full border-2 border-white shadow-lg`}>
                        {count}
                    </div>
                )}
            </div>
            <span className={`text-[8px] lg:text-[9px] font-black uppercase tracking-wider transition-colors whitespace-nowrap ${isDisabled ? 'text-neutral-text/30' : 'text-neutral-muted group-hover:text-primary'}`}>{label}</span>
        </button>
    );
};
