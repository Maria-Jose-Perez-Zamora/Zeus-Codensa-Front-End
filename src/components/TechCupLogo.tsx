/**
 * TechCupLogo — Imagen oficial del logo recortada al círculo
 * + texto "TECHCUP / FÚTBOL 7" en HTML a la derecha (según variante).
 */

import logoImg from "../../assets/d79394430369ca833b9e37547189c2ac411875a8.png";

export interface TechCupLogoProps {
  variant?: "icon" | "navbar" | "navbar-full" | "hero" | "hero-dark";
  size?: number;
  className?: string;
}

/** Diámetro del círculo según variante */
const defaultSizes: Record<NonNullable<TechCupLogoProps["variant"]>, number> = {
  icon:          36,
  navbar:        38,
  "navbar-full": 42,
  hero:          100,
  "hero-dark":   110,
};

/** Círculo recortado con la imagen del logo */
function LogoCircle({ diameter }: { diameter: number }) {
  return (
    <div
      style={{
        width:        diameter,
        height:       diameter,
        borderRadius: "50%",
        overflow:     "hidden",
        flexShrink:   0,
        display:      "flex",
        alignItems:   "center",
        justifyContent: "center",
        background:   "#000",
      }}
    >
      <img
        src={logoImg}
        alt="TECHCUP Fútbol"
        draggable={false}
        style={{
          /* La imagen ya tiene el logo circular centrado, escalamos para que llene */
          width:      "100%",
          height:     "100%",
          objectFit:  "cover",
          objectPosition: "center center",
          display:    "block",
          userSelect: "none",
        }}
      />
    </div>
  );
}

export function TechCupLogo({
  variant = "navbar",
  size,
  className = "",
}: TechCupLogoProps) {
  const diameter = size ?? defaultSizes[variant];

  /* ── Solo el círculo ── */
  if (variant === "icon") {
    return (
      <span
        className={`inline-flex items-center justify-center ${className}`}
        role="img"
        aria-label="TechCup Fútbol"
      >
        <LogoCircle diameter={diameter} />
      </span>
    );
  }

  /* ── Navbar compacta ── */
  if (variant === "navbar") {
    return (
      <div
        className={`flex items-center gap-2 ${className}`}
        role="banner"
        aria-label="TechCup Fútbol"
      >
        <LogoCircle diameter={diameter} />
        <span
          className="font-black tracking-tight text-zinc-900 leading-none select-none"
          style={{ fontSize: 16 }}
        >
          TECH<span className="text-lime-500">CUP</span>
        </span>
      </div>
    );
  }

  /* ── Navbar completa (con subtítulo "FÚTBOL 7") ── */
  if (variant === "navbar-full") {
    return (
      <div
        className={`flex items-center gap-2.5 ${className}`}
        role="banner"
        aria-label="TechCup Fútbol"
      >
        <LogoCircle diameter={diameter} />
        <div className="flex flex-col leading-none select-none">
          <span
            className="font-black tracking-tight text-zinc-900"
            style={{ fontSize: 16 }}
          >
            TECH<span className="text-lime-500">CUP</span>
          </span>
          <span
            className="text-zinc-500 tracking-widest uppercase font-semibold hidden sm:block"
            style={{ fontSize: 9, marginTop: 3 }}
          >
            Fútbol 7
          </span>
        </div>
      </div>
    );
  }

  /* ── Hero sobre fondo claro ── */
  if (variant === "hero") {
    return (
      <div
        className={`flex items-center gap-4 ${className}`}
        role="banner"
        aria-label="TechCup Fútbol"
      >
        <LogoCircle diameter={diameter} />
        <div className="flex flex-col leading-none select-none">
          <span
            className="font-black tracking-tight text-white drop-shadow"
            style={{ fontSize: 46 }}
          >
            TECH<span className="text-lime-300">CUP</span>
          </span>
          <span
            className="text-white/70 tracking-widest uppercase font-semibold"
            style={{ fontSize: 13, marginTop: 4 }}
          >
            Fútbol 7
          </span>
        </div>
      </div>
    );
  }

  /* ── Hero sobre fondo oscuro ── */
  /* variant === "hero-dark" */
  return (
    <div
      className={`flex items-center gap-4 ${className}`}
      role="banner"
      aria-label="TechCup Fútbol"
    >
      <LogoCircle diameter={diameter} />
      <div className="flex flex-col leading-none select-none">
        <span
          className="font-black tracking-tight text-white drop-shadow"
          style={{ fontSize: 46 }}
        >
          TECH<span className="text-lime-400">CUP</span>
        </span>
        <span
          className="text-white/60 tracking-widest uppercase font-semibold"
          style={{ fontSize: 13, marginTop: 4 }}
        >
          Fútbol 7
        </span>
      </div>
    </div>
  );
}

/* ── Favicon: URL de la imagen PNG para inyectar en <head> ── */
export const techcupFaviconSvg: string = logoImg;