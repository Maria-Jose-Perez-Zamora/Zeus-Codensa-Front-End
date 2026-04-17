import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, TrendingUp, Award } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { getTopScorers, getStandings, type ScorerRow, type StandingRow } from "../services/standings/standings.service";
import { getTournamentHistory } from "../services/organizer/organizer.service";

export function Standings() {
  const [selectedTournament, setSelectedTournament] = useState("");
  const [tournaments, setTournaments] = useState<Array<{ id: string; name: string }>>([]);
  const [standingsData, setStandingsData] = useState<StandingRow[]>([]);
  const [topScorers, setTopScorers] = useState<ScorerRow[]>([]);

  useEffect(() => {
    const loadTournaments = async () => {
      try {
        const history = await getTournamentHistory();
        setTournaments(history);
        if (history.length) {
          setSelectedTournament(history[0].name);
        }
      } catch {
        setTournaments([]);
      }
    };

    void loadTournaments();
  }, []);

  useEffect(() => {
    if (!selectedTournament) {
      return;
    }

    const loadData = async () => {
      try {
        const [standings, scorers] = await Promise.all([
          getStandings(selectedTournament),
          getTopScorers(selectedTournament),
        ]);

        setStandingsData(standings);
        setTopScorers(scorers);
      } catch {
        setStandingsData([]);
        setTopScorers([]);
      }
    };

    void loadData();
  }, [selectedTournament]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Tabla de Posiciones</h1>
          <p className="text-zinc-500 mt-1">Clasificaciones y estadísticas actualizadas</p>
        </div>
        <Select value={selectedTournament} onValueChange={setSelectedTournament}>
          <SelectTrigger className="w-[280px] border-zinc-300">
            <SelectValue />
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="shadow-md shadow-zinc-200/50 border-zinc-200 bg-white">
            <CardHeader className="border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-lime-500" />
                <CardTitle className="text-zinc-900">Clasificación General</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-zinc-500 bg-zinc-50 uppercase border-b border-zinc-200">
                    <tr>
                      <th className="px-6 py-4 font-medium">Pos</th>
                      <th className="px-6 py-4 font-medium">Equipo</th>
                      <th className="px-4 py-4 font-medium text-center">PJ</th>
                      <th className="px-4 py-4 font-medium text-center">G</th>
                      <th className="px-4 py-4 font-medium text-center">E</th>
                      <th className="px-4 py-4 font-medium text-center">P</th>
                      <th className="px-4 py-4 font-medium text-center hidden sm:table-cell">GF</th>
                      <th className="px-4 py-4 font-medium text-center hidden sm:table-cell">GC</th>
                      <th className="px-4 py-4 font-medium text-center hidden md:table-cell">DG</th>
                      <th className="px-6 py-4 font-bold text-center text-lime-600">Pts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {standingsData.map((row) => (
                      <tr 
                        key={row.team} 
                        className="hover:bg-zinc-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-500 font-medium">{row.rank}</span>
                            {row.rank === 1 && <Medal className="w-4 h-4 text-yellow-500" />}
                            {row.rank === 2 && <Medal className="w-4 h-4 text-zinc-400" />}
                            {row.rank === 3 && <Medal className="w-4 h-4 text-amber-600" />}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-zinc-900">
                          <div className="flex items-center gap-2">
                            {row.rank <= 2 && (
                              <div className="w-1.5 h-1.5 rounded-full bg-lime-500" />
                            )}
                            <span className="whitespace-nowrap">{row.team}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center text-zinc-500">{row.gp}</td>
                        <td className="px-4 py-4 text-center text-zinc-600">{row.w}</td>
                        <td className="px-4 py-4 text-center text-zinc-600">{row.d}</td>
                        <td className="px-4 py-4 text-center text-zinc-600">{row.l}</td>
                        <td className="px-4 py-4 text-center text-zinc-500 hidden sm:table-cell">{row.gf}</td>
                        <td className="px-4 py-4 text-center text-zinc-500 hidden sm:table-cell">{row.ga}</td>
                        <td className="px-4 py-4 text-center text-zinc-500 hidden md:table-cell">{row.gd}</td>
                        <td className="px-6 py-4 text-center font-bold text-lime-600 text-base">{row.pts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6 border-zinc-200 bg-white shadow-md">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-lime-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-zinc-900 mb-2">Zona de Clasificación</h4>
                  <div className="space-y-2 text-sm text-zinc-600">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-lime-500" />
                      <span>Posiciones 1-2: Clasifican directo a Cuartos de Final</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-zinc-300" />
                      <span>Posiciones 3-6: Fase Regular</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-zinc-200 bg-white shadow-md">
            <CardHeader className="border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-lime-500" />
                <CardTitle className="text-zinc-900">Goleadores</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-zinc-100">
              {topScorers.map((scorer, index) => (
                <div key={index} className="p-5 hover:bg-zinc-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-lime-100 flex items-center justify-center font-bold text-lime-700 text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-900">{scorer.name}</p>
                        <p className="text-xs text-zinc-500">{scorer.team}</p>
                      </div>
                    </div>
                    <Badge className="bg-lime-500 text-white font-bold">
                      {scorer.goals} goles
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-lime-200 bg-lime-50 shadow-sm">
            <CardContent className="p-5">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-lime-100 flex items-center justify-center mx-auto">
                  <Trophy className="w-6 h-6 text-lime-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-lime-900 mb-1">Próximo Evento</h4>
                  <p className="text-sm text-lime-700/90 leading-relaxed">
                    Sorteo de Cuartos de Final el 15 de noviembre en el Centro Estudiantil.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 bg-white shadow-md">
            <CardHeader className="border-b border-zinc-100 pb-4">
              <CardTitle className="text-zinc-900 text-sm">Estadísticas Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-zinc-600">Total de Goles</span>
                <span className="font-bold text-zinc-900">42</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-600">Promedio por Partido</span>
                <span className="font-bold text-zinc-900">2.8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-600">Tarjetas Amarillas</span>
                <span className="font-bold text-yellow-600">15</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-600">Tarjetas Rojas</span>
                <span className="font-bold text-red-600">2</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
