import { useMemo, useState } from 'react';
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useReservationStore } from '../stores/reservationStore';
import { ROOM_TYPES, type Reservation } from '../types/reservation';
import ReservationDetailsModal from './ReservationDetailsModal';
import './calendar-styles.css';

const locales = {
  es: es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: es }),
  getDay,
  locales,
});

export default function ReservationCalendar() {
  const { reservations } = useReservationStore();
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const events: Event[] = useMemo(() => {
    // Filtrar solo reservas activas (no completadas ni canceladas)
    return reservations
      .filter(reservation => reservation.estadoReserva === 'activa')
      .map(reservation => {
        // CRÍTICO: Crear fechas en hora local sin conversión UTC
        const [checkInYear, checkInMonth, checkInDay] = reservation.fechaCheckIn.split('-').map(Number);
        const [checkOutYear, checkOutMonth, checkOutDay] = reservation.fechaCheckOut.split('-').map(Number);
        
        const startDate = new Date(checkInYear, checkInMonth - 1, checkInDay);
        const endDate = new Date(checkOutYear, checkOutMonth - 1, checkOutDay);
        
        console.log('Evento calendario:', {
          cliente: reservation.clienteNombre,
          checkInStr: reservation.fechaCheckIn,
          checkOutStr: reservation.fechaCheckOut,
          startDate: startDate.toString(),
          endDate: endDate.toString(),
        });
        
        return {
          title: `${reservation.habitacionNombre} - ${reservation.clienteNombre}`,
          start: startDate,
          end: endDate,
          resource: reservation,
        };
      });
  }, [reservations]);

  const eventStyleGetter = (event: Event) => {
    const reservation = event.resource;
    let backgroundColor = '#c9a961';

    if (reservation.tipoHabitacion === 'suite') {
      backgroundColor = '#8b7355';
    } else if (reservation.tipoHabitacion === 'superior') {
      backgroundColor = '#a0826d';
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  const handleSelectEvent = (event: Event) => {
    setSelectedReservation(event.resource as Reservation);
    setShowDetailsModal(true);
  };

  return (
    <>
      <div className="h-[700px] bg-card p-6 rounded-lg border border-border">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          messages={{
            next: 'Siguiente',
            previous: 'Anterior',
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
            agenda: 'Agenda',
            date: 'Fecha',
            time: 'Hora',
            event: 'Reserva',
            noEventsInRange: 'No hay reservas en este rango',
          }}
          culture="es"
        />
      </div>

      <ReservationDetailsModal
        reservation={selectedReservation}
        open={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedReservation(null);
        }}
      />
    </>
  );
}
