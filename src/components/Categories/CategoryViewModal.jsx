import React from "react";
import { useTranslation } from "react-i18next";
import BaseViewModal from "@/components/common/modals/BaseViewModal";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Tag, FolderTree, Pencil, Users, ArrowUp } from "lucide-react";
import { useGet } from "@/utils/hooks/useCustomQuery";
import { ENDPOINTS } from "@/utils/constants/Endpoints";

const CategoryViewModal = ({ category, isOpen, onClose, onEdit }) => {
  const { t, i18n } = useTranslation();

  // Detail üçün ayrıca API çağırışı (allLanguages=true ilə)
  const detailUrl = category ? `${ENDPOINTS.categories}/${category.id}?allLanguages=true` : null;
  const { data: categoryDetailResponse, isLoading: isLoadingDetail } = useGet("categoryDetail", detailUrl, i18n.language);

  // API response-dan data-nı çıxar
  const categoryDetail = categoryDetailResponse?.data;

  // Display üçün detail data istifadə et, əgər yoxdursa category istifadə et
  const displayCategory = categoryDetail || category;

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

  // Early return if category is null
  if (!category) return null;

  // Debug subcategory names
  console.log('CategoryViewModal - category:', category);
  console.log('CategoryViewModal - detailUrl:', detailUrl);
  console.log('CategoryViewModal - categoryDetailResponse:', categoryDetailResponse);
  console.log('CategoryViewModal - categoryDetail:', categoryDetail);
  console.log('CategoryViewModal - displayCategory:', displayCategory);
  console.log('CategoryViewModal - children:', displayCategory?.children);
  if (displayCategory?.children && displayCategory.children.length > 0) {
    console.log('CategoryViewModal - first child:', displayCategory.children[0]);
    console.log('CategoryViewModal - first child name:', displayCategory.children[0].name);
  }

  return (
    <BaseViewModal
      data={displayCategory}
      isOpen={isOpen}
      onClose={onClose}
      titleKey="categories"
      maxWidth="max-w-4xl"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          {getLanguageName(displayCategory.name)}
        </h2>
        {onEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(category)}
            className="gap-2"
          >
            <Pencil size={16} />
            {t("common.edit")}
          </Button>
        )}
      </div>

      {/* Əsas Məlumatlar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {t("categories.index")}
          </div>
          <div className="font-semibold text-foreground">
            {displayCategory.index ?? 0}
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {t("common.level")}
          </div>
          <div className="flex items-center gap-2">
            <FolderTree size={16} className="text-blue-600" />
            <span className="font-semibold text-foreground">
              Level {displayCategory.level}
            </span>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {t("common.status")}
          </div>
          <div className="flex items-center gap-2">
            {displayCategory.isActive ? (
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

        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {t("categories.productHolder")}
          </div>
          <div className="flex items-center gap-2">
            {displayCategory.isProductHolder ? (
              <>
                <Tag size={16} className="text-purple-600" />
                <span className="font-semibold text-purple-600">
                  {t("common.yes")}
                </span>
              </>
            ) : (
              <span className="font-semibold text-gray-500">
                {t("common.no")}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Parent Category */}
      {displayCategory.parent && (
        <div className="border-t pt-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ArrowUp size={20} className="text-blue-600" />
            {t("categories.parentCategory")}
          </h3>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Azərbaycanca
                </div>
                <div className="font-medium text-foreground">
                  {displayCategory.parent.name?.az || "-"}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  English
                </div>
                <div className="font-medium text-foreground">
                  {displayCategory.parent.name?.en || "-"}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Русский
                </div>
                <div className="font-medium text-foreground">
                  {displayCategory.parent.name?.ru || "-"}
                </div>
              </div>
            </div>
            
            {/* Parent Status və Product Holder */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t("common.status")}:
                </span>
                {displayCategory.parent.isActive ? (
                  <>
                    <CheckCircle size={14} className="text-green-600" />
                    <span className="text-sm font-medium text-green-600">
                      {t("common.active")}
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle size={14} className="text-red-600" />
                    <span className="text-sm font-medium text-red-600">
                      {t("common.inactive")}
                    </span>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t("categories.productHolder")}:
                </span>
                {displayCategory.parent.isProductHolder ? (
                  <>
                    <Tag size={14} className="text-purple-600" />
                    <span className="text-sm font-medium text-purple-600">
                      {t("common.yes")}
                    </span>
                  </>
                ) : (
                  <span className="text-sm font-medium text-gray-500">
                    {t("common.no")}
                  </span>
                )}
              </div>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Level: {displayCategory.parent.level} | Index: {displayCategory.parent.index}
            </div>
          </div>
        </div>
      )}

      {/* Children Categories */}
      {displayCategory.children && displayCategory.children.length > 0 && (
        <div className="border-t pt-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users size={20} className="text-green-600" />
            {t("categories.subcategories")} ({displayCategory.children.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayCategory.children.map((child) => (
              <div key={child.id} className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Azərbaycanca
                    </div>
                    <div className="font-medium text-foreground">
                      {child.name?.az || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      English
                    </div>
                    <div className="font-medium text-foreground">
                      {child.name?.en || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Русский
                    </div>
                    <div className="font-medium text-foreground">
                      {child.name?.ru || "-"}
                    </div>
                  </div>
                </div>
                
                {/* Child Status və Product Holder */}
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t("common.status")}:
                    </span>
                    {child.isActive ? (
                      <>
                        <CheckCircle size={14} className="text-green-600" />
                        <span className="text-sm font-medium text-green-600">
                          {t("common.active")}
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle size={14} className="text-red-600" />
                        <span className="text-sm font-medium text-red-600">
                          {t("common.inactive")}
                        </span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t("categories.productHolder")}:
                    </span>
                    {child.isProductHolder ? (
                      <>
                        <Tag size={14} className="text-purple-600" />
                        <span className="text-sm font-medium text-purple-600">
                          {t("common.yes")}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm font-medium text-gray-500">
                        {t("common.no")}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Level: {child.level} | Index: {child.index}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Names */}
      <div className="border-t pt-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">
          {t("categories.categoryName")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Azərbaycanca
            </div>
            <div className="font-medium text-foreground">
              {displayCategory.name?.az || "-"}
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              English
            </div>
            <div className="font-medium text-foreground">
              {displayCategory.name?.en || "-"}
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Русский
            </div>
            <div className="font-medium text-foreground">
              {displayCategory.name?.ru || "-"}
            </div>
          </div>
        </div>
      </div>

      {/* Zaman Məlumatları */}
      <div className="border-t pt-6 text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <div>
          Yaradıldı:{" "}
          {new Date(displayCategory.createdAt).toLocaleString(i18n.language)}
        </div>
        <div>
          Yeniləndi:{" "}
          {new Date(displayCategory.updatedAt).toLocaleString(i18n.language)}
        </div>
      </div>
    </BaseViewModal>
  );
};

export default CategoryViewModal;