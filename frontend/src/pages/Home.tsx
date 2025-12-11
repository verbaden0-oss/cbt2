import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export default function Home() {
    return (
        <div className="space-y-12 animate-fade-in">
            {/* Hero Section */}
            <section className="text-center space-y-6 py-12">
                <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary pb-2">
                    Твой Путь к Спокойствию
                </h1>
                <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                    Персональный инструмент для когнитивно-поведенческой терапии, ведения дневника и отслеживания трезвости.
                    Возьми под контроль свое ментальное здоровье.
                </p>
                <div className="flex justify-center gap-4">
                    <Link to="/journal">
                        <Button size="lg">Начать Дневник</Button>
                    </Link>
                    <Link to="/cbt">
                        <Button variant="secondary" size="lg">Упражнения</Button>
                    </Link>
                </div>
            </section>

            {/* Features Grid */}
            <section className="grid md:grid-cols-3 gap-6">
                <Card className="space-y-4">
                    <div className="text-4xl">📝</div>
                    <h3 className="text-xl font-bold">Личный Дневник</h3>
                    <p className="text-text-secondary">
                        Записывай свои мысли и чувства. Отслеживай настроение и находи закономерности.
                    </p>
                </Card>
                <Card className="space-y-4">
                    <div className="text-4xl">🧠</div>
                    <h3 className="text-xl font-bold">КПТ Упражнения</h3>
                    <p className="text-text-secondary">
                        Работай с негативными мыслями, используя проверенные техники когнитивной терапии.
                    </p>
                </Card>
                <Card className="space-y-4">
                    <div className="text-4xl">🛡️</div>
                    <h3 className="text-xl font-bold">Трекер Трезвости</h3>
                    <p className="text-text-secondary">
                        Следи за прогрессом, отмечай триггеры и празднуй свои победы на пути к свободе.
                    </p>
                </Card>
            </section>
        </div>
    );
}
