import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
                <div className="min-h-screen flex items-center justify-center bg-neutral-bg">
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                        <h2 className="text-2xl font-bold text-neutral-text">Đang chờ chủ phòng bắt đầu...</h2>
                        <p className="text-neutral-muted">Mã phòng: <span className="font-bold text-primary">{roomCode}</span></p>
                        <p className="text-neutral-muted">Vui lòng đợi trong giây lát</p>
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
