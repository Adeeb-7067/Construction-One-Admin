import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ThemeProvider } from "@/components/theme-provider";
import NotFound from "./pages/NotFound";

// Dashboard
import MainDashboard from "./pages/dashboard/MainDashboard";

// Marketplace
import MarketplaceDashboard from "./pages/marketplace/MarketplaceDashboard";
import Products from "./pages/marketplace/Products";
import Categories from "./pages/marketplace/Categories";
import Brands from "./pages/marketplace/Brands";
import Vendors from "./pages/marketplace/Vendors";
import VendorDetail from "./pages/marketplace/VendorDetail";
import FlashSale from "./pages/marketplace/FlashSale";
import RFQ from "./pages/marketplace/RFQ";
import Transactions from "./pages/marketplace/Transactions";
import MarketplaceFAQ from "./pages/marketplace/MarketplaceFAQ";

// Services
import ServicesDashboard from "./pages/services/ServicesDashboard";
import Providers from "./pages/services/Providers";
import ServiceBookings from "./pages/services/ServiceBookings";
import Quotations from "./pages/services/Quotations";
import Inspections from "./pages/services/Inspections";

// Rental
import RentalDashboard from "./pages/rental/RentalDashboard";
import RentalCategories from "./pages/rental/RentalCategories";
import Equipment from "./pages/rental/Equipment";
import RentalBookings from "./pages/rental/RentalBookings";

// Planner
import PlannerDashboard from "./pages/planner/PlannerDashboard";
import SmartBuild from "./pages/planner/SmartBuild";
import Estimations from "./pages/planner/Estimations";
import Projects from "./pages/planner/Projects";

// Common
import Countries from "./pages/common/Countries";
import States from "./pages/common/States";
import Cities from "./pages/common/Cities";
import Pincodes from "./pages/common/Pincodes";

// Admin
import Company from "./pages/admin/Company";
import AdminUsers from "./pages/admin/AdminUsers";
import SubAdmin from "./pages/admin/SubAdmin";

// Content
import Banners from "./pages/content/Banners";
import HomeContent from "./pages/content/HomeContent";
import ContentFAQ from "./pages/content/ContentFAQ";

//Module
import Module from "./pages/module/module"
import Login from "./pages/login/login";
import VendorRequests from "./pages/marketplace/VendorRequests";
import Profile from "./pages/admin/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route element={<AdminLayout />}>
              <Route path="/dashboard" element={<MainDashboard />} />
              <Route path="/module" element={<Module />} />

              {/* Marketplace */}
              <Route path="/marketplace/dashboard" element={<MarketplaceDashboard />} />
              <Route path="/marketplace/products" element={<Products />} />
              <Route path="/marketplace/categories" element={<Categories />} />
              <Route path="/marketplace/brands" element={<Brands />} />
              <Route path="/marketplace/vendors" element={<Vendors />} />
              <Route path="/marketplace/vendors/:id" element={<VendorDetail />} />
              <Route path="/marketplace/flash-sale" element={<FlashSale />} />
              <Route path="/marketplace/rfq" element={<RFQ />} />
              <Route path="/marketplace/transactions" element={<Transactions />} />
              <Route path="/marketplace/vendor-requests" element={<VendorRequests />} />
              <Route path="/marketplace/faq" element={<MarketplaceFAQ />} />

              {/* Services */}
              <Route path="/services/dashboard" element={<ServicesDashboard />} />
              <Route path="/services/providers" element={<Providers />} />
              <Route path="/services/bookings" element={<ServiceBookings />} />
              <Route path="/services/quotations" element={<Quotations />} />
              <Route path="/services/inspections" element={<Inspections />} />

              {/* Rental */}
              <Route path="/rental/dashboard" element={<RentalDashboard />} />
              <Route path="/rental/categories" element={<RentalCategories />} />
              <Route path="/rental/equipment" element={<Equipment />} />
              <Route path="/rental/bookings" element={<RentalBookings />} />

              {/* Planner */}
              <Route path="/planner/dashboard" element={<PlannerDashboard />} />
              <Route path="/planner/smart-build" element={<SmartBuild />} />
              <Route path="/planner/estimations" element={<Estimations />} />
              <Route path="/planner/projects" element={<Projects />} />

              {/* Common */}
              <Route path="/common/country" element={<Countries />} />
              <Route path="/common/state" element={<States />} />
              <Route path="/common/city" element={<Cities />} />
              <Route path="/common/pincode" element={<Pincodes />} />

              {/* Administration */}
              <Route path="/admin/company" element={<Company />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/sub-admin" element={<SubAdmin />} />
              <Route path="/admin/profile" element={<Profile />} />

              {/* Content */}
              <Route path="/content/banner" element={<Banners />} />
              <Route path="/content/home" element={<HomeContent />} />
              <Route path="/content/faq" element={<ContentFAQ />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
