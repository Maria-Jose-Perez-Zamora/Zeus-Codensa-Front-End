import { createBrowserRouter } from "react-router";
import { Dashboard } from "./pages/Dashboard";
import { PlayerProfile } from "./pages/PlayerProfile";
import { LineupBuilder } from "./pages/LineupBuilder";
import { PaymentPortal } from "./pages/PaymentPortal";
import { TournamentBrackets } from "./pages/TournamentBrackets";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Tournaments } from "./pages/Tournaments";
import { Standings } from "./pages/Standings";
import { Matches } from "./pages/Matches";
import { Teams } from "./pages/Teams";
import { ProfileSetup } from "./pages/player/ProfileSetup";
import { FindTeam } from "./pages/player/FindTeam";
import { CreateTeam } from "./pages/captain/CreateTeam";
import { InvitePlayers } from "./pages/captain/InvitePlayers";
import { CreateTournament } from "./pages/organizer/CreateTournament";
import { OrganizerDashboard } from "./pages/organizer/OrganizerDashboard";
import { ManageTeams } from "./pages/organizer/ManageTeams";
import { ScheduleMatches } from "./pages/organizer/ScheduleMatches";
import { RegisterResults } from "./pages/organizer/RegisterResults";
import { ApprovePayments } from "./pages/organizer/ApprovePayments";
import { RefereeSchedule } from "./pages/referee/RefereeSchedule";
import { Layout } from "./components/Layout";
import { AuthLayout } from "./components/AuthLayout";
import { PublicLayout } from "./components/PublicLayout";

export const router = createBrowserRouter([
  // Rutas públicas (login/register)
  {
    path: "/auth",
    Component: PublicLayout,
    children: [
      { path: "login", Component: Login },
      { path: "register", Component: Register },
    ],
  },
  // Rutas protegidas (requieren autenticación)
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "/",
        Component: Layout,
        children: [
          { index: true, Component: Home },
          { path: "dashboard", Component: Dashboard },
          { path: "profile", Component: PlayerProfile },
          { path: "lineup", Component: LineupBuilder },
          { path: "payment", Component: PaymentPortal },
          { path: "brackets", Component: TournamentBrackets },
          { path: "tournaments", Component: Tournaments },
          { path: "standings", Component: Standings },
          { path: "matches", Component: Matches },
          { path: "teams", Component: Teams },
          
          // Player routes
          { path: "player/profile-setup", Component: ProfileSetup },
          { path: "player/find-team", Component: FindTeam },
          
          // Captain routes
          { path: "captain/create-team", Component: CreateTeam },
          { path: "captain/invite-players", Component: InvitePlayers },
          
          // Organizer routes
          { path: "organizer/dashboard", Component: OrganizerDashboard },
          { path: "organizer/create-tournament", Component: CreateTournament },
          { path: "organizer/manage-teams", Component: ManageTeams },
          { path: "organizer/schedule-matches", Component: ScheduleMatches },
          { path: "organizer/register-results", Component: RegisterResults },
          { path: "organizer/approve-payments", Component: ApprovePayments },
          
          // Referee routes
          { path: "referee/schedule", Component: RefereeSchedule },
        ],
      },
    ],
  },
]);