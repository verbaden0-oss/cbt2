import React, { useEffect, useState } from 'react';
import { useTriggersStore } from '../store/triggersStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function Triggers() {
    const triggers = useTriggersStore((s) => s.triggers);
    const fetchTriggers = useTriggersStore((s) => s.fetchTriggers);
    const addTrigger = useTriggersStore((s) => s.addTrigger);
    const deleteTrigger = useTriggersStore((s) => s.deleteTrigger);

    const [name, setName] = useState('');
    const [category, setCategory] = useState('General');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchTriggers();
    }, [fetchTriggers]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!name) return;
        setIsLoading(true);
        await addTrigger({ name, category });
        setName('');
        setIsLoading(false);
    }

    async function handleDelete(id: number) {
        if (window.confirm('Вы уверены, что хотите удалить этот триггер?')) {
            await deleteTrigger(id);
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="text-center mb-8 space-y-2">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    Мои Триггеры
                </h1>
                <p className="text-text-secondary">
                    Определи и отслеживай свои триггеры, чтобы лучше справляться с ними
                </p>
            </div>

            <div className="grid md:grid-cols-[350px,1fr] gap-8">
                {/* Add New Trigger Form */}
                <div className="space-y-6">
                    <Card>
                        <h2 className="text-xl font-bold mb-4">Добавить триггер</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Название триггера"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Например: Стресс на работе"
                                required
                            />

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-text-secondary">
                                    Категория
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="glass-input w-full"
                                >
                                    <option value="General">Общее</option>
                                    <option value="Emotional">Эмоциональное</option>
                                    <option value="Environmental">Окружение</option>
                                    <option value="Social">Социальное</option>
                                </select>
                            </div>

                            <Button type="submit" fullWidth isLoading={isLoading}>
                                Добавить
                            </Button>
                        </form>
                    </Card>

                    <Card className="bg-primary/5 border-primary/20">
                        <h3 className="font-semibold text-primary mb-2">Совет</h3>
                        <p className="text-sm text-text-secondary">
                            Триггеры — это ситуации, эмоции или люди, которые вызывают желание вернуться к старым привычкам. Честность с собой — первый шаг к свободе.
                        </p>
                    </Card>
                </div>

                {/* Triggers List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold mb-4">Ваши триггеры</h2>

                    {triggers.length === 0 ? (
                        <div className="text-center py-12 text-text-secondary bg-white/5 rounded-xl border border-white/10">
                            <p>Пока нет добавленных триггеров.</p>
                            <p className="text-sm mt-2">Добавьте первый триггер слева.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {triggers.map((t) => (
                                <Card key={t.id} className="group hover:border-primary/30 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-lg text-text-primary">{t.name}</h3>
                                            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                                                {t.category === 'General' && 'Общее'}
                                                {t.category === 'Emotional' && 'Эмоциональное'}
                                                {t.category === 'Environmental' && 'Окружение'}
                                                {t.category === 'Social' && 'Социальное'}
                                            </span>
                                        </div>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => t.id && handleDelete(t.id)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            Удалить
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
