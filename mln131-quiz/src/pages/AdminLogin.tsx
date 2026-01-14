import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Shield, ChevronRight } from 'lucide-react';
import { useAdminStore } from '../store/useAdminStore';

export const AdminLogin: React.FC = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAdminStore();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (login(password)) {
            navigate('/admin');
        } else {
            setError('Mật khẩu không đúng');
            setPassword('');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-neutral-bg">
            {/* Background Effects */}
            <div className="absolute inset-0 pattern-dots opacity-[0.05] text-primary" />
            <div className="absolute top-0 left-0 w-full h-1 bg-primary/20 overflow-hidden">
                <div className="w-1/3 h-full bg-primary animate-scan shadow-[0_0_10px_rgba(153,27,27,0.5)]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Header */}
                <header className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="relative inline-block mb-6"
                    >
                        <div className="w-20 h-20 bg-primary flex items-center justify-center text-white shadow-2xl relative">
                            <Shield size={40} />
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-secondary flex items-center justify-center text-white shadow-md">
                                <Lock size={14} />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-2"
                    >
                        <h1 className="text-5xl font-serif font-black text-neutral-text tracking-tighter leading-tight uppercase">
                            Admin <span className="text-primary italic">Access</span>
                        </h1>
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-[2px] w-8 bg-primary" />
                            <p className="text-primary font-black text-[11px] uppercase tracking-[0.4em]">Restricted Area</p>
                            <div className="h-[2px] w-8 bg-primary" />
                        </div>
                    </motion.div>
                </header>

                {/* Login Form */}
                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="glass-card space-y-6"
                >
                    <div>
                        <label className="academic-label mb-3">Administrator Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-muted" size={20} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter admin password"
                                className="input-field pl-12"
                                autoFocus
                                required
                            />
                        </div>
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-primary text-sm font-bold mt-2"
                            >
                                {error}
                            </motion.p>
                        )}
                    </div>

                    <button type="submit" className="btn-primary w-full group">
                        <span>Access Dashboard</span>
                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="text-sm text-neutral-muted hover:text-primary transition-colors font-bold"
                        >
                            ← Quay lại trang chủ
                        </button>
                    </div>
                </motion.form>

                {/* Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 text-center"
                >
                    <div className="inline-block bg-neutral-text/5 border-2 border-neutral-text/10 px-6 py-3">
                        <p className="text-[10px] font-black text-neutral-muted uppercase tracking-wider">
                            Default Password: <span className="text-primary">mln131admin</span>
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};
