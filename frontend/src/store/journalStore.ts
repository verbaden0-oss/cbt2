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
}

export const useJournalStore = create<JournalState>((set, get) => ({
  entries: [],
  fetchEntries: async () => {
    try {
      const res = await client.get('/journals');
      set({ entries: res.data.entries || [] });
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
}));
