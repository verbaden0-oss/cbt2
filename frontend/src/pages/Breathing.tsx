import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'holdEmpty' | 'idle';

interface BreathingPattern {
    name: string;
    description: string;
    inhale: number;
    hold: number;
    exhale: number;
    holdEmpty?: number;
    cycles: number;
}

const patterns: BreathingPattern[] = [
    {
        name: '4-7-8 Расслабление',
        description: 'Глубокое расслабление и снижение тревоги',
        inhale: 4,
        hold: 7,
        exhale: 8,
        cycles: 4
    },
    {
        name: 'Коробочное дыхание',
        description: 'Используется спецназом для контроля стресса',
        inhale: 4,
        hold: 4,
        exhale: 4,
        holdEmpty: 4,
        cycles: 4
    },
    {
        name: 'Успокаивающее',
        description: 'Быстрое снятие напряжения',
        inhale: 4,
        hold: 2,
        exhale: 6,
        cycles: 6
    }
];

export default function Breathing() {
    const [selectedPattern, setSelectedPattern] = useState<BreathingPattern | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [phase, setPhase] = useState<BreathingPhase>('idle');
    const [timeLeft, setTimeLeft] = useState(0);
    const [currentCycle, setCurrentCycle] = useState(0);
    const [completed, setCompleted] = useState(false);

    const getPhaseText = (p: BreathingPhase): string => {
        switch (p) {
            case 'inhale': return 'Вдох';
            case 'hold': return 'Задержка';
            case 'exhale': return 'Выдох';
            case 'holdEmpty': return 'Пауза';
            default: return 'Готов?';
        }
    };

    const getPhaseColor = (p: BreathingPhase): string => {
        switch (p) {
            case 'inhale': return 'from-blue-500 to-cyan-500';
            case 'hold': return 'from-purple-500 to-pink-500';
            case 'exhale': return 'from-green-500 to-teal-500';
            case 'holdEmpty': return 'from-orange-500 to-yellow-500';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    const getCircleScale = (p: BreathingPhase): string => {
        switch (p) {
            case 'inhale': return 'scale-100';
            case 'hold': return 'scale-100';
            case 'exhale': return 'scale-50';
            case 'holdEmpty': return 'scale-50';
            default: return 'scale-75';
        }
    };

    const nextPhase = useCallback(() => {
        if (!selectedPattern) return;

        setPhase(prev => {
            switch (prev) {
                case 'idle':
                case 'inhale':
                    if (selectedPattern.hold > 0) {
                        setTimeLeft(selectedPattern.hold);
                        return 'hold';
                    }
                // fall through
                case 'hold':
                    setTimeLeft(selectedPattern.exhale);
                    return 'exhale';
                case 'exhale':
                    if (selectedPattern.holdEmpty) {
                        setTimeLeft(selectedPattern.holdEmpty);
                        return 'holdEmpty';
                    }
                // fall through
                case 'holdEmpty':
                    setCurrentCycle(c => c + 1);
                    setTimeLeft(selectedPattern.inhale);
                    return 'inhale';
                default:
                    return 'idle';
            }
        });
    }, [selectedPattern]);

    useEffect(() => {
        if (!isRunning || !selectedPattern) return;

        if (currentCycle >= selectedPattern.cycles) {
            setIsRunning(false);
            setCompleted(true);
            setPhase('idle');
            return;
        }

        if (timeLeft <= 0) {
            nextPhase();
            return;
        }

        const timer = setTimeout(() => {
            setTimeLeft(t => t - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [isRunning, timeLeft, currentCycle, selectedPattern, nextPhase]);

    const startExercise = (pattern: BreathingPattern) => {
        setSelectedPattern(pattern);
        setCurrentCycle(0);
        setTimeLeft(pattern.inhale);
        setPhase('inhale');
        setIsRunning(true);
        setCompleted(false);
    };

    const stopExercise = () => {
        setIsRunning(false);
        setPhase('idle');
        setCurrentCycle(0);
        setTimeLeft(0);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="text-center mb-8 space-y-2">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    Дыхательные Упражнения
                </h1>
                <p className="text-text-secondary">
                    Дыхание — мощный инструмент для контроля тревоги и стресса
                </p>
            </div>

            {!isRunning && !completed && (
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    {patterns.map((pattern, idx) => (
                        <Card key={idx} className="hover:border-primary/50 transition-all cursor-pointer" onClick={() => startExercise(pattern)}>
                            <h3 className="text-lg font-bold mb-2">{pattern.name}</h3>
                            <p className="text-sm text-text-secondary mb-4">{pattern.description}</p>
                            <div className="flex gap-2 text-xs text-text-secondary">
                                <span>Вдох: {pattern.inhale}с</span>
                                {pattern.hold > 0 && <span>• Держи: {pattern.hold}с</span>}
                                <span>• Выдох: {pattern.exhale}с</span>
                            </div>
                            <Button variant="secondary" fullWidth className="mt-4">
                                Начать
                            </Button>
                        </Card>
                    ))}
                </div>
            )}

            {isRunning && selectedPattern && (
                <div className="flex flex-col items-center justify-center py-12">
                    {/* Breathing Circle */}
                    <div className={`relative w-64 h-64 rounded-full bg-gradient-to-br ${getPhaseColor(phase)} flex items-center justify-center transition-all duration-1000 ease-in-out ${getCircleScale(phase)}`}>
                        <div className="absolute inset-2 rounded-full bg-background/90 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold">{timeLeft}</span>
                            <span className="text-xl font-medium text-text-secondary">{getPhaseText(phase)}</span>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="mt-8 text-center">
                        <span className="text-text-secondary">
                            Цикл {currentCycle + 1} из {selectedPattern.cycles}
                        </span>
                        <div className="flex gap-2 mt-2 justify-center">
                            {Array.from({ length: selectedPattern.cycles }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-3 h-3 rounded-full transition-all ${i < currentCycle ? 'bg-success' : i === currentCycle ? 'bg-primary animate-pulse' : 'bg-white/20'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    <Button variant="ghost" className="mt-8" onClick={stopExercise}>
                        Остановить
                    </Button>
                </div>
            )}

            {completed && (
                <Card className="text-center py-12">
                    <div className="text-6xl mb-4">🧘</div>
                    <h2 className="text-2xl font-bold mb-2">Отлично!</h2>
                    <p className="text-text-secondary mb-6">
                        Вы завершили упражнение "{selectedPattern?.name}". Как вы себя чувствуете?
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button variant="secondary" onClick={() => setCompleted(false)}>
                            Выбрать другое
                        </Button>
                        <Button onClick={() => selectedPattern && startExercise(selectedPattern)}>
                            Повторить
                        </Button>
                    </div>
                </Card>
            )}

            {/* Tips */}
            <Card className="mt-8 bg-primary/5 border-primary/20">
                <h3 className="font-semibold text-primary mb-2">💡 Советы</h3>
                <ul className="text-sm text-text-secondary space-y-1">
                    <li>• Дышите животом, а не грудью</li>
                    <li>• Найдите удобное положение сидя или лёжа</li>
                    <li>• Закройте глаза для лучшей концентрации</li>
                    <li>• Используйте перед сном для расслабления</li>
                </ul>
            </Card>
        </div>
    );
}
