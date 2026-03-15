"use client";

import { AlertTriangle, Check, CheckCircle2, Copy, Upload } from "lucide-react";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { bulkImportQuestions } from "@/app/actions/sets-admin";
import { Button, Card, Spinner } from "@/components/ui";

type Step = 1 | 2 | 3;

interface UploadSetOption {
  id: string;
  set_name: string;
  reference_code: string | null;
}

interface CSVUploaderProps {
  questionSets: UploadSetOption[];
}

interface ParsedRow {
  rowNumber: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  correct_answer: string;
  difficulty: string;
  errors: string[];
}

interface ValidQuestion {
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  correct_answer: "A" | "B" | "C";
  difficulty: "easy" | "medium" | "hard" | null;
}

function getReferenceCode(set: UploadSetOption): string {
  if (set.reference_code && set.reference_code.trim().length > 0) {
    return set.reference_code;
  }
  return `QS-${set.id.slice(0, 8).toUpperCase()}`;
}

const EXPECTED_HEADERS = [
  "question_text",
  "option_a",
  "option_b",
  "option_c",
  "correct_answer",
  "difficulty",
] as const;

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}

function isHeaderValid(headers: string[]): boolean {
  if (headers.length !== EXPECTED_HEADERS.length) return false;
  return EXPECTED_HEADERS.every((header, index) => headers[index] === header);
}

function isRowEmpty(values: string[]): boolean {
  return values.every((value) => value.trim().length === 0);
}

function validateRow(
  rowNumber: number,
  values: string[],
  hasUnexpectedColumns: boolean,
): ParsedRow {
  const padded = [...values];
  while (padded.length < EXPECTED_HEADERS.length) {
    padded.push("");
  }

  const question_text = padded[0].trim();
  const option_a = padded[1].trim();
  const option_b = padded[2].trim();
  const option_c = padded[3].trim();
  const correct_answer = padded[4].trim().toUpperCase();
  const difficulty = padded[5].trim().toLowerCase();

  const errors: string[] = [];
  if (hasUnexpectedColumns) {
    errors.push(
      "Row has unexpected columns. Ensure commas in text are quoted.",
    );
  }
  if (!question_text) errors.push("question_text is required");
  if (question_text.length > 500)
    errors.push("question_text exceeds 500 characters");
  if (!option_a) errors.push("option_a is required");
  if (!option_b) errors.push("option_b is required");
  if (!option_c) errors.push("option_c is required");
  if (option_a.length > 200) errors.push("option_a exceeds 200 characters");
  if (option_b.length > 200) errors.push("option_b exceeds 200 characters");
  if (option_c.length > 200) errors.push("option_c exceeds 200 characters");
  if (!["A", "B", "C"].includes(correct_answer)) {
    errors.push("correct_answer must be A, B or C");
  }
  if (difficulty && !["easy", "medium", "hard"].includes(difficulty)) {
    errors.push("difficulty must be easy, medium or hard");
  }

  return {
    rowNumber,
    question_text,
    option_a,
    option_b,
    option_c,
    correct_answer,
    difficulty,
    errors,
  };
}

function toValidQuestion(row: ParsedRow): ValidQuestion {
  return {
    question_text: row.question_text,
    option_a: row.option_a,
    option_b: row.option_b,
    option_c: row.option_c,
    correct_answer: row.correct_answer as "A" | "B" | "C",
    difficulty:
      row.difficulty.length > 0
        ? (row.difficulty as "easy" | "medium" | "hard")
        : null,
  };
}

function parseCSVText(text: string): { rows: ParsedRow[]; error?: string } {
  const lines = text.split(/\r?\n/);
  const headerIndex = lines.findIndex((line) => line.trim().length > 0);

  if (headerIndex === -1) {
    return { rows: [], error: "CSV file is empty." };
  }

  const headers = parseCsvLine(lines[headerIndex]).map((header) =>
    header.trim().toLowerCase(),
  );

  if (!isHeaderValid(headers)) {
    return {
      rows: [],
      error:
        "Invalid CSV headers. Expected: question_text, option_a, option_b, option_c, correct_answer, difficulty",
    };
  }

  const rows: ParsedRow[] = [];
  for (
    let lineIndex = headerIndex + 1;
    lineIndex < lines.length;
    lineIndex += 1
  ) {
    const line = lines[lineIndex];
    const values = parseCsvLine(line);
    if (isRowEmpty(values)) continue;

    const hasUnexpectedColumns = values.length !== EXPECTED_HEADERS.length;
    const row = validateRow(
      lineIndex - headerIndex,
      values,
      hasUnexpectedColumns,
    );
    rows.push(row);
  }

  if (rows.length === 0) {
    return { rows: [], error: "No question rows found in the CSV." };
  }

  if (rows.length > 200) {
    return {
      rows,
      error: `Maximum 200 rows per upload. Found ${rows.length}.`,
    };
  }

  return { rows };
}

export default function CSVUploader({ questionSets }: CSVUploaderProps) {
  const [step, setStep] = useState<Step>(1);
  const [selectedSetId, setSelectedSetId] = useState("");
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importedCount, setImportedCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedSet = useMemo(
    () => questionSets.find((set) => set.id === selectedSetId) ?? null,
    [questionSets, selectedSetId],
  );
  const selectedSetReferenceCode = useMemo(
    () => (selectedSet ? getReferenceCode(selectedSet) : ""),
    [selectedSet],
  );

  const validRows = useMemo(
    () => rows.filter((row) => row.errors.length === 0),
    [rows],
  );
  const invalidRows = useMemo(
    () => rows.filter((row) => row.errors.length > 0),
    [rows],
  );

  function resetForNewUpload(): void {
    setStep(1);
    setSelectedSetId("");
    setFileName("");
    setRows([]);
    setParseError(null);
    setImportError(null);
    setImportedCount(0);
    setCopied(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function prepareForFix(): void {
    setStep(1);
    setFileName("");
    setRows([]);
    setParseError(null);
    setImportError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleFile(file: File): Promise<void> {
    const lowerName = file.name.toLowerCase();
    if (!lowerName.endsWith(".csv")) {
      setParseError("Please upload a .csv file.");
      setRows([]);
      setFileName("");
      return;
    }

    const text = await file.text();
    const parsed = parseCSVText(text);
    setFileName(file.name);
    setRows(parsed.rows);
    setParseError(parsed.error ?? null);
    setImportError(null);
  }

  async function onFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> {
    const file = event.target.files?.[0];
    if (!file) return;
    await handleFile(file);
  }

  async function onDrop(
    event: React.DragEvent<HTMLButtonElement>,
  ): Promise<void> {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    await handleFile(file);
  }

  async function handleImport(importRows: ParsedRow[]): Promise<void> {
    if (!selectedSetId) return;
    setImportError(null);
    setIsImporting(true);
    const payload = importRows.map(toValidQuestion);
    const result = await bulkImportQuestions(selectedSetId, payload);
    setIsImporting(false);

    if (result.error) {
      setImportError(result.error);
      return;
    }

    setImportedCount(result.imported);
    setStep(3);
  }

  async function copySetReference(): Promise<void> {
    if (!selectedSetReferenceCode) return;
    try {
      await navigator.clipboard.writeText(selectedSetReferenceCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const canProceedToPreview =
    selectedSetId.length > 0 && rows.length > 0 && !parseError;

  return (
    <Card padding="lg">
      <div className="flex items-center gap-2 text-sm">
        {[1, 2, 3].map((value) => {
          const stepValue = value as Step;
          const isActive = step === stepValue;
          const isDone = step > stepValue;
          return (
            <div key={value} className="flex items-center gap-2">
              <span
                className={[
                  "inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs font-medium",
                  isDone
                    ? "border-lime bg-lime text-ink"
                    : isActive
                      ? "border-ink bg-ink text-paper"
                      : "border-border bg-cream text-muted",
                ].join(" ")}
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : value}
              </span>
              <span
                className={isActive ? "text-ink font-medium" : "text-muted"}
              >
                {value === 1
                  ? "Upload & Select Set"
                  : value === 2
                    ? "Preview & Validate"
                    : "Done"}
              </span>
              {value < 3 ? <span className="text-muted">→</span> : null}
            </div>
          );
        })}
      </div>

      {step === 1 ? (
        <div className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="question-set-select"
              className="block text-sm font-medium text-ink mb-1.5"
            >
              Select question set
            </label>
            <select
              id="question-set-select"
              value={selectedSetId}
              onChange={(event) => setSelectedSetId(event.target.value)}
              className="w-full rounded-md border border-border bg-paper px-3 py-2 text-sm text-ink"
            >
              <option value="">Choose an active set</option>
              {questionSets.map((set) => (
                <option key={set.id} value={set.id}>
                  {set.set_name}
                  {` (${getReferenceCode(set)})`}
                </option>
              ))}
            </select>
            <Link
              href="/admin/sets/new"
              className="mt-2 inline-block text-sm text-muted hover:text-ink"
            >
              Create new set first →
            </Link>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={onDrop}
            className={[
              "w-full cursor-pointer rounded-lg border-2 border-dashed border-border p-12 text-center transition-colors",
              isDragOver ? "bg-lime/10 border-lime-dark" : "bg-cream/40",
            ].join(" ")}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={onFileChange}
            />
            <Upload className="mx-auto h-8 w-8 text-muted" />
            <p className="mt-3 text-sm font-medium text-ink">
              Drop your CSV here or click to browse
            </p>
            <p className="mt-1 text-sm text-muted">Accepts .csv files only</p>
            {fileName ? (
              <p className="mt-3 text-xs text-ink">
                Selected file: <span className="font-medium">{fileName}</span>
              </p>
            ) : null}
          </button>

          {parseError ? (
            <div
              className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"
              role="alert"
            >
              {parseError}
            </div>
          ) : null}

          <div className="flex justify-end">
            <Button
              onClick={() => setStep(2)}
              disabled={!canProceedToPreview}
              className="justify-center"
            >
              Next: Preview →
            </Button>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="mt-6 space-y-5">
          <p
            className={[
              "text-sm font-medium",
              invalidRows.length === 0 ? "text-green-600" : "text-amber-600",
            ].join(" ")}
          >
            {rows.length} rows found · {validRows.length} valid ·{" "}
            {invalidRows.length} invalid
          </p>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="min-w-[980px] w-full text-sm">
              <thead className="bg-cream/70">
                <tr>
                  {[
                    "Row #",
                    "Question",
                    "A",
                    "B",
                    "C",
                    "Answer",
                    "Difficulty",
                    "Status",
                  ].map((title) => (
                    <th
                      key={title}
                      className="px-3 py-2 text-left text-xs uppercase tracking-widest text-muted"
                    >
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const isInvalid = row.errors.length > 0;
                  return (
                    <tr
                      key={`${row.rowNumber}-${row.question_text.slice(0, 12)}`}
                      className={isInvalid ? "bg-red-50" : ""}
                    >
                      <td className="px-3 py-2 text-muted">{row.rowNumber}</td>
                      <td className="px-3 py-2 text-ink max-w-[320px] truncate">
                        {row.question_text || "—"}
                      </td>
                      <td className="px-3 py-2 text-ink max-w-[180px] truncate">
                        {row.option_a || "—"}
                      </td>
                      <td className="px-3 py-2 text-ink max-w-[180px] truncate">
                        {row.option_b || "—"}
                      </td>
                      <td className="px-3 py-2 text-ink max-w-[180px] truncate">
                        {row.option_c || "—"}
                      </td>
                      <td className="px-3 py-2 text-ink">
                        {row.correct_answer || "—"}
                      </td>
                      <td className="px-3 py-2 text-ink">
                        {row.difficulty || "—"}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-start gap-2">
                          <span
                            className={[
                              "mt-1 h-2.5 w-2.5 rounded-full shrink-0",
                              isInvalid ? "bg-red-400" : "bg-lime",
                            ].join(" ")}
                          />
                          <span
                            className={isInvalid ? "text-red-700" : "text-ink"}
                          >
                            {isInvalid ? row.errors.join("; ") : "Valid"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {importError ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {importError}
            </div>
          ) : null}

          {invalidRows.length > 0 ? (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-2 text-amber-800">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p className="text-sm">
                  Fix the errors in your CSV and re-upload. Invalid rows will be
                  skipped.
                </p>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Button
                  onClick={() => handleImport(validRows)}
                  disabled={validRows.length === 0 || isImporting}
                >
                  {isImporting ? (
                    <span className="inline-flex items-center gap-2">
                      <Spinner
                        size="sm"
                        className="border-paper border-t-transparent"
                      />
                      Importing {validRows.length} questions...
                    </span>
                  ) : (
                    `Skip invalid rows and import ${validRows.length} valid questions`
                  )}
                </Button>
                <Button
                  variant="secondary"
                  onClick={prepareForFix}
                  disabled={isImporting}
                >
                  Cancel and fix CSV
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-end">
              <Button onClick={() => handleImport(rows)} disabled={isImporting}>
                {isImporting ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner
                      size="sm"
                      className="border-paper border-t-transparent"
                    />
                    Importing {rows.length} questions...
                  </span>
                ) : (
                  `Import ${rows.length} questions →`
                )}
              </Button>
            </div>
          )}
        </div>
      ) : null}

      {step === 3 ? (
        <div className="mt-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-lime">
            <CheckCircle2 className="h-8 w-8 text-ink" />
          </div>
          <h2 className="mt-4 font-serif text-2xl text-ink">
            {importedCount} questions added to{" "}
            {selectedSet?.set_name ?? "your set"}
          </h2>
          <p className="mt-2 text-sm text-muted">
            The reference code for this set is:
          </p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-md border border-border bg-cream px-3 py-2">
            <code className="font-mono text-sm text-ink">
              {selectedSetReferenceCode}
            </code>
            <button
              type="button"
              onClick={copySetReference}
              className="text-muted hover:text-ink"
              aria-label="Copy set reference"
            >
              <Copy className="h-4 w-4" />
            </button>
            {copied ? (
              <span className="text-xs text-green-700">Copied!</span>
            ) : null}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <Link href={`/admin/sets/${selectedSetId}`}>
              <Button>View question set →</Button>
            </Link>
            <Button variant="secondary" onClick={resetForNewUpload}>
              Upload another CSV
            </Button>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
