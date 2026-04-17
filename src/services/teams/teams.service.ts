import { http } from "../http/http";

export type TeamColor = "lime" | "blue" | "purple" | "orange" | "cyan" | "red";

export interface TeamListItem {
  id: number;
  name: string;
  captain: string;
  players: number;
  position: number;
  points: number;
  wins: number;
  draws: number;
  losses: number;
  color: TeamColor;
}

type UnknownRecord = Record<string, unknown>;

const palette: TeamColor[] = ["lime", "blue", "purple", "orange", "cyan", "red"];

function asArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const record = payload as UnknownRecord;
    const candidates = [record.content, record.data, record.results, record.items, record.teams];
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

function normalizeTeam(item: unknown, index: number): TeamListItem {
  const record = item && typeof item === "object" ? (item as UnknownRecord) : {};
  // Backend returns teamName (not name) and captainName (not captain)
  const players = toNumber(record.playerCount ?? (Array.isArray(record.players) ? (record.players as unknown[]).length : record.players) ?? record.members, 0);
  const wins = toNumber(record.wins, 0);
  const draws = toNumber(record.draws, 0);
  const losses = toNumber(record.losses, 0);

  return {
    id: toNumber(record.id, index + 1),
    name: toStringValue(record.teamName ?? record.name, `Equipo ${index + 1}`),
    captain: toStringValue(record.captainName ?? record.captain ?? record.ownerName, "Por definir"),
    players: typeof record.players === "number" ? record.players : players,
    position: toNumber(record.position ?? record.rank, index + 1),
    points: toNumber(record.points ?? wins * 3 + draws),
    wins,
    draws,
    losses,
    color: palette[index % palette.length],
  };
}

export async function getTeams(): Promise<TeamListItem[]> {
  const { data } = await http.get<unknown>("/teams");
  const teams = asArray(data).map(normalizeTeam);
  return teams.sort((a, b) => a.position - b.position);
}

export async function requestToJoinTeam(teamName: string) {
  const { data } = await http.post(`/players/join-requests?teamName=${encodeURIComponent(teamName)}`);
  return data;
}