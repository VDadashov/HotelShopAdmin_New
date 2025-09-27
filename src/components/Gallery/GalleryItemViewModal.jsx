import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

export default function GalleryItemViewModal({ 
  viewItem, 
  setViewItem 
}) {
  const { t } = useTranslation();

  return (
    <Dialog open={!!viewItem} onOpenChange={v => { if (!v) setViewItem(null); }}>
      <DialogContent className="max-w-lg w-full rounded-2xl shadow-2xl bg-card dark:bg-[#232323] p-8 border-0">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-foreground">
            {t('gallery.itemDetails')}
          </DialogTitle>
        </DialogHeader>
        {viewItem && (
          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              {viewItem.mainImage && (
                <img src={viewItem.mainImage} alt="main" className="w-20 h-20 object-contain rounded-md border" />
              )}
              <div>
                <div className="font-semibold text-lg">
                  {viewItem.title?.[i18n.language] || ""}
                </div>
                <div className="text-sm text-muted-foreground">
                  ID: {viewItem.id}
                </div>
              </div>
            </div>
            <div>
              <div className="font-semibold mb-1">{t('gallery.itemDescription')}</div>
              <div className="text-gray-700 text-sm text-foreground">
                {viewItem.description?.[i18n.language] || ""}
              </div>
            </div>
            <div>
              <div className="font-semibold mb-1">{t('gallery.imageList')}</div>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(viewItem.imageList) && viewItem.imageList.map((img, i) => (
                  <img key={i} src={img} alt="img" className="w-16 h-16 object-contain rounded border" />
                ))}
              </div>
            </div>
            <div>
              <div className="font-semibold mb-1">{t('galleryCategory.title')}</div>
              <div>
                {viewItem.galleryCategory?.title?.[i18n.language] || viewItem.galleryCategory?.title || viewItem.galleryCategoryId}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 