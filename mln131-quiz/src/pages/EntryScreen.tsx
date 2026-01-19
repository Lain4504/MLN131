import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { Users, Trophy, ChevronRight, GraduationCap, Binary, Star } from 'lucide-react';
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
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-neutral-bg perspective-3d">
            {/* Background Effects - Vietnam Flag Colors */}
            <div className="absolute inset-0 pattern-dots opacity-[0.08] text-primary" />
            <div className="absolute top-0 left-0 w-full h-2 bg-primary overflow-hidden pixel-border-red">
                <div className="w-1/3 h-full bg-primary animate-scan shadow-[0_0_20px_rgba(220,20,60,0.8)]" style={{ boxShadow: '0 0 20px rgba(220,20,60,0.8), inset 0 2px 0 rgba(255,255,255,0.3)' }} />
            </div>
            
            {/* Vietnam Star Pattern Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 50px, rgba(255,205,0,0.1) 50px, rgba(255,205,0,0.1) 51px)`,
                backgroundSize: '100px 100px'
            }} />

            {/* Vietnamized Decorative Gate with 3D */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-[0.04] pointer-events-none grayscale rotate-3d-hover">
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
                        initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
                        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                        className="relative inline-block mb-6 perspective-3d"
                    >
                        {/* 3D Pixel Icon Container - Vietnam Red */}
                        <div className="w-20 h-20 bg-primary flex items-center justify-center text-white relative pixel-border-red" style={{
                            boxShadow: '0 8px 0 #C8102E, 0 16px 0 rgba(200, 16, 46, 0.5)',
                            transform: 'perspective(500px) rotateX(5deg)',
                        }}>
                            <GraduationCap size={40} className="drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)]" />
                            {/* Vietnam Star Badge - Yellow/Gold */}
                            <motion.div 
                                className="absolute -top-2 -right-2 w-8 h-8 bg-secondary flex items-center justify-center text-neutral-text star-3d pixel-border-yellow" 
                                style={{ boxShadow: '0 4px 0 #FFB700' }}
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                            >
                                <Star size={18} fill="currentColor" className="text-neutral-text" />
                            </motion.div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-4"
                    >
                        <h1 className="text-6xl font-serif font-black text-neutral-text tracking-tighter leading-tight uppercase relative inline-block" style={{
                            textShadow: '3px 3px 0px #DC143C, 6px 6px 0px rgba(220, 20, 60, 0.5)',
                            transform: 'perspective(1000px) rotateX(5deg)'
                        }}>
                            Đấu trường <span className="text-primary italic relative inline-block">
                                MLN131
                                <Star size={24} fill="#FFCD00" className="absolute -top-4 -right-8 star-3d" style={{ filter: 'drop-shadow(2px 2px 0px rgba(255,205,0,0.5))' }} />
                            </span>
                        </h1>
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-[3px] w-12 bg-primary pixel-border-red" style={{ boxShadow: '2px 2px 0px #C8102E' }} />
                            <p className="text-primary font-black text-[11px] uppercase tracking-[0.4em] pixel-badge" style={{ 
                                borderColor: '#DC143C',
                                color: '#DC143C',
                                backgroundColor: '#FFF8E1'
                            }}>
                                Chủ nghĩa Xã hội Khoa học
                            </p>
                            <div className="h-[3px] w-12 bg-primary pixel-border-red" style={{ boxShadow: '2px 2px 0px #C8102E' }} />
                        </div>
                    </motion.div>
                </header>

                <motion.form
                    onSubmit={handleJoin}
                    className="glass-card flex flex-col relative animate-float-3d"
                    initial={{ scale: 0.95, opacity: 0, rotateY: -10 }}
                    animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                    transition={{ delay: 0.5, ease: "easeOut" }}
                    style={{ 
                        border: '4px solid #DC143C',
                        boxShadow: '0 12px 0 #C8102E, 0 24px 0 rgba(200, 16, 46, 0.3)',
                        transform: 'perspective(1000px) rotateX(2deg)'
                    }}
                >
                    {/* 3D Pixel Corner Accents - Vietnam Theme */}
                    <div className="absolute -top-2 -left-2 w-8 h-8 pixel-border-red bg-primary" style={{ 
                        boxShadow: '4px 4px 0px #C8102E',
                        clipPath: 'polygon(0 0, 100% 0, 0 100%)'
                    }} />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 pixel-border-yellow bg-secondary" style={{ 
                        boxShadow: '4px 4px 0px #FFB700',
                        clipPath: 'polygon(100% 0, 100% 100%, 0 100%)'
                    }} />

                    {error && (
                        <motion.div 
                            className="mb-8 p-4 bg-primary/10 text-primary text-xs font-black uppercase tracking-widest animate-pixel-shake pixel-border-red"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            style={{
                                borderLeft: '4px solid #DC143C',
                                boxShadow: '4px 4px 0px rgba(220, 20, 60, 0.3)'
                            }}
                        >
                            {error}
                        </motion.div>
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

                        <button 
                            type="button" 
                            className="text-[10px] font-black text-neutral-muted uppercase tracking-[0.2em] hover:text-primary transition-all flex items-center justify-center gap-2 pixel-badge hover:scale-105"
                            style={{
                                borderColor: '#DC143C',
                                backgroundColor: 'transparent',
                                color: '#666666'
                            }}
                        >
                            TRUY CẬP KHO DỮ LIỆU LÝ LUẬN
                        </button>
                    </div>
                </motion.form>

                <motion.footer
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-20 border-t-4 border-primary pt-8 flex justify-between items-center relative"
                    style={{
                        borderTop: '4px solid #DC143C',
                        boxShadow: '0 -4px 0 rgba(220, 20, 60, 0.2)'
                    }}
                >
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-primary uppercase tracking-widest pixel-badge mb-2" style={{
                            borderColor: '#DC143C',
                            backgroundColor: '#FFF8E1',
                            padding: '2px 6px'
                        }}>
                            Cơ sở Đào tạo
                        </span>
                        <span className="text-[11px] font-black text-neutral-text uppercase" style={{ textShadow: '1px 1px 0px rgba(0,0,0,0.1)' }}>
                            Đại học FPT • Bộ môn Lý luận Chính trị
                        </span>
                    </div>
                    <div className="text-right flex flex-col items-end">
                        <span className="text-[9px] font-black text-primary uppercase tracking-widest pixel-badge mb-2" style={{
                            borderColor: '#FFCD00',
                            backgroundColor: '#FFF8E1',
                            padding: '2px 6px'
                        }}>
                            Thời gian hệ thống
                        </span>
                        <span className="text-[11px] font-mono font-bold text-neutral-text pixel-badge" style={{
                            borderColor: '#DC143C',
                            backgroundColor: '#FFF8E1',
                            padding: '4px 8px'
                        }}>
                            NIÊN KHÓA 2026
                        </span>
                    </div>
                </motion.footer>
            </motion.div>
        </div>
    );
};
