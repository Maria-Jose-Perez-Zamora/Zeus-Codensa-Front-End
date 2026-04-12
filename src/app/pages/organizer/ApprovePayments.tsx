import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useState } from "react";
import { LoadingButton } from "../../components/LoadingButton";
import { toast } from "sonner";

interface Payment {
  id: string;
  team: string;
  amount: number;
  concept: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  reference: string;
}

const initialPayments: Payment[] = [
  {
    id: "1",
    team: "Software Devs FC",
    amount: 50000,
    concept: "Inscripción Torneo Primavera 2026",
    date: "2026-03-15",
    status: "pending",
    reference: "REF-2026-001"
  },
  {
    id: "2",
    team: "Cybersecurity United",
    amount: 50000,
    concept: "Inscripción Torneo Primavera 2026",
    date: "2026-03-16",
    status: "pending",
    reference: "REF-2026-002"
  },
  {
    id: "3",
    team: "Data Science Dynamo",
    amount: 50000,
    concept: "Inscripción Torneo Primavera 2026",
    date: "2026-03-14",
    status: "pending",
    reference: "REF-2026-003"
  }
];

export function ApprovePayments() {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);

  const handleApprove = async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setPayments(payments.map(p => 
      p.id === id ? { ...p, status: "approved" as const } : p
    ));
    
    const payment = payments.find(p => p.id === id);
    toast.success("Pago aprobado", {
      description: `Inscripción de ${payment?.team} aprobada exitosamente.`,
    });
  };

  const handleReject = async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setPayments(payments.map(p => 
      p.id === id ? { ...p, status: "rejected" as const } : p
    ));
    
    const payment = payments.find(p => p.id === id);
    toast.error("Pago rechazado", {
      description: `Inscripción de ${payment?.team} ha sido rechazada.`,
    });
  };

  const pendingCount = payments.filter(p => p.status === "pending").length;
  const approvedCount = payments.filter(p => p.status === "approved").length;
  const rejectedCount = payments.filter(p => p.status === "rejected").length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Aprobar Pagos</h1>
        <p className="text-zinc-500 mt-1">Revisa y aprueba las inscripciones de los equipos</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-900">{pendingCount}</div>
              <div className="text-sm text-orange-700">Pendientes</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-lime-200 bg-lime-50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-lime-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-lime-900">{approvedCount}</div>
              <div className="text-sm text-lime-700">Aprobados</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-900">{rejectedCount}</div>
              <div className="text-sm text-red-700">Rechazados</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de pagos */}
      <Card className="border-zinc-200 bg-white shadow-md">
        <CardHeader className="border-b border-zinc-100">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-lime-500" />
            Solicitudes de Pago
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-zinc-100">
            {payments.map((payment) => (
              <div key={payment.id} className="p-6 hover:bg-zinc-50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-zinc-900">{payment.team}</h3>
                        <p className="text-sm text-zinc-600 mt-1">{payment.concept}</p>
                      </div>
                      <Badge 
                        variant="outline"
                        className={`${
                          payment.status === "pending" 
                            ? "border-orange-200 bg-orange-50 text-orange-700"
                            : payment.status === "approved"
                            ? "border-lime-200 bg-lime-50 text-lime-700"
                            : "border-red-200 bg-red-50 text-red-700"
                        }`}
                      >
                        {payment.status === "pending" ? "Pendiente" : 
                         payment.status === "approved" ? "Aprobado" : "Rechazado"}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="text-zinc-500">Monto:</span>
                        <p className="font-semibold text-zinc-900">
                          ${payment.amount.toLocaleString('es-CO')}
                        </p>
                      </div>
                      <div>
                        <span className="text-zinc-500">Fecha:</span>
                        <p className="font-semibold text-zinc-900">
                          {new Date(payment.date).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <div>
                        <span className="text-zinc-500">Referencia:</span>
                        <p className="font-mono text-xs font-semibold text-zinc-900">
                          {payment.reference}
                        </p>
                      </div>
                    </div>
                  </div>

                  {payment.status === "pending" && (
                    <div className="flex gap-2">
                      <LoadingButton
                        variant="outline"
                        className="border-red-300 text-red-700 hover:bg-red-50"
                        loadingText="Rechazando..."
                        successText="Rechazado"
                        onAsyncClick={() => handleReject(payment.id)}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Rechazar
                      </LoadingButton>
                      <LoadingButton
                        className="bg-lime-500 hover:bg-lime-600 text-white"
                        loadingText="Aprobando..."
                        successText="Aprobado"
                        onAsyncClick={() => handleApprove(payment.id)}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Aprobar
                      </LoadingButton>
                    </div>
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
