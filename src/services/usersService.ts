import { apiClient } from "../lib/apiClient";
import type { UserRequestDTO, UserResponseDTO } from "../types/api";

export async function registerUser(payload: UserRequestDTO) {
  const { data } = await apiClient.post<UserResponseDTO>("/users", payload);
  return data;
}

export async function getUsers() {
  const { data } = await apiClient.get<UserResponseDTO[]>("/users");
  return data;
}
