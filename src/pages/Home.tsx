import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Calendar, Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { TechCupLogo } from "../components/TechCupLogo";

export function Home() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-lime-500 to-lime-600 p-8 md:p-12 text-white shadow-xl shadow-lime-500/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="mb-6">
            <TechCupLogo variant="hero" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Gestiona Torneos de Fútbol 7 como un Profesional
          </h1>
          <p className="text-lg text-white/90 mb-6 leading-relaxed">
            Plataforma completa para organizar torneos universitarios, gestionar equipos, 
            crear alineaciones y seguir estadísticas en tiempo real.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-zinc-200 bg-white shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="w-12 h-12 rounded-xl bg-lime-100 flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-lime-600" />
            </div>
            <h3 className="font-semibold text-zinc-900 mb-2">Ver Torneos</h3>
            <p className="text-sm text-zinc-600 mb-4">
              Explora torneos activos y próximos eventos deportivos
            </p>
            <Link to="/tournaments">
              <Button variant="link" className="text-lime-600 p-0 h-auto font-semibold">
                Ver torneos <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 bg-white shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="w-12 h-12 rounded-xl bg-lime-100 flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-lime-600" />
            </div>
            <h3 className="font-semibold text-zinc-900 mb-2">Ver Partidos</h3>
            <p className="text-sm text-zinc-600 mb-4">
              Consulta el calendario completo de partidos y resultados
            </p>
            <Link to="/matches">
              <Button variant="link" className="text-lime-600 p-0 h-auto font-semibold">
                Ver partidos <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 bg-white shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="w-12 h-12 rounded-xl bg-lime-100 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-lime-600" />
            </div>
            <h3 className="font-semibold text-zinc-900 mb-2">Tabla de Posiciones</h3>
            <p className="text-sm text-zinc-600 mb-4">
              Revisa las clasificaciones y estadísticas actualizadas
            </p>
            <Link to="/standings">
              <Button variant="link" className="text-lime-600 p-0 h-auto font-semibold">
                Ver tabla <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 bg-white shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="w-12 h-12 rounded-xl bg-lime-100 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-lime-600" />
            </div>
            <h3 className="font-semibold text-zinc-900 mb-2">Ver Equipos</h3>
            <p className="text-sm text-zinc-600 mb-4">
              Conoce los equipos participantes y sus jugadores
            </p>
            <Link to="/teams">
              <Button variant="link" className="text-lime-600 p-0 h-auto font-semibold">
                Ver equipos <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-lime-200 bg-lime-50 shadow-md">
          <CardHeader className="border-b border-lime-200 pb-4">
            <CardTitle className="text-lime-900">Para Jugadores</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-sm text-lime-800 leading-relaxed">
              Crea tu perfil deportivo, indica tu posición preferida, muestra tu disponibilidad 
              y recibe invitaciones de capitanes buscando completar sus equipos.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-lime-300 text-lime-700 bg-white">
                Perfil deportivo
              </Badge>
              <Badge variant="outline" className="border-lime-300 text-lime-700 bg-white">
                Buscar equipo
              </Badge>
              <Badge variant="outline" className="border-lime-300 text-lime-700 bg-white">
                Invitaciones
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 bg-white shadow-md">
          <CardHeader className="border-b border-zinc-200 pb-4">
            <CardTitle className="text-zinc-900">Para Organizadores</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-sm text-zinc-600 leading-relaxed">
              Crea torneos, configura reglas personalizadas, programa partidos automáticamente, 
              registra resultados y aprueba pagos de inscripción desde un solo lugar.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-zinc-300 text-zinc-700 bg-zinc-50">
                Crear torneos
              </Badge>
              <Badge variant="outline" className="border-zinc-300 text-zinc-700 bg-zinc-50">
                Programar partidos
              </Badge>
              <Badge variant="outline" className="border-zinc-300 text-zinc-700 bg-zinc-50">
                Resultados
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}