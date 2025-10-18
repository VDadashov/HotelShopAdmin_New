import * as React from "react";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useGet } from "@/utils/hooks/useCustomQuery";
import { usePost, useUpdate, useDelete } from "@/utils/hooks/useCustomMutation";
import { ENDPOINTS } from "@/utils/constants/Endpoints";

// Import components from new location
import BrandForm from "@/components/Brands/BrandForm";
import BrandViewModal from "@/components/Brands/BrandViewModal";
import BrandDeleteModal from "@/components/Brands/BrandDeleteModal";
import BrandTable from "@/components/Brands/BrandTable";

export default function Brand() {
  const { t } = useTranslation();

  // State management
  const [showCreate, setShowCreate] = useState(false);
  const [editbrand, setEditbrand] = useState(null);
  const [viewbrand, setViewbrand] = useState(null);
  const [deletebrand, setDeletebrand] = useState(null);

  // API hooks
  const { data: brandList = [], refetch } = useGet(
    "brand",
    `${ENDPOINTS.brand}?allLanguages=true`
  );

  const createbrand = usePost("brand", ENDPOINTS.brand);
  const updatebrand = useUpdate("brand", ENDPOINTS.brand, editbrand?.id);
  const deletebrandMutation = useDelete(
    "brand",
    ENDPOINTS.brand,
    deletebrand?.id
  );

  const { data: categoryList = [] } = useGet(
    "categories",
    ENDPOINTS.categories
  );

  // Process table data
  const tableData = useMemo(() => {
    let rawData = [];

    if (Array.isArray(brandList)) {
      rawData = brandList;
    } else if (
      brandList &&
      typeof brandList === "object" &&
      Array.isArray(brandList.data)
    ) {
      rawData = brandList.data;
    } else if (
      brandList &&
      typeof brandList === "object" &&
      Array.isArray(brandList.items)
    ) {
      rawData = brandList.items;
    }

    return rawData.map((item) => {
      let titleText = "";
      if (typeof item.title === "object" && item.title !== null) {
        titleText = Object.values(item.title).filter(Boolean).join(" ");
      } else if (typeof item.title === "string") {
        titleText = item.title;
      }

      // Extract description text for search
      let descriptionText = "";
      if (typeof item.description === "object" && item.description !== null) {
        descriptionText = Object.values(item.description)
          .filter(Boolean)
          .join(" ");
      } else if (typeof item.description === "string") {
        descriptionText = item.description;
      }

      // Extract categories text for search
      let categoriesText = "";
      if (Array.isArray(item.categories)) {
        categoriesText = item.categories
          .map((cat) => {
            if (typeof cat.title === "object" && cat.title !== null) {
              return Object.values(cat.title).filter(Boolean).join(" ");
            } else if (typeof cat.title === "string") {
              return cat.title;
            }
            return "";
          })
          .filter(Boolean)
          .join(" ");
      }

      return {
        ...item,
        searchableText: [titleText, descriptionText, categoriesText]
          .filter(Boolean)
          .join(" ")
          .toLowerCase(),
      };
    });
  }, [brandList]);

  // Event handlers
  const handleEdit = (brand) => {
    setEditbrand(brand);
    setShowCreate(true);
  };

  const handleFormSubmit = (formData, { setSubmitting, resetForm }) => {
    if (editbrand) {
      updatebrand.mutate(formData, {
        onSuccess: () => {
          toast.success(t("brands.brandUpdated"));
          setShowCreate(false);
          setEditbrand(null);
          resetForm();
          refetch();
        },
        onError: (error) => {
          toast.error(error?.message || t("errors.generalError"));
        },
        onSettled: () => setSubmitting(false),
      });
    } else {
      createbrand.mutate(formData, {
        onSuccess: () => {
          toast.success(t("brands.brandAdded"));
          setShowCreate(false);
          resetForm();
          refetch();
        },
        onError: (error) => {
          toast.error(error?.message || t("errors.generalError"));
        },
        onSettled: () => setSubmitting(false),
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (!deletebrand || !deletebrand.id) return;

    deletebrandMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success(t("brands.brandDeleted"));
        setDeletebrand(null);
        refetch();
      },
      onError: (error) => {
        toast.error(error?.message || t("errors.generalError"));
      },
    });
  };

  const handleFormClose = () => {
    setShowCreate(false);
    setEditbrand(null);
  };

  return (
    <div className="w-full mx-auto py-10 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">{t("brands.title")}</h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setShowCreate(true);
              setEditbrand(null);
            }}
            className="bg-[rgb(var(--primary-brand))] text-black font-semibold hover:bg-[rgb(var(--primary-brand-hover))]"
          >
            {t("brands.addBrand")}
          </Button>
        </div>
      </div>

      {/* brand Form Modal */}
      <BrandForm
        isOpen={showCreate}
        onClose={handleFormClose}
        editbrand={editbrand}
        onSubmit={handleFormSubmit}
        isSubmitting={createbrand.isPending || updatebrand.isPending}
        categoryList={categoryList}
      />

      {/* Delete Confirmation Modal */}
      <BrandDeleteModal
        brand={deletebrand}
        isOpen={!!deletebrand}
        onClose={() => setDeletebrand(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={deletebrandMutation.isPending}
      />

      {/* View brand Modal */}
      <BrandViewModal
        brand={viewbrand}
        isOpen={!!viewbrand}
        onClose={() => setViewbrand(null)}
      />

      {/* brand Table */}
      <BrandTable
        data={tableData}
        onView={setViewbrand}
        onEdit={handleEdit}
        onDelete={setDeletebrand}
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
