'use client';
/**
 * DeleteModal.tsx
 * ─────────────────
 * FIXED: "React Hook useEffect is called conditionally"
 *
 * The original code had an early `return null` BEFORE the useEffect,
 * which means the hook was only called when `product !== null`.
 * React requires all hooks to run unconditionally on every render.
 *
 * Fix: move useEffect above the early return, guard the listener
 *      registration inside the effect body instead.
 */

import React, { useEffect } from 'react';
import Image from 'next/image';
import type { MockProduct } from '@/services/mockProductApi';

interface Props {
  product:    MockProduct | null;
  submitting: boolean;
  onConfirm:  () => void;
  onCancel:   () => void;
}

export function DeleteModal({ product, submitting, onConfirm, onCancel }: Props) {
  /**
   * FIX: useEffect is now UNCONDITIONAL — it always runs.
   * We guard the actual listener registration with `if (!product) return`
   * inside the effect body, which is perfectly legal.
   */
  useEffect(() => {
    if (!product) return; // guard inside the effect, not before it

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [product, onCancel]); // product added to deps so listener attaches/detaches correctly

  // Early return (after all hooks) — this is fine.
  if (!product) return null;

  return (
    <>
      {/* ── Backdrop ──────────────────────────────────────────────────── */}
      <div
        onClick={!submitting ? onCancel : undefined}
        style={{
          position:      'fixed',
          inset:         0,
          background:    'rgba(15,15,40,0.5)',
          backdropFilter:'blur(5px)',
          zIndex:        1200,
          display:       'flex',
          alignItems:    'center',
          justifyContent:'center',
          padding:       24,
          animation:     'fadeIn 0.2s ease',
        }}
      >
        {/* ── Card ──────────────────────────────────────────────────── */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background:   '#fff',
            borderRadius: 20,
            padding:      32,
            maxWidth:     420,
            width:        '100%',
            boxShadow:    '0 24px 80px rgba(0,0,0,0.2)',
            animation:    'popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
            textAlign:    'center',
          }}
        >
          {/* Danger icon */}
          <div
            style={{
              width: 64, height: 64, borderRadius: '50%',
              background: '#FEE2E2', margin: '0 auto 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28,
            }}
          >
            <span className="material-icons" style={{ fontSize: 32, lineHeight: 1, color: '#DC2626' }}>delete</span>
          </div>

          <h2
            style={{
              margin: '0 0 8px',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 800,
              fontSize:   20,
              color:      '#1F2937',
            }}
          >
            Delete product?
          </h2>

          <p
            style={{
              margin: '0 0 20px',
              color: '#6B7280',
              fontSize: 14,
              lineHeight: 1.6,
              fontFamily: "'Open Sans', sans-serif",
            }}
          >
            This action is <strong>permanent</strong>. The product will be
            removed from your store immediately.
          </p>

          {/* Product preview strip */}
          <div
            style={{
              display:      'flex',
              alignItems:   'center',
              gap:          12,
              background:   '#FEF2F2',
              borderRadius: 12,
              padding:      '12px 16px',
              border:       '1px solid #FECACA',
              marginBottom: 24,
              textAlign:    'left',
            }}
          >
            <div
              style={{
                position:     'relative',
                width:        48,
                height:       48,
                borderRadius: 8,
                overflow:     'hidden',
                flexShrink:   0,
                background:   '#F3F4F6',
              }}
            >
              {product.main_url ? (
                <Image
                  src={product.main_url}
                  alt={product.title}
                  fill
                  unoptimized
                  style={{ objectFit: 'cover' }}
                  sizes="48px"
                />
              ) : (
                <div
                  style={{
                    width: '100%', height: '100%',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 22,
                  }}
                >
                  <span className="material-icons" style={{ fontSize: 24, lineHeight: 1, color: '#9CA3AF' }}>shopping_bag</span>
                </div>
              )}
            </div>

            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  margin:       0,
                  fontFamily:   "'Poppins', sans-serif",
                  fontWeight:   600,
                  fontSize:     13,
                  color:        '#DC2626',
                  whiteSpace:   'nowrap',
                  overflow:     'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {product.title}
              </p>
              <p
                style={{
                  margin: '2px 0 0',
                  fontSize: 12,
                  color: '#9CA3AF',
                  fontFamily: "'Open Sans', sans-serif",
                }}
              >
                {product.shop_name} · {product.category}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={onCancel}
              disabled={submitting}
              style={{
                flex: 1, padding: '12px', borderRadius: 12,
                border: '1.5px solid #E5E7EB', background: '#fff',
                fontFamily: "'Poppins', sans-serif", fontWeight: 600,
                fontSize: 14, color: '#6B7280',
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={submitting}
              style={{
                flex: 1, padding: '12px', borderRadius: 12,
                border: 'none',
                background: submitting ? '#F87171' : '#DC2626',
                fontFamily: "'Poppins', sans-serif", fontWeight: 700,
                fontSize: 14, color: '#fff',
                cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(220,38,38,0.3)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 8,
              }}
            >
              {submitting && (
                <span
                  style={{
                    display: 'inline-block', width: 14, height: 14,
                    border: '2px solid rgba(255,255,255,0.4)',
                    borderTopColor: '#fff', borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite',
                  }}
                />
              )}
              {submitting ? 'Deleting…' : 'Yes, delete it'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; }           to { opacity: 1; } }
        @keyframes popIn  { from { transform: scale(0.88); opacity: 0; }
                            to   { transform: scale(1);    opacity: 1; } }
        @keyframes spin   { to   { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}