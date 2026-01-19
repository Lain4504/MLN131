import { Routes, Route, Navigate } from 'react-router-dom';
import { EntryScreen } from '../pages/EntryScreen';
import { IntroScreen } from '../pages/IntroScreen';
import { AdminDashboard } from '../pages/AdminDashboard';
import { RoomPage } from '../pages/RoomPage';
import { AdminLogin } from '../pages/AdminLogin';
import { RoomManagement } from '../pages/admin/RoomManagement';
import { QuestionManagement } from '../pages/admin/QuestionManagement';
import { LeaderboardScreen } from '../pages/LeaderboardScreen';
import { useAdminStore } from '../store/useAdminStore';

export const AppRoutes = () => {
    const { isAuthenticated } = useAdminStore();

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<IntroScreen />} />
            <Route path="/entry" element={<EntryScreen />} />
            <Route path="/room/:roomCode" element={<RoomPage />} />
            <Route path="/leaderboard/:roomId" element={<LeaderboardScreen />} />

            {/* Admin Routes */}
            <Route
                path="/admin/login"
                element={isAuthenticated ? <Navigate to="/admin" replace /> : <AdminLogin />}
            />
            <Route
                path="/admin"
                element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/admin/login" replace />}
            />
            <Route
                path="/admin/rooms/:roomId"
                element={isAuthenticated ? <RoomManagement /> : <Navigate to="/admin/login" replace />}
            />
            <Route
                path="/admin/questions"
                element={isAuthenticated ? <QuestionManagement /> : <Navigate to="/admin/login" replace />}
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};
