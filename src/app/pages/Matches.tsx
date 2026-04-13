import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, ChevronRight, X, Trophy, BarChart2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getApiErrorMessage } from "../services/auth/auth.service";
import { getMatches, type CompletedMatchListItem, type UpcomingMatchListItem } from "../services/matches/matches.service";

const fallbackUpcomingMatches: UpcomingMatchListItem[] = [
  { id: 1, home: "Software Devs FC", away: "Data Science Dynamo", date: "Mañana", time: "18:00", pitch: "Cancha 1 - Principal", round: "Jornada 6" },
  { id: 2, home: "Cybersecurity United", away: "AI Engineers", date: "Sábado 15 Mar", time: "14:00", pitch: "Cancha 2 - Norte", round: "Jornada 6" },
  { id: 3, home: "Cloud Architects", away: "QA Testers Rovers", date: "Sábado 15 Mar", time: "16:30", pitch: "Cancha 1 - Principal", round: "Jornada 6" },
];

const fallbackCompletedMatches: CompletedMatchListItem[] = [
  { id: 4, home: "Software Devs FC", homeScore: 3, away: "Cloud Architects", awayScore: 1, date: "10 Mar 2026", time: "18:00", round: "Jornada 5", homeStats: { shots: 12, possession: 61, fouls: 3 }, awayStats: { shots: 5, possession: 39, fouls: 6 } },
  { id: 5, home: "Cybersecurity United", homeScore: 1, away: "Data Science Dynamo", awayScore: 1, date: "10 Mar 2026", time: "20:00", round: "Jornada 5", homeStats: { shots: 8, possession: 52, fouls: 4 }, awayStats: { shots: 9, possession: 48, fouls: 5 } },
  { id: 6, home: "AI Engineers", homeScore: 2, away: "QA Testers Rovers", awayScore: 0, date: "9 Mar 2026", time: "19:00", round: "Jornada 5", homeStats: { shots: 11, possession: 67, fouls: 2 }, awayStats: { shots: 3, possession: 33, fouls: 8 } },
];

type UpcomingMatch = UpcomingMatchListItem;
type CompletedMatch = CompletedMatchListItem;

export function Matches() {
  const [upcomingMatches, setUpcomingMatches] = useState<UpcomingMatchListItem[]>(fallbackUpcomingMatches);
  const [completedMatches, setCompletedMatches] = useState<CompletedMatchListItem[]>(fallbackCompletedMatches);
  const [detailMatch, setDetailMatch] = useState<UpcomingMatch | null>(null);
  const [statsMatch, setStatsMatch] = useState<CompletedMatch | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      setIsLoading(true);

      try {
        const collections = await getMatches();

        if (collections.upcoming.length > 0) {
          setUpcomingMatches(collections.upcoming);
        }

        if (collections.completed.length > 0) {
          setCompletedMatches(collections.completed);
        }
      } catch (error) {
        console.error("No se pudieron cargar los partidos", error);
        toast.error(getApiErrorMessage(error, "No se pudieron cargar los partidos"));
      } finally {
        setIsLoading(false);
      }
    }

    loadMatches();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Partidos</h1>
          <p className="text-zinc-500 mt-1">Calendario completo de partidos y resultados</p>
        </div>
        <Badge variant="outline" className="text-xs border-zinc-200 text-zinc-600 bg-zinc-50">
          Copa Universitaria Primavera 2026
        </Badge>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-zinc-100">
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-white">Próximos</TabsTrigger>
          <TabsTrigger value="results" className="data-[state=active]:bg-white">Resultados</TabsTrigger>
        </TabsList>

        {isLoading && (
          <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500">
            Cargando partidos...
          </div>
        )}

        <TabsContent value="upcoming" className="mt-6 space-y-4">
          {upcomingMatches.map((match) => (
            <Card key={match.id} className="border-zinc-200 bg-white shadow-md hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4 text-xs text-zinc-500">
                      <Badge variant="outline" className="border-lime-200 bg-lime-50 text-lime-700">{match.round}</Badge>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{match.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{match.time}</span>
                    </div>
                    <div className="space-y-3 relative">
                      <div className="absolute top-1/2 left-1/2 md:left-auto md:right-0 -translate-x-1/2 md:translate-x-0 -translate-y-1/2 w-8 h-8 rounded-full bg-white border-2 border-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-400 z-10">VS</div>
                      <div className="flex items-center justify-between bg-zinc-50 p-3 rounded-xl border border-zinc-200 relative overflow-hidden group">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-lime-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="font-semibold text-zinc-800 pr-10">{match.home}</span>
                      </div>
                      <div className="flex items-center justify-between bg-zinc-50 p-3 rounded-xl border border-zinc-200 relative overflow-hidden group">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="font-semibold text-zinc-800 pr-10">{match.away}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end gap-3 md:gap-2 text-sm border-t md:border-t-0 md:border-l border-zinc-200 pt-4 md:pt-0 md:pl-6">
                    <div className="flex items-center gap-2 text-zinc-600">
                      <MapPin className="w-4 h-4 text-zinc-400" />
                      <span>{match.pitch}</span>
                    </div>
                    <Button
                      variant="ghost"
                      className="text-lime-600 hover:text-lime-700 hover:bg-lime-50 h-auto p-2"
                      onClick={() => setDetailMatch(match)}
                    >
                      Ver detalles
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="results" className="mt-6 space-y-4">
          {completedMatches.map((match) => (
            <Card key={match.id} className="border-zinc-200 bg-white shadow-md hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4 text-xs text-zinc-500">
                      <Badge variant="outline" className="border-zinc-200 bg-zinc-50 text-zinc-600">{match.round}</Badge>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{match.date}</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                        <span className="font-semibold text-zinc-800">{match.home}</span>
                        <span className="text-2xl font-bold text-zinc-900 min-w-[32px] text-center">{match.homeScore}</span>
                      </div>
                      <div className="flex items-center justify-between bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                        <span className="font-semibold text-zinc-800">{match.away}</span>
                        <span className="text-2xl font-bold text-zinc-900 min-w-[32px] text-center">{match.awayScore}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end gap-3 border-t md:border-t-0 md:border-l border-zinc-200 pt-4 md:pt-0 md:pl-6">
                    <Badge className={`${match.homeScore > match.awayScore ? 'bg-lime-500' : match.homeScore < match.awayScore ? 'bg-zinc-400' : 'bg-blue-500'} text-white`}>
                      {match.homeScore > match.awayScore ? 'Victoria Local' : match.homeScore < match.awayScore ? 'Victoria Visitante' : 'Empate'}
                    </Badge>
                    <Button
                      variant="ghost"
                      className="text-lime-600 hover:text-lime-700 hover:bg-lime-50 h-auto p-2"
                      onClick={() => setStatsMatch(match)}
                    >
                      Ver estadísticas
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <Card className="border-lime-200 bg-lime-50 shadow-md">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-lime-100 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-lime-600" />
            </div>
            <div>
              <h4 className="font-semibold text-lime-900 mb-1">¿Eres árbitro?</h4>
              <p className="text-sm text-lime-700">Consulta tus partidos asignados, horarios y ubicaciones de canchas.</p>
            </div>
          </div>
          <Button
            className="bg-lime-600 hover:bg-lime-700 text-white font-semibold whitespace-nowrap"
            onClick={() => toast.info("Redirigiendo al panel de árbitros", { description: "Inicia sesión con tu cuenta de árbitro para acceder.", duration: 3000 })}
          >
            Acceso de Árbitros
          </Button>
        </CardContent>
      </Card>

      {/* ── Modal: Detalles del partido próximo ── */}
      {detailMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setDetailMatch(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="outline" className="border-lime-200 bg-lime-50 text-lime-700 mb-2">{detailMatch.round}</Badge>
                <h2 className="text-xl font-bold text-zinc-900">Detalles del Partido</h2>
              </div>
              <button onClick={() => setDetailMatch(null)} className="w-8 h-8 rounded-lg hover:bg-zinc-100 flex items-center justify-center text-zinc-500 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between bg-lime-50 border border-lime-200 p-4 rounded-xl">
                <span className="font-bold text-zinc-900">{detailMatch.home}</span>
                <span className="text-xs font-semibold text-lime-700 bg-lime-100 px-2 py-0.5 rounded-full">Local</span>
              </div>
              <div className="text-center text-sm font-bold text-zinc-400">VS</div>
              <div className="flex items-center justify-between bg-zinc-50 border border-zinc-200 p-4 rounded-xl">
                <span className="font-bold text-zinc-900">{detailMatch.away}</span>
                <span className="text-xs font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">Visitante</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center gap-1.5 p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                <Calendar className="w-4 h-4 text-zinc-400" />
                <span className="text-xs text-zinc-500">Fecha</span>
                <span className="text-sm font-semibold text-zinc-900 text-center">{detailMatch.date}</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                <Clock className="w-4 h-4 text-zinc-400" />
                <span className="text-xs text-zinc-500">Hora</span>
                <span className="text-sm font-semibold text-zinc-900">{detailMatch.time}</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                <MapPin className="w-4 h-4 text-zinc-400" />
                <span className="text-xs text-zinc-500">Cancha</span>
                <span className="text-xs font-semibold text-zinc-900 text-center">{detailMatch.pitch}</span>
              </div>
            </div>

            <Button
              className="w-full bg-lime-500 hover:bg-lime-600 text-white font-semibold"
              onClick={() => { toast.success("¡Recordatorio activado!", { description: `Te notificaremos antes del partido ${detailMatch.home} vs ${detailMatch.away}.`, duration: 3000 }); setDetailMatch(null); }}
            >
              Activar recordatorio
            </Button>
          </div>
        </div>
      )}

      {/* ── Modal: Estadísticas del partido completado ── */}
      {statsMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setStatsMatch(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="outline" className="border-zinc-200 bg-zinc-50 text-zinc-600 mb-2">{statsMatch.round}</Badge>
                <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-lime-600" /> Estadísticas
                </h2>
              </div>
              <button onClick={() => setStatsMatch(null)} className="w-8 h-8 rounded-lg hover:bg-zinc-100 flex items-center justify-center text-zinc-500 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scoreboard */}
            <div className="flex items-center justify-between gap-3 p-4 bg-zinc-50 rounded-xl border border-zinc-200">
              <span className="font-bold text-zinc-900 text-sm flex-1 text-center">{statsMatch.home}</span>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-lime-600">{statsMatch.homeScore}</span>
                <span className="text-zinc-400 font-bold">–</span>
                <span className="text-3xl font-black text-zinc-700">{statsMatch.awayScore}</span>
              </div>
              <span className="font-bold text-zinc-900 text-sm flex-1 text-center">{statsMatch.away}</span>
            </div>

            {/* Stat bars */}
            <div className="space-y-4">
              {[
                { label: "Tiros a puerta", home: statsMatch.homeStats.shots, away: statsMatch.awayStats.shots },
                { label: "Posesión (%)", home: statsMatch.homeStats.possession, away: statsMatch.awayStats.possession },
                { label: "Faltas", home: statsMatch.homeStats.fouls, away: statsMatch.awayStats.fouls },
              ].map((stat) => {
                const total = stat.home + stat.away;
                const homePct = Math.round((stat.home / total) * 100);
                return (
                  <div key={stat.label}>
                    <div className="flex justify-between text-sm font-semibold text-zinc-700 mb-1.5">
                      <span className="text-lime-600">{stat.home}</span>
                      <span className="text-xs font-medium text-zinc-500">{stat.label}</span>
                      <span>{stat.away}</span>
                    </div>
                    <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
                      <div className="bg-lime-500 rounded-l-full transition-all" style={{ width: `${homePct}%` }} />
                      <div className="bg-zinc-300 rounded-r-full flex-1" />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
              <Trophy className="w-4 h-4 text-lime-500" />
              <span className="font-medium">{statsMatch.date} — {statsMatch.time}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
