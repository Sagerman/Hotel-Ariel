import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { HistoryRecord } from '../types/history';

const HISTORY_COLLECTION = 'historial';

export const historyService = {
  // Agregar registro al historial
  async addHistoryRecord(record: Omit<HistoryRecord, 'id'>): Promise<void> {
    try {
      await addDoc(collection(db, HISTORY_COLLECTION), {
        ...record,
        checkOutDate: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Error adding history record:', error);
      throw error;
    }
  },

  // Obtener todo el historial
  async getAllHistory(): Promise<HistoryRecord[]> {
    try {
      const historyRef = collection(db, HISTORY_COLLECTION);
      const q = query(historyRef, orderBy('checkOutDate', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as HistoryRecord));
    } catch (error) {
      console.error('Error fetching history:', error);
      throw error;
    }
  },
};
