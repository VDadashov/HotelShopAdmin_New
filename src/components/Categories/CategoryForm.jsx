import React, { useState } from "react";
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
import { Upload, X, Image as ImageIcon } from "lucide-react";

const CategoryForm = ({
  isOpen,
  onClose,
  editCategory,
  onSubmit,
  isSubmitting,
  categories = [], // For parent category selection
}) => {
  const { t } = useTranslation();
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(
    editCategory?.imageUrl || ""
  );

  const initialValues = editCategory
    ? {
        name: editCategory.name || { az: "", en: "", ru: "" },
        imageUrl: editCategory.imageUrl || "",
        isActive: editCategory.isActive ?? true,
        isProductHolder: editCategory.isProductHolder ?? false,
        parentId: editCategory.parentId || null,
      }
    : {
        name: { az: "", en: "", ru: "" },
        imageUrl: "",
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
    imageUrl: Yup.string().url(t("categories.validation.imageUrlInvalid")),
    isActive: Yup.boolean(),
    isProductHolder: Yup.boolean(),
    parentId: Yup.number().nullable(),
  });

  // Image upload function
  const handleImageUpload = async (file, setFieldValue) => {
    if (!file) return;

    console.log("Uploading file:", file.name, file.type, file.size);

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert(t("categories.validation.invalidFileType"));
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert(t("categories.validation.fileTooLarge"));
      return;
    }

    setImageUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      console.log("Sending request to API...");

      const response = await fetch(
        "https://api.hotelshop.az/api/upload/image",
        {
          method: "POST",
          body: formData,
          // Headers avtomatik təyin olunacaq FormData üçün
        }
      );

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      // Response text-ini oxu (JSON olmaya bilər)
      const responseText = await response.text();
      console.log("Response text:", responseText);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${responseText}`);
      }

      // JSON parse etməyə çalış
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(`Invalid JSON response: ${responseText}`);
      }

      console.log("Parsed response data:", data);

      // Extract URL from response: data.media.url
      const imageUrl = data.media?.url;

      if (imageUrl) {
        setFieldValue("imageUrl", imageUrl);
        setImagePreview(imageUrl);
        console.log("Image uploaded successfully:", imageUrl);
      } else {
        throw new Error("No URL in response: " + JSON.stringify(data));
      }
    } catch (error) {
      console.error("Image upload error:", error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const cleanValues = {
      name: values.name,
      imageUrl: values.imageUrl,
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

  // Remove image
  const handleRemoveImage = (setFieldValue) => {
    setFieldValue("imageUrl", "");
    setImagePreview("");
  };

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

              {/* Image Upload Section */}
              <div>
                <Label className="mb-2 block">
                  {t("categories.categoryImage")}
                </Label>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mb-4 relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Category preview"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(setFieldValue)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      disabled={imageUploading}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                {/* Upload Input */}
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageUpload(file, setFieldValue);
                      }
                    }}
                    className="hidden"
                    id="imageUpload"
                    disabled={imageUploading}
                  />

                  <label
                    htmlFor="imageUpload"
                    className={`inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      imageUploading
                        ? "opacity-50 cursor-not-allowed"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {imageUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 dark:border-gray-100"></div>
                        {t("categories.uploading")}
                      </>
                    ) : (
                      <>
                        {imagePreview ? (
                          <ImageIcon size={16} />
                        ) : (
                          <Upload size={16} />
                        )}
                        {imagePreview
                          ? t("categories.changeImage")
                          : t("categories.uploadImage")}
                      </>
                    )}
                  </label>

                  <p className="text-xs text-gray-500">
                    {t("categories.imageUploadHint")}
                  </p>
                </div>
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
                        {category.name?.en ||
                          category.title?.en ||
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
                  disabled={isSubmitting || imageUploading}
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  type="submit"
                  className="bg-[rgb(var(--primary-brand))] text-black font-semibold hover:bg-[rgb(var(--primary-brand-hover))]"
                  disabled={isSubmitting || imageUploading}
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
