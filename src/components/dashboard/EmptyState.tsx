import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Card
      padding="lg"
      className="text-center border-dashed border-2 border-border"
    >
      <div className="text-muted/40 flex justify-center mb-3 text-4xl">
        {icon}
      </div>
      <h3 className="font-serif text-lg text-ink mt-2">{title}</h3>
      <p className="text-muted text-sm mt-1 max-w-xs mx-auto">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </Card>
  );
}
