import { create } from 'zustand';
import { roomService } from '../services/roomService';
import type { Room } from '../types/room';

interface RoomStore {
  rooms: Room[];
  loading: boolean;
  error: string | null;
  initializeRooms: () => Promise<void>;
  checkIn: (roomId: string, clientData: Partial<Room>) => Promise<void>;
  checkOut: (roomId: string) => Promise<void>;
}

const initialRooms: Room[] = [
  // Suites
  { id: '1', name: 'Suite 1', type: 'Suite', status: 'available', clientName: '', clientId: '', clientPhone: '', fechaSalida: '' },
  { id: '2', name: 'Suite 2', type: 'Suite', status: 'available', clientName: '', clientId: '', clientPhone: '', fechaSalida: '' },
  
  // Superiores
  { id: '3', name: 'Superior 1', type: 'Superior', status: 'available', clientName: '', clientId: '', clientPhone: '', fechaSalida: '' },
  { id: '4', name: 'Superior 2', type: 'Superior', status: 'available', clientName: '', clientId: '', clientPhone: '', fechaSalida: '' },
  { id: '5', name: 'Superior 3', type: 'Superior', status: 'available', clientName: '', clientId: '', clientPhone: '', fechaSalida: '' },
  { id: '6', name: 'Superior 4', type: 'Superior', status: 'available', clientName: '', clientId: '', clientPhone: '', fechaSalida: '' },
  
  // Normales
  { id: '7', name: 'Normal 1', type: 'Normal', status: 'available', clientName: '', clientId: '', clientPhone: '', fechaSalida: '' },
  { id: '8', name: 'Normal 2', type: 'Normal', status: 'available', clientName: '', clientId: '', clientPhone: '', fechaSalida: '' },
  { id: '9', name: 'Normal 3', type: 'Normal', status: 'available', clientName: '', clientId: '', clientPhone: '', fechaSalida: '' },
  { id: '10', name: 'Normal 4', type: 'Normal', status: 'available', clientName: '', clientId: '', clientPhone: '', fechaSalida: '' },
  { id: '11', name: 'Normal 5', type: 'Normal', status: 'available', clientName: '', clientId: '', clientPhone: '', fechaSalida: '' },
  { id: '12', name: 'Normal 6', type: 'Normal', status: 'available', clientName: '', clientId: '', clientPhone: '', fechaSalida: '' },
  { id: '13', name: 'Normal 7', type: 'Normal', status: 'available', clientName: '', clientId: '', clientPhone: '', fechaSalida: '' },
  { id: '14', name: 'Normal 8', type: 'Normal', status: 'available', clientName: '', clientId: '', clientPhone: '', fechaSalida: '' },
  { id: '15', name: 'Normal 9', type: 'Normal', status: 'available', clientName: '', clientId: '', clientPhone: '', fechaSalida: '' },
];

export const useRoomStore = create<RoomStore>((set, get) => ({
  rooms: [],
  loading: false,
  error: null,
  
  initializeRooms: async () => {
    set({ loading: true, error: null });
    
    // Primero mostrar datos locales inmediatamente
    set({ rooms: initialRooms, loading: false });
    
    try {
      // Intentar cargar desde Firebase en segundo plano
      const rooms = await roomService.getAllRooms();
      
      // Si no hay habitaciones en Firebase, inicializarlas
      if (rooms.length === 0) {
        console.log('Inicializando habitaciones en Firebase...');
        await roomService.initializeRooms(initialRooms);
        set({ rooms: initialRooms, loading: false });
      } else {
        console.log('Habitaciones cargadas desde Firebase:', rooms.length);
        set({ rooms, loading: false });
      }
    } catch (error) {
      console.error('Error con Firebase, usando datos locales:', error);
      // Mantener datos locales si Firebase falla
      set({ error: 'Usando datos locales (Firebase no disponible)' });
    }
  },
  
  checkIn: async (roomId: string, clientData: Partial<Room>) => {
    try {
      // Agregar fecha de entrada
      const checkInDate = new Date().toISOString().split('T')[0];
      const dataWithCheckIn = { ...clientData, checkInDate };
      
      await roomService.checkIn(roomId, dataWithCheckIn);
      
      set((state) => ({
        rooms: state.rooms.map((room) =>
          room.id === roomId
            ? {
                ...room,
                status: 'occupied' as const,
                clientName: clientData.clientName || '',
                clientId: clientData.clientId || '',
                clientPhone: clientData.clientPhone || '',
                fechaSalida: clientData.fechaSalida || '',
                checkInDate,
              }
            : room
        ),
      }));
    } catch (error) {
      console.error('Error during check-in:', error);
      throw error;
    }
  },
  
  checkOut: async (roomId: string) => {
    try {
      // Primero actualizar en Firebase
      await roomService.checkOut(roomId);
      
      // Luego actualizar el estado local
      set((state) => ({
        rooms: state.rooms.map((room) =>
          room.id === roomId
            ? {
                ...room,
                status: 'available' as const,
                clientName: '',
                clientId: '',
                clientPhone: '',
                fechaSalida: '',
                checkInDate: '',
              }
            : room
        ),
      }));

      // Recargar desde Firebase para asegurar sincronización
      const rooms = await roomService.getAllRooms();
      set({ rooms });
    } catch (error) {
      console.error('Error during check-out:', error);
      throw error;
    }
  },
}));
