import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { LoadingButton } from "../../components/LoadingButton";
import { toast } from "sonner";
import { getMatches } from "../../services/matches/matches.service";
import { updateMatchScore } from "../../services/organizer/organizer.service";

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  venue: string;
  status: "pending" | "completed";
}

export function RegisterResults() {
  const [pendingMatches, setPendingMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [yellowCards, setYellowCards] = useState("");
  const [redCards, setRedCards] = useState("");

  useEffect(() => {
    const loadPendingMatches = async () => {
      try {
        const matchCollections = await getMatches();
        setPendingMatches(
          matchCollections.upcoming.map((match) => ({
            id: String(match.id),
            homeTeam: match.home,
            awayTeam: match.away,
            date: `${match.date} ${match.time}`,
            venue: match.pitch,
            status: "pending",
          })),
        );
      } catch {
        setPendingMatches([]);
      }
    };

    void loadPendingMatches();
  }, []);

  const handleSelectMatch = (match: Match) => {
    setSelectedMatch(match);
    setHomeScore("");
    setAwayScore("");
    setYellowCards("");
    setRedCards("");
  };

  const handleSubmitResult = async () => {
    if (!selectedMatch) {
      toast.error("No hay partido seleccionado");
      throw new Error("No match selected");
    }

    if (homeScore === "" || awayScore === "") {
      toast.error("Resultado incompleto", {
        description: "Por favor ingresa el marcador de ambos equipos.",
      });
      throw new Error("Incomplete result");
    }

    await updateMatchScore(selectedMatch.id, Number(homeScore), Number(awayScore));
    
    toast.success("Resultado registrado", {
      description: `${selectedMatch.homeTeam} ${homeScore} - ${awayScore} ${selectedMatch.awayTeam}`,
    });

    // Reset
    setSelectedMatch(null);
    setPendingMatches((matches) => matches.filter((match) => match.id !== selectedMatch.id));
    setHomeScore("");
    setAwayScore("");
    setYellowCards("");
    setRedCards("");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Registrar Resultados</h1>
        <p className="text-zinc-500 mt-1">Ingresa los resultados de los partidos finalizados</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de partidos pendientes */}
        <Card className="border-zinc-200 bg-white shadow-md lg:col-span-1">
          <CardHeader className="border-b border-zinc-100">
            <CardTitle className="text-lg">Partidos Pendientes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-100">
              {pendingMatches.map((match) => (
                <button
                  key={match.id}
                  onClick={() => handleSelectMatch(match)}
                  className={`w-full p-4 text-left hover:bg-zinc-50 transition-colors flex items-center justify-between ${
                    selectedMatch?.id === match.id ? 'bg-lime-50 border-l-4 border-lime-500' : ''
                  }`}
                >
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-zinc-900 mb-1">
                      {match.homeTeam}
                    </div>
                    <div className="font-semibold text-sm text-zinc-900 mb-2">
                      {match.awayTeam}
                    </div>
                    <div className="text-xs text-zinc-500">{match.date}</div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${selectedMatch?.id === match.id ? 'text-lime-600' : 'text-zinc-400'}`} />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Formulario de resultado */}
        <Card className="border-zinc-200 bg-white shadow-md lg:col-span-2">
          <CardHeader className="border-b border-zinc-100">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-lime-500" />
              Detalles del Resultado
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {!selectedMatch ? (
              <div className="py-12 text-center text-zinc-500">
                <Trophy className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                <p>Selecciona un partido de la lista</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Información del partido */}
                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                  <div className="text-sm text-zinc-500 mb-2">Partido Seleccionado</div>
                  <div className="font-bold text-lg text-zinc-900">
                    {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}
                  </div>
                  <div className="text-sm text-zinc-600 mt-1">
                    {selectedMatch.date} • {selectedMatch.venue}
                  </div>
                </div>

                {/* Marcador */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{selectedMatch.homeTeam}</Label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={homeScore}
                      onChange={(e) => setHomeScore(e.target.value)}
                      className="text-2xl font-bold text-center h-16"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{selectedMatch.awayTeam}</Label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={awayScore}
                      onChange={(e) => setAwayScore(e.target.value)}
                      className="text-2xl font-bold text-center h-16"
                    />
                  </div>
                </div>

                {/* Tarjetas */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tarjetas Amarillas</Label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={yellowCards}
                      onChange={(e) => setYellowCards(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tarjetas Rojas</Label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={redCards}
                      onChange={(e) => setRedCards(e.target.value)}
                    />
                  </div>
                </div>

                {/* Resultado del partido */}
                {homeScore !== "" && awayScore !== "" && (
                  <div className="p-4 rounded-xl bg-lime-50 border border-lime-200">
                    <div className="text-sm text-lime-700 mb-1">Resultado</div>
                    <div className="text-2xl font-bold text-lime-900">
                      {parseInt(homeScore) > parseInt(awayScore) 
                        ? `Victoria ${selectedMatch.homeTeam}` 
                        : parseInt(homeScore) < parseInt(awayScore)
                        ? `Victoria ${selectedMatch.awayTeam}`
                        : "Empate"}
                    </div>
                  </div>
                )}

                <LoadingButton
                  className="w-full bg-lime-500 hover:bg-lime-600 text-white font-semibold"
                  loadingText="Registrando..."
                  successText="¡Registrado!"
                  onAsyncClick={handleSubmitResult}
                >
                  Registrar Resultado
                </LoadingButton>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
