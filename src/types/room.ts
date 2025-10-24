export interface Room {
  id: string;
  name: string;
  type: 'Suite' | 'Superior' | 'Normal';
  status: 'available' | 'occupied';
  clientName?: string;
  clientId?: string;
  clientPhone?: string;
  fechaSalida?: string;
  checkInDate?: string;
}
