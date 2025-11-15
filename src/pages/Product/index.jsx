import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useGet } from "@/utils/hooks/useCustomQuery";
import { usePost, useDelete, usePatch } from "@/utils/hooks/useCustomMutation";
import { useDebounce } from "@/utils/hooks";
import { ENDPOINTS } from "@/utils/constants/Endpoints";

// Import components
import ProductForm from "@/components/Products/ProductForm";
import ProductViewModal from "@/components/Products/ProductViewModal";
import ProductDeleteModal from "@/components/Products/ProductDeleteModal";
import ProductTable from "@/components/Products/ProductTable";

export default function Product() {
  const { t, i18n } = useTranslation();
  
  // State management
  const [showCreate, setShowCreate] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({
    categoryId: null,
    isActive: null,
    page: 1,
    pageSize: 10,
    sort: "newest"
  });

  // Debounced search value (300ms delay)
  const debouncedSearchValue = useDebounce(searchValue, 300);

  // API hooks
  const apiUrl = useMemo(() => {
    const params = new URLSearchParams();
    
    if (debouncedSearchValue.trim()) {
      params.append('searchQuery', debouncedSearchValue.trim());
    }
    
    if (filters.categoryId !== null) {
      params.append('categoryId', filters.categoryId);
    }
    
    if (filters.isActive !== null) {
      params.append('isActive', filters.isActive);
    }
    
    if (filters.sort) {
      params.append('sort', filters.sort);
    }
    
    params.append('page', filters.page);
    params.append('pageSize', filters.pageSize);
    
    return `${ENDPOINTS.products}?${params.toString()}`;
  }, [debouncedSearchValue, filters]);

  const { data: productList = [], isLoading, refetch } = useGet("products", apiUrl, i18n.language);
  const { data: categoryList = [] } = useGet(
    "categories",
    `${ENDPOINTS.getAllCategories}`,
    i18n.language
  );
  
  // Extract data from API response
  const categories = categoryList?.data || [];
  const createProduct = usePost("products", ENDPOINTS.products);
  const updateProduct = usePatch("products", ENDPOINTS.products, editProduct?.id);
  const deleteProductMutation = useDelete("products", ENDPOINTS.products, deleteProduct?.id);  

  // Process table data
  const tableData = useMemo(() => {
    let rawData = [];
    
    if (Array.isArray(productList)) {
      rawData = productList;
    } else if (productList && typeof productList === "object" && Array.isArray(productList.data)) {
      rawData = productList.data;
    } else if (productList && typeof productList === "object" && Array.isArray(productList.items)) {
      rawData = productList.items;
    }

    return rawData.map((item) => {
      // Extract title text for search
      let titleText = "";
      if (typeof item.title === "object" && item.title !== null) {
        titleText = Object.values(item.title).filter(Boolean).join(" ");
      } else if (typeof item.title === "string") {
        titleText = item.title;
      }

      // Extract description text for search
      let descriptionText = "";
      if (typeof item.description === "object" && item.description !== null) {
        descriptionText = Object.values(item.description).filter(Boolean).join(" ");
      } else if (typeof item.description === "string") {
        descriptionText = item.description;
      }

      return {
      ...item,
        searchableText: [titleText, descriptionText]
          .filter(Boolean)
          .join(" ")
          .toLowerCase(),
      };
    });
  }, [productList]);

  // Event handlers
  const handleEdit = (product) => {
    setEditProduct(product);
    setShowCreate(true);
  };

  const handleFormSubmit = (formData, { setSubmitting, resetForm }) => {
    console.log('Product - handleFormSubmit called with formData:', formData);
    console.log('Product - editProduct:', editProduct);
    
    if (editProduct) {
      console.log('Product - Updating product...');
      updateProduct.mutate(formData, {
        onSuccess: () => {
          toast.success(t('products.productUpdated'));
          setShowCreate(false);
          setEditProduct(null);
          resetForm();
          refetch();
        },
        onError: (error) => {
          toast.error(error?.message || t('common.error'));
        },
        onSettled: () => setSubmitting(false),
      });
    } else {
      console.log('Product - Creating product...');
      createProduct.mutate(formData, {
        onSuccess: () => {
          toast.success(t('products.productAdded'));
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
    if (!deleteProduct || !deleteProduct.id) return;
    
    deleteProductMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success(t('products.productDeleted'));
        setDeleteProduct(null);
        refetch();
      },
      onError: (error) => {
        toast.error(error?.message || t('common.error'));
      },
    });
  };

  const handleFormClose = () => {
    setShowCreate(false);
    setEditProduct(null);
  };

  return (
    <div className="w-full mx-auto py-10 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">{t('products.title')}</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            onClick={() => {
              setShowCreate(true);
              setEditProduct(null);
            }}
            className="bg-[rgb(var(--primary-brand))] text-black font-semibold hover:bg-[rgb(var(--primary-brand-hover))] w-full sm:w-auto"
          >
            {t('products.addProduct')}
          </Button>
        </div>
      </div>

      {/* Product Form Modal */}
      <ProductForm
        isOpen={showCreate}
        onClose={handleFormClose}
        editProduct={editProduct}
        onSubmit={handleFormSubmit}
        isSubmitting={createProduct.isPending || updateProduct.isPending}
        categoryList={categories}
      />

      {/* Delete Confirmation Modal */}
      <ProductDeleteModal
        product={deleteProduct}
        isOpen={!!deleteProduct}
        onClose={() => setDeleteProduct(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteProductMutation.isPending}
      />

      {/* View Product Modal */}
      <ProductViewModal
        product={viewProduct}
        isOpen={!!viewProduct}
        onClose={() => setViewProduct(null)}
      />

      {/* Product Table */}
      <ProductTable
        data={tableData}
        onView={setViewProduct}
        onEdit={handleEdit}
        onDelete={setDeleteProduct}
        onSearch={setSearchValue}
        searchValue={searchValue}
        onFiltersChange={setFilters}
        filters={filters}
        categories={categories}
      />

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          classNames: {
            success: "!bg-green-500 !text-white",
            error: "!bg-red-500 !text-white",
          },
        }}
      />
    </div>
  );
} 