import { http } from "../http/http";

export type TournamentStatusColor = "lime" | "blue" | "zinc";

export interface TournamentListItem {
  id: number;
  name: string;
  status: string;
  teams: number;
  startDate: string;
  endDate: string;
  location: string;
  category: string;
  statusColor: TournamentStatusColor;
}

type UnknownRecord = Record<string, unknown>;

function asArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const record = payload as UnknownRecord;
    const candidates = [record.content, record.data, record.results, record.items, record.tournaments];
    const firstArray = candidates.find(Array.isArray);
    if (firstArray) {
      return firstArray;
    }
  }

  return [];
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function toStringValue(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function formatDate(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) {
    return "Por confirmar";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function mapStatus(rawStatus: string): { label: string; color: TournamentStatusColor } {
  const normalized = rawStatus.toUpperCase();

  if (normalized.includes("COURSE") || normalized.includes("CURSO") || normalized.includes("ACTIVE")) {
    return { label: "En Curso", color: "lime" };
  }

  if (normalized.includes("OPEN") || normalized.includes("INSCRIP")) {
    return { label: "Inscripciones Abiertas", color: "blue" };
  }

  if (normalized.includes("END") || normalized.includes("FINAL") || normalized.includes("DONE")) {
    return { label: "Finalizado", color: "zinc" };
  }

  return { label: "Próximamente", color: "zinc" };
}

function normalizeTournament(item: unknown, index: number): TournamentListItem {
  const record = item && typeof item === "object" ? (item as UnknownRecord) : {};

  const rawStatus = toStringValue(record.status, "PRÓXIMAMENTE");
  const mappedStatus = mapStatus(rawStatus);

  return {
    id: toNumber(record.tournamentId ?? record.id, index + 1),
    name: toStringValue(record.tournamentName ?? record.name, `Torneo ${index + 1}`),
    status: mappedStatus.label,
    teams: toNumber(record.numeroEquipos ?? record.maxTeams, 0),
    startDate: formatDate(record.fechaInicio ?? record.startDate),
    endDate: formatDate(record.fechaFin ?? record.endDate),
    location: toStringValue(record.location, "Por definir"),
    category: toStringValue(record.category, "General"),
    statusColor: mappedStatus.color,
  };
}

export async function getTournaments(): Promise<TournamentListItem[]> {
  let backendData: TournamentListItem[] = [];
  try {
    const { data } = await http.get<unknown>("/tournaments/query/all");
    backendData = asArray(data).map(normalizeTournament);
  } catch (error) {
    console.error("No se pudo cargar del backend", error);
  }

  // Agrega los creados recientemente en la UI (LocalStorage)
  try {
    const local = JSON.parse(localStorage.getItem("mock_tournaments") || "[]");
    local.forEach((t: any) => {
      backendData.push({
        id: t.id,
        name: t.name,
        status: t.status || "Inscripciones Abiertas",
        teams: t.teams || 12,
        startDate: t.startDate || "20 May 2026",
        endDate: t.endDate || "30 May 2026",
        location: t.location || "Por definir",
        category: t.category || "General",
        statusColor: t.statusColor || "blue",
      });
    });
  } catch(e) {}

  return backendData;
}