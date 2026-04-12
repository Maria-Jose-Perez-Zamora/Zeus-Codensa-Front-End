import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Calendar, Users, MapPin, ArrowRight, Filter, X, Check } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import { TournamentDetailsModal } from "../components/TournamentDetailsModal";

const tournamentsData = [
  {
    id: 1,
    name: "Copa Universitaria Primavera 2026",
    status: "En Curso",
    teams: 12,
    startDate: "1 Mar 2026",
    endDate: "15 Abr 2026",
    location: "Campus Principal",
    category: "Universitario",
    statusColor: "lime" as const
  },
  {
    id: 2,
    name: "Torneo Relámpago Verano",
    status: "Inscripciones Abiertas",
    teams: 8,
    startDate: "20 May 2026",
    endDate: "30 May 2026",
    location: "Canchas Norte",
    category: "Amistoso",
    statusColor: "blue" as const
  },
  {
    id: 3,
    name: "Liga Interfacultades 2026",
    status: "Próximamente",
    teams: 16,
    startDate: "1 Jun 2026",
    endDate: "30 Jul 2026",
    location: "Multicanchas Universitarias",
    category: "Universitario",
    statusColor: "zinc" as const
  },
  {
    id: 4,
    name: "Copa Estudiantes Otoño",
    status: "Finalizado",
    teams: 10,
    startDate: "1 Sep 2025",
    endDate: "30 Oct 2025",
    location: "Campus Principal",
    category: "Universitario",
    statusColor: "zinc" as const
  }
];

export function Tournaments() {
  const [selectedTournament, setSelectedTournament] = useState<typeof tournamentsData[0] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const handleViewDetails = (tournament: typeof tournamentsData[0]) => {
    setSelectedTournament(tournament);
    setModalOpen(true);
  };

  const filteredTournaments = activeFilter
    ? tournamentsData.filter((t) => t.status === activeFilter)
    : tournamentsData;

  const filterOptions = ["En Curso", "Inscripciones Abiertas", "Próximamente", "Finalizado"];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Torneos</h1>
          <p className="text-zinc-500 mt-1">Explora todos los torneos disponibles</p>
        </div>
        <div className="relative">
          <Button
            variant="outline"
            className={`gap-2 border-zinc-300 transition-colors ${filterOpen || activeFilter ? "border-lime-500 text-lime-700 bg-lime-50" : ""}`}
            onClick={() => setFilterOpen((p) => !p)}
          >
            <Filter className="w-4 h-4" />
            Filtros
            {activeFilter && (
              <Badge className="bg-lime-500 text-white text-xs ml-1 px-1.5 py-0">1</Badge>
            )}
          </Button>
          {filterOpen && (
            <div className="absolute right-0 top-11 z-20 bg-white border border-zinc-200 rounded-xl shadow-xl p-3 w-56 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
              <p className="text-xs font-semibold text-zinc-500 uppercase px-2 mb-2">Estado</p>
              {filterOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => { setActiveFilter(activeFilter === opt ? null : opt); setFilterOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${activeFilter === opt ? "bg-lime-50 text-lime-700 font-semibold" : "hover:bg-zinc-50 text-zinc-700"}`}
                >
                  {opt}
                  {activeFilter === opt && <Check className="w-3.5 h-3.5 text-lime-600" />}
                </button>
              ))}
              {activeFilter && (
                <button onClick={() => { setActiveFilter(null); setFilterOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-500 hover:bg-red-50 transition-colors mt-1 border-t border-zinc-100 pt-2">
                  <X className="w-3 h-3" /> Limpiar filtro
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {activeFilter && (
        <div className="flex items-center gap-2 text-sm text-zinc-500 animate-in fade-in duration-200">
          <span>Mostrando:</span>
          <Badge variant="outline" className="border-lime-300 bg-lime-50 text-lime-700 gap-1">
            {activeFilter}
            <button onClick={() => setActiveFilter(null)} className="ml-1 hover:text-lime-900"><X className="w-3 h-3" /></button>
          </Badge>
          <span className="text-zinc-400">({filteredTournaments.length} resultado{filteredTournaments.length !== 1 ? "s" : ""})</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTournaments.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center">
              <Trophy className="w-7 h-7 text-zinc-300" />
            </div>
            <p className="font-semibold text-zinc-700">No hay torneos con ese estado</p>
            <Button variant="outline" size="sm" onClick={() => setActiveFilter(null)} className="border-zinc-300 text-zinc-600">
              Ver todos
            </Button>
          </div>
        ) : (
          filteredTournaments.map((tournament) => (
            <Card 
              key={tournament.id}
              className="border-zinc-200 bg-white shadow-md hover:shadow-lg transition-all group"
            >
              <CardHeader className="border-b border-zinc-100 pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
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
                    <CardTitle className="text-zinc-900 group-hover:text-lime-600 transition-colors">
                      {tournament.name}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-zinc-400" />
                    <div>
                      <p className="text-xs text-zinc-500">Inicio</p>
                      <p className="font-medium text-zinc-900">{tournament.startDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-zinc-400" />
                    <div>
                      <p className="text-xs text-zinc-500">Fin</p>
                      <p className="font-medium text-zinc-900">{tournament.endDate}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-zinc-400" />
                    <span className="text-zinc-600">{tournament.teams} equipos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-zinc-400" />
                    <span className="text-zinc-600">{tournament.location}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-100">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between text-lime-600 hover:text-lime-700 hover:bg-lime-50"
                    onClick={() => handleViewDetails(tournament)}
                  >
                    Ver detalles
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Card className="border-lime-200 bg-lime-50 shadow-md">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-lime-100 flex items-center justify-center shrink-0">
              <Trophy className="w-6 h-6 text-lime-600" />
            </div>
            <div>
              <h4 className="font-semibold text-lime-900 mb-1">¿Quieres organizar un torneo?</h4>
              <p className="text-sm text-lime-700">
                Crea tu propio torneo, configura las reglas y gestiona todo desde un solo lugar.
              </p>
            </div>
          </div>
          <Link to="/organizer/create-tournament">
            <Button className="bg-lime-600 hover:bg-lime-700 text-white font-semibold whitespace-nowrap">
              Crear Torneo
            </Button>
          </Link>
        </CardContent>
      </Card>

      <TournamentDetailsModal 
        tournament={selectedTournament}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}