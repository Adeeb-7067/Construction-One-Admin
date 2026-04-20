import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseUrl = import.meta.env.VITE_BASE_URL;
export const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Auth", "Modules", "ParentCategories", "CategoryTree", "Brands", "Countries", "States", "Cities", "Pincodes", "Users", "Vendors", "Products", "FAQs", "RFQs", "FlashSales", "Banners", "Transactions", "Withdrawals", "HomeSections", "SubAdmins", "Dashboard"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/admin/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    getPlatformModules: builder.query({
      query: () => "/admin/platform-modules",
      providesTags: ["Modules"],
    }),
    createPlatformModule: builder.mutation({
      query: (formData) => ({
        url: "/admin/platform-modules",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Modules"],
    }),
    updatePlatformModule: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/admin/platform-modules/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Modules"],
    }),
    deletePlatformModule: builder.mutation({
      query: (id) => ({
        url: `/admin/platform-modules/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Modules"],
    }),
    updateModuleStatus: builder.mutation({
      query: (id) => ({
        url: `/admin/platform-modules/${id}/toggle`,
        method: "PATCH",
      }),
      invalidatesTags: ["Modules"],
    }),
    updateModuleVisibility: builder.mutation({
      query: (id) => ({
        url: `/admin/platform-modules/${id}/visibility`,
        method: "PATCH",
      }),
      invalidatesTags: ["Modules"],
    }),
    getParentCategories: builder.query({
      query: (moduleId) => moduleId ? `/admin/pcategories?moduleId=${moduleId}` : "/admin/pcategories",
      providesTags: ["ParentCategories"],
    }),
    createParentCategory: builder.mutation({
      query: (formData) => ({
        url: "/admin/pcategories",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["ParentCategories", "CategoryTree"],
    }),
    updateParentCategory: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/admin/pcategories/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["ParentCategories", "CategoryTree"],
    }),
    deleteParentCategory: builder.mutation({
      query: (id) => ({
        url: `/admin/pcategories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ParentCategories", "CategoryTree"],
    }),
    updateParentCategoryStatus: builder.mutation({
      query: (id) => ({
        url: `/admin/pcategories/${id}/toggle`,
        method: "PATCH",
      }),
      invalidatesTags: ["ParentCategories", "CategoryTree"],
    }),
    getCategoryTree: builder.query({
      query: () => "/category/categories/admin",
      providesTags: ["CategoryTree"],
    }),
    getCategories: builder.query({
      query: (pcategoryId) => pcategoryId ? `/admin/categories?pcategoryId=${pcategoryId}` : "/admin/categories",
      providesTags: ["CategoryTree"],
    }),
    createCategory: builder.mutation({
      query: (formData) => ({
        url: "/admin/categories",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["CategoryTree"],
    }),
    updateCategory: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/admin/categories/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["CategoryTree"],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/admin/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CategoryTree"],
    }),
    updateCategoryStatus: builder.mutation({
      query: (id) => ({
        url: `/admin/categories/${id}/toggle`,
        method: "PATCH",
      }),
      invalidatesTags: ["CategoryTree"],
    }),
    getSubCategories: builder.query({
      query: (categoryId) => categoryId ? `/admin/sub-categories?categoryId=${categoryId}` : "/admin/sub-categories",
      providesTags: ["CategoryTree"],
    }),
    createSubCategory: builder.mutation({
      query: (formData) => ({
        url: "/admin/sub-categories",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["CategoryTree"],
    }),
    updateSubCategory: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/admin/sub-categories/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["CategoryTree"],
    }),
    deleteSubCategory: builder.mutation({
      query: (id) => ({
        url: `/admin/sub-categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CategoryTree"],
    }),
    updateSubCategoryStatus: builder.mutation({
      query: (id) => ({
        url: `/admin/sub-categories/${id}/toggle`,
        method: "PATCH",
      }),
      invalidatesTags: ["CategoryTree"],
    }),
    createProductType: builder.mutation({
      query: (data) => ({
        url: "/product-types/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CategoryTree"],
    }),
    updateProductType: builder.mutation({
      query: ({ id, data }) => ({
        url: `/product-types/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["CategoryTree"],
    }),
    deleteProductType: builder.mutation({
      query: (id) => ({
        url: `/product-types/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CategoryTree"],
    }),
    updateProductTypeStatus: builder.mutation({
      query: (id) => ({
        url: `/product-types/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["CategoryTree"],
    }),
    getBrands: builder.query({
      query: () => "/material/brands",
      providesTags: ["Brands"],
    }),
    updateBrandStatus: builder.mutation({
      query: (id) => ({
        url: `/material/brands/${id}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: ["Brands"],
    }),
    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `/material/brands/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Brands"],
    }),
    createBrand: builder.mutation({
      query: (formData) => ({
        url: "/material/brands",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Brands"],
    }),
    updateBrand: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/material/brands/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Brands"],
    }),
    getCountries: builder.query({
      query: () => "/countries",
      providesTags: ["Countries"],
    }),
    createCountry: builder.mutation({
      query: (formData) => ({
        url: "/countries",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Countries"],
    }),
    updateCountry: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/countries/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Countries"],
    }),
    deleteCountry: builder.mutation({
      query: (id) => ({
        url: `/countries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Countries"],
    }),
    updateCountryStatus: builder.mutation({
      query: (id) => ({
        url: `/countries/${id}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: ["Countries"],
    }),
    getStates: builder.query({
      query: (countryId) => countryId ? `/states?countryId=${countryId}` : "/states",
      providesTags: ["States"],
    }),
    createState: builder.mutation({
      query: (data) => ({
        url: "/states",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["States"],
    }),
    updateState: builder.mutation({
      query: ({ id, data }) => ({
        url: `/states/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["States"],
    }),
    deleteState: builder.mutation({
      query: (id) => ({
        url: `/states/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["States"],
    }),
    updateStateStatus: builder.mutation({
      query: (id) => ({
        url: `/states/${id}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: ["States"],
    }),
    getCities: builder.query({
      query: (stateId) => stateId ? `/cities?stateId=${stateId}` : "/cities",
      providesTags: ["Cities"],
    }),
    createCity: builder.mutation({
      query: (data) => ({
        url: "/cities",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cities"],
    }),
    updateCity: builder.mutation({
      query: ({ id, data }) => ({
        url: `/cities/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Cities"],
    }),
    deleteCity: builder.mutation({
      query: (id) => ({
        url: `/cities/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cities"],
    }),
    updateCityStatus: builder.mutation({
      query: (id) => ({
        url: `/cities/${id}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: ["Cities"],
    }),
    getPincodes: builder.query({
      query: () => "/pincodes",
      providesTags: ["Pincodes"],
    }),
    createPincode: builder.mutation({
      query: (data) => ({
        url: "/pincodes/bulk",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Pincodes"],
    }),
    updatePincode: builder.mutation({
      query: ({ id, data }) => ({
        url: `/pincodes/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Pincodes"],
    }),
    deletePincode: builder.mutation({
      query: (id) => ({
        url: `/pincodes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Pincodes"],
    }),
    updatePincodeStatus: builder.mutation({
      query: (id) => ({
        url: `/pincodes/${id}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: ["Pincodes"],
    }),
    getUsers: builder.query({
      query: () => "/users",
      providesTags: ["Users"],
    }),
    updateUserStatus: builder.mutation({
      query: (id) => ({
        url: `/users/${id}/toggle`,
        method: "PATCH",
      }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
    getVendors: builder.query({
      query: () => "/vendor/all",
      providesTags: ["Vendors"],
    }),
    getVendorById: builder.query({
      query: (id) => `/vendor/${id}`,
      providesTags: ["Vendors"],
    }),
    verifyVendor: builder.mutation({
      query: (id) => ({
        url: `/vendor/admin-varify/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Vendors"],
    }),
    toggleVendorStatus: builder.mutation({
      query: (id) => ({
        url: `/vendor/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Vendors"],
    }),
    assignVendorBadges: builder.mutation({
      query: ({ id, badges }) => ({
        url: `/vendor/badge/${id}`,
        method: "POST",
        body: { badges },
      }),
      invalidatesTags: ["Vendors"],
    }),
    removeVendorBadges: builder.mutation({
      query: ({ id, badges }) => ({
        url: `/vendor/remove-badge/${id}`,
        method: "POST",
        body: { badges },
      }),
      invalidatesTags: ["Vendors"],
    }),
    getCompany: builder.query({
      query: () => "/company/get-company",
    }),
    updateCompany: builder.mutation({
      query: (formData) => ({
        url: "/company/update-company",
        method: "POST",
        body: formData,
      }),
    }),
    getProducts: builder.query({
      query: () => "/material/products/admin",
      providesTags: ["Products"],
    }),
    verifyProduct: builder.mutation({
      query: ({ id, body }) => ({
        url: `/material/verifyProduct/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Products"],
    }),
    toggleProductStatus: builder.mutation({
      query: (id) => ({
        url: `/material/disableProduct/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Products"],
    }),
    getFAQs: builder.query({
      query: () => "/faqs",
      providesTags: ["FAQs"],
    }),
    createFAQ: builder.mutation({
      query: (data) => ({
        url: "/faqs",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["FAQs"],
    }),
    updateFAQ: builder.mutation({
      query: ({ id, data }) => ({
        url: `/faqs/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["FAQs"],
    }),
    deleteFAQ: builder.mutation({
      query: (id) => ({
        url: `/faqs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FAQs"],
    }),
    getRFQs: builder.query({
      query: () => "/rfq/admin",
      providesTags: ["RFQs"],
    }),
    getFlashSales: builder.query({
      query: () => "/admin/flash-sales",
      providesTags: ["FlashSales"],
    }),
    createFlashSale: builder.mutation({
      query: (data) => ({
        url: "/admin/flash-sales",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["FlashSales"],
    }),
    updateFlashSale: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/flash-sales/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["FlashSales"],
    }),
    getVendorsByModule: builder.query({
      query: (moduleId) => `/vendor/module/${moduleId}`,
    }),
    getProductsByVendor: builder.query({
      query: (vendorId) => `/material/products/admin/vendor/${vendorId}`,
    }),
    getProductVariants: builder.query({
      query: ({ vendorId, productId }) => `/material/${vendorId}/products/${productId}/variants`,
    }),
    cancelFlashSale: builder.mutation({
      query: (id) => ({
        url: `/admin/flash-sales/${id}/cancel`,
        method: "PUT",
      }),
      invalidatesTags: ["FlashSales"],
    }),
    getBanners: builder.query({
      query: (params) => ({
        url: "/admin/banners",
        params
      }),
      providesTags: ["Banners"],
    }),
    createBanner: builder.mutation({
      query: (formData) => ({
        url: "/admin/banners",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Banners"],
    }),
    updateBanner: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/admin/banners/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Banners"],
    }),
    deleteBanner: builder.mutation({
      query: (id) => ({
        url: `/admin/banners/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Banners"],
    }),
    toggleBannerStatus: builder.mutation({
      query: (id) => ({
        url: `/admin/banners/${id}/toggle`,
        method: "PATCH",
      }),
      invalidatesTags: ["Banners"],
    }),
    getTransactions: builder.query({
      query: (params) => ({
        url: "/vendor/transactions/history",
        params
      }),
      providesTags: ["Transactions"],
    }),
    getWithdrawals: builder.query({
      query: (params) => ({
        url: "/vendor/withdrawals",
        params
      }),
      providesTags: ["Withdrawals"],
    }),
    approveWithdrawal: builder.mutation({
      query: ({ id, transactionId }) => ({
        url: `/vendor/withdrawals/approve/${id}`,
        method: "PATCH",
        body: { transactionId },
      }),
      invalidatesTags: ["Withdrawals", "Transactions"],
    }),
    getHomeSections: builder.query({
      query: (params) => ({
        url: "/admin/home-sections",
        params
      }),
      providesTags: ["HomeSections"],
    }),
    createHomeSection: builder.mutation({
      query: (data) => ({
        url: "/admin/home-sections",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["HomeSections"],
    }),
    updateHomeSection: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/home-sections/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["HomeSections"],
    }),
    deleteHomeSection: builder.mutation({
      query: (id) => ({
        url: `/admin/home-sections/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["HomeSections"],
    }),
    toggleHomeSectionStatus: builder.mutation({
      query: (id) => ({
        url: `/admin/home-sections/${id}/toggle`,
        method: "PATCH",
      }),
      invalidatesTags: ["HomeSections"],
    }),
    getSubAdmins: builder.query({
      query: (params) => ({
        url: "/admin/sub-admin",
        params
      }),
      providesTags: ["SubAdmins"],
    }),
    createSubAdmin: builder.mutation({
      query: (data) => ({
        url: "/admin/sub-admin",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SubAdmins"],
    }),
    updateSubAdmin: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/sub-admin/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["SubAdmins"],
    }),
    deleteSubAdmin: builder.mutation({
      query: (id) => ({
        url: `/admin/sub-admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SubAdmins"],
    }),
    toggleSubAdminStatus: builder.mutation({
      query: (id) => ({
        url: `/admin/sub-admin/toggle/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["SubAdmins"],
    }),
    getAdminMe: builder.query({
      query: (role) => (role === "SUB_ADMIN" ? "/admin/sub-admin/me" : "/admin/me"),
      providesTags: ["Auth"],
    }),
    updateAdminProfile: builder.mutation({
      query: ({ role, data }) => ({
        url: role === "SUB_ADMIN" ? "/admin/sub-admin/me" : "/admin/me",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
    getAdminDashboard: builder.query({
      query: ({ filter, startDate, endDate }) => ({
        url: "/admin/dashboard",
        params: { filter, startDate, endDate },
      }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { 
  useLoginMutation, 
  useGetPlatformModulesQuery,
  useCreatePlatformModuleMutation,
  useUpdatePlatformModuleMutation,
  useDeletePlatformModuleMutation,
  useUpdateModuleStatusMutation,
  useUpdateModuleVisibilityMutation,
  useGetParentCategoriesQuery,
  useCreateParentCategoryMutation,
  useUpdateParentCategoryMutation,
  useDeleteParentCategoryMutation,
  useUpdateParentCategoryStatusMutation,
  useGetCategoryTreeQuery,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryStatusMutation,
  useGetSubCategoriesQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useUpdateSubCategoryStatusMutation,
  useCreateProductTypeMutation,
  useUpdateProductTypeMutation,
  useDeleteProductTypeMutation,
  useUpdateProductTypeStatusMutation,
  useGetBrandsQuery,
  useUpdateBrandStatusMutation,
  useDeleteBrandMutation,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useGetCountriesQuery,
  useCreateCountryMutation,
  useUpdateCountryMutation,
  useDeleteCountryMutation,
  useUpdateCountryStatusMutation,
  useGetStatesQuery,
  useCreateStateMutation,
  useUpdateStateMutation,
  useDeleteStateMutation,
  useUpdateStateStatusMutation,
  useGetCitiesQuery,
  useCreateCityMutation,
  useUpdateCityMutation,
  useDeleteCityMutation,
  useUpdateCityStatusMutation,
  useGetPincodesQuery,
  useCreatePincodeMutation,
  useUpdatePincodeMutation,
  useDeletePincodeMutation,
  useUpdatePincodeStatusMutation,
  useGetUsersQuery,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
  useGetVendorsQuery,
  useGetVendorByIdQuery,
  useVerifyVendorMutation,
  useToggleVendorStatusMutation,
  useAssignVendorBadgesMutation,
  useRemoveVendorBadgesMutation,
  useGetCompanyQuery,
  useUpdateCompanyMutation,
  useGetProductsQuery,
  useVerifyProductMutation,
  useToggleProductStatusMutation,
  useGetFAQsQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
  useGetRFQsQuery,
  useGetFlashSalesQuery,
  useCreateFlashSaleMutation,
  useUpdateFlashSaleMutation,
  useGetVendorsByModuleQuery,
  useGetProductsByVendorQuery,
  useGetProductVariantsQuery,
  useCancelFlashSaleMutation,
  useGetBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  useToggleBannerStatusMutation,
  useGetTransactionsQuery,
  useGetWithdrawalsQuery,
  useApproveWithdrawalMutation,
  useGetHomeSectionsQuery,
  useCreateHomeSectionMutation,
  useUpdateHomeSectionMutation,
  useDeleteHomeSectionMutation,
  useToggleHomeSectionStatusMutation,
  useGetSubAdminsQuery,
  useCreateSubAdminMutation,
  useUpdateSubAdminMutation,
  useDeleteSubAdminMutation,
  useToggleSubAdminStatusMutation,
  useGetAdminMeQuery,
  useUpdateAdminProfileMutation,
  useGetAdminDashboardQuery
} = apiSlice;