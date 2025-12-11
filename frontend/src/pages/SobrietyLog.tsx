import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSobrietyStore } from '../store/sobrietyStore';
import { useTriggersStore } from '../store/triggersStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function SobrietyLog() {
    const navigate = useNavigate();
    const log = useSobrietyStore((s) => s.log);
    const fetchLog = useSobrietyStore((s) => s.fetchLog);
    const updateLog = useSobrietyStore((s) => s.updateLog);
    const triggers = useTriggersStore((s) => s.triggers);
    const fetchTriggers = useTriggersStore((s) => s.fetchTriggers);

    const [startDate, setStartDate] = useState('');
    const [showRelapseModal, setShowRelapseModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [relapseReason, setRelapseReason] = useState('');
    const [relapseTriggers, setRelapseTriggers] = useState<number[]>([]);

    useEffect(() => {
        fetchLog();
        fetchTriggers();
    }, [fetchLog, fetchTriggers]);

    useEffect(() => {
        if (log) {
            const date = new Date(log.start_date);
            setStartDate(date.toISOString().split('T')[0]);
        }
    }, [log]);

    const toggleTrigger = (id: number) => {
        setRelapseTriggers(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    async function handleUpdate(e: React.FormEvent) {
        e.preventDefault();
        if (!startDate) return;

        const relapses = log?.relapses_json || [];

        await updateLog({
            start_date: new Date(startDate).toISOString(),
            relapses_json: relapses,
        });
    }

    async function handleRelapse() {
        const today = new Date().toISOString();
        const relapses = log?.relapses_json || [];

        const triggerNames = relapseTriggers.map(id => {
            const t = triggers.find(tr => tr.id === id);
            return t ? t.name : '';
        }).filter(Boolean);

        await updateLog({
            start_date: today,
            relapses_json: [...relapses, {
                date: today,
                reason: relapseReason || 'Не указана',
                triggers: triggerNames
            }],
        });
        setStartDate(today.split('T')[0]);
        setShowRelapseModal(false);
        setRelapseReason('');
        setRelapseTriggers([]);
        setShowSuccessModal(true);
    }

    function handleCBTRedirect() {
        setShowSuccessModal(false);
        navigate('/cbt');
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="text-center mb-8 space-y-2">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    Трекер Трезвости
                </h1>
                <p className="text-text-secondary">
                    Следи за своим прогрессом и празднуй каждый день
                </p>
            </div>

            {/* Sobriety Counter - Big Visual */}
            <Card className="mb-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/30">
                <div className="text-center py-8">
                    <div className="text-sm uppercase tracking-wide text-text-secondary mb-3 font-semibold">
                        Дней трезвости
                    </div>
                    <div className="text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-2 animate-pulse-slow">
                        {log ? log.current_streak : 0}
                    </div>
                    <div className="text-lg text-text-secondary">
                        {log && log.current_streak === 1 ? 'день' :
                            log && log.current_streak >= 2 && log.current_streak <= 4 ? 'дня' : 'дней'}
                    </div>

                    {log && log.current_streak > 0 && (
                        <div className="mt-6 text-sm text-text-secondary">
                            Начало: {new Date(log.start_date).toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </div>
                    )}
                </div>

                {/* Milestone Messages */}
                {log && log.current_streak >= 1 && (
                    <div className="border-t border-white/10 pt-6 text-center">
                        {log.current_streak === 1 && (
                            <p className="text-success font-semibold animate-fade-in">🎉 Отличное начало! Первый день — самый важный!</p>
                        )}
                        {log.current_streak === 7 && (
                            <p className="text-success font-semibold animate-fade-in">🌟 Неделя трезвости! Ты молодец!</p>
                        )}
                        {log.current_streak === 30 && (
                            <p className="text-success font-semibold animate-fade-in">🏆 Месяц! Это серьезное достижение!</p>
                        )}
                        {log.current_streak === 90 && (
                            <p className="text-success font-semibold animate-fade-in">💎 90 дней — ты невероятен!</p>
                        )}
                        {log.current_streak >= 365 && (
                            <p className="text-success font-semibold animate-fade-in">👑 ГОД ТРЕЗВОСТИ! Ты легенда!</p>
                        )}
                    </div>
                )}
            </Card>

            {/* Settings */}
            <Card className="mb-6">
                <h2 className="text-xl font-bold mb-4">Настройки</h2>
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            Дата начала трезвости
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="glass-input w-full"
                        />
                    </div>
                    <Button type="submit" fullWidth variant="secondary">
                        Обновить дату
                    </Button>
                </form>
            </Card>

            {/* Relapse Button */}
            <Card className="bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30">
                <h3 className="text-lg font-bold text-error mb-2">Срыв?</h3>
                <p className="text-sm text-text-secondary mb-4">
                    Срыв — это не конец. Это часть процесса. Главное — продолжать.
                </p>
                <Button
                    variant="danger"
                    fullWidth
                    onClick={() => setShowRelapseModal(true)}
                >
                    Отметить срыв
                </Button>
            </Card>

            {/* Relapse Confirmation Modal */}
            {showRelapseModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <Card className="max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Отметить срыв</h3>
                        <p className="text-text-secondary mb-4">
                            Это сбросит ваш текущий счетчик дней, но поможет отслеживать паттерны.
                        </p>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                    Что стало причиной?
                                </label>
                                <textarea
                                    value={relapseReason}
                                    onChange={(e) => setRelapseReason(e.target.value)}
                                    placeholder="Опишите обстоятельства..."
                                    className="glass-input w-full h-20 resize-none"
                                />
                            </div>

                            {triggers.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">
                                        Какие триггеры были активны?
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {triggers.map((t) => (
                                            <button
                                                key={t.id}
                                                type="button"
                                                onClick={() => t.id && toggleTrigger(t.id)}
                                                className={`px-3 py-1 rounded-full text-sm transition-all ${t.id && relapseTriggers.includes(t.id)
                                                        ? 'bg-error text-white'
                                                        : 'bg-white/10 text-text-secondary hover:bg-white/20'
                                                    }`}
                                            >
                                                {t.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <p className="text-sm text-text-secondary mb-4 italic">
                            Помните: один шаг назад не отменяет весь прогресс.
                        </p>
                        <div className="flex gap-3">
                            <Button
                                variant="ghost"
                                fullWidth
                                onClick={() => setShowRelapseModal(false)}
                            >
                                Отмена
                            </Button>
                            <Button
                                variant="danger"
                                fullWidth
                                onClick={handleRelapse}
                            >
                                Подтвердить
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Success Modal with CBT Suggestion */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <Card className="max-w-md w-full text-center">
                        <div className="text-4xl mb-4">💪</div>
                        <h3 className="text-xl font-bold mb-2">Счётчик сброшен</h3>
                        <p className="text-text-secondary mb-6">
                            Срыв записан. Самое важное сейчас — не сдаваться. Хотите сделать КПТ упражнение, чтобы проработать негативные мысли?
                        </p>
                        <div className="flex gap-3">
                            <Button
                                variant="ghost"
                                fullWidth
                                onClick={() => setShowSuccessModal(false)}
                            >
                                Позже
                            </Button>
                            <Button
                                variant="accent"
                                fullWidth
                                onClick={handleCBTRedirect}
                            >
                                Начать упражнение
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
