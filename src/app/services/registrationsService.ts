import { apiClient } from "../lib/apiClient";
import type {
  RegistrationRequestDTO,
  RegistrationResponseDTO,
  RegistrationStatusUpdateDTO,
} from "../types/api";

export async function createRegistration(payload: RegistrationRequestDTO) {
  const { data } = await apiClient.post<RegistrationResponseDTO>("/registrations", payload);
  return data;
}

export async function updateRegistrationStatus(id: string, payload: RegistrationStatusUpdateDTO) {
  const { data } = await apiClient.put<RegistrationResponseDTO>(`/registrations/${id}/status`, payload);
  return data;
}

export async function getRegistrations() {
  const { data } = await apiClient.get<RegistrationResponseDTO[]>("/registrations");
  return data;
}
