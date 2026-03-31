import { Card } from "@/components/ui/Card";
import { marketingTheme } from "@/lib/marketing-theme";

interface StatCardProps {
  label: string;
  value: string | number;
  description: string;
  valueClassName?: string;
}

export default function StatCard({
  label,
  value,
  description,
  valueClassName = marketingTheme.textHeading,
}: StatCardProps) {
  return (
    <Card className="h-full">
      <p
        className={[
          "text-xs uppercase tracking-widest",
          marketingTheme.textMuted,
        ].join(" ")}
      >
        {label}
      </p>
      <p className={["font-serif text-4xl mt-2", valueClassName].join(" ")}>
        {value}
      </p>
      <p className={["text-xs mt-1", marketingTheme.textMuted].join(" ")}>
        {description}
      </p>
    </Card>
  );
}
