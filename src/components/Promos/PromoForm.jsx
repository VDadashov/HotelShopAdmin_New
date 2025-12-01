import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import BaseForm from "@/components/common/forms/BaseForm";
import MultilingualField from "@/components/common/forms/MultilingualField";
import SwitchField from "@/components/common/forms/SwitchField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Calendar, Search, Package, Check } from "lucide-react";
import axiosInstance from "@/utils/api/axiosInstance";
import { toast } from "sonner";
import FilePicker from "@/components/common/FilePicker";
import * as Yup from "yup";
import { useGet } from "@/utils/hooks";
import { ENDPOINTS } from "@/utils/constants/Endpoints";
import { commonValidations } from "@/utils/validationSchemas";

const PromoForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editData 
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [showFilePicker, setShowFilePicker] = useState(false);

  // Get products for dropdown
  const { data: productsResponse } = useGet("products", `${ENDPOINTS.products}?allLanguages=true`);

  // Filter products based on search term
  const filteredProducts = productsResponse?.data?.filter((product) => {
    if (!productSearchTerm) return true;
    const searchLower = productSearchTerm.toLowerCase();
    return (
      product.name?.az?.toLowerCase().includes(searchLower) ||
      product.name?.en?.toLowerCase().includes(searchLower) ||
      product.name?.ru?.toLowerCase().includes(searchLower) ||
      product.id.toString().includes(searchLower)
    );
  }) || [];

  // Get selected product info
  const getSelectedProductInfo = (productId) => {
    const product = productsResponse?.data?.find(p => p.id === productId);
    if (!product) return { name: "", category: "", image: null };
    return {
      name: product.name?.az || product.name?.en || product.name?.ru || `Product ${product.id}`,
      category: product.category?.name?.az || product.category?.name?.en || product.category?.name?.ru || 'No Category',
      image: product.mainImg || product.imageUrl || product.image || product.mainImage || null
    };
  };

  useEffect(() => {
    if (editData) {
      setUploadedImageUrl(editData.backgroundImg || "");
    } else {
      setUploadedImageUrl("");
    }
  }, [editData]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProductDropdownOpen && !event.target.closest('.product-dropdown')) {
        setIsProductDropdownOpen(false);
        setProductSearchTerm("");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProductDropdownOpen]);

  const initialValues = {
    title: editData?.title || { az: "", en: "", ru: "" },
    subtitle: editData?.subtitle || { az: "", en: "", ru: "" },
    description: editData?.description || { az: "", en: "", ru: "" },
    startDate: editData?.startDate 
      ? new Date(editData.startDate).toISOString().slice(0, 16) 
      : new Date().toISOString().slice(0, 16),
    endDate: editData?.endDate 
      ? new Date(editData.endDate).toISOString().slice(0, 16) 
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16), // 30 days from now
    productId: editData?.productId || "",
    backgroundImg: editData?.backgroundImg || "",
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

      // Extract URL from the nested media object
      const imageUrl = response.data?.media?.url;
      if (imageUrl) {
        // Validate image URL
        const img = new Image();
        img.onload = () => {
          setUploadedImageUrl(imageUrl);
          setFieldValue('backgroundImg', imageUrl);
          toast.success(t("common.imageUploaded"));
        };
        img.onerror = () => {
          toast.error(t("common.imageUploadError"));
        };
        img.src = imageUrl;
      } else {
        throw new Error('No URL returned from server');
      }
    } catch (error) {
      toast.error(t("common.imageUploadError"));
    } finally {
      setImageUploading(false);
    }
  };

  const removeImage = (setFieldValue) => {
    setUploadedImageUrl("");
    setFieldValue('backgroundImg', "");
  };

  const validationSchema = Yup.object({
    title: commonValidations.multilingualTitle("promos"),
    subtitle: Yup.object({
      az: Yup.string(),
      en: Yup.string(),
      ru: Yup.string(),
    }),
    description: Yup.object({
      az: Yup.string(),
      en: Yup.string(),
      ru: Yup.string(),
    }),
    startDate: Yup.string().required(t("promos.validation.startDateRequired")),
    endDate: Yup.string()
      .required(t("promos.validation.endDateRequired"))
      .test('is-after-start', 'End date must be after start date', function(value) {
        const { startDate } = this.parent;
        if (!startDate || !value) return true;
        return new Date(value) > new Date(startDate);
      }),
    productId: Yup.number().required(t("promos.validation.productRequired")),
    backgroundImg: Yup.string().test(
      'is-valid-url',
      t("common.invalidUrl"),
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
    isActive: commonValidations.isActive,
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsSubmitting(true);
    try {
      // Convert datetime-local to ISO string
      const submitData = {
        ...values,
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
        backgroundImg: uploadedImageUrl || values.backgroundImg,
      };
      
      await onSubmit(submitData);
      // Don't call onClose here - let the parent handle it
    } catch (error) {
      toast.error(t("common.error"));
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  return (
    <BaseForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}
      titleKey="promos"
      editData={editData}
      maxWidth="max-w-4xl"
    >
      {({ values, setFieldValue, errors, touched }) => (
        <div className="space-y-6">
          {/* Title */}
          <MultilingualField
            name="title"
            label={t("promos.titleField")}
            placeholder={{
              az: "Promosiya başlığı",
              en: "Promotion title",
              ru: "Заголовок акции"
            }}
            required
          />

          {/* Subtitle */}
          <MultilingualField
            name="subtitle"
            label={t("promos.subtitle")}
            placeholder={{
              az: "Alt başlıq",
              en: "Subtitle",
              ru: "Подзаголовок"
            }}
          />

          {/* Description */}
          <MultilingualField
            name="description"
            label={t("promos.description")}
            placeholder={{
              az: "Təsvir",
              en: "Description",
              ru: "Описание"
            }}
            multiline
            rows={4}
          />

          {/* Date Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("promos.startDate")} *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="datetime-local"
                  value={values.startDate}
                  onChange={(e) => setFieldValue('startDate', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.startDate && touched.startDate
                      ? 'border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                />
              </div>
              {errors.startDate && touched.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("promos.endDate")} *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="datetime-local"
                  value={values.endDate}
                  onChange={(e) => setFieldValue('endDate', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.endDate && touched.endDate
                      ? 'border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                />
              </div>
              {errors.endDate && touched.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Product Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("promos.productId")} *
            </label>
            <div className="relative product-dropdown">
              <div
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
                  errors.productId && touched.productId
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
              >
                <div className="flex items-center justify-between">
                  {values.productId ? (
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        {getSelectedProductInfo(values.productId).image ? (
                          <img
                            src={getSelectedProductInfo(values.productId).image}
                            alt="Product"
                            className="w-8 h-8 object-cover rounded border"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div
                          className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded border flex items-center justify-center text-gray-500"
                          style={{ display: getSelectedProductInfo(values.productId).image ? 'none' : 'flex' }}
                        >
                          <Package className="h-4 w-4" />
                        </div>
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {getSelectedProductInfo(values.productId).name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {getSelectedProductInfo(values.productId).category}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-500">{t("promos.selectProduct")}</span>
                    </div>
                  )}
                  <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
                </div>
              </div>

              {isProductDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-hidden">
                  <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                    <Input
                      type="text"
                      placeholder={t("promos.searchProduct")}
                      value={productSearchTerm}
                      onChange={(e) => setProductSearchTerm(e.target.value)}
                      className="w-full"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          className={`px-3 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between ${
                            values.productId === product.id ? 'bg-blue-50 dark:bg-blue-900' : ''
                          }`}
                          onClick={() => {
                            setFieldValue('productId', product.id);
                            setIsProductDropdownOpen(false);
                            setProductSearchTerm("");
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            {/* Product Image */}
                            <div className="flex-shrink-0">
                              {(product.mainImg || product.imageUrl || product.image || product.mainImage) ? (
                                <img
                                  src={product.mainImg || product.imageUrl || product.image || product.mainImage}
                                  alt="Product"
                                  className="w-12 h-12 object-cover rounded-lg border"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div
                                className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg border flex items-center justify-center text-gray-500"
                                style={{ display: (product.mainImg || product.imageUrl || product.image || product.mainImage) ? 'none' : 'flex' }}
                              >
                                <Package className="h-6 w-6" />
                              </div>
                            </div>
                            
                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                {product.name?.az || product.name?.en || product.name?.ru || `Product ${product.id}`}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {product.category?.name?.az || product.category?.name?.en || product.category?.name?.ru || 'No Category'}
                              </div>
                              <div className="text-xs text-gray-400 dark:text-gray-500">
                                ID: {product.id}
                              </div>
                            </div>
                          </div>
                          
                          {/* Selection Indicator */}
                          {values.productId === product.id && (
                            <Check className="h-5 w-5 text-blue-500 flex-shrink-0" />
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-gray-500 text-center">
                        {t("promos.noProductsFound")}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            {errors.productId && touched.productId && (
              <p className="mt-1 text-sm text-red-600">{errors.productId}</p>
            )}
          </div>

          {/* Background Image Upload */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-foreground">
              {t("promos.backgroundImg")}
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
                setFieldValue('backgroundImg', url);
                setShowFilePicker(false);
              }}
              acceptTypes={["image"]}
              title={t('promos.selectBackgroundImage')}
            />

            {/* Hidden input for form value */}
            <input
              type="hidden"
              name="backgroundImg"
              value={uploadedImageUrl}
            />

            {imageUploading && (
              <div className="text-sm text-blue-600">
                {t("common.uploading")}...
              </div>
            )}

            {errors.backgroundImg && touched.backgroundImg && (
              <p className="mt-1 text-sm text-red-600">{errors.backgroundImg}</p>
            )}
          </div>

          {/* Active Status */}
          <SwitchField
            name="isActive"
            label={t("promos.isActive")}
            description={t("promos.activePromoHint")}
            setFieldValue={setFieldValue}
            values={values}
          />
        </div>
      )}
    </BaseForm>
  );
};

export default PromoForm;
