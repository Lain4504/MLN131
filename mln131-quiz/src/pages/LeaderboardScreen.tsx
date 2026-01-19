import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, User, ArrowRight, Crown, Medal, Award, TrendingUp, Sparkles } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { gameService } from '../lib/gameService';
import type { Player } from '../lib/gameService';

export const LeaderboardScreen: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const navigate = useNavigate();
    const { currentPlayer } = useGameStore();
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            if (!roomId) return;

            try {
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
            <div className="min-h-screen flex items-center justify-center relative overflow-hidden perspective-3d" style={{ backgroundColor: 'transparent' }}>
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
        <div className="min-h-screen w-full relative overflow-hidden perspective-3d page-transition" style={{ backgroundColor: 'transparent' }}>
            {/* Enhanced Background - Full Screen */}
            <div className="fixed inset-0 animated-gradient-bg" />
            <div className="fixed inset-0 pattern-dots opacity-[0.08] text-primary" />
            <div className="fixed inset-0 star-field" />
            
            {/* Floating Particles */}
            {[...Array(8)].map((_, i) => (
                <div
                    key={i}
                    className="fixed floating-particle"
                    style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 20}s`,
                        animationDuration: `${15 + Math.random() * 10}s`
                    }}
                />
            ))}

            {/* Content Container */}
            <div className="relative z-10 py-16 px-6 flex flex-col items-center max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full"
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
                    <h1 className="text-6xl font-serif font-black text-neutral-text tracking-tighter leading-tight uppercase relative inline-block text-glow-red" style={{
                        textShadow: '3px 3px 0px #DC143C, 6px 6px 0px rgba(220, 20, 60, 0.4), 0 0 40px rgba(220, 20, 60, 0.3)',
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

                {/* Leaderboard Table */}
                <div className="premium-card !p-0 overflow-hidden" style={{
                    border: '4px solid #DC143C',
                    boxShadow: '0 12px 0 #C8102E, 0 24px 0 rgba(200, 16, 46, 0.3), 0 0 60px rgba(220, 20, 60, 0.2)',
                    transform: 'perspective(1000px) rotateX(2deg)'
                }}>
                    {/* Table Header */}
                    <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border-b-4 border-primary" style={{
                        borderColor: '#DC143C',
                        boxShadow: 'inset 0 -2px 0 rgba(200, 16, 46, 0.3)'
                    }}>
                        <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                            <div className="col-span-1 text-center">
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Rank</span>
                            </div>
                            <div className="col-span-6">
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Player</span>
                            </div>
                            <div className="col-span-3 text-center">
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Score</span>
                            </div>
                            <div className="col-span-2 text-center">
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Progress</span>
                            </div>
                        </div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y-2" style={{ borderColor: 'rgba(220, 20, 60, 0.1)' }}>
                        <AnimatePresence>
                            {players.map((player, index) => {
                                const maxScore = players.length > 0 ? Math.max(...players.map(p => p.score), 1) : 1;
                                const scorePercentage = (player.score / maxScore) * 100;
                                const isTopThree = index < 3;
                                const isCurrentPlayer = player.id === currentPlayer?.id;
                                
                                return (
                                    <motion.div
                                        key={player.id}
                                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ 
                                            delay: index * 0.08,
                                            type: "spring",
                                            stiffness: 100,
                                            damping: 15
                                        }}
                                        className={`relative overflow-hidden transition-all duration-300 ${
                                            isCurrentPlayer 
                                                ? 'bg-gradient-to-r from-primary/15 via-primary/10 to-transparent' 
                                                : 'hover:bg-gradient-to-r hover:from-neutral-bg/50 hover:via-transparent hover:to-transparent'
                                        }`}
                                        style={isCurrentPlayer ? {
                                            borderLeft: '6px solid #DC143C',
                                            boxShadow: 'inset 4px 0 0 rgba(220, 20, 60, 0.15), 0 2px 8px rgba(220, 20, 60, 0.1)'
                                        } : {}}
                                    >
                                        {/* Shimmer effect for top 3 */}
                                        {isTopThree && (
                                            <div className="absolute inset-0 shimmer opacity-30 pointer-events-none" />
                                        )}

                                        {/* Glow effect for current player */}
                                        {isCurrentPlayer && (
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-transparent pointer-events-none"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: [0, 0.5, 0] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            />
                                        )}

                                        <div className="grid grid-cols-12 gap-4 px-6 py-5 items-center relative z-10">
                                            {/* Rank Column */}
                                            <div className="col-span-1 flex justify-center">
                                                {isTopThree ? (
                                                    <motion.div
                                                        initial={{ scale: 0, rotate: -180 }}
                                                        animate={{ scale: 1, rotate: 0 }}
                                                        transition={{ 
                                                            delay: index * 0.1 + 0.3,
                                                            type: "spring",
                                                            stiffness: 200
                                                        }}
                                                        className={`premium-medal shrink-0 relative ${
                                                            index === 0 ? 'pixel-medal-gold' : 
                                                            index === 1 ? 'pixel-medal-silver' : 
                                                            'pixel-medal-bronze'
                                                        }`}
                                                        style={{
                                                            width: '64px',
                                                            height: '64px',
                                                            fontSize: '28px'
                                                        }}
                                                    >
                                                        {index === 0 && (
                                                            <motion.div
                                                                className="absolute -top-2 -right-2"
                                                                animate={{ rotate: [0, 10, -10, 0] }}
                                                                transition={{ duration: 2, repeat: Infinity }}
                                                            >
                                                                <Sparkles size={16} className="text-secondary" fill="currentColor" />
                                                            </motion.div>
                                                        )}
                                                        {index === 0 ? <Crown size={32} className="text-neutral-text" fill="currentColor" /> :
                                                         index === 1 ? <Medal size={32} className="text-neutral-text" fill="currentColor" /> :
                                                         <Award size={32} className="text-neutral-text" fill="currentColor" />}
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        className="relative"
                                                    >
                                                        <div className="w-12 h-12 flex items-center justify-center font-black text-xl shrink-0 pixel-border-red text-neutral-text relative" style={{
                                                            backgroundColor: isCurrentPlayer ? '#FFF8E1' : '#FFFFFF',
                                                            border: '3px solid #DC143C',
                                                            boxShadow: '0 4px 0 #C8102E'
                                                        }}>
                                                            {index + 1}
                                                        </div>
                                                        {isCurrentPlayer && (
                                                            <motion.div
                                                                className="absolute -inset-1 border-2 border-primary rounded-sm"
                                                                animate={{ opacity: [0.5, 1, 0.5] }}
                                                                transition={{ duration: 1.5, repeat: Infinity }}
                                                            />
                                                        )}
                                                    </motion.div>
                                                )}
                                            </div>

                                            {/* Player Info Column */}
                                            <div className="col-span-6 flex items-center gap-4">
                                                <div className={`w-14 h-14 flex items-center justify-center rounded-sm relative overflow-hidden ${
                                                    isTopThree ? 'pixel-border-yellow' : 'pixel-border-red'
                                                }`} style={{
                                                    backgroundColor: isTopThree ? '#FFF8E1' : '#FFFFFF',
                                                    border: isTopThree ? '3px solid #FFCD00' : '3px solid #DC143C',
                                                    boxShadow: isTopThree 
                                                        ? '0 4px 0 #FFB700' 
                                                        : '0 4px 0 #C8102E'
                                                }}>
                                                    <User size={32} className={isTopThree ? 'text-secondary' : 'text-primary'} />
                                                    {isCurrentPlayer && (
                                                        <div className="absolute inset-0 bg-primary/20 animate-pulse" />
                                                    )}
                                                </div>
                                                <div className="flex-1 flex flex-col gap-1">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className={`font-black text-xl tracking-tight ${
                                                            isCurrentPlayer ? 'text-primary' : 
                                                            isTopThree ? 'text-neutral-text' : 
                                                            'text-neutral-text'
                                                        }`} style={{
                                                            textShadow: isTopThree ? '1px 1px 0px rgba(0,0,0,0.1)' : 'none'
                                                        }}>
                                                            {player.name.toUpperCase()}
                                                        </h3>
                                                        {isCurrentPlayer && (
                                                            <motion.span
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                transition={{ type: "spring", stiffness: 200 }}
                                                                className="bg-primary text-white text-[10px] font-black px-2.5 py-1 uppercase tracking-widest leading-none pixel-border-red"
                                                                style={{
                                                                    boxShadow: '0 2px 0 #C8102E',
                                                                    border: '2px solid #C8102E'
                                                                }}
                                                            >
                                                                You
                                                            </motion.span>
                                                        )}
                                                        {isTopThree && index === 0 && (
                                                            <motion.div
                                                                animate={{ rotate: [0, 10, -10, 0] }}
                                                                transition={{ duration: 2, repeat: Infinity }}
                                                            >
                                                                <TrendingUp size={16} className="text-secondary" />
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] font-black text-neutral-muted uppercase tracking-wider">
                                                            Rank #{index + 1}
                                                        </span>
                                                        {isTopThree && (
                                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 ${
                                                                index === 0 ? 'bg-secondary text-neutral-text' :
                                                                index === 1 ? 'bg-gray-300 text-neutral-text' :
                                                                'bg-orange-400 text-white'
                                                            }`} style={{
                                                                border: index === 0 ? '2px solid #FFB700' :
                                                                        index === 1 ? '2px solid #A0A0A0' :
                                                                        '2px solid #B87333',
                                                                boxShadow: '0 2px 0 currentColor'
                                                            }}>
                                                                {index === 0 ? 'Champion' : index === 1 ? 'Runner-up' : 'Third Place'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Score Column */}
                                            <div className="col-span-3 text-center">
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                                                    className="flex flex-col items-center gap-1"
                                                >
                                                    <div className="flex items-baseline gap-1.5 justify-center">
                                                        <span className={`font-black text-3xl leading-none ${
                                                            isTopThree ? 'text-primary' : 'text-neutral-text'
                                                        }`} style={{
                                                            textShadow: isTopThree ? '2px 2px 0px rgba(220, 20, 60, 0.2)' : 'none'
                                                        }}>
                                                            {player.score.toLocaleString()}
                                                        </span>
                                                        <span className="text-[10px] font-black text-neutral-muted uppercase">pts</span>
                                                    </div>
                                                    {isTopThree && (
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: '100%' }}
                                                            transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                                                            className="h-1 bg-gradient-to-r from-primary to-secondary"
                                                            style={{
                                                                boxShadow: '0 2px 4px rgba(220, 20, 60, 0.3)'
                                                            }}
                                                        />
                                                    )}
                                                </motion.div>
                                            </div>

                                            {/* Progress Column */}
                                            <div className="col-span-2 flex justify-center">
                                                <div className="w-full max-w-[80px]">
                                                    <div className="progress-bar-premium" style={{ height: '12px' }}>
                                                        <motion.div
                                                            className="progress-fill-premium"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${scorePercentage}%` }}
                                                            transition={{ 
                                                                delay: index * 0.1 + 0.3,
                                                                duration: 1,
                                                                ease: "easeOut"
                                                            }}
                                                            style={{
                                                                background: isTopThree
                                                                    ? `linear-gradient(135deg, ${index === 0 ? '#FFCD00' : index === 1 ? '#C0C0C0' : '#CD7F32'} 0%, ${index === 0 ? '#FFD700' : index === 1 ? '#A0A0A0' : '#B87333'} 100%)`
                                                                    : 'linear-gradient(135deg, #DC143C 0%, #E63950 50%, #FF1744 100%)'
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Decorative corner accents for top 3 */}
                                        {isTopThree && (
                                            <>
                                                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary opacity-30" />
                                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary opacity-30" />
                                            </>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Table Footer */}
                    {players.length > 0 && (
                        <div className="bg-gradient-to-r from-primary/10 via-transparent to-primary/10 border-t-2 border-primary/20 px-6 py-3">
                            <div className="flex items-center justify-between text-[10px] font-black text-neutral-muted uppercase tracking-widest">
                                <span>Total Players: {players.length}</span>
                                <span>Highest Score: {Math.max(...players.map(p => p.score)).toLocaleString()} pts</span>
                            </div>
                        </div>
                    )}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 flex justify-center"
                >
                    <button
                        onClick={() => navigate('/entry')}
                        className="btn-primary-enhanced group"
                    >
                        <span>Chơi lại</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
            </motion.div>
            </div>
        </div>
    );
};
