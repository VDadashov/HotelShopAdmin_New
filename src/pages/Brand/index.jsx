import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useGet } from "@/utils/hooks/useCustomQuery";
import { usePost, useUpdate, useDelete, usePatch } from "@/utils/hooks/useCustomMutation";
import { useDebounce } from "@/utils/hooks";
import { ENDPOINTS } from "@/utils/constants/Endpoints";

// Import components
import BrandForm from "@/components/Brands/BrandForm";
import BrandViewModal from "@/components/Brands/BrandViewModal";
import BrandDeleteModal from "@/components/Brands/BrandDeleteModal";
import BrandTable from "@/components/Brands/BrandTable";

export default function Brand() {
  const { t, i18n } = useTranslation();

  // State management
  const [showCreate, setShowCreate] = useState(false);
  const [editBrand, setEditBrand] = useState(null);
  const [viewBrand, setViewBrand] = useState(null);
  const [deleteBrand, setDeleteBrand] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({
    isActive: null,
    page: 1,
    pageSize: 10
  });

  // Debounced search value (300ms delay)
  const debouncedSearchValue = useDebounce(searchValue, 300);

  // API hooks
  const apiUrl = useMemo(() => {
    const params = new URLSearchParams();
    
    if (debouncedSearchValue.trim()) {
      params.append('search', debouncedSearchValue.trim());
    }
    
    if (filters.isActive !== null) {
      params.append('isActive', filters.isActive);
    }
    
    params.append('page', filters.page);
    params.append('limit', filters.pageSize);
    
    return `${ENDPOINTS.brand}?${params.toString()}`;
  }, [debouncedSearchValue, filters]);

  const { data: brandList = [], isLoading, refetch } = useGet("brands", apiUrl, i18n.language);

  const createBrand = usePost("brands", ENDPOINTS.brand);
  const updateBrand = usePatch("brands", ENDPOINTS.brand, editBrand?.id);
  const deleteBrandMutation = useDelete("brands", ENDPOINTS.brand, deleteBrand?.id);

  const { data: categoryList = [] } = useGet(
    "categories",
    ENDPOINTS.categories
  );

  // Process table data
  const tableData = useMemo(() => {
    let rawData = [];

    if (Array.isArray(brandList)) {
      rawData = brandList;
    } else if (brandList && typeof brandList === "object" && Array.isArray(brandList.data)) {
      rawData = brandList.data;
    } else if (brandList && typeof brandList === "object" && Array.isArray(brandList.items)) {
      rawData = brandList.items;
    }

    return rawData.map((item) => {
      // Extract name text for search
      let nameText = "";
      if (item.name && typeof item.name === "object") {
        nameText = Object.values(item.name).join(" ");
      }

      return {
        ...item,
        searchableName: nameText,
        searchText: nameText.toLowerCase(),
      };
    });
  }, [brandList]);

  // Event handlers
  const handleEdit = (brand) => {
    setEditBrand(brand);
    setShowCreate(true);
  };

  const handleFormSubmit = (formData, { setSubmitting, resetForm }) => {
    console.log('Brand/index - handleFormSubmit called with formData:', formData);
    console.log('Brand/index - editBrand:', editBrand);
    
    if (editBrand) {
      console.log('Brand/index - Updating brand...');
      updateBrand.mutate(formData, {
        onSuccess: () => {
          toast.success(t('brands.brandUpdated'));
          setShowCreate(false);
          setEditBrand(null);
          resetForm();
          refetch();
        },
        onError: (error) => {
          toast.error(error?.message || t('common.error'));
        },
        onSettled: () => setSubmitting(false),
      });
    } else {
      console.log('Brand/index - Creating brand...');
      createBrand.mutate(formData, {
        onSuccess: () => {
          toast.success(t('brands.brandAdded'));
          setShowCreate(false);
          resetForm();
          refetch();
        },
        onError: (error) => {
          toast.error(error?.message || t('common.error'));
        },
        onSettled: () => setSubmitting(false),
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteBrand || !deleteBrand.id) return;

    deleteBrandMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success(t('brands.brandDeleted'));
        setDeleteBrand(null);
        refetch();
      },
      onError: (error) => {
        toast.error(error?.message || t('common.error'));
      },
    });
  };

  const handleFormClose = () => {
    setShowCreate(false);
    setEditBrand(null);
  };

  return (
    <div className="w-full mx-auto py-10 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">{t('brands.title')}</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            onClick={() => {
              setShowCreate(true);
              setEditBrand(null);
            }}
            className="bg-[rgb(var(--primary-brand))] text-black font-semibold hover:bg-[rgb(var(--primary-brand-hover))] w-full sm:w-auto"
          >
            {t('brands.addBrand')}
          </Button>
        </div>
      </div>

      {/* Brand Form Modal */}
      <BrandForm
        isOpen={showCreate}
        onClose={handleFormClose}
        editBrand={editBrand}
        onSubmit={handleFormSubmit}
        isSubmitting={createBrand.isPending || updateBrand.isPending}
      />

      {/* Delete Confirmation Modal */}
      <BrandDeleteModal
        brand={deleteBrand}
        isOpen={!!deleteBrand}
        onClose={() => setDeleteBrand(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteBrandMutation.isPending}
      />

      {/* View Brand Modal */}
      <BrandViewModal
        brand={viewBrand}
        isOpen={!!viewBrand}
        onClose={() => setViewBrand(null)}
      />

      {/* Brand Table */}
      <BrandTable
        data={tableData}
        onView={setViewBrand}
        onEdit={handleEdit}
        onDelete={setDeleteBrand}
        onSearch={setSearchValue}
        searchValue={searchValue}
        onFiltersChange={setFilters}
        filters={filters}
      />

      {/* Toast notifications */}
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
}
