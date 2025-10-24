import { useState, useEffect } from 'react';
import { UserIcon, CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RegisterClientModal from './RegisterClientModal';
import ViewDetailsModal from './ViewDetailsModal';
import type { Room } from '../types/room';

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [cardBg, setCardBg] = useState('');

  useEffect(() => {
    setCardBg(room.status === 'available' ? 'bg-available' : 'bg-occupied');
  }, [room.status]);

  const isAvailable = room.status === 'available';

  return (
    <>
      <Card
        className={`${cardBg} border-none transition-all duration-250 ease-in hover:scale-105 cursor-pointer shadow-lg`}
        onClick={() => {
          if (isAvailable) {
            setShowRegisterModal(true);
          } else {
            setShowDetailsModal(true);
          }
        }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className={`text-xl font-headline ${isAvailable ? 'text-available-foreground' : 'text-occupied-foreground'}`}>
              {room.name}
            </CardTitle>
            <Badge
              variant={isAvailable ? 'default' : 'destructive'}
              className={`${
                isAvailable
                  ? 'bg-primary text-primary-foreground border border-primary-foreground/20'
                  : 'bg-occupied text-occupied-foreground border border-occupied-foreground/20'
              }`}
            >
              {isAvailable ? 'Disponible' : 'Ocupada'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {!isAvailable && (
            <>
              <div className="flex items-center gap-2">
                <UserIcon className={`w-5 h-5 ${isAvailable ? 'text-available-foreground' : 'text-occupied-foreground'}`} />
                <span className={`text-sm ${isAvailable ? 'text-available-foreground' : 'text-occupied-foreground'}`}>
                  Cliente: {room.clientName || 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className={`w-5 h-5 ${isAvailable ? 'text-available-foreground' : 'text-occupied-foreground'}`} />
                <span className={`text-sm ${isAvailable ? 'text-available-foreground' : 'text-occupied-foreground'}`}>
                  Salida: {room.fechaSalida || 'N/A'}
                </span>
              </div>
            </>
          )}
          {isAvailable && (
            <p className="text-sm text-available-foreground">
              Habitación disponible para reserva
            </p>
          )}
        </CardContent>

        <CardFooter>
          <Button
            className={`w-full ${
              isAvailable
                ? 'bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              if (isAvailable) {
                setShowRegisterModal(true);
              } else {
                setShowDetailsModal(true);
              }
            }}
          >
            {isAvailable ? 'Registrar Cliente' : 'Ver Detalles / Check-out'}
          </Button>
        </CardFooter>
      </Card>

      <RegisterClientModal
        room={room}
        open={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
      />

      <ViewDetailsModal
        room={room}
        open={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      />
    </>
  );
}
