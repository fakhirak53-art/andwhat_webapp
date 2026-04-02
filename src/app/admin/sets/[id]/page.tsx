import Link from "next/link";
import { redirect } from "next/navigation";
import {
  deleteQuestionSet,
  toggleQuestionSetActive,
  updateQuestionSet,
} from "@/app/actions/sets-admin";
import AddQuestionForm from "@/components/admin/AddQuestionForm";
import QuestionCard from "@/components/admin/QuestionCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  getAdminProfile,
  getAllSubjects,
  getQuestionSetWithQuestions,
  getTextbooks,
} from "@/lib/admin";
import { createClient } from "@/utils/supabase/server";

interface AdminSetDetailPageProps {
  params: Promise<{ id: string }>;
}

interface SetWithTextbook {
  id: string;
  reference_code?: string | null;
  set_name: string;
  year_level: number;
  is_active: boolean;
  subject_id: string;
  school_id: string;
  created_at: string;
  textbook_id?: string | null;
  question_count?: number;
  subject?: { id: string; name: string };
  textbook?: { id: string; title: string } | null;
}

export default async function AdminSetDetailPage({
  params,
}: AdminSetDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const adminProfile = await getAdminProfile(user.id);
  if (!adminProfile) redirect("/admin/login");

  const payload = await getQuestionSetWithQuestions(id, adminProfile.school_id);
  if (!payload) redirect("/admin/sets");

  const typedSet = payload.set as unknown as SetWithTextbook;
  const referenceDisplay =
    typedSet.reference_code && typedSet.reference_code.trim().length > 0
      ? typedSet.reference_code
      : `QS-${typedSet.id.slice(0, 8).toUpperCase()}`;
  const [subjects, textbooks] = await Promise.all([
    getAllSubjects(),
    getTextbooks(adminProfile.school_id),
  ]);

  async function updateSetAction(formData: FormData): Promise<void> {
    "use server";
    await updateQuestionSet(id, formData);
  }

  async function toggleSetAction(): Promise<void> {
    "use server";
    await toggleQuestionSetActive(id, !typedSet.is_active);
  }

  async function deleteSetAction(): Promise<void> {
    "use server";
    await deleteQuestionSet(id);
    redirect("/admin/sets");
  }

  return (
    <div>
      <div className="text-sm text-muted mb-2">
        <Link href="/admin/sets" className="hover:text-ink">
          Question Sets
        </Link>{" "}
        → {typedSet.set_name}
      </div>
      <Link href="/admin/sets" className="text-sm text-muted hover:text-ink">
        ← Back
      </Link>

      <section className="mt-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-ink">{typedSet.set_name}</h1>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <Badge variant="default">
              {typedSet.subject?.name ?? "Subject"}
            </Badge>
            <Badge variant="default">Year {typedSet.year_level}</Badge>
            <Badge variant={typedSet.is_active ? "lime" : "default"}>
              {typedSet.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <details>
            <summary className="list-none">
              <Button variant="secondary">Edit details</Button>
            </summary>
            <Card className="mt-2 w-full md:w-[560px]" padding="md">
              <form action={updateSetAction} className="space-y-3">
                <div>
                  <label
                    htmlFor="edit-set-name"
                    className="block text-sm font-medium text-ink mb-1.5"
                  >
                    Set name
                  </label>
                  <input
                    id="edit-set-name"
                    name="set_name"
                    defaultValue={typedSet.set_name}
                    className="w-full bg-cream border border-border rounded-md px-4 py-2.5 text-sm text-ink"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="edit-subject-id"
                      className="block text-sm font-medium text-ink mb-1.5"
                    >
                      Subject
                    </label>
                    <select
                      id="edit-subject-id"
                      name="subject_id"
                      defaultValue={typedSet.subject_id}
                      className="w-full bg-cream border border-border rounded-md px-4 py-2.5 text-sm text-ink"
                    >
                      {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name} (Year {subject.year_level})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="edit-year-level"
                      className="block text-sm font-medium text-ink mb-1.5"
                    >
                      Year level
                    </label>
                    <select
                      id="edit-year-level"
                      name="year_level"
                      defaultValue={String(typedSet.year_level)}
                      className="w-full bg-cream border border-border rounded-md px-4 py-2.5 text-sm text-ink"
                    >
                      {[7, 8, 9, 10, 11, 12].map((year) => (
                        <option key={year} value={year}>
                          Year {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="edit-textbook-id"
                    className="block text-sm font-medium text-ink mb-1.5"
                  >
                    Textbook
                  </label>
                  <select
                    id="edit-textbook-id"
                    name="textbook_id"
                    defaultValue={typedSet.textbook_id ?? ""}
                    className="w-full bg-cream border border-border rounded-md px-4 py-2.5 text-sm text-ink"
                  >
                    <option value="">None</option>
                    {textbooks.map((book) => (
                      <option key={book.id} value={book.id}>
                        {book.title}
                      </option>
                    ))}
                  </select>
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_active"
                    defaultChecked={typedSet.is_active}
                  />
                  <span className="text-sm text-ink">Set is active</span>
                </label>
                <div className="flex items-center gap-2">
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </Card>
          </details>

          <form action={toggleSetAction}>
            <Button type="submit" variant="secondary">
              {typedSet.is_active ? "Deactivate" : "Activate"}
            </Button>
          </form>

          <form action={deleteSetAction}>
            <Button type="submit" variant="ghost" className="text-error">
              Delete set
            </Button>
          </form>
        </div>
      </section>

      <Card className="mt-6" padding="md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted">
              Reference code
            </p>
            <p className="text-sm text-ink mt-1 break-all">
              {referenceDisplay}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted">
              Questions
            </p>
            <p className="text-sm text-ink mt-1">{payload.questions.length}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted">
              Created
            </p>
            <p className="text-sm text-ink mt-1">
              {new Date(typedSet.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted">
              Textbook
            </p>
            <p className="text-sm text-ink mt-1">
              {typedSet.textbook?.title ?? "None"}
            </p>
          </div>
        </div>
      </Card>

      <section className="mt-8">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-serif text-xl text-ink">
            Questions ({payload.questions.length})
          </h2>
          <a href="#add-question">
            <Button size="sm">Add question</Button>
          </a>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {payload.questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              seq={index + 1}
            />
          ))}
        </div>

        <div id="add-question" className="mt-6">
          {payload.questions.length === 0 ? (
            <h3 className="font-serif text-lg text-ink mb-3">
              Start adding questions
            </h3>
          ) : null}
          <AddQuestionForm setId={id} />
        </div>
      </section>
    </div>
  );
}
