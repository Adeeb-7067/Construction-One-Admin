// ─────────────────────────────────────────────────────────────
//  mock-data.ts  –  single source of truth for all static data
// ─────────────────────────────────────────────────────────────

// ── Types ────────────────────────────────────────────────────

export interface OrderStatusCounts {
  DELIVERED: number;
  CANCELLED: number;
  PENDING: number;
}

export interface MarketplaceStats {
  ordersByStatus: OrderStatusCounts;
  totalAmount: number;
  turnover: number;
  totalVerifiedVendors: number;
  totalUnverifiedVendors: number;
  totalUsers: number;
  totalCities: number;
  totalStates: number;
  totalCountries: number;
  totalPincodes: number;
  totalPCategories: number;
  totalCategories: number;
  totalSubCategories: number;
  ordersByMonth: Record<string, OrderStatusCounts>;
  usersByMonth: Record<string, number>;
  vendorsByMonth: Record<string, number>;
  totalTransactions: number;
  dateRange: { from: string; to: string };
}

// ── Raw API-shaped data ───────────────────────────────────────

export const marketplaceStats: MarketplaceStats = {
  ordersByStatus: {
    DELIVERED: 18,
    CANCELLED: 5,
    PENDING: 12,
  },
  totalAmount: 284500,
  turnover: 312000,
  totalVerifiedVendors: 2,
  totalUnverifiedVendors: 3,
  totalUsers: 18,
  totalCities: 1,
  totalStates: 1,
  totalCountries: 1,
  totalPincodes: 3,
  totalPCategories: 5,
  totalCategories: 4,
  totalSubCategories: 4,
  ordersByMonth: {
    "1":  { DELIVERED: 0, CANCELLED: 0, PENDING: 0 },
    "2":  { DELIVERED: 4, CANCELLED: 1, PENDING: 6 },
    "3":  { DELIVERED: 7, CANCELLED: 2, PENDING: 3 },
    "4":  { DELIVERED: 5, CANCELLED: 1, PENDING: 2 },
    "5":  { DELIVERED: 2, CANCELLED: 1, PENDING: 1 },
    "6":  { DELIVERED: 0, CANCELLED: 0, PENDING: 0 },
    "7":  { DELIVERED: 0, CANCELLED: 0, PENDING: 0 },
    "8":  { DELIVERED: 0, CANCELLED: 0, PENDING: 0 },
    "9":  { DELIVERED: 0, CANCELLED: 0, PENDING: 0 },
    "10": { DELIVERED: 0, CANCELLED: 0, PENDING: 0 },
    "11": { DELIVERED: 0, CANCELLED: 0, PENDING: 0 },
    "12": { DELIVERED: 0, CANCELLED: 0, PENDING: 0 },
  },
  usersByMonth: {
    "1": 0, "2": 7,  "3": 4,  "4": 7,
    "5": 0, "6": 0,  "7": 0,  "8": 0,
    "9": 0, "10": 0, "11": 0, "12": 0,
  },
  vendorsByMonth: {
    "1": 0, "2": 2,  "3": 3,  "4": 0,
    "5": 0, "6": 0,  "7": 0,  "8": 0,
    "9": 0, "10": 0, "11": 0, "12": 0,
  },
  totalTransactions: 24,
  dateRange: {
    from: "2025-12-31T18:30:00.000Z",
    to:   "2026-12-31T18:30:00.000Z",
  },
};

// ── Chart-ready helpers (derived from raw data) ───────────────

const MONTH_LABELS: Record<string, string> = {
  "1": "Jan", "2": "Feb", "3":  "Mar", "4":  "Apr",
  "5": "May", "6": "Jun", "7":  "Jul", "8":  "Aug",
  "9": "Sep", "10": "Oct", "11": "Nov", "12": "Dec",
};

/** Bar chart – orders per month broken down by status */
export const ordersChartData = Object.entries(marketplaceStats.ordersByMonth).map(
  ([month, counts]) => ({
    month:     MONTH_LABELS[month],
    delivered: counts.DELIVERED,
    cancelled: counts.CANCELLED,
    pending:   counts.PENDING,
    total:     counts.DELIVERED + counts.CANCELLED + counts.PENDING,
  })
);

/** Area chart – new users & vendors per month */
export const growthChartData = Object.entries(marketplaceStats.usersByMonth).map(
  ([month, users]) => ({
    month,
    label:   MONTH_LABELS[month],
    users,
    vendors: marketplaceStats.vendorsByMonth[month],
  })
);