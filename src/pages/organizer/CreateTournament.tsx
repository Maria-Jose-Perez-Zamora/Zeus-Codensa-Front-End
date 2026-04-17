import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Trophy, Calendar, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { createTournament } from "../../services/organizer/organizer.service";

export function CreateTournament() {
  const navigate = useNavigate();
  const [tournamentName, setTournamentName] = useState("");
  const [category, setCategory] = useState("");
  const [maxTeams, setMaxTeams] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createTournament({
        tournamentName,
        fechaInicio: startDate,
        fechaFin: endDate,
        numeroEquipos: Number(maxTeams),
        costoInscripcion: 0,
        rules: description,
      });

      toast.success("Torneo creado", {
        description: "La información principal del torneo se guardó correctamente.",
      });
      navigate("/organizer/schedule-matches");
    } catch {
      toast.error("No se pudo crear el torneo", {
        description: "Verifica los datos e intenta nuevamente.",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-lime-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-lime-500/30">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Crear Nuevo Torneo</h1>
        <p className="text-zinc-500 mt-2">Configura los detalles principales de tu torneo</p>
      </div>

      <Card className="border-zinc-200 shadow-xl">
        <CardHeader className="border-b border-zinc-100">
          <CardTitle className="text-zinc-900">Información General</CardTitle>
          <CardDescription>
            Define los datos básicos del torneo que organizarás
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="tournamentName" className="text-zinc-900">
                Nombre del Torneo *
              </Label>
              <Input
                id="tournamentName"
                type="text"
                placeholder="Ej: Copa Universitaria Primavera 2026"
                value={tournamentName}
                onChange={(e) => setTournamentName(e.target.value)}
                required
                className="border-zinc-300"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-zinc-900">
                  Categoría *
                </Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger className="border-zinc-300">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="universitario">Universitario</SelectItem>
                    <SelectItem value="amistoso">Amistoso</SelectItem>
                    <SelectItem value="interfacultades">Interfacultades</SelectItem>
                    <SelectItem value="copa">Copa</SelectItem>
                    <SelectItem value="liga">Liga</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxTeams" className="text-zinc-900">
                  Número de Equipos *
                </Label>
                <Select value={maxTeams} onValueChange={setMaxTeams} required>
                  <SelectTrigger className="border-zinc-300">
                    <SelectValue placeholder="Selecciona cantidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">4 equipos</SelectItem>
                    <SelectItem value="6">6 equipos</SelectItem>
                    <SelectItem value="8">8 equipos</SelectItem>
                    <SelectItem value="10">10 equipos</SelectItem>
                    <SelectItem value="12">12 equipos</SelectItem>
                    <SelectItem value="16">16 equipos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-zinc-900">
                  Fecha de Inicio *
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="border-zinc-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-zinc-900">
                  Fecha de Finalización *
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="border-zinc-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-zinc-900">
                Ubicación *
              </Label>
              <Input
                id="location"
                type="text"
                placeholder="Ej: Campus Principal, Canchas Universitarias..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="border-zinc-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-zinc-900">
                Descripción
              </Label>
              <Textarea
                id="description"
                placeholder="Información adicional sobre el torneo, premios, reglas especiales..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-zinc-300 min-h-[100px]"
              />
            </div>

            <Card className="border-lime-200 bg-lime-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-lime-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-lime-900">Próximos Pasos</h4>
                    <ul className="text-sm text-lime-700 mt-2 space-y-1 list-disc list-inside">
                      <li>Configurar reglas y reglamento del torneo</li>
                      <li>Programar fechas y horarios de partidos</li>
                      <li>Gestionar inscripciones de equipos</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3 pt-4 border-t border-zinc-200">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-zinc-300"
                onClick={() => navigate('/')}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-lime-500 hover:bg-lime-600 text-white font-semibold shadow-md shadow-lime-500/20"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Continuar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
