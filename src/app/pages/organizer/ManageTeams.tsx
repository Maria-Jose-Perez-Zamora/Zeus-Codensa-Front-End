import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Shield, User, Search, Mail, Phone, Edit, Trash2, CheckCircle, XCircle, UserPlus, X, CheckCircle2, Save } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

const teamsData = [
  {
    id: 1,
    name: "Software Devs FC",
    captain: "Carlos Martínez",
    email: "carlos@softwaredevs.com",
    phone: "+506 8888-8888",
    players: 10,
    status: "active",
    points: 13,
    wins: 4,
    draws: 1,
    losses: 0,
  },
  {
    id: 2,
    name: "Cybersecurity United",
    captain: "Ana González",
    email: "ana@cybersec.com",
    phone: "+506 7777-7777",
    players: 9,
    status: "active",
    points: 11,
    wins: 3,
    draws: 2,
    losses: 0,
  },
  {
    id: 3,
    name: "Data Science Dynamo",
    captain: "Luis Fernández",
    email: "luis@datascience.com",
    phone: "+506 6666-6666",
    players: 10,
    status: "active",
    points: 9,
    wins: 3,
    draws: 0,
    losses: 2,
  },
  {
    id: 4,
    name: "AI Engineers",
    captain: "María López",
    email: "maria@ai-eng.com",
    phone: "+506 5555-5555",
    players: 8,
    status: "pending",
    points: 7,
    wins: 2,
    draws: 1,
    losses: 2,
  },
  {
    id: 5,
    name: "Network Warriors",
    captain: "José Ramírez",
    email: "jose@network.com",
    phone: "+506 4444-4444",
    players: 7,
    status: "inactive",
    points: 4,
    wins: 1,
    draws: 1,
    losses: 3,
  },
];

// Highlight matching text helper
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-lime-400/30 text-lime-200 rounded px-0.5 not-italic">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export function ManageTeams() {
  const [searchTerm, setSearchTerm] = useState("");
  const [committedSearch, setCommittedSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "pending" | "inactive">("all");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [editedIds, setEditedIds] = useState<Set<number>>(new Set());
  const [addedState, setAddedState] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Edit modal state
  const [editingTeam, setEditingTeam] = useState<typeof teamsData[0] | null>(null);
  const [editForm, setEditForm] = useState({ name: "", captain: "", email: "", phone: "", status: "" });

  // Deleted teams state
  const [deletedIds, setDeletedIds] = useState<Set<number>>(new Set());

  // Add team modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", captain: "", email: "", phone: "", status: "active" });

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dynamic suggestions while typing
  const suggestions =
    searchTerm.length > 0
      ? teamsData.filter(
          (team) =>
            team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            team.captain.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [];

  // Apply search to list only with committedSearch
  const filteredTeams = teamsData.filter((team) => {
    if (deletedIds.has(team.id)) return false;
    const term = committedSearch || searchTerm;
    const matchesSearch =
      term === "" ||
      team.name.toLowerCase().includes(term.toLowerCase()) ||
      team.captain.toLowerCase().includes(term.toLowerCase());
    const matchesStatus = filterStatus === "all" || team.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSuggestionClick = (name: string) => {
    setSearchTerm(name);
    setCommittedSearch(name);
    setShowSuggestions(false);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCommittedSearch("");
    setShowSuggestions(false);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setCommittedSearch(searchTerm);
      setShowSuggestions(false);
    }
    if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleEdit = (id: number, name: string) => {
    const team = teamsData.find((t) => t.id === id) ?? null;
    if (!team) return;
    setEditForm({ name: team.name, captain: team.captain, email: team.email, phone: team.phone, status: team.status });
    setEditingTeam(team);
  };

  const handleSaveEdit = () => {
    if (!editingTeam) return;
    setEditedIds((prev) => new Set(prev).add(editingTeam.id));
    toast.success("Equipo actualizado", { description: `Los cambios de ${editForm.name} fueron guardados.`, duration: 2500 });
    setEditingTeam(null);
    setTimeout(() => {
      setEditedIds((prev) => { const s = new Set(prev); s.delete(editingTeam.id); return s; });
    }, 2500);
  };

  const handleAddTeam = () => {
    setShowAddModal(true);
  };

  const handleConfirmAddTeam = () => {
    if (!addForm.name.trim() || !addForm.captain.trim()) {
      toast.error("Campos requeridos", { description: "El nombre del equipo y capitán son obligatorios." });
      return;
    }
    setAddedState(true);
    setShowAddModal(false);
    setAddForm({ name: "", captain: "", email: "", phone: "", status: "active" });
    toast.success("Equipo agregado", { description: `${addForm.name} fue registrado correctamente.` });
    setTimeout(() => setAddedState(false), 2500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-lime-100 text-lime-700 border-lime-200 hover:bg-lime-200">Activo</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200">Pendiente</Badge>;
      case "inactive":
        return <Badge className="bg-zinc-200 text-zinc-700 border-zinc-300 hover:bg-zinc-300">Inactivo</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── Add Team Modal ── */}
      <Dialog open={showAddModal} onOpenChange={(open) => { if (!open) setShowAddModal(false); }}>
        <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden">
          <>
            {/* Header */}
            <div className="bg-gradient-to-br from-lime-500 to-lime-600 px-6 pt-6 pb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <DialogTitle className="text-white text-base leading-tight">Agregar Equipo</DialogTitle>
                  <p className="text-lime-100 text-xs mt-0.5">Completa los datos del nuevo equipo</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-5 space-y-4">

              {/* Nombre del equipo */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> Nombre del equipo <span className="text-red-400">*</span>
                </label>
                <Input
                  value={addForm.name}
                  onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                  className="rounded-xl border-zinc-200 focus:border-lime-400"
                  placeholder="Ej: Software Devs FC"
                />
              </div>

              {/* Capitán */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Capitán <span className="text-red-400">*</span>
                </label>
                <Input
                  value={addForm.captain}
                  onChange={(e) => setAddForm((f) => ({ ...f, captain: e.target.value }))}
                  className="rounded-xl border-zinc-200 focus:border-lime-400"
                  placeholder="Nombre del capitán"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Correo electrónico
                </label>
                <Input
                  value={addForm.email}
                  onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
                  className="rounded-xl border-zinc-200 focus:border-lime-400"
                  placeholder="correo@ejemplo.com"
                  type="email"
                />
              </div>

              {/* Teléfono */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> Teléfono
                </label>
                <Input
                  value={addForm.phone}
                  onChange={(e) => setAddForm((f) => ({ ...f, phone: e.target.value }))}
                  className="rounded-xl border-zinc-200 focus:border-lime-400"
                  placeholder="+506 0000-0000"
                />
              </div>

              {/* Estado */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Estado inicial</label>
                <div className="flex gap-2">
                  {(["active", "pending", "inactive"] as const).map((s) => {
                    const labels = { active: "Activo", pending: "Pendiente", inactive: "Inactivo" };
                    const styles = {
                      active: "border-lime-300 bg-lime-50 text-lime-700",
                      pending: "border-yellow-300 bg-yellow-50 text-yellow-700",
                      inactive: "border-zinc-300 bg-zinc-100 text-zinc-600",
                    };
                    const isSelected = addForm.status === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setAddForm((f) => ({ ...f, status: s }))}
                        className={cn(
                          "flex-1 h-9 rounded-xl text-xs font-semibold border transition-all duration-150 active:scale-95",
                          isSelected ? styles[s] : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300"
                        )}
                      >
                        {labels[s]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-1">
                <Button
                  variant="outline"
                  className="flex-1 border-zinc-200 text-zinc-600 hover:bg-zinc-50 rounded-xl"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1 bg-lime-500 hover:bg-lime-600 text-white font-semibold gap-2 shadow-md shadow-lime-500/20 rounded-xl active:scale-95 transition-all"
                  onClick={handleConfirmAddTeam}
                >
                  <UserPlus className="w-4 h-4" />
                  Agregar equipo
                </Button>
              </div>
            </div>
          </>
        </DialogContent>
      </Dialog>

      {/* ── Edit Team Modal ── */}
      <Dialog open={!!editingTeam} onOpenChange={(open) => { if (!open) setEditingTeam(null); }}>
        <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden">
          {editingTeam && (
            <>
              {/* Header */}
              <div className="bg-gradient-to-br from-lime-500 to-lime-600 px-6 pt-6 pb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Edit className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <DialogTitle className="text-white text-base leading-tight">Editar Equipo</DialogTitle>
                    <p className="text-lime-100 text-xs mt-0.5 truncate">{editingTeam.name}</p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-5 space-y-4">

                {/* Nombre del equipo */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" /> Nombre del equipo
                  </label>
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                    className="rounded-xl border-zinc-200 focus:border-lime-400"
                    placeholder="Nombre del equipo"
                  />
                </div>

                {/* Capitán */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Capitán
                  </label>
                  <Input
                    value={editForm.captain}
                    onChange={(e) => setEditForm((f) => ({ ...f, captain: e.target.value }))}
                    className="rounded-xl border-zinc-200 focus:border-lime-400"
                    placeholder="Nombre del capitán"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> Correo electrónico
                  </label>
                  <Input
                    value={editForm.email}
                    onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                    className="rounded-xl border-zinc-200 focus:border-lime-400"
                    placeholder="correo@ejemplo.com"
                    type="email"
                  />
                </div>

                {/* Teléfono */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> Teléfono
                  </label>
                  <Input
                    value={editForm.phone}
                    onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                    className="rounded-xl border-zinc-200 focus:border-lime-400"
                    placeholder="+506 0000-0000"
                  />
                </div>

                {/* Estado */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Estado</label>
                  <div className="flex gap-2">
                    {(["active", "pending", "inactive"] as const).map((s) => {
                      const labels = { active: "Activo", pending: "Pendiente", inactive: "Inactivo" };
                      const styles = {
                        active: "border-lime-300 bg-lime-50 text-lime-700",
                        pending: "border-yellow-300 bg-yellow-50 text-yellow-700",
                        inactive: "border-zinc-300 bg-zinc-100 text-zinc-600",
                      };
                      const isSelected = editForm.status === s;
                      return (
                        <button
                          key={s}
                          onClick={() => setEditForm((f) => ({ ...f, status: s }))}
                          className={cn(
                            "flex-1 h-9 rounded-xl text-xs font-semibold border transition-all duration-150 active:scale-95",
                            isSelected ? styles[s] : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300"
                          )}
                        >
                          {labels[s]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-1">
                  <Button
                    variant="outline"
                    className="flex-1 border-zinc-200 text-zinc-600 hover:bg-zinc-50 rounded-xl"
                    onClick={() => setEditingTeam(null)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="flex-1 bg-lime-500 hover:bg-lime-600 text-white font-semibold gap-2 shadow-md shadow-lime-500/20 rounded-xl active:scale-95 transition-all"
                    onClick={handleSaveEdit}
                  >
                    <Save className="w-4 h-4" />
                    Guardar cambios
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-bold text-2xl text-zinc-900">Gestión de Equipos</h1>
          <p className="text-sm text-zinc-500 mt-1">Administra todos los equipos del torneo</p>
        </div>
        <button
          onClick={handleAddTeam}
          className={cn(
            "flex items-center gap-2 px-4 h-10 rounded-xl font-semibold text-sm shadow-md transition-all duration-300 active:scale-95",
            addedState
              ? "bg-emerald-500 text-white shadow-emerald-500/25"
              : "bg-lime-500 hover:bg-lime-600 text-white shadow-lime-500/20"
          )}
        >
          {addedState ? (
            <><CheckCircle2 className="w-4 h-4" /> ¡Equipo Agregado!</>
          ) : (
            <><UserPlus className="w-4 h-4" /> Agregar Equipo</>
          )}
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-xl border-zinc-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-zinc-500">Total Equipos</p>
                <p className="text-2xl font-bold text-zinc-900 mt-1">{teamsData.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-lime-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-lime-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-zinc-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-zinc-500">Activos</p>
                <p className="text-2xl font-bold text-zinc-900 mt-1">
                  {teamsData.filter((t) => t.status === "active").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-zinc-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-zinc-500">Pendientes</p>
                <p className="text-2xl font-bold text-zinc-900 mt-1">
                  {teamsData.filter((t) => t.status === "pending").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                <Shield className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-zinc-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-zinc-500">Inactivos</p>
                <p className="text-2xl font-bold text-zinc-900 mt-1">
                  {teamsData.filter((t) => t.status === "inactive").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-zinc-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="rounded-xl border-zinc-200">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* ── Search with dynamic autocomplete ── */}
            <div className="flex-1 relative" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 z-10 pointer-events-none" />
              <Input
                placeholder="Buscar por equipo o capitán..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCommittedSearch("");
                  setShowSuggestions(true);
                }}
                onFocus={() => searchTerm.length > 0 && setShowSuggestions(true)}
                onKeyDown={handleSearchKeyDown}
                className="pl-10 pr-10 rounded-xl border-zinc-200 focus:border-lime-400 transition-colors"
                autoComplete="off"
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors z-10"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* ── Dynamic autocomplete dropdown ── */}
              <AnimatePresence>
                {showSuggestions && searchTerm.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-zinc-200 rounded-2xl shadow-xl z-50 overflow-hidden"
                  >
                    {suggestions.length > 0 ? (
                      <>
                        <div className="px-4 py-2 border-b border-zinc-100 flex items-center justify-between">
                          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                            {suggestions.length} resultado{suggestions.length !== 1 ? "s" : ""}
                          </span>
                          <span className="text-xs text-zinc-400">↵ para filtrar</span>
                        </div>
                        {suggestions.map((team, idx) => (
                          <motion.button
                            key={team.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.04 }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-lime-50 transition-colors text-left group border-b border-zinc-50 last:border-0"
                            onMouseDown={() => handleSuggestionClick(team.name)}
                          >
                            <div className="w-9 h-9 rounded-xl bg-lime-100 flex items-center justify-center flex-shrink-0 group-hover:bg-lime-500 transition-all duration-200 shadow-sm">
                              <Shield className="w-4 h-4 text-lime-600 group-hover:text-white transition-colors" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-zinc-900 truncate">
                                <Highlight text={team.name} query={searchTerm} />
                              </p>
                              <p className="text-xs text-zinc-500 truncate">
                                Cap: <Highlight text={team.captain} query={searchTerm} />
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {getStatusBadge(team.status)}
                              <span className="text-xs text-lime-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                Seleccionar →
                              </span>
                            </div>
                          </motion.button>
                        ))}
                      </>
                    ) : (
                      <div className="px-4 py-5 text-center">
                        <Search className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                        <p className="text-sm text-zinc-500">No se encontraron equipos</p>
                        <p className="text-xs text-zinc-400 mt-0.5">Intenta con otro nombre o capitán</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Filter buttons */}
            <div className="flex gap-2 flex-wrap">
              {(["all", "active", "pending", "inactive"] as const).map((status) => {
                const labels = { all: "Todos", active: "Activos", pending: "Pendientes", inactive: "Inactivos" };
                const active = filterStatus === status;
                return (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={cn(
                      "h-10 px-4 rounded-xl text-sm font-semibold border transition-all duration-200 active:scale-95",
                      active
                        ? "bg-lime-500 text-white border-lime-500 shadow-md shadow-lime-500/20"
                        : "bg-white text-zinc-600 border-zinc-200 hover:border-lime-300 hover:bg-lime-50 hover:text-lime-700"
                    )}
                  >
                    {labels[status]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active search indicator */}
          <AnimatePresence>
            {(committedSearch || searchTerm) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 pt-3 border-t border-zinc-100"
              >
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-zinc-500">Mostrando resultados para:</span>
                  <span className="inline-flex items-center gap-1.5 bg-lime-100 text-lime-700 rounded-lg px-3 py-1 font-semibold">
                    "{committedSearch || searchTerm}"
                    <button onClick={handleClearSearch} className="hover:text-lime-900 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                  <span className="text-zinc-400 text-xs">({filteredTeams.length} equipo{filteredTeams.length !== 1 ? "s" : ""})</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Teams List */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredTeams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ delay: index * 0.04, duration: 0.2 }}
            >
              <Card className="rounded-xl border-zinc-200 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Team Info */}
                    <div className="flex-1 flex items-start gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-lime-400 to-lime-600 flex items-center justify-center shadow-md shadow-lime-500/20 flex-shrink-0">
                        <Shield className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-lg text-zinc-900">{team.name}</h3>
                          {getStatusBadge(team.status)}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-sm text-zinc-500">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{team.captain}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            <span>{team.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            <span>{team.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-6 lg:gap-8">
                      <div className="text-center">
                        <p className="text-xs font-medium text-zinc-500">Jugadores</p>
                        <p className="text-lg font-bold text-zinc-900 mt-1">{team.players}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-medium text-zinc-500">Puntos</p>
                        <p className="text-lg font-bold text-lime-600 mt-1">{team.points}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-medium text-zinc-500">V-E-D</p>
                        <p className="text-lg font-bold text-zinc-900 mt-1">
                          {team.wins}-{team.draws}-{team.losses}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 lg:flex-col lg:w-auto">
                      <button
                        onClick={() => handleEdit(team.id, team.name)}
                        className={cn(
                          "flex-1 lg:flex-none flex items-center justify-center gap-2 h-9 px-4 rounded-xl text-sm font-semibold border transition-all duration-200 active:scale-95",
                          editedIds.has(team.id)
                            ? "bg-lime-50 border-lime-300 text-lime-700"
                            : "bg-white border-zinc-200 text-zinc-700 hover:bg-lime-50 hover:border-lime-200 hover:text-lime-700"
                        )}
                      >
                        {editedIds.has(team.id) ? (
                          <><CheckCircle2 className="w-3.5 h-3.5" /> Editando...</>
                        ) : (
                          <><Edit className="w-3.5 h-3.5" /> Editar</>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setDeletedIds((prev) => new Set(prev).add(team.id));
                          toast.error("Equipo eliminado", { description: team.name });
                        }}
                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 h-9 px-4 rounded-xl text-sm font-semibold border border-red-200 text-red-600 bg-white hover:bg-red-50 hover:border-red-300 active:scale-95 transition-all duration-200"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredTeams.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="rounded-xl border-zinc-200">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                <p className="text-zinc-500 font-medium">No se encontraron equipos</p>
                <p className="text-sm text-zinc-400 mt-1">Intenta cambiar el término de búsqueda o los filtros</p>
                <button
                  onClick={handleClearSearch}
                  className="mt-4 h-9 px-5 rounded-xl bg-lime-500 hover:bg-lime-600 text-white text-sm font-semibold active:scale-95 transition-all duration-200 shadow-md shadow-lime-500/20"
                >
                  Limpiar búsqueda
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}