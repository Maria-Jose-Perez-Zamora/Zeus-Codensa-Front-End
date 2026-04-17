import { apiClient } from "../lib/apiClient";
import type {
  InvitationAcceptanceDTO,
  InvitationRequestDTO,
  InvitationResponseDTO,
  PlayerAvailabilityFilters,
  UserResponseDTO,
} from "../types/api";

export async function getAvailablePlayers(filters: PlayerAvailabilityFilters = {}) {
  const { data } = await apiClient.get<UserResponseDTO[]>("/players/available", {
    params: filters,
  });

  return data;
}

export async function sendInvitation(payload: InvitationRequestDTO) {
  const { data } = await apiClient.post<InvitationResponseDTO>("/players/invitations", payload);
  return data;
}

export async function processInvitation(id: string, playerEmail: string, payload: InvitationAcceptanceDTO) {
  await apiClient.patch(`/players/invitations/${id}/acceptance`, payload, {
    params: { playerEmail },
  });
}
