import React, { useEffect, useState } from 'react';
import { useJournalStore } from '../store/journalStore';
import { useTriggersStore } from '../store/triggersStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  BookOpen, 
  Plus, 
  Smile, 
  Meh, 
  Frown, 
  Sad,
  Gamepad2,
  CheckCircle,
  AlertTriangle,
  DollarSign
} from 'lucide-react';

import { SwipeableCard } from '../components/ui/SwipeableCard';

export default function Journal() {
  const entries = useJournalStore((s) => s.entries);
  const isLoading = useJournalStore((s) => s.isLoading);
  const isSaving = useJournalStore((s) => s.isSaving);
  const fetchEntries = useJournalStore((s) => s.fetchEntries);
  const addEntry = useJournalStore((s) => s.addEntry);
  const deleteEntry = useJournalStore((s) => s.deleteEntry);
  const triggers = useTriggersStore((s) => s.triggers);
  const fetchTriggers = useTriggersStore((s) => s.fetchTriggers);

  const [note, setNote] = useState('');
  const [rating, setRating] = useState(5);
  const [hadUrge, setHadUrge] = useState<boolean | null>(null);
  const [urgeHandled, setUrgeHandled] = useState(false);
  const [selectedTriggers, setSelectedTriggers] = useState<number[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

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

    // Create extended note with urge info
    let fullNote = note;
    if (hadUrge) {
      const urgeStatus = urgeHandled ? 'Справился' : 'Было сложно';
      fullNote += `\n\nЖелание играть: ${urgeStatus}`;
    }

    await addEntry({
      date: new Date().toISOString(),
      mood_rating: rating,
      note: fullNote,
      trigger_ids: selectedTriggers.length > 0 ? selectedTriggers : undefined
    });

    // Reset form
    setNote('');
    setRating(5);
    setHadUrge(null);
    setUrgeHandled(false);
    setSelectedTriggers([]);
    setIsFormOpen(false);
  }

  const getMoodIcon = (mood: number, className: string = "w-5 h-5") => {
    if (mood >= 8) return <Smile className={className} />;
    if (mood >= 6) return <Meh className={className} />;
    if (mood >= 4) return <Frown className={className} />;
    if (mood >= 2) return <Sad className={className} />;
    return <Sad className={className} />;
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center text-white shadow-md">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Дневник</h1>
            <p className="text-xs text-text-secondary">{entries.length} записей</p>
          </div>
        </div>
        <Button
          onClick={() => setIsFormOpen(!isFormOpen)}
          variant={isFormOpen ? 'secondary' : 'primary'}
          size="sm"
        >
          {isFormOpen ? 'Отмена' : <><Plus className="w-4 h-4 mr-1" /> Записать</>}
        </Button>
      </div>

      {/* New Entry Form */}
      {isFormOpen && (
        <Card className="animate-slide-up">
          <form onSubmit={handleAdd} className="space-y-4">
            {/* Mood Rating */}
            <div>
              <label className="text-sm font-medium text-text-secondary mb-2 block flex items-center gap-2">
                Как настроение? {getMoodIcon(rating, "w-4 h-4")} {rating}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-primary"
              />
            </div>

            {/* Urge Question */}
            <div>
              <label className="text-sm font-medium text-text-secondary mb-2 block">
                Было желание играть?
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setHadUrge(false)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${hadUrge === false
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-text-secondary'
                    }`}
                >
                  Нет ✓
                </button>
                <button
                  type="button"
                  onClick={() => setHadUrge(true)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${hadUrge === true
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-text-secondary'
                    }`}
                >
                  Да
                </button>
              </div>
            </div>

            {/* Urge Handling (if had urge) */}
            {hadUrge && (
              <div className="animate-fade-in">
                <label className="text-sm font-medium text-text-secondary mb-2 block">
                  Как справился?
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setUrgeHandled(true)}
                    className={`flex-1 py-2 rounded-lg text-sm transition-all flex items-center justify-center gap-2 ${urgeHandled
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-text-secondary'
                      }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Не играл
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrgeHandled(false)}
                    className={`flex-1 py-2 rounded-lg text-sm transition-all flex items-center justify-center gap-2 ${!urgeHandled && hadUrge
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-text-secondary'
                      }`}
                  >
                    <DollarSign className="w-4 h-4" />
                    Играл
                  </button>
                </div>
              </div>
            )}

            {/* Note */}
            <div>
              <label className="text-sm font-medium text-text-secondary mb-2 block">
                Заметка
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Что произошло? Как себя чувствуешь?"
                className="glass-input w-full h-24 resize-none text-sm"
              />
            </div>

            {/* Triggers */}
            {triggers.length > 0 && (
              <div>
                <label className="text-sm font-medium text-text-secondary mb-2 block">
                  Триггеры (если были)
                </label>
                <div className="flex flex-wrap gap-2">
                  {triggers.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => t.id && toggleTrigger(t.id)}
                      className={`px-3 py-1 rounded-full text-xs transition-all ${t.id && selectedTriggers.includes(t.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-text-secondary'
                        }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button type="submit" fullWidth variant="gradient" disabled={isSaving}>
              {isSaving ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </form>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <h3 className="text-lg font-bold mb-2">Удалить запись?</h3>
            <p className="text-text-secondary mb-4">Это действие нельзя отменить.</p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setDeleteConfirmId(null)}
              >
                Отмена
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={() => {
                  if (deleteConfirmId) {
                    deleteEntry(deleteConfirmId);
                    setDeleteConfirmId(null);
                  }
                }}
              >
                Удалить
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Entries List */}
      <div className="space-y-3">
        {isLoading ? (
          <Card className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-text-secondary">Загрузка записей...</p>
          </Card>
        ) : entries.length === 0 ? (
          <Card className="text-center py-8 text-text-secondary">
            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Пока нет записей</p>
            <p className="text-xs">Начни вести дневник сегодня</p>
          </Card>
        ) : (

          entries.map((e) => (
            <SwipeableCard
              key={e.id}
              onDelete={() => e.id && setDeleteConfirmId(e.id)}
              className="mb-3"
            >
              <Card className="press-scale border-none shadow-none">
                <div className="flex items-start gap-3">
                  {/* Mood indicator */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${e.mood_rating >= 7 ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                    e.mood_rating >= 4 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                      'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                    }`}>
                    {getMoodIcon(e.mood_rating, "w-5 h-5")}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-bold ${e.mood_rating >= 7 ? 'text-green-600 dark:text-green-400' :
                        e.mood_rating >= 4 ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                        {e.mood_rating}/10
                      </span>
                      <span className="text-xs text-text-secondary">
                        {new Date(e.date).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </span>
                    </div>

                    <p className="text-sm text-text-primary whitespace-pre-wrap line-clamp-3">
                      {e.note}
                    </p>

                    {/* Triggers */}
                    {e.trigger_ids && e.trigger_ids.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {e.trigger_ids.map((tid) => {
                          const trigger = triggers.find(t => t.id === tid);
                          return trigger ? (
                            <span key={tid} className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-full">
                              {trigger.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </SwipeableCard>
          ))
        )}
      </div>
    </div>
  );
}
