import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import CheckOutsTodayCard from '../components/CheckOutsTodayCard';
import RoomGrid from '../components/RoomGrid';
import { useRoomStore } from '../stores/roomStore';
import { useReservationStore } from '../stores/reservationStore';

export default function HabitacionesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { initializeRooms } = useRoomStore();
  const { loadReservations } = useReservationStore();

  useEffect(() => {
    const loadData = async () => {
      await loadReservations();
      await initializeRooms();
    };
    loadData();
  }, [initializeRooms, loadReservations]);

  useEffect(() => {
    if (containerRef.current) {
      const elements = containerRef.current.querySelectorAll('.animate-on-load');
      gsap.fromTo(
        elements,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, []);

  return (
    <div ref={containerRef} className="p-8 space-y-8">
      <div className="animate-on-load">
        <h1 className="text-4xl font-headline font-semibold text-foreground mb-2">
          Gestión de Habitaciones
        </h1>
        <p className="text-muted-foreground">
          Vista rápida del estado de todas las habitaciones
        </p>
      </div>
      
      <div className="animate-on-load">
        <CheckOutsTodayCard />
      </div>
      <div className="animate-on-load">
        <RoomGrid />
      </div>
    </div>
  );
}
