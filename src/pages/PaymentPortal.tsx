import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle2, XCircle, Clock, FileImage, X, ImageIcon } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { LoadingButton } from "../components/LoadingButton";

const paymentHistory = [
  { id: "PAY-1029", amount: "$50.00", status: "Aprobado", date: "10 Oct, 2026", user: "Alejandro Rivera" },
  { id: "PAY-1035", amount: "$50.00", status: "Pendiente", date: "15 Oct, 2026", user: "Carlos Gomez" },
  { id: "PAY-1011", amount: "$25.00", status: "Rechazado", date: "28 Sep, 2026", user: "Mateo Torres", reason: "Captura borrosa" },
];

export function PaymentPortal() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; preview: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Formato inválido", { description: "Solo se aceptan imágenes JPG o PNG.", duration: 3000 });
      return;
    }
    const preview = URL.createObjectURL(file);
    setUploadedFile({ name: file.name, preview });
    toast.success("Imagen cargada", { description: `"${file.name}" está lista para enviar.`, duration: 2500 });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleSend = async () => {
    if (!uploadedFile) {
      toast.error("Sin imagen", { description: "Primero sube la captura de tu pago.", duration: 2500 });
      throw new Error("Sin imagen");
    }
    await new Promise((r) => setTimeout(r, 1800));
    toast.success("¡Verificación enviada!", {
      description: "Tu pago fue enviado. El equipo de tesorería lo revisará en 24 horas.",
      duration: 4000,
    });
    setUploadedFile(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Portal de Pagos</h1>
          <p className="text-zinc-500 mt-1">Sube las capturas de pantalla de tus pagos por Nequi para la inscripción.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card className="shadow-sm border-zinc-200 bg-white">
          <CardHeader>
            <CardTitle className="text-zinc-900">Enviar Pago</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Drop zone */}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleInputChange} />

            {uploadedFile ? (
              <div className="relative rounded-xl overflow-hidden border border-lime-300 bg-lime-50">
                <img src={uploadedFile.preview} alt="Vista previa" className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <ImageIcon className="w-4 h-4 text-white flex-shrink-0" />
                    <span className="text-white text-sm font-medium truncate">{uploadedFile.name}</span>
                  </div>
                  <button
                    onClick={() => setUploadedFile(null)}
                    className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors flex-shrink-0"
                  >
                    <X className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge className="bg-lime-500 text-white text-xs">Lista para enviar</Badge>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={cn(
                  "border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 cursor-pointer transition-all duration-200 group",
                  isDragging
                    ? "border-lime-500 bg-lime-50 scale-[1.01]"
                    : "border-zinc-300 bg-zinc-50 hover:bg-zinc-100 hover:border-zinc-400"
                )}
              >
                <div className={cn("w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm transition-transform", isDragging ? "scale-125" : "group-hover:scale-110")}>
                  <Upload className={cn("w-6 h-6 transition-colors", isDragging ? "text-lime-600" : "text-lime-500")} />
                </div>
                <h4 className="font-medium text-zinc-800 mb-1">
                  {isDragging ? "¡Suelta aquí!" : "Subir Captura de Nequi"}
                </h4>
                <p className="text-sm text-zinc-500 text-center max-w-[250px]">
                  {isDragging ? "Suelta la imagen para cargarla" : "Arrastra y suelta tu imagen aquí, o haz clic para buscar. (JPG, PNG)"}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Inscripción del Torneo:</span>
                <span className="font-bold text-zinc-800">$50.00 COP</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Número de Nequi:</span>
                <button
                  className="font-mono text-lime-700 bg-lime-100 px-2 py-0.5 rounded hover:bg-lime-200 transition-colors active:scale-95"
                  onClick={() => {
                    navigator.clipboard.writeText("3001234567");
                    toast.success("Número copiado", { description: "300 123 4567 copiado al portapapeles.", duration: 2000 });
                  }}
                >
                  300 123 4567
                </button>
              </div>
            </div>

            <LoadingButton
              className="w-full mt-4 bg-lime-500 hover:bg-lime-600 text-white font-semibold"
              loadingText="Enviando..."
              successText="¡Enviado!"
              onAsyncClick={handleSend}
            >
              Enviar Verificación
            </LoadingButton>
          </CardContent>
        </Card>

        {/* Info / Rules */}
        <Card className="bg-lime-50 border-lime-200 shadow-sm h-fit">
          <CardHeader>
            <CardTitle className="text-lime-700 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> Proceso de Verificación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-zinc-700 text-sm leading-relaxed">
            <p>1. Realiza la transferencia por Nequi al número oficial del torneo.</p>
            <p>2. Asegúrate de que la captura muestre claramente el <strong>monto</strong>, la <strong>fecha</strong> y el <strong>ID de transacción</strong>.</p>
            <p>3. Sube la captura usando el formulario. Nuestro equipo de tesorería lo revisará en 24 horas.</p>
          </CardContent>
        </Card>
      </div>

      {/* History */}
      <Card className="shadow-sm border-zinc-200 bg-white">
        <CardHeader className="border-b border-zinc-100 pb-4">
          <CardTitle className="text-zinc-900">Envíos Recientes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-zinc-100">
            {paymentHistory.map((item) => (
              <div key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-zinc-50 flex items-center justify-center shrink-0 border border-zinc-200">
                    <FileImage className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-zinc-900">{item.id} &middot; {item.user}</h4>
                    <p className="text-sm text-zinc-500 mt-1">{item.date} &middot; {item.amount}</p>
                    {item.reason && <p className="text-xs text-red-500 mt-1.5">Motivo: {item.reason}</p>}
                  </div>
                </div>
                <div className="flex items-center sm:justify-end">
                  {item.status === 'Aprobado' && (
                    <Badge variant="success" className="gap-1.5 pl-1.5 text-lime-700 bg-lime-100 border border-lime-200"><CheckCircle2 className="w-3.5 h-3.5" /> Aprobado</Badge>
                  )}
                  {item.status === 'Pendiente' && (
                    <Badge variant="warning" className="gap-1.5 pl-1.5 bg-amber-100 text-amber-700 border-amber-200"><Clock className="w-3.5 h-3.5" /> Pendiente</Badge>
                  )}
                  {item.status === 'Rechazado' && (
                    <Badge variant="destructive" className="gap-1.5 pl-1.5 bg-red-100 text-red-700 border border-red-200"><XCircle className="w-3.5 h-3.5" /> Rechazado</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
