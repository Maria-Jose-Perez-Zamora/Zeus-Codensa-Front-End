import { createBrowserRouter, Outlet } from "react-router";
import { Suspense } from "react";
import { Layout } from "./components/Layout";
import { AuthLayout } from "./components/AuthLayout";
import { PublicLayout } from "./components/PublicLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";

const SuspenseLayout = () => (
  <Suspense fallback={<div className="flex h-screen items-center justify-center font-semibold text-lg">Cargando...</div>}>
    <Outlet />
  </Suspense>
);

export const router = createBrowserRouter([
  // Rutas públicas (login/register)
  {
    path: "/auth",
    Component: PublicLayout,
    children: [
      { path: "login", lazy: async () => ({ Component: (await import("./pages/Login")).Login }) },
      { path: "register", lazy: async () => ({ Component: (await import("./pages/Register")).Register }) },
      { path: "callback", lazy: async () => ({ Component: (await import("./pages/OAuthCallback")).OAuthCallback }) },
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
          {
            Component: SuspenseLayout,
            children: [
              { index: true, lazy: async () => ({ Component: (await import("./pages/Home")).Home }) },
              { path: "dashboard", lazy: async () => ({ Component: (await import("./pages/Dashboard")).Dashboard }) },
              { path: "profile", lazy: async () => ({ Component: (await import("./pages/PlayerProfile")).PlayerProfile }) },
              { path: "lineup", lazy: async () => ({ Component: (await import("./pages/LineupBuilder")).LineupBuilder }) },
              { path: "payment", lazy: async () => ({ Component: (await import("./pages/PaymentPortal")).PaymentPortal }) },
              { path: "brackets", lazy: async () => ({ Component: (await import("./pages/TournamentBrackets")).TournamentBrackets }) },
              { path: "tournaments", lazy: async () => ({ Component: (await import("./pages/Tournaments")).Tournaments }) },
              { path: "standings", lazy: async () => ({ Component: (await import("./pages/Standings")).Standings }) },
              { path: "matches", lazy: async () => ({ Component: (await import("./pages/Matches")).Matches }) },
              { path: "teams", lazy: async () => ({ Component: (await import("./pages/Teams")).Teams }) },
              
              // Player routes
              {
                element: <ProtectedRoute allowedRoles={['player']} />,
                children: [
                  { path: "player/profile-setup", lazy: async () => ({ Component: (await import("./pages/player/ProfileSetup")).ProfileSetup }) },
                  { path: "player/find-team", lazy: async () => ({ Component: (await import("./pages/player/FindTeam")).FindTeam }) },
                ]
              },
              
              // Captain routes
              {
                element: <ProtectedRoute allowedRoles={['captain']} />,
                children: [
                  { path: "captain/create-team", lazy: async () => ({ Component: (await import("./pages/captain/CreateTeam")).CreateTeam }) },
                  { path: "captain/invite-players", lazy: async () => ({ Component: (await import("./pages/captain/InvitePlayers")).InvitePlayers }) },
                ]
              },
              
              // Organizer routes
              {
                element: <ProtectedRoute allowedRoles={['organizer']} />,
                children: [
                  { path: "organizer/dashboard", lazy: async () => ({ Component: (await import("./pages/organizer/OrganizerDashboard")).OrganizerDashboard }) },
                  { path: "organizer/create-tournament", lazy: async () => ({ Component: (await import("./pages/organizer/CreateTournament")).CreateTournament }) },
                  { path: "organizer/manage-teams", lazy: async () => ({ Component: (await import("./pages/organizer/ManageTeams")).ManageTeams }) },
                  { path: "organizer/schedule-matches", lazy: async () => ({ Component: (await import("./pages/organizer/ScheduleMatches")).ScheduleMatches }) },
                  { path: "organizer/register-results", lazy: async () => ({ Component: (await import("./pages/organizer/RegisterResults")).RegisterResults }) },
                  { path: "organizer/approve-payments", lazy: async () => ({ Component: (await import("./pages/organizer/ApprovePayments")).ApprovePayments }) },
                ]
              },
              
              // Referee routes
              {
                element: <ProtectedRoute allowedRoles={['referee']} />,
                children: [
                  { path: "referee/schedule", lazy: async () => ({ Component: (await import("./pages/referee/RefereeSchedule")).RefereeSchedule }) },
                ]
              },
            ]
          }
        ],
      },
    ],
  },
]);