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
import { useHistoryStore } from '../stores/historyStore';
import type { Room } from '../types/room';

interface ViewDetailsModalProps {
  room: Room;
  open: boolean;
  onClose: () => void;
}

export default function ViewDetailsModal({ room, open, onClose }: ViewDetailsModalProps) {
  const { checkOut } = useRoomStore();
  const { addRecord } = useHistoryStore();
  const [isProcessing, setIsProcessing] = useState(false);

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
    setIsProcessing(true);
    try {
      // Calcular número de noches
      const checkIn = new Date(room.checkInDate || '');
      const checkOutDate = new Date();
      const diffTime = Math.abs(checkOutDate.getTime() - checkIn.getTime());
      const numberOfNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Primero realizar check-out en la habitación
      await checkOut(room.id);

      // Luego guardar en historial
      await addRecord({
        roomId: room.id,
        roomName: room.name,
        roomType: room.type,
        clientName: room.clientName || '',
        clientId: room.clientId || '',
        clientPhone: room.clientPhone || '',
        checkInDate: room.checkInDate || '',
        checkOutDate: new Date().toISOString().split('T')[0],
        numberOfNights: numberOfNights || 1,
      });

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
