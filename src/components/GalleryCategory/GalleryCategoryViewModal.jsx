import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

export default function GalleryCategoryViewModal({ 
  viewGalleryCategory, 
  setViewGalleryCategory 
}) {
  const { t } = useTranslation();

  return (
    <Dialog open={!!viewGalleryCategory} onOpenChange={v => { if (!v) setViewGalleryCategory(null); }}>
      <DialogContent className="max-w-lg w-full rounded-2xl shadow-2xl bg-card dark:bg-[#232323] p-8 border-0">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-foreground">
            {t('galleryCategory.categoryDetails')}
          </DialogTitle>
        </DialogHeader>
        {viewGalleryCategory && (
          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              <div>
                <div className="font-semibold text-lg">
                  {viewGalleryCategory.title?.[i18n.language] || ""}
                </div>
                <div className="text-sm text-muted-foreground">
                  ID: {viewGalleryCategory.id}
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 