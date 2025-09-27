import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProductForm = ({
  isOpen,
  onClose,
  editProduct,
  onSubmit,
  categoryList,
}) => {
  const { t, i18n } = useTranslation();


  const [editMainImg, setEditMainImg] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    if (editProduct) {
      setEditMainImg(editProduct.mainImg || "");
    } else {
      setEditMainImg("");
    }
  }, [editProduct]);

  const initialValues = editProduct
    ? {
        ...editProduct,
        categoryId: editProduct.categoryId
          ? String(editProduct.categoryId)
          : "",
        mainImg: "", // file input üçün həmişə boş olmalıdır
        isActive: editProduct.isActive ?? true,
      }
    : {
        name: { az: "", en: "", ru: "" },
        description: { az: "", en: "", ru: "" },
        mainImg: "",
        categoryId: "",
        isActive: true,
      };

  const validationSchema = Yup.object({
    name: Yup.object({
      az: Yup.string().required(t("products.validation.nameAzRequired")),
      en: Yup.string().required(t("products.validation.nameEnRequired")),
      ru: Yup.string().required(t("products.validation.nameRuRequired")),
    }),
    description: Yup.object({
      az: Yup.string(),
      en: Yup.string(),
      ru: Yup.string(),
    }),
    categoryId: Yup.string().required(
      t("products.validation.categoryRequired")
    ),
    isActive: Yup.boolean(),
  });

  // Image upload function
  const handleImageUpload = async (file, setFieldValue) => {
    if (!file) return;

    console.log("Uploading file:", file.name, file.type, file.size);

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert(t("products.validation.invalidFileType"));
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert(t("products.validation.fileTooLarge"));
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

      const imageUrl = data.media?.url;

      if (imageUrl) {
        setFieldValue("mainImg", imageUrl);
        setEditMainImg(imageUrl);
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
    const submitData = {
      name: values.name,
      description: values.description,
      mainImg: values.mainImg || editMainImg,
      categoryId: parseInt(values.categoryId),
      isActive: values.isActive,
    };

    // If editing, add the ID
    if (editProduct) {
      submitData.id = editProduct.id;
    }

    onSubmit(submitData, { setSubmitting, resetForm });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full rounded-2xl shadow-2xl bg-card dark:bg-[#232323] p-8 border-0">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-foreground">
            {editProduct ? t("products.editProduct") : t("products.addProduct")}
          </DialogTitle>
        </DialogHeader>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="space-y-5">
              {/* Product Name - Multilingual */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">
                  {t("products.productName")}
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label
                      htmlFor="name.az"
                      className="mb-2 block text-sm font-medium"
                    >
                      {t("products.productName")} (AZ)
                    </Label>
                    <Field
                      as={Input}
                      name="name.az"
                      id="name.az"
                      placeholder={t("products.productNamePlaceholder")}
                      className="w-full"
                      required
                    />
                    <ErrorMessage
                      name="name.az"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="name.en"
                      className="mb-2 block text-sm font-medium"
                    >
                      {t("products.productName")} (EN)
                    </Label>
                    <Field
                      as={Input}
                      name="name.en"
                      id="name.en"
                      placeholder={t("products.productNamePlaceholder")}
                      className="w-full"
                      required
                    />
                    <ErrorMessage
                      name="name.en"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="name.ru"
                      className="mb-2 block text-sm font-medium"
                    >
                      {t("products.productName")} (RU)
                    </Label>
                    <Field
                      as={Input}
                      name="name.ru"
                      id="name.ru"
                      placeholder={t("products.productNamePlaceholder")}
                      className="w-full"
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

              {/* Product Description - Multilingual */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">
                  {t("products.productDescription")}
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label
                      htmlFor="description.az"
                      className="mb-2 block text-sm font-medium"
                    >
                      {t("products.productDescription")} (AZ)
                    </Label>
                    <Field
                      as={Textarea}
                      name="description.az"
                      id="description.az"
                      placeholder={t("products.productDescriptionPlaceholder")}
                      className="w-full min-h-[100px]"
                      rows={4}
                    />
                    <ErrorMessage
                      name="description.az"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="description.en"
                      className="mb-2 block text-sm font-medium"
                    >
                      {t("products.productDescription")} (EN)
                    </Label>
                    <Field
                      as={Textarea}
                      name="description.en"
                      id="description.en"
                      placeholder={t("products.productDescriptionPlaceholder")}
                      className="w-full min-h-[100px]"
                      rows={4}
                    />
                    <ErrorMessage
                      name="description.en"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="description.ru"
                      className="mb-2 block text-sm font-medium"
                    >
                      {t("products.productDescription")} (RU)
                    </Label>
                    <Field
                      as={Textarea}
                      name="description.ru"
                      id="description.ru"
                      placeholder={t("products.productDescriptionPlaceholder")}
                      className="w-full min-h-[100px]"
                      rows={4}
                    />
                    <ErrorMessage
                      name="description.ru"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Main Image */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">
                  {t("products.mainImage")}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="mainImg"
                      className="mb-2 block text-sm font-medium"
                    >
                      {t("products.selectMainImage")}
                    </Label>
                    <Input
                      id="mainImg"
                      name="mainImg"
                      type="file"
                      accept="image/*"
                      className="w-full"
                      disabled={imageUploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(file, setFieldValue);
                        }
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {imageUploading
                        ? t("products.uploading")
                        : t("products.imageUploadHint")}
                    </p>
                  </div>

                  {/* Image Preview */}
                  <div>
                    <Label className="mb-2 block text-sm font-medium">
                      {t("products.imagePreview")}
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-32 flex items-center justify-center">
                      {/* Show uploaded image URL */}
                      {values.mainImg && typeof values.mainImg === "string" ? (
                        <div className="relative">
                          <img
                            src={values.mainImg}
                            alt="preview"
                            className="h-24 w-24 object-cover rounded border"
                          />
                          <button
                            type="button"
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition"
                            onClick={() => {
                              setFieldValue("mainImg", "");
                              setEditMainImg("");
                            }}
                            title={t("products.removeImage")}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : editMainImg ? (
                        // Show existing image during edit
                        <div className="relative">
                          <img
                            src={editMainImg}
                            alt="main"
                            className="h-24 w-24 object-cover rounded border"
                          />
                          <button
                            type="button"
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition"
                            onClick={() => setEditMainImg("")}
                            title={t("products.removeImage")}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : imageUploading ? (
                        <div className="text-center text-gray-500">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-2"></div>
                          <p className="text-sm">{t("products.uploading")}</p>
                        </div>
                      ) : (
                        <div className="text-center text-gray-500">
                          <p className="text-sm">
                            {t("products.noImageSelected")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Category and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="categoryId"
                    className="mb-2 block text-sm font-medium"
                  >
                    {t("products.productCategory")}
                  </Label>
                  <Select
                    value={values.categoryId}
                    onValueChange={(v) => setFieldValue("categoryId", v)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("products.selectCategory")} />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryList &&
                        categoryList?.data
                          ?.filter((cat) => cat.isProductHolder === true)
                          .map((cat) => (
                            <SelectItem key={cat.id} value={String(cat.id)}>
                              {cat.name?.[i18n.language] ||
                                cat.name?.az ||
                                cat.name?.en ||
                                cat.title?.[i18n.language] ||
                                cat.title?.az ||
                                cat.title}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                  <ErrorMessage
                    name="categoryId"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-medium">
                    {t("products.productStatus")}
                  </Label>
                  <div className="flex items-center space-x-3 pt-2">
                    <Switch
                      id="isActive"
                      checked={values.isActive}
                      onCheckedChange={(checked) =>
                        setFieldValue("isActive", checked)
                      }
                    />
                    <Label htmlFor="isActive" className="text-sm">
                      {values.isActive
                        ? t("common.active")
                        : t("common.inactive")}
                    </Label>
                  </div>
                  <p className="text-xs text-gray-500">
                    {t("products.activeProductHint")}
                  </p>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting || imageUploading}
                  className="px-6 py-2"
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  type="submit"
                  className="bg-[rgb(var(--primary-brand))] text-black font-semibold hover:bg-[rgb(var(--primary-brand-hover))] px-6 py-2"
                  disabled={isSubmitting || imageUploading}
                >
                  {isSubmitting
                    ? editProduct
                      ? t("products.updating")
                      : t("products.creating")
                    : editProduct
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

export default ProductForm;
