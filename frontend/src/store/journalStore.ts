import { create } from 'zustand';
import client from '../api/client';
import { useToastStore } from './toastStore';

interface JournalEntry {
  id?: number;
  date: string;
  mood_rating: number;
  trigger_ids?: number[];
  note?: string;
}

interface JournalState {
  entries: JournalEntry[];
  isLoading: boolean;
  isSaving: boolean;
  fetchEntries: () => Promise<void>;
  addEntry: (entry: JournalEntry) => Promise<void>;
  deleteEntry: (id: number) => Promise<void>;
}

export const useJournalStore = create<JournalState>((set, get) => ({
  entries: [],
  isLoading: false,
  isSaving: false,
  fetchEntries: async () => {
    set({ isLoading: true });
    try {
      const res = await client.get('/journals');
      const data = res.data;
      if (data && Array.isArray(data.entries)) {
        set({ entries: data.entries });
      } else if (Array.isArray(data)) {
        set({ entries: data });
      } else {
        console.error('fetchEntries: unexpected response format');
        set({ entries: [] });
        useToastStore.getState().error('Ошибка загрузки записей');
      }
    } catch (err: any) {
      console.error('fetchEntries error', err);
      const errorMsg = err?.response?.data?.error || err?.message || 'Ошибка загрузки';
      useToastStore.getState().error(`Не удалось загрузить записи: ${errorMsg}`);
    } finally {
      set({ isLoading: false });
    }
  },
  addEntry: async (entry) => {
    set({ isSaving: true });
    const previousEntries = get().entries;
    try {
      await client.post('/journals', entry);
      await get().fetchEntries();
      useToastStore.getState().success('Запись добавлена');
    } catch (err: any) {
      console.error('addEntry error', err);
      // Revert to previous state
      set({ entries: previousEntries });
      const errorMsg = err?.response?.data?.error || err?.message || 'Ошибка сохранения';
      useToastStore.getState().error(`Не удалось сохранить запись: ${errorMsg}`);
    } finally {
      set({ isSaving: false });
    }
  },
  deleteEntry: async (id: number) => {
    const entryToDelete = get().entries.find(e => e.id === id);
    // Optimistic update
    set(state => ({
      entries: state.entries.filter(e => e.id !== id)
    }));
    
    try {
      await client.delete(`/journals/${id}`);
      useToastStore.getState().success('Запись удалена');
    } catch (err: any) {
      console.error('deleteEntry error', err);
      // Revert on error
      if (entryToDelete) {
        set(state => ({
          entries: [...state.entries, entryToDelete].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          )
        }));
      } else {
        get().fetchEntries();
      }
      const errorMsg = err?.response?.data?.error || err?.message || 'Ошибка удаления';
      useToastStore.getState().error(`Не удалось удалить запись: ${errorMsg}`);
    }
  }
}));
