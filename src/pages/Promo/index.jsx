import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

// Components
import PromoForm from "@/components/Promos/PromoForm";
import PromoTable from "@/components/Promos/PromoTable";
import PromoViewModal from "@/components/Promos/PromoViewModal";
import PromoDeleteModal from "@/components/Promos/PromoDeleteModal";

// Hooks and Utils
import { useGet, usePost, useUpdate, useDelete } from "@/utils/hooks";
import { ENDPOINTS } from "@/utils/constants/Endpoints";
import { useDebounce } from "@/utils/hooks/useDebounce";

const PromoPage = () => {
  const { t, i18n } = useTranslation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({
    search: "",
    isActive: null,
    productId: null,
    current: null,
    startDateFrom: "",
    startDateTo: "",
    sort: "newest",
    page: 1,
    limit: 10,
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  // API URL construction
  const apiUrl = useMemo(() => {
    const params = new URLSearchParams();
    
    if (debouncedSearch) params.append("search", debouncedSearch);
    if (filters.isActive !== null) params.append("isActive", filters.isActive);
    if (filters.productId !== null) params.append("productId", filters.productId);
    if (filters.current !== null) params.append("current", filters.current);
    if (filters.startDateFrom) params.append("startDateFrom", filters.startDateFrom);
    if (filters.startDateTo) params.append("startDateTo", filters.startDateTo);
    if (filters.sort) params.append("sort", filters.sort);
    params.append("page", filters.page);
    params.append("limit", filters.limit);
    params.append("allLanguages", "true");

    return `${ENDPOINTS.promos}?${params.toString()}`;
  }, [debouncedSearch, filters.isActive, filters.productId, filters.current, filters.startDateFrom, filters.startDateTo, filters.sort, filters.page, filters.limit]);

  // API calls
  const { data: promosResponse, isLoading, refetch } = useGet("promos", apiUrl, i18n.language);
  const { data: productsResponse } = useGet("products", `${ENDPOINTS.products}?allLanguages=true`);
  
  // Transform data to match table expectations
  const transformedData = useMemo(() => {
    // Check if promosResponse is the array directly or wrapped in data property
    const rawData = Array.isArray(promosResponse) ? promosResponse : promosResponse?.data;
    
    if (!rawData || !Array.isArray(rawData)) {
      return [];
    }
    
    return rawData.map(promo => ({
      ...promo,
      productId: promo.product?.id || promo.productId
    }));
  }, [promosResponse]);
  
  const addPromo = usePost("promos", ENDPOINTS.promos);
  const updatePromo = useUpdate("promos", ENDPOINTS.promos, selectedItem?.id);
  const deletePromoMutation = useDelete("promos", ENDPOINTS.promos, selectedItem?.id);

  // Handlers
  const handleAdd = () => {
    setSelectedItem(null);
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (values) => {
    try {
      if (isEditMode) {
        await updatePromo.mutateAsync(values);
        toast.success(t("promos.promoUpdated"));
      } else {
        await addPromo.mutateAsync(values);
        toast.success(t("promos.promoAdded"));
      }
      setIsFormOpen(false);
      setSelectedItem(null);
      setIsEditMode(false);
      refetch();
    } catch (error) {
      toast.error(t("errors.generalError"));
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deletePromoMutation.mutateAsync();
      toast.success(t("promos.promoDeleted"));
      refetch();
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error(t("errors.generalError"));
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedItem(null);
    setIsEditMode(false);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }));
  };

  return (
    <div className="w-full mx-auto py-10 px-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">{t("promos.title")}</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button 
            onClick={handleAdd} 
            className="bg-[rgb(var(--primary-brand))] text-black font-semibold hover:bg-[rgb(var(--primary-brand-hover))] flex items-center gap-2 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            {t("promos.add")}
          </Button>
        </div>
      </div>

      {/* Table */}
      <PromoTable
        data={transformedData}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSearch={(value) => handleFiltersChange({ search: value })}
        searchValue={filters.search}
        onFiltersChange={handleFiltersChange}
        filters={filters}
        products={productsResponse?.data || []}
      />

      {/* Modals */}
      <PromoForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        editData={isEditMode ? selectedItem : null}
      />

      <PromoViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        promo={selectedItem}
      />

      <PromoDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        promo={selectedItem}
        isDeleting={deletePromoMutation.isPending}
      />

      <Toaster
        position="top-right"
        toastOptions={{
          classNames: {
            success: "!bg-green-500 !text-white",
            error: "!bg-red-500 !text-white"
          }
        }}
      />
    </div>
  );
};

export default PromoPage;
