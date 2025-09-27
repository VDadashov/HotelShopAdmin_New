import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CompanyViewModal = ({ company, isOpen, onClose }) => {
  const { t, i18n } = useTranslation();

  if (!company) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full rounded-2xl shadow-2xl bg-card dark:bg-[#232323] p-8 border-0">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-foreground">
            {t('companies.companyDetails')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            {company.logo ? (
              <img
                src={
                  typeof company.logo === "string"
                    ? company.logo
                    : URL.createObjectURL(company.logo)
                }
                alt="Logo"
                className="w-20 h-20 object-contain rounded-md border"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs border">
                {t('companies.noLogo')}
              </div>
            )}
            <div>
              <div className="font-semibold text-lg">
                {typeof company.title === "object"
                  ? company.title[i18n.language] || company.title.az || ""
                  : company.title || ""}
              </div>
              <div className="text-sm text-muted-foreground">
                ID: {company.id}
              </div>
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-1">{t('common.description')}</div>
            <div className="text-gray-700 text-sm text-foreground">
              {typeof company.description === "object"
                ? company.description[i18n.language] ||
                  company.description.az ||
                  ""
                : company.description || ""}
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-1">{t('common.categories')}</div>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(company.categories) &&
                company.categories.map((cat, i) => (
                  <span
                    key={i}
                    className="bg-muted dark:bg-[#232323] text-foreground rounded-full px-3 py-1 text-xs font-medium"
                  >
                    {typeof cat.title === "object"
                      ? cat.title[i18n.language] || cat.title.az || ""
                      : cat.title || ""}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyViewModal; 