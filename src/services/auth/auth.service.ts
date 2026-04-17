import { http } from "../http/http";
import type { UserRole } from "../../context/AuthContext";

export type BackendRole =
  | "ADMINISTRADOR_SISTEMA"
  | "TOURNAMENT_ORGANIZER"
  | "REFEREE"
  | "CAPTAIN"
  | "PLAYER";

export interface BackendUser {
  name: string;
  email: string;
  position?: string | null;
  jerseyNumber?: number | null;
  photo?: string | null;
  role: BackendRole;
  userType?: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: BackendUser;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  position?: string;
  jerseyNumber?: number;
  photo?: string;
  role: BackendRole;
  userType?: string;
}

export function toBackendRole(role: UserRole): BackendRole {
  switch (role) {
    case "captain":
      return "CAPTAIN";
    case "organizer":
      return "TOURNAMENT_ORGANIZER";
    case "referee":
      return "REFEREE";
    case "player":
    default:
      return "PLAYER";
  }
}

export function toFrontendRole(role: string | undefined | null): UserRole {
  switch ((role ?? "").toUpperCase()) {
    case "CAPTAIN":
      return "captain";
    case "TOURNAMENT_ORGANIZER":
    case "ADMINISTRADOR_SISTEMA":
      return "organizer";
    case "REFEREE":
      return "referee";
    case "PLAYER":
    default:
      return "player";
  }
}

export function mapBackendUserToFrontend(user: BackendUser) {
  return {
    id: user.email,
    name: user.name,
    email: user.email,
    role: toFrontendRole(user.role),
    position: user.position ?? undefined,
    jerseyNumber: user.jerseyNumber ?? undefined,
    photo: user.photo ?? undefined,
    userType: user.userType ?? undefined,
  };
}

export async function loginRequest(payload: LoginRequest) {
  const { data } = await http.post<LoginResponse>("/auth", payload);
  return data;
}

export async function registerRequest(payload: RegisterRequest) {
  const { data } = await http.post<BackendUser>("/users", payload);
  return data;
}

export function getApiErrorMessage(error: unknown, fallback = "No se pudo completar la solicitud") {
  if (typeof error === "object" && error && "response" in error) {
    const axiosError = error as { response?: { data?: unknown }; message?: string };
    const data = axiosError.response?.data;

    if (typeof data === "string" && data.trim()) {
      return data;
    }

    if (data && typeof data === "object") {
      const payload = data as Record<string, unknown>;
      const message = payload.message ?? payload.error ?? payload.detail;
      if (typeof message === "string" && message.trim()) {
        return message;
      }
    }

    if (axiosError.message) {
      return axiosError.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
