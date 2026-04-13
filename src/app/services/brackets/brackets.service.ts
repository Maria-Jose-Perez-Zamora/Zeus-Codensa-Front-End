import { http } from "../http/http";

type UnknownRecord = Record<string, unknown>;

export interface BracketMatch {
  id: string;
  team1: string;
  team2: string;
  score1: number | null;
  score2: number | null;
  status: "completed" | "pending";
  time?: string;
}

export interface BracketData {
  quarter: BracketMatch[];
  semi: BracketMatch[];
  final: BracketMatch[];
}

function toArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const record = payload as UnknownRecord;
    const candidates = [record.content, record.data, record.items, record.results, record.matches];
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

function toNullableNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function toTimeLabel(value: unknown): string | undefined {
  if (typeof value !== "string" || !value.trim()) {
    return undefined;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString("es-CO", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function normalizeMatch(item: unknown, index: number): BracketMatch {
  const record = item && typeof item === "object" ? (item as UnknownRecord) : {};
  const score1 = toNullableNumber(record.homeScore ?? record.score1);
  const score2 = toNullableNumber(record.awayScore ?? record.score2);

  return {
    id: toStringValue(record.id, String(index + 1)),
    team1: toStringValue(record.homeTeam ?? record.team1, "Por definir"),
    team2: toStringValue(record.awayTeam ?? record.team2, "Por definir"),
    score1,
    score2,
    status: score1 != null && score2 != null ? "completed" : "pending",
    time: toTimeLabel(record.matchDate ?? record.time),
  };
}

async function getBracketPhase(tournamentName: string, phase: "quarter" | "semi" | "final") {
  const encodedName = encodeURIComponent(tournamentName);
  const { data } = await http.get<unknown>(`/tournaments/query/${encodedName}/brackets/${phase}`);
  return toArray(data).map(normalizeMatch);
}

export async function getBracketData(tournamentName: string): Promise<BracketData> {
  const [quarter, semi, final] = await Promise.all([
    getBracketPhase(tournamentName, "quarter"),
    getBracketPhase(tournamentName, "semi"),
    getBracketPhase(tournamentName, "final"),
  ]);

  return { quarter, semi, final };
}
