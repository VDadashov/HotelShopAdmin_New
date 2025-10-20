import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useGet } from "@/utils/hooks/useCustomQuery";
import { usePost, useUpdate, useDelete } from "@/utils/hooks/useCustomMutation";
import { useDebounce } from "@/utils/hooks";
import { ENDPOINTS } from "@/utils/constants/Endpoints";

// Import components
import CategoryForm from "@/components/Categories/CategoryForm";
import CategoryViewModal from "@/components/Categories/CategoryViewModal";
import CategoryDeleteModal from "@/components/Categories/CategoryDeleteModal";
import CategoryTable from "@/components/Categories/CategoryTable";

export default function Category() {
  const { t, i18n } = useTranslation();
  
  const [showCreate, setShowCreate] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [deleteCategory, setDeleteCategory] = useState(null);
  const [viewCategory, setViewCategory] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({
    level: null,
    parentId: null,
    isActive: null,
    limit: 10,
    page: 1
  });

  // Debounced search value (300ms delay)
  const debouncedSearchValue = useDebounce(searchValue, 300);

  // Debug search values
  useEffect(() => {
    console.log('Search Value:', searchValue);
    console.log('Debounced Search Value:', debouncedSearchValue);
  }, [searchValue, debouncedSearchValue]);

  // API endpoint-i dinamik olaraq qururuq
  const apiUrl = useMemo(() => {
    console.log('useMemo: Building API URL with debouncedSearchValue:', debouncedSearchValue, 'type:', typeof debouncedSearchValue);
    console.log('useMemo: debouncedSearchValue.trim():', debouncedSearchValue.trim());
    console.log('useMemo: debouncedSearchValue.trim() length:', debouncedSearchValue.trim().length);
    
    const params = new URLSearchParams();
    
    if (debouncedSearchValue.trim()) {
      console.log('useMemo: Adding search parameter:', debouncedSearchValue.trim());
      params.append('search', debouncedSearchValue.trim());
    } else {
      console.log('useMemo: NOT adding search parameter because debouncedSearchValue is empty');
    }
    
    if (filters.level !== null) {
      params.append('level', filters.level);
    }
    
    if (filters.parentId !== null) {
      params.append('parentId', filters.parentId);
    }
    
    if (filters.isActive !== null) {
      params.append('isActive', filters.isActive);
    }
    
    params.append('limit', filters.limit);
    params.append('page', filters.page);
    
    const url = `${ENDPOINTS.categories}?${params.toString()}`;
    console.log('useMemo: Generated API URL:', url);
    return url;
  }, [debouncedSearchValue, filters]);

  const { data: categoryList = [], isLoading, refetch } = useGet("categories", apiUrl, i18n.language);
  const createCategory = usePost("categories", ENDPOINTS.categories);
  const updateCategory = useUpdate("categories", ENDPOINTS.categories, editCategory?.id);
  const deleteCategoryMutation = useDelete("categories", ENDPOINTS.categories, deleteCategory?.id);

  console.log(categoryList);
  

  const tableData = useMemo(() => {
    let rawData = Array.isArray(categoryList) ? categoryList : Array.isArray(categoryList?.data) ? categoryList.data : [];
    
    return rawData.map(item => ({
      ...item,
      searchableTitle: item.name ? Object.values(item.name).join(' ') : '',
      searchText: item.name ? Object.values(item.name).join(' ').toLowerCase() : '',
    }));
  }, [categoryList]);

  const handleEdit = (category) => {
    setEditCategory(category);
    setShowCreate(true);
  };

  const handleFormSubmit = (values, { setSubmitting, resetForm }) => {
    if (editCategory) {
      updateCategory.mutate(values, {
        onSuccess: () => {
          toast.success(t('categories.categoryUpdated'));
          setShowCreate(false);
          setEditCategory(null);
          resetForm();
        },
        onError: (error) => {
          toast.error(error?.message || t('common.error'));
        },
        onSettled: () => setSubmitting(false),
      });
    } else {
      createCategory.mutate(values, {
        onSuccess: () => {
          toast.success(t('categories.categoryAdded'));
          setShowCreate(false);
          resetForm();
        },
        onError: (error) => {
          toast.error(error?.message || t('common.error'));
        },
        onSettled: () => setSubmitting(false),
      });
    }
  };

  // Delete handler
  const handleDelete = () => {
    if (!deleteCategory || !deleteCategory.id) return;
    deleteCategoryMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success(t('categories.categoryDeleted'));
        setDeleteCategory(null);
      },
      onError: (error) => {
        toast.error(error?.message || t('common.error'));
      },
    });
  };

  return (
    <div className="w-full mx-auto py-10 px-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">{t('categories.title')}</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button 
            onClick={() => { 
              setShowCreate(true); 
              setEditCategory(null); 
            }} 
            className="bg-[rgb(var(--primary-brand))] text-black font-semibold hover:bg-[rgb(var(--primary-brand-hover))] w-full sm:w-auto"
          >
            {t('categories.addCategory')}
          </Button>
        </div>
      </div>

      {/* Category Form Modal */}
      <CategoryForm
        isOpen={showCreate}
        onClose={() => {
          setShowCreate(false);
          setEditCategory(null);
        }}
        categories={tableData}
        editCategory={editCategory}
        onSubmit={handleFormSubmit}
        isSubmitting={createCategory.isPending || updateCategory.isPending}
      />

      {/* Category View Modal */}
      <CategoryViewModal
        category={viewCategory}
        isOpen={!!viewCategory}
        onClose={() => setViewCategory(null)}
      />

      {/* Category Delete Modal */}
      <CategoryDeleteModal
        category={deleteCategory}
        isOpen={!!deleteCategory}
        onClose={() => setDeleteCategory(null)}
        onConfirm={handleDelete}
        isDeleting={deleteCategoryMutation.isPending}
      />

        {/* Category Table */}
        <CategoryTable
          data={tableData}
          onView={setViewCategory}
          onEdit={handleEdit}
          onDelete={setDeleteCategory}
          onSearch={setSearchValue}
          searchValue={searchValue}
          onFiltersChange={setFilters}
          filters={filters}
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
}