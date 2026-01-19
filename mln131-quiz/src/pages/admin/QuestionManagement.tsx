import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { gameService } from '../../lib/gameService';
import type { Question } from '../../lib/gameService';

export const QuestionManagement: React.FC = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [formData, setFormData] = useState({
        question: '',
        options: ['', '', '', ''],
        correct_index: 0,
        difficulty: 'Bình thường' as 'Dễ' | 'Bình thường' | 'Khó'
    });

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const data = await gameService.getQuestions();
            setQuestions(data);
        } catch (err) {
            console.error('Fetch questions error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form data
        if (!formData.question.trim()) {
            alert('Vui lòng nhập câu hỏi');
            return;
        }

        if (formData.options.some(opt => !opt.trim())) {
            alert('Vui lòng nhập đầy đủ 4 đáp án');
            return;
        }

        if (formData.correct_index < 0 || formData.correct_index > 3) {
            alert('Vui lòng chọn đáp án đúng');
            return;
        }

        try {
            if (editingQuestion) {
                // Update existing question
                await gameService.updateQuestion(editingQuestion.id, {
                    content: formData
                });
            } else {
                // Create new question
                await gameService.createQuestion({
                    content: formData
                });
            }

            await fetchQuestions();
            handleCloseModal();
        } catch (err: any) {
            console.error('Save question error:', err);
            const errorMessage = err?.message || err?.error?.message || 'Có lỗi xảy ra khi lưu câu hỏi';
            alert(`Lỗi: ${errorMessage}`);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa câu hỏi này?')) return;

        try {
            await gameService.deleteQuestion(id);
            await fetchQuestions();
        } catch (err) {
            console.error('Delete question error:', err);
            alert('Có lỗi xảy ra khi xóa câu hỏi');
        }
    };

    const handleEdit = (question: Question) => {
        setEditingQuestion(question);
        setFormData({
            ...question.content,
            difficulty: question.content.difficulty as 'Dễ' | 'Bình thường' | 'Khó'
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingQuestion(null);
        setFormData({
            question: '',
            options: ['', '', '', ''],
            correct_index: 0,
            difficulty: 'Bình thường'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-bg">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-bg p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin')}
                            className="w-12 h-12 bg-neutral-text/5 hover:bg-neutral-text/10 flex items-center justify-center transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-4xl font-black text-neutral-text uppercase tracking-tight">
                                Kho Câu Hỏi
                            </h1>
                            <p className="text-sm text-neutral-muted font-bold mt-1">
                                Tổng số: {questions.length} câu hỏi
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-primary"
                    >
                        <Plus size={20} />
                        <span>Thêm Câu Hỏi</span>
                    </button>
                </div>

                {/* Questions List */}
                <div className="space-y-4">
                    {questions.map((question, index) => (
                        <motion.div
                            key={question.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="glass-card p-6"
                        >
                            <div className="flex items-start gap-6">
                                <div className="w-12 h-12 bg-primary text-white flex items-center justify-center font-black text-xl flex-shrink-0">
                                    {index + 1}
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-bold text-lg text-neutral-text mb-3">
                                        {question.content.question}
                                    </h3>

                                    <div className="grid grid-cols-2 gap-2 mb-3">
                                        {question.content.options.map((option, i) => (
                                            <div
                                                key={i}
                                                className={`p-2 text-sm border-2 ${i === question.content.correct_index
                                                        ? 'border-primary bg-primary/5 font-bold'
                                                        : 'border-neutral-text/10'
                                                    }`}
                                            >
                                                {String.fromCharCode(65 + i)}. {option}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className={`text-xs font-black px-3 py-1 ${question.content.difficulty === 'Dễ' ? 'bg-green-100 text-green-700' :
                                                question.content.difficulty === 'Khó' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {question.content.difficulty}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => handleEdit(question)}
                                        className="w-10 h-10 bg-secondary/10 hover:bg-secondary hover:text-white text-secondary flex items-center justify-center transition-colors"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(question.id)}
                                        className="w-10 h-10 bg-primary/10 hover:bg-primary hover:text-white text-primary flex items-center justify-center transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Create/Edit Modal */}
                <AnimatePresence>
                    {showModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                            onClick={handleCloseModal}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                            >
                                <div className="p-6 border-b-2 border-neutral-text/10 flex items-center justify-between">
                                    <h2 className="text-2xl font-black uppercase">
                                        {editingQuestion ? 'Sửa Câu Hỏi' : 'Thêm Câu Hỏi Mới'}
                                    </h2>
                                    <button
                                        onClick={handleCloseModal}
                                        className="w-10 h-10 hover:bg-neutral-text/5 flex items-center justify-center transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                    {/* Question */}
                                    <div>
                                        <label className="academic-label mb-2">Câu hỏi</label>
                                        <textarea
                                            value={formData.question}
                                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                            className="input-field min-h-[100px]"
                                            required
                                        />
                                    </div>

                                    {/* Options */}
                                    <div>
                                        <label className="academic-label mb-2">Các đáp án</label>
                                        <div className="space-y-3">
                                            {formData.options.map((option, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <input
                                                        type="radio"
                                                        name="correct"
                                                        checked={formData.correct_index === i}
                                                        onChange={() => setFormData({ ...formData, correct_index: i })}
                                                        className="w-5 h-5"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={option}
                                                        onChange={(e) => {
                                                            const newOptions = [...formData.options];
                                                            newOptions[i] = e.target.value;
                                                            setFormData({ ...formData, options: newOptions });
                                                        }}
                                                        placeholder={`Đáp án ${String.fromCharCode(65 + i)}`}
                                                        className="input-field flex-1"
                                                        required
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-xs text-neutral-muted mt-2">
                                            * Chọn radio button để đánh dấu đáp án đúng
                                        </p>
                                    </div>

                                    {/* Difficulty */}
                                    <div>
                                        <label className="academic-label mb-2">Độ khó</label>
                                        <select
                                            value={formData.difficulty}
                                            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                                            className="input-field"
                                        >
                                            <option value="Dễ">Dễ</option>
                                            <option value="Bình thường">Bình thường</option>
                                            <option value="Khó">Khó</option>
                                        </select>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        <button type="submit" className="btn-primary flex-1">
                                            <Save size={20} />
                                            <span>{editingQuestion ? 'Cập nhật' : 'Tạo mới'}</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
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
        </div>
    );
};
