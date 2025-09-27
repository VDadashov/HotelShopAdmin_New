import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useDelete } from "@/utils/hooks/useCustomMutation";
import { ENDPOINTS } from "@/utils/constants/Endpoints";
import { toast } from "sonner";

export default function GalleryItemDeleteModal({ 
  deleteItem, 
  setDeleteItem,
  refetch 
}) {
  const { t } = useTranslation();
  const deleteItemMutation = useDelete("gallery-items", ENDPOINTS.galleryItem, deleteItem?.id);

  return (
    <Dialog open={!!deleteItem} onOpenChange={v => { if (!v) setDeleteItem(null); }}>
      <DialogContent className="max-w-sm w-full rounded-2xl shadow-2xl bg-card dark:bg-[#232323] p-8 border-0">
        <DialogHeader>
          <DialogTitle>{t('gallery.deleteItem')}</DialogTitle>
        </DialogHeader>
        <div>{t('gallery.deleteConfirmation')}</div>
        <DialogFooter className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setDeleteItem(null)}>
            {t('common.cancel')}
          </Button>
          <Button 
            className="bg-red-600 text-white hover:bg-red-700" 
            onClick={() => {
              if (!deleteItem || !deleteItem.id) return;
              deleteItemMutation.mutate(undefined, {
                onSuccess: () => {
                  toast.success(t('gallery.itemDeleted'));
                  setDeleteItem(null);
                  refetch();
                },
                onError: (error) => {
                  toast.error(error?.message || t('errors.generalError'));
                },
              });
            }}
          >
            {t('common.delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 