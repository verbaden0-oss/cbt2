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
}));
