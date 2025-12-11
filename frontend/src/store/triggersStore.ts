import { create } from 'zustand';
import client from '../api/client';

export interface Trigger {
    id?: number;
    user_id?: number;
    name: string;
    category: string;
}

interface TriggersState {
    triggers: Trigger[];
    fetchTriggers: () => Promise<void>;
    addTrigger: (trigger: Trigger) => Promise<void>;
    deleteTrigger: (id: number) => Promise<void>;
}

export const useTriggersStore = create<TriggersState>((set, get) => ({
    triggers: [],
    fetchTriggers: async () => {
        try {
            const res = await client.get('/triggers');
            set({ triggers: res.data });
        } catch (err) {
            console.error('fetchTriggers error', err);
        }
    },
    addTrigger: async (trigger) => {
        try {
            await client.post('/triggers', trigger);
            get().fetchTriggers();
        } catch (err) {
            console.error('addTrigger error', err);
        }
    },
    deleteTrigger: async (id) => {
        try {
            await client.delete(`/triggers/${id}`);
            get().fetchTriggers();
        } catch (err) {
            console.error('deleteTrigger error', err);
        }
    },
}));
