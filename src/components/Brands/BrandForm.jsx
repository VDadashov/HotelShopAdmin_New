import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, X, Image as ImageIcon } from "lucide-react";

const BrandForm = ({ isOpen, onClose, editbrand, onSubmit, isSubmitting }) => {
  const { t } = useTranslation();
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(editbrand?.imageUrl || "");

  const initialValues = editbrand
    ? {
        name: editbrand.name || { az: "", en: "", ru: "" },
        imageUrl: editbrand.imageUrl || "",
        isActive: editbrand.isActive ?? true,
      }
    : {
        name: { az: "", en: "", ru: "" },
        imageUrl: "",
        isActive: true,
      };

  const validationSchema = Yup.object({
    name: Yup.object({
      az: Yup.string().required(t("brands.validation.nameRequired")),
      en: Yup.string().required(t("brands.validation.nameRequired")),
      ru: Yup.string().required(t("brands.validation.nameRequired")),
    }),
    imageUrl: Yup.string().required(t("brands.validation.imageRequired")),
  });

  // Image upload function
  const handleImageUpload = async (file, setFieldValue) => {
    if (!file) return;

    console.log("Uploading file:", file.name, file.type, file.size);

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert(t("brands.validation.invalidFileType") || "Invalid file type");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert(t("brands.validation.fileTooLarge") || "File too large");
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
        }
      );

      console.log("Response status:", response.status);

      const responseText = await response.text();
      console.log("Response text:", responseText);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${responseText}`);
      }

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

  // Remove image
  const handleRemoveImage = (setFieldValue) => {
    setFieldValue("imageUrl", "");
    setImagePreview("");
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const cleanValues = {
      name: values.name,
      imageUrl: values.imageUrl,
      isActive: values.isActive,
    };
    onSubmit(cleanValues, { setSubmitting, resetForm });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full rounded-2xl shadow-2xl bg-card dark:bg-[#232323] p-8 border-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-foreground">
            {editbrand ? t("brands.editBrand") : t("brands.addBrand")}
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
              {/* Brand Names */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {t("brands.brandName")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="name.az" className="mb-2 block">
                      {t("brands.brandName")} (az)
                    </Label>
                    <Field
                      as={Input}
                      name="name.az"
                      id="name.az"
                      placeholder={t("brands.brandNamePlaceholder")}
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
                      {t("brands.brandName")} (en)
                    </Label>
                    <Field
                      as={Input}
                      name="name.en"
                      id="name.en"
                      placeholder={t("brands.brandNamePlaceholder")}
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
                      {t("brands.brandName")} (ru)
                    </Label>
                    <Field
                      as={Input}
                      name="name.ru"
                      id="name.ru"
                      placeholder={t("brands.brandNamePlaceholder")}
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
                <Label className="mb-2 block">{t("brands.brandImage")}</Label>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mb-4 relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Brand preview"
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
                        {t("brands.uploading") || "Uploading..."}
                      </>
                    ) : (
                      <>
                        {imagePreview ? (
                          <ImageIcon size={16} />
                        ) : (
                          <Upload size={16} />
                        )}
                        {imagePreview
                          ? t("brands.changeImage") || "Change Image"
                          : t("brands.uploadImage") || "Upload Image"}
                      </>
                    )}
                  </label>

                  <p className="text-xs text-gray-500">
                    {t("brands.imageUploadHint") || "Max 5MB, JPG, PNG"}
                  </p>
                </div>

                <ErrorMessage
                  name="imageUrl"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Active Status Switch */}
              <div className="flex items-center justify-between">
                <Label htmlFor="isActive" className="text-sm font-medium">
                  {t("brands.isActive")}
                </Label>
                <Switch
                  id="isActive"
                  checked={values.isActive}
                  onCheckedChange={(checked) =>
                    setFieldValue("isActive", checked)
                  }
                />
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
                    ? editbrand
                      ? t("brands.updating")
                      : t("brands.creating")
                    : editbrand
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

export default BrandForm;
