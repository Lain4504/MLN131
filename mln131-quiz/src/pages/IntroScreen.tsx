import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    GraduationCap, 
    Trophy, 
    Users, 
    Zap, 
    Shield, 
    Target, 
    Star, 
    ArrowRight, 
    ChevronRight,
    BookOpen,
    Award,
    Clock,
    Sparkles,
    ChevronLeft,
    Brain,
    Copyright,
    ShieldCheck,
    Info
} from 'lucide-react';
import bg1 from '../assets/bg1.png';
import bg2 from '../assets/bg2.png';
import bg3 from '../assets/bg3.png';
import bg4 from '../assets/bg4.png';

export const IntroScreen: React.FC = () => {
    const navigate = useNavigate();
    const [currentImage, setCurrentImage] = useState(0);
    const [showAICopyright, setShowAICopyright] = useState(false);
    
    const bannerImages = [
        { src: bg1, id: 1 },
        { src: bg2, id: 2 },
        { src: bg3, id: 3 },
        { src: bg4, id: 4 }
    ];

    // Auto-rotate banner images
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % bannerImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [bannerImages.length]);

    const features = [
        {
            icon: <Trophy size={48} />,
            title: 'Đấu Trường Trí Tuệ',
            description: 'Thử thách kiến thức về Chủ nghĩa Xã hội Khoa học trong môi trường cạnh tranh đầy kịch tính',
            color: 'primary',
            image: '/vietnam_propaganda_modern_academic.png'
        },
        {
            icon: <Users size={48} />,
            title: 'Thi Đấu Đa Người',
            description: 'Cùng tranh tài với nhiều đối thủ trong thời gian thực, xem ai là người xuất sắc nhất',
            color: 'secondary',
            image: '/vietnam_academic_motif_lotus.png'
        },
        {
            icon: <Zap size={48} />,
            title: 'Vật Phẩm Chiến Thuật',
            description: 'Sử dụng các vật phẩm đặc biệt để tăng điểm, kéo dài thời gian, hoặc gây nhiễu đối thủ',
            color: 'primary',
            image: '/vietnam_propaganda_modern_academic.png'
        },
        {
            icon: <Shield size={48} />,
            title: 'Hệ Thống Phòng Hộ',
            description: 'Bảo vệ bản thân khỏi các tấn công từ đối thủ bằng khiên miễn dịch thông minh',
            color: 'secondary',
            image: '/vietnam_academic_motif_lotus.png'
        }
    ];

    const stats = [
        { label: 'Câu Hỏi', value: '100+', icon: <BookOpen size={24} /> },
        { label: 'Người Chơi', value: 'Không giới hạn', icon: <Users size={24} /> },
        { label: 'Thời Gian', value: '30s/câu', icon: <Clock size={24} /> },
        { label: 'Phần Thưởng', value: 'Huy chương', icon: <Award size={24} /> }
    ];

    return (
        <div className="min-h-screen relative overflow-hidden perspective-3d page-transition" style={{ backgroundColor: 'transparent' }}>
            {/* Enhanced Background */}
            <div className="absolute inset-0 animated-gradient-bg" />
            <div className="absolute inset-0 pattern-dots opacity-[0.12] text-primary" />
            <div className="star-field" />
            
            {/* Premium Top Bar */}
            <div className="absolute top-0 left-0 w-full h-3 bg-primary overflow-hidden pixel-border-red gradient-glow-red">
                <div className="w-1/3 h-full bg-primary animate-scan" style={{ 
                    boxShadow: '0 0 30px rgba(220,20,60,0.9), inset 0 2px 0 rgba(255,255,255,0.4)',
                    background: 'linear-gradient(90deg, #DC143C, #FF1744, #DC143C)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 2s infinite, scan 10s linear infinite'
                }} />
            </div>

            {/* Floating Particles */}
            {[...Array(15)].map((_, i) => (
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

            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 z-10">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-4xl mx-auto relative z-10"
                >
                    {/* Main Icon */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
                        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                        className="relative inline-block mb-8 perspective-3d"
                    >
                        <div className="w-24 h-24 bg-primary flex items-center justify-center text-white relative pixel-border-red gradient-glow-red" style={{
                            boxShadow: '0 8px 0 #C8102E, 0 16px 0 rgba(200, 16, 46, 0.5), 0 0 40px rgba(220, 20, 60, 0.6)',
                            transform: 'perspective(500px) rotateX(5deg)'
                        }}>
                            <GraduationCap size={50} className="drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)]" />
                            <motion.div 
                                className="absolute -top-3 -right-3 w-10 h-10 bg-secondary flex items-center justify-center text-neutral-text star-3d pixel-border-yellow" 
                                style={{ boxShadow: '0 4px 0 #FFB700' }}
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                            >
                                <Star size={22} fill="currentColor" className="text-neutral-text" />
                            </motion.div>
                        </div>
                    </motion.div>


                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex items-center justify-center gap-4 mb-8"
                    >
                        <div className="h-[3px] w-16 bg-primary pixel-border-red" style={{ boxShadow: '2px 2px 0px #C8102E' }} />
                        <p className="text-primary font-black text-sm uppercase tracking-[0.4em] premium-badge" style={{ 
                            borderColor: '#DC143C',
                            color: '#DC143C',
                            backgroundColor: '#FFF8E1'
                        }}>
                            Chủ nghĩa Xã hội Khoa học
                        </p>
                        <div className="h-[3px] w-16 bg-primary pixel-border-red" style={{ boxShadow: '2px 2px 0px #C8102E' }} />
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="text-lg md:text-xl text-neutral-muted font-bold mb-12 max-w-2xl mx-auto leading-relaxed"
                    >
                        Hệ thống thi đấu trực tuyến đa người chơi, nơi bạn có thể thử thách kiến thức về Lý luận Chính trị 
                        và tranh tài với các đối thủ khác trong môi trường cạnh tranh đầy kịch tính.
                    </motion.p>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-3xl mx-auto"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1 + index * 0.1 }}
                                className="premium-card p-4 text-center smooth-hover"
                            >
                                <div className="text-primary mb-2 flex justify-center">
                                    {stat.icon}
                                </div>
                                <div className="font-black text-2xl text-neutral-text mb-1">{stat.value}</div>
                                <div className="text-[10px] font-black text-primary uppercase tracking-wider">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* CTA Button */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.4 }}
                        onClick={() => navigate('/entry')}
                        className="btn-primary-enhanced group text-lg py-6 px-12 mb-8"
                    >
                        <span>BẮT ĐẦU THI ĐẤU</span>
                        <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                    </motion.button>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.6 }}
                    className="absolute bottom-8 flex flex-col items-center gap-2"
                >
                    <span className="text-[10px] font-black text-primary uppercase tracking-wider">Cuộn xuống</span>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-6 h-10 border-3 border-primary rounded-full flex items-start justify-center p-2"
                        style={{ borderColor: '#DC143C' }}
                    >
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    </motion.div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="relative py-20 px-4 z-10">
                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-serif font-black text-neutral-text uppercase tracking-tight mb-4 text-glow-red">
                            Tính Năng Nổi Bật
                        </h2>
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-[3px] w-12 bg-primary pixel-border-red" style={{ boxShadow: '2px 2px 0px #C8102E' }} />
                            <p className="text-neutral-muted font-bold">Khám phá sức mạnh của hệ thống</p>
                            <div className="h-[3px] w-12 bg-primary pixel-border-red" style={{ boxShadow: '2px 2px 0px #C8102E' }} />
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2, duration: 0.6 }}
                                className="premium-card p-8 smooth-hover relative overflow-hidden group"
                            >
                                {/* Background Image Pattern */}
                                <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.08] pointer-events-none grayscale group-hover:opacity-[0.12] transition-opacity">
                                    <div className="w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5" />
                                </div>

                                <div className="relative z-10">
                                    <div className={`w-16 h-16 mb-6 flex items-center justify-center text-white pixel-border-${feature.color === 'primary' ? 'red' : 'yellow'} gradient-glow-${feature.color === 'primary' ? 'red' : 'yellow'}`}
                                        style={{
                                            backgroundColor: feature.color === 'primary' ? '#DC143C' : '#FFCD00',
                                            color: feature.color === 'primary' ? '#FFFFFF' : '#1A1A1A'
                                        }}
                                    >
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-2xl font-black text-neutral-text uppercase mb-4 text-glow-red">
                                        {feature.title}
                                    </h3>
                                    <p className="text-neutral-muted font-bold leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How to Play Section */}
            <section className="relative py-20 px-4 z-10 bg-white/30 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-serif font-black text-neutral-text uppercase tracking-tight mb-4 text-glow-red">
                            Cách Thức Tham Gia
                        </h2>
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-[3px] w-12 bg-primary pixel-border-red" style={{ boxShadow: '2px 2px 0px #C8102E' }} />
                            <p className="text-neutral-muted font-bold">Hướng dẫn nhanh</p>
                            <div className="h-[3px] w-12 bg-primary pixel-border-red" style={{ boxShadow: '2px 2px 0px #C8102E' }} />
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                step: '01',
                                title: 'Nhập Thông Tin',
                                description: 'Điền tên và mã phòng để tham gia thi đấu',
                                icon: <Users size={32} />
                            },
                            {
                                step: '02',
                                title: 'Thi Đấu',
                                description: 'Trả lời câu hỏi nhanh và chính xác để giành điểm',
                                icon: <Target size={32} />
                            },
                            {
                                step: '03',
                                title: 'Xem Kết Quả',
                                description: 'Kiểm tra bảng xếp hạng và phần thưởng của bạn',
                                icon: <Trophy size={32} />
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2, duration: 0.6 }}
                                className="premium-card p-8 text-center smooth-hover relative"
                            >
                                <div className="text-6xl font-black text-primary/20 mb-4 absolute top-4 right-4">
                                    {item.step}
                                </div>
                                <div className="w-16 h-16 bg-primary text-white flex items-center justify-center mx-auto mb-6 pixel-border-red relative z-10">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-black text-neutral-text uppercase mb-3">
                                    {item.title}
                                </h3>
                                <p className="text-neutral-muted font-bold text-sm leading-relaxed">
                                    {item.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="relative py-20 px-4 z-10">
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="premium-card p-12 relative overflow-hidden"
                    >

                        <div className="relative z-10">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                                className="w-20 h-20 bg-secondary text-neutral-text flex items-center justify-center mx-auto mb-6 pixel-border-yellow star-3d"
                                style={{ boxShadow: '0 6px 0 #FFB700' }}
                            >
                                <Sparkles size={40} fill="currentColor" />
                            </motion.div>
                            <h2 className="text-4xl md:text-5xl font-serif font-black text-neutral-text uppercase tracking-tight mb-6 text-glow-red">
                                Sẵn Sàng Thử Thách?
                            </h2>
                            <p className="text-lg text-neutral-muted font-bold mb-8 max-w-2xl mx-auto">
                                Tham gia ngay để trải nghiệm hệ thống thi đấu trực tuyến đầy thú vị và cạnh tranh!
                            </p>
                            <button
                                onClick={() => navigate('/entry')}
                                className="btn-primary-enhanced group text-lg py-6 px-12"
                            >
                                <span>BẮT ĐẦU NGAY</span>
                                <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Banner Carousel Section - Full Image Display */}
            <section className="relative w-full min-h-[70vh] md:min-h-[80vh] overflow-hidden z-10 my-12 bg-neutral-bg">
                <div className="relative w-full h-full max-w-7xl mx-auto px-4 py-8">
                    {/* Carousel Container */}
                    <div className="relative w-full h-[60vh] md:h-[70vh] rounded-lg overflow-hidden premium-card" style={{
                        border: '4px solid #DC143C',
                        boxShadow: '0 12px 0 #C8102E, 0 24px 0 rgba(200, 16, 46, 0.3), 0 0 60px rgba(220, 20, 60, 0.2)'
                    }}>
                        {/* Carousel Images */}
                        {bannerImages.map((img, index) => (
                            <motion.div
                                key={img.id}
                                initial={false}
                                animate={{
                                    opacity: currentImage === index ? 1 : 0,
                                    scale: currentImage === index ? 1 : 0.95,
                                }}
                                transition={{
                                    duration: 0.8,
                                    ease: "easeInOut"
                                }}
                                className="absolute inset-0 flex items-center justify-center"
                                style={{
                                    pointerEvents: currentImage === index ? 'auto' : 'none'
                                }}
                            >
                                {/* Full Image Container */}
                                <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-bg via-white to-neutral-bg p-4 md:p-8">
                                    <img 
                                        src={img.src}
                                        alt={`Banner ${img.id}`}
                                        className="max-w-full max-h-full object-contain"
                                        style={{
                                            filter: 'grayscale(10%) brightness(0.95) contrast(1.1) saturate(1.1)',
                                            imageRendering: 'auto'
                                        }}
                                    />
                                </div>
                                
                                {/* Subtle Overlay - chỉ ở edges */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 pointer-events-none" />
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
                                
                                {/* Image Number Badge */}
                                <motion.div 
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ 
                                        scale: currentImage === index ? 1 : 0,
                                        rotate: currentImage === index ? 0 : -180
                                    }}
                                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                                    className="absolute top-6 right-6 w-14 h-14 bg-primary text-white flex items-center justify-center font-black text-xl pixel-border-red z-20"
                                    style={{
                                        boxShadow: '0 4px 0 #C8102E, 0 0 25px rgba(220, 20, 60, 0.6)'
                                    }}
                                >
                                    {img.id}
                                </motion.div>
                            </motion.div>
                        ))}

                        {/* Navigation Arrows */}
                        <button
                            onClick={() => setCurrentImage((prev) => (prev - 1 + bannerImages.length) % bannerImages.length)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-14 h-14 bg-primary/90 hover:bg-primary text-white flex items-center justify-center pixel-border-red transition-all group carousel-nav-button"
                            style={{
                                boxShadow: '0 4px 0 #C8102E, 0 0 25px rgba(220, 20, 60, 0.5)'
                            }}
                        >
                            <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                        
                        <button
                            onClick={() => setCurrentImage((prev) => (prev + 1) % bannerImages.length)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-14 h-14 bg-primary/90 hover:bg-primary text-white flex items-center justify-center pixel-border-red transition-all group carousel-nav-button"
                            style={{
                                boxShadow: '0 4px 0 #C8102E, 0 0 25px rgba(220, 20, 60, 0.5)'
                            }}
                        >
                            <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        {/* Navigation Dots */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
                            {bannerImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImage(index)}
                                    className={`transition-all duration-300 carousel-dot ${
                                        currentImage === index 
                                            ? 'w-12 h-3 bg-primary' 
                                            : 'w-3 h-3 bg-white/60 hover:bg-white/80'
                                    }`}
                                    style={{
                                        boxShadow: currentImage === index 
                                            ? '0 0 20px rgba(220, 20, 60, 0.9), 0 2px 0 #C8102E' 
                                            : '0 2px 0 rgba(255, 255, 255, 0.3)',
                                        borderRadius: currentImage === index ? '2px' : '50%'
                                    }}
                                />
                            ))}
                        </div>

                        {/* Progress Bar */}
                        <div className="absolute bottom-0 left-0 w-full h-2 bg-black/30 z-30">
                            <motion.div
                                className="h-full bg-gradient-to-r from-primary via-primary to-secondary carousel-progress"
                                initial={{ width: '0%' }}
                                animate={{ width: '100%' }}
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                                key={currentImage}
                            />
                        </div>
                    </div>

                    {/* Banner Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mt-8"
                    >
                        <h3 className="text-2xl md:text-3xl font-serif font-black text-neutral-text uppercase tracking-tight mb-2 text-glow-red">
                            Hình Ảnh Giới Thiệu
                        </h3>
                        <p className="text-neutral-muted font-bold text-sm">
                            {currentImage + 1} / {bannerImages.length}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative py-12 px-4 border-t-4 border-primary z-10" style={{
                borderTop: '4px solid #DC143C',
                boxShadow: '0 -4px 0 rgba(220, 20, 60, 0.2)'
            }}>
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-primary uppercase tracking-widest premium-badge mb-2" style={{
                                borderColor: '#DC143C',
                                backgroundColor: '#FFF8E1',
                                padding: '2px 6px'
                            }}>
                                Cơ sở Đào tạo
                            </span>
                            <span className="text-sm font-black text-neutral-text uppercase" style={{ textShadow: '1px 1px 0px rgba(0,0,0,0.1)' }}>
                                Đại học FPT • Bộ môn Lý luận Chính trị
                            </span>
                        </div>
                        <div className="text-center md:text-right flex flex-col items-center md:items-end">
                            <span className="text-[9px] font-black text-primary uppercase tracking-widest premium-badge mb-2" style={{
                                borderColor: '#FFCD00',
                                backgroundColor: '#FFF8E1',
                                padding: '2px 6px'
                            }}>
                                Thời gian hệ thống
                            </span>
                            <span className="text-sm font-mono font-bold text-neutral-text premium-badge" style={{
                                borderColor: '#DC143C',
                                backgroundColor: '#FFF8E1',
                                padding: '4px 8px'
                            }}>
                                NIÊN KHÓA 2026
                            </span>
                        </div>
                    </div>

                    {/* Mục lục Button */}
                    <div className="flex justify-center">
                        <button
                            onClick={() => setShowAICopyright(!showAICopyright)}
                            className="btn-primary-enhanced group flex items-center gap-3"
                        >
                            <BookOpen size={20} />
                            <span>MỤC LỤC: AI & BẢN QUYỀN</span>
                            <motion.div
                                animate={{ rotate: showAICopyright ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </motion.div>
                        </button>
                    </div>
                </div>
            </footer>

            {/* AI & Bản quyền Section - Collapsible */}
            <AnimatePresence>
                {showAICopyright && (
                    <motion.section
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="relative py-16 px-4 bg-neutral-text text-white z-10 overflow-hidden"
                    >
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-primary flex items-center justify-center pixel-border-red" style={{
                                boxShadow: '0 4px 0 #C8102E'
                            }}>
                                <Brain size={24} />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-serif font-black uppercase tracking-tight">
                                AI & Bản quyền
                            </h2>
                            <div className="w-12 h-12 bg-secondary text-neutral-text flex items-center justify-center pixel-border-yellow" style={{
                                boxShadow: '0 4px 0 #FFB700'
                            }}>
                                <Copyright size={24} />
                            </div>
                        </div>
                        <div className="h-[3px] w-24 bg-primary mx-auto" style={{ boxShadow: '2px 2px 0px #C8102E' }} />
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {/* AI Section */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="premium-card p-6 glass-morphism-dark"
                            style={{
                                background: 'rgba(26, 26, 26, 0.9)',
                                border: '3px solid rgba(220, 20, 60, 0.3)',
                                boxShadow: '0 8px 0 rgba(200, 16, 46, 0.3), 0 0 30px rgba(220, 20, 60, 0.2)'
                            }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-primary/20 flex items-center justify-center pixel-border-red">
                                    <Brain size={20} className="text-primary" />
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-tight text-primary">
                                    Về Trí tuệ Nhân tạo
                                </h3>
                            </div>
                            <div className="space-y-3 text-white/90">
                                <p className="font-bold leading-relaxed">
                                    Website này <span className="text-primary font-black">KHÔNG sử dụng</span> công nghệ Trí tuệ Nhân tạo (AI) để tạo ra nội dung hoặc câu hỏi.
                                </p>
                                <p className="font-bold leading-relaxed text-sm">
                                    Tất cả nội dung, bao gồm câu hỏi, đáp án, và tài liệu đều được biên soạn bởi đội ngũ giảng viên và chuyên gia của Bộ môn Lý luận Chính trị, Đại học FPT.
                                </p>
                                
                                <div className="mt-4 p-4 bg-primary/10 border-l-4 border-primary">
                                    <h4 className="text-sm font-black text-primary uppercase mb-2 flex items-center gap-2">
                                        <Brain size={16} />
                                        Công cụ hỗ trợ phát triển web
                                    </h4>
                                    <p className="text-xs font-bold text-white/80 leading-relaxed mb-3">
                                        Trong quá trình phát triển website, nhóm đã sử dụng các công cụ và công nghệ sau để hỗ trợ:
                                    </p>
                                    <ul className="space-y-2 text-xs font-bold list-none">
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary font-black mt-1">•</span>
                                            <span><strong>React & TypeScript:</strong> Framework và ngôn ngữ lập trình chính</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary font-black mt-1">•</span>
                                            <span><strong>Tailwind CSS:</strong> Framework CSS để thiết kế giao diện</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary font-black mt-1">•</span>
                                            <span><strong>Framer Motion:</strong> Thư viện animation cho React</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary font-black mt-1">•</span>
                                            <span><strong>Supabase:</strong> Backend và database service</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary font-black mt-1">•</span>
                                            <span><strong>Vite:</strong> Build tool và development server</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="flex items-start gap-2 mt-4 p-3 bg-primary/10 border-l-4 border-primary">
                                    <Info size={18} className="text-primary flex-shrink-0 mt-0.5" />
                                    <p className="text-xs font-bold text-white/80 leading-relaxed">
                                        <strong>Lưu ý:</strong> Các công cụ trên chỉ được sử dụng để phát triển và xây dựng website, không được sử dụng để tạo ra nội dung học thuật hoặc câu hỏi. Tất cả nội dung đều do con người biên soạn.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Bản quyền Section */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="premium-card p-6 glass-morphism-dark"
                            style={{
                                background: 'rgba(26, 26, 26, 0.9)',
                                border: '3px solid rgba(255, 205, 0, 0.3)',
                                boxShadow: '0 8px 0 rgba(255, 183, 0, 0.3), 0 0 30px rgba(255, 205, 0, 0.2)'
                            }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-secondary/20 flex items-center justify-center pixel-border-yellow">
                                    <ShieldCheck size={20} className="text-secondary" />
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-tight text-secondary">
                                    Quyền Sở Hữu
                                </h3>
                            </div>
                            <div className="space-y-3 text-white/90">
                                <p className="font-bold leading-relaxed">
                                    Toàn bộ nội dung trên website này, bao gồm nhưng không giới hạn:
                                </p>
                                <ul className="space-y-2 text-sm font-bold list-none">
                                    <li className="flex items-start gap-2">
                                        <span className="text-secondary font-black mt-1">•</span>
                                        <span>Câu hỏi và đáp án trong hệ thống quiz</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-secondary font-black mt-1">•</span>
                                        <span>Giao diện và thiết kế website</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-secondary font-black mt-1">•</span>
                                        <span>Logo, hình ảnh, và tài liệu</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-secondary font-black mt-1">•</span>
                                        <span>Mã nguồn và phần mềm</span>
                                    </li>
                                </ul>
                                <div className="mt-4 p-4 bg-secondary/10 border-l-4 border-secondary">
                                    <p className="text-xs font-black text-white uppercase tracking-wider mb-2">
                                        Bản quyền thuộc về
                                    </p>
                                    <p className="text-sm font-black text-secondary leading-relaxed mb-2">
                                        Nhóm 3 - Lớp MLN3.4
                                    </p>
                                    <p className="text-sm font-bold text-white leading-relaxed mb-2">
                                        Trường Đại học FPT Quy Nhơn
                                    </p>
                                    <p className="text-xs font-bold text-white/70 mt-3 pt-3 border-t border-white/10">
                                        © 2026. Tất cả các quyền được bảo lưu.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Disclaimer */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="premium-card p-6 text-center glass-morphism-dark"
                        style={{
                            background: 'rgba(26, 26, 26, 0.9)',
                            border: '3px solid rgba(220, 20, 60, 0.2)',
                            boxShadow: '0 6px 0 rgba(200, 16, 46, 0.2)'
                        }}
                    >
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <ShieldCheck size={20} className="text-primary" />
                            <h4 className="text-lg font-black uppercase tracking-tight text-primary">
                                Lưu Ý Quan Trọng
                            </h4>
                        </div>
                        <p className="text-sm font-bold text-white/80 leading-relaxed max-w-3xl mx-auto">
                            Việc sao chép, phân phối, hoặc sử dụng bất kỳ nội dung nào từ website này mà không có sự cho phép bằng văn bản từ chủ sở hữu là vi phạm pháp luật về bản quyền và có thể bị truy cứu trách nhiệm pháp lý.
                        </p>
                        <p className="text-xs font-bold text-white/60 mt-4">
                            Nếu bạn có bất kỳ câu hỏi nào về quyền sử dụng, vui lòng liên hệ với <strong>Nhóm 3 - Lớp MLN3.4, Trường Đại học FPT Quy Nhơn</strong>.
                        </p>
                    </motion.div>
                </div>
                    </motion.section>
                )}
            </AnimatePresence>
        </div>
    );
};
