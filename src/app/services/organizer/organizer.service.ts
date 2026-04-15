import { http } from "../http/http";

type UnknownRecord = Record<string, unknown>;

export interface TournamentHistoryItem {
  id: string;
  name: string;
}

export interface OrganizerRegistrationItem {
  id: string;
  team: string;
  amount: number;
  concept: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  reference: string;
}

export interface CreateTournamentPayload {
  tournamentName: string;
  fechaInicio: string;
  fechaFin: string;
  numeroEquipos: number;
  costoInscripcion: number;
  rules?: string;
  sanctions?: string;
}

export interface CreateMatchPayload {
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
  tournamentName: string;
}

function toArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const record = payload as UnknownRecord;
    const candidates = [record.content, record.data, record.items, record.results];
    const firstArray = candidates.find(Array.isArray);
    if (firstArray) {
      return firstArray;
    }
  }

  return [];
}

function toStringValue(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function toNumberValue(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function toDateLabel(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) {
    return "Sin fecha";
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

function normalizeRegistrationStatus(value: unknown): OrganizerRegistrationItem["status"] {
  const normalized = toStringValue(value, "PENDING").toUpperCase();

  if (normalized.includes("APPRO")) {
    return "approved";
  }

  if (normalized.includes("REJEC")) {
    return "rejected";
  }

  return "pending";
}

export async function getTournamentHistory(): Promise<TournamentHistoryItem[]> {
  const { data } = await http.get<unknown>("/tournaments/query/all");

  return toArray(data).map((item, index) => {
    const record = item && typeof item === "object" ? (item as UnknownRecord) : {};

    return {
      id: toStringValue(record.id, String(index + 1)),
      name: toStringValue(record.tournamentName ?? record.name, `Torneo ${index + 1}`),
    };
  });
}

export async function createTournament(payload: CreateTournamentPayload) {
  const { data } = await http.post("/tournaments", payload);
  return data;
}

export async function createMatch(payload: CreateMatchPayload) {
  const { data } = await http.post("/matches", payload);
  return data;
}

export async function updateMatchScore(matchId: string | number, homeScore: number, awayScore: number) {
  const { data } = await http.put(`/matches/${matchId}/score`, { homeScore, awayScore });
  return data;
}

export async function getRegistrations(): Promise<OrganizerRegistrationItem[]> {
  const { data } = await http.get<unknown>("/registrations");

  return toArray(data).map((item, index) => {
    const record = item && typeof item === "object" ? (item as UnknownRecord) : {};

    return {
      id: toStringValue(record.id, String(index + 1)),
      team: toStringValue(record.teamName ?? record.team, "Equipo"),
      amount: toNumberValue(record.amount ?? record.value ?? record.costoInscripcion, 0),
      concept: toStringValue(record.concept ?? record.tournamentName, "Inscripción de torneo"),
      date: toDateLabel(record.createdAt ?? record.date),
      status: normalizeRegistrationStatus(record.status),
      reference: toStringValue(record.receiptLink ?? record.reference, `REF-${index + 1}`),
    };
  });
}

export async function updateRegistrationStatus(
  id: string,
  status: OrganizerRegistrationItem["status"],
) {
  const backendStatus = status === "approved" ? "APPROVED" : status === "rejected" ? "REJECTED" : "PENDING";
  const { data } = await http.put(`/registrations/${id}/status`, { status: backendStatus });
  return data;
}
