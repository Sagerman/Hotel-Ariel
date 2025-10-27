import { useState, useEffect } from 'react';
import gsap from 'gsap';
import { UserIcon, PhoneIcon, CreditCardIcon, CalendarIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRoomStore } from '../stores/roomStore';
import { useReservationStore } from '../stores/reservationStore';
import type { Room } from '../types/room';

interface ViewDetailsModalProps {
  room: Room;
  open: boolean;
  onClose: () => void;
}

export default function ViewDetailsModal({ room, open, onClose }: ViewDetailsModalProps) {
  const { initializeRooms } = useRoomStore();
  const { completeCheckout, reservations } = useReservationStore();
  const [isProcessing, setIsProcessing] = useState(false);

  // Encontrar la reserva activa para esta habitación
  const activeReservation = reservations.find(
    r => r.habitacionId === room.id && r.estadoReserva === 'activa'
  );

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

  const handleCheckOut = async () => {
    if (!activeReservation) {
      alert('No se encontró una reserva activa para esta habitación');
      return;
    }

    const confirmed = window.confirm(
      `¿Confirmar check-out de ${room.clientName}?\n\nLa habitación quedará disponible inmediatamente.`
    );

    if (!confirmed) return;

    setIsProcessing(true);
    try {
      console.log('Iniciando check-out para reserva:', activeReservation.id);
      
      // Completar el check-out (marca la reserva como completada)
      await completeCheckout(activeReservation.id);
      
      console.log('Check-out completado, recargando habitaciones...');
      
      // Recargar habitaciones para actualizar el estado
      await initializeRooms();
      
      console.log('Habitaciones actualizadas');
      
      // Cerrar modal
      onClose();
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Error al realizar el check-out. Por favor intente nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-popover text-popover-foreground">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline text-popover-foreground">
            Detalles de {room.name}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Información del cliente actual
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <UserIcon className="w-6 h-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Cliente</p>
              <p className="font-medium text-popover-foreground">{room.clientName || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <CreditCardIcon className="w-6 h-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Identificación</p>
              <p className="font-medium text-popover-foreground">{room.clientId || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <PhoneIcon className="w-6 h-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Teléfono</p>
              <p className="font-medium text-popover-foreground">{room.clientPhone || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <CalendarIcon className="w-6 h-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Fecha de Salida</p>
              <p className="font-medium text-popover-foreground">{room.fechaSalida || 'N/A'}</p>
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
            onClick={handleCheckOut}
            disabled={isProcessing}
            className="bg-warning text-warning-foreground hover:bg-warning/90 hover:text-warning-foreground"
          >
            {isProcessing ? 'Procesando...' : 'Realizar Check-out'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
