import { create } from 'zustand';
import { historyService } from '../services/historyService';
import type { HistoryRecord } from '../types/history';

interface HistoryStore {
  history: HistoryRecord[];
  loading: boolean;
  error: string | null;
  loadHistory: () => Promise<void>;
  addRecord: (record: Omit<HistoryRecord, 'id'>) => Promise<void>;
}

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  history: [],
  loading: false,
  error: null,

  loadHistory: async () => {
    set({ loading: true, error: null });
    try {
      const history = await historyService.getAllHistory();
      set({ history, loading: false });
    } catch (error) {
      console.error('Error loading history:', error);
      set({ error: 'Error al cargar el historial', loading: false });
    }
  },

  addRecord: async (record: Omit<HistoryRecord, 'id'>) => {
    try {
      await historyService.addHistoryRecord(record);
      // Recargar historial después de agregar
      await get().loadHistory();
    } catch (error) {
      console.error('Error adding history record:', error);
      throw error;
    }
  },
}));
