import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { LoadingButton } from "../../components/LoadingButton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getTeams } from "../../services/teams/teams.service";
import { createMatch, getTournamentHistory } from "../../services/organizer/organizer.service";

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue: string;
}

const venues = [
  "Cancha 1 - Principal",
  "Cancha 2 - Norte",
  "Cancha 3 - Sur",
  "Multicanchas Este"
];

export function ScheduleMatches() {
  const [teams, setTeams] = useState<string[]>([]);
  const [tournaments, setTournaments] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedTournament, setSelectedTournament] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);

  const [newMatch, setNewMatch] = useState({
    homeTeam: "",
    awayTeam: "",
    date: "",
    time: "",
    venue: ""
  });

  const [addState, setAddState] = useState<"idle" | "added">("idle");
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadData = async () => {
      try {
        const [teamsData, tournamentsData] = await Promise.all([
          getTeams(),
          getTournamentHistory(),
        ]);

        const teamNames = teamsData.map((team) => team.name);
        setTeams(teamNames);

        setTournaments(tournamentsData);
        if (tournamentsData.length) {
          setSelectedTournament(tournamentsData[0].name);
        }
      } catch {
        setTeams([]);
      }
    };

    void loadData();
  }, []);

  const handleAddMatch = () => {
    if (!newMatch.homeTeam || !newMatch.awayTeam || !newMatch.date || !newMatch.time || !newMatch.venue) {
      toast.error("Campos incompletos", {
        description: "Por favor completa todos los campos del partido.",
      });
      return;
    }

    if (newMatch.homeTeam === newMatch.awayTeam) {
      toast.error("Equipos inválidos", {
        description: "Un equipo no puede jugar contra sí mismo.",
      });
      return;
    }

    const match: Match = {
      id: Date.now().toString(),
      ...newMatch
    };

    setMatches([...matches, match]);
    setNewMatch({ homeTeam: "", awayTeam: "", date: "", time: "", venue: "" });

    // Flash "added" state briefly
    setAddState("added");
    setTimeout(() => setAddState("idle"), 2000);

    toast.success("Partido agregado", {
      description: `${match.homeTeam} vs ${match.awayTeam}`,
    });
  };

  const handleRemoveMatch = (id: string) => {
    setRemovedIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setMatches((m) => m.filter((match) => match.id !== id));
      setRemovedIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
    }, 400);
    toast.info("Partido eliminado");
  };

  const handleSaveSchedule = async () => {
    if (matches.length === 0) {
      toast.error("Sin partidos", {
        description: "Debes agregar al menos un partido antes de guardar.",
      });
      throw new Error("Sin partidos");
    }

    if (!selectedTournament) {
      toast.error("Selecciona un torneo", {
        description: "Debes seleccionar el torneo al que pertenece la programación.",
      });
      throw new Error("Sin torneo seleccionado");
    }

    await Promise.all(
      matches.map((match) =>
        createMatch({
          homeTeam: match.homeTeam,
          awayTeam: match.awayTeam,
          matchDate: `${match.date}T${match.time}:00`,
          tournamentName: selectedTournament,
        }),
      ),
    );

    toast.success("Programación guardada", {
      description: `Se han programado ${matches.length} partidos exitosamente.`,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Programar Partidos</h1>
          <p className="text-zinc-500 mt-1">Organiza el calendario de partidos de tu torneo</p>
        </div>
        <LoadingButton
          className="bg-lime-500 hover:bg-lime-600 text-white font-semibold shadow-md shadow-lime-500/20 active:scale-95 transition-all"
          icon={<Calendar className="w-4 h-4" />}
          loadingText="Guardando..."
          successText="¡Guardado!"
          onAsyncClick={handleSaveSchedule}
        >
          Guardar Programación
        </LoadingButton>
      </div>

      <Card className="border-zinc-200 bg-white shadow-sm">
        <CardContent className="p-4">
          <div className="space-y-2 max-w-md">
            <Label>Torneo</Label>
            <Select value={selectedTournament} onValueChange={setSelectedTournament}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar torneo" />
              </SelectTrigger>
              <SelectContent>
                {tournaments.map((tournament) => (
                  <SelectItem key={tournament.id} value={tournament.name}>
                    {tournament.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario para agregar partido */}
        <Card className="border-zinc-200 bg-white shadow-md lg:col-span-1">
          <CardHeader className="border-b border-zinc-100">
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="w-5 h-5 text-lime-500" />
              Nuevo Partido
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label>Equipo Local</Label>
              <Select value={newMatch.homeTeam} onValueChange={(value) => setNewMatch({...newMatch, homeTeam: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar equipo" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(team => (
                    <SelectItem key={team} value={team}>{team}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Equipo Visitante</Label>
              <Select value={newMatch.awayTeam} onValueChange={(value) => setNewMatch({...newMatch, awayTeam: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar equipo" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(team => (
                    <SelectItem key={team} value={team}>{team}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Fecha</Label>
              <Input
                type="date"
                value={newMatch.date}
                onChange={(e) => setNewMatch({...newMatch, date: e.target.value})}
                className="focus:border-lime-400 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label>Hora</Label>
              <Input
                type="time"
                value={newMatch.time}
                onChange={(e) => setNewMatch({...newMatch, time: e.target.value})}
                className="focus:border-lime-400 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label>Cancha</Label>
              <Select value={newMatch.venue} onValueChange={(value) => setNewMatch({...newMatch, venue: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cancha" />
                </SelectTrigger>
                <SelectContent>
                  {venues.map(venue => (
                    <SelectItem key={venue} value={venue}>{venue}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Add button with state feedback */}
            <button
              onClick={handleAddMatch}
              className={cn(
                "w-full h-10 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 active:scale-95",
                addState === "added"
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/25"
                  : "bg-lime-500 hover:bg-lime-600 text-white shadow-md shadow-lime-500/20 hover:shadow-lime-500/30"
              )}
            >
              {addState === "added" ? (
                <><CheckCircle2 className="w-4 h-4" /> ¡Partido Agregado!</>
              ) : (
                <><Plus className="w-4 h-4" /> Agregar Partido</>
              )}
            </button>
          </CardContent>
        </Card>

        {/* Lista de partidos programados */}
        <Card className="border-zinc-200 bg-white shadow-md lg:col-span-2">
          <CardHeader className="border-b border-zinc-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Partidos Programados</CardTitle>
              <Badge variant="secondary" className="bg-zinc-100 text-zinc-700">
                {matches.length} partidos
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {matches.length === 0 ? (
              <div className="p-12 text-center">
                <Calendar className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                <p className="text-zinc-500">No hay partidos programados</p>
                <p className="text-sm text-zinc-400 mt-1">Agrega tu primer partido usando el formulario</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {matches.map((match) => (
                  <div
                    key={match.id}
                    className={cn(
                      "p-5 hover:bg-zinc-50 transition-all duration-300",
                      removedIds.has(match.id) && "opacity-0 scale-95 pointer-events-none"
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="font-semibold text-zinc-900 mb-2">
                          {match.homeTeam} <span className="text-zinc-400 font-normal">vs</span> {match.awayTeam}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-zinc-600">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-zinc-400" />
                            {new Date(match.date).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-zinc-400" />
                            {match.time}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-zinc-400" />
                            {match.venue}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveMatch(match.id)}
                        className="p-2 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 active:scale-90 transition-all duration-150 border border-transparent hover:border-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}