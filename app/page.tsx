'use client';

import React, { useCallback, useState } from 'react';
import Link from 'next/link';

import { ProductsProvider, useProducts } from '@/hooks/useProducts';
import type { MockProduct, ProductFormValues } from '@/hooks/useProducts';

import { SearchFilter }       from '@/components/dashboard/SearchFilter';
import { ProductTable }       from '@/components/dashboard/ProductTable';
import { ProductModal }       from '@/components/dashboard/ProductModal';
import { DeleteModal }        from '@/components/dashboard/DeleteModal';
import { DashboardStats, DashboardPagination } from '@/components/dashboard/DashboardExtras';

// ─── Inner dashboard (has access to the context) ─────────────────────────────

function DashboardInner() {
  const {
    products, totalCount, totalPages, currentPage, filters,
    loading, submitting, error, submitError,
    setFilters, create, update, remove, clearErrors,
  } = useProducts();

  // ── Modal state ─────────────────────────────────────────────────────────────
  const [editTarget,   setEditTarget]   = useState<MockProduct | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MockProduct | null>(null);
  const [modalOpen,    setModalOpen]    = useState(false);

  const openCreate = useCallback(() => {
    clearErrors();
    setEditTarget(null);
    setModalOpen(true);
  }, [clearErrors]);

  const openEdit = useCallback((p: MockProduct) => {
    clearErrors();
    setEditTarget(p);
    setModalOpen(true);
  }, [clearErrors]);

  const openDelete = useCallback((p: MockProduct) => {
    clearErrors();
    setDeleteTarget(p);
  }, [clearErrors]);

  const closeModal  = useCallback(() => { setModalOpen(false);    setEditTarget(null); }, []);
  const closeDelete = useCallback(() => { setDeleteTarget(null); }, []);

  // ── CRUD handlers ────────────────────────────────────────────────────────────
  const handleSave = useCallback(async (data: ProductFormValues) => {
    try {
      if (editTarget) {
        await update(editTarget.id, data);
      } else {
        await create(data);
      }
      closeModal();
    } catch {
      // submitError is surfaced by the hook → displayed in ProductModal
    }
  }, [editTarget, create, update, closeModal]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await remove(deleteTarget.id);
      closeDelete();
    } catch {
      // error handled by hook
    }
  }, [deleteTarget, remove, closeDelete]);

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#FAF5FF', fontFamily: "'Open Sans', sans-serif" }}>

      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)',
        padding: '0 24px',
        boxShadow: '0 4px 20px rgba(124,58,237,0.25)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68, gap: 16 }}>
          {/* Left: breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
              <span className="material-icons" style={{ fontSize: 24, color: '#fff', lineHeight: 1 }}>storefront</span>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: 18, color: '#fff' }}>Shopa</span>
            </Link>
            <span className="material-icons" style={{ color: 'rgba(255,255,255,0.45)', fontSize: 20, lineHeight: 1 }}>chevron_right</span>
            <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>
              Seller Dashboard
            </span>
          </div>

          {/* Right: add button */}
          <button
            onClick={openCreate}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 20px', borderRadius: 50,
              border: 'none', background: '#F4A261',
              fontFamily: "'Poppins', sans-serif", fontWeight: 700,
              fontSize: 13, color: '#1F2937', cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(244,162,97,0.45)',
              whiteSpace: 'nowrap',
            }}
          >
            <span className="material-icons" style={{ fontSize: 18, lineHeight: 1 }}>add</span>
            Add product
          </button>
        </div>
      </div>

      {/* ── Page body ───────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px 60px' }}>

        {/* Title row */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: 'clamp(22px, 3vw, 30px)', color: '#1F2937' }}>
            Product Management
          </h1>
          <p style={{ margin: '6px 0 0', color: '#6B7280', fontSize: 14 }}>
            View, search, create, edit and delete your product catalogue.
          </p>
        </div>

        {/* Global error */}
        {error && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA',
            borderRadius: 10, padding: '14px 18px', marginBottom: 20,
            display: 'flex', alignItems: 'center', gap: 12, color: '#DC2626', fontSize: 14,
          }}>
            <span className="material-icons" style={{ fontSize: 22, lineHeight: 1 }}>warning</span>
            <span>{error}</span>
            <button
              onClick={clearErrors}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626', fontSize: 18 }}
            >
              <span className="material-icons" style={{ fontSize: 20, lineHeight: 1 }}>close</span>
            </button>
          </div>
        )}

        {/* Stats row */}
        <DashboardStats products={products} totalCount={totalCount} loading={loading} />

        {/* Search + filter bar */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E5E7EB', padding: '16px 20px', marginBottom: 16 }}>
          <SearchFilter
            filters={filters}
            onChange={partial => setFilters(partial)}
          />
        </div>

        {/* Product table */}
        <ProductTable
          products={products}
          loading={loading}
          onEdit={openEdit}
          onDelete={openDelete}
        />

        {/* Pagination */}
        <DashboardPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={filters.page_size ?? 8}
          onPageChange={page => setFilters({ page })}
          loading={loading}
        />
      </div>

      {/* ── Modals ───────────────────────────────────────────────────── */}
      <ProductModal
        open={modalOpen}
        product={editTarget}
        submitting={submitting}
        submitError={submitError}
        onClose={closeModal}
        onSave={handleSave}
      />

      <DeleteModal
        product={deleteTarget}
        submitting={submitting}
        onConfirm={handleDelete}
        onCancel={closeDelete}
      />

      {/* Shimmer keyframes (only defined once here, affect all children) */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }
      `}</style>
    </div>
  );
}

// ─── Page export (wraps the provider) ────────────────────────────────────────

export default function SellerDashboardPage() {
  return (
    <ProductsProvider>
      <DashboardInner />
    </ProductsProvider>
  );
}