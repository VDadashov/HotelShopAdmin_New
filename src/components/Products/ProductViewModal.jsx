import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGet } from "@/utils/hooks/useCustomQuery";
import { ENDPOINTS } from "@/utils/constants/Endpoints";
import BaseViewModal from "@/components/common/modals/BaseViewModal";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const ProductViewModal = ({ 
  product, 
  isOpen, 
  onClose 
}) => {
  const { t, i18n } = useTranslation();

  // Get product details with allLanguages=true
  const detailUrl = product?.id ? `${ENDPOINTS.products}/${product.id}?allLanguages=true` : null;
  const { data: productDetailResponse } = useGet("productDetail", detailUrl, i18n.language);
  const displayProduct = productDetailResponse?.data || product;

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

  // Early return if product is null
  if (!displayProduct) return null;

  return (
    <BaseViewModal
      data={displayProduct}
      isOpen={isOpen}
      onClose={onClose}
      titleKey="products"
      maxWidth="max-w-4xl"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          {getLanguageName(displayProduct.name)}
        </h2>
      </div>

      {/* Product Names */}
      <div className="border-t pt-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">
          {t("products.productName")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Azərbaycanca
            </div>
                   <div className="font-medium text-foreground">
                     {displayProduct.name?.az || "-"}
                   </div>
                 </div>
                 <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                   <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                     English
                   </div>
                   <div className="font-medium text-foreground">
                     {displayProduct.name?.en || "-"}
                   </div>
                 </div>
                 <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                   <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                     Русский
                   </div>
                   <div className="font-medium text-foreground">
                     {displayProduct.name?.ru || "-"}
                   </div>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="border-t pt-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">
          {t("products.productDescription")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Azərbaycanca
            </div>
                   <div className="font-medium text-foreground">
                     {displayProduct.description?.az || "-"}
                   </div>
                 </div>
                 <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                   <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                     English
                   </div>
                   <div className="font-medium text-foreground">
                     {displayProduct.description?.en || "-"}
                   </div>
                 </div>
                 <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                   <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                     Русский
                   </div>
                   <div className="font-medium text-foreground">
                     {displayProduct.description?.ru || "-"}
                   </div>
          </div>
        </div>
      </div>

      {/* Main Image */}
      {displayProduct.mainImg && (
        <div className="border-t pt-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {t("products.mainImage")}
          </h3>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="flex justify-center">
              <img
                src={displayProduct.mainImg}
                alt={getLanguageName(displayProduct.name)}
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
                {t("brands.noImage")}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category */}
      <div className="border-t pt-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">
          {t("common.category")}
        </h3>
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
            {t("common.category")}
          </div>
                 <div className="font-medium text-foreground">
                   {getLanguageName(displayProduct.category?.name) || "-"}
                 </div>
        </div>
      </div>

      {/* PDF Download */}
      {displayProduct.pdf && (
        <div className="border-t pt-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {t("products.detailPdf")}
          </h3>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <Button
              variant="outline"
              onClick={() => window.open(displayProduct.pdf, '_blank')}
              className="gap-2"
            >
              <Download size={16} />
              {t("products.downloadPdf")}
            </Button>
          </div>
        </div>
      )}

      {/* Timestamps */}
      <div className="border-t pt-6 text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <div>
          Yaradıldı:{" "}
          {new Date(displayProduct.createdAt).toLocaleString(i18n.language)}
        </div>
        <div>
          Yeniləndi:{" "}
          {new Date(displayProduct.updatedAt).toLocaleString(i18n.language)}
        </div>
      </div>
    </BaseViewModal>
  );
};

export default ProductViewModal;