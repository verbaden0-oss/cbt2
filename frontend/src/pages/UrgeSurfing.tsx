import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ArrowLeft, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UrgeSurfing() {
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(180); // 3 minutes default

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="container mx-auto px-4 py-6 max-w-md h-screen flex flex-col">
            <div className="flex items-center mb-6">
                <Link to="/cbt" className="mr-4">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Сёрфинг тяги</h1>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden rounded-3xl bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/40 border border-blue-200 dark:border-blue-800">

                {/* Wave Animation */}
                <div className="absolute inset-0 flex items-end justify-center opacity-50 pointer-events-none">
                    <motion.div
                        animate={{
                            y: [0, -20, 0],
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="w-[200%] h-[60%] bg-blue-400/30 rounded-[100%] blur-3xl absolute bottom-[-20%]"
                    />
                    <motion.div
                        animate={{
                            y: [0, -30, 0],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1
                        }}
                        className="w-[200%] h-[50%] bg-blue-500/30 rounded-[100%] blur-2xl absolute bottom-[-20%]"
                    />
                </div>

                <div className="relative z-10 text-center p-6 space-y-8">
                    <div className="bg-white/80 dark:bg-black/50 backdrop-blur-sm p-6 rounded-full w-48 h-48 flex items-center justify-center mx-auto shadow-xl border-4 border-blue-100 dark:border-blue-800">
                        <div className="text-5xl font-mono font-bold text-blue-600 dark:text-blue-400">
                            {formatTime(timeLeft)}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-bold">Представьте желание как волну</h2>
                        <p className="text-text-secondary">
                            Она накатывает, достигает пика, а затем неизбежно спадает.
                            Вам не нужно бороться с ней. Просто наблюдайте и "скользите" по ней.
                        </p>
                    </div>

                    <Button
                        onClick={toggleTimer}
                        variant={isActive ? "secondary" : "primary"}
                        size="lg"
                        className="w-full max-w-xs"
                    >
                        {isActive ? 'Пауза' : timeLeft === 0 ? 'Начать заново' : 'Начать практику'}
                    </Button>
                </div>
            </div>

            <Card className="mt-6 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800">
                <div className="flex items-start gap-3">
                    <Waves className="w-6 h-6 text-blue-500 mt-1" />
                    <div className="text-sm">
                        <p className="font-bold text-blue-700 dark:text-blue-300 mb-1">Техника безопасности</p>
                        <p className="text-text-secondary">
                            Если чувствуете, что волна слишком сильная и вы можете сорваться — немедленно переключитесь на SOS режим.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
