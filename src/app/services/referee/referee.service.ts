import { http } from "../http/http";

type UnknownRecord = Record<string, unknown>;

export interface RefereeMatchItem {
  id: string;
  home: string;
  away: string;
  date: string;
  fullDate: string;
  time: string;
  pitch: string;
  round: string;
  status: "Próximo" | "Finalizado";
  tournament: string;
  homeScore: number | null;
  awayScore: number | null;
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

function toDateParts(value: unknown) {
  if (typeof value !== "string" || !value.trim()) {
    return { label: "Por definir", fullLabel: "Por definir", time: "Por definir" };
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return { label: value, fullLabel: value, time: "Por definir" };
  }

  return {
    label: parsed.toLocaleDateString("es-CO", { day: "2-digit", month: "short" }),
    fullLabel: parsed.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }),
    time: parsed.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", hour12: false }),
  };
}

export async function getRefereeMatches(refereeEmail: string): Promise<RefereeMatchItem[]> {
  const encoded = encodeURIComponent(refereeEmail);
  const { data } = await http.get<unknown>(`/matches/referee/${encoded}`);

  return toArray(data).map((item, index) => {
    const record = item && typeof item === "object" ? (item as UnknownRecord) : {};
    const homeScore = toNullableNumber(record.homeScore);
    const awayScore = toNullableNumber(record.awayScore);
    const parts = toDateParts(record.matchDate);

    return {
      id: toStringValue(record.id, String(index + 1)),
      home: toStringValue(record.homeTeam, "Local"),
      away: toStringValue(record.awayTeam, "Visitante"),
      date: parts.label,
      fullDate: parts.fullLabel,
      time: parts.time,
      pitch: toStringValue(record.pitch ?? record.venue, "Cancha por definir"),
      round: toStringValue(record.round ?? record.stage, "Jornada"),
      status: homeScore != null && awayScore != null ? "Finalizado" : "Próximo",
      tournament: toStringValue(record.tournamentName, "Torneo"),
      homeScore,
      awayScore,
    } satisfies RefereeMatchItem;
  });
}
