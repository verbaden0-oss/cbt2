import React, { useEffect, useState } from 'react';
import { useJournalStore } from '../store/journalStore';
import { useTriggersStore } from '../store/triggersStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function Journal() {
  const entries = useJournalStore((s) => s.entries);
  const fetchEntries = useJournalStore((s) => s.fetchEntries);
  const addEntry = useJournalStore((s) => s.addEntry);
  const triggers = useTriggersStore((s) => s.triggers);
  const fetchTriggers = useTriggersStore((s) => s.fetchTriggers);

  const [note, setNote] = useState('');
  const [rating, setRating] = useState(5);
  const [selectedTriggers, setSelectedTriggers] = useState<number[]>([]);

  useEffect(() => {
    fetchEntries();
    fetchTriggers();
  }, [fetchEntries, fetchTriggers]);

  const toggleTrigger = (id: number) => {
    setSelectedTriggers(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;
    await addEntry({
      date: new Date().toISOString(),
      mood_rating: rating,
      note,
      trigger_ids: selectedTriggers.length > 0 ? selectedTriggers : undefined
    });
    setNote('');
    setRating(5);
    setSelectedTriggers([]);
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8 space-y-2">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Дневник Эмоций
        </h1>
        <p className="text-text-secondary">
          Записывай свои мысли и отслеживай настроение
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="md:col-span-1">
          <Card className="sticky top-24">
            <h2 className="text-xl font-bold mb-4">Новая запись</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Настроение: {rating}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-primary"
                />
                <div className="flex justify-between text-xs text-text-secondary mt-1">
                  <span>Плохо</span>
                  <span>Отлично</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Заметка
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Что у вас на уме?"
                  className="glass-input w-full h-32 resize-none"
                  required
                />
              </div>

              {/* Trigger Selection */}
              {triggers.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Активные триггеры
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {triggers.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => t.id && toggleTrigger(t.id)}
                        className={`px-3 py-1 rounded-full text-sm transition-all ${t.id && selectedTriggers.includes(t.id)
                          ? 'bg-primary text-white'
                          : 'bg-white/10 text-text-secondary hover:bg-white/20'
                          }`}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Button type="submit" fullWidth>
                Добавить
              </Button>
            </form>
          </Card>
        </div>

        {/* Entries List */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-bold mb-4">История</h2>
          {entries.length === 0 ? (
            <div className="text-center py-12 text-text-secondary bg-white/5 rounded-xl border border-white/10">
              <p>Пока нет записей. Начните вести дневник сегодня!</p>
            </div>
          ) : (
            entries.map((e) => (
              <Card key={e.id} className="hover:scale-[1.01] transition-transform duration-200">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm text-text-secondary">
                    {new Date(e.date).toLocaleString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${e.mood_rating >= 7 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    e.mood_rating >= 4 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                    {e.mood_rating}/10
                  </div>
                </div>
                <p className="text-text-primary whitespace-pre-wrap">{e.note}</p>
                {e.trigger_ids && e.trigger_ids.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {e.trigger_ids.map((tid) => {
                      const trigger = triggers.find(t => t.id === tid);
                      return trigger ? (
                        <span key={tid} className="px-2 py-0.5 bg-error/10 text-error text-xs rounded-full">
                          {trigger.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
