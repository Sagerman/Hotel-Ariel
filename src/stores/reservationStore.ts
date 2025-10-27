import { create } from 'zustand';
import { reservationService } from '../services/reservationService';
import type { Reservation } from '../types/reservation';

interface ReservationStore {
  reservations: Reservation[];
  loading: boolean;
  error: string | null;
  loadReservations: () => Promise<void>;
  createReservation: (reservation: Omit<Reservation, 'id' | 'createdAt'>) => Promise<void>;
  completeCheckout: (id: string) => Promise<void>;
  cancelReservation: (id: string) => Promise<void>;
  deleteReservation: (id: string) => Promise<void>;
  getActiveReservations: () => Reservation[];
  getOnlinePaymentReservations: () => Reservation[];
}

export const useReservationStore = create<ReservationStore>((set, get) => ({
  reservations: [],
  loading: false,
  error: null,

  loadReservations: async () => {
    set({ loading: true, error: null });
    try {
      const reservations = await reservationService.getAllReservations();
      console.log('Reservas cargadas:', reservations.length);
      set({ reservations, loading: false });
    } catch (error) {
      console.error('Error loading reservations:', error);
      set({ error: 'Error al cargar las reservas', loading: false, reservations: [] });
    }
  },

  createReservation: async (reservation: Omit<Reservation, 'id' | 'createdAt'>) => {
    try {
      await reservationService.createReservation(reservation);
      await get().loadReservations();
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  },

  completeCheckout: async (id: string) => {
    try {
      await reservationService.completeCheckout(id);
      // Actualizar localmente sin recargar
      set((state) => ({
        reservations: state.reservations.map(r =>
          r.id === id ? { ...r, estadoReserva: 'completada' as const } : r
        ),
      }));
      console.log('Check-out completado localmente');
    } catch (error) {
      console.error('Error completing checkout:', error);
      throw error;
    }
  },

  cancelReservation: async (id: string) => {
    try {
      await reservationService.cancelReservation(id);
      await get().loadReservations();
    } catch (error) {
      console.error('Error canceling reservation:', error);
      throw error;
    }
  },

  deleteReservation: async (id: string) => {
    try {
      await reservationService.deleteReservation(id);
      await get().loadReservations();
    } catch (error) {
      console.error('Error deleting reservation:', error);
      throw error;
    }
  },

  getActiveReservations: () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    console.log('Fecha de hoy (local):', todayStr);

    const active = get().reservations.filter(reservation => {
      // Solo mostrar reservas ACTIVAS (no completadas ni canceladas)
      if (reservation.estadoReserva !== 'activa') return false;
      
      // Comparar solo las fechas (YYYY-MM-DD)
      const isActive = reservation.fechaCheckIn <= todayStr && reservation.fechaCheckOut >= todayStr;
      
      if (isActive) {
        console.log('Reserva activa:', {
          cliente: reservation.clienteNombre,
          checkIn: reservation.fechaCheckIn,
          checkOut: reservation.fechaCheckOut,
          habitacion: reservation.habitacionNombre,
          estado: reservation.estadoReserva,
        });
      }
      
      return isActive;
    });

    return active;
  },

  getOnlinePaymentReservations: () => {
    return get().reservations.filter(
      reservation => reservation.estadoPago === 'pagado_online'
    );
  },
}));
