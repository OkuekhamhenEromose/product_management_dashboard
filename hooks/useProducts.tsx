'use client';
/**
 * hooks/useProducts.tsx          ← .tsx extension is REQUIRED (file contains JSX)
 * ──────────────────────────────
 * FIXED:
 *  • Renamed from .ts → .tsx so the JSX in <ProductsProvider> parses correctly.
 *    The original "Parsing error: '>' expected" was caused by TypeScript treating
 *    `<Ctx.Provider …>` as a broken generic expression inside a plain .ts file.
 *  • All types remain identical — change only the file extension on disk.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';

import {
  fetchProducts,
  fetchProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  type MockProduct,
  type ProductFilters,
  type ProductsPage,
} from '@/services/mockProductApi';

// ─── Types ────────────────────────────────────────────────────────────────────

export type { MockProduct, ProductFilters };

export type ProductFormValues = Omit<
  MockProduct,
  'id' | 'created_at' | 'slug' | 'rating' | 'review_count'
>;

type State = {
  page:         ProductsPage | null;
  detail:       MockProduct | null;
  filters:      ProductFilters;
  loading:      boolean;
  submitting:   boolean;
  error:        string | null;
  submitError:  string | null;
};

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_OK';    payload: ProductsPage }
  | { type: 'FETCH_ERR';   error:   string }
  | { type: 'DETAIL_OK';   payload: MockProduct }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_OK' }
  | { type: 'SUBMIT_ERR';  error:   string }
  | { type: 'SET_FILTERS'; filters: Partial<ProductFilters> }
  | { type: 'CLEAR_ERRORS' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':  return { ...state, loading: true, error: null };
    case 'FETCH_OK':     return { ...state, loading: false, page: action.payload };
    case 'FETCH_ERR':    return { ...state, loading: false, error: action.error };
    case 'DETAIL_OK':    return { ...state, detail: action.payload };
    case 'SUBMIT_START': return { ...state, submitting: true, submitError: null };
    case 'SUBMIT_OK':    return { ...state, submitting: false };
    case 'SUBMIT_ERR':   return { ...state, submitting: false, submitError: action.error };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.filters, page: action.filters.page ?? 1 },
      };
    case 'CLEAR_ERRORS': return { ...state, error: null, submitError: null };
    default:             return state;
  }
}

const INITIAL: State = {
  page: null, detail: null,
  filters: { page: 1, page_size: 8, sort: '-created_at' },
  loading: false, submitting: false, error: null, submitError: null,
};

// ─── Context ──────────────────────────────────────────────────────────────────

type ContextValue = {
  products:    MockProduct[];
  totalCount:  number;
  totalPages:  number;
  currentPage: number;
  filters:     ProductFilters;
  loading:     boolean;
  submitting:  boolean;
  error:       string | null;
  submitError: string | null;
  setFilters:  (f: Partial<ProductFilters>) => void;
  reload:      () => void;
  getProduct:  (id: string) => Promise<MockProduct>;
  create:      (data: ProductFormValues) => Promise<MockProduct>;
  update:      (id: string, data: Partial<ProductFormValues>) => Promise<MockProduct>;
  remove:      (id: string) => Promise<void>;
  clearErrors: () => void;
};

const Ctx = createContext<ContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL);

  const load = useCallback(async (filters: ProductFilters) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const data = await fetchProducts(filters);
      dispatch({ type: 'FETCH_OK', payload: data });
    } catch (err: unknown) {
      dispatch({
        type:  'FETCH_ERR',
        error: err instanceof Error ? err.message : 'Failed to load products',
      });
    }
  }, []);

  useEffect(() => {
    load(state.filters);
  }, [state.filters, load]);

  const setFilters = useCallback(
    (f: Partial<ProductFilters>) => dispatch({ type: 'SET_FILTERS', filters: f }),
    [],
  );

  const reload = useCallback(() => load(state.filters), [load, state.filters]);

  const getProduct = useCallback(async (id: string): Promise<MockProduct> => {
    const product = await fetchProduct(id);
    dispatch({ type: 'DETAIL_OK', payload: product });
    return product;
  }, []);

  const create = useCallback(async (data: ProductFormValues): Promise<MockProduct> => {
    dispatch({ type: 'SUBMIT_START' });
    try {
      const product = await createProduct(data);
      dispatch({ type: 'SUBMIT_OK' });
      reload();
      return product;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create product';
      dispatch({ type: 'SUBMIT_ERR', error: message });
      throw err;
    }
  }, [reload]);

  const update = useCallback(
    async (id: string, data: Partial<ProductFormValues>): Promise<MockProduct> => {
      dispatch({ type: 'SUBMIT_START' });
      try {
        const product = await updateProduct(id, data);
        dispatch({ type: 'SUBMIT_OK' });
        reload();
        return product;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to update product';
        dispatch({ type: 'SUBMIT_ERR', error: message });
        throw err;
      }
    },
    [reload],
  );

  const remove = useCallback(async (id: string): Promise<void> => {
    dispatch({ type: 'SUBMIT_START' });
    try {
      await deleteProduct(id);
      dispatch({ type: 'SUBMIT_OK' });
      reload();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete product';
      dispatch({ type: 'SUBMIT_ERR', error: message });
      throw err;
    }
  }, [reload]);

  const clearErrors = useCallback(() => dispatch({ type: 'CLEAR_ERRORS' }), []);

  const value: ContextValue = {
    products:    state.page?.results ?? [],
    totalCount:  state.page?.count ?? 0,
    totalPages:  state.page?.total_pages ?? 1,
    currentPage: state.filters.page ?? 1,
    filters:     state.filters,
    loading:     state.loading,
    submitting:  state.submitting,
    error:       state.error,
    submitError: state.submitError,
    setFilters, reload, getProduct, create, update, remove, clearErrors,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// ─── Consumer hook ────────────────────────────────────────────────────────────

export function useProducts(): ContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useProducts must be used within <ProductsProvider>');
  return ctx;
}