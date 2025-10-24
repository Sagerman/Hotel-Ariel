import { useEffect } from 'react';
import { HistoryIcon, UserIcon, BedIcon, CalendarIcon, ClockIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useHistoryStore } from '../stores/historyStore';

export default function HistorialPage() {
  const { history, loading, loadHistory } = useHistoryStore();

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <p className="text-muted-foreground">Cargando historial...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-headline font-semibold text-foreground">
            Historial de Clientes
          </h1>
          <p className="text-muted-foreground mt-2">
            {history.length} {history.length === 1 ? 'registro' : 'registros'} en total
          </p>
        </div>
      </div>

      {history.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="py-16 text-center">
            <HistoryIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-headline text-foreground mb-2">
              No hay registros en el historial
            </h3>
            <p className="text-muted-foreground">
              Los check-outs realizados aparecerán aquí
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map((record) => (
            <Card key={record.id} className="bg-card border-border hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserIcon className="w-6 h-6 text-primary" />
                    <div>
                      <CardTitle className="text-xl font-headline text-foreground">
                        {record.clientName}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">ID: {record.clientId}</p>
                    </div>
                  </div>
                  <Badge className="bg-primary text-primary-foreground">
                    {record.roomType}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <BedIcon className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Habitación</p>
                      <p className="font-medium text-foreground">{record.roomName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Check-in</p>
                      <p className="font-medium text-foreground">{record.checkInDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-warning" />
                    <div>
                      <p className="text-xs text-muted-foreground">Check-out</p>
                      <p className="font-medium text-foreground">{record.checkOutDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Noches</p>
                      <p className="font-medium text-foreground">{record.numberOfNights}</p>
                    </div>
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
