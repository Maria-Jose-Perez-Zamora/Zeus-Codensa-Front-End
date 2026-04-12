import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  loadingText?: string;
  successText?: string;
  successDuration?: number;
  onAsyncClick?: () => Promise<void>;
  className?: string;
  icon?: React.ReactNode;
}

export function LoadingButton({
  children,
  variant = "default",
  size = "default",
  loadingText = "Procesando...",
  successText = "Solicitud enviada",
  successDuration = 2000,
  onAsyncClick,
  className,
  icon,
  onClick,
  disabled,
  ...props
}: LoadingButtonProps) {
  const [state, setState] = useState<"idle" | "loading" | "success">("idle");

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onAsyncClick) {
      setState("loading");
      try {
        await onAsyncClick();
        setState("success");
        setTimeout(() => setState("idle"), successDuration);
      } catch (error) {
        setState("idle");
      }
    } else if (onClick) {
      onClick(e);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "transition-all",
        state === "success" && "bg-lime-500 hover:bg-lime-500 border-lime-500",
        className
      )}
      disabled={disabled || state === "loading" || state === "success"}
      onClick={handleClick}
      {...props}
    >
      {state === "loading" && (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          {loadingText}
        </>
      )}
      {state === "success" && (
        <>
          <CheckCircle2 className="w-4 h-4 mr-2" />
          {successText}
        </>
      )}
      {state === "idle" && (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </Button>
  );
}
