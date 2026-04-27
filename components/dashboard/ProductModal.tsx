"use client";
/**
 * ProductModal.tsx
 * ─────────────────
 * Slide-in modal with a two-column form for creating or editing a product.
 * Handles:
 *   - Required field validation
 *   - Price range validation
 *   - Stock quantity validation
 *   - Image URL validation (basic)
 *   - Submitting state with spinner
 *   - Server-side submit errors
 */
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { CATEGORIES, CONDITIONS } from "@/services/mockProductApi";
import type { MockProduct, ProductFormValues } from "@/hooks/useProducts";

interface Props {
  open: boolean;
  product: MockProduct | null; // null = "create" mode
  submitting: boolean;
  submitError: string | null;
  onClose: () => void;
  onSave: (data: ProductFormValues) => void;
}

// ─── Validation ───────────────────────────────────────────────────────────────

type Errors = Partial<Record<keyof ProductFormValues, string>>;

function validate(values: ProductFormValues): Errors {
  const e: Errors = {};
  if (!values.title.trim()) e.title = "Title is required.";
  else if (values.title.length > 120)
    e.title = "Title must be ≤ 120 characters.";

  if (!values.short_description.trim())
    e.short_description = "Description is required.";
  else if (values.short_description.length > 500)
    e.short_description = "Max 500 characters.";

  if (values.price <= 0) e.price = "Price must be greater than 0.";
  if (values.price > 100_000) e.price = "Price seems unrealistically high.";

  if (values.discount_price < 0)
    e.discount_price = "Discount price cannot be negative.";
  if (values.discount_price > 0 && values.discount_price >= values.price)
    e.discount_price = "Discount price must be less than the full price.";

  if (values.stock < 0) e.stock = "Stock cannot be negative.";
  if (!Number.isInteger(values.stock))
    e.stock = "Stock must be a whole number.";

  if (!values.category) e.category = "Category is required.";
  if (!values.condition) e.condition = "Condition is required.";
  if (!values.shop_name.trim()) e.shop_name = "Shop name is required.";

  if (values.main_url && !/^https?:\/\/.+\..+/i.test(values.main_url))
    e.main_url = "Please enter a valid URL (starting with http:// or https://)";

  return e;
}

// ─── Initial values ───────────────────────────────────────────────────────────

function toFormValues(p: MockProduct | null): ProductFormValues {
  return {
    title: p?.title ?? "",
    price: p?.price ?? 0,
    discount_price: p?.discount_price ?? 0,
    category: p?.category ?? "Home & Living",
    condition: p?.condition ?? "new",
    stock: p?.stock ?? 0,
    short_description: p?.short_description ?? "",
    main_url: p?.main_url ?? "",
    is_featured: p?.is_featured ?? false,
    is_bestseller: p?.is_bestseller ?? false,
    is_deal: p?.is_deal ?? false,
    shop_name: p?.shop_name ?? "",
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label
        style={{
          fontSize: 12,
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 600,
          color: "#374151",
        }}
      >
        {label}
        {required && <span style={{ color: "#EF4444", marginLeft: 2 }}>*</span>}
      </label>
      {children}
      {error && (
        <span
          style={{
            fontSize: 11,
            color: "#EF4444",
            fontFamily: "'Open Sans', sans-serif",
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}

const inputCss = (hasError: boolean): React.CSSProperties => ({
  padding: "10px 14px",
  border: `1.5px solid ${hasError ? "#EF4444" : "#E5E7EB"}`,
  borderRadius: 10,
  fontSize: 14,
  fontFamily: "'Open Sans', sans-serif",
  color: "#1F2937",
  background: "#fff",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  width: "100%",
  boxSizing: "border-box",
});

function CheckToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 40,
          height: 22,
          borderRadius: 11,
          background: checked ? "#7C3AED" : "#D1D5DB",
          position: "relative",
          transition: "background 0.2s",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 2,
            left: checked ? 18 : 2,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#fff",
            transition: "left 0.2s",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}
        />
      </div>
      <span
        style={{
          fontSize: 13,
          fontFamily: "'Open Sans', sans-serif",
          color: "#374151",
        }}
      >
        {label}
      </span>
    </label>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

export function ProductModal(props: Props) {
  return (
    <ProductModalContent
      key={props.product?.id ?? props.product?.title ?? "create-product"}
      {...props}
    />
  );
}
function ProductModalContent({
  open,
  product,
  submitting,
  submitError,
  onClose,
  onSave,
}: Props) {
  const [values, setValues] = useState<ProductFormValues>(() =>
    toFormValues(product),
  );
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Focus first field when modal opens
  useEffect(() => {
    if (open) setTimeout(() => firstFieldRef.current?.focus(), 80);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const set = useCallback(
    <K extends keyof ProductFormValues>(key: K, val: ProductFormValues[K]) => {
      setValues((prev) => ({ ...prev, [key]: val }));
      if (touched) setErrors((prev) => ({ ...prev, [key]: undefined }));
    },
    [touched],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setTouched(true);
      const errs = validate(values);
      setErrors(errs);
      if (Object.keys(errs).length === 0) onSave(values);
    },
    [values, onSave],
  );

  if (!open) return null;

  const isEdit = !!product;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15,15,40,0.45)",
          backdropFilter: "blur(4px)",
          zIndex: 1000,
          animation: "fadeIn 0.2s ease",
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100%",
          width: "100%",
          maxWidth: 680,
          background: "#fff",
          zIndex: 1001,
          overflowY: "auto",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.18)",
          animation: "slideInRight 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)",
            padding: "20px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 11,
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                color: "rgba(255,255,255,0.7)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {isEdit ? "Editing product" : "New product"}
            </p>
            <h2
              style={{
                margin: "4px 0 0",
                fontSize: 20,
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                color: "#fff",
              }}
            >
              {isEdit ? product.title : "Add a product"}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "none",
              background: "rgba(255,255,255,0.18)",
              color: "#fff",
              fontSize: 18,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span className="material-icons" style={{ fontSize: 20, lineHeight: 1 }}>close</span>
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          style={{
            padding: "28px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {submitError && (
            <div
              style={{
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: 10,
                padding: "12px 16px",
                color: "#DC2626",
                fontSize: 13,
              }}
            >
              <span className="material-icons" style={{ fontSize: 18, lineHeight: 1, verticalAlign: 'middle', marginRight: 6 }}>warning</span>{submitError}
            </div>
          )}

          {/* Title */}
          <Field label="Product title" error={errors.title} required>
            <input
              ref={firstFieldRef}
              type="text"
              value={values.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Hand-Poured Lavender Soy Candle"
              style={inputCss(!!errors.title)}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#7C3AED";
                e.currentTarget.style.boxShadow = "0 0 0 3px #EDE9FE";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.title
                  ? "#EF4444"
                  : "#E5E7EB";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </Field>

          {/* Description */}
          <Field
            label="Short description"
            error={errors.short_description}
            required
          >
            <textarea
              value={values.short_description}
              onChange={(e) => set("short_description", e.target.value)}
              placeholder="Describe your product in a sentence or two…"
              rows={3}
              style={{
                ...inputCss(!!errors.short_description),
                resize: "vertical",
                lineHeight: 1.6,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#7C3AED";
                e.currentTarget.style.boxShadow = "0 0 0 3px #EDE9FE";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.short_description
                  ? "#EF4444"
                  : "#E5E7EB";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            <span
              style={{ fontSize: 11, color: "#9CA3AF", textAlign: "right" }}
            >
              {values.short_description.length}/500
            </span>
          </Field>

          {/* Price row */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            <Field label="Full price (USD)" error={errors.price} required>
              <input
                type="number"
                min={0.01}
                step={0.01}
                value={values.price || ""}
                onChange={(e) => set("price", parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                style={inputCss(!!errors.price)}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#7C3AED";
                  e.currentTarget.style.boxShadow = "0 0 0 3px #EDE9FE";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.price
                    ? "#EF4444"
                    : "#E5E7EB";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </Field>
            <Field label="Sale price (optional)" error={errors.discount_price}>
              <input
                type="number"
                min={0}
                step={0.01}
                value={values.discount_price || ""}
                onChange={(e) =>
                  set("discount_price", parseFloat(e.target.value) || 0)
                }
                placeholder="Leave 0 if no discount"
                style={inputCss(!!errors.discount_price)}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#7C3AED";
                  e.currentTarget.style.boxShadow = "0 0 0 3px #EDE9FE";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.discount_price
                    ? "#EF4444"
                    : "#E5E7EB";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </Field>
          </div>

          {/* Category + Condition */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            <Field label="Category" error={errors.category} required>
              <select
                value={values.category}
                onChange={(e) => set("category", e.target.value)}
                style={{
                  ...inputCss(!!errors.category),
                  appearance: "none",
                  cursor: "pointer",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#7C3AED";
                  e.currentTarget.style.boxShadow = "0 0 0 3px #EDE9FE";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.category
                    ? "#EF4444"
                    : "#E5E7EB";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {CATEGORIES.filter((c) => c !== "All").map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Condition" error={errors.condition} required>
              <select
                value={values.condition}
                onChange={(e) =>
                  set(
                    "condition",
                    e.target.value as "new" | "used" | "refurbished",
                  )
                }
                style={{
                  ...inputCss(!!errors.condition),
                  appearance: "none",
                  cursor: "pointer",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#7C3AED";
                  e.currentTarget.style.boxShadow = "0 0 0 3px #EDE9FE";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.condition
                    ? "#EF4444"
                    : "#E5E7EB";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {CONDITIONS.filter((c) => c !== "All").map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* Stock + Shop */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            <Field label="Stock quantity" error={errors.stock} required>
              <input
                type="number"
                min={0}
                step={1}
                value={values.stock || ""}
                onChange={(e) => set("stock", parseInt(e.target.value) || 0)}
                placeholder="0"
                style={inputCss(!!errors.stock)}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#7C3AED";
                  e.currentTarget.style.boxShadow = "0 0 0 3px #EDE9FE";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.stock
                    ? "#EF4444"
                    : "#E5E7EB";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </Field>
            <Field label="Shop name" error={errors.shop_name} required>
              <input
                type="text"
                value={values.shop_name}
                onChange={(e) => set("shop_name", e.target.value)}
                placeholder="Your shop name"
                style={inputCss(!!errors.shop_name)}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#7C3AED";
                  e.currentTarget.style.boxShadow = "0 0 0 3px #EDE9FE";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.shop_name
                    ? "#EF4444"
                    : "#E5E7EB";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </Field>
          </div>

          {/* Image URL */}
          <Field label="Image URL" error={errors.main_url}>
            <input
              type="url"
              value={values.main_url}
              onChange={(e) => set("main_url", e.target.value)}
              placeholder="https://example.com/image.jpg"
              style={inputCss(!!errors.main_url)}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#7C3AED";
                e.currentTarget.style.boxShadow = "0 0 0 3px #EDE9FE";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.main_url
                  ? "#EF4444"
                  : "#E5E7EB";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            {values.main_url && !errors.main_url && (
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 10,
                  overflow: "hidden",
                  marginTop: 6,
                  border: "1px solid #E5E7EB",
                }}
              >
                <Image
                  src={values.main_url}
                  alt="Product preview"
                  width={600}
                  height={360}
                  unoptimized
                  style={{
                    width: "100%",
                    height: 180,
                    objectFit: "cover",
                    borderRadius: 12,
                  }}
                />
              </div>
            )}
          </Field>

          {/* Toggles */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              padding: "16px",
              background: "#FAFBFF",
              borderRadius: 12,
              border: "1px solid #EDE9FE",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 12,
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                color: "#7C3AED",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
              }}
            >
              Product flags
            </p>
            <CheckToggle
              label="Featured product"
              checked={values.is_featured}
              onChange={(v) => set("is_featured", v)}
            />
            <CheckToggle
              label="Bestseller"
              checked={values.is_bestseller}
              onChange={(v) => set("is_bestseller", v)}
            />
            <CheckToggle
              label="On deal / sale"
              checked={values.is_deal}
              onChange={(v) => set("is_deal", v)}
            />
          </div>

          {/* Footer buttons */}
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "flex-end",
              paddingTop: 8,
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              style={{
                padding: "11px 24px",
                borderRadius: 10,
                border: "1.5px solid #E5E7EB",
                background: "#fff",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                fontSize: 14,
                color: "#6B7280",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: "11px 28px",
                borderRadius: 10,
                border: "none",
                background: submitting ? "#A78BFA" : "#7C3AED",
                color: "#fff",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                fontSize: 14,
                cursor: submitting ? "not-allowed" : "pointer",
                boxShadow: "0 4px 14px rgba(124,58,237,0.28)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {submitting && (
                <span
                  style={{
                    display: "inline-block",
                    width: 14,
                    height: 14,
                    border: "2px solid rgba(255,255,255,0.4)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
              )}
              {submitting
                ? "Saving…"
                : isEdit
                  ? "Save changes"
                  : "Create product"}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
