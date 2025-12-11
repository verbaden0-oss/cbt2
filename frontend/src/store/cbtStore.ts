import { create } from 'zustand';
import client from '../api/client';

export interface CBTExercise {
    id?: number;
    type: string; // e.g., 'cognitive_restructuring', 'behavioral_activation'
    content_json: any;
    completed_at?: string;
}

interface CBTState {
    exercises: CBTExercise[];
    fetchExercises: () => Promise<void>;
    addExercise: (exercise: CBTExercise) => Promise<void>;
}

export const useCBTStore = create<CBTState>((set, get) => ({
    exercises: [],
    fetchExercises: async () => {
        try {
            const res = await client.get('/cbt');
            set({ exercises: res.data });
        } catch (err) {
            console.error('fetchExercises error', err);
        }
    },
    addExercise: async (exercise) => {
        try {
            await client.post('/cbt', exercise);
            get().fetchExercises();
        } catch (err) {
            console.error('addExercise error', err);
        }
    },
}));
