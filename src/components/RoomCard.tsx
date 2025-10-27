import { useState, useEffect } from 'react';
import { UserIcon, CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CreateReservationModal from './CreateReservationModal';
import ViewDetailsModal from './ViewDetailsModal';
import type { Room } from '../types/room';

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  const [showCreateReservationModal, setShowCreateReservationModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [cardBg, setCardBg] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
    setCardBg(room.status === 'available' ? 'bg-available' : 'bg-occupied');
    
    // Establecer imagen de fondo según el tipo de habitación
    if (room.type === 'Suite') {
      setBackgroundImage('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80');
    } else if (room.type === 'Superior') {
      setBackgroundImage('https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80');
    } else {
      setBackgroundImage('https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80');
    }
  }, [room.status, room.type]);

  const isAvailable = room.status === 'available';

  return (
    <>
      <Card
        className={`${cardBg} border-none transition-all duration-250 ease-in hover:scale-105 cursor-pointer shadow-lg relative overflow-hidden`}
        onClick={() => {
          if (isAvailable) {
            setShowCreateReservationModal(true);
          } else {
            setShowDetailsModal(true);
          }
        }}
      >
        {/* Imagen de fondo */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        
        {/* Overlay para mejorar legibilidad */}
        <div className={`absolute inset-0 ${isAvailable ? 'bg-available/50' : 'bg-occupied/60'}`} />
        
        {/* Contenido de la tarjeta */}
        <div className="relative z-10">
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
                  Check-out: {room.fechaSalida || 'N/A'} - 12:00 PM
                </span>
              </div>
            </>
          )}
          {isAvailable && (
            <div className="space-y-2">
              <p className="text-sm text-available-foreground">
                Habitación disponible para reserva
              </p>
              <p className="text-xs text-available-foreground/70">
                Check-in disponible a partir de las 2:00 PM
              </p>
            </div>
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
                setShowCreateReservationModal(true);
              } else {
                setShowDetailsModal(true);
              }
            }}
          >
            {isAvailable ? 'Registrar Cliente' : 'Ver Detalles / Check-out'}
          </Button>
        </CardFooter>
        </div>
      </Card>

      <CreateReservationModal
        open={showCreateReservationModal}
        onClose={() => setShowCreateReservationModal(false)}
      />

      <ViewDetailsModal
        room={room}
        open={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      />
    </>
  );
}
