'use client';
import React from 'react';
import Image from 'next/image';
import { productImageSrc, type MockProduct } from '@/services/mockProductApi';

interface Props {
  products: MockProduct[];
  loading: boolean;
  onEdit: (p: MockProduct) => void;
  onDelete: (p: MockProduct) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function MaterialIcon({ name, size = 20, color = 'inherit' }: { name: string; size?: number; color?: string }) {
  return (
    <span className="material-icons" style={{ fontSize: size, color, lineHeight: 1, verticalAlign: 'middle' }}>
      {name}
    </span>
  );
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);

function Badge({ text, color }: { text: string; color: string }) {
  const styles: Record<string, React.CSSProperties> = {
    green:  { background: '#D1FAE5', color: '#065F46' },
    amber:  { background: '#FEF3C7', color: '#92400E' },
    purple: { background: '#EDE9FE', color: '#5B21B6' },
    red:    { background: '#FEE2E2', color: '#991B1B' },
    gray:   { background: '#F3F4F6', color: '#374151' },
  };
  return (
    <span style={{
      display: 'inline-block',
      fontSize: 10,
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      padding: '2px 8px',
      borderRadius: 50,
      whiteSpace: 'nowrap',
      ...styles[color],
    }}>
      {text}
    </span>
  );
}

function StockIndicator({ qty }: { qty: number }) {
  if (qty === 0) return <Badge text="Out of stock" color="red" />;
  if (qty <= 5) return <Badge text={`Low (${qty})`} color="amber" />;
  return <span style={{ fontSize: 13, color: '#1F2937' }}>{qty}</span>;
}

function Stars({ rating }: { rating: number }) {
  if (!rating) return <span style={{ fontSize: 12, color: '#9CA3AF' }}>No reviews</span>;
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <MaterialIcon
          key={i}
          name={i < Math.round(rating) ? 'star' : 'star_border'}
          size={15}
          color={i < Math.round(rating) ? '#F4A261' : '#D1D5DB'}
        />
      ))}
      <span style={{ fontSize: 11, color: '#6B7280' }}> {rating.toFixed(1)}</span>
    </span>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const skimmer: React.CSSProperties = {
  background: 'linear-gradient(90deg,#EDE9FE 25%,#F5F3FF 50%,#EDE9FE 75%)',
  backgroundSize: '600px 100%',
  animation: 'shimmer 1.4s ease-in-out infinite',
  borderRadius: 6,
};

function SkeletonRow() {
  return (
    <tr>
      {[56, 180, 80, 70, 60, 60, 90].map((w, i) => (
        <td key={i} style={{ padding: '14px 12px' }}>
          <div style={{ ...skimmer, height: i === 0 ? 48 : 14, width: i === 0 ? 48 : w, borderRadius: i === 0 ? 10 : 6 }} />
        </td>
      ))}
    </tr>
  );
}

// ─── Main table ───────────────────────────────────────────────────────────────

const TH: React.CSSProperties = {
  padding: '12px 12px',
  textAlign: 'left',
  fontSize: 11,
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 700,
  color: '#6B7280',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  borderBottom: '2px solid #F3F4F6',
  whiteSpace: 'nowrap',
};

const TD: React.CSSProperties = {
  padding: '14px 12px',
  verticalAlign: 'middle',
  borderBottom: '1px solid #F9FAFB',
};

export function ProductTable({ products, loading, onEdit, onDelete }: Props) {
  return (
    <div style={{ overflowX: 'auto', borderRadius: 16, border: '1px solid #E5E7EB', background: '#fff' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
        <thead>
          <tr style={{ background: '#FAFAFA' }}>
            <th style={TH}>Product</th>
            <th style={TH}>Details</th>
            <th style={TH}>Price</th>
            <th style={TH}>Stock</th>
            <th style={TH}>Rating</th>
            <th style={TH}>Badges</th>
            <th style={{ ...TH, textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
            : products.length === 0
              ? (
                <tr>
                  <td colSpan={7} style={{ padding: '60px 24px', textAlign: 'center', color: '#9CA3AF', fontFamily: "'Open Sans', sans-serif" }}>
                    <div style={{ marginBottom: 12 }}><MaterialIcon name="inventory_2" size={44} color="#9CA3AF" /></div>
                    <p style={{ margin: 0, fontWeight: 600 }}>No products found</p>
                    <p style={{ margin: '4px 0 0', fontSize: 13 }}>Try adjusting your search or filters.</p>
                  </td>
                </tr>
              )
              : products.map(p => (
                <tr
                  key={p.id}
                  style={{ transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#FAFBFF')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Image + title */}
                  <td style={TD}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ position: 'relative', width: 52, height: 52, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: '#F3F4F6' }}>
                        {p.main_url
                          ? <Image src={productImageSrc(p.main_url)} alt={p.title} fill unoptimized style={{ objectFit: 'cover' }} sizes="52px" />
                          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MaterialIcon name="shopping_bag" size={26} color="#9CA3AF" /></div>
                        }
                      </div>
                      <div>
                        <p style={{ margin: 0, fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 13, color: '#1F2937', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {p.title}
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: 11, color: '#9CA3AF' }}>{p.shop_name}</p>
                      </div>
                    </div>
                  </td>

                  {/* Category + condition */}
                  <td style={TD}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <Badge text={p.category} color="purple" />
                      <Badge text={p.condition} color={p.condition === 'new' ? 'green' : p.condition === 'used' ? 'amber' : 'gray'} />
                    </div>
                  </td>

                  {/* Price */}
                  <td style={TD}>
                    <div>
                      <p style={{ margin: 0, fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 14, color: '#7C3AED' }}>
                        {fmt(p.discount_price && p.discount_price > 0 ? p.discount_price : p.price)}
                      </p>
                      {p.discount_price > 0 && (
                        <p style={{ margin: '2px 0 0', fontSize: 11, color: '#9CA3AF', textDecoration: 'line-through' }}>
                          {fmt(p.price)}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Stock */}
                  <td style={TD}><StockIndicator qty={p.stock} /></td>

                  {/* Rating */}
                  <td style={TD}><Stars rating={p.rating} /></td>

                  {/* Badges */}
                  <td style={TD}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {p.is_featured   && <Badge text="Featured"   color="purple" />}
                      {p.is_bestseller && <Badge text="Bestseller" color="amber" />}
                      {p.is_deal       && <Badge text="Deal"       color="red" />}
                    </div>
                  </td>

                  {/* Actions */}
                  <td style={{ ...TD, textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <ActionBtn icon="edit" label="Edit" onClick={() => onEdit(p)} variant="outline" />
                      <ActionBtn icon="delete" label="Delete" onClick={() => onDelete(p)} variant="danger" />
                    </div>
                  </td>
                </tr>
              ))
          }
        </tbody>
      </table>
    </div>
  );
}

function ActionBtn({
  icon,
  label,
  onClick,
  variant,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  variant: 'outline' | 'danger';
}) {
  const base: React.CSSProperties = {
    padding: '6px 14px',
    borderRadius: 8,
    fontSize: 12,
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.18s',
    whiteSpace: 'nowrap',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
  };
  const variants = {
    outline: { background: '#F5F3FF', color: '#7C3AED', border: '1.5px solid #DDD6FE' },
    danger:  { background: '#FEF2F2', color: '#DC2626', border: '1.5px solid #FECACA' },
  };
  return (
    <button
      style={{ ...base, ...variants[variant] }}
      onClick={onClick}
      onMouseEnter={e => {
        if (variant === 'outline') e.currentTarget.style.background = '#EDE9FE';
        else e.currentTarget.style.background = '#FEE2E2';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = variants[variant].background;
      }}
    >
      <MaterialIcon name={icon} size={15} />
      {label}
    </button>
  );
}