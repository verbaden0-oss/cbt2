import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Wind, Heart, Clock, ArrowLeft,
    AlertTriangle, Lightbulb, Shield,
    Sparkles, CheckCircle, Circle,
    Footprints, Phone, Music, Shower,
    Dumbbell, Book, Coffee, PenTool
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function SOSMode() {
    const [timer, setTimer] = useState(10 * 60); // 10 minutes
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [selectedHelp, setSelectedHelp] = useState<string | null>(null);
    const [urgeIntensity, setUrgeIntensity] = useState(5);

    // Timer countdown
    useEffect(() => {
        if (!isTimerActive || timer <= 0) return;

        const interval = setInterval(() => {
            setTimer(t => t - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [isTimerActive, timer]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const quickActions = [
        {
            id: 'breathe',
            icon: <Wind className="w-6 h-6" />,
            title: 'Дышать',
            subtitle: '4-7-8',
            link: '/breathing',
            color: 'bg-teal-500'
        },
        {
            id: 'remind',
            icon: <Heart className="w-6 h-6" />,
            title: 'Почему я бросаю',
            subtitle: 'Напоминание',
            action: () => setSelectedHelp('reasons'),
            color: 'bg-rose-500'
        },
        {
            id: 'distract',
            icon: <Lightbulb className="w-6 h-6" />,
            title: 'Отвлечься',
            subtitle: 'Действия',
            action: () => setSelectedHelp('distract'),
            color: 'bg-amber-500'
        },
        {
            id: 'timer',
            icon: <Clock className="w-6 h-6" />,
            title: 'Подождать',
            subtitle: '10 минут',
            action: () => setIsTimerActive(true),
            color: 'bg-purple-500'
        },
    ];

    const reasons = [
        'Деньги нужны на важные вещи',
        'Семья и близкие страдают',
        'Я хочу быть свободным от этого',
        'Каждый день без игры — победа',
        'Я сильнее чем желание',
        'Выигрыш — иллюзия, проигрыш — реальность',
    ];

    const distractions = [
        { icon: Footprints, text: 'Прогулка на свежем воздухе' },
        { icon: Phone, text: 'Позвонить другу/близкому' },
        { icon: Music, text: 'Включить музыку' },
        { icon: Shower, text: 'Холодный душ' },
        { icon: Dumbbell, text: '10 отжиманий' },
        { icon: Book, text: 'Почитать что-нибудь' },
        { icon: Coffee, text: 'Заварить чай' },
        { icon: PenTool, text: 'Записать мысли в дневник' },
    ];

    return (
        <div className="min-h-[80vh] space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link to="/" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-xl font-bold">Экстренная помощь</h1>
            </div>

            {/* Urge Meter */}
            <Card className="text-center">
                <p className="text-sm text-text-secondary mb-3">Насколько сильное желание? (1-10)</p>
                <div className="flex justify-between items-center gap-2 mb-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                        <button
                            key={n}
                            onClick={() => setUrgeIntensity(n)}
                            className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${urgeIntensity === n
                                    ? n <= 3 ? 'bg-green-500 text-white scale-110'
                                        : n <= 6 ? 'bg-yellow-500 text-white scale-110'
                                            : 'bg-red-500 text-white scale-110'
                                    : 'bg-gray-100 dark:bg-gray-800 text-text-secondary'
                                }`}
                        >
                            {n}
                        </button>
                    ))}
                </div>
                <p className="text-xs text-text-secondary flex items-center justify-center gap-2">
                    {urgeIntensity <= 3 && (
                        <>
                            <Sparkles className="w-4 h-4 text-green-500" />
                            <span>Отлично! Желание слабое.</span>
                        </>
                    )}
                    {urgeIntensity > 3 && urgeIntensity <= 6 && (
                        <>
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            <span>Среднее желание. Используй техники.</span>
                        </>
                    )}
                    {urgeIntensity > 6 && (
                        <>
                            <Circle className="w-4 h-4 text-red-500 fill-red-500" />
                            <span>Сильное желание. Действуй сейчас!</span>
                        </>
                    )}
                </p>
            </Card>

            {/* Timer (if active) */}
            {isTimerActive && (
                <Card className="text-center bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                    <div className="text-4xl font-mono font-bold text-primary mb-2">
                        {formatTime(timer)}
                    </div>
                    <p className="text-text-secondary text-sm mb-3 flex items-center justify-center gap-2">
                        {timer > 0 ? (
                            <span>Подожди. Желание пройдёт.</span>
                        ) : (
                            <>
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>10 минут прошло!</span>
                            </>
                        )}
                    </p>
                    {timer > 0 && (
                        <Button variant="ghost" size="sm" onClick={() => setIsTimerActive(false)}>
                            Отменить
                        </Button>
                    )}
                </Card>
            )}

            {/* Quick Actions */}
            {!selectedHelp && (
                <div className="grid grid-cols-2 gap-3">
                    {quickActions.map(action => (
                        action.link ? (
                            <Link key={action.id} to={action.link}>
                                <Card className={`${action.color} text-white border-none hover:scale-[1.02] transition-transform h-full`}>
                                    <div className="flex flex-col items-center text-center py-2">
                                        {action.icon}
                                        <span className="font-bold mt-2">{action.title}</span>
                                        <span className="text-xs text-white/80">{action.subtitle}</span>
                                    </div>
                                </Card>
                            </Link>
                        ) : (
                            <Card
                                key={action.id}
                                className={`${action.color} text-white border-none hover:scale-[1.02] transition-transform cursor-pointer`}
                                onClick={action.action}
                            >
                                <div className="flex flex-col items-center text-center py-2">
                                    {action.icon}
                                    <span className="font-bold mt-2">{action.title}</span>
                                    <span className="text-xs text-white/80">{action.subtitle}</span>
                                </div>
                            </Card>
                        )
                    ))}
                </div>
            )}

            {/* Reasons Panel */}
            {selectedHelp === 'reasons' && (
                <Card className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold flex items-center gap-2">
                            <Heart className="w-5 h-5 text-rose-500" />
                            Почему я бросаю
                        </h3>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedHelp(null)}>
                            ✕
                        </Button>
                    </div>
                    <div className="space-y-2">
                        {reasons.map((reason, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
                                <Shield className="w-4 h-4 text-rose-500 flex-shrink-0" />
                                <span className="text-sm">{reason}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Distractions Panel */}
            {selectedHelp === 'distract' && (
                <Card className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-amber-500" />
                            Отвлечься
                        </h3>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedHelp(null)}>
                            ✕
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {distractions.map((item, i) => {
                            const IconComponent = item.icon;
                            return (
                                <div key={i} className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-sm flex items-center gap-2">
                                    <IconComponent className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                                    <span>{item.text}</span>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            )}

            {/* Reminder */}
            <Card className="text-center text-sm text-text-secondary">
                <AlertTriangle className="w-5 h-5 mx-auto mb-2 text-warning" />
                <p>Желание играть — это волна. Оно нарастает, достигает пика и проходит. Подожди 15-20 минут.</p>
            </Card>
        </div>
    );
}
