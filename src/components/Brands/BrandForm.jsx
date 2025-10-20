import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { useGet } from "@/utils/hooks/useCustomQuery";
import { ENDPOINTS } from "@/utils/constants/Endpoints";
import BaseForm from "@/components/common/forms/BaseForm";
import MultilingualField from "@/components/common/forms/MultilingualField";
import SwitchField from "@/components/common/forms/SwitchField";
import { commonValidations } from "@/utils/validationSchemas";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import axiosInstance from "@/utils/api/axiosInstance";
import { toast } from "sonner";

const BrandForm = ({
  isOpen,
  onClose,
  editBrand,
  onSubmit,
  isSubmitting,
}) => {
  const { t, i18n } = useTranslation();

  // Get brand details for editing with allLanguages=true
  const detailUrl = editBrand?.id ? `${ENDPOINTS.brand}/${editBrand.id}?allLanguages=true` : null;
  const { data: editBrandResponse } = useGet("editBrand", detailUrl, i18n.language);
  const displayEditBrand = editBrandResponse?.data || editBrand;

  const [imageUploading, setImageUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  useEffect(() => {
    if (displayEditBrand) {
      setUploadedImageUrl(displayEditBrand.imageUrl || "");
    } else {
      setUploadedImageUrl("");
    }
  }, [displayEditBrand]);

  // Image upload function
  const handleImageUpload = async (file, setFieldValue) => {
    if (!file) return;

    setImageUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axiosInstance.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data?.media?.url) {
        const imageUrl = response.data.media.url;

        // Validate image URL
        const img = new Image();
        img.onload = () => {
          setUploadedImageUrl(imageUrl);
          setFieldValue('imageUrl', imageUrl);
          toast.success(t('common.imageUploaded'));
        };
        img.onerror = () => {
          console.error('Image validation failed:', imageUrl);
          toast.error(t('common.imageValidationError'));
        };
        img.src = imageUrl;
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error(error?.message || t('common.imageUploadError'));
    } finally {
      setImageUploading(false);
    }
  };

  // Remove uploaded image
  const removeImage = (setFieldValue) => {
    setUploadedImageUrl("");
    setFieldValue('imageUrl', "");
  };

  const initialValues = React.useMemo(() => {
    const baseValues = {
      name: { az: "", en: "", ru: "" },
      imageUrl: "",
      isActive: true,
    };

    if (displayEditBrand && displayEditBrand.id) {
      return {
        name: displayEditBrand.name || { az: "", en: "", ru: "" },
        imageUrl: displayEditBrand.imageUrl || "",
        isActive: Boolean(displayEditBrand.isActive),
      };
    }

    return baseValues;
  }, [displayEditBrand]);

  console.log('BrandForm - editBrand:', editBrand);
  console.log('BrandForm - editBrandResponse:', editBrandResponse);
  console.log('BrandForm - displayEditBrand:', displayEditBrand);
  console.log('BrandForm - initialValues:', initialValues);
  console.log('BrandForm - initialValues.isActive:', initialValues.isActive);
  console.log('BrandForm - typeof initialValues.isActive:', typeof initialValues.isActive);

  const validationSchema = Yup.object({
    name: Yup.object({
      az: Yup.string().required(t("brands.validation.nameAzRequired")),
      en: Yup.string().required(t("brands.validation.nameEnRequired")),
      ru: Yup.string().required(t("brands.validation.nameRuRequired")),
    }),
    imageUrl: Yup.string().required(t("brands.validation.imageRequired")),
    isActive: Yup.boolean(),
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    console.log('BrandForm - handleSubmit called with values:', values);
    console.log('BrandForm - uploadedImageUrl:', uploadedImageUrl);
    
    const cleanValues = {
      name: values.name,
      imageUrl: uploadedImageUrl || values.imageUrl || "",
      isActive: Boolean(values.isActive),
    };
    
    console.log('BrandForm - cleanValues:', cleanValues);
    console.log('BrandForm - cleanValues.isActive:', cleanValues.isActive);
    onSubmit(cleanValues, { setSubmitting, resetForm });
  };

  return (
    <BaseForm
      isOpen={isOpen}
      onClose={onClose}
      editData={displayEditBrand}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      titleKey="brands"
      initialValues={initialValues}
      validationSchema={validationSchema}
    >
      {({ values, setFieldValue, errors, touched }) => {
        // Ensure values is not undefined
        const safeValues = values || {};
        
        console.log('BrandForm - children render - values:', safeValues);
        console.log('BrandForm - children render - errors:', errors);
        console.log('BrandForm - children render - touched:', touched);
        
        return (
          <div className="space-y-6">
          {/* Brand Name */}
          <MultilingualField
            name="name"
            label={t("brands.brandName")}
            placeholder={t("brands.brandNamePlaceholder")}
            required
          />

          {/* Brand Image Upload */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-foreground">
              {t("brands.brandImage")}
            </label>

            {/* Image Preview */}
            {uploadedImageUrl && (
              <div className="relative w-full max-w-xs">
                <img
                  src={uploadedImageUrl}
                  alt="Uploaded"
                  className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-lg border"
                  onError={(e) => {
                    console.error('Image load error:', uploadedImageUrl);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div
                  className="w-full h-48 sm:h-56 md:h-64 bg-gray-200 dark:bg-gray-700 rounded-lg border flex items-center justify-center text-gray-500 text-sm"
                  style={{ display: 'none' }}
                >
                  Image not loading
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 w-6 h-6 p-0 z-10"
                  onClick={() => removeImage(setFieldValue)}
                >
                  <X size={12} />
                </Button>
              </div>
            )}

            {/* Upload Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
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
                id="image-upload"
                disabled={imageUploading}
              />
              <label
                htmlFor="image-upload"
                className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors w-full sm:w-auto justify-center"
              >
                <Upload size={16} />
                {imageUploading ? t('common.uploading') : t('common.uploadImage')}
              </label>
            </div>

            {/* Hidden input for form value */}
            <input
              type="hidden"
              name="imageUrl"
              value={uploadedImageUrl}
            />
          </div>

          {/* Active Status */}
          <SwitchField
            name="isActive"
            label={t("brands.brandStatus")}
            description={t("brands.activeBrandHint")}
            setFieldValue={setFieldValue}
            values={safeValues}
          />
        </div>
        );
      }}
    </BaseForm>
  );
};

export default BrandForm;