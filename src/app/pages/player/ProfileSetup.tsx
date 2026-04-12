import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { User, Trophy, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

const positions = [
  "Portero",
  "Defensa Central",
  "Lateral Derecho",
  "Lateral Izquierdo",
  "Mediocampista Defensivo",
  "Mediocampista Central",
  "Mediocampista Ofensivo",
  "Extremo Derecho",
  "Extremo Izquierdo",
  "Delantero Centro"
];

export function ProfileSetup() {
  const navigate = useNavigate();
  const { updateProfile } = useAuth();
  const [position, setPosition] = useState("");
  const [secondaryPosition, setSecondaryPosition] = useState("");
  const [experience, setExperience] = useState("");
  const [bio, setBio] = useState("");
  const [available, setAvailable] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      position,
      available
    });
    navigate('/player/find-team');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-lime-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-lime-500/30">
          <User className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Crea tu Perfil Deportivo</h1>
        <p className="text-zinc-500 mt-2">Completa tu información para que los capitanes puedan encontrarte</p>
      </div>

      <Card className="border-zinc-200 shadow-xl">
        <CardHeader className="border-b border-zinc-100">
          <CardTitle className="text-zinc-900">Información Deportiva</CardTitle>
          <CardDescription>
            Proporciona detalles sobre tu experiencia y posición preferida
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="position" className="text-zinc-900">
                  Posición Principal *
                </Label>
                <Select value={position} onValueChange={setPosition} required>
                  <SelectTrigger className="border-zinc-300">
                    <SelectValue placeholder="Selecciona tu posición" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((pos) => (
                      <SelectItem key={pos} value={pos}>
                        {pos}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryPosition" className="text-zinc-900">
                  Posición Secundaria
                </Label>
                <Select value={secondaryPosition} onValueChange={setSecondaryPosition}>
                  <SelectTrigger className="border-zinc-300">
                    <SelectValue placeholder="Opcional" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((pos) => (
                      <SelectItem key={pos} value={pos}>
                        {pos}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience" className="text-zinc-900">
                Nivel de Experiencia *
              </Label>
              <Select value={experience} onValueChange={setExperience} required>
                <SelectTrigger className="border-zinc-300">
                  <SelectValue placeholder="Selecciona tu nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="principiante">Principiante (menos de 1 año)</SelectItem>
                  <SelectItem value="intermedio">Intermedio (1-3 años)</SelectItem>
                  <SelectItem value="avanzado">Avanzado (3-5 años)</SelectItem>
                  <SelectItem value="experto">Experto (más de 5 años)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-zinc-900">
                Descripción
              </Label>
              <Textarea
                id="bio"
                placeholder="Cuéntanos sobre ti, tu estilo de juego, logros, etc..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="border-zinc-300 min-h-[100px]"
              />
            </div>

            <Card className="border-lime-200 bg-lime-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <Trophy className="w-5 h-5 text-lime-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-lime-900">Disponible para equipos</h4>
                      <p className="text-sm text-lime-700 mt-1">
                        Los capitanes podrán ver tu perfil y enviarte invitaciones
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={available}
                    onCheckedChange={setAvailable}
                    className="data-[state=checked]:bg-lime-600"
                  />
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
                Completar Perfil
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
