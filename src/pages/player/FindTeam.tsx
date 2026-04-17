import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Shield, User, MapPin, Trophy, Mail, Check, X, Eye, UserPlus, Clock, Star, CalendarDays, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "../../services/auth/auth.service";
import { getTeams, requestToJoinTeam } from "../../services/teams/teams.service";
import { getPlayerInvitations, processInvitation } from "../../services/playersService";
import { useAuth } from "../../context/AuthContext";

const fallbackAvailableTeams = [
  {
    id: 1,
    name: "Software Devs FC",
    captain: "Carlos Martínez",
    lookingFor: ["Defensa Central", "Mediocampista"],
    players: 8,
    maxPlayers: 10,
    tournament: "Copa Universitaria Primavera",
    location: "Campus Principal",
    description: "Somos un equipo formado por estudiantes y egresados de Ingeniería de Software. Nos caracterizamos por el juego colectivo, la disciplina táctica y el compañerismo dentro y fuera del campo. Llevamos 2 temporadas en la copa universitaria con un tercer lugar como mejor resultado. Buscamos jugadores comprometidos que quieran crecer junto a nosotros.",
    wins: 12,
    losses: 4,
    draws: 2,
    founded: "2022",
    style: "Posesión y juego corto",
  },
  {
    id: 2,
    name: "Cybersecurity United",
    captain: "Ana González",
    lookingFor: ["Portero", "Delantero Centro"],
    players: 7,
    maxPlayers: 10,
    tournament: "Copa Universitaria Primavera",
    location: "Campus Norte",
    description: "Equipo nacido en el departamento de Ciberseguridad. Somos intensos, rápidos y muy organizados en defensa. Nuestro estilo de juego se basa en transiciones rápidas y presión alta. Tenemos un gran ambiente grupal con salidas y actividades fuera del fútbol. Si eres competitivo y quieres ganar, este es tu lugar.",
    wins: 9,
    losses: 3,
    draws: 5,
    founded: "2021",
    style: "Contraataque y presión alta",
  },
  {
    id: 3,
    name: "Cloud Architects",
    captain: "Pedro Sánchez",
    lookingFor: ["Lateral Derecho", "Extremo"],
    players: 6,
    maxPlayers: 10,
    tournament: "Torneo Relámpago Verano",
    location: "Canchas Norte",
    description: "Un equipo joven con ganas de aprender y mejorar cada semana. Aunque somos el equipo más nuevo de la liga, nuestra motivación y energía nos hace competitivos. Entrenamos dos veces por semana y siempre buscamos crecer técnica y tácticamente. Ideal para jugadores que quieren disfrutar el fútbol en un ambiente relajado pero serio.",
    wins: 5,
    losses: 7,
    draws: 3,
    founded: "2024",
    style: "Juego directo y velocidad",
  }
];

// Eliminado el array estático de invitaciones para cargar desde el backend

type TeamButtonState = "idle" | "viewed" | "requested";
type InvitationState = "pending" | "accepted" | "rejected";

export function FindTeam() {
  const { user } = useAuth();
  const [availableTeams, setAvailableTeams] = useState<typeof fallbackAvailableTeams>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [teamStates, setTeamStates] = useState<Record<string | number, TeamButtonState>>({});
  const [invitationStates, setInvitationStates] = useState<Record<string | number, InvitationState>>({});
  const [selectedTeam, setSelectedTeam] = useState<(typeof fallbackAvailableTeams)[number] | null>(null);
  const [invitations, setInvitations] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const rows = await getTeams();
        if (rows.length > 0) {
          setAvailableTeams(
            rows.map((team, index) => ({
              id: Number(team.id) || index + 1,
              name: team.name,
              captain: team.captain,
              lookingFor: ["Cualquier posición"],
              players: team.players,
              maxPlayers: 10,
              tournament: "Torneo activo",
              location: "Bogotá",
              description: "Equipo activo en la plataforma.",
              wins: team.wins,
              losses: team.losses,
              draws: team.draws,
              founded: "2024",
              style: "Por definir",
            })),
          );
        }

        const invRows = await getPlayerInvitations();
        setInvitations(
          invRows.map((inv) => ({
             id: inv.id,
             team: inv.teamName,
             captain: inv.captainEmail,
             position: "Jugador de Campo",
             message: "¡Hola! Queremos que te unas a nuestro equipo.",
             date: "Nuevo"
          }))
        );

      } catch (error) {
        toast.error(getApiErrorMessage(error, "No se pudieron cargar los datos de equipos"));
      }
    };

    void loadData();
  }, []);

  const filteredTeams = availableTeams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.captain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.tournament.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewTeam = (teamId: number, teamName: string) => {
    setTeamStates((prev) => ({ ...prev, [teamId]: "viewed" }));
    const team = availableTeams.find((t) => t.id === teamId) ?? null;
    setSelectedTeam(team);
  };

  const handleRequestJoin = async (teamId: number, teamName: string) => {
    try {
      await requestToJoinTeam(teamName);
      setTeamStates((prev) => ({ ...prev, [teamId]: "requested" }));
      toast.success("¡Solicitud enviada!", {
        description: `Tu solicitud para unirte a ${teamName} fue enviada al capitán.`,
        duration: 3000,
      });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "No se pudo enviar la solicitud"));
    }
  };

  const handleAcceptInvitation = async (invId: string | number, teamName: string) => {
    try {
      if (user?.email) {
        await processInvitation(String(invId), user.email, { status: "ACEPTADA" });
      }
      setInvitationStates((prev) => ({ ...prev, [invId]: "accepted" }));
      toast.success("¡Invitación aceptada!", {
        description: `Ahora formas parte de ${teamName}.`,
        duration: 3000,
      });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Error aceptando la invitación"));
    }
  };

  const handleRejectInvitation = async (invId: string | number, teamName: string) => {
    try {
      if (user?.email) {
        await processInvitation(String(invId), user.email, { status: "DECLINADA" });
      }
      setInvitationStates((prev) => ({ ...prev, [invId]: "rejected" }));
      toast.error("Invitación rechazada", {
        description: `Has rechazado la invitación de ${teamName}.`,
        duration: 3000,
      });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Error rechazando la invitación"));
    }
  };

  const pendingInvitations = invitations.filter(
    (inv) => !invitationStates[inv.id] || invitationStates[inv.id] === "pending"
  ).length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── Team Detail Modal ── */}
      <Dialog open={!!selectedTeam} onOpenChange={(open) => { if (!open) setSelectedTeam(null); }}>
        <DialogContent className="max-w-lg rounded-2xl p-0 overflow-hidden">
          {selectedTeam && (
            <>
              {/* Header con color */}
              <div className="bg-gradient-to-br from-lime-500 to-lime-600 px-6 pt-6 pb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-white text-xl">{selectedTeam.name}</DialogTitle>
                    <p className="text-lime-100 text-sm flex items-center gap-1 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                      Capitán: {selectedTeam.captain}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 -mt-4 space-y-5 pb-6">
                {/* Stats strip */}
                <div className="bg-white border border-zinc-200 rounded-xl shadow-sm grid grid-cols-3 divide-x divide-zinc-100 overflow-hidden">
                  <div className="flex flex-col items-center py-3">
                    <span className="text-lg font-black text-lime-600">{selectedTeam.wins}</span>
                    <span className="text-[11px] text-zinc-400 font-medium">Victorias</span>
                  </div>
                  <div className="flex flex-col items-center py-3">
                    <span className="text-lg font-black text-zinc-500">{selectedTeam.draws}</span>
                    <span className="text-[11px] text-zinc-400 font-medium">Empates</span>
                  </div>
                  <div className="flex flex-col items-center py-3">
                    <span className="text-lg font-black text-red-500">{selectedTeam.losses}</span>
                    <span className="text-[11px] text-zinc-400 font-medium">Derrotas</span>
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <h4 className="text-sm font-semibold text-zinc-700 mb-2">Sobre el equipo</h4>
                  <p className="text-sm text-zinc-600 leading-relaxed">{selectedTeam.description}</p>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5">
                    <Trophy className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] text-zinc-400 uppercase font-semibold">Torneo</p>
                      <p className="text-xs text-zinc-700 font-medium truncate">{selectedTeam.tournament}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5">
                    <MapPin className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-zinc-400 uppercase font-semibold">Sede</p>
                      <p className="text-xs text-zinc-700 font-medium">{selectedTeam.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5">
                    <Star className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-zinc-400 uppercase font-semibold">Estilo</p>
                      <p className="text-xs text-zinc-700 font-medium">{selectedTeam.style}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5">
                    <CalendarDays className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-zinc-400 uppercase font-semibold">Fundado</p>
                      <p className="text-xs text-zinc-700 font-medium">{selectedTeam.founded}</p>
                    </div>
                  </div>
                </div>

                {/* Buscan */}
                <div>
                  <h4 className="text-sm font-semibold text-zinc-700 mb-2">Posiciones que buscan</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTeam.lookingFor.map((pos, i) => (
                      <Badge key={i} className="bg-lime-100 text-lime-700 border-lime-300 gap-1">
                        <ChevronRight className="w-3 h-3" />
                        {pos}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <Button
                  className="w-full bg-lime-500 hover:bg-lime-600 text-white font-semibold gap-2 shadow-md shadow-lime-500/20 active:scale-95 transition-all"
                  onClick={() => {
                    handleRequestJoin(selectedTeam.id, selectedTeam.name);
                    setSelectedTeam(null);
                  }}
                  disabled={(teamStates[selectedTeam.id] || "idle") === "requested"}
                >
                  {(teamStates[selectedTeam.id] || "idle") === "requested" ? (
                    <><Check className="w-4 h-4" /> Solicitud enviada</>
                  ) : (
                    <><UserPlus className="w-4 h-4" /> Solicitar unirse desde aquí</>
                  )}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Buscar Equipo</h1>
        <p className="text-zinc-500 mt-1">Encuentra equipos que necesiten jugadores con tu perfil</p>
      </div>

      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-zinc-100">
          <TabsTrigger value="search" className="data-[state=active]:bg-white">
            Buscar Equipos
          </TabsTrigger>
          <TabsTrigger value="invitations" className="data-[state=active]:bg-white relative">
            Invitaciones
            {pendingInvitations > 0 && (
              <Badge className="ml-2 bg-lime-500 text-white rounded-full w-5 h-5 p-0 flex items-center justify-center text-xs">
                {pendingInvitations}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="mt-6 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <Input
              placeholder="Buscar equipos por nombre, capitán o torneo..."
              className="pl-10 border-zinc-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            {filteredTeams.length === 0 && (
              <div className="text-center py-12 text-zinc-500">
                <Search className="w-10 h-10 mx-auto mb-3 text-zinc-300" />
                <p>No se encontraron equipos con ese término</p>
              </div>
            )}
            {filteredTeams.map((team) => {
              const state = teamStates[team.id] || "idle";
              return (
                <Card
                  key={team.id}
                  className={cn(
                    "border-zinc-200 bg-white shadow-md hover:shadow-lg transition-all",
                    state === "requested" && "border-lime-300 bg-lime-50/30",
                    state === "viewed" && "border-zinc-300"
                  )}
                >
                  <CardHeader className="border-b border-zinc-100 pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                          state === "requested" ? "bg-lime-500" : "bg-lime-100"
                        )}>
                          <Shield className={cn("w-6 h-6", state === "requested" ? "text-white" : "text-lime-600")} />
                        </div>
                        <div>
                          <CardTitle className="text-zinc-900">{team.name}</CardTitle>
                          <p className="text-sm text-zinc-500 mt-1 flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            Capitán: {team.captain}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="outline" className="border-lime-200 bg-lime-50 text-lime-700">
                          {team.players}/{team.maxPlayers} jugadores
                        </Badge>
                        {state === "requested" && (
                          <Badge className="bg-lime-100 text-lime-700 border-lime-300 text-xs">
                            <Check className="w-3 h-3 mr-1" />
                            Solicitud enviada
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-zinc-900">Buscan:</p>
                      <div className="flex flex-wrap gap-2">
                        {team.lookingFor.map((position, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="border-lime-300 bg-lime-50 text-lime-700"
                          >
                            {position}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-zinc-600">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-zinc-400" />
                        <span>{team.tournament}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-zinc-400" />
                        <span>{team.location}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-100 flex gap-3">
                      {/* Ver Equipo button */}
                      <Button
                        variant="outline"
                        className={cn(
                          "flex-1 transition-all duration-200 gap-2",
                          state === "viewed"
                            ? "border-zinc-400 bg-zinc-100 text-zinc-700"
                            : "border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50"
                        )}
                        onClick={() => handleViewTeam(team.id, team.name)}
                        disabled={state === "requested"}
                      >
                        {state === "viewed" ? (
                          <>
                            <Eye className="w-4 h-4 text-zinc-500" />
                            Visto
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            Ver Equipo
                          </>
                        )}
                      </Button>

                      {/* Solicitar Unirse button */}
                      <Button
                        className={cn(
                          "flex-1 font-semibold transition-all duration-300 gap-2",
                          state === "requested"
                            ? "bg-lime-600 hover:bg-lime-600 text-white shadow-lime-500/30 shadow-md scale-[0.99] cursor-default"
                            : "bg-lime-500 hover:bg-lime-600 text-white shadow-md shadow-lime-500/20 active:scale-95"
                        )}
                        onClick={() => {
                          if (state !== "requested") handleRequestJoin(team.id, team.name);
                        }}
                        disabled={state === "requested"}
                      >
                        {state === "requested" ? (
                          <>
                            <Check className="w-4 h-4" />
                            Solicitado
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4" />
                            Solicitar Unirse
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="invitations" className="mt-6 space-y-4">
          {invitations.length > 0 ? (
            invitations.map((invitation) => {
              const state = invitationStates[invitation.id] || "pending";
              return (
                <Card
                  key={invitation.id}
                  className={cn(
                    "border-zinc-200 bg-white shadow-md transition-all duration-300",
                    state === "accepted" && "border-lime-300 bg-lime-50/40",
                    state === "rejected" && "border-zinc-300 bg-zinc-50 opacity-70"
                  )}
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                          state === "accepted" ? "bg-lime-500" :
                          state === "rejected" ? "bg-zinc-200" :
                          "bg-blue-100"
                        )}>
                          {state === "accepted" ? (
                            <Check className="w-6 h-6 text-white" />
                          ) : state === "rejected" ? (
                            <X className="w-6 h-6 text-zinc-400" />
                          ) : (
                            <Mail className="w-6 h-6 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-zinc-900">{invitation.team}</h3>
                            {state === "accepted" && (
                              <Badge className="bg-lime-100 text-lime-700 border-lime-300 text-xs">
                                Aceptada
                              </Badge>
                            )}
                            {state === "rejected" && (
                              <Badge className="bg-zinc-200 text-zinc-500 border-zinc-300 text-xs">
                                Rechazada
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-zinc-500 mt-1">
                            <span className="font-medium">{invitation.captain}</span> te invita como{" "}
                            <span className="font-medium text-lime-600">{invitation.position}</span>
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-zinc-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {invitation.date}
                      </span>
                    </div>

                    <div className={cn(
                      "p-4 rounded-xl border transition-colors",
                      state === "accepted" ? "bg-lime-50 border-lime-200" :
                      state === "rejected" ? "bg-zinc-100 border-zinc-200" :
                      "bg-zinc-50 border-zinc-200"
                    )}>
                      <p className="text-sm text-zinc-700 italic">"{invitation.message}"</p>
                    </div>

                    {state === "pending" && (
                      <div className="flex gap-3 pt-2">
                        <Button
                          variant="outline"
                          className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 active:scale-95 transition-all gap-2"
                          onClick={() => handleRejectInvitation(invitation.id, invitation.team)}
                        >
                          <X className="w-4 h-4" />
                          Rechazar
                        </Button>
                        <Button
                          className="flex-1 bg-lime-500 hover:bg-lime-600 text-white font-semibold active:scale-95 transition-all gap-2"
                          onClick={() => handleAcceptInvitation(invitation.id, invitation.team)}
                        >
                          <Check className="w-4 h-4" />
                          Aceptar Invitación
                        </Button>
                      </div>
                    )}

                    {state === "accepted" && (
                      <div className="flex items-center justify-center gap-2 py-2 rounded-xl bg-lime-100 border border-lime-200">
                        <Check className="w-4 h-4 text-lime-600" />
                        <span className="text-sm font-semibold text-lime-700">¡Bienvenido al equipo!</span>
                      </div>
                    )}

                    {state === "rejected" && (
                      <div className="flex items-center justify-center gap-2 py-2 rounded-xl bg-zinc-100 border border-zinc-200">
                        <X className="w-4 h-4 text-zinc-400" />
                        <span className="text-sm font-medium text-zinc-500">Invitación rechazada</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card className="border-zinc-200 bg-white shadow-md">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-zinc-400" />
                </div>
                <h3 className="font-semibold text-zinc-900 mb-2">No tienes invitaciones</h3>
                <p className="text-sm text-zinc-500">
                  Cuando un capitán te invite a su equipo, aparecerá aquí
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Card className="border-lime-200 bg-lime-50 shadow-md">
        <CardContent className="p-6 flex items-start gap-4">
          <Users className="w-6 h-6 text-lime-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-lime-900 mb-1">Consejo</h4>
            <p className="text-sm text-lime-700 leading-relaxed">
              Mantén tu perfil actualizado y activo para recibir más invitaciones.
              Los capitanes buscan jugadores comprometidos y disponibles.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}