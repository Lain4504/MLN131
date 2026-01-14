import React from 'react';
import { useParams } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { QuizScreen } from './QuizScreen';
import { LeaderboardScreen } from './LeaderboardScreen';

export const RoomPage: React.FC = () => {
    const { roomCode } = useParams<{ roomCode: string }>();
    const { status } = useGameStore();

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
            return <LeaderboardScreen />;

        default:
            return (
                <div className="min-h-screen flex items-center justify-center bg-neutral-bg">
                    <div className="text-center space-y-4">
                        <h2 className="text-2xl font-bold text-neutral-text">Phòng không tồn tại</h2>
                        <p className="text-neutral-muted">Vui lòng kiểm tra lại mã phòng</p>
                        <a href="/" className="btn-primary inline-flex items-center gap-2">
                            Quay lại trang chủ
                        </a>
                    </div>
                </div>
            );
    }
};
