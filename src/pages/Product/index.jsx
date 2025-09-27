import * as React from "react";
import { useState, useMemo } from "react";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useGet } from "@/utils/hooks/useCustomQuery";
import { usePost, useUpdate, useDelete, usePatch } from "@/utils/hooks/useCustomMutation";
import { ENDPOINTS } from "@/utils/constants/Endpoints";

// Import components
import ProductForm from "@/components/Products/ProductForm";
import ProductViewModal from "@/components/Products/ProductViewModal";
import ProductDeleteModal from "@/components/Products/ProductDeleteModal";
import ProductTable from "@/components/Products/ProductTable";

export default function Product() {
  const { t } = useTranslation();
  
  // State management
  const [showCreate, setShowCreate] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);

  // API hooks
  const { data: productList = [], isLoading, refetch } = useGet("products", `${ENDPOINTS.products}?allLanguages=true`);
  const { data: categoryList = [] } = useGet(
    "categories",
    `${ENDPOINTS.getCategories}?allLanguages=true`
  );
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
              if (editProduct) {
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
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">{t('products.title')}</h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setShowCreate(true);
              setEditProduct(null);
            }}
            className="bg-[rgb(var(--primary-brand))] text-black font-semibold hover:bg-[rgb(var(--primary-brand-hover))]"
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
        categoryList={categoryList}
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