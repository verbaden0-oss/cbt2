import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useJournalStore } from '../store/journalStore';
import { useTriggersStore } from '../store/triggersStore';
import { useSobrietyStore } from '../store/sobrietyStore';
import { useCBTStore } from '../store/cbtStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Smile, 
  Meh, 
  Frown, 
  Sad,
  BookOpen,
  Brain,
  Shield,
  Zap,
  Lightbulb
} from 'lucide-react';

export default function Dashboard() {
    const entries = useJournalStore((s) => s.entries);
    const fetchEntries = useJournalStore((s) => s.fetchEntries);
    const triggers = useTriggersStore((s) => s.triggers);
    const fetchTriggers = useTriggersStore((s) => s.fetchTriggers);
    const log = useSobrietyStore((s) => s.log);
    const fetchLog = useSobrietyStore((s) => s.fetchLog);
    const exercises = useCBTStore((s) => s.exercises);
    const fetchExercises = useCBTStore((s) => s.fetchExercises);

    useEffect(() => {
        fetchEntries();
        fetchTriggers();
        fetchLog();
        fetchExercises();
    }, [fetchEntries, fetchTriggers, fetchLog, fetchExercises]);

    // Calculate mood statistics for last 7 days
    const moodStats = useMemo(() => {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const recentEntries = entries.filter(e => new Date(e.date) >= weekAgo);

        if (recentEntries.length === 0) return null;

        const avgMood = recentEntries.reduce((sum, e) => sum + e.mood_rating, 0) / recentEntries.length;
        const maxMood = Math.max(...recentEntries.map(e => e.mood_rating));
        const minMood = Math.min(...recentEntries.map(e => e.mood_rating));

        // Daily breakdown for chart
        const dailyMoods: { date: string; avg: number; count: number }[] = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const dayStr = date.toISOString().split('T')[0];
            const dayEntries = recentEntries.filter(e => e.date.split('T')[0] === dayStr);
            dailyMoods.push({
                date: dayStr,
                avg: dayEntries.length > 0 ? dayEntries.reduce((s, e) => s + e.mood_rating, 0) / dayEntries.length : 0,
                count: dayEntries.length
            });
        }

        return { avgMood, maxMood, minMood, dailyMoods, totalEntries: recentEntries.length };
    }, [entries]);

    // Calculate trigger frequency
    const triggerStats = useMemo(() => {
        const now = new Date();
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const recentEntries = entries.filter(e => new Date(e.date) >= monthAgo);

        const triggerCounts: Record<number, { name: string; count: number; avgMood: number }> = {};

        recentEntries.forEach(entry => {
            if (entry.trigger_ids) {
                entry.trigger_ids.forEach(tid => {
                    const trigger = triggers.find(t => t.id === tid);
                    if (trigger) {
                        if (!triggerCounts[tid]) {
                            triggerCounts[tid] = { name: trigger.name, count: 0, avgMood: 0 };
                        }
                        triggerCounts[tid].count++;
                        triggerCounts[tid].avgMood += entry.mood_rating;
                    }
                });
            }
        });

        // Calculate averages
        Object.values(triggerCounts).forEach(tc => {
            tc.avgMood = tc.avgMood / tc.count;
        });

        return Object.values(triggerCounts).sort((a, b) => b.count - a.count).slice(0, 5);
    }, [entries, triggers]);

    const getMoodIcon = (mood: number) => {
        if (mood >= 8) return <Smile className="w-4 h-4 inline" />;
        if (mood >= 6) return <Meh className="w-4 h-4 inline" />;
        if (mood >= 4) return <Frown className="w-4 h-4 inline" />;
        if (mood >= 2) return <Sad className="w-4 h-4 inline" />;
        return <Sad className="w-4 h-4 inline" />;
    };

    const getMoodColor = (mood: number) => {
        if (mood >= 7) return 'text-green-500';
        if (mood >= 4) return 'text-yellow-500';
        return 'text-red-500';
    };

    const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="text-center mb-8 space-y-2">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    Моя Статистика
                </h1>
                <p className="text-text-secondary">
                    Отслеживай свой прогресс и находи закономерности
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card className="text-center">
                    <div className="text-4xl font-bold text-primary">{log?.current_streak || 0}</div>
                    <div className="text-sm text-text-secondary">Дней трезвости</div>
                </Card>
                <Card className="text-center">
                    <div className="text-4xl font-bold text-secondary">{entries.length}</div>
                    <div className="text-sm text-text-secondary">Записей в дневнике</div>
                </Card>
                <Card className="text-center">
                    <div className="text-4xl font-bold text-accent">{exercises.length}</div>
                    <div className="text-sm text-text-secondary">КПТ упражнений</div>
                </Card>
                <Card className="text-center">
                    <div className="text-4xl font-bold text-warning">{triggers.length}</div>
                    <div className="text-sm text-text-secondary">Триггеров отслеживается</div>
                </Card>
            </div>

            {/* Mood Chart */}
            <Card className="mb-8">
                <h2 className="text-xl font-bold mb-4">Настроение за неделю</h2>
                {moodStats ? (
                    <>
                        <div className="flex items-end justify-between h-40 mb-4 gap-2">
                            {moodStats.dailyMoods.map((day, idx) => {
                                const date = new Date(day.date);
                                const dayName = dayNames[date.getDay()];
                                const height = day.avg > 0 ? (day.avg / 10) * 100 : 0;

                                return (
                                    <div key={idx} className="flex-1 flex flex-col items-center">
                                        <div className="w-full flex flex-col items-center justify-end h-32">
                                            {day.count > 0 && (
                                                <span className="text-xs mb-1">{day.avg.toFixed(1)}</span>
                                            )}
                                            <div
                                                className={`w-full max-w-8 rounded-t transition-all ${day.avg >= 7 ? 'bg-green-500' :
                                                        day.avg >= 4 ? 'bg-yellow-500' :
                                                            day.avg > 0 ? 'bg-red-500' : 'bg-gray-300'
                                                    }`}
                                                style={{ height: `${height}%`, minHeight: day.count > 0 ? '10px' : '0' }}
                                            />
                                        </div>
                                        <span className="text-xs text-text-secondary mt-2">{dayName}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-between text-sm text-text-secondary border-t border-white/10 pt-4">
                            <span className="flex items-center gap-1">Среднее: <strong className={getMoodColor(moodStats.avgMood)}>{moodStats.avgMood.toFixed(1)}</strong> {getMoodIcon(moodStats.avgMood)}</span>
                            <span>Записей: <strong>{moodStats.totalEntries}</strong></span>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-8 text-text-secondary">
                        <p className="mb-4">Нет данных за последнюю неделю</p>
                        <Link to="/journal">
                            <Button>Начать вести дневник</Button>
                        </Link>
                    </div>
                )}
            </Card>

            {/* Trigger Correlation */}
            <Card className="mb-8">
                <h2 className="text-xl font-bold mb-4">Топ триггеров (за месяц)</h2>
                {triggerStats.length > 0 ? (
                    <div className="space-y-3">
                        {triggerStats.map((ts, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-lg font-bold text-text-secondary">{idx + 1}</span>
                                    <span className="font-medium">{ts.name}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-text-secondary">
                                        {ts.count}× отмечен
                                    </span>
                                    <span className={`text-sm font-bold flex items-center gap-1 ${getMoodColor(ts.avgMood)}`}>
                                        ø {ts.avgMood.toFixed(1)} {getMoodIcon(ts.avgMood)}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <p className="text-xs text-text-secondary mt-4 italic flex items-center gap-2">
                            <Lightbulb className="w-4 h-4" />
                            Триггеры с низким средним настроением — это зоны внимания для КПТ работы
                        </p>
                    </div>
                ) : (
                    <div className="text-center py-8 text-text-secondary">
                        <p className="mb-4">Нет данных о связи триггеров и настроения</p>
                        <Link to="/triggers">
                            <Button variant="secondary">Добавить триггеры</Button>
                        </Link>
                    </div>
                )}
            </Card>

            {/* Quick Actions */}
            <Card>
                <h2 className="text-xl font-bold mb-4">Быстрые действия</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Link to="/journal">
                        <Button variant="secondary" fullWidth className="flex items-center justify-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            Дневник
                        </Button>
                    </Link>
                    <Link to="/cbt">
                        <Button variant="secondary" fullWidth className="flex items-center justify-center gap-2">
                            <Brain className="w-4 h-4" />
                            КПТ
                        </Button>
                    </Link>
                    <Link to="/sobriety">
                        <Button variant="secondary" fullWidth className="flex items-center justify-center gap-2">
                            <Shield className="w-4 h-4" />
                            Трезвость
                        </Button>
                    </Link>
                    <Link to="/triggers">
                        <Button variant="secondary" fullWidth className="flex items-center justify-center gap-2">
                            <Zap className="w-4 h-4" />
                            Триггеры
                        </Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
}
