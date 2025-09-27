import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { useTranslation } from "react-i18next";
import { useGet } from "@/utils/hooks/useCustomQuery";
import { ENDPOINTS } from "@/utils/constants/Endpoints";

// Import components
import GalleryItemForm from "@/components/Gallery/GalleryItemForm";
import GalleryItemViewModal from "@/components/Gallery/GalleryItemViewModal";
import GalleryItemDeleteModal from "@/components/Gallery/GalleryItemDeleteModal";
import GalleryItemTable from "@/components/Gallery/GalleryItemTable";

export default function GalleryItem() {
  const { t } = useTranslation();
  const [showCreate, setShowCreate] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  // API hooks
  const { data: itemList = [], isLoading, refetch } = useGet("gallery-items", `${ENDPOINTS.galleryItem}?allLanguages=true`);

  // Edit üçün açılan modalı idarə et
  const handleEdit = (item) => {
    setEditItem(item);
    setShowCreate(true);
  };

  return (
    <div className="w-full mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">{t('gallery.title')}</h1>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => { setShowCreate(true); setEditItem(null); }} 
            className="bg-[rgb(var(--primary-brand))] text-black font-semibold hover:bg-[rgb(var(--primary-brand-hover))]"
          >
            {t('gallery.addItem')}
          </Button>
        </div>
      </div>

      {/* Components */}
      <GalleryItemForm
        showCreate={showCreate}
        setShowCreate={setShowCreate}
        editItem={editItem}
        setEditItem={setEditItem}
        refetch={refetch}
      />

      <GalleryItemViewModal
        viewItem={viewItem}
        setViewItem={setViewItem}
      />

      <GalleryItemDeleteModal
        deleteItem={deleteItem}
        setDeleteItem={setDeleteItem}
        refetch={refetch}
      />

      <GalleryItemTable
        itemList={itemList}
        setViewItem={setViewItem}
        handleEdit={handleEdit}
        setDeleteItem={setDeleteItem}
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
