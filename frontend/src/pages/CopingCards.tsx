import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Lightbulb } from 'lucide-react';

interface CopingCard {
    id: number;
    negativeThought: string;
    copingResponse: string;
    category: string;
}

const defaultCards: CopingCard[] = [
    {
        id: 1,
        negativeThought: 'Я не смогу справиться',
        copingResponse: 'Я справлялся с трудностями раньше и справлюсь снова. Одна проблема за раз.',
        category: 'Самооценка'
    },
    {
        id: 2,
        negativeThought: 'Один раз — не считается, могу позволить себе...',
        copingResponse: 'Это ловушка мышления. Один раз запускает цикл. Я заслуживаю свободы, а не временного облегчения.',
        category: 'Зависимость'
    },
    {
        id: 3,
        negativeThought: 'Все бессмысленно',
        copingResponse: 'Это чувство временное. Завтра я буду думать иначе. Сейчас — просто продержаться.',
        category: 'Депрессия'
    },
    {
        id: 4,
        negativeThought: 'Я слишком слабый',
        copingResponse: 'Признать проблему и бороться — это сила, а не слабость. Я уже делаю шаги вперёд.',
        category: 'Самооценка'
    },
    {
        id: 5,
        negativeThought: 'Меня никто не понимает',
        copingResponse: 'Я не одинок. Миллионы людей проходят через подобное. Я могу найти поддержку.',
        category: 'Одиночество'
    },
];

const categories = ['Все', 'Самооценка', 'Зависимость', 'Депрессия', 'Одиночество'];

export default function CopingCards() {
    const [cards, setCards] = useState<CopingCard[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('Все');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newNegative, setNewNegative] = useState('');
    const [newCoping, setNewCoping] = useState('');
    const [newCategory, setNewCategory] = useState('Самооценка');
    const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

    useEffect(() => {
        const saved = localStorage.getItem('copingCards');
        if (saved) {
            setCards(JSON.parse(saved));
        } else {
            setCards(defaultCards);
            localStorage.setItem('copingCards', JSON.stringify(defaultCards));
        }
    }, []);

    const saveCards = (newCards: CopingCard[]) => {
        setCards(newCards);
        localStorage.setItem('copingCards', JSON.stringify(newCards));
    };

    const toggleFlip = (id: number) => {
        setFlippedCards(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const handleAddCard = () => {
        if (!newNegative.trim() || !newCoping.trim()) return;

        const newCard: CopingCard = {
            id: Date.now(),
            negativeThought: newNegative,
            copingResponse: newCoping,
            category: newCategory
        };

        saveCards([...cards, newCard]);
        setNewNegative('');
        setNewCoping('');
        setShowAddForm(false);
    };

    const handleDeleteCard = (id: number) => {
        if (window.confirm('Удалить эту карточку?')) {
            saveCards(cards.filter(c => c.id !== id));
        }
    };

    const filteredCards = selectedCategory === 'Все'
        ? cards
        : cards.filter(c => c.category === selectedCategory);

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="text-center mb-8 space-y-2">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    Копинг-карточки
                </h1>
                <p className="text-text-secondary">
                    Быстрые ответы на негативные мысли — нажмите на карточку, чтобы перевернуть
                </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center mb-6">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat
                                ? 'bg-primary text-white'
                                : 'bg-white/10 text-text-secondary hover:bg-white/20'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Add Button */}
            <div className="text-center mb-6">
                <Button onClick={() => setShowAddForm(true)}>
                    + Добавить свою карточку
                </Button>
            </div>

            {/* Add Form Modal */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <Card className="max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Новая карточка</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                    Негативная мысль
                                </label>
                                <textarea
                                    value={newNegative}
                                    onChange={(e) => setNewNegative(e.target.value)}
                                    placeholder="Я никогда не справлюсь..."
                                    className="glass-input w-full h-20 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                    Копинг-ответ
                                </label>
                                <textarea
                                    value={newCoping}
                                    onChange={(e) => setNewCoping(e.target.value)}
                                    placeholder="Рациональный, поддерживающий ответ..."
                                    className="glass-input w-full h-24 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                    Категория
                                </label>
                                <select
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    className="glass-input w-full"
                                >
                                    {categories.filter(c => c !== 'Все').map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <Button variant="ghost" fullWidth onClick={() => setShowAddForm(false)}>
                                Отмена
                            </Button>
                            <Button fullWidth onClick={handleAddCard}>
                                Добавить
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCards.map(card => (
                    <div
                        key={card.id}
                        onClick={() => toggleFlip(card.id)}
                        className="cursor-pointer perspective-1000"
                    >
                        <div className={`relative transition-transform duration-500 transform-style-3d ${flippedCards.has(card.id) ? 'rotate-y-180' : ''
                            }`} style={{ minHeight: '180px' }}>
                            {/* Front - Negative Thought */}
                            <Card className={`absolute inset-0 backface-hidden ${flippedCards.has(card.id) ? 'invisible' : ''
                                } bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/30`}>
                                <div className="flex flex-col h-full justify-between">
                                    <div>
                                        <span className="text-xs px-2 py-0.5 bg-error/20 text-error rounded-full">
                                            {card.category}
                                        </span>
                                        <p className="mt-3 font-medium text-error">
                                            "{card.negativeThought}"
                                        </p>
                                    </div>
                                    <p className="text-xs text-text-secondary mt-4">
                                        Нажмите, чтобы увидеть ответ →
                                    </p>
                                </div>
                            </Card>

                            {/* Back - Coping Response */}
                            <Card className={`absolute inset-0 backface-hidden rotate-y-180 ${!flippedCards.has(card.id) ? 'invisible' : ''
                                } bg-gradient-to-br from-green-500/10 to-teal-500/10 border-green-500/30`}>
                                <div className="flex flex-col h-full justify-between">
                                    <div>
                                        <span className="text-xs px-2 py-0.5 bg-success/20 text-success rounded-full">
                                            Ответ
                                        </span>
                                        <p className="mt-3 text-success">
                                            {card.copingResponse}
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-center mt-4">
                                        <p className="text-xs text-text-secondary">
                                            ← Нажмите, чтобы вернуться
                                        </p>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDeleteCard(card.id); }}
                                            className="text-xs text-error hover:underline"
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                ))}
            </div>

            {filteredCards.length === 0 && (
                <div className="text-center py-12 text-text-secondary">
                    <p>Нет карточек в этой категории</p>
                </div>
            )}

            {/* Tips */}
            <Card className="mt-8 bg-primary/5 border-primary/20">
                <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" strokeWidth={2} />
                    Как использовать
                </h3>
                <ul className="text-sm text-text-secondary space-y-1">
                    <li>• Когда чувствуете негативные мысли — откройте карточки</li>
                    <li>• Найдите мысль, похожую на вашу</li>
                    <li>• Прочитайте ответ вслух</li>
                    <li>• Создавайте свои карточки для персонализации</li>
                </ul>
            </Card>
        </div>
    );
}
