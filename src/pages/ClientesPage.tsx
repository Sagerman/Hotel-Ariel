import { useEffect } from 'react';
import { UserIcon, PhoneIcon, CreditCardIcon, CalendarIcon, BedIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRoomStore } from '../stores/roomStore';

export default function ClientesPage() {
  const { rooms, initializeRooms } = useRoomStore();

  useEffect(() => {
    initializeRooms();
  }, [initializeRooms]);

  const occupiedRooms = rooms.filter(room => room.status === 'occupied');

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-headline font-semibold text-foreground">
            Clientes Actuales
          </h1>
          <p className="text-muted-foreground mt-2">
            {occupiedRooms.length} {occupiedRooms.length === 1 ? 'cliente hospedado' : 'clientes hospedados'}
          </p>
        </div>
      </div>

      {occupiedRooms.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="py-16 text-center">
            <UserIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-headline text-foreground mb-2">
              No hay clientes hospedados
            </h3>
            <p className="text-muted-foreground">
              Todas las habitaciones están disponibles
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {occupiedRooms.map((room) => (
            <Card key={room.id} className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-headline text-foreground">
                    {room.clientName}
                  </CardTitle>
                  <Badge className="bg-occupied text-occupied-foreground">
                    {room.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <BedIcon className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Habitación</p>
                    <p className="font-medium text-foreground">{room.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <CreditCardIcon className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Identificación</p>
                    <p className="font-medium text-foreground">{room.clientId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <PhoneIcon className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Teléfono</p>
                    <p className="font-medium text-foreground">{room.clientPhone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Check-in / Check-out</p>
                    <p className="font-medium text-foreground text-sm">
                      {room.checkInDate || 'N/A'} → {room.fechaSalida || 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
