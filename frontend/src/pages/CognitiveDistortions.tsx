import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Brain, AlertTriangle, CheckCircle2, XCircle, Dice6, Gamepad2, Target, DollarSign, MemoryStick } from 'lucide-react';
import { Link } from 'react-router-dom';

const distortions = [
    {
        id: 'gamblers_fallacy',
        title: 'Ошибка игрока',
        myth: '«Я проиграл 5 раз подряд, значит, сейчас точно выиграю. Вероятность повышается!»',
        reality: 'У слотов и рулетки нет памяти. Каждый спин — это независимое событие. Шанс выигрыша всегда одинаковый (и всегда против вас), независимо от прошлых результатов.',
        icon: Dice6
    },
    {
        id: 'illusion_of_control',
        title: 'Иллюзия контроля',
        myth: '«Если я нажму кнопку по-особенному или выберу "счастливые" числа, я смогу повлиять на результат.»',
        reality: 'В азартных играх результат определяет генератор случайных чисел (ГСЧ). Никакие ритуалы, стратегии или навыки не могут повлиять на чистую случайность.',
        icon: Gamepad2
    },
    {
        id: 'near_miss',
        title: 'Эффект "почти выиграл"',
        myth: '«Выпало две семерки, а третья чуть-чуть не докрутилась! Я был так близок, значит, скоро повезет!»',
        reality: '«Почти выиграл» — это то же самое, что и проиграл. Автоматы специально запрограммированы показывать такие результаты, чтобы удержать вас в игре. Это не знак скорой победы.',
        icon: Target
    },
    {
        id: 'chasing_losses',
        title: 'Отыгрыш',
        myth: '«Мне нужно просто вернуть свои деньги. Как только выйду в ноль, сразу остановлюсь.»',
        reality: 'Попытка отыграться — самая опасная ловушка. Из-за математического преимущества казино, чем дольше вы играете, тем больше проигрываете. Отыгрыш ведет к еще большим долгам.',
        icon: DollarSign
    },
    {
        id: 'selective_memory',
        title: 'Избирательная память',
        myth: '«Я помню тот крупный выигрыш месяц назад! Я удачливый человек.»',
        reality: 'Мозг игрока ярко помнит победы, но "стирает" воспоминания о тысячах проигрышей. Если посчитать всё честно, баланс всегда отрицательный.',
        icon: MemoryStick
    }
];

export default function CognitiveDistortions() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
            <div className="text-center mb-10 space-y-4">
                <div className="inline-block p-3 bg-primary/10 rounded-full mb-2">
                    <Brain className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    Ловушки мышления игрока
                </h1>
                <p className="text-text-secondary max-w-2xl mx-auto">
                    Наш мозг часто обманывает нас, заставляя верить в то, что мы можем контролировать случайность.
                    Узнайте врага в лицо, чтобы не поддаваться на эти уловки.
                </p>
            </div>

            <div className="grid gap-6">
                {distortions.map((item) => (
                    <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-shrink-0 flex flex-col items-center justify-center md:w-32 text-center">
                                {React.createElement(item.icon, {
                                    className: 'w-12 h-12 text-primary mb-2',
                                    strokeWidth: 1.5
                                })}
                                <h3 className="font-bold text-sm text-text-secondary">{item.title}</h3>
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
                                    <div className="flex items-start gap-3">
                                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-bold text-red-700 dark:text-red-400 block mb-1">Миф (Ловушка):</span>
                                            <p className="text-text-primary italic">{item.myth}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-900/30">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-bold text-green-700 dark:text-green-400 block mb-1">Реальность:</span>
                                            <p className="text-text-primary">{item.reality}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="mt-10 text-center">
                <Card className="bg-primary/5 border-primary/20 inline-block max-w-2xl">
                    <div className="flex items-center gap-3 mb-3 justify-center">
                        <AlertTriangle className="w-6 h-6 text-primary" />
                        <h3 className="font-bold text-lg">Упражнение</h3>
                    </div>
                    <p className="text-text-secondary mb-4">
                        В следующий раз, когда почувствуете желание играть, спросите себя:
                        <br />
                        <strong>«Не попадаю ли я сейчас в одну из этих ловушек?»</strong>
                    </p>
                    <Link to="/journal">
                        <Button variant="gradient">
                            Записать мысли в дневник
                        </Button>
                    </Link>
                </Card>
            </div>
        </div>
    );
}
