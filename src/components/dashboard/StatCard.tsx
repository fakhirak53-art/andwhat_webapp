import { Card } from "@/components/ui/Card";

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
  valueClassName = "text-ink",
}: StatCardProps) {
  return (
    <Card className="h-full">
      <p className="text-xs uppercase tracking-widest text-muted">{label}</p>
      <p className={["font-serif text-4xl mt-2", valueClassName].join(" ")}>
        {value}
      </p>
      <p className="text-muted text-xs mt-1">{description}</p>
    </Card>
  );
}
