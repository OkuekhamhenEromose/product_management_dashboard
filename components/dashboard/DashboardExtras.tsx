'use client';
/**
 * DashboardExtras.tsx
 * ─────────────────────
 * Two reusable pieces exported from one file:
 *
 *   <DashboardStats />   — top KPI row (total products, in-stock, on-deal, featured)
 *   <DashboardPagination /> — page navigation with prev/next + page numbers
 */

import React from 'react';
import type { MockProduct } from '@/services/mockProductApi';

// ─── Stats ────────────────────────────────────────────────────────────────────

interface StatsProps {
  products: MockProduct[];
  totalCount: number;
  loading: boolean;
}

interface StatCard {
  label: string;
  value: number | string;
  icon: string;
  color: string;
  bg: string;
}

const shimmer: React.CSSProperties = {
  background: 'linear-gradient(90deg,#EDE9FE 25%,#F5F3FF 50%,#EDE9FE 75%)',
  backgroundSize: '600px 100%',
  animation: 'shimmer 1.4s ease-in-out infinite',
  borderRadius: 8,
};

export function DashboardStats({ products, totalCount, loading }: StatsProps) {
  const inStock   = products.filter(p => p.stock > 0).length;
  const onDeal    = products.filter(p => p.is_deal).length;
  const featured  = products.filter(p => p.is_featured).length;
  const lowStock  = products.filter(p => p.stock > 0 && p.stock <= 5).length;

  const cards: StatCard[] = [
    { label: 'Total products',  value: totalCount, icon: 'inventory_2', color: '#7C3AED', bg: '#EDE9FE' },
    { label: 'In stock (page)', value: inStock,    icon: 'check_circle', color: '#059669', bg: '#D1FAE5' },
    { label: 'Active deals',    value: onDeal,     icon: 'local_fire_department', color: '#DC2626', bg: '#FEE2E2' },
    { label: 'Featured',        value: featured,   icon: 'star', color: '#B45309', bg: '#FEF3C7' },
    { label: 'Low stock',       value: lowStock,   icon: 'warning', color: '#D97706', bg: '#FFFBEB' },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
      gap: 14,
      marginBottom: 24,
    }}>
      {cards.map(card => (
        <div key={card.label} style={{
          background: '#fff',
          borderRadius: 14,
          padding: '16px 18px',
          border: '1px solid #E5E7EB',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: card.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, flexShrink: 0, color: card.color,
          }}>
            <span className="material-icons" style={{ fontSize: 22, lineHeight: 1 }}>{card.icon}</span>
          </div>
          <div>
            {loading
              ? <>
                  <div style={{ ...shimmer, height: 20, width: 40, marginBottom: 4 }} />
                  <div style={{ ...shimmer, height: 11, width: 70 }} />
                </>
              : <>
                  <p style={{ margin: 0, fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: 20, color: card.color, lineHeight: 1 }}>
                    {card.value}
                  </p>
                  <p style={{ margin: '3px 0 0', fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: '#6B7280', lineHeight: 1.3 }}>
                    {card.label}
                  </p>
                </>
            }
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export function DashboardPagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  loading,
}: PaginationProps) {
  if (totalPages <= 1 && !loading) return null;

  const start = (currentPage - 1) * pageSize + 1;
  const end   = Math.min(currentPage * pageSize, totalCount);

  // Build page numbers array: show up to 7 items with ellipsis
  function pageNumbers(): (number | '…')[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '…')[] = [1];
    if (currentPage > 3) pages.push('…');
    for (let p = Math.max(2, currentPage - 1); p <= Math.min(totalPages - 1, currentPage + 1); p++) {
      pages.push(p);
    }
    if (currentPage < totalPages - 2) pages.push('…');
    pages.push(totalPages);
    return pages;
  }

  const btnBase: React.CSSProperties = {
    width: 36, height: 36, borderRadius: 10,
    borderWidth: 1.5, borderStyle: 'solid', borderColor: '#E5E7EB',
    background: '#fff',
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600, fontSize: 13,
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.18s',
    color: '#374151',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, paddingTop: 20 }}>
      {/* Info text */}
      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: '#6B7280' }}>
        {loading ? 'Loading…' : `Showing ${start}–${end} of ${totalCount} products`}
      </span>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {/* Prev */}
        <button
          style={{ ...btnBase, opacity: currentPage === 1 || loading ? 0.4 : 1, cursor: currentPage === 1 || loading ? 'not-allowed' : 'pointer' }}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          aria-label="Previous page"
        >
          <span className="material-icons" style={{ fontSize: 22, lineHeight: 1 }}>chevron_left</span>
        </button>

        {/* Page numbers */}
        {pageNumbers().map((p, i) =>
          p === '…'
            ? <span key={`e${i}`} style={{ width: 36, textAlign: 'center', color: '#9CA3AF', fontSize: 14 }}>…</span>
            : (
              <button
                key={p}
                style={{
                  ...btnBase,
                  ...(p === currentPage ? {
                    background: '#7C3AED',
                    borderColor: '#7C3AED',
                    color: '#fff',
                    boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
                  } : {}),
                }}
                onClick={() => typeof p === 'number' && onPageChange(p)}
                disabled={loading}
              >
                {p}
              </button>
            )
        )}

        {/* Next */}
        <button
          style={{ ...btnBase, opacity: currentPage === totalPages || loading ? 0.4 : 1, cursor: currentPage === totalPages || loading ? 'not-allowed' : 'pointer' }}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          aria-label="Next page"
        >
          <span className="material-icons" style={{ fontSize: 22, lineHeight: 1 }}>chevron_right</span>
        </button>
      </div>

      {/* Page size note */}
      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#9CA3AF' }}>
        {pageSize} per page
      </span>
    </div>
  );
}