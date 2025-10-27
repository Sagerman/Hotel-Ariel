import { collection, addDoc, getDocs, query, orderBy, Timestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Reservation } from '../types/reservation';

const RESERVATIONS_COLLECTION = 'reservas';

export const reservationService = {
  // Crear nueva reserva
  async createReservation(reservation: Omit<Reservation, 'id' | 'createdAt'>): Promise<string> {
    try {
      // CRÍTICO: Crear fechas en hora local de Colombia sin conversión UTC
      // Usar Date.parse con formato ISO local (sin Z al final)
      const [checkInYear, checkInMonth, checkInDay] = reservation.fechaCheckIn.split('-').map(Number);
      const [checkOutYear, checkOutMonth, checkOutDay] = reservation.fechaCheckOut.split('-').map(Number);
      
      // Crear fechas en hora local (14:00 para check-in, 12:00 para check-out)
      const checkInDate = new Date(checkInYear, checkInMonth - 1, checkInDay, 14, 0, 0);
      const checkOutDate = new Date(checkOutYear, checkOutMonth - 1, checkOutDay, 12, 0, 0);

      console.log('Guardando reserva:', {
        checkInOriginal: reservation.fechaCheckIn,
        checkOutOriginal: reservation.fechaCheckOut,
        checkInDate: checkInDate.toString(),
        checkOutDate: checkOutDate.toString(),
        checkInISO: checkInDate.toISOString(),
        checkOutISO: checkOutDate.toISOString(),
      });

      const docRef = await addDoc(collection(db, RESERVATIONS_COLLECTION), {
        ...reservation,
        estadoReserva: 'activa',
        fechaCheckIn: Timestamp.fromDate(checkInDate),
        fechaCheckOut: Timestamp.fromDate(checkOutDate),
        createdAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  },

  // Obtener todas las reservas
  async getAllReservations(): Promise<Reservation[]> {
    try {
      const reservationsRef = collection(db, RESERVATIONS_COLLECTION);
      const q = query(reservationsRef, orderBy('fechaCheckIn', 'desc'));
      const snapshot = await getDocs(q);

      const reservations = snapshot.docs.map(doc => {
        const data = doc.data();
        
        // Manejar fechas que pueden venir como Timestamp o string
        let fechaCheckInStr: string;
        let fechaCheckOutStr: string;
        
        if (data.fechaCheckIn?.toDate) {
          // Es un Timestamp
          const checkInDate = data.fechaCheckIn.toDate();
          const checkInLocal = new Date(checkInDate.getTime() - (checkInDate.getTimezoneOffset() * 60000));
          fechaCheckInStr = checkInLocal.toISOString().split('T')[0];
        } else {
          // Ya es un string
          fechaCheckInStr = data.fechaCheckIn;
        }
        
        if (data.fechaCheckOut?.toDate) {
          // Es un Timestamp
          const checkOutDate = data.fechaCheckOut.toDate();
          const checkOutLocal = new Date(checkOutDate.getTime() - (checkOutDate.getTimezoneOffset() * 60000));
          fechaCheckOutStr = checkOutLocal.toISOString().split('T')[0];
        } else {
          // Ya es un string
          fechaCheckOutStr = data.fechaCheckOut;
        }
        
        console.log('Reserva cargada:', {
          id: doc.id,
          cliente: data.clienteNombre,
          estado: data.estadoReserva,
          checkInFinal: fechaCheckInStr,
          checkOutFinal: fechaCheckOutStr,
        });
        
        return {
          id: doc.id,
          clienteNombre: data.clienteNombre,
          clienteEmail: data.clienteEmail,
          clienteCedula: data.clienteCedula,
          clienteTelefono: data.clienteTelefono,
          habitacionId: data.habitacionId,
          habitacionNombre: data.habitacionNombre,
          tipoHabitacion: data.tipoHabitacion,
          serviciosExtras: data.serviciosExtras || [],
          precioTotal: data.precioTotal,
          estadoPago: data.estadoPago,
          estadoReserva: data.estadoReserva || 'activa',
          fechaCancelacion: data.fechaCancelacion,
          fuenteReserva: data.fuenteReserva,
          fechaCheckIn: fechaCheckInStr,
          fechaCheckOut: fechaCheckOutStr,
          createdAt: data.createdAt?.toDate?.().toISOString(),
        } as Reservation;
      });

      console.log('Total reservas cargadas:', reservations.length);
      return reservations;
    } catch (error) {
      console.error('Error fetching reservations:', error);
      throw error;
    }
  },


  // Completar check-out (marcar como completada SIN cambiar la fecha)
  async completeCheckout(reservationId: string): Promise<void> {
    try {
      const reservationRef = doc(db, RESERVATIONS_COLLECTION, reservationId);
      
      // SOLO cambiar el estado, NO modificar fechas
      await updateDoc(reservationRef, {
        estadoReserva: 'completada',
      });
      
      console.log('Check-out completado para reserva:', reservationId);
    } catch (error) {
      console.error('Error completing checkout:', error);
      throw error;
    }
  },

  // Cancelar reserva (marcar como cancelada en lugar de eliminar)
  async cancelReservation(reservationId: string): Promise<void> {
    try {
      const reservationRef = doc(db, RESERVATIONS_COLLECTION, reservationId);
      await updateDoc(reservationRef, {
        estadoReserva: 'cancelada',
        fechaCancelacion: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error canceling reservation:', error);
      throw error;
    }
  },

  // Eliminar reserva (solo para casos excepcionales)
  async deleteReservation(reservationId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, RESERVATIONS_COLLECTION, reservationId));
    } catch (error) {
      console.error('Error deleting reservation:', error);
      throw error;
    }
  },
};
