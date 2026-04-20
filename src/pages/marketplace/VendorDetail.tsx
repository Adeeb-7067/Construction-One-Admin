import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  useGetVendorByIdQuery,
  useGetStatesQuery,
  useGetCitiesQuery,
  useGetPincodesQuery
} from "../Redux/apiSlice";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Mail, Phone, Calendar, MapPin, Globe,
  Building2, Briefcase, FileText, CreditCard,
  Award, Star, ShieldCheck, ExternalLink, Package,
  ShoppingCart, Wallet, CheckCircle2, AlertCircle, TrendingUp
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const RATING_COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#22c55e'];

export default function VendorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: response, isLoading } = useGetVendorByIdQuery(id);
  const { data: statesResponse } = useGetStatesQuery(undefined);
  const { data: citiesResponse } = useGetCitiesQuery(undefined);
  const { data: pincodesResponse } = useGetPincodesQuery(undefined);

  const vendor = response?.data;

  // Lookup helpers
  const getStateName = (stateId: string) => {
    if (!stateId) return "";
    const state = statesResponse?.data?.states?.find((s: any) => s._id === stateId);
    return state?.name || stateId;
  };

  const getCityName = (cityId: string) => {
    if (!cityId) return "";
    const city = citiesResponse?.data?.cities?.find((c: any) => c._id === cityId);
    return city?.name || cityId;
  };

  const getPincodeValue = (pincodeId: string) => {
    if (!pincodeId) return "";
    const pincode = pincodesResponse?.data?.pincodes?.find((p: any) => p._id === pincodeId);
    return pincode?.code || pincodeId;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 rounded-lg" />)}
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <AlertCircle className="h-8 w-8 text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground">Vendor not found</p>
        <Button variant="link" size="sm" onClick={() => navigate("/marketplace/vendors")}>
          <ArrowLeft className="h-3 w-3 mr-1" /> Go back
        </Button>
      </div>
    );
  }

  const v = vendor.vendorId;
  const analytics = vendor.analytics || {};
  const wallet = analytics.wallet || {};

  const ratingData = Object.entries(v?.ratingBreakdown || {}).map(([star, count]) => ({
    name: `${star}★`,
    value: count as number,
  }));

  const orderData = [
    { name: "Total", count: analytics.totalOrders || 0 },
    { name: "Done", count: analytics.completedOrders || 0 },
    { name: "Pending", count: analytics.pendingOrders || 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/marketplace/vendors")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title={vendor.companyName}
          description={`${vendor.businessCategory} · ${vendor.companyType}`}
        />
      </div>

      {/* Vendor Profile Bar */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
          <span className="font-semibold text-foreground">{v?.avgRating || 0}</span>
          <span>({v?.totalReviews || 0} reviews)</span>
        </div>
        <Separator orientation="vertical" className="h-4" />
        <Badge variant={v?.isAdminVerified ? "default" : "secondary"} className={`text-xs ${v?.isAdminVerified ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"}`}>
          {v?.isAdminVerified ? "Verified" : "Pending"}
        </Badge>
        <Badge variant={v?.disable ? "destructive" : "outline"} className={`text-xs ${v?.disable ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100" : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"}`}>
          {v?.disable ? "Disabled" : "Active"}
        </Badge>
        {vendor.badges?.map((b: string) => {
          const badgeColors: Record<string, string> = {
            "TOP VENDOR": "bg-yellow-50 text-yellow-700 border-yellow-200",
            "MOST SOLD": "bg-green-50 text-green-700 border-green-200",
            "FAST DELIVERY": "bg-blue-50 text-blue-700 border-blue-200",
            "HIGH RATING": "bg-purple-50 text-purple-700 border-purple-200",
            "TRUSTED SELLER": "bg-teal-50 text-teal-700 border-teal-200",
            "ADMIN PICK": "bg-rose-50 text-rose-700 border-rose-200",
          };
          return (
            <Badge key={b} variant="outline" className={`text-[10px] uppercase ${badgeColors[b] || ""}`}>{b}</Badge>
          );
        })}
      </div>

      {/* Stat Cards with Colors */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg border bg-blue-50 border-blue-100 p-4">
          <div className="flex items-center gap-2 text-blue-600 mb-2"><Package className="h-4 w-4" /><span className="text-xs font-medium">Products</span></div>
          <p className="text-xl font-semibold text-blue-900">{analytics.totalProducts || 0}</p>
        </div>
        <div className="rounded-lg border bg-purple-50 border-purple-100 p-4">
          <div className="flex items-center gap-2 text-purple-600 mb-2"><ShoppingCart className="h-4 w-4" /><span className="text-xs font-medium">Orders</span></div>
          <p className="text-xl font-semibold text-purple-900">{analytics.totalOrders || 0}</p>
          <p className="text-[11px] text-purple-500 mt-0.5">{analytics.completedOrders || 0} completed</p>
        </div>
        <div className="rounded-lg border bg-green-50 border-green-100 p-4">
          <div className="flex items-center gap-2 text-green-600 mb-2"><TrendingUp className="h-4 w-4" /><span className="text-xs font-medium">Recommendation</span></div>
          <p className="text-xl font-semibold text-green-900">{v?.recommendationPercentage || 0}%</p>
        </div>
        <div className="rounded-lg border bg-amber-50 border-amber-100 p-4">
          <div className="flex items-center gap-2 text-amber-600 mb-2"><Wallet className="h-4 w-4" /><span className="text-xs font-medium">Wallet</span></div>
          <p className="text-xl font-semibold text-amber-900">₹{wallet.availableBalance || 0}</p>
          <p className="text-[11px] text-amber-500 mt-0.5">₹{wallet.onHoldBalance || 0} on hold</p>
        </div>
      </div>

      {/* Charts + Owner Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rating Chart */}
        <div className="rounded-lg border bg-card p-4 flex flex-col h-full">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Rating Breakdown</p>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ratingData} cx="50%" cy="50%" innerRadius={35} outerRadius={50} paddingAngle={4} dataKey="value">
                  {ratingData.map((_, i) => <Cell key={i} fill={RATING_COLORS[i]} />)}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: 8, fontSize: 10, border: '1px solid hsl(var(--border))' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-2 mt-auto pt-2 border-t border-dashed">
            {ratingData.map((entry, i) => (
              <span key={i} className="flex items-center gap-1 text-[9px] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: RATING_COLORS[i] }} />
                {entry.name}
              </span>
            ))}
          </div>
        </div>

        {/* Order Chart */}
        <div className="rounded-lg border bg-card p-4 flex flex-col h-full">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Order Summary</p>
          <div className="h-32 w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderData} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <RechartsTooltip contentStyle={{ borderRadius: 8, fontSize: 10, border: '1px solid hsl(var(--border))' }} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Owner Info */}
        <div className="rounded-lg border bg-card p-4 flex flex-col h-full">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Vendor Owner</p>
          <div className="flex-1">
            <p className="text-base font-bold capitalize text-foreground leading-tight">{v?.firstName} {v?.lastName}</p>
            <p className="text-xs text-muted-foreground mb-4">{v?.email}</p>
            <div className="space-y-2.5">
              <InfoRow icon={<Phone className="h-3.5 w-3.5" />} label="Phone" value={v?.phoneNumber} verified={v?.isPhoneVerified} />
              <InfoRow icon={<ShieldCheck className="h-3.5 w-3.5" />} label="Aadhar" value={v?.governmentIdNumber} verified={v?.isAadharVerified} sub={v?.governmentIdType} />
              <InfoRow icon={<Calendar className="h-3.5 w-3.5" />} label="Joined" value={new Date(v?.createdAt).toLocaleDateString()} />
            </div>
          </div>
          {v?.uploadId && (
            <div className="mt-4 pt-4 border-t border-dashed">
              <a href={v.uploadId} target="_blank" rel="noopener noreferrer" className="block text-[10px] text-primary hover:underline flex items-center gap-1">
                <FileText className="h-3 w-3" /> View ID Document
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Business Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg border bg-card p-5 space-y-4">
          <p className="text-xs font-medium text-muted-foreground">Business Details</p>
          <div className="grid grid-cols-2 gap-y-4 text-sm">
            <Field label="Contact" value={vendor.contactNumber} />
            <Field label="GST" value={vendor.gstNumber} />
            <Field label="Registration No." value={vendor.companyRegistrationNumber} />
            <Field label="Company Type" value={vendor.companyType} />
          </div>
          <Separator />
          <div className="text-sm">
            <p className="text-xs text-muted-foreground mb-1">Address</p>
            <p className="text-foreground">{vendor.businessAddress?.address}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {vendor.businessAddress?.latitude}, {vendor.businessAddress?.longitude}
            </p>
          </div>
          {vendor.companyWebsiteURl && (
            <a href={vendor.companyWebsiteURl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
              <Globe className="h-3 w-3" /> Website <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>

        <div className="rounded-lg border bg-card p-5 space-y-4">
          <p className="text-xs font-medium text-muted-foreground">Banking & Payouts</p>
          <div className="grid grid-cols-2 gap-y-4 text-sm">
            <Field label="Bank" value={vendor.bankName} />
            <Field label="Holder" value={vendor.accountHolderName} />
            <Field label="Account Number" value={vendor.accountNumber} />
            <Field label="IFSC" value={vendor.ifscCode} />
            <Field label="Account Type" value={vendor.accountType} />
            <Field label="UPI" value={vendor.upiId} />
          </div>
          <Separator />
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="p-2 rounded-md bg-green-50">
              <p className="text-[10px] text-green-600">Total</p>
              <p className="text-sm font-semibold text-green-800">₹{wallet.totalBalance || 0}</p>
            </div>
            <div className="p-2 rounded-md bg-blue-50">
              <p className="text-[10px] text-blue-600">Available</p>
              <p className="text-sm font-semibold text-blue-800">₹{wallet.availableBalance || 0}</p>
            </div>
            <div className="p-2 rounded-md bg-orange-50">
              <p className="text-[10px] text-orange-600">On Hold</p>
              <p className="text-sm font-semibold text-orange-800">₹{wallet.onHoldBalance || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Service Area */}
      <div className="rounded-lg border bg-card p-5 space-y-3">
        <p className="text-xs font-medium text-muted-foreground">Service Area</p>
        <div className="flex flex-wrap gap-4 text-sm">
          <div>
            <span className="text-xs text-muted-foreground mr-2">States:</span>
            {vendor.serviceArea?.selectedStates?.map((s: string) => (
              <Badge key={s} variant="secondary" className="text-[10px] mr-1 bg-indigo-50 text-indigo-700 border-indigo-100">{getStateName(s)}</Badge>
            ))}
            {(!vendor.serviceArea?.selectedStates || vendor.serviceArea?.selectedStates.length === 0) && <span className="text-xs italic text-muted-foreground">All States</span>}
          </div>
          <div>
            <span className="text-xs text-muted-foreground mr-2">Cities:</span>
            {vendor.serviceArea?.selectedCities?.map((c: string) => (
              <Badge key={c} variant="secondary" className="text-[10px] mr-1 bg-violet-50 text-violet-700 border-violet-100">{getCityName(c)}</Badge>
            ))}
            {(!vendor.serviceArea?.selectedCities || vendor.serviceArea?.selectedCities.length === 0) && <span className="text-xs italic text-muted-foreground">All Cities</span>}
          </div>
          <div>
            <span className="text-xs text-muted-foreground mr-2">Pincodes:</span>
            {vendor.serviceArea?.PinCodes?.map((p: string) => (
              <Badge key={p} variant="outline" className="text-[10px] mr-1 font-mono bg-slate-50 text-slate-700 border-slate-200">{getPincodeValue(p)}</Badge>
            ))}
            {(!vendor.serviceArea?.PinCodes || vendor.serviceArea?.PinCodes.length === 0) && <span className="text-xs italic text-muted-foreground">All Pincodes</span>}
          </div>
        </div>
      </div>

      {/* Top Products */}
      {vendor.topProducts?.length > 0 && (
        <div className="rounded-lg border bg-card p-5 space-y-4">
          <p className="text-xs font-medium text-muted-foreground">Top Products</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {vendor.topProducts.map((p: any) => (
              <div key={p.productId} className="flex gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="h-12 w-12 rounded-md border bg-white flex items-center justify-center shrink-0 overflow-hidden">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.name} className="h-full w-full object-contain" />
                  ) : (
                    <Package className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.totalOrders} orders</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg border bg-card p-5 space-y-3">
          <p className="text-xs font-medium text-muted-foreground">Shop Images</p>
          <div className="grid grid-cols-3 gap-2">
            {vendor.shopImages?.map((img: string, i: number) => (
              <a key={i} href={img} target="_blank" rel="noopener noreferrer" className="aspect-square rounded-md overflow-hidden border hover:opacity-80 transition-opacity">
                <img src={img} alt={`Shop ${i + 1}`} className="w-full h-full object-cover" />
              </a>
            ))}
            {(!vendor.shopImages || !vendor.shopImages.length) && (
              <p className="col-span-3 text-xs text-muted-foreground italic py-4 text-center">No images</p>
            )}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-5 space-y-3">
          <p className="text-xs font-medium text-muted-foreground">Certificates & Cheque</p>
          <div className="space-y-2">
            {vendor.certificates?.map((cert: string, i: number) => (
              <a key={i} href={cert} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1">Certificate {i + 1}</span>
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              </a>
            ))}
            {vendor.cancelledCheque && (
              <a href={vendor.cancelledCheque} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors text-sm">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1">Cancelled Cheque</span>
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value, verified, sub }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-muted-foreground">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}{sub && ` · ${sub}`}</p>
        <p className="text-sm truncate">{value || "N/A"}</p>
      </div>
      {verified !== undefined && (
        verified ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" /> : <AlertCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value || "N/A"}</p>
    </div>
  );
}
