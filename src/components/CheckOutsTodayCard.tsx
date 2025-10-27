import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useReservationStore } from '../stores/reservationStore';
import { ROOM_TYPES } from '../types/reservation';

export default function CheckOutsTodayCard() {
  const [isExpanded, setIsExpanded] = useState(true);
  const { reservations } = useReservationStore();

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;
  
  console.log('Check-outs para hoy:', todayStr);
  
  const checkoutsToday = reservations.filter((reservation) => {
    // Solo mostrar reservas ACTIVAS (no completadas ni canceladas)
    if (reservation.estadoReserva !== 'activa') return false;
    
    // Comparar fechas como strings
    const isToday = reservation.fechaCheckOut === todayStr;
    if (isToday) {
      console.log('Check-out hoy:', reservation.clienteNombre, reservation.fechaCheckOut);
    }
    return isToday;
  });

  return (
    <Card className="bg-gradient-1 border-none shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-navbar-foreground" />
            <div>
              <CardTitle className="text-2xl font-headline text-navbar-foreground">
                Check-outs para Hoy
              </CardTitle>
              <p className="text-sm text-navbar-foreground/80 mt-1">
                {checkoutsToday.length} {checkoutsToday.length === 1 ? 'habitación' : 'habitaciones'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-transparent text-navbar-foreground hover:bg-secondary hover:text-navbar-foreground"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronUpIcon className="w-6 h-6" /> : <ChevronDownIcon className="w-6 h-6" />}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && checkoutsToday.length > 0 && (
        <CardContent>
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4">
            <div className="space-y-3">
              {checkoutsToday.map((reservation) => (
                <div
                  key={reservation.id}
                  className="flex items-center justify-between py-3 px-4 bg-black/30 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-navbar-foreground">{reservation.clienteNombre}</p>
                    <p className="text-sm text-navbar-foreground/70">{reservation.clienteEmail}</p>
                  </div>
                  <span className="text-sm text-navbar-foreground/80">
                    {ROOM_TYPES[reservation.tipoHabitacion].label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      )}

      {isExpanded && checkoutsToday.length === 0 && (
        <CardContent>
          <p className="text-navbar-foreground/70 text-center py-4">No hay check-outs programados para hoy</p>
        </CardContent>
      )}
    </Card>
  );
}
