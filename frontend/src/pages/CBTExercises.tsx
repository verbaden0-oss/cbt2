import React, { useEffect, useState } from 'react';
import { useCBTStore } from '../store/cbtStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Zap, Waves, Brain, Wind, Globe, Cards, Sparkles } from 'lucide-react';

export default function CBTExercises() {
    const exercises = useCBTStore((s) => s.exercises);
    const fetchExercises = useCBTStore((s) => s.fetchExercises);
    const addExercise = useCBTStore((s) => s.addExercise);

    const [activeTab, setActiveTab] = useState<'list' | 'new'>('list');
    const [situation, setSituation] = useState('');
    const [automaticThought, setAutomaticThought] = useState('');
    const [challenge, setChallenge] = useState('');
    const [rationalThought, setRationalThought] = useState('');

    useEffect(() => {
        fetchExercises();
    }, [fetchExercises]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const content = {
            situation,
            automaticThought,
            challenge,
            rationalThought,
        };
        await addExercise({
            type: 'cognitive_restructuring',
            content_json: content,
        });
        setSituation('');
        setAutomaticThought('');
        setChallenge('');
        setRationalThought('');
        setActiveTab('list');
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="text-center mb-8 space-y-2">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    КПТ Упражнения
                </h1>
                <p className="text-text-secondary">
                    Работай с негативными мыслями и меняй их на позитивные
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <a href="/abc" className="block">
                    <Card className="text-center hover:border-primary/50 transition-all group h-full flex flex-col justify-center items-center">
                        <div className="mb-2 group-hover:scale-110 transition-transform">
                            <Zap className="w-8 h-8 text-primary mx-auto" strokeWidth={2} />
                        </div>
                        <h3 className="font-bold text-sm">ABC Анализ</h3>
                        <p className="text-xs text-text-secondary">Разбор ситуаций</p>
                    </Card>
                </a>
                <a href="/urge-surfing" className="block">
                    <Card className="text-center hover:border-primary/50 transition-all group h-full flex flex-col justify-center items-center">
                        <div className="mb-2 group-hover:scale-110 transition-transform">
                            <Waves className="w-8 h-8 text-primary mx-auto" strokeWidth={2} />
                        </div>
                        <h3 className="font-bold text-sm">Сёрфинг тяги</h3>
                        <p className="text-xs text-text-secondary">Переждать волну</p>
                    </Card>
                </a>
                <a href="/distortions" className="block">
                    <Card className="text-center hover:border-primary/50 transition-all group h-full flex flex-col justify-center items-center">
                        <div className="mb-2 group-hover:scale-110 transition-transform">
                            <Brain className="w-8 h-8 text-primary mx-auto" strokeWidth={2} />
                        </div>
                        <h3 className="font-bold text-sm">Ловушки мышления</h3>
                        <p className="text-xs text-text-secondary">Ошибки игрока</p>
                    </Card>
                </a>
                <a href="/breathing" className="block">
                    <Card className="text-center hover:border-primary/50 transition-all group h-full flex flex-col justify-center items-center">
                        <div className="mb-2 group-hover:scale-110 transition-transform">
                            <Wind className="w-8 h-8 text-primary mx-auto" strokeWidth={2} />
                        </div>
                        <h3 className="font-bold text-sm">Дыхание</h3>
                        <p className="text-xs text-text-secondary">4-7-8, Коробочное</p>
                    </Card>
                </a>
                <a href="/grounding" className="block">
                    <Card className="text-center hover:border-primary/50 transition-all group h-full flex flex-col justify-center items-center">
                        <div className="mb-2 group-hover:scale-110 transition-transform">
                            <Globe className="w-8 h-8 text-primary mx-auto" strokeWidth={2} />
                        </div>
                        <h3 className="font-bold text-sm">Заземление</h3>
                        <p className="text-xs text-text-secondary">Техника 5-4-3-2-1</p>
                    </Card>
                </a>
                <a href="/coping-cards" className="block">
                    <Card className="text-center hover:border-primary/50 transition-all group h-full flex flex-col justify-center items-center">
                        <div className="mb-2 group-hover:scale-110 transition-transform">
                            <Cards className="w-8 h-8 text-primary mx-auto" strokeWidth={2} />
                        </div>
                        <h3 className="font-bold text-sm">Копинг-карточки</h3>
                        <p className="text-xs text-text-secondary">Быстрые ответы</p>
                    </Card>
                </a>
            </div>

            {/* Tabs */}
            <div className="flex justify-center gap-4 mb-8">
                <Button
                    variant={activeTab === 'list' ? 'primary' : 'secondary'}
                    onClick={() => setActiveTab('list')}
                >
                    История
                </Button>
                <Button
                    variant={activeTab === 'new' ? 'primary' : 'secondary'}
                    onClick={() => setActiveTab('new')}
                >
                    Новое упражнение
                </Button>
            </div>

            {/* New Exercise Form */}
            {activeTab === 'new' && (
                <div className="max-w-3xl mx-auto">
                    <Card>
                        <h2 className="text-2xl font-bold mb-2">Когнитивная Реструктуризация</h2>
                        <p className="text-text-secondary mb-6">
                            Этот метод помогает выявить и изменить автоматические негативные мысли, которые влияют на ваши эмоции и поведение.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                                    <span className="text-primary font-bold">1.</span> Ситуация
                                </label>
                                <p className="text-xs text-text-secondary mb-2">
                                    Что произошло? Где вы были? Кто был рядом?
                                </p>
                                <textarea
                                    value={situation}
                                    onChange={(e) => setSituation(e.target.value)}
                                    placeholder="Например: Я сидел дома один в субботу вечером..."
                                    className="glass-input w-full h-24 resize-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                                    <span className="text-primary font-bold">2.</span> Автоматическая Мысль
                                </label>
                                <p className="text-xs text-text-secondary mb-2">
                                    Какая мысль пришла вам в голову? Что вы сказали себе?
                                </p>
                                <textarea
                                    value={automaticThought}
                                    onChange={(e) => setAutomaticThought(e.target.value)}
                                    placeholder="Например: Я никогда не смогу это преодолеть..."
                                    className="glass-input w-full h-24 resize-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                                    <span className="text-primary font-bold">3.</span> Оспаривание
                                </label>
                                <p className="text-xs text-text-secondary mb-2">
                                    Какие есть доказательства ЗА и ПРОТИВ этой мысли? Что бы вы сказали другу в такой ситуации?
                                </p>
                                <textarea
                                    value={challenge}
                                    onChange={(e) => setChallenge(e.target.value)}
                                    placeholder="Например: За: мне сейчас трудно. Против: я уже был трезв 5 дней, это прогресс..."
                                    className="glass-input w-full h-32 resize-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                                    <span className="text-primary font-bold">4.</span> Рациональный Ответ
                                </label>
                                <p className="text-xs text-text-secondary mb-2">
                                    Как можно взглянуть на ситуацию более сбалансированно? Какая альтернативная мысль?
                                </p>
                                <textarea
                                    value={rationalThought}
                                    onChange={(e) => setRationalThought(e.target.value)}
                                    placeholder="Например: Восстановление — это процесс. Я делаю успехи, даже если это происходит медленно..."
                                    className="glass-input w-full h-32 resize-none"
                                    required
                                />
                            </div>

                            <Button type="submit" fullWidth variant="accent">
                                Сохранить упражнение
                            </Button>
                        </form>
                    </Card>
                </div>
            )}

            {/* Exercise History */}
            {activeTab === 'list' && (
                <div className="space-y-4">
                    {exercises.length === 0 ? (
                        <div className="text-center py-12 text-text-secondary bg-white/5 rounded-xl border border-white/10">
                            <p className="mb-2">Пока нет упражнений.</p>
                            <Button onClick={() => setActiveTab('new')}>
                                Начать первое упражнение
                            </Button>
                        </div>
                    ) : (
                        exercises.map((ex) => {
                            const content = typeof ex.content_json === 'string' ? JSON.parse(ex.content_json) : ex.content_json;
                            return (
                                <Card key={ex.id} className="hover:scale-[1.01] transition-transform duration-200">
                                    <div className="text-xs text-text-secondary mb-4">
                                        {new Date(ex.completed_at!).toLocaleString('ru-RU', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <div className="text-sm font-semibold text-primary mb-1">Ситуация:</div>
                                            <div className="text-text-primary">{content.situation}</div>
                                        </div>

                                        <div>
                                            <div className="text-sm font-semibold text-error mb-1">Негативная мысль:</div>
                                            <div className="text-text-primary italic">{content.automaticThought}</div>
                                        </div>

                                        <div>
                                            <div className="text-sm font-semibold text-warning mb-1">Оспаривание:</div>
                                            <div className="text-text-primary">{content.challenge}</div>
                                        </div>

                                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                                            <div className="text-sm font-semibold text-success mb-1 flex items-center gap-1">
                                                <Sparkles className="w-4 h-4" strokeWidth={2} />
                                                Рациональный ответ:
                                            </div>
                                            <div className="text-text-primary">{content.rationalThought}</div>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}
