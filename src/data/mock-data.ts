export const dashboardStats = {
  totalRevenue: "$2,845,600",
  totalOrders: "12,458",
  totalUsers: "8,294",
  activeVendors: "342",
  revenueChange: "+12.5%",
  ordersChange: "+8.2%",
  usersChange: "+15.3%",
  vendorsChange: "+4.1%",
};

export const moduleStats = {
  marketplace: { orders: 8420, revenue: "$1.8M", vendors: 245, products: 12840 },
  services: { bookings: 3240, providers: 186, revenue: "$620K", inspections: 890 },
  rental: { bookings: 1890, equipment: 4520, revenue: "$340K", categories: 48 },
  planner: { projects: 420, estimations: 1240, revenue: "$85K", tools: 12 },
};

export const revenueData = [
  { month: "Jan", marketplace: 4000, services: 2400, rental: 1200, planner: 800 },
  { month: "Feb", marketplace: 4200, services: 2600, rental: 1400, planner: 900 },
  { month: "Mar", marketplace: 5800, services: 3200, rental: 1800, planner: 1100 },
  { month: "Apr", marketplace: 5200, services: 2800, rental: 1600, planner: 1000 },
  { month: "May", marketplace: 6400, services: 3600, rental: 2200, planner: 1400 },
  { month: "Jun", marketplace: 7200, services: 4000, rental: 2600, planner: 1600 },
  { month: "Jul", marketplace: 6800, services: 3800, rental: 2400, planner: 1500 },
];

export const ordersData = [
  { month: "Jan", orders: 420, completed: 380, cancelled: 40 },
  { month: "Feb", orders: 480, completed: 440, cancelled: 40 },
  { month: "Mar", orders: 620, completed: 560, cancelled: 60 },
  { month: "Apr", orders: 540, completed: 490, cancelled: 50 },
  { month: "May", orders: 700, completed: 640, cancelled: 60 },
  { month: "Jun", orders: 780, completed: 720, cancelled: 60 },
  { month: "Jul", orders: 740, completed: 680, cancelled: 60 },
];

export const recentActivity = [
  { id: 1, type: "order", title: "New order #ORD-4521", time: "2 min ago", status: "pending" },
  { id: 2, type: "booking", title: "Service booking confirmed", time: "15 min ago", status: "confirmed" },
  { id: 3, type: "rfq", title: "RFQ submitted by Vendor A", time: "1 hour ago", status: "review" },
  { id: 4, type: "order", title: "Order #ORD-4518 completed", time: "2 hours ago", status: "completed" },
  { id: 5, type: "booking", title: "Equipment rental request", time: "3 hours ago", status: "pending" },
  { id: 6, type: "rfq", title: "RFQ #RFQ-892 approved", time: "5 hours ago", status: "approved" },
];

export const mockProducts = Array.from({ length: 20 }, (_, i) => ({
  id: `PRD-${1000 + i}`,
  name: `Product ${i + 1}`,
  category: ["Building Materials", "Tools", "Safety Equipment", "Electrical", "Plumbing"][i % 5],
  price: `$${(Math.random() * 500 + 50).toFixed(2)}`,
  stock: Math.floor(Math.random() * 500),
  vendor: `Vendor ${(i % 10) + 1}`,
  status: ["active", "draft", "out_of_stock"][i % 3] as string,
}));

export const mockCategories = [
  { id: 1, name: "Building Materials", parent: null, subCount: 12, productCount: 3420 },
  { id: 2, name: "Tools & Equipment", parent: null, subCount: 8, productCount: 2180 },
  { id: 3, name: "Safety Equipment", parent: null, subCount: 6, productCount: 1240 },
  { id: 4, name: "Electrical", parent: null, subCount: 10, productCount: 2860 },
  { id: 5, name: "Plumbing", parent: null, subCount: 7, productCount: 1940 },
  { id: 6, name: "Cement & Concrete", parent: "Building Materials", subCount: 4, productCount: 820 },
  { id: 7, name: "Steel & Iron", parent: "Building Materials", subCount: 3, productCount: 640 },
  { id: 8, name: "Power Tools", parent: "Tools & Equipment", subCount: 5, productCount: 1200 },
];

export const mockBrands = [
  { id: 1, name: "UltraBuild", products: 340, status: "active", logo: "UB" },
  { id: 2, name: "SafetyFirst", products: 220, status: "active", logo: "SF" },
  { id: 3, name: "PowerMax", products: 180, status: "active", logo: "PM" },
  { id: 4, name: "BuildRight", products: 290, status: "inactive", logo: "BR" },
  { id: 5, name: "ProTools", products: 410, status: "active", logo: "PT" },
];

export const mockVendors = Array.from({ length: 15 }, (_, i) => ({
  id: `VND-${100 + i}`,
  name: `Vendor ${i + 1} Corp`,
  email: `vendor${i + 1}@example.com`,
  phone: `+1 555-${String(1000 + i)}`,
  products: Math.floor(Math.random() * 200 + 20),
  orders: Math.floor(Math.random() * 500 + 50),
  revenue: `$${(Math.random() * 100000 + 10000).toFixed(0)}`,
  status: ["active", "pending", "suspended"][i % 3] as string,
  joinDate: `2024-${String((i % 12) + 1).padStart(2, "0")}-15`,
}));

export const mockFlashSales = [
  { id: 1, title: "Summer Construction Sale", discount: "25%", products: 120, startDate: "2024-06-01", endDate: "2024-06-30", status: "active" },
  { id: 2, title: "Monsoon Safety Gear", discount: "30%", products: 45, startDate: "2024-07-01", endDate: "2024-07-15", status: "upcoming" },
  { id: 3, title: "Year End Clearance", discount: "40%", products: 200, startDate: "2024-12-15", endDate: "2024-12-31", status: "draft" },
];

export const mockRFQs = [
  { id: "RFQ-001", title: "Bulk Cement Order", vendor: "Vendor 1 Corp", items: 5, value: "$45,000", status: "pending", date: "2024-06-15" },
  { id: "RFQ-002", title: "Steel Beams Supply", vendor: "Vendor 3 Corp", items: 3, value: "$120,000", status: "approved", date: "2024-06-14" },
  { id: "RFQ-003", title: "Safety Equipment Set", vendor: "Vendor 5 Corp", items: 12, value: "$8,500", status: "rejected", date: "2024-06-13" },
  { id: "RFQ-004", title: "Electrical Wiring Lot", vendor: "Vendor 2 Corp", items: 8, value: "$22,000", status: "pending", date: "2024-06-12" },
];

export const mockTransactions = Array.from({ length: 15 }, (_, i) => ({
  id: `TXN-${5000 + i}`,
  orderId: `ORD-${4000 + i}`,
  vendor: `Vendor ${(i % 10) + 1} Corp`,
  amount: `$${(Math.random() * 5000 + 100).toFixed(2)}`,
  method: ["Credit Card", "Bank Transfer", "UPI", "Wallet"][i % 4],
  status: ["completed", "pending", "refunded"][i % 3] as string,
  date: `2024-06-${String(15 - i).padStart(2, "0")}`,
}));

export const mockFAQs = [
  { id: 1, question: "How to register as a vendor?", answer: "Visit the vendor registration page...", category: "Vendors", status: "published" },
  { id: 2, question: "What payment methods are accepted?", answer: "We accept credit cards, bank transfers...", category: "Payments", status: "published" },
  { id: 3, question: "How to track my order?", answer: "Go to your order history and click...", category: "Orders", status: "draft" },
];

export const mockProviders = Array.from({ length: 10 }, (_, i) => ({
  id: `PRV-${200 + i}`,
  name: `Service Provider ${i + 1}`,
  service: ["Plumbing", "Electrical", "Painting", "Carpentry", "Masonry"][i % 5],
  rating: (3.5 + Math.random() * 1.5).toFixed(1),
  bookings: Math.floor(Math.random() * 200 + 20),
  status: ["active", "inactive"][i % 2] as string,
}));

export const mockBookings = Array.from({ length: 12 }, (_, i) => ({
  id: `BKG-${300 + i}`,
  service: ["Plumbing Repair", "Electrical Wiring", "Wall Painting", "Furniture Assembly", "Tile Work"][i % 5],
  provider: `Service Provider ${(i % 10) + 1}`,
  customer: `Customer ${i + 1}`,
  date: `2024-06-${String(20 - i).padStart(2, "0")}`,
  amount: `$${(Math.random() * 1000 + 100).toFixed(2)}`,
  status: ["confirmed", "pending", "completed", "cancelled"][i % 4] as string,
}));

export const mockEquipment = Array.from({ length: 15 }, (_, i) => ({
  id: `EQP-${400 + i}`,
  name: ["Excavator", "Crane", "Bulldozer", "Concrete Mixer", "Scaffolding"][i % 5],
  category: ["Heavy", "Medium", "Light"][i % 3],
  dailyRate: `$${(Math.random() * 500 + 50).toFixed(0)}`,
  available: i % 3 !== 0,
  location: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][i % 5],
}));

export const mockProjects = Array.from({ length: 8 }, (_, i) => ({
  id: `PRJ-${500 + i}`,
  name: `Project ${i + 1} - ${["Residential Complex", "Commercial Tower", "Bridge Construction", "Road Work"][i % 4]}`,
  budget: `$${(Math.random() * 5000000 + 500000).toFixed(0)}`,
  progress: Math.floor(Math.random() * 100),
  status: ["active", "planning", "completed", "on_hold"][i % 4] as string,
  startDate: `2024-0${(i % 9) + 1}-01`,
}));

export const mockLocations = {
  countries: [
    { id: 1, name: "United States", code: "US", states: 50, status: "active" },
    { id: 2, name: "India", code: "IN", states: 28, status: "active" },
    { id: 3, name: "United Kingdom", code: "UK", states: 4, status: "active" },
  ],
  states: [
    { id: 1, name: "California", country: "United States", cities: 482, status: "active" },
    { id: 2, name: "Texas", country: "United States", cities: 1216, status: "active" },
    { id: 3, name: "Maharashtra", country: "India", cities: 350, status: "active" },
  ],
  cities: [
    { id: 1, name: "Los Angeles", state: "California", pincodes: 120, status: "active" },
    { id: 2, name: "Houston", state: "Texas", pincodes: 85, status: "active" },
    { id: 3, name: "Mumbai", state: "Maharashtra", pincodes: 200, status: "active" },
  ],
  pincodes: [
    { id: 1, code: "90001", city: "Los Angeles", area: "Downtown LA", status: "active" },
    { id: 2, code: "77001", city: "Houston", area: "Downtown Houston", status: "active" },
    { id: 3, code: "400001", city: "Mumbai", area: "Fort", status: "active" },
  ],
};

export const mockUsers = Array.from({ length: 10 }, (_, i) => ({
  id: `USR-${600 + i}`,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: ["admin", "sub_admin", "user"][i % 3],
  status: ["active", "inactive"][i % 2] as string,
  lastLogin: `2024-06-${String(15 - i).padStart(2, "0")}`,
}));

export const mockBanners = [
  { id: 1, title: "Summer Sale Banner", position: "home_top", status: "active", clicks: 2450 },
  { id: 2, title: "New Vendor Promo", position: "sidebar", status: "active", clicks: 1280 },
  { id: 3, title: "Safety Week", position: "home_middle", status: "draft", clicks: 0 },
];
