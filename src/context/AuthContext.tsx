import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getApiErrorMessage, loginRequest, mapBackendUserToFrontend, registerRequest, toBackendRole } from "../services/auth/auth.service";

export type UserRole = 'guest' | 'player' | 'captain' | 'organizer' | 'referee';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  position?: string; // Para jugadores
  teamName?: string; // Para capitanes
  available?: boolean; // Para jugadores buscando equipo
  jerseyNumber?: number;
  photo?: string;
  userType?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  name: string;
  role: UserRole;
  position?: string;
  jerseyNumber?: number;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<User>;
  logout: () => void;
  register: (credentials: RegisterCredentials) => Promise<User>;
  updateProfile: (updates: Partial<User>) => void;
  loginWithToken: (session: { token: string; user: User }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "techcup.auth.session";

interface StoredSession {
  token: string;
  user: User;
}

function readStoredSession(): StoredSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!rawSession) {
      return null;
    }

    return JSON.parse(rawSession) as StoredSession;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const storedSession = readStoredSession();
  const [user, setUser] = useState<User | null>(storedSession?.user ?? null);
  const [token, setToken] = useState<string | null>(storedSession?.token ?? null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (user && token) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, token }));
      window.localStorage.setItem("techcup.auth.token", token);
      return;
    }

    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    window.localStorage.removeItem("techcup.auth.token");
  }, [user, token]);

  const login = async ({ email, password }: LoginCredentials) => {
    const response = await loginRequest({ email, password });
    const mappedUser = mapBackendUserToFrontend(response.user);

    setUser(mappedUser);
    setToken(response.token);

    return mappedUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const register = async ({ name, email, password, role, position, jerseyNumber }: RegisterCredentials) => {
    await registerRequest({
      name,
      email,
      password,
      position,
      jerseyNumber,
      role: toBackendRole(role),
      userType: "EXTERNAL",
    });

    return login({ email, password });
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const loginWithToken = ({ token, user: newUser }: { token: string; user: User }) => {
    setUser(newUser);
    setToken(token);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateProfile, loginWithToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}