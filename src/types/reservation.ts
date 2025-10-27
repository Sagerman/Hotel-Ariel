export interface Reservation {
  id: string;
  fechaCheckIn: string; // ISO string
  fechaCheckOut: string; // ISO string
  habitacionId: string; // ID de la habitación específica
  habitacionNombre: string; // Nombre de la habitación (ej: "Suite 1")
  clienteNombre: string;
  clienteEmail: string;
  clienteCedula: string;
  clienteTelefono: string;
  tipoHabitacion: 'suite' | 'superior' | 'normal';
  serviciosExtras: string[];
  precioTotal: number;
  estadoPago: 'pendiente' | 'pagado_online' | 'pagado_fisico';
  estadoReserva: 'activa' | 'completada' | 'cancelada';
  fechaCancelacion?: string;
  fuenteReserva: 'admin' | 'web';
  createdAt?: string;
}

export type RoomType = 'suite' | 'superior' | 'normal';

export interface RoomTypeInfo {
  label: string;
  count: number;
  basePrice: number;
}

export const ROOM_TYPES: Record<RoomType, RoomTypeInfo> = {
  suite: { label: 'Suite', count: 2, basePrice: 150000 },
  superior: { label: 'Superior', count: 4, basePrice: 100000 },
  normal: { label: 'Normal', count: 9, basePrice: 70000 },
};
