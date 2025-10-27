import { useEffect } from 'react';
import { HistoryIcon, UserIcon, CalendarIcon, CreditCardIcon, MailIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useReservationStore } from '../stores/reservationStore';
import { formatDateColombia } from '../lib/timezone';
import { ROOM_TYPES } from '../types/reservation';

export default function HistorialPage() {
  const { reservations, loading, loadReservations } = useReservationStore();

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <p className="text-muted-foreground">Cargando historial...</p>
      </div>
    );
  }

  // Mostrar TODAS las reservas: completadas y canceladas
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;
  
  const pastReservations = reservations.filter(
    reservation => {
      console.log('Evaluando reserva para historial:', {
        cliente: reservation.clienteNombre,
        estado: reservation.estadoReserva,
        checkOut: reservation.fechaCheckOut,
        hoy: todayStr,
      });
      
      // Incluir reservas completadas
      if (reservation.estadoReserva === 'completada') {
        console.log('✅ Incluida: completada');
        return true;
      }
      
      // Incluir reservas canceladas
      if (reservation.estadoReserva === 'cancelada') {
        console.log('✅ Incluida: cancelada');
        return true;
      }
      
      // Incluir reservas activas cuyo check-out ya pasó
      if (reservation.estadoReserva === 'activa' && reservation.fechaCheckOut < todayStr) {
        console.log('✅ Incluida: check-out pasado');
        return true;
      }
      
      console.log('❌ No incluida');
      return false;
    }
  );

  console.log('Total reservas en historial:', pastReservations.length);

  // Ordenar por fecha de cancelación o check-out más reciente primero
  const sortedReservations = [...pastReservations].sort((a, b) => {
    const dateA = a.estadoReserva === 'cancelada' && a.fechaCancelacion 
      ? new Date(a.fechaCancelacion).getTime()
      : new Date(a.fechaCheckOut).getTime();
    
    const dateB = b.estadoReserva === 'cancelada' && b.fechaCancelacion
      ? new Date(b.fechaCancelacion).getTime()
      : new Date(b.fechaCheckOut).getTime();
    
    return dateB - dateA;
  });

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-headline font-semibold text-foreground">
            Historial de Reservas
          </h1>
          <p className="text-muted-foreground mt-2">
            {pastReservations.length} {pastReservations.length === 1 ? 'reserva completada' : 'reservas completadas'}
          </p>
        </div>
      </div>

      {pastReservations.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="py-16 text-center">
            <HistoryIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-headline text-foreground mb-2">
              No hay registros en el historial
            </h3>
            <p className="text-muted-foreground">
              Las reservas completadas aparecerán aquí
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedReservations.map((reservation) => {
            // Calcular número de noches
            const checkIn = new Date(reservation.fechaCheckIn);
            const checkOut = new Date(reservation.fechaCheckOut);
            const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
            
            return (
              <Card key={reservation.id} className="bg-card border-border hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <UserIcon className="w-6 h-6 text-primary" />
                      <div>
                        <CardTitle className="text-xl font-headline text-foreground">
                          {reservation.clienteNombre}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{reservation.clienteEmail}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-primary text-primary-foreground">
                        {ROOM_TYPES[reservation.tipoHabitacion].label}
                      </Badge>
                      {reservation.estadoReserva === 'completada' && (
                        <Badge className="bg-success text-success-foreground">
                          Completada
                        </Badge>
                      )}
                      {reservation.estadoReserva === 'cancelada' && (
                        <Badge className="bg-warning text-warning-foreground">
                          Cancelada
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <CreditCardIcon className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Cédula</p>
                        <p className="font-medium text-foreground">{reservation.clienteCedula}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Check-in</p>
                        <p className="font-medium text-foreground">{formatDateColombia(reservation.fechaCheckIn)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-warning" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {reservation.estadoReserva === 'cancelada' ? 'Cancelada el' : 'Check-out'}
                        </p>
                        <p className="font-medium text-foreground">
                          {reservation.estadoReserva === 'cancelada' && reservation.fechaCancelacion
                            ? formatDateColombia(reservation.fechaCancelacion)
                            : formatDateColombia(reservation.fechaCheckOut)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <MailIcon className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Noches / Total</p>
                        <p className="font-medium text-foreground">{nights} noches - ${reservation.precioTotal.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm text-muted-foreground">Estado de Pago:</span>
                    <Badge className={
                      reservation.estadoPago === 'pagado_online' ? 'bg-success text-success-foreground' :
                      reservation.estadoPago === 'pagado_fisico' ? 'bg-primary text-primary-foreground' :
                      'bg-warning text-warning-foreground'
                    }>
                      {reservation.estadoPago === 'pagado_online' ? 'Pagado Online' :
                       reservation.estadoPago === 'pagado_fisico' ? 'Pagado Físico' :
                       'Pendiente'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
