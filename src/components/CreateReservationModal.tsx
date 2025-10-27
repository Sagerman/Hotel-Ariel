import { useState, useEffect, useMemo } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { useReservationStore } from '../stores/reservationStore';
import { useRoomStore } from '../stores/roomStore';
import { ROOM_TYPES, type RoomType } from '../types/reservation';
import { getColombiaDateString } from '../lib/timezone';
import { getAvailableRooms } from '../utils/roomAvailability';

interface CreateReservationModalProps {
  open: boolean;
  onClose: () => void;
}

interface FormData {
  clienteNombre: string;
  clienteEmail: string;
  clienteCedula: string;
  clienteTelefono: string;
  fechaCheckIn: string;
  fechaCheckOut: string;
  tipoHabitacion: RoomType;
  habitacionId: string;
  estadoPago: 'pendiente' | 'pagado_online' | 'pagado_fisico';
}

export default function CreateReservationModal({ open, onClose }: CreateReservationModalProps) {
  const { createReservation, reservations } = useReservationStore();
  const { rooms } = useRoomStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      fechaCheckIn: getColombiaDateString(),
      estadoPago: 'pendiente',
      tipoHabitacion: 'normal',
      habitacionId: '',
    },
  });

  const selectedRoomType = watch('tipoHabitacion');
  const checkInDate = watch('fechaCheckIn');
  const checkOutDate = watch('fechaCheckOut');
  const selectedRoomId = watch('habitacionId');

  const availableRooms = useMemo(() => {
    if (!checkInDate || !checkOutDate) return [];
    
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    
    if (checkOut <= checkIn) return [];

    return getAvailableRooms(rooms, checkIn, checkOut, reservations, selectedRoomType);
  }, [rooms, reservations, checkInDate, checkOutDate, selectedRoomType]);

  // Reset habitacionId cuando cambia el tipo de habitación o las fechas
  useEffect(() => {
    setValue('habitacionId', '');
  }, [selectedRoomType, checkInDate, checkOutDate, setValue]);

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

  const calculateTotal = (): number => {
    if (!checkInDate || !checkOutDate) return 0;
    
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    if (nights <= 0) return 0;
    
    return ROOM_TYPES[selectedRoomType].basePrice * nights;
  };

  const onSubmit = async (data: FormData) => {
    if (!data.habitacionId) {
      alert('Por favor seleccione una habitación');
      return;
    }

    setIsSubmitting(true);
    try {
      const total = calculateTotal();
      const selectedRoom = rooms.find(r => r.id === data.habitacionId);

      if (!selectedRoom) {
        throw new Error('Habitación no encontrada');
      }

      await createReservation({
        clienteNombre: data.clienteNombre,
        clienteEmail: data.clienteEmail,
        clienteCedula: data.clienteCedula,
        clienteTelefono: data.clienteTelefono,
        fechaCheckIn: data.fechaCheckIn, // Enviar como string YYYY-MM-DD
        fechaCheckOut: data.fechaCheckOut, // Enviar como string YYYY-MM-DD
        habitacionId: data.habitacionId,
        habitacionNombre: selectedRoom.name,
        tipoHabitacion: data.tipoHabitacion,
        estadoPago: data.estadoPago,
        precioTotal: total,
        serviciosExtras: [],
        fuenteReserva: 'admin',
      });

      reset();
      onClose();
      
      // Recargar habitaciones para actualizar el estado
      window.location.reload();
    } catch (error) {
      console.error('Error creating reservation:', error);
      alert('Error al crear la reserva. Por favor intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-popover text-popover-foreground max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline text-popover-foreground">
            Nueva Reserva
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Complete la información para crear una nueva reserva
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clienteNombre" className="text-popover-foreground">
                Nombre Completo *
              </Label>
              <Input
                id="clienteNombre"
                {...register('clienteNombre', { required: 'Este campo es requerido' })}
                className="bg-background text-foreground border-border"
                placeholder="Juan Pérez"
              />
              {errors.clienteNombre && (
                <p className="text-sm text-warning">{errors.clienteNombre.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="clienteEmail" className="text-popover-foreground">
                Email *
              </Label>
              <Input
                id="clienteEmail"
                type="email"
                {...register('clienteEmail', { required: 'Este campo es requerido' })}
                className="bg-background text-foreground border-border"
                placeholder="juan@example.com"
              />
              {errors.clienteEmail && (
                <p className="text-sm text-warning">{errors.clienteEmail.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="clienteCedula" className="text-popover-foreground">
                Cédula *
              </Label>
              <Input
                id="clienteCedula"
                {...register('clienteCedula', { required: 'Este campo es requerido' })}
                className="bg-background text-foreground border-border"
                placeholder="12345678"
              />
              {errors.clienteCedula && (
                <p className="text-sm text-warning">{errors.clienteCedula.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="clienteTelefono" className="text-popover-foreground">
                Teléfono *
              </Label>
              <Input
                id="clienteTelefono"
                type="tel"
                {...register('clienteTelefono', { required: 'Este campo es requerido' })}
                className="bg-background text-foreground border-border"
                placeholder="+57 300 123 4567"
              />
              {errors.clienteTelefono && (
                <p className="text-sm text-warning">{errors.clienteTelefono.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaCheckIn" className="text-popover-foreground">
                Fecha Check-in *
              </Label>
              <Input
                id="fechaCheckIn"
                type="date"
                {...register('fechaCheckIn', { required: 'Este campo es requerido' })}
                className="bg-background text-foreground border-border"
              />
              {errors.fechaCheckIn && (
                <p className="text-sm text-warning">{errors.fechaCheckIn.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaCheckOut" className="text-popover-foreground">
                Fecha Check-out *
              </Label>
              <Input
                id="fechaCheckOut"
                type="date"
                {...register('fechaCheckOut', { required: 'Este campo es requerido' })}
                className="bg-background text-foreground border-border"
              />
              {errors.fechaCheckOut && (
                <p className="text-sm text-warning">{errors.fechaCheckOut.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoHabitacion" className="text-popover-foreground">
                Tipo de Habitación *
              </Label>
              <select
                id="tipoHabitacion"
                {...register('tipoHabitacion', { required: 'Este campo es requerido' })}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {Object.entries(ROOM_TYPES).map(([key, info]) => (
                  <option key={key} value={key}>
                    {info.label} - ${info.basePrice.toLocaleString()}/noche
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="habitacionId" className="text-popover-foreground">
                Habitación Específica *
              </Label>
              <select
                id="habitacionId"
                {...register('habitacionId', { required: 'Debe seleccionar una habitación' })}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                disabled={!checkInDate || !checkOutDate || availableRooms.length === 0}
              >
                <option value="">
                  {!checkInDate || !checkOutDate
                    ? 'Seleccione fechas primero'
                    : availableRooms.length === 0
                    ? 'No hay habitaciones disponibles'
                    : 'Seleccione una habitación'}
                </option>
                {availableRooms.map(room => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
              {checkInDate && checkOutDate && (
                <p className="text-xs text-muted-foreground">
                  {availableRooms.length} {availableRooms.length === 1 ? 'habitación disponible' : 'habitaciones disponibles'}
                </p>
              )}
              {errors.habitacionId && (
                <p className="text-sm text-warning">{errors.habitacionId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="estadoPago" className="text-popover-foreground">
                Estado de Pago *
              </Label>
              <select
                id="estadoPago"
                {...register('estadoPago', { required: 'Este campo es requerido' })}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="pendiente">Pendiente</option>
                <option value="pagado_online">Pagado Online</option>
                <option value="pagado_fisico">Pagado Físico</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Estimado:</span>
                <span className="text-2xl font-headline text-primary">
                  ${calculateTotal().toLocaleString()}
                </span>
              </div>
            </div>

            <div className="p-4 bg-primary/10 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Check-in:</span>
                <Badge variant="outline" className="bg-background">
                  {checkInDate ? `${checkInDate} a las 2:00 PM` : 'Seleccione fecha'}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Check-out:</span>
                <Badge variant="outline" className="bg-background">
                  {checkOutDate ? `${checkOutDate} hasta las 12:00 PM` : 'Seleccione fecha'}
                </Badge>
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
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground"
            >
              {isSubmitting ? 'Creando...' : 'Crear Reserva'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
