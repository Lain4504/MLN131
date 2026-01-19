import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { gameService } from '../lib/gameService';
import { QuizScreen } from './QuizScreen';

export const RoomPage: React.FC = () => {
    const { roomCode } = useParams<{ roomCode: string }>();
    const navigate = useNavigate();
    const { status, currentRoom, setStatus } = useGameStore();

    // Subscribe to room updates to sync status
    useEffect(() => {
        if (!currentRoom?.id) return;

        console.log('RoomPage: Setting up room subscription for status sync, room:', currentRoom.id, 'current status:', status);

        const channel = gameService.subscribeToRoom(currentRoom.id, (updatedRoom) => {
            console.log('RoomPage: Room updated via subscription', {
                roomId: updatedRoom.id,
                newStatus: updatedRoom.status,
                currentStatus: status
            });

            // Sync status from database
            setStatus(updatedRoom.status);

            // Navigate to leaderboard when game finishes
            if (updatedRoom.status === 'finished') {
                console.log('RoomPage: Game finished! Navigating to leaderboard:', updatedRoom.id);
                navigate(`/leaderboard/${updatedRoom.id}`, { replace: true });
            }
        });

        return () => {
            console.log('RoomPage: Cleaning up room subscription');
            channel.unsubscribe();
        };
    }, [currentRoom?.id, setStatus, navigate, status]);

    // Check initial status and navigate if already finished
    useEffect(() => {
        if (status === 'finished' && currentRoom?.id) {
            console.log('RoomPage: Status is already finished, navigating to leaderboard:', currentRoom.id);
            navigate(`/leaderboard/${currentRoom.id}`, { replace: true });
        }
    }, [status, currentRoom?.id, navigate]);

    // Fallback: Poll room status every 2 seconds to check if game finished
    useEffect(() => {
        if (!currentRoom?.id) return;

        const pollInterval = setInterval(async () => {
            try {
                const rooms = await gameService.getRooms();
                const currentRoomData = rooms.find(r => r.id === currentRoom.id);
                if (currentRoomData && currentRoomData.status === 'finished') {
                    console.log('RoomPage: Poll detected game finished, navigating to leaderboard');
                    setStatus('finished');
                    navigate(`/leaderboard/${currentRoom.id}`, { replace: true });
                }
            } catch (err) {
                console.error('RoomPage: Poll error', err);
            }
        }, 2000);

        return () => {
            clearInterval(pollInterval);
        };
    }, [currentRoom?.id, setStatus, navigate]);

    // Render based on game status
    switch (status) {
        case 'waiting':
            return (
                <div className="min-h-screen flex items-center justify-center relative overflow-hidden perspective-3d page-transition" style={{ backgroundColor: 'transparent' }}>
                    {/* Enhanced Background */}
                    <div className="absolute inset-0 animated-gradient-bg" />
                    <div className="absolute inset-0 pattern-dots opacity-[0.08] text-primary" />
                    <div className="star-field" />
                    
                    {/* Floating Particles */}
                    {[...Array(10)].map((_, i) => (
                        <div
                            key={i}
                            className="floating-particle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 20}s`,
                                animationDuration: `${15 + Math.random() * 10}s`
                            }}
                        />
                    ))}
                    
                    <div className="text-center space-y-6 relative z-10">
                        {/* Premium Spinner */}
                        <div className="premium-spinner mx-auto mb-4" />
                        
                        {/* Enhanced Pixel Dots Loading */}
                        <div className="pixel-dots-loading mx-auto mb-4">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <h2 className="text-2xl lg:text-3xl font-black text-neutral-text uppercase premium-badge text-glow-red" style={{
                                borderColor: '#DC143C',
                                backgroundColor: '#FFF8E1',
                                padding: '12px 24px',
                                textShadow: '2px 2px 0px rgba(220, 20, 60, 0.3), 0 0 20px rgba(220, 20, 60, 0.2)'
                            }}>
                                Đang chờ chủ phòng bắt đầu...
                            </h2>
                            <div className="space-y-2">
                                <p className="text-neutral-muted font-bold">
                                    Mã phòng: <span className="font-black text-primary pixel-badge" style={{
                                        borderColor: '#FFCD00',
                                        backgroundColor: '#FFF8E1',
                                        padding: '4px 12px',
                                        marginLeft: '8px'
                                    }}>{roomCode}</span>
                                </p>
                                <p className="text-neutral-muted text-sm">Vui lòng đợi trong giây lát</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            );

        case 'playing':
            return <QuizScreen />;

        case 'finished':
            // This case shouldn't render because we navigate away
            return (
                <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'transparent' }}>
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                        <h2 className="text-2xl font-bold text-neutral-text">Đang chuyển trang...</h2>
                    </div>
                </div>
            );

        default:
            return (
                <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'transparent' }}>
                    <div className="text-center space-y-4">
                        <h2 className="text-2xl font-bold text-neutral-text">Đang tải...</h2>
                        <p className="text-neutral-muted">Vui lòng đợi</p>
                    </div>
                </div>
            );
    }
};
