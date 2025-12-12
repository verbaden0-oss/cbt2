import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    BookOpen, Brain, Wind, Zap, Shield, AlertCircle,
    TrendingUp, Clock, Target, Flame, ArrowRight
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useSobrietyStore } from '../store/sobrietyStore';
import { useJournalStore } from '../store/journalStore';
import { PullToRefresh } from '../components/ui/PullToRefresh';

export default function Home() {
    const log = useSobrietyStore((s) => s.log);
    const fetchLog = useSobrietyStore((s) => s.fetchLog);
    const entries = useJournalStore((s) => s.entries);
    const fetchEntries = useJournalStore((s) => s.fetchEntries);

    useEffect(() => {
        fetchLog();
        fetchEntries();
    }, [fetchLog, fetchEntries]);

    const daysClean = log?.current_streak || 0;
    const lastEntry = entries[0];
    const lastMood = lastEntry?.mood_rating;

    return (
        <PullToRefresh onRefresh={async () => {
            await Promise.all([fetchLog(), fetchEntries()]);
        }}>
            <div className="space-y-6 animate-fade-in pb-20">
                {/* Status Card */}
                <Card variant="premium" className="text-center py-8">
                    <div className="mb-4">
                        <span className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                            {daysClean}
                        </span>
                        <span className="text-2xl ml-2 text-text-secondary">
                            {daysClean === 1 ? 'день' : daysClean < 5 ? 'дня' : 'дней'}
                        </span>
                    </div>
                    <p className="text-text-secondary">без игры</p>

                    {daysClean >= 7 && (
                        <div className="mt-4 flex justify-center animate-bounce-slow">
                            <Flame className="w-8 h-8 text-orange-500 fill-orange-500" />
                        </div>
                    )}
                </Card>

                {/* SOS Button */}
                <Link to="/sos" className="block">
                    <Card className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-none hover:scale-[1.02] transition-transform">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg">Хочется играть?</h3>
                                <p className="text-white/80 text-sm">Нажми для быстрой помощи</p>
                            </div>
                            <ArrowRight className="w-6 h-6" />
                        </div>
                    </Card>
                </Link>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                    <Link to="/journal">
                        <ActionCard
                            icon={<BookOpen className="w-5 h-5" />}
                            title="Дневник"
                            subtitle={lastMood ? `Последнее: ${lastMood}/10` : 'Записать'}
                            color="from-blue-500 to-cyan-400"
                        />
                    </Link>
                    <Link to="/cbt">
                        <ActionCard
                            icon={<Brain className="w-5 h-5" />}
                            title="КПТ"
                            subtitle="Упражнения"
                            color="from-purple-500 to-pink-400"
                        />
                    </Link>
                    <Link to="/breathing">
                        <ActionCard
                            icon={<Wind className="w-5 h-5" />}
                            title="Дыхание"
                            subtitle="4-7-8"
                            color="from-teal-500 to-emerald-400"
                        />
                    </Link>
                    <Link to="/triggers">
                        <ActionCard
                            icon={<Zap className="w-5 h-5" />}
                            title="Триггеры"
                            subtitle="Что провоцирует"
                            color="from-amber-500 to-yellow-400"
                        />
                    </Link>
                </div>

                {/* Today's Goal */}
                <Card className="border-l-4 border-l-primary">
                    <div className="flex items-center gap-3">
                        <Target className="w-5 h-5 text-primary" />
                        <div>
                            <h4 className="font-medium">Цель на сегодня</h4>
                            <p className="text-text-secondary text-sm">
                                Не играть. Записать мысли. Дышать при желании.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="glass rounded-xl p-3">
                        <Clock className="w-4 h-4 mx-auto mb-1 text-text-secondary" />
                        <div className="text-lg font-bold text-primary">{entries.length}</div>
                        <div className="text-xs text-text-secondary">записей</div>
                    </div>
                    <div className="glass rounded-xl p-3">
                        <Shield className="w-4 h-4 mx-auto mb-1 text-text-secondary" />
                        <div className="text-lg font-bold text-secondary">{daysClean}</div>
                        <div className="text-xs text-text-secondary">дней</div>
                    </div>
                    <div className="glass rounded-xl p-3">
                        <TrendingUp className="w-4 h-4 mx-auto mb-1 text-text-secondary" />
                        <div className="text-lg font-bold text-accent">{lastMood || '—'}</div>
                        <div className="text-xs text-text-secondary">настроение</div>
                    </div>
                </div>
            </div>
        </PullToRefresh>
    );
}

function ActionCard({ icon, title, subtitle, color }: {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    color: string;
}) {
    return (
        <Card className="hover:scale-[1.02] transition-transform active:scale-[0.98] cursor-pointer">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center text-white shadow-md`}>
                    {icon}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm">{title}</h4>
                    <p className="text-xs text-text-secondary truncate">{subtitle}</p>
                </div>
            </div>
        </Card>
    );
}
