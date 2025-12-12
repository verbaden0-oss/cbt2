import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Eye, Ear, Hand, Nose, Tongue, Star, Lightbulb } from 'lucide-react';

const steps = [
    { count: 5, sense: 'видите', icon: Eye, placeholder: 'Стол, окно, дерево, книга, чашка' },
    { count: 4, sense: 'слышите', icon: Ear, placeholder: 'Шум улицы, тиканье часов, дыхание, музыка' },
    { count: 3, sense: 'ощущаете', icon: Hand, placeholder: 'Стул подо мной, ноги на полу, одежда на коже' },
    { count: 2, sense: 'чувствуете запах', icon: Nose, placeholder: 'Кофе, свежий воздух' },
    { count: 1, sense: 'ощущаете на вкус', icon: Tongue, placeholder: 'Вкус во рту, вода' },
];

export default function Grounding() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<string[]>(['', '', '', '', '']);
    const [isComplete, setIsComplete] = useState(false);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsComplete(true);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleAnswerChange = (value: string) => {
        const newAnswers = [...answers];
        newAnswers[currentStep] = value;
        setAnswers(newAnswers);
    };

    const handleReset = () => {
        setCurrentStep(0);
        setAnswers(['', '', '', '', '']);
        setIsComplete(false);
    };

    const step = steps[currentStep];
    const progress = ((currentStep + 1) / steps.length) * 100;

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="text-center mb-8 space-y-2">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    Заземление 5-4-3-2-1
                </h1>
                <p className="text-text-secondary">
                    Техника для возвращения в настоящий момент при тревоге или панике
                </p>
            </div>

            {!isComplete ? (
                <>
                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between text-sm text-text-secondary mb-2">
                            <span>Шаг {currentStep + 1} из {steps.length}</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Current Step */}
                    <Card className="text-center py-8 mb-6">
                        <div className="flex justify-center mb-4">
                            {React.createElement(step.icon, { className: "w-16 h-16 text-primary" })}
                        </div>
                        <div className="text-5xl font-bold text-primary mb-4">{step.count}</div>
                        <p className="text-xl mb-6">
                            Назовите <strong>{step.count}</strong> вещ{step.count === 1 ? 'ь' : step.count <= 4 ? 'и' : 'ей'}, которые вы <strong>{step.sense}</strong>
                        </p>

                        <textarea
                            value={answers[currentStep]}
                            onChange={(e) => handleAnswerChange(e.target.value)}
                            placeholder={step.placeholder}
                            className="glass-input w-full h-32 resize-none mb-6"
                        />

                        <div className="flex gap-4 justify-center">
                            <Button
                                variant="ghost"
                                onClick={handlePrev}
                                disabled={currentStep === 0}
                            >
                                ← Назад
                            </Button>
                            <Button onClick={handleNext}>
                                {currentStep === steps.length - 1 ? 'Завершить' : 'Далее →'}
                            </Button>
                        </div>
                    </Card>

                    {/* Step Indicators */}
                    <div className="flex justify-center gap-2">
                        {steps.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentStep(i)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${i === currentStep
                                        ? 'bg-primary text-white scale-110'
                                        : i < currentStep
                                            ? 'bg-success text-white'
                                            : 'bg-white/10 text-text-secondary'
                                    }`}
                            >
                                {s.count}
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                <Card className="text-center py-12">
                    <div className="flex justify-center mb-4">
                        <Star className="w-16 h-16 text-yellow-500 fill-yellow-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Упражнение завершено!</h2>
                    <p className="text-text-secondary mb-6">
                        Вы вернулись в настоящий момент. Дышите глубоко и спокойно.
                    </p>

                    {/* Summary */}
                    <div className="text-left space-y-4 mb-8 max-w-md mx-auto">
                        {steps.map((s, i) => {
                            const IconComponent = s.icon;
                            return (
                                <div key={i} className="flex gap-3">
                                    <IconComponent className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-xs text-text-secondary">{s.count} — {s.sense}</div>
                                        <div className="text-sm">{answers[i] || <span className="text-text-secondary italic">Не заполнено</span>}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <Button onClick={handleReset}>
                        Повторить упражнение
                    </Button>
                </Card>
            )}

            {/* Tips */}
            <Card className="mt-8 bg-primary/5 border-primary/20">
                <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Когда использовать
                </h3>
                <ul className="text-sm text-text-secondary space-y-1">
                    <li>• При панических атаках</li>
                    <li>• Когда чувствуете диссоциацию</li>
                    <li>• При сильной тревоге</li>
                    <li>• Когда мысли "уносят" вас</li>
                </ul>
            </Card>
        </div>
    );
}
