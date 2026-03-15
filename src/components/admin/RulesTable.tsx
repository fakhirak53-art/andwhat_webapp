"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { deleteRule, toggleRule } from "@/app/actions/rules-admin";
import RuleForm, {
  type EditableRule,
  type RuleSetOption,
} from "@/components/admin/RuleForm";
import EmptyState from "@/components/dashboard/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export interface ProtectedRuleRow {
  id: string;
  year_level: number | null;
  pattern: string;
  question_set_id: string;
  is_active: boolean;
  priority: number;
}

interface RulesTableProps {
  rules: ProtectedRuleRow[];
  questionSets: RuleSetOption[];
  openCreateByDefault?: boolean;
}

function yearLabel(year: number | null): string {
  return year ? `Year ${year}` : "All years";
}

export default function RulesTable({
  rules,
  questionSets,
  openCreateByDefault = false,
}: RulesTableProps) {
  const [showCreate, setShowCreate] = useState(openCreateByDefault);
  const [editingRule, setEditingRule] = useState<EditableRule | null>(null);
  const [pendingRuleId, setPendingRuleId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const setById = useMemo(
    () => new Map(questionSets.map((set) => [set.id, set])),
    [questionSets],
  );

  const orderedRules = useMemo(
    () => [...rules].sort((a, b) => a.priority - b.priority),
    [rules],
  );

  function handleToggle(ruleId: string, nextValue: boolean): void {
    setPendingRuleId(ruleId);
    startTransition(async () => {
      await toggleRule(ruleId, nextValue);
      window.location.reload();
    });
  }

  function handleDelete(ruleId: string): void {
    setPendingRuleId(ruleId);
    startTransition(async () => {
      await deleteRule(ruleId);
      window.location.reload();
    });
  }

  function handleSaved(): void {
    setShowCreate(false);
    setEditingRule(null);
    window.location.reload();
  }

  return (
    <div className="mt-6">
      {orderedRules.length === 0 ? (
        <EmptyState
          icon={<Plus className="w-10 h-10" />}
          title="No rules configured yet"
          description="Add your first rule."
          action={<Button onClick={() => setShowCreate(true)}>Add rule</Button>}
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full bg-paper text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-xs uppercase tracking-widest text-muted">
                  Priority
                </th>
                <th className="px-4 py-3 text-xs uppercase tracking-widest text-muted">
                  URL Pattern
                </th>
                <th className="px-4 py-3 text-xs uppercase tracking-widest text-muted">
                  Year level
                </th>
                <th className="px-4 py-3 text-xs uppercase tracking-widest text-muted">
                  Question Set
                </th>
                <th className="px-4 py-3 text-xs uppercase tracking-widest text-muted">
                  Status
                </th>
                <th className="px-4 py-3 text-xs uppercase tracking-widest text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orderedRules.map((rule) => {
                const loading = isPending && pendingRuleId === rule.id;
                const matchedSet = setById.get(rule.question_set_id);
                return (
                  <tr
                    key={rule.id}
                    className="border-b border-border align-top"
                  >
                    <td className="px-4 py-3 text-sm text-ink">
                      {rule.priority}
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-sm text-ink font-mono">
                        {rule.pattern}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="default">
                        {yearLabel(rule.year_level)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-ink">
                        {matchedSet?.set_name ?? "Unknown set"}
                      </p>
                      <p className="text-xs text-muted">
                        {matchedSet
                          ? `${matchedSet.subject_name} · Year ${matchedSet.year_level}`
                          : "No subject"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleToggle(rule.id, !rule.is_active)}
                        className={[
                          "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs",
                          rule.is_active
                            ? "border-lime-dark bg-lime/20 text-ink"
                            : "border-border bg-paper text-muted",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "h-2 w-2 rounded-full",
                            rule.is_active ? "bg-lime-dark" : "bg-muted/50",
                          ].join(" ")}
                        />
                        {rule.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            setEditingRule({
                              id: rule.id,
                              year_level: rule.year_level,
                              pattern: rule.pattern,
                              question_set_id: rule.question_set_id,
                              is_active: rule.is_active,
                              priority: rule.priority,
                            })
                          }
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          loading={loading}
                          onClick={() => handleDelete(rule.id)}
                          className="text-error"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        {!showCreate ? (
          <Button onClick={() => setShowCreate(true)}>Add rule</Button>
        ) : null}
      </div>

      {showCreate ? (
        <Card className="mt-4" padding="md">
          <h3 className="font-serif text-lg text-ink">Add rule</h3>
          <div className="mt-3">
            <RuleForm
              questionSets={questionSets}
              onCancel={() => setShowCreate(false)}
              onSaved={handleSaved}
            />
          </div>
        </Card>
      ) : null}

      {editingRule ? (
        <Card className="mt-4" padding="md">
          <h3 className="font-serif text-lg text-ink">Edit rule</h3>
          <div className="mt-3">
            <RuleForm
              questionSets={questionSets}
              initialRule={editingRule}
              onCancel={() => setEditingRule(null)}
              onSaved={handleSaved}
            />
          </div>
        </Card>
      ) : null}
    </div>
  );
}
