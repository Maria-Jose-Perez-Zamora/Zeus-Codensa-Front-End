import { http } from "../http/http";

type UnknownRecord = Record<string, unknown>;

export interface StandingRow {
  rank: number;
  team: string;
  gp: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  gd: string;
  pts: number;
}

export interface ScorerRow {
  name: string;
  team: string;
  goals: number;
}

function toArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const record = payload as UnknownRecord;
    const candidates = [record.content, record.data, record.items, record.results, record.scorers];
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

function normalizeStanding(item: unknown, index: number): StandingRow {
  const record = item && typeof item === "object" ? (item as UnknownRecord) : {};
  const wins = toNumberValue(record.wins, 0);
  const draws = toNumberValue(record.draws, 0);
  const losses = toNumberValue(record.losses, 0);
  const goalsFor = toNumberValue(record.goalsFor ?? record.gf, 0);
  const goalsAgainst = toNumberValue(record.goalsAgainst ?? record.ga, 0);
  const goalDiff = goalsFor - goalsAgainst;

  return {
    rank: toNumberValue(record.rank ?? record.position, index + 1),
    team: toStringValue(record.teamName ?? record.team, `Equipo ${index + 1}`),
    gp: toNumberValue(record.gamesPlayed ?? record.played, wins + draws + losses),
    w: wins,
    d: draws,
    l: losses,
    gf: goalsFor,
    ga: goalsAgainst,
    gd: goalDiff > 0 ? `+${goalDiff}` : String(goalDiff),
    pts: toNumberValue(record.points, wins * 3 + draws),
  };
}

function normalizeScorer(item: unknown): ScorerRow {
  const record = item && typeof item === "object" ? (item as UnknownRecord) : {};

  return {
    name: toStringValue(record.playerName ?? record.name, "Jugador"),
    team: toStringValue(record.teamName ?? record.team, "Equipo"),
    goals: toNumberValue(record.goals, 0),
  };
}

export async function getStandings(tournamentName: string): Promise<StandingRow[]> {
  const encoded = encodeURIComponent(tournamentName);
  const { data } = await http.get<unknown>(`/tournaments/query/${encoded}/standings`);
  const rows = toArray(data).map(normalizeStanding);
  return rows.sort((a, b) => b.pts - a.pts || Number(b.gd) - Number(a.gd));
}

export async function getTopScorers(tournamentName: string): Promise<ScorerRow[]> {
  const encoded = encodeURIComponent(tournamentName);
  const { data } = await http.get<unknown>(`/tournaments/query/${encoded}/scorers`);
  return toArray(data).map(normalizeScorer).sort((a, b) => b.goals - a.goals);
}
