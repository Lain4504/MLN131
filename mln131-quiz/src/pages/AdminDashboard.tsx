import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users, Database, LogOut, Settings, Copy, Check, Trash2, ExternalLink } from 'lucide-react';
import { gameService } from '../lib/gameService';
import { useAdminStore } from '../store/useAdminStore';
import type { Room } from '../lib/gameService';

export const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAdminStore();
    const [activeTab, setActiveTab] = useState<'rooms' | 'questions'>('rooms');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [newRoomCode, setNewRoomCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [copiedRoomId, setCopiedRoomId] = useState<string | null>(null);

    // Fetch rooms
    useEffect(() => {
        fetchRooms();

        // Subscribe to room updates
        const channel = gameService.subscribeToAllRooms((payload) => {
            console.log('Room update:', payload);

            if (payload.eventType === 'INSERT') {
                setRooms(prev => {
                    if (prev.some(r => r.id === payload.new.id)) {
                        return prev;
                    }
                    return [payload.new, ...prev];
                });
            } else if (payload.eventType === 'UPDATE') {
                setRooms(prev => prev.map(r => r.id === payload.new.id ? payload.new : r));
            } else if (payload.eventType === 'DELETE') {
                setRooms(prev => prev.filter(r => r.id !== payload.old.id));
            }
        });

        return () => {
            channel.unsubscribe();
        };
    }, []);

    const fetchRooms = async () => {
        try {
            const data = await gameService.getRooms();
            setRooms(data);
        } catch (err) {
            console.error('Fetch rooms error:', err);
        }
    };

    const handleCreateRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newRoomCode.trim()) return;

        setLoading(true);
        try {
            await gameService.createRoom(newRoomCode.trim());
            setNewRoomCode('');
            setShowCreateModal(false);
        } catch (err: any) {
            console.error('Create room error:', err);
            alert(err.message || 'Có lỗi xảy ra khi tạo phòng');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRoom = async (roomId: string) => {
        if (!confirm('Bạn có chắc muốn xóa phòng này?')) return;

        try {
            await gameService.deleteRoom(roomId);
        } catch (err) {
            console.error('Delete room error:', err);
            alert('Có lỗi xảy ra khi xóa phòng');
        }
    };

    const handleCopyRoomCode = (roomCode: string, roomId: string) => {
        navigator.clipboard.writeText(roomCode);
        setCopiedRoomId(roomId);
        setTimeout(() => setCopiedRoomId(null), 2000);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'waiting': return 'bg-yellow-100 text-yellow-700';
            case 'playing': return 'bg-green-100 text-green-700';
            case 'finished': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'waiting': return 'Chờ';
            case 'playing': return 'Đang chơi';
            case 'finished': return 'Kết thúc';
            default: return status;
        }
    };

    return (
        <div className="min-h-screen bg-neutral-bg flex">
            {/* Sidebar */}
            <aside className="w-80 bg-neutral-text text-white flex flex-col">
                {/* Header */}
                <div className="p-8 border-b border-white/10">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-primary flex items-center justify-center">
                            <Settings size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black uppercase tracking-tight">Admin</h1>
                            <p className="text-[10px] text-white/40 font-black uppercase tracking-wider">Dashboard</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4">
                    <button
                        onClick={() => setActiveTab('rooms')}
                        className={`w-full flex items-center gap-3 px-4 py-3 mb-2 transition-colors ${activeTab === 'rooms'
                            ? 'bg-primary text-white'
                            : 'text-white/60 hover:bg-white/5'
                            }`}
                    >
                        <Users size={18} />
                        <span className="font-bold text-sm uppercase tracking-wide">Phòng Chơi</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('questions')}
                        className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${activeTab === 'questions'
                            ? 'bg-primary text-white'
                            : 'text-white/60 hover:bg-white/5'
                            }`}
                    >
                        <Database size={18} />
                        <span className="font-bold text-sm uppercase tracking-wide">Câu Hỏi</span>
                    </button>
                </nav>

                {/* Footer */}
                <div className="p-8 border-t border-white/5 bg-black/20">
                    <div className="flex flex-col gap-1 mb-4">
                        <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Vai trò</span>
                        <span className="text-xs font-bold uppercase">Quản trị viên</span>
                    </div>
                    <button
                        onClick={() => {
                            logout();
                            navigate('/admin/login');
                        }}
                        className="flex items-center gap-3 text-[10px] font-black text-gray-400 hover:text-primary transition-colors uppercase tracking-[0.2em] group w-full"
                    >
                        <LogOut size={14} className="group-hover:translate-x-1 transition-transform" /> Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                {/* Rooms Tab */}
                {activeTab === 'rooms' && (
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-4xl font-black text-neutral-text uppercase tracking-tight">Phòng Chơi</h2>
                                <p className="text-sm text-neutral-muted font-bold mt-1">Tổng số: {rooms.length} phòng</p>
                            </div>
                            <button onClick={() => setShowCreateModal(true)} className="btn-primary">
                                <Plus size={20} />
                                <span>Tạo Phòng</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {rooms.map((room) => (
                                <motion.div
                                    key={room.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="glass-card p-6 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-2xl font-black text-neutral-text mb-1">{room.room_code}</h3>
                                            <span className={`text-xs font-black px-2 py-1 ${getStatusColor(room.status)}`}>
                                                {getStatusText(room.status)}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleCopyRoomCode(room.room_code, room.id)}
                                            className="w-8 h-8 hover:bg-neutral-text/5 flex items-center justify-center transition-colors"
                                        >
                                            {copiedRoomId === room.id ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                                        </button>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/admin/rooms/${room.id}`)}
                                            className="flex-1 btn-primary text-sm py-2"
                                        >
                                            <ExternalLink size={16} />
                                            <span>Quản lý</span>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteRoom(room.id)}
                                            className="w-10 h-10 bg-primary/10 hover:bg-primary hover:text-white text-primary flex items-center justify-center transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {rooms.length === 0 && (
                            <div className="text-center py-20">
                                <Users size={64} className="mx-auto mb-4 text-neutral-text/20" />
                                <p className="text-neutral-muted font-bold">Chưa có phòng nào</p>
                                <button onClick={() => setShowCreateModal(true)} className="btn-primary mt-4">
                                    Tạo phòng đầu tiên
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Questions Tab */}
                {activeTab === 'questions' && (
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-4xl font-black text-neutral-text uppercase tracking-tight">Câu Hỏi</h2>
                                <p className="text-sm text-neutral-muted font-bold mt-1">Quản lý kho câu hỏi</p>
                            </div>
                            <button onClick={() => navigate('/admin/questions')} className="btn-primary">
                                <Database size={20} />
                                <span>Mở Kho Câu Hỏi</span>
                            </button>
                        </div>

                        <div className="glass-card p-12 text-center">
                            <Database size={64} className="mx-auto mb-4 text-primary" />
                            <h3 className="text-2xl font-black text-neutral-text mb-2">Kho Câu Hỏi</h3>
                            <p className="text-neutral-muted mb-6">Click nút bên trên để quản lý câu hỏi</p>
                            <button onClick={() => navigate('/admin/questions')} className="btn-primary">
                                Mở Kho Câu Hỏi
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {/* Create Room Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                        onClick={() => setShowCreateModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white w-full max-w-md"
                        >
                            <div className="p-6 border-b-2 border-neutral-text/10">
                                <h2 className="text-2xl font-black uppercase">Tạo Phòng Mới</h2>
                            </div>

                            <form onSubmit={handleCreateRoom} className="p-6 space-y-6">
                                <div>
                                    <label className="academic-label mb-2">Mã Phòng</label>
                                    <input
                                        type="text"
                                        value={newRoomCode}
                                        onChange={(e) => setNewRoomCode(e.target.value)}
                                        placeholder="VD: MLN131-DEMO"
                                        className="input-field"
                                        required
                                    />
                                    <p className="text-xs text-neutral-muted mt-2">
                                        * Phòng sẽ tự động sử dụng tất cả câu hỏi trong kho
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button type="submit" disabled={loading} className="btn-primary flex-1">
                                        <Plus size={20} />
                                        <span>{loading ? 'Đang tạo...' : 'Tạo Phòng'}</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="btn-secondary flex-1"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
