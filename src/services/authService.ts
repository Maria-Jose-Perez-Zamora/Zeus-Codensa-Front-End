import { apiClient } from "../lib/apiClient";
import type { LoginRequestDTO, LoginResponseDTO } from "../types/api";

export async function login(credentials: LoginRequestDTO) {
  const { data } = await apiClient.post<LoginResponseDTO>("/auth", credentials);
  return data;
}

export function getGoogleAuthStartUrl() {
  return `${apiClient.defaults.baseURL}/auth/google/start`;
}
