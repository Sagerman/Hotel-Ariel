import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReservationCalendar from '../components/ReservationCalendar';
import OnlinePaymentAlerts from '../components/OnlinePaymentAlerts';
import CreateReservationModal from '../components/CreateReservationModal';
import { useReservationStore } from '../stores/reservationStore';

export default function DashboardPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { loadReservations } = useReservationStore();
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

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
    <>
      <div ref={containerRef} className="p-8 space-y-8">
        <div className="flex items-center justify-between animate-on-load">
          <div>
            <h1 className="text-4xl font-headline font-semibold text-foreground">
              Calendario de Reservas
            </h1>
            <p className="text-muted-foreground mt-2">
              Gestiona las reservas del Hotel Grupo Ariel
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Nueva Reserva
          </Button>
        </div>

        <div className="animate-on-load">
          <OnlinePaymentAlerts />
        </div>

        <div className="animate-on-load">
          <ReservationCalendar />
        </div>
      </div>

      <CreateReservationModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </>
  );
}
