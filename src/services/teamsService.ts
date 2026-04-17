import { apiClient } from "../lib/apiClient";
import type { TeamRequestDTO, TeamResponseDTO } from "../types/api";

export async function createTeam(payload: TeamRequestDTO) {
  const { data } = await apiClient.post<TeamResponseDTO>("/teams", payload);
  return data;
}

export async function getTeams() {
  const { data } = await apiClient.get<TeamResponseDTO[]>("/teams");
  return data;
}
