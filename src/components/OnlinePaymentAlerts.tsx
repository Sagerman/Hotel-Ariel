import { CreditCardIcon, AlertCircleIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useReservationStore } from '../stores/reservationStore';
import { formatDateColombia } from '../lib/timezone';

export default function OnlinePaymentAlerts() {
  const { reservations } = useReservationStore();

  const onlinePayments = reservations.filter(
    reservation => reservation.estadoPago === 'pagado_online'
  );

  if (onlinePayments.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-2 border-none shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <AlertCircleIcon className="w-8 h-8 text-primary-foreground" />
          <div>
            <CardTitle className="text-2xl font-headline text-primary-foreground">
              Alertas de Pago Online
            </CardTitle>
            <p className="text-sm text-primary-foreground/80 mt-1">
              {onlinePayments.length} {onlinePayments.length === 1 ? 'pago pendiente' : 'pagos pendientes'} de verificación
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {onlinePayments.map((reservation) => (
            <div
              key={reservation.id}
              className="flex items-center justify-between py-3 px-4 bg-white/20 backdrop-blur-sm rounded-lg"
            >
              <div className="flex items-center gap-3">
                <CreditCardIcon className="w-5 h-5 text-primary-foreground" />
                <div>
                  <p className="font-medium text-primary-foreground">{reservation.clienteNombre}</p>
                  <p className="text-sm text-primary-foreground/70">
                    {formatDateColombia(reservation.fechaCheckIn)} - {formatDateColombia(reservation.fechaCheckOut)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-primary-foreground">
                  ${reservation.precioTotal.toLocaleString()}
                </p>
                <Badge className="bg-success text-success-foreground mt-1">
                  Pagado Online
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
