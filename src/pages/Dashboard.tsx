import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Trophy, LogIn, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const standingsData = [
  { rank: 1, team: "Software Devs FC", gp: 5, w: 4, d: 1, l: 0, gf: 12, ga: 3, gd: "+9", pts: 13 },
  { rank: 2, team: "Cybersecurity United", gp: 5, w: 3, d: 2, l: 0, gf: 8, ga: 4, gd: "+4", pts: 11 },
  { rank: 3, team: "Data Science Dynamo", gp: 5, w: 3, d: 0, l: 2, gf: 10, ga: 7, gd: "+3", pts: 9 },
  { rank: 4, team: "AI Engineers", gp: 5, w: 2, d: 1, l: 2, gf: 6, ga: 6, gd: "0", pts: 7 },
  { rank: 5, team: "Cloud Architects", gp: 5, w: 1, d: 1, l: 3, gf: 4, ga: 9, gd: "-5", pts: 4 },
  { rank: 6, team: "QA Testers Rovers", gp: 5, w: 0, d: 0, l: 5, gf: 2, ga: 13, gd: "-11", pts: 0 },
];

const matchesData = [
  { 
    id: 1,
    home: "Software Devs FC", 
    away: "Data Science Dynamo",
    time: "Mañana, 18:00",
    pitch: "Cancha 1 - Principal",
    type: "Temporada Regular"
  },
  { 
    id: 2,
    home: "Cybersecurity United", 
    away: "AI Engineers",
    time: "Sáb, 14:00",
    pitch: "Cancha 2 - Norte",
    type: "Temporada Regular"
  }
];

import { useAuth } from "../context/AuthContext";

export function Dashboard() {
  const { user } = useAuth();
  const isCaptain = user?.role === 'captain';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Orange Payment Alert (Figma matching) */}
      {isCaptain && (
        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-800 p-4 rounded-md shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Pago pendiente:</span> Inscripción $130.000 — límite 26 de marzo
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            {isCaptain ? (user?.teamName || "Mi Equipo") : "Resumen del Torneo"}
          </h1>
          <p className="text-zinc-500 mt-1">
            {isCaptain ? "Gestiona tu alineación, pagos y revisa los partidos." : "Revisa la tabla de posiciones y los próximos partidos."}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-lime-100 border border-lime-200 text-lime-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
          </span>
          <span className="text-sm font-semibold uppercase tracking-wider">En Curso</span>
        </div>
      </div>

      {/* Red Payment Banner for Captain */}
      {isCaptain && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-red-800 flex items-center gap-2">
              Tu equipo aún no ha pagado la inscripción
            </h3>
            <p className="text-sm text-red-700 mt-1">
              Transfiere a la cuenta Nequi 300 123 4567 y envía el comprobante para confirmar tu participación.
            </p>
          </div>
          <Button className="bg-red-600 hover:bg-red-700 text-white shadow-md">
            Pagar Ahora
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          {/* Standings Table */}
          <Card className="shadow-md shadow-zinc-200/50 border-zinc-200 bg-white">
            <CardHeader className="border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-lime-500" />
                <CardTitle className="text-zinc-900">Tabla de Posiciones</CardTitle>
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
                      <th className="px-4 py-4 font-medium text-center hidden sm:table-cell">DG</th>
                      <th className="px-6 py-4 font-bold text-center text-lime-600">Pts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {standingsData.map((row) => (
                      <tr 
                        key={row.team} 
                        className="hover:bg-zinc-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-zinc-500 font-medium">
                          {row.rank}
                        </td>
                        <td className="px-6 py-4 font-medium text-zinc-900 flex items-center gap-2 whitespace-nowrap">
                          {row.rank <= 2 && (
                            <div className="w-1.5 h-1.5 rounded-full bg-lime-500" />
                          )}
                          {row.team}
                        </td>
                        <td className="px-4 py-4 text-center text-zinc-500">{row.gp}</td>
                        <td className="px-4 py-4 text-center text-zinc-600">{row.w}</td>
                        <td className="px-4 py-4 text-center text-zinc-600">{row.d}</td>
                        <td className="px-4 py-4 text-center text-zinc-600">{row.l}</td>
                        <td className="px-4 py-4 text-center text-zinc-500 hidden sm:table-cell">{row.gd}</td>
                        <td className="px-6 py-4 text-center font-bold text-lime-600 text-base">{row.pts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Rules Section */}
          <Card className="shadow-md shadow-zinc-200/50 border-zinc-200 bg-white">
            <CardHeader className="border-b border-zinc-100 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-lime-500" />
                  <CardTitle className="text-zinc-900">Reglamento Básico</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-zinc-600">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-50 border border-zinc-200">
                  <CheckCircle2 className="w-4 h-4 text-lime-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-zinc-900 block mb-1">Formato</span>
                    Partidos de Fútbol 7. Tiempo de 20 minutos por mitad con 5 minutos de descanso.
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-50 border border-zinc-200">
                  <CheckCircle2 className="w-4 h-4 text-lime-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-zinc-900 block mb-1">Elegibilidad</span>
                    Solo estudiantes activos. Carnet universitario obligatorio antes del partido.
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-50 border border-zinc-200">
                  <CheckCircle2 className="w-4 h-4 text-lime-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-zinc-900 block mb-1">Puntuación</span>
                    Victoria: 3 pts. Empate: 1 pt. Derrota: 0 pts.
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-50 border border-zinc-200">
                  <CheckCircle2 className="w-4 h-4 text-lime-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-zinc-900 block mb-1">Disciplina</span>
                    Amarilla: 2 min fuera. Roja: Expulsión del partido y 1 fecha de sanción.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Matches */}
        <div className="space-y-6">
          <Card className="shadow-md shadow-zinc-200/50 border-zinc-200 bg-white">
            <CardHeader className="border-b border-zinc-100 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-lime-500" />
                  <CardTitle className="text-zinc-900">Próximos Partidos</CardTitle>
                </div>
                <Badge variant="outline" className="text-xs border-zinc-200 text-zinc-600 bg-zinc-50">Jornada 6</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-zinc-100">
              {matchesData.map(match => (
                <div key={match.id} className="p-5 hover:bg-zinc-50 transition-colors">
                  <div className="flex items-center justify-between text-xs text-zinc-500 mb-3">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {match.time}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {match.pitch}</span>
                  </div>
                  
                  <div className="space-y-3 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-[10px] font-bold text-zinc-400 z-10">
                      VS
                    </div>
                    
                    <div className="flex items-center justify-between bg-zinc-50 p-3 rounded-lg border border-zinc-200 relative overflow-hidden group">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-lime-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="font-semibold text-zinc-800 text-sm truncate pr-6">{match.home}</span>
                    </div>
                    
                    <div className="flex items-center justify-between bg-zinc-50 p-3 rounded-lg border border-zinc-200 relative overflow-hidden group">
                       <div className="absolute left-0 top-0 bottom-0 w-1 bg-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="font-semibold text-zinc-800 text-sm truncate pr-6">{match.away}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-lime-50 border-lime-200 shadow-sm">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-lime-100 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5 text-lime-600" />
              </div>
              <div>
                <h4 className="font-semibold text-lime-800">Sorteo de Cuartos</h4>
                <p className="text-sm text-lime-700/80 mt-1 leading-relaxed">Los 8 mejores equipos clasificarán. El sorteo se realizará el 15 de noviembre en el Centro Estudiantil.</p>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}