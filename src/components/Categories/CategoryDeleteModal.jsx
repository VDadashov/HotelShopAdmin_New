import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const CategoryDeleteModal = ({ category, isOpen, onClose, onConfirm, isDeleting }) => {
  const { t } = useTranslation();

  if (!category) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm w-full rounded-2xl shadow-2xl bg-card dark:bg-[#232323] p-8 border-0">
        <DialogHeader>
          <DialogTitle>{t('categories.deleteCategory')}</DialogTitle>
        </DialogHeader>
        
        <div>{t('categories.deleteConfirmation')}</div>
        
        <DialogFooter className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            {t('common.cancel')}
          </Button>
          <Button
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? t('common.deleting') : t('common.delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDeleteModal; 