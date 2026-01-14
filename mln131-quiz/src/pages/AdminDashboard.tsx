import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Plus, Play, RefreshCcw, LayoutDashboard, Database, Users as UsersIcon, ArrowRight, Search, Filter, X, Calendar, UserCheck, GraduationCap, Copy, QrCode, Check } from 'lucide-react';
import { gameService } from '../lib/gameService';

export const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'rooms' | 'questions' | 'live'>('rooms');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [rooms, setRooms] = useState<any[]>([]);
    const [questions, setQuestions] = useState<any[]>([]);
    const [monitoringRoomId, setMonitoringRoomId] = useState<string | null>(null);
    const [livePlayers, setLivePlayers] = useState<any[]>([]);
    const [newRoomCode, setNewRoomCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [copiedRoomId, setCopiedRoomId] = useState<string | null>(null);
    const [showQRModal, setShowQRModal] = useState(false);
    const [selectedRoomForQR, setSelectedRoomForQR] = useState<any | null>(null);

    // Fetch initial data
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [roomsData, questionsData] = await Promise.all([
                    gameService.getRooms(),
                    gameService.getQuestions()
                ]);
                setRooms(roomsData);
                setQuestions(questionsData);
            } catch (err) {
                console.error('Fetch admin data error:', err);
            }
        };
        fetchData();

        // Subscribe to all rooms for live updates
        const channel = gameService.subscribeToAllRooms((payload: any) => {
            console.log('Room realtime event:', payload); // Debug log

            if (payload.eventType === 'INSERT') {
                setRooms(prev => {
                    // Check if room already exists to prevent duplicates
                    if (prev.some(r => r.id === payload.new.id)) {
                        return prev;
                    }
                    return [payload.new, ...prev];
                });
            } else if (payload.eventType === 'UPDATE') {
                setRooms(prev => {
                    const index = prev.findIndex(r => r.id === payload.new.id);
                    if (index !== -1) {
                        const next = [...prev];
                        next[index] = { ...next[index], ...payload.new };
                        return next;
                    }
                    return prev;
                });
            } else if (payload.eventType === 'DELETE') {
                setRooms(prev => prev.filter(r => r.id !== payload.old.id));
            }
        });

        return () => {
            channel.unsubscribe();
        };
    }, []);

    // Monitoring Room Subscription
    React.useEffect(() => {
        if (!monitoringRoomId) return;

        const channel = gameService.subscribeToPlayers(monitoringRoomId, (players) => {
            setLivePlayers(players);
        });

        return () => {
            channel.unsubscribe();
        };
    }, [monitoringRoomId]);

    const handleCreateRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newRoomCode.trim()) {
            alert('Vui lòng nhập mã phòng!');
            return;
        }

        setLoading(true);
        try {
            const newRoom = await gameService.createRoom(newRoomCode.trim());

            // Don't manually add to state - let realtime handle it
            // This prevents duplicate entries

            setShowCreateModal(false);
            setNewRoomCode('');

            // Success feedback
            alert(`✅ Phòng "${newRoom.room_code}" đã được tạo thành công!`);
        } catch (err: any) {
            console.error('Create room error:', err);

            // Better error messages
            if (err.message?.includes('duplicate')) {
                alert('❌ Mã phòng này đã tồn tại. Vui lòng chọn mã khác.');
            } else {
                alert('❌ Lỗi khi tạo phòng chơi: ' + (err.message || 'Unknown error'));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleStartRoom = async (roomId: string) => {
        try {
            await gameService.updateRoomStatus(roomId, 'playing');
        } catch (err) {
            console.error('Start room error:', err);
        }
    };

    const handleAdvanceQuestion = async (roomId: string, currentIndex: number) => {
        try {
            await gameService.advanceQuestion(roomId, currentIndex + 1);
        } catch (err) {
            console.error('Advance question error:', err);
        }
    };

    const handleEndRoom = async (roomId: string) => {
        try {
            await gameService.updateRoomStatus(roomId, 'finished');
        } catch (err) {
            console.error('End room error:', err);
        }
    };

    const handleCopyRoomCode = (roomCode: string, roomId: string) => {
        navigator.clipboard.writeText(roomCode);
        setCopiedRoomId(roomId);
        setTimeout(() => setCopiedRoomId(null), 2000);
    };

    const handleShowQR = (room: any) => {
        setSelectedRoomForQR(room);
        setShowQRModal(true);
    };

    return (
        <div className="min-h-screen bg-neutral-bg flex overflow-hidden">
            <div className="absolute inset-0 pattern-dots opacity-[0.02] text-primary" />

            {/* Background Decorative Gate */}
            <div className="absolute -bottom-20 -left-20 w-[600px] h-[600px] opacity-[0.02] pointer-events-none grayscale contrast-125 rotate-[-15deg]">
                <img src="/vietnam_propaganda_modern_academic.png" alt="University Gate" className="w-full h-full object-contain" />
            </div>

            {/* Sidebar Command Column */}
            <aside className="w-72 bg-neutral-text text-white flex flex-col shadow-2xl z-20 relative">
                <div className="p-10 border-b border-white/5 relative bg-black/20">
                    <div className="flex flex-col gap-2">
                        <div className="w-12 h-12 bg-primary flex items-center justify-center shadow-lg">
                            <GraduationCap size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tighter leading-none mt-2 uppercase">Lý luận</h1>
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Đơn vị Quản trị</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-8 space-y-6">
                    <SidebarLink
                        active={activeTab === 'rooms'}
                        onClick={() => setActiveTab('rooms')}
                        icon={<LayoutDashboard size={18} />}
                        label="Học phần Khảo thí"
                    />
                    <SidebarLink
                        active={activeTab === 'questions'}
                        onClick={() => setActiveTab('questions')}
                        icon={<Database size={18} />}
                        label="Kho Dữ liệu Lý luận"
                    />
                    <SidebarLink
                        active={activeTab === 'live'}
                        onClick={() => setActiveTab('live')}
                        icon={<UsersIcon size={18} />}
                        label="Giám sát Trực tuyến"
                    />
                </nav>

                <div className="p-8 border-t border-white/5 bg-black/20">
                    <div className="flex flex-col gap-1 mb-4">
                        <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Vai trò Vận hành</span>
                        <span className="text-xs font-bold uppercase">Giảng viên Cao cấp</span>
                    </div>
                    <button className="flex items-center gap-3 text-[10px] font-black text-gray-400 hover:text-primary transition-colors uppercase tracking-[0.2em] group">
                        <Settings size={14} className="group-hover:rotate-90 transition-transform duration-500" /> Tính toàn vẹn Hệ thống
                    </button>
                </div>
            </aside>

            {/* Main Operational Area */}
            <main className="flex-1 overflow-y-auto relative z-10">
                <div className="max-w-6xl mx-auto p-16">
                    <header className="flex justify-between items-end mb-16 border-b-2 border-neutral-text/5 pb-10">
                        <div>
                            <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4">
                                <div className="w-2 h-2 bg-primary shadow-[0_0_8px_rgba(153,27,27,0.5)]" />
                                Giao thức Vận hành
                            </div>
                            <h2 className="text-5xl font-serif font-black text-neutral-text tracking-tighter capitalize">
                                {activeTab === 'rooms' ? 'Quản lý Học phần' : activeTab === 'questions' ? 'Dữ liệu Lưu trữ' : 'Quan sát Trực tiếp'}
                            </h2>
                        </div>

                        <div className="flex gap-6">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-text/40 group-focus-within:text-primary transition-colors" size={16} />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm danh bạ..."
                                    className="pl-12 pr-6 py-4 bg-white border-2 border-neutral-text/5 text-sm focus:outline-none focus:border-primary transition-all w-72 shadow-sm font-medium"
                                />
                            </div>
                            {activeTab === 'rooms' && (
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="btn-primary"
                                    disabled={loading}
                                >
                                    <Plus size={18} /> KHỞI TẠO HỌC PHẦN
                                </button>
                            )}
                        </div>
                    </header>

                    <div className="relative">
                        {activeTab === 'rooms' && (
                            <RoomsTab
                                rooms={rooms}
                                onSelectLive={(id) => {
                                    setMonitoringRoomId(id);
                                    setActiveTab('live');
                                }}
                                onStart={handleStartRoom}
                                onCopyCode={handleCopyRoomCode}
                                onShowQR={handleShowQR}
                                copiedRoomId={copiedRoomId}
                            />
                        )}
                        {activeTab === 'questions' && <QuestionsTab questions={questions} />}
                        {activeTab === 'live' && (
                            <LiveTab
                                room={rooms.find(r => r.id === monitoringRoomId)}
                                players={livePlayers}
                                rooms={rooms}
                                onSelectRoom={setMonitoringRoomId}
                                onAdvance={handleAdvanceQuestion}
                                onEnd={handleEndRoom}
                            />
                        )}
                    </div>
                </div>
            </main>

            {/* Create Room Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-neutral-text/60 backdrop-blur-md"
                            onClick={() => setShowCreateModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white w-full max-w-xl relative z-10 shadow-constructivist-lg-dark border-2 border-neutral-text/10 overflow-hidden"
                        >
                            <div className="p-12 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 pattern-dots opacity-5 text-primary rotate-45" />

                                <header className="flex justify-between items-start mb-12 relative">
                                    <div>
                                        <label className="academic-label">Cấu hình Giao thức</label>
                                        <h3 className="text-4xl font-serif font-black text-neutral-text tracking-tighter uppercase">Khởi tạo Phòng thi</h3>
                                    </div>
                                    <button onClick={() => setShowCreateModal(false)} className="p-3 bg-neutral-bg hover:text-primary transition-all border border-neutral-text/10">
                                        <X size={20} />
                                    </button>
                                </header>

                                <form className="space-y-8 relative" onSubmit={handleCreateRoom}>
                                    <div className="space-y-3">
                                        <label className="academic-label">Định danh Học thuật (Room Code)</label>
                                        <input
                                            type="text"
                                            placeholder="Ví dụ: MLN131-VNU-04"
                                            className="input-field uppercase font-mono tracking-widest"
                                            value={newRoomCode}
                                            onChange={(e) => setNewRoomCode(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="academic-label">Access Token</label>
                                            <div className="relative">
                                                <input type="text" defaultValue="MLN-4491-AX" className="input-field pr-12 font-mono font-black text-primary" readOnly />
                                                <RefreshCcw className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-text/20 hover:text-primary cursor-pointer transition-colors" size={16} />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="academic-label">Capacity Limit</label>
                                            <div className="relative">
                                                <UsersIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-text/20" size={16} />
                                                <input type="number" defaultValue="48" className="input-field pl-12" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="academic-label">Select Theoretical Dataset</label>
                                        <div className="relative">
                                            <select className="input-field appearance-none cursor-pointer">
                                                <option>Kinh tế Chính trị Mác-Lênin (Toàn diện - 25 câu)</option>
                                                <option>Chủ nghĩa Duy vật Biện chứng (Cốt yếu - 15 câu)</option>
                                                <option>Chủ nghĩa Xã hội Khoa học - Ôn tập cuối kỳ (30 câu)</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                                <ArrowRight size={16} className="rotate-90" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="btn-primary w-full py-5 text-base disabled:opacity-50"
                                        >
                                            {loading ? 'ĐANG KHỞI TẠO...' : 'KÍCH HOẠT PHIÊN ĐẤU'} <ArrowRight size={20} className="ml-2" />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* QR Code Modal */}
            <AnimatePresence>
                {showQRModal && selectedRoomForQR && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-neutral-text/60 backdrop-blur-md"
                            onClick={() => setShowQRModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white w-full max-w-md relative z-10 shadow-constructivist-lg-dark border-2 border-neutral-text/10 overflow-hidden"
                        >
                            <div className="p-12 relative overflow-hidden text-center">
                                <div className="absolute top-0 right-0 w-32 h-32 pattern-dots opacity-5 text-primary rotate-45" />

                                <button onClick={() => setShowQRModal(false)} className="absolute top-4 right-4 p-3 bg-neutral-bg hover:text-primary transition-all border border-neutral-text/10">
                                    <X size={20} />
                                </button>

                                <div className="relative z-10">
                                    <label className="academic-label text-center mb-2">Mã QR Truy cập</label>
                                    <h3 className="text-3xl font-serif font-black text-neutral-text tracking-tighter uppercase mb-8">
                                        {selectedRoomForQR.room_code}
                                    </h3>

                                    {/* QR Code Placeholder - You can integrate a real QR library here */}
                                    <div className="bg-neutral-bg p-8 border-2 border-neutral-text/10 mb-8 inline-block">
                                        <div className="w-64 h-64 bg-white flex items-center justify-center border-4 border-primary/20">
                                            <div className="text-center">
                                                <QrCode size={80} className="text-primary mx-auto mb-4" />
                                                <p className="text-xs font-bold text-neutral-text/40 uppercase">
                                                    Quét mã để tham gia
                                                </p>
                                                <p className="text-2xl font-mono font-black text-primary mt-4">
                                                    {selectedRoomForQR.room_code}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-sm text-neutral-text/60 mb-6">
                                        Học viên có thể quét mã QR hoặc nhập mã phòng để tham gia
                                    </p>

                                    <button
                                        onClick={() => {
                                            handleCopyRoomCode(selectedRoomForQR.room_code, selectedRoomForQR.id);
                                        }}
                                        className="btn-primary w-full py-4"
                                    >
                                        <Copy size={18} className="mr-2" /> COPY MÃ PHÒNG
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const StatItem = ({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-white/40">
            {icon}
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
        </div>
        <span className="font-black text-lg">{value}</span>
    </div>
);

const SidebarLink: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-6 py-4 transition-all font-black text-[11px] uppercase tracking-[0.2em] cursor-pointer group relative ${active
            ? 'text-white'
            : 'text-gray-500 hover:text-white'
            }`}
    >
        {active && <motion.div layoutId="active-sidebar" className="absolute inset-0 bg-primary -z-0" />}
        <span className="relative z-10">{icon}</span>
        <span className="relative z-10">{label}</span>
        {active && <div className="absolute right-0 top-0 bottom-0 w-1 bg-white" />}
    </button>
);

const RoomsTab = ({ rooms, onSelectLive, onStart, onCopyCode, onShowQR, copiedRoomId }: {
    rooms: any[],
    onSelectLive: (id: string) => void,
    onStart: (id: string) => void,
    onCopyCode: (code: string, id: string) => void,
    onShowQR: (room: any) => void,
    copiedRoomId: string | null
}) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {rooms.length === 0 && (
            <div className="col-span-full py-20 text-center opacity-40 font-serif text-xl border-2 border-dashed border-neutral-text/10">
                Chưa có dữ liệu học phần...
            </div>
        )}
        {rooms.map(room => (
            <div key={room.id} className="bg-white p-10 border-2 border-neutral-text/5 shadow-constructivist hover:border-primary transition-all relative overflow-hidden group">
                <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <span className={`text-[9px] font-black px-3 py-1 uppercase tracking-widest ${room.status === 'playing' ? 'bg-primary text-white' : room.status === 'finished' ? 'bg-neutral-text text-white' : 'bg-neutral-text/5 text-neutral-text/40'}`}>
                                {room.status === 'playing' ? 'Đang vận hành' : room.status === 'finished' ? 'Đã hoàn thành' : 'Chế độ chờ'}
                            </span>
                            <span className="text-[9px] font-black text-neutral-text/30 uppercase tracking-[0.2em]">Khởi tạo: {new Date(room.created_at).toLocaleTimeString()}</span>
                        </div>

                        {/* Room Code Display Section */}
                        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 border-2 border-primary/20 mb-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 pattern-dots opacity-10 text-primary" />
                            <label className="academic-label !text-primary/60 mb-2">Mã Truy cập Học phần</label>
                            <div className="flex items-center justify-between gap-4 relative z-10">
                                <div className="flex-1">
                                    <h3 className="text-3xl font-mono font-black text-primary tracking-wider select-all">{room.room_code}</h3>
                                    <p className="text-[9px] font-bold text-neutral-text/40 uppercase tracking-widest mt-1">Chia sẻ mã này với học viên</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onCopyCode(room.room_code, room.id)}
                                        className={`p-3 border-2 transition-all ${copiedRoomId === room.id
                                            ? 'bg-green-500 border-green-500 text-white'
                                            : 'bg-white border-primary/20 text-primary hover:bg-primary hover:text-white'
                                            }`}
                                        title="Copy mã phòng"
                                    >
                                        {copiedRoomId === room.id ? <Check size={18} /> : <Copy size={18} />}
                                    </button>
                                    <button
                                        onClick={() => onShowQR(room)}
                                        className="p-3 bg-white border-2 border-secondary/20 text-secondary hover:bg-secondary hover:text-white transition-all"
                                        title="Hiển thị QR Code"
                                    >
                                        <QrCode size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-10">
                    <div className="bg-neutral-bg p-5 border-l-4 border-accent-blue">
                        <label className="academic-label">Trạng thái</label>
                        <div className="text-2xl font-black text-neutral-text uppercase">{room.status}</div>
                    </div>
                    <div className="bg-neutral-bg p-5 border-l-4 border-primary">
                        <label className="academic-label">Câu hỏi hiện tại</label>
                        <div className="text-2xl font-black text-neutral-text">#{room.current_question_index + 1}</div>
                    </div>
                </div>

                <div className="flex gap-4 relative z-10">
                    {room.status === 'waiting' ? (
                        <button onClick={() => onStart(room.id)} className="flex-1 btn-primary py-4 text-xs">
                            <Play size={16} fill="white" className="mr-2" /> KÍCH HOẠT HỌC PHẦN
                        </button>
                    ) : (
                        <button onClick={() => onSelectLive(room.id)} className="flex-1 btn-primary py-4 text-xs">
                            <UsersIcon size={16} className="mr-2" /> TRUY CẬP BÀN ĐIỀU KHIỂN
                        </button>
                    )}
                    <button className="btn-secondary py-4 !px-4">
                        <Settings size={18} />
                    </button>
                </div>

                <div className="absolute -bottom-10 -right-10 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-700">
                    <Database size={160} />
                </div>
            </div>
        ))}
    </div>
);

const QuestionsTab = ({ questions }: { questions: any[] }) => (
    <div className="bg-white border-2 border-neutral-text/10 shadow-constructivist overflow-hidden">
        <div className="p-8 border-b-2 border-neutral-text/5 flex justify-between items-center bg-neutral-bg/50">
            <div className="flex gap-4">
                <button className="px-5 py-3 bg-white border-2 border-neutral-text/10 text-[10px] font-black uppercase tracking-widest hover:border-primary transition-colors flex items-center gap-3">
                    <Filter size={14} /> Lọc dữ liệu
                </button>
            </div>
            <span className="text-[10px] font-black text-neutral-text/40 uppercase tracking-widest">Danh mục lưu trữ: {questions.length} Mục tổng cộng</span>
        </div>
        <table className="w-full text-left">
            <thead>
                <tr className="border-b-2 border-neutral-text/5 bg-neutral-bg/30">
                    <th className="px-10 py-6 academic-label">Nội dung Luận cương</th>
                    <th className="px-10 py-6 academic-label">Thang độ Phức tạp</th>
                    <th className="px-10 py-6 academic-label text-right">Quản trị viên</th>
                </tr>
            </thead>
            <tbody className="divide-y-2 divide-neutral-text/5">
                {questions.map((q, i) => (
                    <tr key={q.id} className="hover:bg-primary/[0.02] transition-colors group">
                        <td className="px-10 py-8">
                            <div className="font-bold text-neutral-text text-lg mb-2 group-hover:text-primary transition-colors font-serif">{q.content.question}</div>
                            <div className="flex items-center gap-3">
                                <span className="text-[9px] font-black text-neutral-text/40 uppercase tracking-widest">Thứ tự: #{i + 1}</span>
                                <div className="w-1 h-1 bg-neutral-text/20 rounded-full" />
                                <span className="text-[9px] font-black text-primary uppercase tracking-widest">ID: {q.id.slice(0, 8)}</span>
                            </div>
                        </td>
                        <td className="px-10 py-8">
                            <span className={`inline-block px-3 py-1 text-[9px] font-black uppercase tracking-widest border-2 ${q.difficulty === 'Trọng yếu' ? 'border-primary text-primary' :
                                q.difficulty === 'Trung bình' ? 'border-accent-blue text-accent-blue' :
                                    'border-neutral-text/20 text-neutral-text/40'
                                }`}>
                                {q.difficulty}
                            </span>
                        </td>
                        <td className="px-10 py-8 text-right">
                            <div className="flex gap-6 justify-end">
                                <button className="text-accent-blue font-black text-[10px] uppercase tracking-widest hover:underline cursor-pointer">Hiệu chỉnh</button>
                                <button className="text-primary font-black text-[10px] uppercase tracking-widest hover:underline cursor-pointer">Lưu trữ</button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const LiveTab = ({ room, players, rooms, onSelectRoom, onAdvance, onEnd }: {
    room: any,
    players: any[],
    rooms: any[],
    onSelectRoom: (id: string) => void,
    onAdvance: (id: string, idx: number) => void,
    onEnd: (id: string) => void
}) => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white p-10 border-2 border-neutral-text/5 shadow-constructivist">
            <div className="flex justify-between items-center mb-12">
                <div className="flex-1">
                    <label className="academic-label">Theo dõi Hoạt động</label>
                    <select
                        className="text-2xl font-black text-neutral-text uppercase tracking-tighter font-serif bg-transparent border-none appearance-none cursor-pointer hover:text-primary outline-none"
                        value={room?.id || ''}
                        onChange={(e) => onSelectRoom(e.target.value)}
                    >
                        <option value="">Chọn một học phần để giám sát...</option>
                        {rooms.map(r => (
                            <option key={r.id} value={r.id}>{r.room_code}</option>
                        ))}
                    </select>
                </div>
                {room && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary border-2 border-primary/10">
                        <div className="w-2 h-2 bg-primary animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Trạng thái: {room.status}</span>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                {players.length === 0 && (
                    <div className="py-20 text-center opacity-40 font-serif">
                        {room ? 'Chưa có người tham gia...' : 'Vui lòng chọn học phần để xem danh sách thí sinh.'}
                    </div>
                )}
                {players.sort((a, b) => b.score - a.score).map((p, i) => (
                    <div key={p.id} className="flex items-center gap-6 p-6 border-2 border-neutral-text/5 hover:border-primary transition-all group">
                        <div className="w-12 h-12 bg-neutral-text/5 flex items-center justify-center font-black group-hover:bg-primary group-hover:text-white transition-colors">#{i + 1}</div>
                        <div className="flex-1">
                            <div className="font-bold text-neutral-text text-base uppercase tracking-wider">{p.name}</div>
                            <div className="text-[9px] text-neutral-text/40 uppercase font-black tracking-[0.2em] mt-1">ID: {p.id.slice(0, 8)}</div>
                        </div>
                        <div className="text-right">
                            <div className="font-black text-2xl text-neutral-text leading-none">{p.score.toLocaleString()}</div>
                            <label className="academic-label !mb-0 mt-1 !text-primary/40">Điểm Hiệu suất</label>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="space-y-10">
            <div className="bg-neutral-text p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 pattern-dots opacity-10 text-primary rotate-45" />
                <label className="academic-label !text-white/40 mb-8">Viễn trắc Hệ thống</label>
                <div className="space-y-8 relative z-10">
                    <StatItem label="Tổng thí sinh" value={players.length.toString()} icon={<UsersIcon size={16} />} />
                    <StatItem label="Câu hiện tại" value={room ? `#${room.current_question_index + 1}` : '--'} icon={<Calendar size={16} />} />
                    <StatItem label="Hiệu suất tb" value={players.length > 0 ? (players.reduce((a, b) => a + b.score, 0) / players.length).toFixed(0) : '0'} icon={<UserCheck size={16} />} />
                </div>
            </div>

            {room && room.status !== 'finished' && (
                <div className="bg-white p-10 border-2 border-neutral-text/5 shadow-constructivist">
                    <label className="academic-label text-center mb-6">Điều khiển Tác chiến</label>
                    <div className="grid grid-cols-1 gap-4">
                        {room.status === 'playing' ? (
                            <button
                                onClick={() => onAdvance(room.id, room.current_question_index)}
                                className="w-full py-4 border-2 border-primary text-[10px] font-black text-primary hover:bg-primary hover:text-white transition-all uppercase tracking-widest"
                            >
                                TIẾN TỚI LUẬN ĐIỂM TIẾP THEO
                            </button>
                        ) : (
                            <button className="w-full py-4 border-2 border-neutral-text/10 text-[10px] font-black text-neutral-text bg-gray-50 opacity-50 cursor-not-allowed uppercase tracking-widest">
                                ĐANG ĐỢI KÍCH HOẠT
                            </button>
                        )}
                        <button
                            onClick={() => onEnd(room.id)}
                            className="w-full py-4 border-2 border-neutral-text/10 text-[10px] font-black text-neutral-text hover:border-primary hover:text-primary transition-all uppercase tracking-widest"
                        >
                            ĐÌNH CHỈ GIAO THỨC (KẾT THÚC)
                        </button>
                    </div>
                </div>
            )}
        </div>
    </div>
);
