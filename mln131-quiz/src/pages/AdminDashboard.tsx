import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Plus, Play, RefreshCcw, LayoutDashboard, Database, Users as UsersIcon, ArrowRight, Search, Filter, X, Calendar, UserCheck, GraduationCap } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'rooms' | 'questions' | 'live'>('rooms');
    const [showCreateModal, setShowCreateModal] = useState(false);

    return (
        <div className="min-h-screen bg-neutral-bg flex overflow-hidden">
            <div className="absolute inset-0 pattern-dots opacity-[0.02] text-primary" />

            {/* Sidebar Command Column */}
            <aside className="w-72 bg-neutral-text text-white flex flex-col shadow-2xl z-20 relative">
                <div className="p-10 border-b border-white/5 relative bg-black/20">
                    <div className="flex flex-col gap-2">
                        <div className="w-12 h-12 bg-primary flex items-center justify-center shadow-lg">
                            <GraduationCap size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tighter leading-none mt-2">ACADEMIC</h1>
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Control Unit</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-8 space-y-6">
                    <SidebarLink
                        active={activeTab === 'rooms'}
                        onClick={() => setActiveTab('rooms')}
                        icon={<LayoutDashboard size={18} />}
                        label="Examination Units"
                    />
                    <SidebarLink
                        active={activeTab === 'questions'}
                        onClick={() => setActiveTab('questions')}
                        icon={<Database size={18} />}
                        label="Theoretical Repository"
                    />
                    <SidebarLink
                        active={activeTab === 'live'}
                        onClick={() => setActiveTab('live')}
                        icon={<UsersIcon size={18} />}
                        label="Dynamic Monitoring"
                    />
                </nav>

                <div className="p-8 border-t border-white/5 bg-black/20">
                    <div className="flex flex-col gap-1 mb-4">
                        <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Operator Role</span>
                        <span className="text-xs font-bold">PROFESSOR_AUTH_77</span>
                    </div>
                    <button className="flex items-center gap-3 text-[10px] font-black text-gray-400 hover:text-primary transition-colors uppercase tracking-[0.2em] group">
                        <Settings size={14} className="group-hover:rotate-90 transition-transform duration-500" /> System Integrity
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
                                Operational Protocol
                            </div>
                            <h2 className="text-5xl font-serif font-black text-neutral-text tracking-tighter capitalize">
                                {activeTab === 'rooms' ? 'Unit Management' : activeTab === 'questions' ? 'Archival Data' : 'Live Observation'}
                            </h2>
                        </div>

                        <div className="flex gap-6">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-text/40 group-focus-within:text-primary transition-colors" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search registry..."
                                    className="pl-12 pr-6 py-4 bg-white border-2 border-neutral-text/5 text-sm focus:outline-none focus:border-primary transition-all w-72 shadow-sm font-medium"
                                />
                            </div>
                            {activeTab === 'rooms' && (
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="btn-primary"
                                >
                                    <Plus size={18} /> INITIALIZE UNIT
                                </button>
                            )}
                        </div>
                    </header>

                    <div className="relative">
                        {activeTab === 'rooms' && <RoomsTab />}
                        {activeTab === 'questions' && <QuestionsTab />}
                        {activeTab === 'live' && <LiveTab />}
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
                            className="bg-white w-full max-w-xl relative z-10 shadow-[20px_20px_0px_0px_rgba(153,27,27,0.2)] border-2 border-neutral-text/10 overflow-hidden"
                        >
                            <div className="p-12 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 pattern-dots opacity-5 text-primary rotate-45" />

                                <header className="flex justify-between items-start mb-12 relative">
                                    <div>
                                        <label className="academic-label">Protocol Config</label>
                                        <h3 className="text-4xl font-serif font-black text-neutral-text tracking-tighter uppercase">Initialize Room</h3>
                                    </div>
                                    <button onClick={() => setShowCreateModal(false)} className="p-3 bg-neutral-bg hover:text-primary transition-all border border-neutral-text/10">
                                        <X size={20} />
                                    </button>
                                </header>

                                <form className="space-y-8 relative" onSubmit={(e) => e.preventDefault()}>
                                    <div className="space-y-3">
                                        <label className="academic-label">Academic Designation</label>
                                        <input type="text" placeholder="e.g. MLN131 Examination - Section 04" className="input-field" />
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
                                                <option>Materialist Dialectics Comprehensive (25 Items)</option>
                                                <option>Historical Materialism Core (15 Items)</option>
                                                <option>Scientific Socialism - Final Prep (30 Items)</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                                <ArrowRight size={16} className="rotate-90" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <button
                                            onClick={() => setShowCreateModal(false)}
                                            className="btn-primary w-full py-5 text-base"
                                        >
                                            ACTIVATE UNIT SESSION <ArrowRight size={20} className="ml-2" />
                                        </button>
                                    </div>
                                </form>
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

const RoomsTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white p-10 border-2 border-neutral-text/5 shadow-[8px_8px_0px_0px_rgba(30,58,138,0.05)] hover:border-primary transition-all relative overflow-hidden group">
                <div className="flex justify-between items-start mb-8 relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className={`text-[9px] font-black px-3 py-1 uppercase tracking-widest ${i === 1 ? 'bg-primary text-white' : 'bg-neutral-text/5 text-neutral-text/40'}`}>
                                {i === 1 ? 'Operational' : 'Standby'}
                            </span>
                            <span className="text-[9px] font-black text-neutral-text/30 uppercase tracking-[0.2em]">Registered: 14:02:44</span>
                        </div>
                        <h3 className="text-3xl font-serif font-black text-neutral-text group-hover:text-primary transition-colors">UNIT_MLN-{2026 + i}_SEC_04</h3>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-10">
                    <div className="bg-neutral-bg p-5 border-l-4 border-accent-blue">
                        <label className="academic-label">Respondent Count</label>
                        <div className="text-2xl font-black text-neutral-text">24 <span className="text-neutral-text/20 text-sm">/ 48</span></div>
                    </div>
                    <div className="bg-neutral-bg p-5 border-l-4 border-primary">
                        <label className="academic-label">Metric Dataset</label>
                        <div className="text-2xl font-black text-neutral-text">15 <span className="text-neutral-text/20 text-sm">IDENTIFIED</span></div>
                    </div>
                </div>

                <div className="flex gap-4 relative z-10">
                    <button className="flex-1 btn-primary py-4 text-xs">
                        <Play size={16} fill="white" className="mr-2" /> {i === 1 ? 'ENGAGE CONSOLE' : 'ACTIVATE UNIT'}
                    </button>
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

const QuestionsTab = () => (
    <div className="bg-white border-2 border-neutral-text/10 shadow-[12px_12px_0px_0px_rgba(30,58,138,0.05)] overflow-hidden">
        <div className="p-8 border-b-2 border-neutral-text/5 flex justify-between items-center bg-neutral-bg/50">
            <div className="flex gap-4">
                <button className="px-5 py-3 bg-white border-2 border-neutral-text/10 text-[10px] font-black uppercase tracking-widest hover:border-primary transition-colors flex items-center gap-3">
                    <Filter size={14} /> Dataset Filtration
                </button>
            </div>
            <span className="text-[10px] font-black text-neutral-text/40 uppercase tracking-widest">Repository Index: 250 Total Entries</span>
        </div>
        <table className="w-full text-left">
            <thead>
                <tr className="border-b-2 border-neutral-text/5 bg-neutral-bg/30">
                    <th className="px-10 py-6 academic-label">Thesis Abstract</th>
                    <th className="px-10 py-6 academic-label">Complexity Scale</th>
                    <th className="px-10 py-6 academic-label text-right">Administrative</th>
                </tr>
            </thead>
            <tbody className="divide-y-2 divide-neutral-text/5">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <tr key={i} className="hover:bg-primary/[0.02] transition-colors group">
                        <td className="px-10 py-8">
                            <div className="font-bold text-neutral-text text-lg mb-2 group-hover:text-primary transition-colors font-serif">What constitutes the primary object of Scientific Socialism research?</div>
                            <div className="flex items-center gap-3">
                                <span className="text-[9px] font-black text-neutral-text/40 uppercase tracking-widest">Section: Unit 01.04</span>
                                <div className="w-1 h-1 bg-neutral-text/20 rounded-full" />
                                <span className="text-[9px] font-black text-primary uppercase tracking-widest">UID_QUE_77812</span>
                            </div>
                        </td>
                        <td className="px-10 py-8">
                            <span className={`inline-block px-3 py-1 text-[9px] font-black uppercase tracking-widest border-2 ${i % 3 === 0 ? 'border-primary text-primary' :
                                i % 3 === 1 ? 'border-accent-blue text-accent-blue' :
                                    'border-neutral-text/20 text-neutral-text/40'
                                }`}>
                                {i % 3 === 0 ? 'Critical' : i % 3 === 1 ? 'Intermediate' : 'Foundational'}
                            </span>
                        </td>
                        <td className="px-10 py-8 text-right">
                            <div className="flex gap-6 justify-end">
                                <button className="text-accent-blue font-black text-[10px] uppercase tracking-widest hover:underline cursor-pointer">Modify</button>
                                <button className="text-primary font-black text-[10px] uppercase tracking-widest hover:underline cursor-pointer">Redact</button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const LiveTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white p-10 border-2 border-neutral-text/5 shadow-[12px_12px_0px_0px_rgba(153,27,27,0.05)]">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <label className="academic-label">Active Monitoring</label>
                    <h3 className="text-2xl font-black text-neutral-text uppercase tracking-tighter font-serif">Unit Registry: MLN131-VNU-2027</h3>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary border-2 border-primary/10">
                    <div className="w-2 h-2 bg-primary animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest">LIVE_DUR: 00:45:12</span>
                </div>
            </div>

            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex items-center gap-6 p-6 border-2 border-neutral-text/5 hover:border-primary transition-all group">
                        <div className="w-12 h-12 bg-neutral-text/5 flex items-center justify-center font-black group-hover:bg-primary group-hover:text-white transition-colors">#{i}</div>
                        <div className="flex-1">
                            <div className="font-bold text-neutral-text text-base">RESPONDENT_UNIT_{778 + i}</div>
                            <div className="text-[9px] text-neutral-text/40 uppercase font-black tracking-[0.2em] mt-1">Executing Thesis: 04.12 / 15</div>
                        </div>
                        <div className="text-right">
                            <div className="font-black text-2xl text-neutral-text leading-none">{15000 - i * 1000}</div>
                            <label className="academic-label !mb-0 mt-1 !text-primary/40">Efficiency pt</label>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="space-y-10">
            <div className="bg-neutral-text p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 pattern-dots opacity-10 text-primary rotate-45" />
                <label className="academic-label !text-white/40 mb-8">System Telemetry</label>
                <div className="space-y-8 relative z-10">
                    <StatItem label="Connectivity Index" value="48 / 50" icon={<UsersIcon size={16} />} />
                    <StatItem label="Mean Response Time" value="12.4s" icon={<Calendar size={16} />} />
                    <StatItem label="Theoretical Accuracy" value="76%" icon={<UserCheck size={16} />} />
                </div>
            </div>

            <div className="bg-white p-10 border-2 border-neutral-text/5 shadow-[12px_12px_0px_0px_rgba(153,27,27,0.05)]">
                <label className="academic-label text-center mb-6">Tactical Controls</label>
                <div className="grid grid-cols-1 gap-4">
                    <button className="w-full py-4 border-2 border-neutral-text/10 text-[10px] font-black text-neutral-text hover:border-primary hover:text-primary transition-all uppercase tracking-widest">SUSPEND PROTOCOL</button>
                    <button className="w-full py-4 border-2 border-neutral-text/10 text-[10px] font-black text-neutral-text hover:border-primary hover:text-primary transition-all uppercase tracking-widest">REDACT THESIS</button>
                </div>
            </div>
        </div>
    </div>
);
