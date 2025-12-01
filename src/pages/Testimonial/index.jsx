import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import TestimonialTable from "@/components/Testimonials/TestimonialTable";
import TestimonialViewModal from "@/components/Testimonials/TestimonialViewModal";
import TestimonialDeleteModal from "@/components/Testimonials/TestimonialDeleteModal";
import TestimonialForm from "@/components/Testimonials/TestimonialForm";
import { useGet, usePost, useUpdate, useDelete, useDebounce } from "@/utils/hooks";
import { ENDPOINTS } from "@/utils/constants/Endpoints";

const Testimonial = () => {
  const { t, i18n } = useTranslation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({
    isActive: null,
    minRating: null,
    sort: "rating-high",
    page: 1,
    limit: 10,
  });

  const debouncedSearchValue = useDebounce(searchValue, 300);

  // API URL construction
  const apiUrl = useMemo(() => {
    const params = new URLSearchParams();
    
    if (debouncedSearchValue.trim()) {
      params.append('search', debouncedSearchValue.trim());
    }
    
    if (filters.isActive !== null) {
      params.append('isActive', filters.isActive);
    }
    
    if (filters.minRating !== null) {
      params.append('minRating', filters.minRating);
    }
    
    if (filters.sort) {
      params.append('sort', filters.sort);
    }
    
    params.append('page', filters.page);
    params.append('limit', filters.limit);
    params.append('allLanguages', 'true'); // Admin için bütün dillər
    
    return `${ENDPOINTS.testimonials}?${params.toString()}`;
  }, [debouncedSearchValue, filters]);

  // Data fetching
  const { data: testimonials, isLoading, refetch } = useGet(
    "testimonials",
    apiUrl,
    i18n.language
  );

  // Mutations
  const createTestimonial = usePost("testimonials", ENDPOINTS.testimonials);
  const updateTestimonial = useUpdate("testimonials", ENDPOINTS.testimonials, selectedItem?.id);
  const deleteTestimonialMutation = useDelete("testimonials", ENDPOINTS.testimonials, selectedItem?.id);

  // Handlers
  const handleAdd = () => {
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setIsViewOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (values) => {
    try {
      if (selectedItem) {
        await updateTestimonial.mutateAsync(values);
        toast.success(t("testimonials.testimonialUpdated"));
      } else {
        await createTestimonial.mutateAsync(values);
        toast.success(t("testimonials.testimonialAdded"));
      }
      setIsFormOpen(false);
      refetch();
    } catch (error) {
      toast.error(error?.message || t("common.error"));
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteTestimonialMutation.mutateAsync();
      toast.success(t("testimonials.testimonialDeleted"));
      setIsDeleteOpen(false);
      refetch();
    } catch (error) {
      toast.error(error?.message || t("common.error"));
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedItem(null);
  };

  const handleSearch = (value) => {
    setSearchValue(value);
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const tableData = testimonials?.data || [];

  return (
    <div className="w-full mx-auto py-10 px-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">{t("testimonials.title")}</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button 
            onClick={handleAdd} 
            className="bg-[rgb(var(--primary-brand))] text-black font-semibold hover:bg-[rgb(var(--primary-brand-hover))] flex items-center gap-2 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            {t("testimonials.add")}
          </Button>
        </div>
      </div>

      <TestimonialTable
        data={tableData}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSearch={handleSearch}
        searchValue={searchValue}
        onFiltersChange={handleFiltersChange}
        filters={filters}
      />

      {/* Form Modal */}
      {isFormOpen && (
        <TestimonialForm
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          editData={selectedItem}
        />
      )}

      {/* View Modal */}
      {isViewOpen && selectedItem && (
        <TestimonialViewModal
          isOpen={isViewOpen}
          onClose={() => setIsViewOpen(false)}
          testimonial={selectedItem}
        />
      )}

      {/* Delete Modal */}
      {isDeleteOpen && selectedItem && (
        <TestimonialDeleteModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDeleteConfirm}
          testimonial={selectedItem}
        />
      )}

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

export default Testimonial;
