import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Shield, User, TrendingUp, Search, X, Calendar, MapPin, Trophy, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { getTeams, type TeamListItem } from "../services/teams/teams.service";

const fallbackTeamsData: TeamListItem[] = [
  {
    id: 1,
    name: "Software Devs FC",
    captain: "Carlos Martínez",
    players: 10,
    position: 1,
    points: 13,
    wins: 4,
    draws: 1,
    losses: 0,
    color: "lime"
  },
  {
    id: 2,
    name: "Cybersecurity United",
    captain: "Ana González",
    players: 9,
    position: 2,
    points: 11,
    wins: 3,
    draws: 2,
    losses: 0,
    color: "blue"
  },
  {
    id: 3,
    name: "Data Science Dynamo",
    captain: "Luis Fernández",
    players: 10,
    position: 3,
    points: 9,
    wins: 3,
    draws: 0,
    losses: 2,
    color: "purple"
  },
  {
    id: 4,
    name: "AI Engineers",
    captain: "María López",
    players: 8,
    position: 4,
    points: 7,
    wins: 2,
    draws: 1,
    losses: 2,
    color: "orange"
  },
  {
    id: 5,
    name: "Cloud Architects",
    captain: "Pedro Sánchez",
    players: 9,
    position: 5,
    points: 4,
    wins: 1,
    draws: 1,
    losses: 3,
    color: "cyan"
  },
  {
    id: 6,
    name: "QA Testers Rovers",
    captain: "Laura Ramírez",
    players: 7,
    position: 6,
    points: 0,
    wins: 0,
    draws: 0,
    losses: 5,
    color: "red"
  }
];

export function Teams() {
  const [query, setQuery] = useState("");
  const [teamsData, setTeamsData] = useState<TeamListItem[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<TeamListItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTeams() {
      setIsLoading(true);

      try {
        const teams = await getTeams();
        if (teams.length > 0) {
          setTeamsData(teams);
        }
      } catch (error) {
        console.error("No se pudieron cargar los equipos", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadTeams();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return teamsData;
    return teamsData.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.captain.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Equipos</h1>
          <p className="text-zinc-500 mt-1">Todos los equipos participantes en el torneo</p>
        </div>
      </div>

      {/* Buscador interactivo */}
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${query ? "text-lime-500" : "text-zinc-400"}`} />
        <Input
          placeholder="Buscar equipos..."
          className="pl-10 pr-10 border-zinc-300 focus:border-lime-500 transition-colors"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Feedback de resultados */}
      <AnimatePresence mode="wait">
        {query && (
          <motion.p
            key="results-info"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="text-sm text-zinc-500"
          >
            {filtered.length > 0 ? (
              <>
                Se encontraron{" "}
                <span className="font-semibold text-lime-600">{filtered.length}</span>{" "}
                equipo{filtered.length !== 1 ? "s" : ""} para{" "}
                <span className="font-semibold text-zinc-700">"{query}"</span>
              </>
            ) : (
              <>
                Sin resultados para{" "}
                <span className="font-semibold text-zinc-700">"{query}"</span>
              </>
            )}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Grid de equipos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && (
          <div className="col-span-full rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500">
            Cargando equipos...
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            filtered.map((team) => (
              <motion.div
                key={team.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -6 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <Card className="border-zinc-200 bg-white shadow-md hover:shadow-lg transition-all group h-full">
                  <CardHeader className="border-b border-zinc-100 pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-${team.color}-100 flex items-center justify-center shrink-0`}>
                          <Shield className={`w-6 h-6 text-${team.color}-600`} />
                        </div>
                        <div>
                          <CardTitle className="text-zinc-900 group-hover:text-lime-600 transition-colors">
                            {/* Resaltar coincidencia */}
                            {query ? (
                              <HighlightMatch text={team.name} query={query} />
                            ) : (
                              team.name
                            )}
                          </CardTitle>
                          <p className="text-sm text-zinc-500 mt-1 flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {query ? (
                              <HighlightMatch text={team.captain} query={query} />
                            ) : (
                              team.captain
                            )}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-lime-200 bg-lime-50 text-lime-700 font-bold">
                        #{team.position}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-lime-600">{team.points}</p>
                        <p className="text-xs text-zinc-500 mt-1">Puntos</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-zinc-900">{team.wins}</p>
                        <p className="text-xs text-zinc-500 mt-1">Victorias</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-zinc-600">{team.players}</p>
                        <p className="text-xs text-zinc-500 mt-1">Jugadores</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm pt-3 border-t border-zinc-100">
                      <span className="text-zinc-600">Rendimiento</span>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-lime-500" />
                        <span className="font-semibold text-lime-600">
                          {team.wins > 2 ? 'Excelente' : team.wins > 0 ? 'Bueno' : 'En desarrollo'}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full border-zinc-300 hover:border-lime-500 hover:text-lime-600 hover:bg-lime-50"
                      onClick={() => setSelectedTeam(team)}
                    >
                      Ver Equipo
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="col-span-full flex flex-col items-center justify-center py-16 text-center gap-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center">
                <Search className="w-8 h-8 text-zinc-300" />
              </div>
              <div>
                <p className="font-semibold text-zinc-700">No se encontraron equipos</p>
                <p className="text-sm text-zinc-400 mt-1">Intenta con otro nombre o capitán</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setQuery("")} className="border-zinc-300 text-zinc-600 hover:border-lime-400 hover:text-lime-600">
                Limpiar búsqueda
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Card className="border-lime-200 bg-lime-50 shadow-md">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-lime-100 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-lime-600" />
            </div>
            <div>
              <h4 className="font-semibold text-lime-900 mb-1">¿Quieres crear tu equipo?</h4>
              <p className="text-sm text-lime-700">
                Regístrate como capitán, crea tu equipo e invita jugadores a unirse.
              </p>
            </div>
          </div>
          <Button
            className="bg-lime-600 hover:bg-lime-700 text-white font-semibold whitespace-nowrap"
            onClick={() => toast.info("Crear equipo", { description: "Regístrate como capitán para crear y gestionar tu equipo.", duration: 3000 })}
          >
            Crear Equipo
          </Button>
        </CardContent>
      </Card>

      {/* ── Modal: Detalle del equipo ── */}
      <AnimatePresence>
        {selectedTeam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setSelectedTeam(null)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 12 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 rounded-2xl bg-${selectedTeam.color}-100 flex items-center justify-center shadow-sm`}>
                    <Shield className={`w-7 h-7 text-${selectedTeam.color}-600`} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-zinc-900">{selectedTeam.name}</h2>
                    <p className="text-sm text-zinc-500 flex items-center gap-1 mt-0.5">
                      <User className="w-3.5 h-3.5" /> {selectedTeam.captain}
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelectedTeam(null)} className="w-8 h-8 rounded-lg hover:bg-zinc-100 flex items-center justify-center text-zinc-500 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Position badge */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="border-lime-200 bg-lime-50 text-lime-700 font-bold">
                  <Trophy className="w-3 h-3 mr-1" /> Posición #{selectedTeam.position}
                </Badge>
                <Badge variant="outline" className="border-zinc-200 bg-zinc-50 text-zinc-600">
                  {selectedTeam.players} jugadores
                </Badge>
                <Badge variant="outline" className={`border-${selectedTeam.color}-200 bg-${selectedTeam.color}-50 text-${selectedTeam.color}-700`}>
                  {selectedTeam.wins > 2 ? '🏆 Excelente' : selectedTeam.wins > 0 ? '⚡ Bueno' : '📈 En desarrollo'}
                </Badge>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Puntos", value: selectedTeam.points, color: "text-lime-600" },
                  { label: "Victorias", value: selectedTeam.wins, color: "text-blue-600" },
                  { label: "Empates", value: selectedTeam.draws, color: "text-amber-600" },
                  { label: "Derrotas", value: selectedTeam.losses, color: "text-red-500" },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col items-center p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-center">
                    <span className={`text-2xl font-black ${s.color}`}>{s.value}</span>
                    <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wide mt-1">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Performance bar */}
              <div>
                <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
                  <span>Rendimiento de temporada</span>
                  <span className="font-semibold text-zinc-700">{selectedTeam.wins > 0 ? Math.round((selectedTeam.wins / (selectedTeam.wins + selectedTeam.draws + selectedTeam.losses)) * 100) : 0}% victorias</span>
                </div>
                <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedTeam.wins > 0 ? Math.round((selectedTeam.wins / (selectedTeam.wins + selectedTeam.draws + selectedTeam.losses)) * 100) : 0}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full bg-lime-500 rounded-full"
                  />
                </div>
              </div>

              <Button
                className="w-full bg-lime-500 hover:bg-lime-600 text-white font-semibold"
                onClick={() => {
                  toast.success(`Siguiendo a ${selectedTeam.name}`, { description: "Recibirás notificaciones de sus partidos.", duration: 2500 });
                  setSelectedTeam(null);
                }}
              >
                <Star className="w-4 h-4 mr-2" /> Seguir equipo
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Componente para resaltar coincidencias ──
function HighlightMatch({ text, query }: { text: string; query: string }) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-lime-200 text-lime-900 rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}