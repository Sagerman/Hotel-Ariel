import type { Reservation } from '../types/reservation';
import type { Room } from '../types/room';

export const isRoomAvailableForDates = (
  roomId: string,
  checkInDate: Date,
  checkOutDate: Date,
  reservations: Reservation[],
  excludeReservationId?: string
): boolean => {
  // Convertir a strings YYYY-MM-DD para comparación (hora local)
  const year1 = checkInDate.getFullYear();
  const month1 = String(checkInDate.getMonth() + 1).padStart(2, '0');
  const day1 = String(checkInDate.getDate()).padStart(2, '0');
  const requestCheckInStr = `${year1}-${month1}-${day1}`;
  
  const year2 = checkOutDate.getFullYear();
  const month2 = String(checkOutDate.getMonth() + 1).padStart(2, '0');
  const day2 = String(checkOutDate.getDate()).padStart(2, '0');
  const requestCheckOutStr = `${year2}-${month2}-${day2}`;

  // Verificar si hay conflictos con reservas existentes (solo activas)
  const hasConflict = reservations.some(reservation => {
    if (excludeReservationId && reservation.id === excludeReservationId) {
      return false;
    }

    if (reservation.habitacionId !== roomId) {
      return false;
    }

    // Ignorar reservas canceladas o completadas
    if (reservation.estadoReserva === 'cancelada' || reservation.estadoReserva === 'completada') {
      return false;
    }

    // Verificar solapamiento de fechas (comparación de strings YYYY-MM-DD)
    const overlap = (
      (requestCheckInStr >= reservation.fechaCheckIn && requestCheckInStr < reservation.fechaCheckOut) ||
      (requestCheckOutStr > reservation.fechaCheckIn && requestCheckOutStr <= reservation.fechaCheckOut) ||
      (requestCheckInStr <= reservation.fechaCheckIn && requestCheckOutStr >= reservation.fechaCheckOut)
    );

    return overlap;
  });

  return !hasConflict;
};

export const getAvailableRooms = (
  rooms: Room[],
  checkInDate: Date,
  checkOutDate: Date,
  reservations: Reservation[],
  roomType?: 'suite' | 'superior' | 'normal'
): Room[] => {
  let filteredRooms = rooms;

  if (roomType) {
    filteredRooms = rooms.filter(room => room.type.toLowerCase() === roomType);
  }

  return filteredRooms.filter(room =>
    isRoomAvailableForDates(room.id, checkInDate, checkOutDate, reservations)
  );
};

export const isRoomCurrentlyOccupied = (
  roomId: string,
  reservations: Reservation[]
): Reservation | null => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  const activeReservation = reservations.find(reservation => {
    if (reservation.habitacionId !== roomId) {
      return false;
    }

    // Solo considerar reservas ACTIVAS (no completadas ni canceladas)
    if (reservation.estadoReserva !== 'activa') {
      return false;
    }

    // Comparar solo fechas (YYYY-MM-DD)
    const isOccupied = reservation.fechaCheckIn <= todayStr && reservation.fechaCheckOut >= todayStr;
    
    if (isOccupied) {
      console.log('Habitación ocupada:', {
        roomId,
        cliente: reservation.clienteNombre,
        checkIn: reservation.fechaCheckIn,
        checkOut: reservation.fechaCheckOut,
        estado: reservation.estadoReserva,
        hoy: todayStr,
      });
    }

    return isOccupied;
  });

  return activeReservation || null;
};
