import { Trophy, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getBracketData, type BracketData, type BracketMatch } from "../services/brackets/brackets.service";
import { getTournamentHistory } from "../services/organizer/organizer.service";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function TournamentBrackets() {
  const [selectedTournament, setSelectedTournament] = useState("");
  const [tournaments, setTournaments] = useState<Array<{ id: string; name: string }>>([]);
  const [matches, setMatches] = useState<BracketData>({ quarter: [], semi: [], final: [] });

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

    const loadBrackets = async () => {
      try {
        const data = await getBracketData(selectedTournament);
        setMatches(data);
      } catch {
        setMatches({ quarter: [], semi: [], final: [] });
      }
    };

    void loadBrackets();
  }, [selectedTournament]);

const MatchCard = React.memo(({ match, isFinal = false }: { match: BracketMatch; isFinal?: boolean }) => (
  <div className={`relative w-64 bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm ${isFinal ? 'border-lime-500 shadow-lime-500/20 shadow-xl scale-110 z-10' : ''}`}>
    {isFinal && (
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-lime-400 to-lime-600" />
    )}
    <div className="p-3 bg-zinc-50 flex items-center justify-between text-xs border-b border-zinc-200">
      <span className="text-zinc-500 font-mono">Partido {match.id}</span>
      {match.status === "completed" ? (
        <span className="text-zinc-400 uppercase tracking-wider text-[10px] font-bold">FIN</span>
      ) : (
        <span className="text-lime-600 font-medium tracking-wider">{match.time}</span>
      )}
    </div>
    <div className="p-0 flex flex-col divide-y divide-zinc-200 bg-white">
      <div className={`flex justify-between items-center p-3 ${match.score1 > match.score2 ? 'bg-lime-50' : ''}`}>
        <span className={`font-semibold ${match.score1 > match.score2 ? 'text-zinc-900' : 'text-zinc-600'} truncate mr-2`}>
          {match.team1}
        </span>
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-lime-600 min-w-[2ch] text-center">{match.score1 ?? '-'}</span>
        </div>
      </div>
      <div className={`flex justify-between items-center p-3 ${match.score2 > match.score1 ? 'bg-lime-50' : ''}`}>
        <span className={`font-semibold ${match.score2 > match.score1 ? 'text-zinc-900' : 'text-zinc-600'} truncate mr-2`}>
          {match.team2}
        </span>
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-lime-600 min-w-[2ch] text-center">{match.score2 ?? '-'}</span>
        </div>
      </div>
    </div>
  </div>
));

export function TournamentBrackets() {
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 min-w-max">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-lime-500" /> Fase Eliminatoria
          </h1>
          <p className="text-zinc-500 mt-1">El camino a la gran final de TECHCUP.</p>
        </div>
        <Select value={selectedTournament} onValueChange={setSelectedTournament}>
          <SelectTrigger className="w-[280px] border-zinc-300">
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

      <div className="relative mt-12 bg-zinc-50 rounded-2xl p-12 border border-zinc-200 shadow-inner">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-50 pointer-events-none"></div>

        <div className="flex items-center justify-between gap-16 relative z-10">
          
          {/* Quarterfinals */}
          <div className="flex flex-col gap-12 relative">
            <h3 className="absolute -top-12 left-0 font-bold text-zinc-500 tracking-wider uppercase flex items-center gap-2">
              Cuartos de Final <ChevronRight className="w-4 h-4" />
            </h3>
            {matches.quarter.map((match, i) => (
              <div key={match.id} className="relative">
                <MatchCard match={match} />
                {/* Connecting lines out */}
                <div className="absolute top-1/2 -right-8 w-8 h-px bg-zinc-300" />
                {i % 2 === 0 ? (
                  <div className="absolute top-1/2 -right-8 w-px h-[calc(50%+1.5rem)] bg-zinc-300" />
                ) : (
                  <div className="absolute bottom-1/2 -right-8 w-px h-[calc(50%+1.5rem)] bg-zinc-300" />
                )}
              </div>
            ))}
          </div>

          {/* Semifinals */}
          <div className="flex flex-col gap-32 relative">
             <h3 className="absolute -top-12 left-0 font-bold text-zinc-500 tracking-wider uppercase flex items-center gap-2">
              Semifinales <ChevronRight className="w-4 h-4" />
            </h3>
            {matches.semi.map((match, i) => (
              <div key={match.id} className="relative">
                 {/* Connecting lines in */}
                 <div className="absolute top-1/2 -left-8 w-8 h-px bg-zinc-300" />
                <MatchCard match={match} />
                 {/* Connecting lines out */}
                 <div className="absolute top-1/2 -right-8 w-8 h-px bg-zinc-300" />
                {i % 2 === 0 ? (
                  <div className="absolute top-1/2 -right-8 w-px h-[calc(50%+4rem)] bg-zinc-300" />
                ) : (
                  <div className="absolute bottom-1/2 -right-8 w-px h-[calc(50%+4rem)] bg-zinc-300" />
                )}
              </div>
            ))}
          </div>

          {/* Final */}
          <div className="flex flex-col gap-8 relative">
             <h3 className="absolute -top-12 left-1/2 -translate-x-1/2 font-bold text-lime-600 tracking-widest uppercase flex items-center gap-2">
              <Trophy className="w-4 h-4" /> Final
            </h3>
            {matches.final.map((match) => (
              <div key={match.id} className="relative">
                {/* Connecting lines in */}
                <div className="absolute top-1/2 -left-8 w-8 h-px bg-zinc-300" />
                <MatchCard match={match} isFinal={true} />
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}