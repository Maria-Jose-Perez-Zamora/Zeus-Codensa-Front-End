import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Upload, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

export function CreateTeam() {
  const navigate = useNavigate();
  const { updateProfile } = useAuth();
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [colors, setColors] = useState({ primary: "#84cc16", secondary: "#000000" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ teamName });
    navigate('/captain/invite-players');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-lime-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-lime-500/30">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Crear Tu Equipo</h1>
        <p className="text-zinc-500 mt-2">Define el nombre, escudo y colores de tu equipo</p>
      </div>

      <Card className="border-zinc-200 shadow-xl">
        <CardHeader className="border-b border-zinc-100">
          <CardTitle className="text-zinc-900">Información del Equipo</CardTitle>
          <CardDescription>
            Estos datos serán visibles para todos los participantes del torneo
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-zinc-300 rounded-xl bg-zinc-50">
              <div 
                className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: colors.primary }}
              >
                <Shield className="w-12 h-12 text-white" />
              </div>
              <div className="text-center">
                <Button type="button" variant="outline" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Subir Escudo
                </Button>
                <p className="text-xs text-zinc-500 mt-2">PNG, JPG o SVG (máx. 2MB)</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="teamName" className="text-zinc-900">
                Nombre del Equipo *
              </Label>
              <Input
                id="teamName"
                type="text"
                placeholder="Ej: Leones FC, Warriors United..."
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
                className="border-zinc-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-zinc-900">
                Descripción del Equipo
              </Label>
              <Textarea
                id="description"
                placeholder="Cuéntanos sobre tu equipo, su filosofía, objetivos..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-zinc-300 min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor" className="text-zinc-900">
                  Color Principal
                </Label>
                <div className="flex gap-3 items-center">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={colors.primary}
                    onChange={(e) => setColors({ ...colors, primary: e.target.value })}
                    className="w-16 h-12 p-1 border-zinc-300"
                  />
                  <Input
                    type="text"
                    value={colors.primary}
                    onChange={(e) => setColors({ ...colors, primary: e.target.value })}
                    className="flex-1 border-zinc-300 font-mono text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryColor" className="text-zinc-900">
                  Color Secundario
                </Label>
                <div className="flex gap-3 items-center">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={colors.secondary}
                    onChange={(e) => setColors({ ...colors, secondary: e.target.value })}
                    className="w-16 h-12 p-1 border-zinc-300"
                  />
                  <Input
                    type="text"
                    value={colors.secondary}
                    onChange={(e) => setColors({ ...colors, secondary: e.target.value })}
                    className="flex-1 border-zinc-300 font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            <Card className="border-lime-200 bg-lime-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-lime-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-lime-900">Siguiente Paso</h4>
                    <p className="text-sm text-lime-700 mt-1">
                      Después de crear tu equipo, podrás invitar jugadores y configurar tu alineación
                    </p>
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
                Crear Equipo
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
