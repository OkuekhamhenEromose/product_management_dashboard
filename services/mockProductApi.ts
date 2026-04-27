
// export interface MockProduct {
//   id:                string;
//   title:             string;
//   slug:              string;
//   price:             number;
//   discount_price:    number;
//   category:          string;
//   condition:         'new' | 'used' | 'refurbished';
//   stock:             number;
//   short_description: string;
//   /** Primary image — relative path served from public/images/ */
//   main_url:          string;
//   /** Optional additional images (gallery) */
//   extra_images?:     string[];
//   is_featured:       boolean;
//   is_bestseller:     boolean;
//   is_deal:           boolean;
//   rating:            number;
//   review_count:      number;
//   shop_name:         string;
//   created_at:        string;
// }

// export interface ProductsPage {
//   results:     MockProduct[];
//   count:       number;
//   page:        number;
//   page_size:   number;
//   total_pages: number;
// }

// export interface ProductFilters {
//   search?:    string;
//   category?:  string;
//   condition?: string;
//   min_price?: number;
//   max_price?: number;
//   sort?:      string;
//   page?:      number;
//   page_size?: number;
// }

// // Strongly-typed sortable keys — no `any` needed in comparator.
// type SortableKey = keyof Pick<
//   MockProduct,
//   'price' | 'rating' | 'review_count' | 'title' | 'created_at' | 'stock'
// >;

// // ─── Constants ────────────────────────────────────────────────────────────────

// export const CATEGORIES = [
//   'All',
//   'Home & Living',
//   'Jewellery',
//   'Art',
//   'Beauty',
//   'Accessories',
//   'Gifts',
//   'Food & Drink',
//   'Clothing',
// ];

// export const CONDITIONS = ['All', 'new', 'used', 'refurbished'];

// export const SORT_OPTIONS = [
//   { value: '-created_at', label: 'Newest first' },
//   { value: 'created_at',  label: 'Oldest first' },
//   { value: 'price',       label: 'Price: Low → High' },
//   { value: '-price',      label: 'Price: High → Low' },
//   { value: '-rating',     label: 'Top rated' },
//   { value: 'title',       label: 'A → Z' },
// ];

// /**
//  * Fallback image shown when a product's main_url file is missing.
//  * Replace with your own placeholder inside public/images/.
//  */
// export const PLACEHOLDER_IMAGE = '/images/placeholder.jpg';

// // ─── Image path helper ────────────────────────────────────────────────────────

// /**
//  * Returns the image path to use in <img src> or Next.js <Image src>.
//  * Guarantees a non-empty string — falls back to PLACEHOLDER_IMAGE.
//  *
//  * Usage:
//  *   <Image src={productImageSrc(product.main_url)} alt={product.title} fill />
//  */
// export function productImageSrc(path: string | undefined | null): string {
//   if (!path || path.trim() === '') return PLACEHOLDER_IMAGE;
//   // Already an absolute URL (e.g. during development with Unsplash) → use as-is
//   if (path.startsWith('http://') || path.startsWith('https://')) return path;
//   // Local path — ensure it starts with /
//   return path.startsWith('/') ? path : `/${path}`;
// }

// // ─── Seed data  (all images from public/images/) ──────────────────────────────

// const SEED: Omit<MockProduct, 'id' | 'created_at'>[] = [
//   {
//     title:             'Hand-Poured Lavender Soy Candle',
//     slug:              'lavender-soy-candle',
//     price:             24.99,
//     discount_price:    0,
//     category:          'Home & Living',
//     condition:         'new',
//     stock:             42,
//     short_description: 'Relaxing lavender-scented candle made from 100% natural soy wax.',
//     main_url:          '/images/lavendarcandle2.jpg',
//     extra_images:      ['/images/lavendercandle3.jpg'],
//     is_featured:       true,
//     is_bestseller:     true,
//     is_deal:           false,
//     rating:            4.8,
//     review_count:      312,
//     shop_name:         'WickAndWonder',
//   },
//   {
//     title:             'Personalised Sterling Silver Necklace',
//     slug:              'personalised-silver-necklace',
//     price:             49.95,
//     discount_price:    39.95,
//     category:          'Jewellery',
//     condition:         'new',
//     stock:             15,
//     short_description: 'Engrave your initials on this delicate sterling silver pendant.',
//     main_url:          '/images/silvernecklace2.webp',
//     extra_images:      ['/images/silvernecklace3.jpg'],
//     is_featured:       true,
//     is_bestseller:     false,
//     is_deal:           true,
//     rating:            4.9,
//     review_count:      128,
//     shop_name:         'SilverLeafJewels',
//   },
//   {
//     title:             'Handwoven Boho Macramé Wall Hanging',
//     slug:              'macrame-wall-hanging',
//     price:             34.00,
//     discount_price:    0,
//     category:          'Art',
//     condition:         'new',
//     stock:             8,
//     short_description: 'Bohemian macramé wall art woven from natural cotton rope.',
//     main_url:          '/images/macrame-wall.jpg',
//     extra_images:      ['/images/macrame-wall.jpg'],
//     is_featured:       false,
//     is_bestseller:     false,
//     is_deal:           false,
//     rating:            4.6,
//     review_count:      74,
//     shop_name:         'KnottyByNature',
//   },
//   {
//     title:             'Vintage Leather Journal – A5',
//     slug:              'vintage-leather-journal',
//     price:             18.50,
//     discount_price:    0,
//     category:          'Art',
//     condition:         'new',
//     stock:             30,
//     short_description: 'Handstitched genuine leather journal with 200 acid-free pages.',
//     main_url:          '/images/leather-journal.jpg',
//     extra_images:      ['/images/leather-journal.jpg'],
//     is_featured:       false,
//     is_bestseller:     true,
//     is_deal:           false,
//     rating:            4.7,
//     review_count:      203,
//     shop_name:         'ParchmentAndQuill',
//   },
//   {
//     title:             'Organic Rosehip Face Serum 30ml',
//     slug:              'rosehip-face-serum',
//     price:             22.00,
//     discount_price:    17.50,
//     category:          'Beauty',
//     condition:         'new',
//     stock:             60,
//     short_description: 'Cold-pressed organic rosehip oil serum for glowing skin.',
//     main_url:          '/images/rosehip-serum.jpg',
//     extra_images:      ['/images/rosehip-serum.jpg'],
//     is_featured:       true,
//     is_bestseller:     false,
//     is_deal:           true,
//     rating:            4.5,
//     review_count:      89,
//     shop_name:         'PureBloomSkincare',
//   },
//   {
//     title:             'Ceramic Hand-Thrown Mug Set (2pc)',
//     slug:              'ceramic-mug-set',
//     price:             38.00,
//     discount_price:    0,
//     category:          'Home & Living',
//     condition:         'new',
//     stock:             22,
//     short_description: 'Set of 2 speckled stoneware mugs, each one uniquely thrown on the wheel.',
//     main_url:          '/images/ceramic-mugs.jpg',
//     extra_images:      ['/images/ceramic-mugs.jpg'],
//     is_featured:       false,
//     is_bestseller:     true,
//     is_deal:           false,
//     rating:            4.9,
//     review_count:      441,
//     shop_name:         'EarthAndFire',
//   },
//   {
//     title:             'Custom Pet Portrait – Watercolour',
//     slug:              'custom-pet-portrait',
//     price:             65.00,
//     discount_price:    0,
//     category:          'Art',
//     condition:         'new',
//     stock:             5,
//     short_description: 'Commission a watercolour portrait of your beloved pet from a photo.',
//     main_url:          '/images/pet-portrait.jpg',
//     extra_images:      ['/images/pet-portrait.jpg'],
//     is_featured:       true,
//     is_bestseller:     false,
//     is_deal:           false,
//     rating:            5.0,
//     review_count:      56,
//     shop_name:         'PawsAndBrushes',
//   },
//   {
//     title:             'Pressed Wildflower Bookmark Set',
//     slug:              'pressed-wildflower-bookmarks',
//     price:             9.99,
//     discount_price:    0,
//     category:          'Gifts',
//     condition:         'new',
//     stock:             100,
//     short_description: 'Set of 4 laminated bookmarks with real pressed wildflowers.',
//     main_url:          '/images/wildflower-bookmarks.jpg',
//     extra_images:      ['/images/wildflower-bookmarks.jpg'],
//     is_featured:       false,
//     is_bestseller:     false,
//     is_deal:           false,
//     rating:            4.4,
//     review_count:      29,
//     shop_name:         'BloomAndPage',
//   },
//   {
//     title:             'Reclaimed Wood Floating Shelf',
//     slug:              'reclaimed-wood-shelf',
//     price:             55.00,
//     discount_price:    45.00,
//     category:          'Home & Living',
//     condition:         'used',
//     stock:             3,
//     short_description: 'Rustic floating shelf crafted from 100% reclaimed barn wood.',
//     main_url:          '/images/wood-shelf.jpg',
//     extra_images:      ['/images/wood-shelf.jpg'],
//     is_featured:       false,
//     is_bestseller:     false,
//     is_deal:           true,
//     rating:            4.7,
//     review_count:      18,
//     shop_name:         'ReclaimAndRefine',
//   },
//   {
//     title:             'Hand-Dyed Silk Scrunchie Bundle',
//     slug:              'silk-scrunchie-bundle',
//     price:             16.00,
//     discount_price:    0,
//     category:          'Accessories',
//     condition:         'new',
//     stock:             75,
//     short_description: 'Set of 3 hand-dyed silk scrunchies in complementary seasonal tones.',
//     main_url:          '/images/silk-scrunchie.jpg',
//     extra_images:      ['/images/silk-scrunchie.jpg'],
//     is_featured:       false,
//     is_bestseller:     true,
//     is_deal:           false,
//     rating:            4.6,
//     review_count:      134,
//     shop_name:         'SilkAndSpring',
//   },
//   {
//     title:             'Artisan Sourdough Starter Kit',
//     slug:              'sourdough-starter-kit',
//     price:             29.00,
//     discount_price:    0,
//     category:          'Food & Drink',
//     condition:         'new',
//     stock:             20,
//     short_description: 'Everything you need to cultivate your own sourdough starter at home.',
//     main_url:          '/images/sourdough-kit.jpg',
//     extra_images:      ['/images/sourdough-kit.jpg'],
//     is_featured:       false,
//     is_bestseller:     false,
//     is_deal:           false,
//     rating:            4.8,
//     review_count:      67,
//     shop_name:         'WildYeastCo',
//   },
//   {
//     title:             'Embroidered Linen Tote Bag',
//     slug:              'embroidered-tote',
//     price:             27.00,
//     discount_price:    22.00,
//     category:          'Accessories',
//     condition:         'new',
//     stock:             18,
//     short_description: 'Hand-embroidered natural linen tote with floral motif.',
//     main_url:          '/images/linen-tote.jpg',
//     extra_images:      ['/images/linen-tote.jpg'],
//     is_featured:       true,
//     is_bestseller:     false,
//     is_deal:           true,
//     rating:            4.3,
//     review_count:      42,
//     shop_name:         'ThreadAndLoom',
//   },
// ];

// // ─── localStorage helpers ─────────────────────────────────────────────────────

// const STORAGE_KEY = 'shopa_mock_products';

// function loadFromStorage(): MockProduct[] {
//   if (typeof window === 'undefined') return [];
//   try {
//     const raw = localStorage.getItem(STORAGE_KEY);
//     if (raw) return JSON.parse(raw) as MockProduct[];
//   } catch { /* ignore parse errors */ }
//   return [];
// }

// function saveToStorage(products: MockProduct[]): void {
//   if (typeof window === 'undefined') return;
//   localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
// }

// function getOrSeedStore(): MockProduct[] {
//   const existing = loadFromStorage();
//   if (existing.length > 0) return existing;

//   const seeded: MockProduct[] = SEED.map((p, i) => ({
//     ...p,
//     id:         String(i + 1),
//     created_at: new Date(Date.now() - (SEED.length - i) * 86_400_000).toISOString(),
//   }));

//   saveToStorage(seeded);
//   return seeded;
// }

// /**
//  * Call this from a "Reset catalogue" button to wipe localStorage
//  * and re-seed from the SEED array above.
//  */
// export function resetStore(): void {
//   if (typeof window === 'undefined') return;
//   localStorage.removeItem(STORAGE_KEY);
// }

// function delay(ms = 350): Promise<void> {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// function slugify(text: string): string {
//   return text
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, '-')
//     .replace(/(^-|-$)/g, '');
// }

// // ─── Sort helper (typed, no `any`) ────────────────────────────────────────────

// function parseSortParam(sort: string): { key: SortableKey; dir: 1 | -1 } {
//   const descending = sort.startsWith('-');
//   const rawKey     = descending ? sort.slice(1) : sort;
//   const validKeys: SortableKey[] = [
//     'price', 'rating', 'review_count', 'title', 'created_at', 'stock',
//   ];
//   const key: SortableKey = (validKeys as string[]).includes(rawKey)
//     ? (rawKey as SortableKey)
//     : 'created_at';
//   return { key, dir: descending ? -1 : 1 };
// }

// function compareProducts(
//   a:   MockProduct,
//   b:   MockProduct,
//   key: SortableKey,
//   dir: 1 | -1,
// ): number {
//   const av = a[key];
//   const bv = b[key];
//   if (typeof av === 'string' && typeof bv === 'string') {
//     return av.localeCompare(bv) * dir;
//   }
//   return (Number(av) - Number(bv)) * dir;
// }

// // ─── Public CRUD API ──────────────────────────────────────────────────────────

// /** GET /products — paginated, searchable, filterable */
// export async function fetchProducts(
//   filters: ProductFilters = {},
// ): Promise<ProductsPage> {
//   await delay();

//   let all = getOrSeedStore();

//   const {
//     search    = '',
//     category,
//     condition,
//     min_price,
//     max_price,
//     sort      = '-created_at',
//     page      = 1,
//     page_size = 8,
//   } = filters;

//   // Text search
//   if (search.trim()) {
//     const q = search.toLowerCase();
//     all = all.filter(
//       (p) =>
//         p.title.toLowerCase().includes(q) ||
//         p.short_description.toLowerCase().includes(q) ||
//         p.shop_name.toLowerCase().includes(q),
//     );
//   }

//   // Category / condition filters
//   if (category && category !== 'All') {
//     all = all.filter((p) => p.category === category);
//   }
//   if (condition && condition !== 'All') {
//     all = all.filter((p) => p.condition === condition);
//   }

//   // Price range
//   if (min_price !== undefined) all = all.filter((p) => p.price >= min_price);
//   if (max_price !== undefined) all = all.filter((p) => p.price <= max_price);

//   // Sort
//   const { key, dir } = parseSortParam(sort);
//   all = [...all].sort((a, b) => compareProducts(a, b, key, dir));

//   const count       = all.length;
//   const total_pages = Math.max(1, Math.ceil(count / page_size));
//   const start       = (page - 1) * page_size;

//   return {
//     results:     all.slice(start, start + page_size),
//     count,
//     page,
//     page_size,
//     total_pages,
//   };
// }

// /** GET /products/:id */
// export async function fetchProduct(id: string): Promise<MockProduct> {
//   await delay(200);
//   const product = getOrSeedStore().find((p) => p.id === id);
//   if (!product) throw new Error(`Product ${id} not found`);
//   return product;
// }

// /** POST /products */
// export async function createProduct(
//   data: Omit<MockProduct, 'id' | 'created_at' | 'slug' | 'rating' | 'review_count'>,
// ): Promise<MockProduct> {
//   await delay();
//   const all   = getOrSeedStore();
//   const maxId = all.reduce((m, p) => Math.max(m, parseInt(p.id, 10)), 0);

//   const newProduct: MockProduct = {
//     ...data,
//     id:           String(maxId + 1),
//     slug:         slugify(data.title),
//     rating:       0,
//     review_count: 0,
//     created_at:   new Date().toISOString(),
//   };

//   saveToStorage([...all, newProduct]);
//   return newProduct;
// }

// /** PUT /products/:id */
// export async function updateProduct(
//   id:   string,
//   data: Partial<Omit<MockProduct, 'id' | 'created_at'>>,
// ): Promise<MockProduct> {
//   await delay();
//   const all = getOrSeedStore();
//   const idx = all.findIndex((p) => p.id === id);
//   if (idx === -1) throw new Error(`Product ${id} not found`);

//   const updated: MockProduct = {
//     ...all[idx],
//     ...data,
//     slug: data.title ? slugify(data.title) : all[idx].slug,
//     id,
//   };

//   const next = [...all];
//   next[idx]  = updated;
//   saveToStorage(next);
//   return updated;
// }

// /** DELETE /products/:id */
// export async function deleteProduct(id: string): Promise<void> {
//   await delay();
//   const all  = getOrSeedStore();
//   const next = all.filter((p) => p.id !== id);
//   if (next.length === all.length) throw new Error(`Product ${id} not found`);
//   saveToStorage(next);
// }


export interface MockProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  discount_price: number;
  category: string;
  condition: 'new' | 'used' | 'refurbished';
  stock: number;
  short_description: string;
  main_url: string;
  is_featured: boolean;
  is_bestseller: boolean;
  is_deal: boolean;
  rating: number;
  review_count: number;
  shop_name: string;
  created_at: string;
}

export interface ProductsPage {
  results: MockProduct[];
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  condition?: string;
  min_price?: number;
  max_price?: number;
  sort?: string;
  page?: number;
  page_size?: number;
}

type SortableKey = keyof Pick<
  MockProduct,
  'price' | 'rating' | 'review_count' | 'title' | 'created_at' | 'stock'
>;

export const CATEGORIES = [
  'All', 'Home & Living', 'Jewellery', 'Art', 'Beauty',
  'Accessories', 'Gifts', 'Food & Drink', 'Clothing',
];

export const CONDITIONS = ['All', 'new', 'used', 'refurbished'];

export const SORT_OPTIONS = [
  { value: '-created_at', label: 'Newest first' },
  { value: 'created_at', label: 'Oldest first' },
  { value: 'price', label: 'Price: Low → High' },
  { value: '-price', label: 'Price: High → Low' },
  { value: '-rating', label: 'Top rated' },
  { value: 'title', label: 'A → Z' },
];

const STORAGE_KEY = 'shopa_mock_products';
const PLACEHOLDER_IMAGE = '/images/placeholder.jpg';

function localImage(fileName: string): string {
  return `/images/${fileName}`;
}

export function productImageSrc(path?: string | null): string {
  if (!path || path.trim() === '') return PLACEHOLDER_IMAGE;

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return PLACEHOLDER_IMAGE;
  }

  return path.startsWith('/') ? path : `/${path}`;
}

const SEED: Omit<MockProduct, 'id' | 'created_at'>[] = [
  {
    title: 'Hand-Poured Lavender Soy Candle',
    slug: 'lavender-soy-candle',
    price: 24.99,
    discount_price: 0,
    category: 'Home & Living',
    condition: 'new',
    stock: 42,
    short_description: 'Relaxing lavender-scented candle made from 100% natural soy wax.',
    main_url: localImage('lavendarcandle2.jpg'),
    is_featured: true,
    is_bestseller: true,
    is_deal: false,
    rating: 4.8,
    review_count: 312,
    shop_name: 'WickAndWonder',
  },
  {
    title: 'Personalised Sterling Silver Necklace',
    slug: 'personalised-silver-necklace',
    price: 49.95,
    discount_price: 39.95,
    category: 'Jewellery',
    condition: 'new',
    stock: 15,
    short_description: 'Engrave your initials on this delicate sterling silver pendant.',
    main_url: localImage('silvernecklace2.webp'),
    is_featured: true,
    is_bestseller: false,
    is_deal: true,
    rating: 4.9,
    review_count: 128,
    shop_name: 'SilverLeafJewels',
  },
  {
    title: 'Handwoven Boho Macramé Wall Hanging',
    slug: 'macrame-wall-hanging',
    price: 34,
    discount_price: 0,
    category: 'Art',
    condition: 'new',
    stock: 8,
    short_description: 'Bohemian macramé wall art woven from natural cotton rope.',
    main_url: localImage('wallhanging1.jpg'),
    is_featured: false,
    is_bestseller: false,
    is_deal: false,
    rating: 4.6,
    review_count: 74,
    shop_name: 'KnottyByNature',
  },
  {
    title: 'Vintage Leather Journal – A5',
    slug: 'vintage-leather-journal',
    price: 18.5,
    discount_price: 0,
    category: 'Art',
    condition: 'new',
    stock: 30,
    short_description: 'Handstitched genuine leather journal with 200 acid-free pages.',
    main_url: localImage('leatherjournal2.webp'),
    is_featured: false,
    is_bestseller: true,
    is_deal: false,
    rating: 4.7,
    review_count: 203,
    shop_name: 'ParchmentAndQuill',
  },
  {
    title: 'Organic Rosehip Face Serum 30ml',
    slug: 'rosehip-face-serum',
    price: 22,
    discount_price: 17.5,
    category: 'Beauty',
    condition: 'new',
    stock: 60,
    short_description: 'Cold-pressed organic rosehip oil serum for glowing skin.',
    main_url: localImage('rosehipfaceserum2.jpg'),
    is_featured: true,
    is_bestseller: false,
    is_deal: true,
    rating: 4.5,
    review_count: 89,
    shop_name: 'PureBloomSkincare',
  },
  {
    title: 'Ceramic Hand-Thrown Mug Set (2pc)',
    slug: 'ceramic-mug-set',
    price: 38,
    discount_price: 0,
    category: 'Home & Living',
    condition: 'new',
    stock: 22,
    short_description: 'Set of 2 speckled stoneware mugs, each one uniquely thrown on the wheel.',
    main_url: localImage('mugset3.jpg'),
    is_featured: false,
    is_bestseller: true,
    is_deal: false,
    rating: 4.9,
    review_count: 441,
    shop_name: 'EarthAndFire',
  },
  {
    title: 'Custom Pet Portrait – Watercolour',
    slug: 'custom-pet-portrait',
    price: 65,
    discount_price: 0,
    category: 'Art',
    condition: 'new',
    stock: 5,
    short_description: 'Commission a watercolour portrait of your beloved pet from a photo.',
    main_url: localImage('petportrait1.jpg'),
    is_featured: true,
    is_bestseller: false,
    is_deal: false,
    rating: 5,
    review_count: 56,
    shop_name: 'PawsAndBrushes',
  },
  {
    title: 'Pressed Wildflower Bookmark Set',
    slug: 'pressed-wildflower-bookmarks',
    price: 9.99,
    discount_price: 0,
    category: 'Gifts',
    condition: 'new',
    stock: 100,
    short_description: 'Set of 4 laminated bookmarks with real pressed wildflowers.',
    main_url: localImage('wildflowerbookmarkset1.jpg'),
    is_featured: false,
    is_bestseller: false,
    is_deal: false,
    rating: 4.4,
    review_count: 29,
    shop_name: 'BloomAndPage',
  },
  {
    title: 'Reclaimed Wood Floating Shelf',
    slug: 'reclaimed-wood-shelf',
    price: 55.00,
    discount_price: 45.00,
    category: 'Home & Living',
    condition: 'used',
    stock: 3,
    short_description: 'Rustic floating shelf crafted from 100% reclaimed barn wood.',
    main_url: localImage('woodfloatingshelf1.webp'),
    is_featured: false,
    is_bestseller: false,
    is_deal: true,
    rating: 4.7,
    review_count: 18,
    shop_name: 'ReclaimAndRefine',
  },
  {
    title:             'Hand-Dyed Silk Scrunchie Bundle',
    slug:              'silk-scrunchie-bundle',
    price:             16.00,
    discount_price:    0,
    category:          'Accessories',
    condition:         'new',
    stock:             75,
    short_description: 'Set of 3 hand-dyed silk scrunchies in complementary seasonal tones.',
    main_url:          localImage('handdyedsilk.jpg'),
    is_featured:       false,
    is_bestseller:     true,
    is_deal:           false,
    rating:            4.6,
    review_count:      134,
    shop_name:         'SilkAndSpring',
  },
  {
    title:             'Artisan Sourdough Starter Kit',
    slug:              'sourdough-starter-kit',
    price:             29.00,
    discount_price:    0,
    category:          'Food & Drink',
    condition:         'new',
    stock:             20,
    short_description: 'Everything you need to cultivate your own sourdough starter at home.',
    main_url:          localImage('starterkit1.jpg'),
    is_featured:       false,
    is_bestseller:     false,
    is_deal:           false,
    rating:            4.8,
    review_count:      67,
    shop_name:         'WildYeastCo',
  },
    {
    title:             'Embroidered Linen Tote Bag',
    slug:              'embroidered-tote',
    price:             27.00,
    discount_price:    22.00,
    category:          'Accessories',
    condition:         'new',
    stock:             18,
    short_description: 'Hand-embroidered natural linen tote with floral motif.',
    main_url:          localImage('linentotebag2.jpg'),
    is_featured:       true,
    is_bestseller:     false,
    is_deal:           true,
    rating:            4.3,
    review_count:      42,
    shop_name:         'ThreadAndLoom',
  },
];

function hasRemoteImages(products: MockProduct[]): boolean {
  return products.some(
    (p) => p.main_url.startsWith('http://') || p.main_url.startsWith('https://')
  );
}

function saveToStorage(products: MockProduct[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function loadFromStorage(): MockProduct[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const products = JSON.parse(raw) as MockProduct[];

    if (hasRemoteImages(products)) {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }

    return products.map((p) => ({
      ...p,
      main_url: productImageSrc(p.main_url),
    }));
  } catch {
    return [];
  }
}

function getSeededProducts(): MockProduct[] {
  return SEED.map((p, i) => ({
    ...p,
    id: String(i + 1),
    main_url: productImageSrc(p.main_url),
    created_at: new Date(Date.now() - (SEED.length - i) * 86_400_000).toISOString(),
  }));
}

function getOrSeedStore(): MockProduct[] {
  const existing = loadFromStorage();

  if (existing.length > 0) return existing;

  const seeded = getSeededProducts();
  saveToStorage(seeded);
  return seeded;
}

function delay(ms = 350): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function parseSortParam(sort: string): { key: SortableKey; dir: 1 | -1 } {
  const descending = sort.startsWith('-');
  const rawKey = descending ? sort.slice(1) : sort;
  const validKeys: SortableKey[] = ['price', 'rating', 'review_count', 'title', 'created_at', 'stock'];

  const key: SortableKey = (validKeys as string[]).includes(rawKey)
    ? (rawKey as SortableKey)
    : 'created_at';

  return { key, dir: descending ? -1 : 1 };
}

function compareProducts(a: MockProduct, b: MockProduct, key: SortableKey, dir: 1 | -1): number {
  const av = a[key];
  const bv = b[key];

  if (typeof av === 'string' && typeof bv === 'string') {
    return av.localeCompare(bv) * dir;
  }

  return (Number(av) - Number(bv)) * dir;
}

export async function fetchProducts(filters: ProductFilters = {}): Promise<ProductsPage> {
  await delay();

  let all = getOrSeedStore();

  const {
    search = '',
    category,
    condition,
    min_price,
    max_price,
    sort = '-created_at',
    page = 1,
    page_size = 8,
  } = filters;

  if (search.trim()) {
    const q = search.toLowerCase();

    all = all.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.short_description.toLowerCase().includes(q) ||
        p.shop_name.toLowerCase().includes(q)
    );
  }

  if (category && category !== 'All') all = all.filter((p) => p.category === category);
  if (condition && condition !== 'All') all = all.filter((p) => p.condition === condition);
  if (min_price !== undefined) all = all.filter((p) => p.price >= min_price);
  if (max_price !== undefined) all = all.filter((p) => p.price <= max_price);

  const { key, dir } = parseSortParam(sort);
  all = [...all].sort((a, b) => compareProducts(a, b, key, dir));

  const count = all.length;
  const total_pages = Math.max(1, Math.ceil(count / page_size));
  const start = (page - 1) * page_size;

  return {
    results: all.slice(start, start + page_size),
    count,
    page,
    page_size,
    total_pages,
  };
}

export async function fetchProduct(id: string): Promise<MockProduct> {
  await delay(200);

  const product = getOrSeedStore().find((p) => p.id === id);

  if (!product) throw new Error(`Product ${id} not found`);

  return {
    ...product,
    main_url: productImageSrc(product.main_url),
  };
}

export async function createProduct(
  data: Omit<MockProduct, 'id' | 'created_at' | 'slug' | 'rating' | 'review_count'>
): Promise<MockProduct> {
  await delay();

  const all = getOrSeedStore();
  const maxId = all.reduce((m, p) => Math.max(m, parseInt(p.id, 10)), 0);

  const newProduct: MockProduct = {
    ...data,
    id: String(maxId + 1),
    slug: slugify(data.title),
    main_url: productImageSrc(data.main_url),
    rating: 0,
    review_count: 0,
    created_at: new Date().toISOString(),
  };

  saveToStorage([...all, newProduct]);

  return newProduct;
}

export async function updateProduct(
  id: string,
  data: Partial<Omit<MockProduct, 'id' | 'created_at'>>
): Promise<MockProduct> {
  await delay();

  const all = getOrSeedStore();
  const idx = all.findIndex((p) => p.id === id);

  if (idx === -1) throw new Error(`Product ${id} not found`);

  const updated: MockProduct = {
    ...all[idx],
    ...data,
    main_url: productImageSrc(data.main_url ?? all[idx].main_url),
    slug: data.title ? slugify(data.title) : all[idx].slug,
    id,
  };

  const next = [...all];
  next[idx] = updated;

  saveToStorage(next);

  return updated;
}

export async function deleteProduct(id: string): Promise<void> {
  await delay();

  const all = getOrSeedStore();
  const next = all.filter((p) => p.id !== id);

  if (next.length === all.length) throw new Error(`Product ${id} not found`);

  saveToStorage(next);
}