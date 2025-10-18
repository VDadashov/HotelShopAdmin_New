import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CategoryForm = ({
  isOpen,
  onClose,
  editCategory,
  onSubmit,
  isSubmitting,
  categories = [], // For parent category selection
}) => {
  const { t } = useTranslation();

  const initialValues = editCategory
    ? {
        name: editCategory.name || { az: "", en: "", ru: "" },
        index: editCategory.index || 0,
        isActive: editCategory.isActive ?? true,
        isProductHolder: editCategory.isProductHolder ?? false,
        parentId: editCategory.parentId || null,
      }
    : {
        name: { az: "", en: "", ru: "" },
        index: 0,
        isActive: true,
        isProductHolder: false,
        parentId: null,
      };

  const validationSchema = Yup.object({
    name: Yup.object({
      az: Yup.string().required(t("categories.validation.nameAzRequired")),
      en: Yup.string().required(t("categories.validation.nameEnRequired")),
      ru: Yup.string().required(t("categories.validation.nameRuRequired")),
    }),
    index: Yup.number().min(0, t("categories.validation.indexInvalid")),
    isActive: Yup.boolean(),
    isProductHolder: Yup.boolean(),
    parentId: Yup.number().nullable(),
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

  // Filter categories for parent selection (exclude current category if editing)
  const availableParentCategories = categories.filter(
    (cat) => !editCategory || cat.id !== editCategory.id
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full rounded-2xl shadow-2xl bg-card dark:bg-[#232323] p-8 border-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-foreground">
            {editCategory
              ? t("categories.editCategory")
              : t("categories.addCategory")}
          </DialogTitle>
        </DialogHeader>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form className="space-y-6">
              {/* Category Names */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {t("categories.categoryNames")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="name.az" className="mb-2 block">
                      {t("categories.categoryName")} (az)
                    </Label>
                    <Field
                      as={Input}
                      name="name.az"
                      id="name.az"
                      placeholder={t("categories.categoryNamePlaceholder")}
                      className="mb-2"
                      required
                    />
                    <ErrorMessage
                      name="name.az"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="name.en" className="mb-2 block">
                      {t("categories.categoryName")} (en)
                    </Label>
                    <Field
                      as={Input}
                      name="name.en"
                      id="name.en"
                      placeholder={t("categories.categoryNamePlaceholder")}
                      className="mb-2"
                      required
                    />
                    <ErrorMessage
                      name="name.en"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="name.ru" className="mb-2 block">
                      {t("categories.categoryName")} (ru)
                    </Label>
                    <Field
                      as={Input}
                      name="name.ru"
                      id="name.ru"
                      placeholder={t("categories.categoryNamePlaceholder")}
                      className="mb-2"
                      required
                    />
                    <ErrorMessage
                      name="name.ru"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Index Field */}
              <div>
                <Label htmlFor="index" className="mb-2 block">
                  {t("categories.index")}
                </Label>
                <Field
                  as={Input}
                  type="number"
                  name="index"
                  id="index"
                  min="0"
                  placeholder={t("categories.indexPlaceholder")}
                  className="mb-2"
                />
                <ErrorMessage
                  name="index"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Parent Category */}
              <div>
                <Label htmlFor="parentId" className="mb-2 block">
                  {t("categories.parentCategory")}
                </Label>
                <Select
                  value={values.parentId ? values.parentId.toString() : "none"}
                  onValueChange={(value) =>
                    setFieldValue(
                      "parentId",
                      value === "none" ? null : parseInt(value)
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("categories.selectParentCategory")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      {t("categories.noParent")}
                    </SelectItem>
                    {availableParentCategories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name?.az ||
                          category.title?.az ||
                          `Category ${category.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Switches */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="isActive" className="text-sm font-medium">
                    {t("categories.isActive")}
                  </Label>
                  <Switch
                    id="isActive"
                    checked={values.isActive}
                    onCheckedChange={(checked) =>
                      setFieldValue("isActive", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="isProductHolder"
                    className="text-sm font-medium"
                  >
                    {t("categories.isProductHolder")}
                  </Label>
                  <Switch
                    id="isProductHolder"
                    checked={values.isProductHolder}
                    onCheckedChange={(checked) =>
                      setFieldValue("isProductHolder", checked)
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  type="submit"
                  className="bg-[rgb(var(--primary-brand))] text-black font-semibold hover:bg-[rgb(var(--primary-brand-hover))]"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? editCategory
                      ? t("categories.updating")
                      : t("categories.creating")
                    : editCategory
                    ? t("common.save")
                    : t("common.add")}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryForm;
