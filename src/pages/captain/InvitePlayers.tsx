import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Mail, Copy, CheckCircle2, Users, Link as LinkIcon, Send, X } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { invitePlayer } from "../../services/captain/captain.service";
import { toast } from "sonner";

export function InvitePlayers() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [invitedPlayers, setInvitedPlayers] = useState<string[]>([]);
  const [joinRequests, setJoinRequests] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  const inviteLink = `https://techcup.com/join/${user?.teamName?.replace(/\s+/g, '-').toLowerCase()}`;

  useEffect(() => {
    import('../../services/captain/captain.service').then(m => {
      m.getJoinRequests().then(reqs => setJoinRequests(reqs.filter((r: any) => r.status === "REQUESTED")));
    }).catch(() => {});
  }, []);

  const handleProcessJoinRequest = async (id: string, status: "ACEPTADA" | "DECLINADA") => {
    try {
      const { processJoinRequest } = await import('../../services/captain/captain.service');
      await processJoinRequest(id, status);
      setJoinRequests(joinRequests.filter(r => r.id !== id));
      toast.success(status === "ACEPTADA" ? "Solicitud aceptada" : "Solicitud declinada", {
        description: status === "ACEPTADA" ? "El jugador ahora hace parte del equipo." : "La solicitud ha sido rechazada."
      });
    } catch {
      toast.error("Error al procesar la solicitud");
    }
  };

  const handleInviteByEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || invitedPlayers.includes(email)) {
      return;
    }

    if (!user?.email || !user?.teamName) {
      toast.error("Falta información del capitán", {
        description: "Primero crea el equipo o vuelve a iniciar sesión.",
      });
      return;
    }

    try {
      await invitePlayer({
        captainEmail: user.email,
        playerEmail: email,
        teamName: user.teamName,
      });

      setInvitedPlayers([...invitedPlayers, email]);
      setEmail("");
      toast.success("Invitación enviada", {
        description: `Se invitó a ${email} correctamente.`,
      });
    } catch {
      toast.error("No se pudo enviar la invitación", {
        description: "El correo no existe o ya fue invitado.",
      });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRemoveInvite = (emailToRemove: string) => {
    setInvitedPlayers(invitedPlayers.filter(e => e !== emailToRemove));
  };

  const handleFinish = () => {
    navigate('/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-lime-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-lime-500/30">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Invitar Jugadores</h1>
        <p className="text-zinc-500 mt-2">Completa tu plantilla de {user?.teamName || 'tu equipo'}</p>
      </div>

      {/* Team Info */}
      <Card className="border-lime-200 bg-lime-50/50 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-lime-500 flex items-center justify-center shadow-md">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-zinc-900">{user?.teamName}</h3>
              <p className="text-sm text-zinc-600">Necesitas mínimo 7 jugadores para participar</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-lime-600">{invitedPlayers.length}</p>
              <p className="text-xs text-zinc-500">Invitados</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invite by Link */}
      <Card className="rounded-xl border-zinc-200 shadow-xl">
        <CardHeader className="border-b border-zinc-100">
          <CardTitle className="flex items-center gap-2 text-zinc-900">
            <LinkIcon className="w-5 h-5" />
            Enlace de Invitación
          </CardTitle>
          <CardDescription>
            Comparte este enlace con los jugadores que quieras invitar
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Input
              value={inviteLink}
              readOnly
              className="font-mono text-sm border-zinc-300 bg-zinc-50"
            />
            <Button
              onClick={handleCopyLink}
              className="bg-lime-500 hover:bg-lime-600 text-black rounded-xl shadow-md shadow-lime-500/20 whitespace-nowrap"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invite by Email */}
      <Card className="rounded-xl border-zinc-200 shadow-xl">
        <CardHeader className="border-b border-zinc-100">
          <CardTitle className="flex items-center gap-2 text-zinc-900">
            <Mail className="w-5 h-5" />
            Invitar por Email
          </CardTitle>
          <CardDescription>
            Envía invitaciones directas a los correos de tus jugadores
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <form onSubmit={handleInviteByEmail} className="flex gap-2">
            <Input
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-zinc-300"
            />
            <Button
              type="submit"
              className="bg-lime-500 hover:bg-lime-600 text-black rounded-xl shadow-md shadow-lime-500/20 whitespace-nowrap"
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar
            </Button>
          </form>

          {/* Invited Players List */}
          {invitedPlayers.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-zinc-700">Invitaciones Enviadas</h4>
                <Badge className="bg-lime-100 text-lime-700 border-lime-200">
                  {invitedPlayers.length} invitado{invitedPlayers.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              <div className="space-y-2">
                {invitedPlayers.map((playerEmail, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-lime-100 flex items-center justify-center">
                        <Mail className="w-4 h-4 text-lime-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-900">{playerEmail}</p>
                        <p className="text-xs text-zinc-500">Invitación pendiente</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveInvite(playerEmail)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Join Requests */}
      {joinRequests.length > 0 && (
        <Card className="rounded-xl border-zinc-200 shadow-xl border-lime-300">
          <CardHeader className="border-b border-zinc-100 bg-lime-50 rounded-t-xl">
            <CardTitle className="flex items-center gap-2 text-zinc-900">
              <Users className="w-5 h-5 text-lime-700" />
              Solicitudes para Unirse
            </CardTitle>
            <CardDescription>
              Jugadores que desean formar parte de tu equipo
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {joinRequests.map(req => (
              <div key={req.id} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white border border-zinc-200 rounded-xl shadow-sm gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-10 h-10 rounded-full bg-lime-100 flex items-center justify-center shrink-0">
                    <UserPlus className="w-5 h-5 text-lime-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900">{req.playerEmail}</p>
                    <p className="text-xs text-zinc-500">Solicitó unirse a {req.teamName}</p>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="flex-1 sm:flex-none border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => handleProcessJoinRequest(req.id, "DECLINADA")}
                  >
                    Rechazar
                  </Button>
                  <Button
                    className="flex-1 sm:flex-none bg-lime-500 hover:bg-lime-600 text-white"
                    onClick={() => handleProcessJoinRequest(req.id, "ACEPTADA")}
                  >
                    Aceptar
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Tips Card */}
      <Card className="rounded-xl border-zinc-200 bg-gradient-to-br from-zinc-50 to-white">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-zinc-900 mb-3">💡 Consejos para armar tu equipo</h4>
          <ul className="space-y-2 text-sm text-zinc-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-lime-600 mt-0.5 flex-shrink-0" />
              <span>Invita al menos 7 jugadores para poder participar en el torneo</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-lime-600 mt-0.5 flex-shrink-0" />
              <span>Recomendamos tener 2-3 jugadores suplentes por si acaso</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-lime-600 mt-0.5 flex-shrink-0" />
              <span>Puedes seguir invitando jugadores después de esta pantalla</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center pt-4">
        <Button
          variant="outline"
          onClick={() => navigate('/captain/create-team')}
          className="rounded-xl border-zinc-300 w-full sm:w-auto"
        >
          Volver
        </Button>
        <Button
          onClick={handleFinish}
          className="bg-lime-500 hover:bg-lime-600 text-black rounded-xl shadow-lg shadow-lime-500/20 w-full sm:w-auto"
        >
          Continuar al Dashboard
        </Button>
      </div>
    </div>
  );
}
