"use client";

import { BookOpen } from "lucide-react";
import { useMemo, useState } from "react";
import ActivityFilters, {
  type ActivityFilterValue,
} from "@/components/dashboard/ActivityFilters";
import EmptyState from "@/components/dashboard/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatDateTime, formatRelativeTime } from "@/lib/utils";
import type { QuestionLog } from "@/types/database";

interface ActivityTableProps {
  logs: QuestionLog[];
}

const PAGE_SIZE = 20;

export default function ActivityTable({ logs }: ActivityTableProps) {
  const [filter, setFilter] = useState<ActivityFilterValue>("all");
  const [page, setPage] = useState(1);

  const filteredLogs = useMemo(() => {
    if (filter === "correct") return logs.filter((log) => log.is_correct);
    if (filter === "incorrect") return logs.filter((log) => !log.is_correct);
    return logs;
  }, [filter, logs]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageLogs = filteredLogs.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function handleFilterChange(nextFilter: ActivityFilterValue): void {
    setFilter(nextFilter);
    setPage(1);
  }

  if (logs.length === 0) {
    return (
      <EmptyState
        icon={<BookOpen className="w-10 h-10" />}
        title="No activity yet"
        description="Your quiz answers will appear here once you start answering questions."
      />
    );
  }

  return (
    <div className="space-y-4">
      <ActivityFilters value={filter} onChange={handleFilterChange} />

      {pageLogs.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-10 h-10" />}
          title="No results for this filter"
          description="Try a different filter to see more of your activity."
        />
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto border border-border rounded-lg bg-cream">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-xs text-muted uppercase tracking-widest font-medium">
                    Date/Time
                  </th>
                  <th className="px-4 py-3 text-xs text-muted uppercase tracking-widest font-medium">
                    Subject
                  </th>
                  <th className="px-4 py-3 text-xs text-muted uppercase tracking-widest font-medium">
                    Question Set
                  </th>
                  <th className="px-4 py-3 text-xs text-muted uppercase tracking-widest font-medium">
                    Site
                  </th>
                  <th className="px-4 py-3 text-xs text-muted uppercase tracking-widest font-medium">
                    Result
                  </th>
                  <th className="px-4 py-3 text-xs text-muted uppercase tracking-widest font-medium">
                    Response time
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="px-4 py-3 text-sm text-ink">
                      {formatDateTime(log.answered_at)}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-ink">
                      {log.subjects?.name ?? "Unknown subject"}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted truncate max-w-xs">
                      {log.question_sets?.set_name ?? "Unknown set"}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted/60 italic">
                      {log.blocked_site ? `via ${log.blocked_site}` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={log.is_correct ? "lime" : "default"}>
                        {log.is_correct ? "Correct" : "Incorrect"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">
                      {log.response_time_ms ? `${log.response_time_ms}ms` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden flex flex-col gap-3">
            {pageLogs.map((log) => (
              <Card key={log.id} padding="sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink">
                      {log.subjects?.name ?? "Unknown subject"}
                    </p>
                    <p className="text-xs text-muted truncate">
                      {log.question_sets?.set_name ?? "Unknown set"}
                    </p>
                    <p className="text-xs text-muted/60 italic mt-1">
                      {log.blocked_site ? `via ${log.blocked_site}` : "—"}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted">
                      {formatRelativeTime(log.answered_at)}
                    </p>
                    <Badge
                      variant={log.is_correct ? "lime" : "default"}
                      className="mt-1"
                    >
                      {log.is_correct ? "Correct" : "Incorrect"}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-muted">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              >
                Prev
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setPage((prev) => Math.min(totalPages, prev + 1))
                }
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
