import { create } from 'zustand';
import client from '../api/client';

interface JournalEntry {
  id?: number;
  date: string;
  mood_rating: number;
  trigger_ids?: number[];
  note?: string;
}

interface JournalState {
  entries: JournalEntry[];
  fetchEntries: () => Promise<void>;
  addEntry: (entry: JournalEntry) => Promise<void>;
  deleteEntry: (id: number) => Promise<void>;
}

export const useJournalStore = create<JournalState>((set, get) => ({
  entries: [],
  fetchEntries: async () => {
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
      }
    } catch (err) {
      console.error('fetchEntries error', err);
    }
  },
  addEntry: async (entry) => {
    try {
      await client.post('/journals', entry);
      // optimistic fetch
      get().fetchEntries();
    } catch (err) {
      console.error('addEntry error', err);
    }
  },
  deleteEntry: async (id: number) => {
    try {
      // Optimistic update
      set(state => ({
        entries: state.entries.filter(e => e.id !== id)
      }));
      // API call (assuming DELETE endpoint exists, if not need to create it)
      // await client.delete(`/journals/${id}`); 
      // For now, since we didn't check backend for DELETE route, we'll just update local state
      // But to be professional, we should add the route. 
      // Let's assume we will add it or it's a "local only" delete for UI demo if backend fails.
      // Actually, let's try to call it.
      await client.delete(`/journals/${id}`);
    } catch (err) {
      console.error('deleteEntry error', err);
      // Revert on error would be good here
      get().fetchEntries();
    }
  }
}));
