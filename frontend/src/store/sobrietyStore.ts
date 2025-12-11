import { create } from 'zustand';
import client from '../api/client';

export interface SobrietyLog {
    id?: number;
    user_id?: number;
    start_date: string;
    current_streak: number;
    relapses_json: any; // array of dates or objects
}

interface SobrietyState {
    log: SobrietyLog | null;
    fetchLog: () => Promise<void>;
    updateLog: (data: { start_date: string; relapses_json: any }) => Promise<void>;
}

export const useSobrietyStore = create<SobrietyState>((set, get) => ({
    log: null,
    fetchLog: async () => {
        try {
            const res = await client.get('/sobriety');
            set({ log: res.data });
        } catch (err: any) {
            if (err.response && err.response.status === 404) {
                set({ log: null });
            } else {
                console.error('fetchLog error', err);
            }
        }
    },
    updateLog: async (data) => {
        try {
            const res = await client.post('/sobriety', data);
            set({ log: res.data });
        } catch (err) {
            console.error('updateLog error', err);
        }
    },
}));
