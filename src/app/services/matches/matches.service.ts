import { http } from "../http/http";

type UnknownRecord = Record<string, unknown>;

interface MatchStats {
  shots: number;
  possession: number;
  fouls: number;
}

export interface UpcomingMatchListItem {
  id: number;
  home: string;
  away: string;
  date: string;
  time: string;
  pitch: string;
  round: string;
}

export interface CompletedMatchListItem {
  id: number;
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
  date: string;
  time: string;
  round: string;
  homeStats: MatchStats;
  awayStats: MatchStats;
}

export interface MatchCollections {
  upcoming: UpcomingMatchListItem[];
  completed: CompletedMatchListItem[];
}

function asArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const record = payload as UnknownRecord;
    const candidates = [record.content, record.data, record.results, record.items, record.matches];
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

function formatTime(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) {
    return "Por confirmar";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function normalizeStats(record: UnknownRecord, side: "home" | "away"): MatchStats {
  return {
    shots: toNumber(record[`${side}Shots`] ?? record[`${side}TeamShots`], 0),
    possession: toNumber(record[`${side}Possession`] ?? record[`${side}TeamPossession`], 50),
    fouls: toNumber(record[`${side}Fouls`] ?? record[`${side}TeamFouls`], 0),
  };
}

function normalizeUpcoming(record: UnknownRecord, index: number): UpcomingMatchListItem {
  return {
    id: toNumber(record.id, index + 1),
    home: toStringValue(record.homeTeamName ?? record.homeTeam ?? record.localTeamName, "Local"),
    away: toStringValue(record.awayTeamName ?? record.awayTeam ?? record.visitorTeamName, "Visitante"),
    date: formatDate(record.matchDate ?? record.date ?? record.startDate),
    time: formatTime(record.matchDate ?? record.date ?? record.startDate),
    pitch: toStringValue(record.pitch ?? record.location ?? record.venue, "Cancha por definir"),
    round: toStringValue(record.round ?? record.stage ?? record.matchday, "Jornada"),
  };
}

function normalizeCompleted(record: UnknownRecord, index: number): CompletedMatchListItem {
  return {
    id: toNumber(record.id, index + 1),
    home: toStringValue(record.homeTeamName ?? record.homeTeam ?? record.localTeamName, "Local"),
    away: toStringValue(record.awayTeamName ?? record.awayTeam ?? record.visitorTeamName, "Visitante"),
    homeScore: toNumber(record.homeScore ?? record.localScore, 0),
    awayScore: toNumber(record.awayScore ?? record.visitorScore, 0),
    date: formatDate(record.matchDate ?? record.date ?? record.startDate),
    time: formatTime(record.matchDate ?? record.date ?? record.startDate),
    round: toStringValue(record.round ?? record.stage ?? record.matchday, "Jornada"),
    homeStats: normalizeStats(record, "home"),
    awayStats: normalizeStats(record, "away"),
  };
}

export async function getMatches(): Promise<MatchCollections> {
  const { data } = await http.get<unknown>("/matches");
  const rawMatches = asArray(data).map((item) => (item && typeof item === "object" ? (item as UnknownRecord) : {}));

  const upcoming = rawMatches
    .filter((record) => (record.homeScore == null || record.awayScore == null))
    .map(normalizeUpcoming);

  const completed = rawMatches
    .filter((record) => (record.homeScore != null && record.awayScore != null))
    .map(normalizeCompleted);

  return { upcoming, completed };
}