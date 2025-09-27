import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CategoryViewModal = ({ category, isOpen, onClose }) => {
  const { t, i18n } = useTranslation();

  if (!category) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full rounded-2xl shadow-2xl bg-card dark:bg-[#232323] p-8 border-0">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-foreground">
            {t('categories.categoryDetails')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            <div>
              <div className="font-semibold text-lg">
                {typeof category.title === "object"
                  ? category.title[i18n.language] || category.title.az || ""
                  : category.title || ""}
              </div>
              <div className="text-sm text-muted-foreground">
                ID: {category.id}
              </div>
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-1">{t('categories.categoryName')}</div>
            <div className="text-gray-700 text-sm text-foreground">
              <div className="mb-2">
                <strong>Azərbaycanca:</strong> {category.title?.az || ""}
              </div>
              <div className="mb-2">
                <strong>English:</strong> {category.title?.en || ""}
              </div>
              <div>
                <strong>Русский:</strong> {category.title?.ru || ""}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryViewModal; 