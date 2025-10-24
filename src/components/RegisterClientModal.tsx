import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import gsap from 'gsap';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRoomStore } from '../stores/roomStore';
import type { Room } from '../types/room';

interface RegisterClientModalProps {
  room: Room;
  open: boolean;
  onClose: () => void;
}

interface FormData {
  clientName: string;
  clientId: string;
  clientPhone: string;
  numberOfNights: number;
}

export default function RegisterClientModal({ room, open, onClose }: RegisterClientModalProps) {
  const { checkIn } = useRoomStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

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

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const checkoutDate = new Date();
      checkoutDate.setDate(checkoutDate.getDate() + data.numberOfNights);
      const fechaSalida = checkoutDate.toISOString().split('T')[0];

      await checkIn(room.id, {
        clientName: data.clientName,
        clientId: data.clientId,
        clientPhone: data.clientPhone,
        fechaSalida,
      });

      reset();
      onClose();
    } catch (error) {
      console.error('Error registering client:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-popover text-popover-foreground">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline text-popover-foreground">
            Registrar Cliente - {room.name}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Complete la información del cliente para realizar el check-in
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="clientName" className="text-popover-foreground">
              Nombre del Cliente *
            </Label>
            <Input
              id="clientName"
              {...register('clientName', { required: 'Este campo es requerido' })}
              className="bg-background text-foreground border-border"
              placeholder="Juan Pérez"
            />
            {errors.clientName && (
              <p className="text-sm text-warning">{errors.clientName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientId" className="text-popover-foreground">
              Identificación *
            </Label>
            <Input
              id="clientId"
              {...register('clientId', { required: 'Este campo es requerido' })}
              className="bg-background text-foreground border-border"
              placeholder="12345678"
            />
            {errors.clientId && (
              <p className="text-sm text-warning">{errors.clientId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientPhone" className="text-popover-foreground">
              Teléfono *
            </Label>
            <Input
              id="clientPhone"
              type="tel"
              {...register('clientPhone', { required: 'Este campo es requerido' })}
              className="bg-background text-foreground border-border"
              placeholder="+1234567890"
            />
            {errors.clientPhone && (
              <p className="text-sm text-warning">{errors.clientPhone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="numberOfNights" className="text-popover-foreground">
              Número de Noches *
            </Label>
            <Input
              id="numberOfNights"
              type="number"
              min="1"
              {...register('numberOfNights', {
                required: 'Este campo es requerido',
                min: { value: 1, message: 'Mínimo 1 noche' },
              })}
              className="bg-background text-foreground border-border"
              placeholder="3"
            />
            {errors.numberOfNights && (
              <p className="text-sm text-warning">{errors.numberOfNights.message}</p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-background text-foreground border-border hover:bg-muted hover:text-foreground"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground"
            >
              {isSubmitting ? 'Registrando...' : 'Confirmar Registro'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
