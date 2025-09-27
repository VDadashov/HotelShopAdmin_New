import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { useTranslation } from "react-i18next";
import { useGet } from "@/utils/hooks/useCustomQuery";
import { ENDPOINTS } from "@/utils/constants/Endpoints";

// Import components
import GalleryCategoryForm from "@/components/GalleryCategory/GalleryCategoryForm";
import GalleryCategoryViewModal from "@/components/GalleryCategory/GalleryCategoryViewModal";
import GalleryCategoryDeleteModal from "@/components/GalleryCategory/GalleryCategoryDeleteModal";
import GalleryCategoryTable from "@/components/GalleryCategory/GalleryCategoryTable";

export default function GalleryCategory() {
  const { t } = useTranslation();
  const [showCreate, setShowCreate] = useState(false);
  const [editGalleryCategory, setEditGalleryCategory] = useState(null);
  const [deleteGalleryCategory, setDeleteGalleryCategory] = useState(null);
  const [viewGalleryCategory, setViewGalleryCategory] = useState(null);

  // API hooks
  const { data: galleryCategoryList = [], isLoading, refetch } = useGet("galleryCategory", `${ENDPOINTS.galleryCategory}?allLanguages=true`);

  // Edit üçün açılan modalı idarə et
  const handleEdit = (category) => {
    setEditGalleryCategory(category);
    setShowCreate(true);
  };

  return (
    <div className="w-full mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">{t('galleryCategory.title')}</h1>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => { setShowCreate(true); setEditGalleryCategory(null); }} 
            className="bg-[rgb(var(--primary-brand))] text-black font-semibold hover:bg-[rgb(var(--primary-brand-hover))]"
          >
            {t('galleryCategory.addCategory')}
          </Button>
        </div>
      </div>

      {/* Components */}
      <GalleryCategoryForm
        showCreate={showCreate}
        setShowCreate={setShowCreate}
        editGalleryCategory={editGalleryCategory}
        setEditGalleryCategory={setEditGalleryCategory}
        refetch={refetch}
      />

      <GalleryCategoryViewModal
        viewGalleryCategory={viewGalleryCategory}
        setViewGalleryCategory={setViewGalleryCategory}
      />

      <GalleryCategoryDeleteModal
        deleteGalleryCategory={deleteGalleryCategory}
        setDeleteGalleryCategory={setDeleteGalleryCategory}
        refetch={refetch}
      />

      <GalleryCategoryTable
        galleryCategoryList={galleryCategoryList}
        setViewGalleryCategory={setViewGalleryCategory}
        handleEdit={handleEdit}
        setDeleteGalleryCategory={setDeleteGalleryCategory}
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
