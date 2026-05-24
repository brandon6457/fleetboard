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
  status: FleetStatus;
};

const initialFormState: FleetEntryFormState = {
  unitNumber: "",
  personName: "",
  section: "SRQ_RKL",
  status: "active",
};

const panelClasses =
  "border-[3px] border-zinc-700 bg-zinc-900 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]";
const labelClasses =
  "grid gap-2 text-sm font-black uppercase tracking-wide text-zinc-200";
const inputClasses =
  "border-[3px] border-zinc-600 bg-zinc-950 px-3 py-2 text-base font-bold text-zinc-50 outline-none placeholder:text-zinc-500 hover:border-zinc-400 focus-visible:border-emerald-400 focus-visible:ring-4 focus-visible:ring-emerald-500/30";
const textInputClasses = `${inputClasses} cursor-text`;
const selectClasses = `${inputClasses} cursor-pointer appearance-none`;
const primaryButtonClasses =
  "cursor-pointer border-[3px] border-emerald-400 bg-emerald-400 px-4 py-3 font-black uppercase text-zinc-950 outline-none hover:border-emerald-300 hover:bg-emerald-300 focus-visible:ring-4 focus-visible:ring-emerald-400/40 disabled:cursor-not-allowed disabled:border-zinc-700 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:opacity-70";
const secondaryButtonClasses =
  "cursor-pointer border-[3px] border-zinc-500 bg-zinc-900 px-4 py-3 font-black uppercase text-zinc-100 outline-none hover:border-zinc-200 hover:bg-zinc-800 focus-visible:ring-4 focus-visible:ring-zinc-300/30 disabled:cursor-not-allowed disabled:border-zinc-700 disabled:bg-zinc-900 disabled:text-zinc-600 disabled:opacity-70";
const dangerButtonClasses =
  "cursor-pointer border-[3px] border-red-500 bg-red-500 px-3 py-2 text-sm font-black uppercase text-white outline-none hover:border-red-400 hover:bg-red-400 focus-visible:ring-4 focus-visible:ring-red-500/35";

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

  return [entry.unitNumber, entry.personName ?? ""].some((value) =>
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

  const entriesBySection = useMemo(
    () => groupedEntries(entries ?? []),
    [entries],
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
      personName: entry.personName ?? "",
      section: entry.section,
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
      personName: form.personName || undefined,
      section: form.section,
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
    <main className="h-screen overflow-auto bg-zinc-950 p-8 text-zinc-100">
      <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[24rem_1fr]">
        <section className={`${panelClasses} xl:col-span-2`}>
          <form
            className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end"
            onSubmit={handleSearchSubmit}
          >
            <label className={labelClasses}>
              Search Fleet Entries
              <div className="grid grid-cols-[1fr_auto]">
                <input
                  className={`${textInputClasses} min-w-0 border-r-0 px-4 py-3 text-lg`}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setSearchMessage("");
                  }}
                  placeholder="Unit number or person name"
                  value={searchQuery}
                />
                <button
                  className={`${primaryButtonClasses} px-5 text-sm`}
                  disabled={isLoadingEntries}
                  type="submit"
                >
                  Search
                </button>
              </div>
            </label>
            <div className="flex items-center gap-3">
              <p className="text-sm font-black uppercase text-zinc-300">
                {searchMessage ||
                (isLoadingEntries
                  ? "Loading entries"
                  : `${entries.length} total entries`)}
              </p>
              <button
                className={`${secondaryButtonClasses} text-sm`}
                disabled={!hasHighlight}
                onClick={handleClearHighlight}
                type="button"
              >
                Clear Highlight
              </button>
            </div>
          </form>
        </section>

        <section className={panelClasses} ref={formSectionRef}>
          <h1 className="text-3xl font-black uppercase text-white">
            Fleet Admin
          </h1>
          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            <label className={labelClasses}>
              Unit Number
              <input
                className={textInputClasses}
                onChange={(event) =>
                  updateField("unitNumber", event.target.value)
                }
                ref={unitNumberInputRef}
                required
                value={form.unitNumber}
              />
            </label>

            <label className={labelClasses}>
              Person Name
              <input
                className={textInputClasses}
                onChange={(event) =>
                  updateField("personName", event.target.value)
                }
                value={form.personName}
              />
            </label>

            <label className={labelClasses}>
              Section
              <select
                className={selectClasses}
                onChange={(event) =>
                  updateField("section", event.target.value as FleetSectionId)
                }
                value={form.section}
              >
                {fleetSections.map((section) => (
                  <option
                    className="bg-zinc-950 text-zinc-100"
                    key={section.id}
                    value={section.id}
                  >
                    {section.title}
                  </option>
                ))}
              </select>
            </label>

            <label className={labelClasses}>
              Status
              <select
                className={selectClasses}
                onChange={(event) =>
                  updateField("status", event.target.value as FleetStatus)
                }
                value={form.status}
              >
                {fleetStatuses.map((status) => (
                  <option
                    className="bg-zinc-950 text-zinc-100"
                    key={status.id}
                    value={status.id}
                  >
                    {status.title}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex gap-3">
              <button
                className={`${primaryButtonClasses} flex-1 text-base`}
                disabled={isSaving}
                type="submit"
              >
                {editingId ? "Update Entry" : "Add Entry"}
              </button>
              {editingId ? (
                <button
                  className={`${secondaryButtonClasses} text-base`}
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
            <div className={panelClasses} key={section.id}>
              <h2 className="text-2xl font-black uppercase text-white">
                {fleetSectionTitles[section.id]}
              </h2>
              <div className="mt-4 grid gap-3">
                {isLoadingEntries ? (
                  <p className="border-[3px] border-dashed border-zinc-700 bg-zinc-950 p-4 text-sm font-bold uppercase text-zinc-500">
                    Loading entries
                  </p>
                ) : entriesBySection[section.id].length > 0 ? (
                  entriesBySection[section.id].map((entry) => (
                    <article
                      className={`grid cursor-default gap-3 border-[3px] p-4 outline-none md:grid-cols-[1fr_auto] ${
                        entryMatchesSearch(entry, highlightedSearchQuery)
                          ? "border-yellow-400 bg-yellow-300 text-zinc-950 shadow-[0_0_0_4px_#facc15] hover:bg-yellow-200"
                          : "border-zinc-700 bg-zinc-950 text-zinc-100 hover:border-zinc-400 hover:bg-zinc-800"
                      }`}
                      key={entry._id}
                    >
                      <div>
                        <p className="text-xl font-black uppercase">
                          {entry.unitNumber}
                        </p>
                        {entry.personName ? (
                          <p className="mt-1 font-bold uppercase">
                            {entry.personName}
                          </p>
                        ) : null}
                        <p
                          className={`mt-2 text-sm font-black uppercase ${
                            entryMatchesSearch(entry, highlightedSearchQuery)
                              ? "text-zinc-800"
                              : "text-zinc-400"
                          }`}
                        >
                          {fleetStatusTitles[entry.status]}
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <button
                          className={`${secondaryButtonClasses} px-3 py-2 text-sm`}
                          onClick={() => startEditing(entry)}
                          type="button"
                        >
                          Edit
                        </button>
                        <button
                          className={dangerButtonClasses}
                          onClick={() => handleDelete(entry._id)}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="border-[3px] border-dashed border-zinc-700 bg-zinc-950 p-4 text-sm font-bold uppercase text-zinc-500">
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
