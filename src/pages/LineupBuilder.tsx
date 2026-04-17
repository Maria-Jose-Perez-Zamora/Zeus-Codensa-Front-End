import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Save, RotateCcw, ChevronRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { LoadingButton } from "../components/LoadingButton";
import { getMyTeam, MyTeamPlayer, MyTeamResponse } from "../services/teams/teams.service";
import { useEffect } from "react";

const ItemTypes = { PLAYER: "player" };

interface Player {
  id: string;
  name: string;
  number: number;
  position: string;          // Posición principal
  secondaryPosition?: string; // Posición secundaria
  avatar: string;
}

const initialPlayers: Player[] = [];

// Formations for Fútbol 7 (always 7 players total: 1 GK + outfield)
const formations: Record<string, { label: string; positions: { id: string; x: number; y: number; label: string; row: string }[] }> = {
  "3-2-1": {
    label: "3-2-1",
    positions: [
      { id: "pos-gk",    x: 50, y: 87, label: "POR", row: "GK" },
      { id: "pos-def-l", x: 20, y: 67, label: "DEF", row: "DEF" },
      { id: "pos-def-c", x: 50, y: 67, label: "DEF", row: "DEF" },
      { id: "pos-def-r", x: 80, y: 67, label: "DEF", row: "DEF" },
      { id: "pos-mid-l", x: 30, y: 42, label: "MED", row: "MID" },
      { id: "pos-mid-r", x: 70, y: 42, label: "MED", row: "MID" },
      { id: "pos-fwd",   x: 50, y: 18, label: "DEL", row: "FWD" },
    ],
  },
  "2-3-1": {
    label: "2-3-1",
    positions: [
      { id: "pos-gk",    x: 50, y: 87, label: "POR", row: "GK" },
      { id: "pos-def-l", x: 30, y: 67, label: "DEF", row: "DEF" },
      { id: "pos-def-r", x: 70, y: 67, label: "DEF", row: "DEF" },
      { id: "pos-mid-l", x: 18, y: 44, label: "MED", row: "MID" },
      { id: "pos-mid-c", x: 50, y: 44, label: "MED", row: "MID" },
      { id: "pos-mid-r", x: 82, y: 44, label: "MED", row: "MID" },
      { id: "pos-fwd",   x: 50, y: 18, label: "DEL", row: "FWD" },
    ],
  },
  "2-2-2": {
    label: "2-2-2",
    positions: [
      { id: "pos-gk",    x: 50, y: 87, label: "POR", row: "GK" },
      { id: "pos-def-l", x: 30, y: 68, label: "DEF", row: "DEF" },
      { id: "pos-def-r", x: 70, y: 68, label: "DEF", row: "DEF" },
      { id: "pos-mid-l", x: 30, y: 44, label: "MED", row: "MID" },
      { id: "pos-mid-r", x: 70, y: 44, label: "MED", row: "MID" },
      { id: "pos-fwd-l", x: 30, y: 20, label: "DEL", row: "FWD" },
      { id: "pos-fwd-r", x: 70, y: 20, label: "DEL", row: "FWD" },
    ],
  },
  "1-3-2": {
    label: "1-3-2",
    positions: [
      { id: "pos-gk",    x: 50, y: 87, label: "POR", row: "GK" },
      { id: "pos-def",   x: 50, y: 68, label: "DEF", row: "DEF" },
      { id: "pos-mid-l", x: 20, y: 46, label: "MED", row: "MID" },
      { id: "pos-mid-c", x: 50, y: 46, label: "MED", row: "MID" },
      { id: "pos-mid-r", x: 80, y: 46, label: "MED", row: "MID" },
      { id: "pos-fwd-l", x: 33, y: 20, label: "DEL", row: "FWD" },
      { id: "pos-fwd-r", x: 67, y: 20, label: "DEL", row: "FWD" },
    ],
  },
};

const positionColors: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  POR: { bg: "bg-amber-400",  text: "text-amber-950", border: "border-amber-500", glow: "shadow-amber-400/50" },
  DEF: { bg: "bg-blue-500",   text: "text-white",      border: "border-blue-600",  glow: "shadow-blue-400/50" },
  MED: { bg: "bg-lime-500",   text: "text-white",      border: "border-lime-600",  glow: "shadow-lime-400/50" },
  DEL: { bg: "bg-red-500",    text: "text-white",      border: "border-red-600",   glow: "shadow-red-400/50" },
};

function getPositionStyle(pos: string) {
  return positionColors[pos] ?? { bg: "bg-zinc-500", text: "text-white", border: "border-zinc-600", glow: "shadow-zinc-400/50" };
}

/** Comprueba si un jugador puede jugar en una posición del campo */
function canPlayPosition(player: Player, positionLabel: string): boolean {
  return player.position === positionLabel || player.secondaryPosition === positionLabel;
}

// ─── Draggable player on the FIELD ──────────────────────────────────────────
function FieldPlayer({ player }: { player: Player }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PLAYER,
    item: { player, source: "field" },
    collect: (m) => ({ isDragging: !!m.isDragging() }),
  }));

  const style = getPositionStyle(player.position);

  return (
    <div
      ref={drag as any}
      className={cn(
        "flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing select-none transition-all duration-200 group",
        isDragging ? "opacity-40 scale-90" : "opacity-100 hover:scale-110"
      )}
    >
      {/* Jersey shape */}
      <div className={cn("relative w-12 h-12 flex items-center justify-center rounded-xl shadow-lg", style.bg, "shadow-md", style.glow)}>
        <svg viewBox="0 0 40 40" className="absolute inset-0 w-full h-full opacity-20" fill="white">
          <path d="M8 6 L13 6 Q20 12 27 6 L32 6 L38 14 L31 20 L27 16 L27 36 L13 36 L13 16 L9 20 L2 14 Z" />
        </svg>
        <span className={cn("relative z-10 font-black text-lg", style.text)}>{player.number}</span>
      </div>
      {/* Name tag */}
      <div className="bg-white/95 backdrop-blur border border-white/60 rounded-full px-2 py-0.5 shadow-sm">
        <span className="text-[9px] font-bold text-zinc-800 uppercase tracking-wider whitespace-nowrap">{player.name}</span>
      </div>
      {/* Position badges */}
      <div className="flex gap-0.5">
        <span className={cn("text-[8px] font-black px-1 py-0.5 rounded uppercase", style.bg, style.text)}>
          {player.position}
        </span>
        {player.secondaryPosition && (
          <span className={cn("text-[8px] font-bold px-1 py-0.5 rounded uppercase opacity-70",
            getPositionStyle(player.secondaryPosition).bg,
            getPositionStyle(player.secondaryPosition).text
          )}>
            {player.secondaryPosition}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Drop zone on the field ──────────────────────────────────────────────────
function DropZone({
  position,
  player,
  onDrop,
  isDraggingAny,
}: {
  position: { id: string; x: number; y: number; label: string };
  player?: Player;
  onDrop: (item: any) => void;
  isDraggingAny: boolean;
}) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.PLAYER,
    canDrop: (item: any) => {
      // Si hay un jugador ya en esta posición y es el mismo que se arrastra, permitir
      if (player && player.id === item.player.id) return true;
      return canPlayPosition(item.player, position.label);
    },
    drop: (item: any) => onDrop({ item, targetId: position.id }),
    collect: (m) => ({
      isOver: !!m.isOver(),
      canDrop: !!m.canDrop(),
    }),
  }));

  // Estados visuales del drop zone vacío
  const getEmptyZoneStyle = () => {
    if (!isDraggingAny) {
      return "border-white/40 bg-white/10 hover:bg-white/20";
    }
    if (isOver && canDrop) {
      return "border-lime-400 bg-lime-400/30 scale-125 shadow-[0_0_20px_rgba(132,204,22,0.8)]";
    }
    if (isOver && !canDrop) {
      return "border-red-400 bg-red-500/30 scale-110 shadow-[0_0_16px_rgba(239,68,68,0.6)]";
    }
    if (canDrop) {
      return "border-lime-300/80 bg-lime-400/15 scale-105 animate-pulse";
    }
    // No puede recibir este jugador
    return "border-white/20 bg-white/5 opacity-50";
  };

  return (
    <div
      ref={drop as any}
      className="absolute z-20 flex flex-col items-center justify-center"
      style={{ left: `${position.x}%`, top: `${position.y}%`, transform: "translate(-50%, -50%)" }}
    >
      {player ? (
        <FieldPlayer player={player} />
      ) : (
        <div className={cn(
          "w-12 h-12 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-200",
          getEmptyZoneStyle()
        )}>
          <span className="text-[10px] font-bold text-white/80 drop-shadow">{position.label}</span>
          {isOver && !canDrop && (
            <span className="text-[7px] font-bold text-red-300 mt-0.5">✗</span>
          )}
          {isOver && canDrop && (
            <span className="text-[7px] font-bold text-lime-300 mt-0.5">✓</span>
          )}
        </div>
      )}
      {/* Overlay when occupied and dragging over with invalid player */}
      {player && isOver && !canDrop && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-red-500/40 border-2 border-red-400 pointer-events-none z-30">
          <span className="text-white font-black text-lg drop-shadow">✗</span>
        </div>
      )}
      {/* Overlay when occupied and dragging over with valid player */}
      {player && isOver && canDrop && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-lime-500/40 border-2 border-lime-400 pointer-events-none z-30">
          <span className="text-white font-black text-lg drop-shadow">✓</span>
        </div>
      )}
    </div>
  );
}

// ─── Bench player card ───────────────────────────────────────────────────────
function BenchPlayer({ player }: { player: Player }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PLAYER,
    item: { player, source: "bench" },
    collect: (m) => ({ isDragging: !!m.isDragging() }),
  }));

  const style = getPositionStyle(player.position);
  const secStyle = player.secondaryPosition ? getPositionStyle(player.secondaryPosition) : null;

  return (
    <div
      ref={drag as any}
      className={cn(
        "flex items-center gap-3 p-2.5 bg-white rounded-xl border border-zinc-200 hover:border-lime-300 hover:bg-lime-50/40 cursor-grab active:cursor-grabbing transition-all duration-150 shadow-sm hover:shadow-md group",
        isDragging ? "opacity-40" : "opacity-100"
      )}
    >
      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-black text-sm shadow-sm", style.bg)}>
        <span className={style.text}>{player.number}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-zinc-900 truncate">{player.name}</p>
        {/* Posiciones */}
        <div className="flex items-center gap-1 mt-0.5">
          {/* Posición principal */}
          <span className={cn(
            "text-[10px] font-black px-1.5 py-0.5 rounded uppercase",
            style.bg, style.text
          )}>
            {player.position}
          </span>
          {/* Posición secundaria */}
          {player.secondaryPosition && secStyle && (
            <>
              <span className="text-[9px] text-zinc-400">·</span>
              <span className={cn(
                "text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase opacity-75",
                secStyle.bg, secStyle.text
              )}>
                {player.secondaryPosition}
              </span>
            </>
          )}
        </div>
      </div>
      <div className={cn("w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0", style.bg, "opacity-70")}>
        <ChevronRight className={cn("w-3 h-3", style.text)} />
      </div>
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────
export function LineupBuilder() {
  return (
    <DndProvider backend={HTML5Backend}>
      <LineupBuilderContent />
    </DndProvider>
  );
}

function LineupBuilderContent() {
  const [bench, setBench] = useState<Player[]>([]);
  const [field, setField] = useState<Record<string, Player>>({});
  const [formation, setFormation] = useState<string>("3-2-1");
  const [isDraggingAny, setIsDraggingAny] = useState(false);
  const [teamInfo, setTeamInfo] = useState<MyTeamResponse | null>(null);

  useEffect(() => {
    getMyTeam().then((data) => {
      if (data && data.players) {
        setTeamInfo(data);
        const mappedPlayers = data.players.map((p, idx) => ({
          id: p.id,
          name: p.name,
          number: p.number ?? (idx + 1),
          position: p.position ?? "MED",
          avatar: "https://images.unsplash.com/photo-1752614654887-0b8d59c076b0?w=100&q=80",
        }));
        setBench(mappedPlayers);
      }
    }).catch(console.error);
  }, []);

  const fieldPositions = formations[formation].positions;
  const playersOnField = Object.keys(field).length;

  // ── Drop to field ──
  const handleDropToField = ({ item, targetId }: { item: any; targetId: string }) => {
    const droppedPlayer: Player = item.player;

    // Validar posición antes de proceder (doble validación)
    const targetPos = fieldPositions.find((p) => p.id === targetId);
    if (targetPos && !canPlayPosition(droppedPlayer, targetPos.label)) {
      toast.error("Posición no permitida", {
        description: `${droppedPlayer.name} no puede jugar de ${targetPos.label}. Su posición es ${droppedPlayer.position}${droppedPlayer.secondaryPosition ? ` o ${droppedPlayer.secondaryPosition}` : ""}.`,
        duration: 3500,
      });
      return;
    }

    setField((prev) => {
      const newField = { ...prev };
      // If target occupied, send displaced player back to bench
      if (newField[targetId]) {
        setBench((b) =>
          [...b, newField[targetId]].filter((p, i, arr) => arr.findIndex((t) => t.id === p.id) === i)
        );
      }
      // Remove from old field position if dragged from field
      if (item.source === "field") {
        const old = Object.keys(newField).find((k) => newField[k].id === droppedPlayer.id);
        if (old) delete newField[old];
      }
      newField[targetId] = droppedPlayer;
      return newField;
    });

    if (item.source === "bench") {
      setBench((prev) => prev.filter((p) => p.id !== droppedPlayer.id));
    }
  };

  // ── Drop to bench ──
  const handleDropToBench = (item: any) => {
    if (item.source === "field") {
      setField((prev) => {
        const newField = { ...prev };
        const old = Object.keys(newField).find((k) => newField[k].id === item.player.id);
        if (old) delete newField[old];
        return newField;
      });
      setBench((prev) => [...prev, item.player].sort((a, b) => a.number - b.number));
    }
  };

  const [{ isOverBench }, benchDrop] = useDrop(() => ({
    accept: ItemTypes.PLAYER,
    drop: (item: any) => handleDropToBench(item),
    collect: (m) => ({ isOverBench: !!m.isOver() }),
  }));

  // Track global drag state for visual hints
  const [, globalDrop] = useDrop(() => ({
    accept: ItemTypes.PLAYER,
    collect: (m) => {
      const dragging = m.canDrop();
      setIsDraggingAny(dragging);
      return {};
    },
  }));

  // ── Change formation – clear field when switching ──
  const handleFormationChange = (f: string) => {
    const fieldPlayers = Object.values(field);
    setBench((prev) => [...prev, ...fieldPlayers].sort((a, b) => a.number - b.number));
    setField({});
    setFormation(f);
  };

  // ── Reset ──
  const handleReset = () => {
    if (teamInfo && teamInfo.players) {
      setBench(teamInfo.players.map((p, idx) => ({
        id: p.id,
        name: p.name,
        number: p.number ?? (idx + 1),
        position: p.position ?? "MED",
        avatar: "https://images.unsplash.com/photo-1752614654887-0b8d59c076b0?w=100&q=80",
      })));
    } else {
      setBench([]);
    }
    setField({});
  };

  // ── Save ──
  const handleSave = async () => {
    if (playersOnField < 7) {
      toast.error("Formación incompleta", {
        description: `Necesitas 7 jugadores en el campo. Tienes ${playersOnField}/7.`,
        duration: 3000,
      });
      throw new Error("Incompleta");
    }
    await new Promise((r) => setTimeout(r, 1500));
    toast.success("¡Formación guardada!", {
      description: "Tu alineación fue registrada exitosamente.",
      duration: 3000,
    });
  };

  // Progress color
  const progressColor = playersOnField === 7 ? "bg-lime-500" : playersOnField >= 4 ? "bg-amber-400" : "bg-zinc-300";

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500" ref={globalDrop as any}>
      
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Creador de Alineación</h1>
          <p className="text-zinc-500 mt-1">Arrastra jugadores desde la banca hacia el campo (Fútbol 7)</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            className="gap-2 border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 active:scale-95 transition-all"
            onClick={handleReset}
          >
            <RotateCcw className="w-4 h-4" /> Restablecer
          </Button>
          <LoadingButton
            className="gap-2 bg-lime-500 hover:bg-lime-600 text-white font-semibold shadow-md shadow-lime-500/20 active:scale-95"
            icon={<Save className="w-4 h-4" />}
            loadingText="Guardando..."
            successText="¡Guardada!"
            onAsyncClick={handleSave}
          >
            Guardar Formación
          </LoadingButton>
        </div>
      </div>

      {/* ── Position restriction notice ── */}
      <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 text-sm text-blue-700">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>
          Cada jugador solo puede ocupar su <strong>posición principal</strong> o su <strong>posición secundaria</strong>.
          Las zonas <span className="text-lime-700 font-semibold">verdes</span> son compatibles; las <span className="text-red-600 font-semibold">rojas</span> están bloqueadas.
        </span>
      </div>

      {/* ── Formation Selector + Progress ── */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Formation tabs */}
        <div className="flex gap-1 bg-zinc-100 rounded-xl p-1">
          {Object.keys(formations).map((f) => (
            <button
              key={f}
              onClick={() => handleFormationChange(f)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200",
                formation === f
                  ? "bg-white text-lime-700 shadow-sm border border-zinc-200"
                  : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              {formations[f].label}
            </button>
          ))}
        </div>

        {/* Player counter */}
        <div className="flex items-center gap-3 bg-white border border-zinc-200 rounded-xl px-4 py-2 shadow-sm">
          <div className="flex gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  i < playersOnField ? progressColor : "bg-zinc-200"
                )}
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-zinc-700">
            <span className={playersOnField === 7 ? "text-lime-600" : "text-zinc-900"}>{playersOnField}</span>
            <span className="text-zinc-400">/7</span>
          </span>
          {playersOnField === 7 && (
            <Badge className="bg-lime-100 text-lime-700 border-lime-300 text-xs">¡Completa!</Badge>
          )}
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5" style={{ minHeight: "540px" }}>
        
        {/* ── Field ── */}
        <div
          className="lg:col-span-3 relative rounded-2xl overflow-hidden border-2 border-zinc-800 shadow-xl"
          style={{
            background: "linear-gradient(180deg, #0a7a2e 0%, #0d8f35 25%, #0a7a2e 50%, #0d8f35 75%, #0a7a2e 100%)",
            minHeight: "480px",
          }}
        >
          {/* Field lines */}
          <div className="absolute inset-5 pointer-events-none">
            <div className="absolute inset-0 border-2 border-white/60 rounded" />
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/60 -translate-y-1/2" />
            <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-white/60 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/60 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/5 h-[17%] border-2 border-t-0 border-white/60" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/5 h-[17%] border-2 border-b-0 border-white/60" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/5 h-[6%] border-2 border-t-0 border-white/60" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/5 h-[6%] border-2 border-b-0 border-white/60" />
          </div>

          {/* Formation label */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30">
            <Badge className="bg-black/50 backdrop-blur text-white border-white/20 font-mono text-xs px-3">
              {formations[formation].label}
            </Badge>
          </div>

          {/* Drop zones */}
          {fieldPositions.map((pos) => (
            <DropZone
              key={pos.id}
              position={pos}
              player={field[pos.id]}
              onDrop={handleDropToField}
              isDraggingAny={isDraggingAny}
            />
          ))}

          {/* Empty field hint */}
          {playersOnField === 0 && !isDraggingAny && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="text-center bg-black/25 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/10">
                <Users className="w-8 h-8 text-white/60 mx-auto mb-2" />
                <p className="text-white/80 text-sm font-medium">Arrastra jugadores aquí</p>
                <p className="text-white/50 text-xs mt-1">Respetando su posición principal o secundaria</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Bench sidebar ── */}
        <div className="flex flex-col gap-3">
          {/* Legend */}
          <div className="grid grid-cols-2 gap-1.5">
            {Object.entries(positionColors).map(([pos, style]) => (
              <div key={pos} className={cn("flex items-center gap-1.5 px-2 py-1 rounded-lg", style.bg, "bg-opacity-15")}>
                <div className={cn("w-3 h-3 rounded-sm flex-shrink-0", style.bg)} />
                <span className="text-xs font-semibold text-zinc-700">{pos}</span>
              </div>
            ))}
          </div>

          {/* Bench drop area */}
          <div
            className="flex-1 flex flex-col bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden"
            style={{ minHeight: "380px" }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 bg-zinc-50">
              <h3 className="font-semibold text-zinc-900 text-sm">Banca / Plantilla</h3>
              <Badge variant="secondary" className="bg-zinc-200 text-zinc-700 text-xs">{bench.length}</Badge>
            </div>

            <div
              ref={benchDrop as any}
              className={cn(
                "flex-1 p-3 space-y-2 overflow-y-auto transition-colors",
                isOverBench ? "bg-lime-50 border-2 border-dashed border-lime-300 rounded-b-2xl" : ""
              )}
            >
              {bench.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-12 h-12 rounded-xl bg-lime-100 flex items-center justify-center mb-3">
                    <Users className="w-6 h-6 text-lime-500" />
                  </div>
                  <p className="text-sm font-medium text-zinc-500">¡Todos en el campo!</p>
                  <p className="text-xs text-zinc-400 mt-1">Arrastra de vuelta para cambiar</p>
                </div>
              ) : (
                bench.map((player) => <BenchPlayer key={player.id} player={player} />)
              )}
            </div>
          </div>

          {/* Position key */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 space-y-1.5">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Posiciones</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-lime-500 flex-shrink-0" />
                <span className="text-xs text-zinc-600"><strong>Principal</strong> – posición natural</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-400 flex-shrink-0" />
                <span className="text-xs text-zinc-600"><strong>Secundaria</strong> – puede jugar aquí</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
