import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { useGet } from "@/utils/hooks/useCustomQuery";
import { ENDPOINTS } from "@/utils/constants/Endpoints";
import BaseForm from "@/components/common/forms/BaseForm";
import MultilingualField from "@/components/common/forms/MultilingualField";
import BasicField from "@/components/common/forms/BasicField";
import SwitchField from "@/components/common/forms/SwitchField";
import SelectField from "@/components/common/forms/SelectField";
import { commonValidations } from "@/utils/validationSchemas";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import axiosInstance from "@/utils/api/axiosInstance";
import { toast } from "sonner";
import FilePicker from "@/components/common/FilePicker";

const ProductForm = ({
  isOpen,
  onClose,
  editProduct,
  onSubmit,
  isSubmitting,
  categoryList,
}) => {
  const { t, i18n } = useTranslation();

  // Get product details for editing with allLanguages=true
  const detailUrl = editProduct?.id ? `${ENDPOINTS.products}/${editProduct.id}?allLanguages=true` : null;
  const { data: editProductResponse } = useGet("editProduct", detailUrl, i18n.language);
  const displayEditProduct = editProductResponse?.data || editProduct;

  const [editMainImg, setEditMainImg] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [showFilePicker, setShowFilePicker] = useState(false);

  useEffect(() => {
    if (displayEditProduct) {
      setEditMainImg(displayEditProduct.mainImg || "");
      setUploadedImageUrl(displayEditProduct.mainImg || "");
    } else {
      setEditMainImg("");
      setUploadedImageUrl("");
    }
  }, [displayEditProduct]);

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
          setFieldValue('mainImg', imageUrl);
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
    setFieldValue('mainImg', "");
  };

  const initialValues = displayEditProduct
    ? {
        ...displayEditProduct,
        title: displayEditProduct.name || { az: "", en: "", ru: "" }, // name -> title mapping
        categoryId: displayEditProduct.category?.id
          ? String(displayEditProduct.category.id)
          : displayEditProduct.categoryId
          ? String(displayEditProduct.categoryId)
          : "",
      }
    : {
        title: { az: "", en: "", ru: "" },
        description: { az: "", en: "", ru: "" },
        categoryId: "",
        isActive: true,
        mainImg: "",
      };


  const validationSchema = Yup.object({
    title: commonValidations.multilingualTitle("products"),
    description: commonValidations.multilingualDescription("products"),
    categoryId: commonValidations.required("products.categoryRequired"),
    isActive: commonValidations.isActive,
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const cleanValues = {
      name: values.title, // title -> name
      description: values.description,
      categoryId: values.categoryId ? parseInt(values.categoryId) : null,
      isActive: values.isActive,
      mainImg: uploadedImageUrl || values.mainImg || "", // Use uploaded image URL
    };
    onSubmit(cleanValues, { setSubmitting, resetForm });
  };

  return (
    <BaseForm
      isOpen={isOpen}
      onClose={onClose}
      editData={displayEditProduct}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      titleKey="products"
      initialValues={initialValues}
      validationSchema={validationSchema}
    >
      {({ values, setFieldValue }) => (
        <div className="space-y-6">
          {/* Product Name */}
          <MultilingualField
            name="title"
            label={t("products.productName")}
            placeholder={t("products.productNamePlaceholder")}
            required
          />

          {/* Product Description */}
          <MultilingualField
            name="description"
            label={t("products.productDescription")}
            placeholder={t("products.productDescriptionPlaceholder")}
            multiline
          />

          {/* Category Selection */}
          <SelectField
            name="categoryId"
            label={t("products.productCategory")}
            placeholder={t("products.selectCategory")}
            options={categoryList}
            valueKey="id"
            labelKey="name"
            setFieldValue={setFieldValue}
            values={values}
            required
            emptyOption={t("products.selectCategory")}
          />

          {/* Main Image Upload */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-foreground">
              {t("products.mainImage")}
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
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFilePicker(true)}
                className="flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <Upload size={16} />
                {t('common.uploadImage')}
              </Button>
            </div>

            {/* FilePicker Modal */}
            <FilePicker
              isOpen={showFilePicker}
              onClose={() => setShowFilePicker(false)}
              onSelect={(url) => {
                setUploadedImageUrl(url);
                setFieldValue('mainImg', url);
                setShowFilePicker(false);
              }}
              acceptTypes={["image"]}
              title={t('products.selectProductImage')}
            />

            {/* Hidden input for form value */}
            <input
              type="hidden"
              name="mainImg"
              value={uploadedImageUrl}
            />
          </div>

          {/* Active Status */}
          <SwitchField
            name="isActive"
            label={t("products.productStatus")}
            description={t("products.activeProductHint")}
            setFieldValue={setFieldValue}
            values={values}
          />
        </div>
      )}
    </BaseForm>
  );
};

export default ProductForm;