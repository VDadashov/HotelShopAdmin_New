import React from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import BaseForm from "@/components/common/forms/BaseForm";
import MultilingualField from "@/components/common/forms/MultilingualField";
import BasicField from "@/components/common/forms/BasicField";
import SwitchField from "@/components/common/forms/SwitchField";
import SelectField from "@/components/common/forms/SelectField";
import { commonValidations } from "@/utils/validationSchemas";
import { useGet } from "@/utils/hooks/useCustomQuery";
import { ENDPOINTS } from "@/utils/constants/Endpoints";

const CategoryForm = ({
  isOpen,
  onClose,
  editCategory,
  onSubmit,
  isSubmitting,
  categories = [], // For parent category selection
}) => {
  const { t, i18n } = useTranslation();

  const detailUrl = editCategory ? `${ENDPOINTS.categories}/${editCategory.id}?allLanguages=true` : null;
  const { data: editCategoryResponse, isLoading: isLoadingEdit } = useGet("editCategoryDetail", detailUrl, i18n.language);

  const editCategoryDetail = editCategoryResponse?.data;

  const displayEditCategory = editCategoryDetail || editCategory;

  const initialValues = displayEditCategory
    ? {
        name: displayEditCategory?.name || { az: "", en: "", ru: "" },
        index: displayEditCategory?.index || 0,
        isActive: displayEditCategory?.isActive ?? true,
        isProductHolder: displayEditCategory?.isProductHolder ?? false,
        parentId: displayEditCategory?.parentId || null,
      }
    : {
        name: { az: "", en: "", ru: "" },
        index: 0,
        isActive: true,
        isProductHolder: false,
        parentId: null,
      };

  const validationSchema = Yup.object({
    name: commonValidations.multilingualName("categories"),
    index: commonValidations.index("categories"),
    isActive: commonValidations.isActive,
    isProductHolder: Yup.boolean(),
    parentId: commonValidations.parentId,
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const cleanValues = {
      name: values.name,
      index: values.index,
      isActive: values.isActive,
      isProductHolder: values.isProductHolder,
      parentId: values.parentId,
    };
    onSubmit(cleanValues, { setSubmitting, resetForm });
  };

  const availableParentCategories = categories.filter(
    (cat) => !displayEditCategory || cat.id !== displayEditCategory?.id
  );

  return (
    <BaseForm
      isOpen={isOpen}
      onClose={onClose}
      editData={editCategory}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      titleKey="categories"
      initialValues={initialValues}
      validationSchema={validationSchema}
    >
      {({ values, setFieldValue }) => (
        <>
          <MultilingualField
            name="name"
            label={t("categories.categoryName")}
            placeholder={t("categories.categoryNamePlaceholder")}
          />

          <BasicField
            name="index"
            label={t("categories.index")}
            type="number"
            placeholder={t("categories.indexPlaceholder")}
            min="0"
          />

          <SelectField
            name="parentId"
            label={t("categories.parentCategory")}
            placeholder={t("categories.selectParentCategory")}
            options={availableParentCategories}
            valueKey="id"
            labelKey="name"
            setFieldValue={setFieldValue}
            values={values}
            emptyOption={t("categories.noParent")}
          />

          <div className="space-y-4">
            <SwitchField
              name="isActive"
              label={t("categories.isActive")}
              setFieldValue={setFieldValue}
              values={values}
            />

            <SwitchField
              name="isProductHolder"
              label={t("categories.isProductHolder")}
              setFieldValue={setFieldValue}
              values={values}
            />
          </div>
        </>
      )}
    </BaseForm>
  );
};

export default CategoryForm;
