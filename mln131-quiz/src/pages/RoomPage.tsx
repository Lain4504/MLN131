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

        const channel = gameService.subscribeToRoom(currentRoom.id, (updatedRoom) => {
            // Sync status from database
            setStatus(updatedRoom.status);

            // Navigate to leaderboard when game finishes
            if (updatedRoom.status === 'finished') {
                navigate(`/leaderboard/${updatedRoom.id}`, { replace: true });
            }
        });

        return () => {
            channel.unsubscribe();
        };
    }, [currentRoom?.id, setStatus, navigate]);

    // Check initial status and navigate if already finished
    useEffect(() => {
        if (status === 'finished' && currentRoom?.id) {
            navigate(`/leaderboard/${currentRoom.id}`, { replace: true });
        }
    }, [status, currentRoom?.id, navigate]);

    // Render based on game status
    switch (status) {
        case 'waiting':
            return (
                <div className="min-h-screen flex items-center justify-center bg-neutral-bg relative overflow-hidden perspective-3d">
                    {/* Pixel Star Background */}
                    <div className="pixel-star-bg" />
                    
                    <div className="text-center space-y-6 relative z-10">
                        {/* Pixel Spinner */}
                        <div className="pixel-spinner mx-auto mb-4" />
                        
                        {/* Pixel Dots Loading */}
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
                            <h2 className="text-2xl lg:text-3xl font-black text-neutral-text uppercase pixel-badge" style={{
                                borderColor: '#DC143C',
                                backgroundColor: '#FFF8E1',
                                padding: '12px 24px',
                                textShadow: '2px 2px 0px rgba(220, 20, 60, 0.3)'
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
                <div className="min-h-screen flex items-center justify-center bg-neutral-bg">
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                        <h2 className="text-2xl font-bold text-neutral-text">Đang chuyển trang...</h2>
                    </div>
                </div>
            );

        default:
            return (
                <div className="min-h-screen flex items-center justify-center bg-neutral-bg">
                    <div className="text-center space-y-4">
                        <h2 className="text-2xl font-bold text-neutral-text">Đang tải...</h2>
                        <p className="text-neutral-muted">Vui lòng đợi</p>
                    </div>
                </div>
            );
    }
};
