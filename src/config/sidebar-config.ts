import {
  LayoutDashboard,
  ShoppingCart,
  Wrench,
  Truck,
  ClipboardList,
  Globe,
  Shield,
  FileText,
  Package,
  Tag,
  Award,
  Users,
  Zap,
  MessageSquare,
  CreditCard,
  HelpCircle,
  UserCheck,
  Calendar,
  FileQuestion,
  Search as SearchIcon,
  FolderTree,
  Hammer,
  Calculator,
  FolderKanban,
  MapPin,
  Map,
  Building2,
  Hash,
  Building,
  UserCog,
  ShieldCheck,
  Image,
  Home,
  Component,
  type LucideIcon,
} from "lucide-react";

export interface SidebarItem {
  title: string;
  url: string;
  icon: LucideIcon;
  permission?: string;
}

export interface SidebarGroup {
  title: string;
  icon: LucideIcon;
  items: SidebarItem[];
  permission?: string;
}

export type SidebarEntry = SidebarItem | SidebarGroup;

export const sidebarConfig: SidebarEntry[] = [
  { 
    title: "Dashboard", 
    url: "/dashboard", 
    icon: LayoutDashboard,
    permission: "DASHBOARD"
  },
  { 
    title: "Module", 
    url: "/module", 
    icon: Component,
    permission: "MODULE"
  },

  {
    title: "Marketplace",
    icon: ShoppingCart,
    items: [
      { title: "Dashboard", url: "/marketplace/dashboard", icon: LayoutDashboard, permission: "MARKETPLACE_DASHBOARD" },
      { title: "Products", url: "/marketplace/products", icon: Package, permission: "MARKETPLACE_PRODUCTS" },
      { title: "Categories", url: "/marketplace/categories", icon: Tag, permission: "MARKETPLACE_CATEGORIES" },
      { title: "Brands", url: "/marketplace/brands", icon: Award, permission: "MARKETPLACE_BRANDS" },
      { title: "Vendors", url: "/marketplace/vendors", icon: Users, permission: "MARKETPLACE_VENDORS" },
      { title: "Flash Sale", url: "/marketplace/flash-sale", icon: Zap, permission: "MARKETPLACE_FLASH_SALE" },
      { title: "RFQ", url: "/marketplace/rfq", icon: MessageSquare, permission: "MARKETPLACE_RFQ" },
      { title: "Transactions", url: "/marketplace/transactions", icon: CreditCard, permission: "MARKETPLACE_TRANSACTIONS" },
      { title: "Vendor Requests", url: "/marketplace/vendor-requests", icon: UserCheck, permission: "MARKETPLACE_VENDOR_REQUESTS" },
    ],
  },
  {
    title: "Services",
    icon: Wrench,
    items: [
      { title: "Dashboard", url: "/services/dashboard", icon: LayoutDashboard, permission: "SERVICES_DASHBOARD" },
      { title: "Providers", url: "/services/providers", icon: UserCheck, permission: "SERVICES_PROVIDERS" },
      { title: "Bookings", url: "/services/bookings", icon: Calendar, permission: "SERVICES_BOOKINGS" },
      { title: "Quotations", url: "/services/quotations", icon: FileQuestion, permission: "SERVICES_QUOTATIONS" },
      { title: "Inspections", url: "/services/inspections", icon: SearchIcon, permission: "SERVICES_INSPECTIONS" },
    ],
  },
  {
    title: "Rental Tool",
    icon: Truck,
    items: [
      { title: "Dashboard", url: "/rental/dashboard", icon: LayoutDashboard, permission: "RENTAL_DASHBOARD" },
      { title: "Categories", url: "/rental/categories", icon: FolderTree, permission: "RENTAL_CATEGORIES" },
      { title: "Equipment", url: "/rental/equipment", icon: Hammer, permission: "RENTAL_EQUIPMENT" },
      { title: "Bookings", url: "/rental/bookings", icon: Calendar, permission: "RENTAL_BOOKINGS" },
    ],
  },
  {
    title: "Planner",
    icon: ClipboardList,
    items: [
      { title: "Dashboard", url: "/planner/dashboard", icon: LayoutDashboard, permission: "PLANNER_DASHBOARD" },
      { title: "Smart Build Tool", url: "/planner/smart-build", icon: Hammer, permission: "PLANNER_SMART_BUILD" },
      { title: "Estimations", url: "/planner/estimations", icon: Calculator, permission: "PLANNER_ESTIMATIONS" },
      { title: "Projects", url: "/planner/projects", icon: FolderKanban, permission: "PLANNER_PROJECTS" },
    ],
  },
  {
    title: "Common",
    icon: Globe,
    items: [
      { title: "Country", url: "/common/country", icon: Globe, permission: "COMMON_COUNTRY" },
      { title: "State", url: "/common/state", icon: Map, permission: "COMMON_STATE" },
      { title: "City", url: "/common/city", icon: MapPin, permission: "COMMON_CITY" },
      { title: "Pincode", url: "/common/pincode", icon: Hash, permission: "COMMON_PINCODE" },
    ],
  },
  {
    title: "Administration",
    icon: Shield,
    items: [
      { title: "Company", url: "/admin/company", icon: Building, permission: "ADMIN_COMPANY" },
      { title: "Users", url: "/admin/users", icon: Users, permission: "ADMIN_USERS" },
      { title: "Sub Admin", url: "/admin/sub-admin", icon: ShieldCheck, permission: "ADMIN_SUB_ADMIN" },
    ],
  },
  {
    title: "Content Management",
    icon: FileText,
    items: [
      { title: "Banner", url: "/content/banner", icon: Image, permission: "CONTENT_BANNER" },
      { title: "Home", url: "/content/home", icon: Home, permission: "CONTENT_HOME" },
      { title: "FAQ", url: "/content/faq", icon: HelpCircle, permission: "CONTENT_FAQ" },
    ],
  },
];
