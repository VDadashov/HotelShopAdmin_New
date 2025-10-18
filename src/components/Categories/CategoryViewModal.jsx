import React from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Tag, FolderTree, Pencil } from "lucide-react";

const CategoryViewModal = ({ category, isOpen, onClose, onEdit }) => {
  const { t, i18n } = useTranslation();

  if (!category) return null;

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full rounded-2xl shadow-2xl bg-card dark:bg-[#232323] p-8 border-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-6 flex items-center justify-between">
          <DialogTitle className="text-2xl font-bold text-foreground">
            {getLanguageName(category.name)}
          </DialogTitle>
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
        </DialogHeader>

        <div className="space-y-6">
          {/* Əsas Məlumatlar */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {t("categories.index")}
              </div>
              <div className="font-semibold text-foreground">
                {category.index ?? 0}
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {t("common.level")}
              </div>
              <div className="flex items-center gap-2">
                <FolderTree size={16} className="text-blue-600" />
                <span className="font-semibold text-foreground">
                  Level {category.level}
                </span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {t("common.status")}
              </div>
              <div className="flex items-center gap-2">
                {category.isActive ? (
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

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">
              {t("categories.categoryName")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Azərbaycanca
                </div>
                <div className="font-medium text-foreground">
                  {category.name?.az || "-"}
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  English
                </div>
                <div className="font-medium text-foreground">
                  {category.name?.en || "-"}
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Русский
                </div>
                <div className="font-medium text-foreground">
                  {category.name?.ru || "-"}
                </div>
              </div>
            </div>
          </div>

          {/* Xüsusiyyətlər */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">
              {t("categories.features")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.isProductHolder && (
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  <Tag size={14} />
                  {t("categories.productHolder")}
                </span>
              )}
              {category.parentId && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  Parent ID: {category.parentId}
                </span>
              )}
              {!category.parentId && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-gray-300 text-gray-800 dark:border-gray-600 dark:text-gray-200">
                  {t("categories.rootCategory")}
                </span>
              )}
            </div>
          </div>

          {/* Üst Kateqoriya (Parent Category) */}
          {category.parent && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">
                {t("categories.parentCategory")}
              </h3>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-semibold text-foreground mb-2">
                      {getLanguageName(category.parent.name)}
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          {t("categories.index")}
                        </div>
                        <div className="font-medium text-foreground">
                          {category.parent.index ?? 0}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          {t("common.level")}
                        </div>
                        <div className="font-medium text-foreground">
                          Level {category.parent.level}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          {t("common.status")}
                        </div>
                        <div className="flex items-center gap-2">
                          {category.parent.isActive ? (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              {t("common.active")}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              {t("common.inactive")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      {category.parent.isProductHolder && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          <Tag size={12} />
                          {t("categories.productHolder")}
                        </span>
                      )}
                    </div>
                    <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                      <div>
                        Yaradıldı:{" "}
                        {new Date(category.parent.createdAt).toLocaleString(
                          i18n.language
                        )}
                      </div>
                      <div>
                        Yeniləndi:{" "}
                        {new Date(category.parent.updatedAt).toLocaleString(
                          i18n.language
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Alt Kateqoriyalar */}
          {category.children && category.children.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">
                {t("categories.subcategories")} ({category.children.length})
              </h3>
              <div className="space-y-2">
                {category.children.map((child) => (
                  <div
                    key={child.id}
                    className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-foreground">
                          {getLanguageName(child.name)}
                        </div>
                        <div className="flex gap-2 mt-2">
                          {child.isActive ? (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              {t("common.active")}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              {t("common.inactive")}
                            </span>
                          )}
                          {child.isProductHolder && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                              {t("categories.productHolder")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Zaman Məlumatları */}
          <div className="border-t pt-6 text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <div>
              Yaradıldı:{" "}
              {new Date(category.createdAt).toLocaleString(i18n.language)}
            </div>
            <div>
              Yeniləndi:{" "}
              {new Date(category.updatedAt).toLocaleString(i18n.language)}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryViewModal;
