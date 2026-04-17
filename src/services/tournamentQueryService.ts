import { apiClient } from "../lib/apiClient";
import type {
  ApiDictionary,
  ApiMessageResponseDTO,
  KnockoutBracketDTO,
  StandingDTO,
  TournamentCalendarEntryDTO,
  TournamentQueryIndexDTO,
  TournamentResultEntryDTO,
} from "../types/api";

export async function getQueryIndex() {
  const { data } = await apiClient.get<TournamentQueryIndexDTO>("/tournaments/query");
  return data;
}

export async function getStandings(tournament: string) {
  const { data } = await apiClient.get<StandingDTO[]>(`/tournaments/query/${tournament}/standings`);
  return data;
}

export async function getBrackets(tournament: string, phase: string) {
  const { data } = await apiClient.get<KnockoutBracketDTO[] | ApiDictionary>(
    `/tournaments/query/${tournament}/brackets/${phase}`,
  );

  return data;
}

export async function getCalendar(tournament: string) {
  const { data } = await apiClient.get<TournamentCalendarEntryDTO[] | ApiMessageResponseDTO>(
    `/tournaments/query/${tournament}/calendar`,
  );

  return data;
}

export async function getResults(tournament: string) {
  const { data } = await apiClient.get<TournamentResultEntryDTO[] | ApiMessageResponseDTO>(
    `/tournaments/query/${tournament}/results`,
  );

  return data;
}

export async function getStatistics(tournament: string) {
  const { data } = await apiClient.get<StandingDTO[] | ApiMessageResponseDTO>(
    `/tournaments/query/${tournament}/statistics`,
  );

  return data;
}

export async function getScorers(tournament: string) {
  const { data } = await apiClient.get<ApiDictionary[] | ApiMessageResponseDTO>(
    `/tournaments/query/${tournament}/scorers`,
  );

  return data;
}

export async function getTeamHistory(tournament: string, team: string) {
  const { data } = await apiClient.get<ApiDictionary[] | ApiMessageResponseDTO>(
    `/tournaments/query/${tournament}/history/${team}`,
  );

  return data;
}
