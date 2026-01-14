import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { Users, Trophy, ChevronRight, GraduationCap, Binary } from 'lucide-react';
import { motion } from 'framer-motion';

export const EntryScreen: React.FC = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { joinRoom } = useGameStore();
    const navigate = useNavigate();

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name && room) {
            setLoading(true);
            setError(null);
            try {
                await joinRoom(room, name);
                // Navigate to room-specific URL
                navigate(`/room/${room}`);
            } catch (err: any) {
                setError(err.message || 'Có lỗi xảy ra khi vào phòng.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-neutral-bg">
            {/* Background Effects */}
            <div className="absolute inset-0 pattern-dots opacity-[0.05] text-primary" />
            <div className="absolute top-0 left-0 w-full h-1 bg-primary/20 overflow-hidden">
                <div className="w-1/3 h-full bg-primary animate-scan shadow-[0_0_10px_rgba(153,27,27,0.5)]" />
            </div>

            {/* Vietnamized Decorative Gate */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-[0.03] pointer-events-none grayscale">
                <img src="/vietnam_propaganda_modern_academic.png" alt="University Gate" className="w-full h-full object-contain" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="w-full max-w-lg z-10"
            >
                <header className="text-center mb-12 relative">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="relative inline-block mb-6"
                    >
                        <div className="w-20 h-20 bg-primary flex items-center justify-center text-white shadow-2xl relative">
                            <GraduationCap size={40} />
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-secondary flex items-center justify-center text-white shadow-md">
                                <Trophy size={14} />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-2"
                    >
                        <h1 className="text-6xl font-serif font-black text-neutral-text tracking-tighter leading-tight uppercase">
                            Đấu trường <span className="text-primary italic">MLN131</span>
                        </h1>
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-[2px] w-8 bg-primary" />
                            <p className="text-primary font-black text-[11px] uppercase tracking-[0.4em]">Chủ nghĩa Xã hội Khoa học</p>
                            <div className="h-[2px] w-8 bg-primary" />
                        </div>
                    </motion.div>
                </header>

                <motion.form
                    onSubmit={handleJoin}
                    className="bg-white p-12 shadow-constructivist-lg border-2 border-neutral-text/5 flex flex-col relative"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, ease: "easeOut" }}
                >
                    {/* Constructivist Corner Accents */}
                    <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-primary" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-secondary" />

                    {error && (
                        <div className="mb-8 p-4 bg-primary/10 border-l-4 border-primary text-primary text-xs font-bold uppercase tracking-widest animate-shake">
                            {error}
                        </div>
                    )}

                    <div className="space-y-8">
                        <div className="space-y-3">
                            <label className="academic-label">Danh tính Người tham gia</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary">
                                    <Users size={18} />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Ví dụ: Đồng chí nghiên cứu sinh"
                                    className="input-field pl-12"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="academic-label">Mã số Đơn vị Khảo thí</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary">
                                    <Binary size={18} />
                                </span>
                                <input
                                    type="text"
                                    placeholder="MLN131-XXXX"
                                    className="input-field pl-12 uppercase font-mono tracking-widest"
                                    value={room}
                                    onChange={(e) => setRoom(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary group text-base py-5 items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ĐANG KẾT NỐI...
                                </div>
                            ) : (
                                <>KHỞI TẠO PHIÊN ĐẤU <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform ml-1" /></>
                            )}
                        </button>

                        <button type="button" className="text-[10px] font-black text-neutral-muted uppercase tracking-[0.2em] hover:text-primary transition-colors flex items-center justify-center gap-2">
                            TRUY CẬP KHO DỮ LIỆU LÝ LUẬN
                        </button>
                    </div>
                </motion.form>

                <motion.footer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-20 border-t-2 border-neutral-text/5 pt-8 flex justify-between items-center"
                >
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-primary uppercase tracking-widest">Cơ sở Đào tạo</span>
                        <span className="text-[11px] font-black text-neutral-text uppercase">Đại học FPT • Bộ môn Lý luận Chính trị</span>
                    </div>
                    <div className="text-right flex flex-col items-end">
                        <span className="text-[9px] font-black text-primary uppercase tracking-widest">Thời gian hệ thống</span>
                        <span className="text-[11px] font-mono font-bold text-neutral-text">NIÊN KHÓA 2026</span>
                    </div>
                </motion.footer>
            </motion.div>
        </div>
    );
};
