import React, { useEffect, useMemo } from 'react';
import { useJournalStore } from '../store/journalStore';
import { useSobrietyStore } from '../store/sobrietyStore';
import { useCBTStore } from '../store/cbtStore';
import { useTriggersStore } from '../store/triggersStore';
import { Card } from '../components/ui/Card';
import { 
    Sprout, Star, Trophy, Gem, Crown, 
    PenTool, BookOpen, Flame, Zap, Brain, 
    Target, Medal, Search, Rocket, Dumbbell 
} from 'lucide-react';

interface Badge {
    id: string;
    name: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    unlocked: boolean;
    progress?: number;
    maxProgress?: number;
}

export default function Achievements() {
    const entries = useJournalStore((s) => s.entries);
    const fetchEntries = useJournalStore((s) => s.fetchEntries);
    const log = useSobrietyStore((s) => s.log);
    const fetchLog = useSobrietyStore((s) => s.fetchLog);
    const exercises = useCBTStore((s) => s.exercises);
    const fetchExercises = useCBTStore((s) => s.fetchExercises);
    const triggers = useTriggersStore((s) => s.triggers);
    const fetchTriggers = useTriggersStore((s) => s.fetchTriggers);

    useEffect(() => {
        fetchEntries();
        fetchLog();
        fetchExercises();
        fetchTriggers();
    }, [fetchEntries, fetchLog, fetchExercises, fetchTriggers]);

    const badges = useMemo((): Badge[] => {
        const sobrietyDays = log?.current_streak || 0;
        const journalCount = entries.length;
        const cbtCount = exercises.length;
        const triggerCount = triggers.length;

        // Calculate journal streak
        const getJournalStreak = () => {
            if (entries.length === 0) return 0;
            const sortedEntries = [...entries].sort((a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            let streak = 0;
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            for (let i = 0; i < 7; i++) {
                const checkDate = new Date(today);
                checkDate.setDate(checkDate.getDate() - i);
                const dateStr = checkDate.toISOString().split('T')[0];

                const hasEntry = sortedEntries.some(e => e.date.split('T')[0] === dateStr);
                if (hasEntry) {
                    streak++;
                } else if (i > 0) {
                    break;
                }
            }
            return streak;
        };

        const journalStreak = getJournalStreak();

        return [
            // Sobriety badges
            {
                id: 'sober_1',
                name: 'Первый день',
                description: '1 день трезвости',
                icon: Sprout,
                unlocked: sobrietyDays >= 1,
                progress: Math.min(sobrietyDays, 1),
                maxProgress: 1
            },
            {
                id: 'sober_7',
                name: 'Неделя силы',
                description: '7 дней трезвости',
                icon: Star,
                unlocked: sobrietyDays >= 7,
                progress: Math.min(sobrietyDays, 7),
                maxProgress: 7
            },
            {
                id: 'sober_30',
                name: 'Месяц свободы',
                description: '30 дней трезвости',
                icon: Trophy,
                unlocked: sobrietyDays >= 30,
                progress: Math.min(sobrietyDays, 30),
                maxProgress: 30
            },
            {
                id: 'sober_90',
                name: 'Квартал победы',
                description: '90 дней трезвости',
                icon: Gem,
                unlocked: sobrietyDays >= 90,
                progress: Math.min(sobrietyDays, 90),
                maxProgress: 90
            },
            {
                id: 'sober_365',
                name: 'Год легенды',
                description: '365 дней трезвости',
                icon: Crown,
                unlocked: sobrietyDays >= 365,
                progress: Math.min(sobrietyDays, 365),
                maxProgress: 365
            },

            // Journal badges
            {
                id: 'journal_1',
                name: 'Первые мысли',
                description: 'Первая запись в дневнике',
                icon: PenTool,
                unlocked: journalCount >= 1,
                progress: Math.min(journalCount, 1),
                maxProgress: 1
            },
            {
                id: 'journal_10',
                name: 'Рефлексия',
                description: '10 записей в дневнике',
                icon: BookOpen,
                unlocked: journalCount >= 10,
                progress: Math.min(journalCount, 10),
                maxProgress: 10
            },
            {
                id: 'journal_streak_3',
                name: 'Привычка',
                description: '3 дня подряд ведения дневника',
                icon: Flame,
                unlocked: journalStreak >= 3,
                progress: Math.min(journalStreak, 3),
                maxProgress: 3
            },
            {
                id: 'journal_streak_7',
                name: 'Неделя осознанности',
                description: '7 дней подряд ведения дневника',
                icon: Zap,
                unlocked: journalStreak >= 7,
                progress: Math.min(journalStreak, 7),
                maxProgress: 7
            },

            // CBT badges
            {
                id: 'cbt_1',
                name: 'Первое упражнение',
                description: 'Первое КПТ упражнение',
                icon: Brain,
                unlocked: cbtCount >= 1,
                progress: Math.min(cbtCount, 1),
                maxProgress: 1
            },
            {
                id: 'cbt_5',
                name: 'Практик',
                description: '5 КПТ упражнений',
                icon: Target,
                unlocked: cbtCount >= 5,
                progress: Math.min(cbtCount, 5),
                maxProgress: 5
            },
            {
                id: 'cbt_20',
                name: 'Мастер мыслей',
                description: '20 КПТ упражнений',
                icon: Medal,
                unlocked: cbtCount >= 20,
                progress: Math.min(cbtCount, 20),
                maxProgress: 20
            },

            // Triggers badge
            {
                id: 'triggers_3',
                name: 'Самопознание',
                description: 'Определить 3 триггера',
                icon: Search,
                unlocked: triggerCount >= 3,
                progress: Math.min(triggerCount, 3),
                maxProgress: 3
            },
        ];
    }, [entries, log, exercises, triggers]);

    const unlockedCount = badges.filter(b => b.unlocked).length;
    const totalCount = badges.length;

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="text-center mb-8 space-y-2">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    Мои Достижения
                </h1>
                <p className="text-text-secondary">
                    Собирай бейджи и отслеживай свой прогресс
                </p>
            </div>

            {/* Progress Overview */}
            <Card className="mb-8 text-center">
                <div className="text-5xl font-bold text-primary mb-2">
                    {unlockedCount} / {totalCount}
                </div>
                <p className="text-text-secondary">бейджей разблокировано</p>
                <div className="w-full h-3 bg-white/10 rounded-full mt-4 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                        style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
                    />
                </div>
            </Card>

            {/* Badges Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {badges.map(badge => (
                    <Card
                        key={badge.id}
                        className={`text-center transition-all ${badge.unlocked
                                ? 'border-primary/50 bg-primary/5'
                                : 'opacity-50 grayscale'
                            }`}
                    >
                        <div className={`mb-3 flex justify-center ${badge.unlocked ? 'animate-bounce-slow' : ''}`}>
                            {React.createElement(badge.icon, {
                                className: `w-12 h-12 ${badge.unlocked ? 'text-primary' : 'text-text-secondary'}`,
                                strokeWidth: 1.5
                            })}
                        </div>
                        <h3 className="font-bold text-sm">{badge.name}</h3>
                        <p className="text-xs text-text-secondary mt-1">{badge.description}</p>

                        {!badge.unlocked && badge.maxProgress && (
                            <div className="mt-3">
                                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary/50 transition-all"
                                        style={{ width: `${((badge.progress || 0) / badge.maxProgress) * 100}%` }}
                                    />
                                </div>
                                <span className="text-xs text-text-secondary mt-1">
                                    {badge.progress} / {badge.maxProgress}
                                </span>
                            </div>
                        )}

                        {badge.unlocked && (
                            <div className="mt-2 text-xs text-success font-bold">
                                ✓ Разблокировано
                            </div>
                        )}
                    </Card>
                ))}
            </div>

            {/* Motivation */}
            <Card className="mt-8 bg-primary/5 border-primary/20 text-center">
                <p className="text-lg font-medium mb-2 flex items-center justify-center gap-2">
                    {unlockedCount === 0 && (
                        <>
                            <Rocket className="w-5 h-5 text-primary" />
                            <span>Начните своё путешествие!</span>
                        </>
                    )}
                    {unlockedCount > 0 && unlockedCount < 5 && (
                        <>
                            <Dumbbell className="w-5 h-5 text-primary" />
                            <span>Отличное начало! Продолжайте!</span>
                        </>
                    )}
                    {unlockedCount >= 5 && unlockedCount < 10 && (
                        <>
                            <Star className="w-5 h-5 text-primary" />
                            <span>Вы делаете прогресс!</span>
                        </>
                    )}
                    {unlockedCount >= 10 && (
                        <>
                            <Trophy className="w-5 h-5 text-primary" />
                            <span>Вы настоящий чемпион!</span>
                        </>
                    )}
                </p>
            </Card>
        </div>
    );
}
