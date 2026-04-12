import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Calendar, Users, MapPin, FileText, X } from "lucide-react";
import { LoadingButton } from "./LoadingButton";

interface Tournament {
  id: number;
  name: string;
  status: string;
  teams: number;
  startDate: string;
  endDate: string;
  location: string;
  category: string;
  statusColor: "lime" | "blue" | "zinc";
}

interface TournamentDetailsModalProps {
  tournament: Tournament | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TournamentDetailsModal({ tournament, open, onOpenChange }: TournamentDetailsModalProps) {
  if (!tournament) return null;

  const handleJoinTournament = async () => {
    // Simular solicitud asíncrona
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-5 h-5 text-lime-500" />
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    tournament.statusColor === 'lime' 
                      ? 'border-lime-200 bg-lime-50 text-lime-700' 
                      : tournament.statusColor === 'blue'
                      ? 'border-blue-200 bg-blue-50 text-blue-700'
                      : 'border-zinc-200 bg-zinc-50 text-zinc-600'
                  }`}
                >
                  {tournament.status}
                </Badge>
              </div>
              <DialogTitle className="text-2xl text-zinc-900">{tournament.name}</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Información Principal */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
              <div className="flex items-center gap-2 text-sm text-zinc-500 mb-2">
                <Calendar className="w-4 h-4" />
                <span>Fecha de Inicio</span>
              </div>
              <p className="text-lg font-bold text-zinc-900">{tournament.startDate}</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
              <div className="flex items-center gap-2 text-sm text-zinc-500 mb-2">
                <Calendar className="w-4 h-4" />
                <span>Fecha de Fin</span>
              </div>
              <p className="text-lg font-bold text-zinc-900">{tournament.endDate}</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
              <div className="flex items-center gap-2 text-sm text-zinc-500 mb-2">
                <Users className="w-4 h-4" />
                <span>Equipos Inscritos</span>
              </div>
              <p className="text-lg font-bold text-zinc-900">{tournament.teams}</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
              <div className="flex items-center gap-2 text-sm text-zinc-500 mb-2">
                <MapPin className="w-4 h-4" />
                <span>Ubicación</span>
              </div>
              <p className="text-lg font-bold text-zinc-900">{tournament.location}</p>
            </div>
          </div>

          {/* Descripción */}
          <div className="p-4 rounded-xl bg-lime-50 border border-lime-200">
            <div className="flex items-center gap-2 text-sm text-lime-700 mb-2">
              <FileText className="w-4 h-4" />
              <span className="font-semibold">Descripción del Torneo</span>
            </div>
            <p className="text-sm text-lime-800 leading-relaxed">
              Torneo de {tournament.category} con formato de Fútbol 7. Partidos de 20 minutos por mitad. 
              Sistema de eliminación directa con fase de grupos. Premio para los 3 primeros lugares.
              Inscripciones válidas hasta 48 horas antes del inicio.
            </p>
          </div>

          {/* Requisitos */}
          <div className="space-y-3">
            <h4 className="font-semibold text-zinc-900">Requisitos de Inscripción</h4>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-500 mt-2" />
                Equipo conformado por mínimo 7 jugadores y máximo 10
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-500 mt-2" />
                Todos los jugadores deben ser estudiantes activos
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-500 mt-2" />
                Pago de inscripción de $50.000 por equipo
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-500 mt-2" />
                Carnet universitario vigente obligatorio
              </li>
            </ul>
          </div>

          {/* Acciones */}
          <div className="flex gap-3 pt-4 border-t border-zinc-200">
            <Button 
              variant="outline" 
              className="flex-1 border-zinc-300"
              onClick={() => onOpenChange(false)}
            >
              Cerrar
            </Button>
            {tournament.status !== "Finalizado" && (
              <LoadingButton
                className="flex-1 bg-lime-500 hover:bg-lime-600 text-white font-semibold"
                loadingText="Enviando..."
                successText="Solicitud enviada"
                onAsyncClick={handleJoinTournament}
              >
                Inscribir Equipo
              </LoadingButton>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
