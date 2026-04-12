import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'guest' | 'player' | 'captain' | 'organizer' | 'referee';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  position?: string; // Para jugadores
  teamName?: string; // Para capitanes
  available?: boolean; // Para jugadores buscando equipo
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => void;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole) => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string, role: UserRole) => {
    // Simulación de login
    setUser({
      id: Math.random().toString(36).substr(2, 9),
      name: 'Usuario Demo',
      role,
      email,
    });
  };

  const logout = () => {
    setUser(null);
  };

  const register = (name: string, email: string, password: string, role: UserRole) => {
    // Simulación de registro
    setUser({
      id: Math.random().toString(36).substr(2, 9),
      name,
      role,
      email,
    });
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateProfile }}>
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