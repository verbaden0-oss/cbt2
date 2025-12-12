import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowRight, Save, RotateCcw, Zap, MessageSquare, Waves, Shield, Sparkles } from 'lucide-react';

export default function ABCAnalysis() {
    const [step, setStep] = useState(1);
    const [data, setData] = useState({
        a: '', // Activating Event
        b: '', // Beliefs
        c: '', // Consequences
        d: '', // Disputation
        e: ''  // Effective New Belief
    });

    const handleChange = (field: string, value: string) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const saveAnalysis = () => {
        // In a real app, save to store/DB
        alert('Анализ сохранен! (Демо)');
        setStep(1);
        setData({ a: '', b: '', c: '', d: '', e: '' });
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl animate-fade-in">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-2">
                    ABCDE Анализ
                </h1>
                <p className="text-text-secondary">
                    Разберите ситуацию, чтобы понять свои реакции и изменить их.
                </p>
            </div>

            {/* Progress Steps */}
            <div className="flex justify-between mb-8 relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 -z-10 transform -translate-y-1/2" />
                {['A', 'B', 'C', 'D', 'E'].map((label, idx) => {
                    const stepNum = idx + 1;
                    const isActive = step >= stepNum;
                    const isCurrent = step === stepNum;
                    return (
                        <div
                            key={label}
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${isActive
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-200 dark:bg-gray-800 text-text-secondary'
                                } ${isCurrent ? 'ring-4 ring-primary/20 scale-110' : ''}`}
                        >
                            {label}
                        </div>
                    );
                })}
            </div>

            <Card className="min-h-[400px] flex flex-col">
                <div className="flex-1">
                    {step === 1 && (
                        <div className="animate-fade-in space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <Zap className="w-10 h-10 text-primary" strokeWidth={2} />
                                <div>
                                    <h2 className="text-xl font-bold">A - Activating Event</h2>
                                    <p className="text-text-secondary">Активирующее событие</p>
                                </div>
                            </div>
                            <p className="text-sm text-text-primary bg-primary/5 p-4 rounded-lg border border-primary/10">
                                Опишите ситуацию объективно, как камера наблюдения. Что произошло? Где? Кто был рядом?
                                <br />
                                <em>Пример: "Прошел мимо букмекерской конторы, увидел рекламу."</em>
                            </p>
                            <textarea
                                value={data.a}
                                onChange={(e) => handleChange('a', e.target.value)}
                                placeholder="Опишите событие..."
                                className="glass-input w-full h-40 resize-none"
                                autoFocus
                            />
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-fade-in space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <MessageSquare className="w-10 h-10 text-primary" strokeWidth={2} />
                                <div>
                                    <h2 className="text-xl font-bold">B - Beliefs</h2>
                                    <p className="text-text-secondary">Убеждения и мысли</p>
                                </div>
                            </div>
                            <p className="text-sm text-text-primary bg-primary/5 p-4 rounded-lg border border-primary/10">
                                О чем вы подумали в этот момент? Какие мысли промелькнули?
                                <br />
                                <em>Пример: "Я только один раз сыграю. Мне повезет. Я смогу отыграться."</em>
                            </p>
                            <textarea
                                value={data.b}
                                onChange={(e) => handleChange('b', e.target.value)}
                                placeholder="Ваши мысли..."
                                className="glass-input w-full h-40 resize-none"
                                autoFocus
                            />
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-fade-in space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <Waves className="w-10 h-10 text-primary" strokeWidth={2} />
                                <div>
                                    <h2 className="text-xl font-bold">C - Consequences</h2>
                                    <p className="text-text-secondary">Последствия</p>
                                </div>
                            </div>
                            <p className="text-sm text-text-primary bg-primary/5 p-4 rounded-lg border border-primary/10">
                                Что вы почувствовали (эмоции)? Что захотелось сделать (поведение)?
                                <br />
                                <em>Пример: "Тревога, возбуждение. Зашел внутрь и сделал ставку."</em>
                            </p>
                            <textarea
                                value={data.c}
                                onChange={(e) => handleChange('c', e.target.value)}
                                placeholder="Эмоции и действия..."
                                className="glass-input w-full h-40 resize-none"
                                autoFocus
                            />
                        </div>
                    )}

                    {step === 4 && (
                        <div className="animate-fade-in space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <Shield className="w-10 h-10 text-primary" strokeWidth={2} />
                                <div>
                                    <h2 className="text-xl font-bold">D - Disputation</h2>
                                    <p className="text-text-secondary">Оспаривание</p>
                                </div>
                            </div>
                            <p className="text-sm text-text-primary bg-primary/5 p-4 rounded-lg border border-primary/10">
                                Поспорьте с мыслями из пункта B. Где доказательства? Полезно ли так думать?
                                <br />
                                <em>Пример: "Казино всегда в выигрыше. Один раз приведет к запою. Я уже пробовал отыграться, стало только хуже."</em>
                            </p>
                            <textarea
                                value={data.d}
                                onChange={(e) => handleChange('d', e.target.value)}
                                placeholder="Аргументы против..."
                                className="glass-input w-full h-40 resize-none"
                                autoFocus
                            />
                        </div>
                    )}

                    {step === 5 && (
                        <div className="animate-fade-in space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <Sparkles className="w-10 h-10 text-primary" strokeWidth={2} />
                                <div>
                                    <h2 className="text-xl font-bold">E - Effective New Belief</h2>
                                    <p className="text-text-secondary">Новое убеждение</p>
                                </div>
                            </div>
                            <p className="text-sm text-text-primary bg-primary/5 p-4 rounded-lg border border-primary/10">
                                Сформулируйте новую, здоровую мысль, которая поможет вам в будущем.
                                <br />
                                <em>Пример: "Реклама — это просто картинка. Я выбираю свободу, а не долги. Я пройду мимо и куплю себе кофе."</em>
                            </p>
                            <textarea
                                value={data.e}
                                onChange={(e) => handleChange('e', e.target.value)}
                                placeholder="Новая поддерживающая мысль..."
                                className="glass-input w-full h-40 resize-none"
                                autoFocus
                            />
                        </div>
                    )}
                </div>

                <div className="flex justify-between mt-8 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <Button
                        variant="ghost"
                        onClick={prevStep}
                        disabled={step === 1}
                    >
                        Назад
                    </Button>

                    {step < 5 ? (
                        <Button onClick={nextStep} className="group">
                            Далее <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    ) : (
                        <Button onClick={saveAnalysis} variant="gradient">
                            <Save className="w-4 h-4 mr-2" /> Сохранить
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
}
