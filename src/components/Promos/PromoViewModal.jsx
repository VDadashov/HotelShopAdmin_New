import React from "react";
import { useTranslation } from "react-i18next";
import BaseViewModal from "@/components/common/modals/BaseViewModal";
import { useGet } from "@/utils/hooks";
import { ENDPOINTS } from "@/utils/constants/Endpoints";

const PromoViewModal = ({ 
  isOpen, 
  onClose, 
  promo 
}) => {
  const { t, i18n } = useTranslation();

  // Get promo details with allLanguages=true
  const detailUrl = promo?.id ? `${ENDPOINTS.promos}/${promo.id}?allLanguages=true` : null;
  const { data: promoDetailResponse } = useGet("promoDetail", detailUrl, i18n.language);
  const displayPromo = promoDetailResponse?.data || promo;

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

  // Early return if promo is null
  if (!promo) return null;

  return (
    <BaseViewModal
      data={displayPromo}
      isOpen={isOpen}
      onClose={onClose}
      titleKey="promos"
      maxWidth="max-w-4xl"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          {getLanguageName(displayPromo.title)}
        </h2>
      </div>

      {/* Promo Titles */}
      <div className="border-t pt-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">
          {t("promos.titleField")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Azərbaycanca
            </div>
            <div className="font-medium text-foreground">
              {displayPromo.title?.az || "-"}
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              English
            </div>
            <div className="font-medium text-foreground">
              {displayPromo.title?.en || "-"}
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Русский
            </div>
            <div className="font-medium text-foreground">
              {displayPromo.title?.ru || "-"}
            </div>
          </div>
        </div>
      </div>

      {/* Promo Subtitles */}
      {displayPromo.subtitle && (
        <div className="border-t pt-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {t("promos.subtitle")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                Azərbaycanca
              </div>
              <div className="font-medium text-foreground">
                {displayPromo.subtitle?.az || "-"}
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                English
              </div>
              <div className="font-medium text-foreground">
                {displayPromo.subtitle?.en || "-"}
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                Русский
              </div>
              <div className="font-medium text-foreground">
                {displayPromo.subtitle?.ru || "-"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Promo Descriptions */}
      {displayPromo.description && (
        <div className="border-t pt-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {t("promos.description")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                Azərbaycanca
              </div>
              <div className="font-medium text-foreground whitespace-pre-wrap">
                {displayPromo.description?.az || "-"}
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                English
              </div>
              <div className="font-medium text-foreground whitespace-pre-wrap">
                {displayPromo.description?.en || "-"}
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                Русский
              </div>
              <div className="font-medium text-foreground whitespace-pre-wrap">
                {displayPromo.description?.ru || "-"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Promo Dates */}
      <div className="border-t pt-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">
          {t("common.dates")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              {t("promos.startDate")}
            </div>
            <div className="font-medium text-foreground">
              {displayPromo.startDate ? new Date(displayPromo.startDate).toLocaleString() : "-"}
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              {t("promos.endDate")}
            </div>
            <div className="font-medium text-foreground">
              {displayPromo.endDate ? new Date(displayPromo.endDate).toLocaleString() : "-"}
            </div>
          </div>
        </div>
      </div>

      {/* Product Information */}
      <div className="border-t pt-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">
          {t("promos.productId")}
        </h3>
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="font-medium text-foreground">
            Product #{displayPromo.productId}
          </div>
        </div>
      </div>

      {/* Background Image */}
      {displayPromo.backgroundImg && (
        <div className="border-t pt-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {t("promos.backgroundImg")}
          </h3>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="flex justify-center">
              <img
                src={displayPromo.backgroundImg}
                alt={getLanguageName(displayPromo.title)}
                className="max-w-full max-h-96 object-contain rounded-lg border"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div
                className="w-64 h-64 bg-gray-200 dark:bg-gray-700 rounded-lg border flex items-center justify-center text-gray-500"
                style={{ display: 'none' }}
              >
                {t("promos.noImage")}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status */}
      <div className="border-t pt-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">
          {t("common.status")}
        </h3>
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            displayPromo.isActive 
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}>
            {displayPromo.isActive ? t("common.active") : t("common.inactive")}
          </div>
        </div>
      </div>

      {/* Created/Updated dates */}
      {(displayPromo.createdAt || displayPromo.updatedAt) && (
        <div className="border-t pt-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {t("common.dates")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayPromo.createdAt && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  {t("common.createdAt")}
                </div>
                <div className="font-medium text-foreground">
                  {new Date(displayPromo.createdAt).toLocaleDateString()}
                </div>
              </div>
            )}
            {displayPromo.updatedAt && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  {t("common.updatedAt")}
                </div>
                <div className="font-medium text-foreground">
                  {new Date(displayPromo.updatedAt).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </BaseViewModal>
  );
};

export default PromoViewModal;
