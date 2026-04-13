import { apiClient } from "../lib/apiClient";
import type { TournamentHistoryDTO, TournamentRequestDTO, TournamentResponseDTO } from "../types/api";

export async function createTournament(payload: TournamentRequestDTO) {
  const { data } = await apiClient.post<TournamentResponseDTO>("/tournaments", payload);
  return data;
}

export async function updateTournament(id: string, payload: TournamentRequestDTO) {
  const { data } = await apiClient.put<TournamentResponseDTO>(`/tournaments/${id}`, payload);
  return data;
}

export async function getTournamentHistory() {
  const { data } = await apiClient.get<TournamentHistoryDTO[]>("/tournaments/query/all");
  return data;
}

export async function getTournamentById(id: string) {
  const { data } = await apiClient.get<TournamentResponseDTO>(`/tournaments/query/${id}`);
  return data;
}
