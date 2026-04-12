import { Trophy, ChevronRight } from "lucide-react";

export function TournamentBrackets() {
  const matches = {
    quarter: [
      { id: 1, team1: "Software Devs FC", score1: 3, team2: "Data Science", score2: 1, status: "completed" },
      { id: 2, team1: "Cybersecurity Utd", score1: 2, team2: "AI Engineers", score2: 0, status: "completed" },
      { id: 3, team1: "Cloud Architects", score1: 1, team2: "QA Rovers", score2: 1, pens1: 4, pens2: 3, status: "completed" },
      { id: 4, team1: "DevOps United", score1: 0, team2: "Frontend Stars", score2: 2, status: "completed" },
    ],
    semi: [
      { id: 5, team1: "Software Devs FC", score1: null, team2: "Cybersecurity Utd", score2: null, status: "pending", time: "Sáb 14:00" },
      { id: 6, team1: "Cloud Architects", score1: null, team2: "Frontend Stars", score2: null, status: "pending", time: "Sáb 16:00" },
    ],
    final: [
      { id: 7, team1: "Por definir", score1: null, team2: "Por definir", score2: null, status: "scheduled", time: "Dom 18:00" },
    ]
  };

  const MatchCard = ({ match, isFinal = false }: { match: any, isFinal?: boolean }) => (
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
             {match.pens1 && <span className="text-[10px] text-zinc-400">({match.pens1})</span>}
            <span className="font-bold text-lg text-lime-600 min-w-[2ch] text-center">{match.score1 ?? '-'}</span>
          </div>
        </div>
        <div className={`flex justify-between items-center p-3 ${match.score2 > match.score1 ? 'bg-lime-50' : ''}`}>
          <span className={`font-semibold ${match.score2 > match.score1 ? 'text-zinc-900' : 'text-zinc-600'} truncate mr-2`}>
            {match.team2}
          </span>
          <div className="flex items-center gap-2">
             {match.pens2 && <span className="text-[10px] text-zinc-400">({match.pens2})</span>}
            <span className="font-bold text-lg text-lime-600 min-w-[2ch] text-center">{match.score2 ?? '-'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 min-w-max">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-lime-500" /> Fase Eliminatoria
          </h1>
          <p className="text-zinc-500 mt-1">El camino a la gran final de TECHCUP.</p>
        </div>
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