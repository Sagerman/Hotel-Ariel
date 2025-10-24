import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import CheckOutsTodayCard from '../components/CheckOutsTodayCard';
import RoomGrid from '../components/RoomGrid';
import { useRoomStore } from '../stores/roomStore';

export default function DashboardPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { initializeRooms } = useRoomStore();

  useEffect(() => {
    initializeRooms();
  }, [initializeRooms]);

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
        <CheckOutsTodayCard />
      </div>
      <div className="animate-on-load">
        <RoomGrid />
      </div>
    </div>
  );
}
