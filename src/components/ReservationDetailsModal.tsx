import { useState, useEffect } from 'react';
import gsap from 'gsap';
import { UserIcon, PhoneIcon, CreditCardIcon, CalendarIcon, MailIcon, BedIcon, TrashIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useReservationStore } from '../stores/reservationStore';
import { formatDateColombia } from '../lib/timezone';
import { ROOM_TYPES, type Reservation } from '../types/reservation';

interface ReservationDetailsModalProps {
  reservation: Reservation | null;
  open: boolean;
  onClose: () => void;
}

export default function ReservationDetailsModal({ reservation, open, onClose }: ReservationDetailsModalProps) {
  const { cancelReservation } = useReservationStore();
  const [isCanceling, setIsCanceling] = useState(false);

  useEffect(() => {
    if (open) {
      const content = document.querySelector('[role="dialog"]');
      if (content) {
        gsap.fromTo(
          content,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
        );
      }
    }
  }, [open]);

  if (!reservation) return null;

  const handleCancelReservation = async () => {
    const confirmed = window.confirm(
      `¿Está seguro de que desea cancelar la reserva de ${reservation.clienteNombre}?\n\nLa reserva quedará registrada en el historial como cancelada.`
    );

    if (!confirmed) return;

    setIsCanceling(true);
    try {
      await cancelReservation(reservation.id);
      onClose();
      
      // Recargar para actualizar habitaciones
      window.location.reload();
    } catch (error) {
      console.error('Error canceling reservation:', error);
      alert('Error al cancelar la reserva. Por favor intente nuevamente.');
    } finally {
      setIsCanceling(false);
    }
  };

  const nights = Math.ceil(
    (new Date(reservation.fechaCheckOut).getTime() - new Date(reservation.fechaCheckIn).getTime()) / 
    (1000 * 60 * 60 * 24)
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-popover text-popover-foreground max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-headline text-popover-foreground">
                Detalles de la Reserva
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1">
                {reservation.habitacionNombre}
              </DialogDescription>
            </div>
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
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <UserIcon className="w-6 h-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Cliente</p>
                <p className="font-medium text-popover-foreground">{reservation.clienteNombre}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <MailIcon className="w-6 h-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-popover-foreground text-sm">{reservation.clienteEmail}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <CreditCardIcon className="w-6 h-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Cédula</p>
                <p className="font-medium text-popover-foreground">{reservation.clienteCedula}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <PhoneIcon className="w-6 h-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Teléfono</p>
                <p className="font-medium text-popover-foreground">{reservation.clienteTelefono}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <BedIcon className="w-6 h-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Tipo de Habitación</p>
                <p className="font-medium text-popover-foreground">
                  {ROOM_TYPES[reservation.tipoHabitacion].label}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <CalendarIcon className="w-6 h-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Noches</p>
                <p className="font-medium text-popover-foreground">{nights} noches</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-primary/10 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Check-in:</span>
              <span className="font-medium text-popover-foreground">
                {formatDateColombia(reservation.fechaCheckIn)} - 2:00 PM
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Check-out:</span>
              <span className="font-medium text-popover-foreground">
                {formatDateColombia(reservation.fechaCheckOut)} - 12:00 PM
              </span>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg text-muted-foreground">Total:</span>
              <span className="text-3xl font-headline text-primary">
                ${reservation.precioTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="bg-background text-foreground border-border hover:bg-muted hover:text-foreground"
          >
            Cerrar
          </Button>
          <Button
            type="button"
            onClick={handleCancelReservation}
            disabled={isCanceling || reservation.estadoReserva === 'cancelada'}
            className="bg-warning text-warning-foreground hover:bg-warning/90 hover:text-warning-foreground disabled:opacity-50"
          >
            <TrashIcon className="w-4 h-4 mr-2" />
            {reservation.estadoReserva === 'cancelada' 
              ? 'Reserva Cancelada' 
              : isCanceling 
              ? 'Cancelando...' 
              : 'Cancelar Reserva'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
