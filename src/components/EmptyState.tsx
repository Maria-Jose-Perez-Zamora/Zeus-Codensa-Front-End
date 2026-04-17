import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <Card className="border-zinc-200 bg-white shadow-md">
      <CardContent className="py-16 px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-4">
          <Icon className="w-8 h-8 text-zinc-400" />
        </div>
        <h3 className="text-xl font-semibold text-zinc-900 mb-2">{title}</h3>
        <p className="text-zinc-600 max-w-md mx-auto mb-6">{description}</p>
        {actionLabel && onAction && (
          <Button 
            onClick={onAction}
            className="bg-lime-500 hover:bg-lime-600 text-white font-semibold"
          >
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
