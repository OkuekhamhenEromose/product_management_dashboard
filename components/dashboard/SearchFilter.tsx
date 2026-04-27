"use client";
/**
 * SearchFilter.tsx
 * ─────────────────
 * FIXED: removed the `useEffect(() => setLocalSearch(…))` pattern that
 * triggered the ESLint warning "Avoid calling setState() directly within
 * an effect (cascading renders)".
 *
 * Solution: React's recommended "derived state during render" pattern.
 * We track the PREVIOUS external value in a ref and, when it differs
 * from the current prop, we update local state synchronously during the
 * render phase — not inside an effect — so no extra render cycle occurs.
 */

import React, { useCallback, useRef, useState } from "react";
import {
  CATEGORIES,
  CONDITIONS,
  SORT_OPTIONS,
} from "@/services/mockProductApi";
import type { ProductFilters } from "@/services/mockProductApi";

interface Props {
  filters: ProductFilters;
  onChange: (f: Partial<ProductFilters>) => void;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const S = {
  bar: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 12,
    alignItems: "center",
    padding: "16px 0",
  },
  searchWrap: {
    position: "relative" as const,
    flex: "1 1 240px",
    minWidth: 200,
  },
  searchIcon: {
    position: "absolute" as const,
    left: 14,
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: 16,
    pointerEvents: "none" as const,
    color: "#9CA3AF",
  },
  searchInput: {
    width: "100%",
    padding: "10px 16px 10px 40px",
    border: "1.5px solid #E5E7EB",
    borderRadius: 12,
    fontSize: 14,
    fontFamily: "'Open Sans', sans-serif",
    color: "#1F2937",
    background: "#fff",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  select: {
    padding: "10px 36px 10px 14px",
    border: "1.5px solid #E5E7EB",
    borderRadius: 12,
    fontSize: 13,
    fontFamily: "'Open Sans', sans-serif",
    color: "#1F2937",
    /* eslint-disable max-len */
    background:
      "#fff url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E\") no-repeat right 12px center",
    appearance: "none" as const,
    WebkitAppearance: "none" as const,
    outline: "none",
    cursor: "pointer",
    transition: "border-color 0.2s",
    flexShrink: 0,
  },
  pill: (active: boolean): React.CSSProperties => ({
    display: "inline-block",
    padding: "6px 14px",
    borderRadius: 50,
    fontSize: 12,
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600,
    cursor: "pointer",
    border: active ? "1.5px solid #7C3AED" : "1.5px solid #E5E7EB",
    background: active ? "#7C3AED" : "#fff",
    color: active ? "#fff" : "#6B7280",
    transition: "all 0.18s",
    whiteSpace: "nowrap" as const,
  }),
  pills: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 8,
    alignItems: "center",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function SearchFilter({ filters, onChange }: Props) {
  /**
   * Local search state exists only to support debounced typing without
   * hammering the parent with every keystroke.
   *
   * FIX: Instead of a useEffect that calls setLocalSearch (triggering the
   * lint warning), we use the "derived state during render" pattern:
   *   1. Track the previous external value in a ref.
   *   2. When the prop changes (e.g. parent clears all filters), update
   *      local state DURING the render — React will discard the current
   *      render output and immediately re-render with the new state,
   *      producing a single, synchronous update rather than a cascade.
   */
  const [searchState, setSearchState] = useState(() => ({
    localSearch: filters.search ?? "",
    prevExternalSearch: filters.search,
  }));

  if (searchState.prevExternalSearch !== filters.search) {
    setSearchState({
      localSearch: filters.search ?? "",
      prevExternalSearch: filters.search,
    });
  }

  const localSearch = searchState.localSearch;

  // Debounce ref — keeps timer alive across re-renders without a state update.
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setSearchState((prev) => ({
        ...prev,
        localSearch: val,
      }));
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => onChange({ search: val }), 350);
    },
    [onChange],
  );

  const activeCategory = filters.category ?? "All";
  const activeCondition = filters.condition ?? "All";

  return (
    <div>
      {/* Row 1: Search + Condition + Sort ────────────────────────────── */}
      <div style={S.bar}>
        {/* Search input */}
        <div style={S.searchWrap}>
          <span className="material-icons" style={S.searchIcon}>search</span>
          <input
            type="search"
            placeholder="Search products, shops…"
            value={localSearch}
            onChange={handleSearch}
            style={S.searchInput}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#7C3AED";
              e.currentTarget.style.boxShadow = "0 0 0 3px #EDE9FE";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#E5E7EB";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Condition dropdown */}
        <select
          value={activeCondition}
          onChange={(e) => onChange({ condition: e.target.value })}
          style={{ ...S.select, minWidth: 130 }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#7C3AED";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#E5E7EB";
          }}
        >
          {CONDITIONS.map((c) => (
            <option key={c} value={c}>
              {c === "All"
                ? "All conditions"
                : c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>

        {/* Sort dropdown */}
        <select
          value={filters.sort ?? "-created_at"}
          onChange={(e) => onChange({ sort: e.target.value })}
          style={{ ...S.select, minWidth: 170 }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#7C3AED";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#E5E7EB";
          }}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Row 2: Category pills ────────────────────────────────────────── */}
      <div
        style={{
          ...S.pills,
          marginBottom: 8,
          overflowX: "auto",
          flexWrap: "nowrap",
          paddingBottom: 4,
        }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            style={S.pill(cat === activeCategory)}
            onClick={() => onChange({ category: cat })}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
