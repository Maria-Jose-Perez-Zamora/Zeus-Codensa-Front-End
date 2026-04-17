import { http } from "../http/http";

type UnknownRecord = Record<string, unknown>;

export interface CaptainPlayer {
  name: string;
  email: string;
  position: string;
}

export interface CreateCaptainTeamPayload {
  teamName: string;
  escudo?: string;
  coloresUniforme?: string;
  playerEmails?: string[];
}

function toArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const record = payload as UnknownRecord;
    const candidates = [record.content, record.data, record.items, record.results, record.players];
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

export async function createCaptainTeam(payload: CreateCaptainTeamPayload) {
  const { data } = await http.post("/teams", {
    teamName: payload.teamName,
    escudo: payload.escudo ?? "",
    coloresUniforme: payload.coloresUniforme ?? "",
    playerEmails: payload.playerEmails ?? [],
  });
  return data;
}

export async function getAvailablePlayers(filters?: { name?: string; position?: string }) {
  const { data } = await http.get<unknown>("/players/available", { params: filters });

  return toArray(data).map((item) => {
    const record = item && typeof item === "object" ? (item as UnknownRecord) : {};

    return {
      name: toStringValue(record.name, "Jugador"),
      email: toStringValue(record.email, ""),
      position: toStringValue(record.position, "Por definir"),
    } satisfies CaptainPlayer;
  });
}

export async function invitePlayer(payload: { captainEmail: string; playerEmail: string; teamName: string }) {
  const { data } = await http.post("/players/invitations", payload);
  return data;
}
