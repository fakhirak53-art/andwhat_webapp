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
import { marketingTheme as t } from "@/lib/marketing-theme";
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
          <div className="hidden md:block overflow-x-auto border border-[#ede8df] rounded-lg bg-[#faf7f2]">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#ede8df]">
                  <th
                    className={[
                      "px-4 py-3 text-xs uppercase tracking-widest font-medium",
                      t.textMuted,
                    ].join(" ")}
                  >
                    Date/Time
                  </th>
                  <th
                    className={[
                      "px-4 py-3 text-xs uppercase tracking-widest font-medium",
                      t.textMuted,
                    ].join(" ")}
                  >
                    Subject
                  </th>
                  <th
                    className={[
                      "px-4 py-3 text-xs uppercase tracking-widest font-medium",
                      t.textMuted,
                    ].join(" ")}
                  >
                    Question Set
                  </th>
                  <th
                    className={[
                      "px-4 py-3 text-xs uppercase tracking-widest font-medium",
                      t.textMuted,
                    ].join(" ")}
                  >
                    Trigger site
                  </th>
                  <th
                    className={[
                      "px-4 py-3 text-xs uppercase tracking-widest font-medium",
                      t.textMuted,
                    ].join(" ")}
                  >
                    Result
                  </th>
                  <th
                    className={[
                      "px-4 py-3 text-xs uppercase tracking-widest font-medium",
                      t.textMuted,
                    ].join(" ")}
                  >
                    Response time
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-[#ede8df] last:border-b-0"
                  >
                    <td
                      className={["px-4 py-3 text-sm", t.textHeading].join(" ")}
                    >
                      {formatDateTime(log.answered_at)}
                    </td>
                    <td
                      className={[
                        "px-4 py-3 text-sm font-medium",
                        t.textHeading,
                      ].join(" ")}
                    >
                      {log.subjects?.name ?? "Unknown subject"}
                    </td>
                    <td
                      className={[
                        "px-4 py-3 text-sm truncate max-w-xs",
                        t.textMuted,
                      ].join(" ")}
                    >
                      {log.question_sets?.set_name ?? "Unknown set"}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 italic">
                      {log.blocked_site
                        ? `via ${log.blocked_site}`
                        : "Dashboard practice"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={log.is_correct ? "lime" : "default"}>
                        {log.is_correct ? "Correct" : "Incorrect"}
                      </Badge>
                    </td>
                    <td
                      className={["px-4 py-3 text-xs", t.textMuted].join(" ")}
                    >
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
                    <p
                      className={["text-sm font-medium", t.textHeading].join(
                        " ",
                      )}
                    >
                      {log.subjects?.name ?? "Unknown subject"}
                    </p>
                    <p className={["text-xs truncate", t.textMuted].join(" ")}>
                      {log.question_sets?.set_name ?? "Unknown set"}
                    </p>
                    <p className="text-xs text-gray-500 italic mt-1">
                      {log.blocked_site
                        ? `via ${log.blocked_site}`
                        : "Dashboard practice"}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={["text-xs", t.textMuted].join(" ")}>
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
            <p className={["text-xs", t.textMuted].join(" ")}>
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
