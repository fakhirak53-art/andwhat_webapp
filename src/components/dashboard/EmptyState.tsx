import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { marketingTheme } from "@/lib/marketing-theme";

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
      className={[
        "text-center border-dashed border-2",
        marketingTheme.borderSubtle,
      ].join(" ")}
    >
      <div className="text-gray-400 flex justify-center mb-3 text-4xl">
        {icon}
      </div>
      <h3
        className={["font-serif text-lg mt-2", marketingTheme.textHeading].join(
          " ",
        )}
      >
        {title}
      </h3>
      <p
        className={[
          "text-sm mt-1 max-w-xs mx-auto",
          marketingTheme.textMuted,
        ].join(" ")}
      >
        {description}
      </p>
      {action ? <div className="mt-4">{action}</div> : null}
    </Card>
  );
}
