import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGet } from "@/utils/hooks/useCustomQuery";
import { ENDPOINTS } from "@/utils/constants/Endpoints";
import BaseViewModal from "@/components/common/modals/BaseViewModal";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Image as ImageIcon } from "lucide-react";

const BrandViewModal = ({ 
  brand, 
  isOpen, 
  onClose 
}) => {
  const { t, i18n } = useTranslation();

  // Get brand details with allLanguages=true
  const detailUrl = brand?.id ? `${ENDPOINTS.brand}/${brand.id}?allLanguages=true` : null;
  const { data: brandDetailResponse } = useGet("brandDetail", detailUrl, i18n.language);
  const displayBrand = brandDetailResponse?.data || brand;

  const getLanguageName = (multilingual, lang = i18n.language) => {
    if (!multilingual) return "";
    return (
      multilingual[lang] ||
      multilingual.az ||
      multilingual.en ||
      multilingual.ru ||
      ""
    );
  };

  if (!displayBrand) return null;

  return (
    <BaseViewModal
      data={displayBrand}
      isOpen={isOpen}
      onClose={onClose}
      titleKey="brands"
      maxWidth="max-w-4xl"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          {getLanguageName(displayBrand.name)}
        </h2>
      </div>

      {/* Brand Names */}
      <div className="border-t pt-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">
          {t("brands.brandName")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Azərbaycanca
            </div>
            <div className="font-medium text-foreground">
              {displayBrand.name?.az || "-"}
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              English
            </div>
            <div className="font-medium text-foreground">
              {displayBrand.name?.en || "-"}
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Русский
            </div>
            <div className="font-medium text-foreground">
              {displayBrand.name?.ru || "-"}
            </div>
          </div>
        </div>
      </div>

      {/* Brand Image */}
      {displayBrand.imageUrl && (
        <div className="border-t pt-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {t("brands.brandImage")}
          </h3>
          <div className="relative w-full max-w-xs">
            <img
              src={displayBrand.imageUrl}
              alt={getLanguageName(displayBrand.name)}
              className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-lg border"
            />
          </div>
        </div>
      )}

      {/* Status */}
      <div className="border-t pt-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">
          {t("common.status")}
        </h3>
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="flex items-center gap-2">
            {displayBrand.isActive ? (
              <>
                <CheckCircle size={16} className="text-green-600" />
                <span className="font-semibold text-green-600">
                  {t("common.active")}
                </span>
              </>
            ) : (
              <>
                <XCircle size={16} className="text-red-600" />
                <span className="font-semibold text-red-600">
                  {t("common.inactive")}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Timestamps */}
      <div className="border-t pt-6 text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <div>
          Yaradıldı:{" "}
          {new Date(displayBrand.createdAt).toLocaleString(i18n.language)}
        </div>
        <div>
          Yeniləndi:{" "}
          {new Date(displayBrand.updatedAt).toLocaleString(i18n.language)}
        </div>
      </div>
    </BaseViewModal>
  );
};

export default BrandViewModal;