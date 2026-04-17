import { apiClient } from "../lib/apiClient";
import type {
  MatchCardsUpdateDTO,
  MatchLineupUpdateDTO,
  MatchRefereeUpdateDTO,
  MatchRequestDTO,
  MatchResponseDTO,
  MatchScoreUpdateDTO,
} from "../types/api";

export async function createMatch(payload: MatchRequestDTO) {
  const { data } = await apiClient.post<MatchResponseDTO>("/matches", payload);
  return data;
}

export async function updateMatchScore(id: string, payload: MatchScoreUpdateDTO) {
  const { data } = await apiClient.put<MatchResponseDTO>(`/matches/${id}/score`, payload);
  return data;
}

export async function updateMatchLineup(id: string, payload: MatchLineupUpdateDTO) {
  const { data } = await apiClient.put<MatchResponseDTO>(`/matches/${id}/lineup`, payload);
  return data;
}

export async function updateMatchCards(id: string, payload: MatchCardsUpdateDTO) {
  const { data } = await apiClient.put<MatchResponseDTO>(`/matches/${id}/cards`, payload);
  return data;
}

export async function assignMatchReferee(id: string, payload: MatchRefereeUpdateDTO) {
  const { data } = await apiClient.put<MatchResponseDTO>(`/matches/${id}/referee`, payload);
  return data;
}

export async function getMatchesByReferee(refereeEmail: string) {
  const { data } = await apiClient.get<MatchResponseDTO[]>(`/matches/referee/${refereeEmail}`);
  return data;
}

export async function getMatches() {
  const { data } = await apiClient.get<MatchResponseDTO[]>("/matches");
  return data;
}
