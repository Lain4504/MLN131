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
        <div className="h-screen bg-neutral-bg relative overflow-hidden flex flex-col perspective-3d">
            <div className="absolute inset-0 pattern-dots opacity-[0.06] text-primary" />
            
            {/* Vietnam Flag Pattern Background */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,205,0,0.08) 40px, rgba(255,205,0,0.08) 41px)`,
                backgroundSize: '80px 80px'
            }} />

            <div className="absolute -bottom-20 -left-20 w-96 h-96 opacity-[0.04] pointer-events-none grayscale contrast-125 rotate-12 hidden lg:block rotate-3d-hover">
                <img src="/vietnam_academic_motif_lotus.png" alt="Lotus Motif" className="w-full h-full object-contain" />
            </div>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10">
                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* 3D Pixel Header */}
                    <header className="flex justify-between items-center px-4 lg:px-8 py-3 lg:py-4 bg-white/90 backdrop-blur-sm flex-shrink-0 relative pixel-border-red" style={{
                        borderBottom: '4px solid #DC143C',
                        boxShadow: '0 6px 0 #C8102E, 0 12px 0 rgba(200, 16, 46, 0.2)',
                        transform: 'perspective(1000px) rotateX(0deg)'
                    }}>
                        <div className="flex gap-4 lg:gap-8 items-center">
                            <div className="flex items-center gap-2">
                                {/* 3D Pixel Avatar */}
                                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary flex items-center justify-center text-white font-black text-sm lg:text-base pixel-border-red animate-float-3d" style={{
                                    boxShadow: '0 4px 0 #C8102E, 0 8px 0 rgba(200, 16, 46, 0.5)',
                                    transform: 'perspective(200px) rotateX(5deg)'
                                }}>
                                    {currentPlayer?.name[0].toUpperCase() || 'P'}
                                </div>
                                <div className="hidden sm:block">
                                    <p className="font-bold text-xs lg:text-sm leading-none uppercase tracking-tight" style={{ textShadow: '1px 1px 0px rgba(0,0,0,0.1)' }}>
                                        {currentPlayer?.name || 'Cán bộ'}
                                    </p>
                                    <p className="text-[9px] lg:text-[10px] text-primary font-black uppercase tracking-wider mt-0.5 pixel-badge" style={{
                                        borderColor: '#DC143C',
                                        backgroundColor: '#FFF8E1',
                                        padding: '1px 4px',
                                        display: 'inline-block'
                                    }}>
                                        {currentRoom?.room_code || 'MLN131'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-baseline gap-1 pixel-badge" style={{
                                    borderColor: '#FFCD00',
                                    backgroundColor: '#FFF8E1',
                                    padding: '4px 8px'
                                }}>
                                    <Trophy className="text-secondary" size={14} fill="#FFCD00" />
                                    <span className="font-black text-xl lg:text-2xl text-neutral-text leading-none" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>
                                        {score.toLocaleString()}
                                    </span>
                                </div>

                                <div className="hidden md:flex items-baseline gap-1 border-l-3 border-neutral-text/10 pl-4 pixel-badge" style={{
                                    borderLeft: '3px solid #DC143C',
                                    borderColor: '#DC143C',
                                    backgroundColor: '#FFF8E1',
                                    padding: '2px 6px'
                                }}>
                                    <span className="text-[10px] font-black text-neutral-text/40 uppercase">Hạng</span>
                                    <span className="font-black text-lg text-primary">{rank}</span>
                                    <span className="text-xs font-bold text-neutral-muted">/{players.length}</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-32 lg:w-48">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[9px] lg:text-[10px] font-black text-neutral-text/40 uppercase">Thời gian</span>
                                <span className={`text-xs font-mono font-black pixel-badge ${timeLeft < 10 ? 'text-primary animate-pixel-shake' : 'text-neutral-text'}`} style={{
                                    borderColor: timeLeft < 10 ? '#DC143C' : '#666666',
                                    backgroundColor: timeLeft < 10 ? '#FFF8E1' : 'transparent',
                                    padding: '2px 4px'
                                }}>
                                    {timeLeft}s
                                </span>
                            </div>
                            {/* 3D Pixel Progress Bar */}
                            <div className="w-full h-3 bg-neutral-text/5 relative overflow-hidden pixel-border-red" style={{
                                border: '2px solid #DC143C',
                                boxShadow: 'inset 2px 2px 0px rgba(0,0,0,0.1)'
                            }}>
                                <motion.div
                                    className={`h-full ${timeLeft < 10 ? 'bg-primary' : 'bg-secondary'} transition-colors`}
                                    initial={{ width: '100%' }}
                                    animate={{ width: `${(timeLeft / 30) * 100}%` }}
                                    transition={{ duration: 1, ease: "linear" }}
                                    style={{
                                        boxShadow: timeLeft < 10 
                                            ? 'inset 0 -2px 0 #C8102E, 0 2px 0 rgba(255,255,255,0.3)' 
                                            : 'inset 0 -2px 0 #FFB700, 0 2px 0 rgba(255,255,255,0.3)'
                                    }}
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
                                <div className="w-4 h-1 bg-primary pixel-border-red" style={{ boxShadow: '2px 2px 0px #C8102E' }} />
                                <span className="text-[9px] font-black text-primary uppercase tracking-wider pixel-badge" style={{
                                    borderColor: '#DC143C',
                                    backgroundColor: '#FFF8E1',
                                    padding: '2px 6px'
                                }}>
                                    Câu {currentQuestionIndex + 1}
                                </span>
                            </div>
                            <h2 className="text-xl lg:text-3xl font-serif font-black text-neutral-text leading-tight relative inline-block" style={{
                                textShadow: '2px 2px 0px rgba(220, 20, 60, 0.2), 4px 4px 0px rgba(220, 20, 60, 0.1)',
                                transform: 'perspective(1000px) rotateX(2deg)'
                            }}>
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
                                    className={`text-left p-4 lg:p-5 transition-all duration-300 group relative ${selectedOption === index
                                        ? 'pixel-border-red bg-primary/[0.05] -translate-y-1'
                                        : 'pixel-border-red bg-white hover:-translate-y-0.5'
                                        } ${selectedOption !== null && selectedOption !== index ? 'opacity-40 grayscale' : ''}`}
                                    style={selectedOption === index ? {
                                        border: '3px solid #DC143C',
                                        boxShadow: '0 6px 0 #C8102E, 0 12px 0 rgba(200, 16, 46, 0.4)',
                                        transform: 'perspective(500px) rotateX(5deg) translateY(-4px)'
                                    } : {
                                        border: '3px solid #DC143C',
                                        boxShadow: '0 4px 0 #C8102E',
                                        transform: 'perspective(500px) rotateX(0deg)'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (selectedOption === null) {
                                            e.currentTarget.style.transform = 'perspective(500px) rotateX(3deg) translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 6px 0 #C8102E, 0 12px 0 rgba(200, 16, 46, 0.3)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (selectedOption !== index) {
                                            e.currentTarget.style.transform = 'perspective(500px) rotateX(0deg)';
                                            e.currentTarget.style.boxShadow = '0 4px 0 #C8102E';
                                        }
                                    }}
                                >
                                    <div className="flex gap-3 lg:gap-4 items-start relative z-10">
                                        <span className={`w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center font-black text-xs lg:text-sm transition-all flex-shrink-0 pixel-border-red ${selectedOption === index
                                            ? 'bg-primary text-white'
                                            : 'bg-neutral-text/5 text-neutral-text/40 group-hover:bg-primary/10 group-hover:text-primary'
                                            }`}
                                            style={selectedOption === index ? {
                                                border: '2px solid #C8102E',
                                                boxShadow: '0 3px 0 #A00E25, inset 0 -2px 0 rgba(0,0,0,0.2)',
                                                transform: 'scale(1.1)'
                                            } : {
                                                border: '2px solid #DC143C',
                                                boxShadow: '0 2px 0 #C8102E'
                                            }}
                                        >
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

            {/* Pixel Item Notification */}
            <AnimatePresence>
                {activeItem && !showTargeting && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className={`pixel-notification fixed top-20 right-4 z-50 ${activeItem.color === 'yellow' ? 'pixel-notification-success' : 'pixel-notification-error'}`}
                        style={{
                            transform: 'perspective(500px) rotateY(-5deg)'
                        }}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 pixel-border-${activeItem.color === 'yellow' ? 'yellow' : 'red'}`} style={{
                                border: `3px solid ${activeItem.color === 'yellow' ? '#FFCD00' : '#DC143C'}`,
                                backgroundColor: activeItem.color === 'yellow' ? 'rgba(255, 205, 0, 0.1)' : 'rgba(220, 20, 60, 0.1)',
                                boxShadow: `0 3px 0 ${activeItem.color === 'yellow' ? '#FFB700' : '#C8102E'}`
                            }}>
                                {activeItem.color === 'yellow' ? <ShieldCheck size={24} fill="currentColor" /> : <TargetIcon size={24} fill="currentColor" />}
                            </div>
                            <div>
                                <p className="text-[8px] font-black uppercase tracking-wider opacity-50" style={{ textShadow: '1px 1px 0px rgba(0,0,0,0.1)' }}>
                                    Triển khai
                                </p>
                                <p className="font-black text-sm uppercase tracking-tight leading-tight" style={{ textShadow: '1px 1px 0px rgba(0,0,0,0.1)' }}>
                                    {activeItem.label}
                                </p>
                            </div>
                        </div>
                        {/* Pixel Corner Accents */}
                        <div className={`pixel-corner-accent pixel-corner-accent-tl`} style={{ color: activeItem.color === 'yellow' ? '#FFCD00' : '#DC143C' }} />
                        <div className={`pixel-corner-accent pixel-corner-accent-br`} style={{ color: activeItem.color === 'yellow' ? '#FFCD00' : '#DC143C' }} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Pixel Targeting Overlay */}
            <AnimatePresence>
                {showTargeting && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 overflow-y-auto perspective-3d"
                        style={{
                            background: 'rgba(26, 26, 26, 0.95)',
                            backdropFilter: 'blur(8px)'
                        }}
                    >
                        <div className="absolute inset-0 pattern-dots opacity-10 text-primary" />
                        <div className="pixel-star-bg" style={{ opacity: 0.15 }} />

                        <button
                            onClick={() => setShowTargeting(false)}
                            className="absolute top-4 right-4 text-white/40 hover:text-primary transition-all pixel-border-red z-20"
                            style={{
                                padding: '8px',
                                border: '3px solid rgba(220, 20, 60, 0.3)',
                                backgroundColor: 'rgba(220, 20, 60, 0.1)',
                                boxShadow: '0 4px 0 rgba(200, 16, 46, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#DC143C';
                                e.currentTarget.style.backgroundColor = 'rgba(220, 20, 60, 0.2)';
                                e.currentTarget.style.boxShadow = '0 6px 0 #C8102E';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(220, 20, 60, 0.3)';
                                e.currentTarget.style.backgroundColor = 'rgba(220, 20, 60, 0.1)';
                                e.currentTarget.style.boxShadow = '0 4px 0 rgba(200, 16, 46, 0.3)';
                            }}
                        >
                            <X size={24} />
                        </button>

                        <div className="text-center mb-8 relative z-10">
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                className="w-16 h-16 bg-primary text-white flex items-center justify-center mx-auto mb-4 pixel-border-red relative"
                                style={{
                                    boxShadow: '0 8px 0 #C8102E, 0 16px 0 rgba(200, 16, 46, 0.5), 0 0 40px rgba(220, 20, 60, 0.6)',
                                    transform: 'perspective(500px) rotateX(10deg)'
                                }}
                            >
                                <TargetIcon size={32} fill="currentColor" />
                                <motion.div 
                                    className="absolute -inset-4 border-2 border-primary"
                                    animate={{ 
                                        scale: [1, 1.2, 1],
                                        opacity: [0.5, 0.2, 0.5]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    style={{ borderRadius: 0 }}
                                />
                            </motion.div>
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-wider mb-1 block" style={{ textShadow: '1px 1px 0px rgba(0,0,0,0.5)' }}>
                                Chỉ định Đối tượng
                            </label>
                            <h3 className="text-3xl lg:text-4xl font-serif font-black text-white uppercase tracking-tighter relative inline-block mb-2" style={{
                                textShadow: '3px 3px 0px #DC143C, 6px 6px 0px rgba(220, 20, 60, 0.5)',
                                transform: 'perspective(1000px) rotateX(5deg)'
                            }}>
                                THỰC THI CÔNG KÍCH
                            </h3>
                            <p className="text-white/60 font-medium mt-2 text-sm">
                                Hành động: <span className="text-primary font-bold uppercase pixel-badge" style={{
                                    borderColor: '#DC143C',
                                    backgroundColor: 'rgba(220, 20, 60, 0.2)',
                                    padding: '2px 8px',
                                    marginLeft: '8px'
                                }}>{activeItem?.label}</span>
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl w-full relative z-10">
                            {players.filter(p => p.id !== currentPlayer?.id).map((player, index) => (
                                <motion.button
                                    key={player.id}
                                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -8, scale: 1.05 }}
                                    whileTap={{ y: -4, scale: 0.98 }}
                                    onClick={() => confirmTarget(player.id, player.name)}
                                    className="relative overflow-hidden pixel-border-red"
                                    style={{
                                        background: 'rgba(255, 248, 225, 0.05)',
                                        border: '3px solid rgba(220, 20, 60, 0.3)',
                                        padding: '24px',
                                        boxShadow: '0 4px 0 rgba(200, 16, 46, 0.3)',
                                        transform: 'perspective(500px) rotateX(0deg)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = '#DC143C';
                                        e.currentTarget.style.background = 'rgba(255, 248, 225, 0.1)';
                                        e.currentTarget.style.boxShadow = '0 6px 0 #C8102E, 0 12px 0 rgba(200, 16, 46, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'rgba(220, 20, 60, 0.3)';
                                        e.currentTarget.style.background = 'rgba(255, 248, 225, 0.05)';
                                        e.currentTarget.style.boxShadow = '0 4px 0 rgba(200, 16, 46, 0.3)';
                                    }}
                                >
                                    <div className="relative z-10 flex flex-col items-center gap-4">
                                        <div className="w-14 h-14 bg-primary/20 pixel-border-red flex items-center justify-center text-white/60 transition-all" style={{
                                            border: '3px solid rgba(220, 20, 60, 0.5)',
                                            boxShadow: 'inset 2px 2px 0 rgba(0,0,0,0.2), 0 3px 0 rgba(200, 16, 46, 0.3)'
                                        }}>
                                            <User size={28} fill="currentColor" />
                                        </div>
                                        <div className="text-center">
                                            <span className="text-white font-black text-sm block tracking-tight" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>
                                                {player.name.toUpperCase()}
                                            </span>
                                            <span className="text-[8px] text-white/30 font-black uppercase tracking-wider mt-1 pixel-badge inline-block" style={{
                                                borderColor: '#FFCD00',
                                                backgroundColor: 'rgba(255, 205, 0, 0.1)',
                                                padding: '2px 6px',
                                                marginTop: '4px'
                                            }}>
                                                Điểm: {player.score}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Pixel Corner Accents */}
                                    <div className="pixel-corner-accent pixel-corner-accent-tl absolute" style={{ 
                                        color: 'rgba(220, 20, 60, 0.5)',
                                        top: '-6px',
                                        left: '-6px'
                                    }} />
                                    <div className="pixel-corner-accent pixel-corner-accent-br absolute" style={{ 
                                        color: 'rgba(220, 20, 60, 0.5)',
                                        bottom: '-6px',
                                        right: '-6px'
                                    }} />
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Pixel Reward Notification with Particles */}
            <AnimatePresence>
                {showRewardNotification && lastRewardedItem && (
                    <>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.5, y: 50 }}
                            className="pixel-notification pixel-notification-success fixed bottom-20 left-1/2 -translate-x-1/2 z-50"
                            style={{
                                background: 'linear-gradient(to bottom, #FFCD00, #FFB700)',
                                borderColor: '#FFCD00',
                                color: '#1A1A1A',
                                transform: 'perspective(500px) rotateX(5deg)'
                            }}
                        >
                            <div className="flex items-center gap-4 relative">
                                <div className="w-12 h-12 bg-white/30 pixel-border-yellow flex items-center justify-center" style={{
                                    boxShadow: '0 3px 0 #E6A500, inset 0 2px 0 rgba(255,255,255,0.5)'
                                }}>
                                    <Sparkles size={24} fill="currentColor" className="animate-bounce" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-wider opacity-80" style={{ textShadow: '1px 1px 0px rgba(255,255,255,0.5)' }}>
                                        Phần thưởng!
                                    </p>
                                    <p className="font-black text-lg uppercase tracking-tight" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.2)' }}>
                                        +1 {lastRewardedItem.replace('_', ' ')}
                                    </p>
                                </div>
                                {/* Pixel Corner Accents */}
                                <div className="pixel-corner-accent pixel-corner-accent-tl" style={{ color: '#FFCD00' }} />
                                <div className="pixel-corner-accent pixel-corner-accent-br" style={{ color: '#FFCD00' }} />
                            </div>
                        </motion.div>
                        
                        {/* Pixel Particles */}
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="pixel-particle"
                                initial={{ 
                                    opacity: 1,
                                    x: '50%',
                                    y: 'calc(100vh - 80px)',
                                    rotate: 0
                                }}
                                animate={{ 
                                    opacity: 0,
                                    x: `${50 + (Math.random() - 0.5) * 200}%`,
                                    y: 'calc(100vh - 180px)',
                                    rotate: 360
                                }}
                                transition={{ 
                                    duration: 1 + Math.random(),
                                    delay: i * 0.1,
                                    ease: "easeOut"
                                }}
                                style={{
                                    left: '50%',
                                    bottom: '80px'
                                }}
                            />
                        ))}
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

const ItemButton: React.FC<{ icon: React.ReactNode, label: string, color: 'yellow' | 'red', count?: number, onClick?: () => void }> = ({ icon, label, color, count = 0, onClick }) => {
    const isDisabled = count <= 0;
    const borderColor = color === 'yellow' ? '#FFCD00' : '#DC143C';
    const darkBorderColor = color === 'yellow' ? '#FFB700' : '#C8102E';
    const shadowColor = color === 'yellow' ? 'rgba(255, 183, 0, 0.5)' : 'rgba(200, 16, 46, 0.5)';

    return (
        <button
            onClick={onClick}
            disabled={isDisabled}
            className={`flex flex-col items-center gap-1 lg:gap-2 group cursor-pointer relative flex-shrink-0 perspective-3d ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
            style={{
                transform: 'perspective(200px) rotateX(0deg)',
                transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
                if (!isDisabled) {
                    e.currentTarget.style.transform = 'perspective(200px) rotateX(5deg) translateY(-4px)';
                }
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'perspective(200px) rotateX(0deg) translateY(0px)';
            }}
            onMouseDown={(e) => {
                if (!isDisabled) {
                    e.currentTarget.style.transform = 'perspective(200px) rotateX(0deg) translateY(2px)';
                }
            }}
            onMouseUp={(e) => {
                if (!isDisabled) {
                    e.currentTarget.style.transform = 'perspective(200px) rotateX(5deg) translateY(-4px)';
                }
            }}
        >
            <div 
                className={`w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center transition-all duration-300 relative ${isDisabled ? 'grayscale' : ''}`}
                style={{
                    border: `3px solid ${borderColor}`,
                    backgroundColor: color === 'yellow' ? '#FFF8E1' : '#FFF8E1',
                    color: isDisabled ? '#999999' : (color === 'yellow' ? '#FFCD00' : '#DC143C'),
                    boxShadow: isDisabled 
                        ? `0 2px 0 ${darkBorderColor}`
                        : `0 4px 0 ${darkBorderColor}, 0 8px 0 ${shadowColor}`,
                    transform: 'perspective(200px) rotateX(0deg)'
                }}
            >
                {icon}
                {/* 3D Pixel Count Badge */}
                {count > 0 && (
                    <div 
                        className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center text-[10px] font-black text-white"
                        style={{
                            backgroundColor: color === 'yellow' ? '#FFCD00' : '#DC143C',
                            border: `2px solid ${darkBorderColor}`,
                            boxShadow: `0 3px 0 ${darkBorderColor}, 0 6px 0 ${shadowColor}, 0 0 0 2px white`,
                            clipPath: 'polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%)'
                        }}
                    >
                        {count}
                    </div>
                )}
            </div>
            <span 
                className={`text-[8px] lg:text-[9px] font-black uppercase tracking-wider transition-colors whitespace-nowrap ${isDisabled ? 'text-neutral-text/30' : 'text-neutral-muted group-hover:text-primary'}`}
                style={{
                    textShadow: isDisabled ? 'none' : '1px 1px 0px rgba(0,0,0,0.1)'
                }}
            >
                {label}
            </span>
        </button>
    );
};
