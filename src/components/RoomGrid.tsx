import { useMemo } from 'react';
import RoomCard from './RoomCard';
import { useRoomStore } from '../stores/roomStore';

export default function RoomGrid() {
  const { rooms } = useRoomStore();

  const roomsByType = useMemo(() => {
    return {
      Suites: rooms.filter((room) => room.type === 'Suite'),
      Superiores: rooms.filter((room) => room.type === 'Superior'),
      Normales: rooms.filter((room) => room.type === 'Normal'),
    };
  }, [rooms]);

  return (
    <div className="space-y-12">
      {Object.entries(roomsByType).map(([type, typeRooms]) => (
        <section key={type}>
          <h2 className="text-2xl font-headline font-semibold mb-6 text-foreground">
            {type} ({typeRooms.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {typeRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
