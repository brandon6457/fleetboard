"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Doc, Id } from "../../../../convex/_generated/dataModel";
import {
  fleetSections,
  fleetSectionTitles,
  fleetStatuses,
  fleetStatusTitles,
  type FleetSectionId,
  type FleetStatus,
} from "../data/sections";

type FleetEntryFormState = {
  unitNumber: string;
  personName: string;
  section: FleetSectionId;
  notes: string;
  status: FleetStatus;
};

const initialFormState: FleetEntryFormState = {
  unitNumber: "",
  personName: "",
  section: "SRQ_RKL",
  notes: "",
  status: "active",
};

const groupedEntries = (entries: Doc<"fleetEntries">[]) =>
  fleetSections.reduce(
    (groups, section) => ({
      ...groups,
      [section.id]: entries.filter((entry) => entry.section === section.id),
    }),
    {} as Record<FleetSectionId, Doc<"fleetEntries">[]>,
  );

const entryMatchesSearch = (entry: Doc<"fleetEntries">, query: string) => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return false;
  }

  return [entry.unitNumber, entry.personName].some((value) =>
    value.toLowerCase().includes(normalizedQuery),
  );
};

export function FleetAdmin() {
  const entries = useQuery(api.fleetEntries.list);
  const highlight = useQuery(api.kioskHighlight.get);
  const createEntry = useMutation(api.fleetEntries.create);
  const updateEntry = useMutation(api.fleetEntries.update);
  const deleteEntry = useMutation(api.fleetEntries.deleteEntry);
  const setSearchHighlight = useMutation(api.kioskHighlight.setSearch);
  const clearHighlight = useMutation(api.kioskHighlight.clear);

  const [form, setForm] = useState<FleetEntryFormState>(initialFormState);
  const [editingId, setEditingId] = useState<Id<"fleetEntries"> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const formSectionRef = useRef<HTMLElement>(null);
  const unitNumberInputRef = useRef<HTMLInputElement>(null);
  const isLoadingEntries = entries === undefined;
  const highlightedSearchQuery = highlight?.highlightedSearchQuery ?? "";
  const hasHighlight = Boolean(
    highlightedSearchQuery.trim() || highlight?.highlightedEntryId,
  );

  const filteredEntries = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const allEntries = entries ?? [];

    if (!normalizedQuery) {
      return allEntries;
    }

    return allEntries.filter((entry) =>
      entryMatchesSearch(entry, normalizedQuery),
    );
  }, [entries, searchQuery]);

  const entriesBySection = useMemo(
    () => groupedEntries(filteredEntries),
    [filteredEntries],
  );

  const updateField = <Field extends keyof FleetEntryFormState>(
    field: Field,
    value: FleetEntryFormState[Field],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setForm(initialFormState);
    setEditingId(null);
  };

  const startEditing = (entry: Doc<"fleetEntries">) => {
    setEditingId(entry._id);
    setForm({
      unitNumber: entry.unitNumber,
      personName: entry.personName,
      section: entry.section,
      notes: entry.notes ?? "",
      status: entry.status,
    });

    formSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    window.setTimeout(() => {
      unitNumberInputRef.current?.focus({ preventScroll: true });
    }, 350);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    const payload = {
      unitNumber: form.unitNumber,
      personName: form.personName,
      section: form.section,
      notes: form.notes || undefined,
      status: form.status,
    };

    try {
      if (editingId) {
        await updateEntry({ id: editingId, ...payload });
      } else {
        await createEntry(payload);
      }
      resetForm();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: Id<"fleetEntries">) => {
    const confirmed = window.confirm("Delete this fleet entry?");
    if (!confirmed) return;

    if (editingId === id) {
      resetForm();
    }

    if (highlight?.highlightedEntryId === id) {
      await clearHighlight();
    }

    await deleteEntry({ id });
  };

  const handleSearchSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedQuery = searchQuery.trim();

    if (!normalizedQuery || !entries) {
      setSearchMessage("");
      await clearHighlight();
      return;
    }

    const matches = entries.filter((entry) =>
      entryMatchesSearch(entry, normalizedQuery),
    );

    if (matches.length === 0) {
      setSearchMessage("No matching entries found");
      await clearHighlight();
      return;
    }

    setSearchMessage(`${matches.length} matching entries highlighted`);
    await setSearchHighlight({ searchQuery: normalizedQuery });
  };

  const handleClearHighlight = async () => {
    setSearchMessage("");
    await clearHighlight();
  };

  return (
    <main className="h-screen overflow-auto bg-white p-8 text-black">
      <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[24rem_1fr]">
        <section className="border-[3px] border-black p-5 xl:col-span-2">
          <form
            className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end"
            onSubmit={handleSearchSubmit}
          >
            <label className="grid gap-2 text-sm font-black uppercase">
              Search Fleet Entries
              <div className="grid grid-cols-[1fr_auto]">
                <input
                  className="min-w-0 border-[3px] border-r-0 border-black px-4 py-3 text-lg font-bold"
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setSearchMessage("");
                  }}
                  placeholder="Unit number or person name"
                  value={searchQuery}
                />
                <button
                  className="border-[3px] border-black bg-black px-5 py-3 text-sm font-black uppercase text-white disabled:opacity-50"
                  disabled={isLoadingEntries}
                  type="submit"
                >
                  Search
                </button>
              </div>
            </label>
            <div className="flex items-center gap-3">
              <p className="text-sm font-black uppercase text-zinc-600">
                {searchMessage ||
                (isLoadingEntries
                  ? "Loading entries"
                  : `${filteredEntries.length} shown / ${entries.length} total`)}
              </p>
              <button
                className="border-[3px] border-black bg-white px-4 py-3 text-sm font-black uppercase text-black disabled:opacity-50"
                disabled={!hasHighlight}
                onClick={handleClearHighlight}
                type="button"
              >
                Clear Highlight
              </button>
            </div>
          </form>
        </section>

        <section className="border-[3px] border-black p-5" ref={formSectionRef}>
          <h1 className="text-3xl font-black uppercase">Fleet Admin</h1>
          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            <label className="grid gap-2 text-sm font-black uppercase">
              Unit Number
              <input
                className="border-[3px] border-black px-3 py-2 text-base font-bold"
                onChange={(event) =>
                  updateField("unitNumber", event.target.value)
                }
                ref={unitNumberInputRef}
                required
                value={form.unitNumber}
              />
            </label>

            <label className="grid gap-2 text-sm font-black uppercase">
              Person Name
              <input
                className="border-[3px] border-black px-3 py-2 text-base font-bold"
                onChange={(event) =>
                  updateField("personName", event.target.value)
                }
                required
                value={form.personName}
              />
            </label>

            <label className="grid gap-2 text-sm font-black uppercase">
              Section
              <select
                className="border-[3px] border-black bg-white px-3 py-2 text-base font-bold"
                onChange={(event) =>
                  updateField("section", event.target.value as FleetSectionId)
                }
                value={form.section}
              >
                {fleetSections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-black uppercase">
              Status
              <select
                className="border-[3px] border-black bg-white px-3 py-2 text-base font-bold"
                onChange={(event) =>
                  updateField("status", event.target.value as FleetStatus)
                }
                value={form.status}
              >
                {fleetStatuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-black uppercase">
              Notes
              <textarea
                className="min-h-28 resize-y border-[3px] border-black px-3 py-2 text-base font-bold"
                onChange={(event) => updateField("notes", event.target.value)}
                value={form.notes}
              />
            </label>

            <div className="flex gap-3">
              <button
                className="flex-1 border-[3px] border-black bg-black px-4 py-3 text-base font-black uppercase text-white disabled:opacity-60"
                disabled={isSaving}
                type="submit"
              >
                {editingId ? "Update Entry" : "Add Entry"}
              </button>
              {editingId ? (
                <button
                  className="border-[3px] border-black px-4 py-3 text-base font-black uppercase"
                  onClick={resetForm}
                  type="button"
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="grid gap-5">
          {fleetSections.map((section) => (
            <div className="border-[3px] border-black p-4" key={section.id}>
              <h2 className="text-2xl font-black uppercase">
                {fleetSectionTitles[section.id]}
              </h2>
              <div className="mt-4 grid gap-3">
                {isLoadingEntries ? (
                  <p className="border-[3px] border-dashed border-zinc-300 p-4 text-sm font-bold uppercase text-zinc-500">
                    Loading entries
                  </p>
                ) : entriesBySection[section.id].length > 0 ? (
                  entriesBySection[section.id].map((entry) => (
                    <article
                      className={`grid gap-3 border-[3px] p-4 md:grid-cols-[1fr_auto] ${
                        entryMatchesSearch(entry, highlightedSearchQuery)
                          ? "border-yellow-500 bg-yellow-50 shadow-[0_0_0_4px_#facc15]"
                          : "border-black bg-white"
                      }`}
                      key={entry._id}
                    >
                      <div>
                        <p className="text-xl font-black uppercase">
                          {entry.unitNumber}
                        </p>
                        <p className="mt-1 font-bold uppercase">
                          {entry.personName}
                        </p>
                        <p className="mt-2 text-sm font-black uppercase text-zinc-600">
                          {fleetStatusTitles[entry.status]}
                        </p>
                        {entry.notes ? (
                          <p className="mt-2 font-semibold text-zinc-700">
                            {entry.notes}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex items-start gap-2">
                        <button
                          className="border-[3px] border-black px-3 py-2 text-sm font-black uppercase"
                          onClick={() => startEditing(entry)}
                          type="button"
                        >
                          Edit
                        </button>
                        <button
                          className="border-[3px] border-black bg-black px-3 py-2 text-sm font-black uppercase text-white"
                          onClick={() => handleDelete(entry._id)}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="border-[3px] border-dashed border-zinc-300 p-4 text-sm font-bold uppercase text-zinc-500">
                    No entries
                  </p>
                )}
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
