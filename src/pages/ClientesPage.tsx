import { useEffect, useState } from 'react';
import { UserIcon, PhoneIcon, CreditCardIcon, CalendarIcon, MailIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useReservationStore } from '../stores/reservationStore';
import { formatDateColombia } from '../lib/timezone';
import { ROOM_TYPES, type Reservation } from '../types/reservation';
import ReservationDetailsModal from '../components/ReservationDetailsModal';

export default function ClientesPage() {
  const { reservations, loadReservations, getActiveReservations } = useReservationStore();
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  const activeReservations = getActiveReservations();

  const handleViewDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowDetailsModal(true);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-headline font-semibold text-foreground">
            Clientes Actuales
          </h1>
          <p className="text-muted-foreground mt-2">
            {activeReservations.length} {activeReservations.length === 1 ? 'cliente hospedado' : 'clientes hospedados'}
          </p>
        </div>
      </div>

      {activeReservations.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="py-16 text-center">
            <UserIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-headline text-foreground mb-2">
              No hay clientes hospedados
            </h3>
            <p className="text-muted-foreground">
              No hay reservas activas en este momento
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeReservations.map((reservation) => (
            <Card key={reservation.id} className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-headline text-foreground">
                    {reservation.clienteNombre}
                  </CardTitle>
                  <Badge className="bg-occupied text-occupied-foreground">
                    {ROOM_TYPES[reservation.tipoHabitacion].label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <MailIcon className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground text-sm">{reservation.clienteEmail}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <CreditCardIcon className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Cédula</p>
                    <p className="font-medium text-foreground">{reservation.clienteCedula}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <PhoneIcon className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Teléfono</p>
                    <p className="font-medium text-foreground">{reservation.clienteTelefono}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Habitación</p>
                    <p className="font-medium text-foreground">{reservation.habitacionNombre}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Check-in / Check-out</p>
                    <p className="font-medium text-foreground text-sm">
                      {formatDateColombia(reservation.fechaCheckIn)} 2:00 PM
                    </p>
                    <p className="font-medium text-foreground text-sm">
                      {formatDateColombia(reservation.fechaCheckOut)} 12:00 PM
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                  <span className="text-sm text-muted-foreground">Total:</span>
                  <span className="text-lg font-semibold text-primary">
                    ${reservation.precioTotal.toLocaleString()}
                  </span>
                </div>

                <Button
                  onClick={() => handleViewDetails(reservation)}
                  className="w-full bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground"
                >
                  Ver Detalles
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ReservationDetailsModal
        reservation={selectedReservation}
        open={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedReservation(null);
        }}
      />
    </div>
  );
}
