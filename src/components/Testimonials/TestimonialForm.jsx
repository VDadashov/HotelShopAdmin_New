import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import BaseForm from "@/components/common/forms/BaseForm";
import MultilingualField from "@/components/common/forms/MultilingualField";
import SwitchField from "@/components/common/forms/SwitchField";
import { commonValidations } from "@/utils/validationSchemas";
import { Button } from "@/components/ui/button";
import { Upload, X, Star } from "lucide-react";
import axiosInstance from "@/utils/api/axiosInstance";
import { toast } from "sonner";
import * as Yup from "yup";

const TestimonialForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editData 
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    if (editData) {
      setUploadedImageUrl(editData.imageUrl || "");
    } else {
      setUploadedImageUrl("");
    }
  }, [editData]);

  const initialValues = {
    name: editData?.name || { az: "", en: "", ru: "" },
    message: editData?.message || { az: "", en: "", ru: "" },
    rating: editData?.rating || 0,
    imageUrl: editData?.imageUrl || "",
    isActive: editData?.isActive ?? true,
  };

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
          toast.error(t('common.imageValidationError'));
        };
        img.src = imageUrl;
      }
    } catch (error) {
      toast.error(t('common.imageUploadError'));
    } finally {
      setImageUploading(false);
    }
  };

  // Remove uploaded image
  const removeImage = (setFieldValue) => {
    setUploadedImageUrl("");
    setFieldValue('imageUrl', "");
  };

  const validationSchema = Yup.object({
    name: Yup.object().shape({
      az: Yup.string().required(t("testimonials.nameRequired")),
      en: Yup.string().required(t("testimonials.nameRequired")),
      ru: Yup.string().required(t("testimonials.nameRequired")),
    }),
    message: Yup.object().shape({
      az: Yup.string().required(t("testimonials.messageRequired")),
      en: Yup.string().required(t("testimonials.messageRequired")),
      ru: Yup.string().required(t("testimonials.messageRequired")),
    }),
    rating: Yup.number()
      .min(1, t("testimonials.ratingRequired"))
      .max(5, t("testimonials.ratingRequired"))
      .required(t("testimonials.ratingRequired")),
    imageUrl: Yup.string().test(
      'is-valid-url',
      t('common.invalidUrl'),
      function(value) {
        if (!value) return true; // Allow empty values
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      }
    ),
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const cleanValues = {
        ...values,
        imageUrl: uploadedImageUrl || values.imageUrl || "",
      };
      await onSubmit(cleanValues);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      editData={editData}
      title={editData ? t("testimonials.edit") : t("testimonials.add")}
      initialValues={initialValues}
      validationSchema={validationSchema}
      isSubmitting={isSubmitting}
    >
      {({ values, setFieldValue, errors, touched }) => (
        <div className="space-y-4">
          {/* Name */}
          <MultilingualField
            name="name"
            label={t("testimonials.name")}
            placeholder={t("testimonials.name")}
            values={values}
            setFieldValue={setFieldValue}
            errors={errors}
            touched={touched}
          />

          {/* Message */}
          <MultilingualField
            name="message"
            label={t("testimonials.message")}
            placeholder={t("testimonials.message")}
            values={values}
            setFieldValue={setFieldValue}
            errors={errors}
            touched={touched}
            multiline={true}
          />

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {t("testimonials.rating")} <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none"
                  onClick={() => setFieldValue("rating", star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= (hoveredRating || values.rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300 hover:text-yellow-300"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-3 text-sm text-gray-600">
                {values.rating > 0 ? `${values.rating}/5` : t("testimonials.selectRating")}
              </span>
            </div>
            {errors.rating && touched.rating && (
              <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-foreground">
              {t("testimonials.image")}
            </label>
            
            {/* Image Preview */}
            {uploadedImageUrl && (
              <div className="relative w-full max-w-xs">
                <img
                  src={uploadedImageUrl}
                  alt="Uploaded"
                  className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-lg border"
                  onError={(e) => {
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

          {/* Is Active */}
          <SwitchField
            name="isActive"
            label={t("testimonials.isActive")}
            values={values}
            setFieldValue={setFieldValue}
          />
        </div>
      )}
    </BaseForm>
  );
};

export default TestimonialForm;
