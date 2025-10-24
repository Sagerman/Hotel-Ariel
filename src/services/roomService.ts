import { collection, doc, getDocs, updateDoc, setDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Room } from '../types/room';

const ROOMS_COLLECTION = 'habitaciones';

export const roomService = {
  // Obtener todas las habitaciones
  async getAllRooms(): Promise<Room[]> {
    try {
      const roomsRef = collection(db, ROOMS_COLLECTION);
      const snapshot = await getDocs(roomsRef);
      
      const rooms = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Room));
      
      // Ordenar por nombre localmente
      return rooms.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  },

  // Inicializar habitaciones (solo primera vez)
  async initializeRooms(rooms: Room[]): Promise<void> {
    try {
      const promises = rooms.map(room => 
        setDoc(doc(db, ROOMS_COLLECTION, room.id), room)
      );
      await Promise.all(promises);
    } catch (error) {
      console.error('Error initializing rooms:', error);
      throw error;
    }
  },

  // Check-in de cliente
  async checkIn(roomId: string, clientData: Partial<Room>): Promise<void> {
    try {
      const roomRef = doc(db, ROOMS_COLLECTION, roomId);
      await updateDoc(roomRef, {
        status: 'occupied',
        clientName: clientData.clientName,
        clientId: clientData.clientId,
        clientPhone: clientData.clientPhone,
        fechaSalida: clientData.fechaSalida,
        checkInDate: clientData.checkInDate,
      });
    } catch (error) {
      console.error('Error during check-in:', error);
      throw error;
    }
  },

  // Check-out de cliente
  async checkOut(roomId: string): Promise<void> {
    try {
      const roomRef = doc(db, ROOMS_COLLECTION, roomId);
      await updateDoc(roomRef, {
        status: 'available',
        clientName: '',
        clientId: '',
        clientPhone: '',
        fechaSalida: '',
        checkInDate: '',
      });
    } catch (error) {
      console.error('Error during check-out:', error);
      throw error;
    }
  },
};
