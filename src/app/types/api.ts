export type BackendRole =
  | "ADMINISTRADOR_SISTEMA"
  | "TOURNAMENT_ORGANIZER"
  | "REFEREE"
  | "CAPTAIN"
  | "PLAYER";

export type BackendUserType = "INTERNAL" | "EXTERNAL";

export type TournamentStatus = "DRAFT" | "OPEN" | "CLOSED" | "IN_PROGRESS" | "FINISHED" | string;
export type MatchStatus = "SCHEDULED" | "FINISHED" | "IN_PROGRESS" | "CANCELLED" | string;
export type RegistrationStatus = "PENDING" | "APPROVED" | "REJECTED" | string;
export type InvitationStatus = "PENDING" | "ACCEPTED" | "REJECTED" | string;

export interface ApiErrorResponse {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  path?: string;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface UserRequestDTO {
  name: string;
  email: string;
  password: string;
  position?: string;
  jerseyNumber?: number;
  photo?: string;
  role: BackendRole;
  userType?: BackendUserType;
}

export interface UserResponseDTO {
  name: string;
  email: string;
  position?: string | null;
  jerseyNumber?: number | null;
  photo?: string | null;
  role: BackendRole;
  userType: BackendUserType;
}

export interface LoginResponseDTO {
  token: string;
  user: UserResponseDTO;
}

export interface TournamentRequestDTO {
  tournamentName: string;
  fechaInicio: string;
  fechaFin: string;
  numeroEquipos: number;
  costoInscripcion: number;
  rules?: string;
  fechaCierreInscripciones?: string;
  fechaInicioFaseGrupos?: string;
  horariosPartidos?: string[];
  canchas?: string[];
  sanctions?: string;
}

export interface TournamentResponseDTO extends TournamentRequestDTO {
  id: string;
  status: TournamentStatus;
}

export interface TournamentHistoryDTO {
  id: string;
  tournamentName: string;
  fechaInicio: string;
  fechaFin: string;
  status: TournamentStatus;
  campeon?: string | null;
}

export interface TeamRequestDTO {
  teamName: string;
  escudo?: string;
  coloresUniforme?: string;
  playerEmails?: string[];
}

export interface TeamResponseDTO {
  teamName: string;
  escudo?: string | null;
  coloresUniforme?: string | null;
  players: UserResponseDTO[];
}

export interface PlayerAvailabilityFilters {
  name?: string;
  position?: string;
}

export interface InvitationRequestDTO {
  captainEmail: string;
  playerEmail: string;
  teamName: string;
}

export interface InvitationAcceptanceDTO {
  status: InvitationStatus;
}

export interface InvitationResponseDTO {
  id: string;
  playerEmail: string;
  teamName: string;
  status: InvitationStatus;
  message: string;
}

export interface MatchRequestDTO {
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
  tournamentName: string;
}

export interface MatchResponseDTO {
  id: string;
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
  homeScore?: number | null;
  awayScore?: number | null;
  status: MatchStatus;
  tournamentName: string;
  refereeEmail?: string | null;
  alineaciones?: Record<string, string[]> | null;
  yellowCards?: Record<string, string[]> | null;
  redCards?: Record<string, string[]> | null;
}

export interface MatchScoreUpdateDTO {
  homeScore: number;
  awayScore: number;
}

export interface MatchLineupUpdateDTO {
  teamName: string;
  players: string[];
}

export interface MatchCardsUpdateDTO {
  yellowCards: Record<string, string[]>;
  redCards: Record<string, string[]>;
}

export interface MatchRefereeUpdateDTO {
  correoArbitro: string;
}

export interface RegistrationRequestDTO {
  teamName: string;
  tournamentName: string;
  comprobantePagoUrl: string;
}

export interface RegistrationResponseDTO {
  id: string;
  teamName: string;
  tournamentName: string;
  status: RegistrationStatus;
  comprobantePagoUrl: string;
  fechaInscripcion: string;
}

export interface RegistrationStatusUpdateDTO {
  status: RegistrationStatus;
}

export interface StandingDTO {
  teamName: string;
  matchesPlayed: number;
  matchesWon: number;
  matchesDrawn: number;
  matchesLost: number;
  golesFavor: number;
  golesContra: number;
  goalDifference: number;
  points: number;
}

export interface KnockoutBracketDTO {
  phase: string;
  homeTeam: string;
  awayTeam: string;
  ganador?: string | null;
}

export interface TournamentQueryIndexDTO {
  status: string;
  message: string;
}

export interface TournamentCalendarEntryDTO {
  id: string;
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
  status: MatchStatus;
  [key: string]: unknown;
}

export interface TournamentResultEntryDTO {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number | null;
  awayScore?: number | null;
  matchDate: string;
  [key: string]: unknown;
}

export interface ApiMessageResponseDTO {
  mensaje: string;
}

export type ApiList<T> = T[];
export type ApiDictionary = Record<string, unknown>;