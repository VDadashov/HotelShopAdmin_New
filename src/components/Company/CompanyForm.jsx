import React from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CompanyForm = ({ 
  isOpen, 
  onClose, 
  editCompany, 
  onSubmit, 
  isSubmitting,
  categoryList 
}) => {
  const { t, i18n } = useTranslation();

  const initialValues = editCompany
    ? {
        ...editCompany,
        logo: "",
        logoPreview: editCompany.logo || "",
        categoryIds: Array.isArray(editCompany.categories)
          ? editCompany.categories.map((cat) => String(cat.id))
          : [],
      }
    : {
        title: { az: "", en: "", ru: "" },
        description: { az: "", en: "", ru: "" },
        logo: "",
        logoPreview: "",
        categoryIds: [],
      };

  const validationSchema = Yup.object({
    title: Yup.object({
      az: Yup.string().required(t('companies.validation.titleAzRequired')),
      en: Yup.string().required(t('companies.validation.titleEnRequired')),
      ru: Yup.string().required(t('companies.validation.titleRuRequired')),
    }),
    description: Yup.object({
      az: Yup.string().required(t('companies.validation.descriptionAzRequired')),
      en: Yup.string().required(t('companies.validation.descriptionEnRequired')),
      ru: Yup.string().required(t('companies.validation.descriptionRuRequired')),
    }),
    logoPreview: Yup.string().required(t('companies.validation.logoRequired')),
    categoryIds: Yup.array().min(1, t('companies.validation.categoryRequired')),
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append("title", JSON.stringify(values.title));
    formData.append("description", JSON.stringify(values.description));
    
    // Only append logo if a new file is selected
    if (values.logo) {
      formData.append("logo", values.logo);
    }
    // If editing and no new image is selected, don't send logo field
    // This allows the backend to keep the existing image
    
    formData.append("categoryIds", JSON.stringify(values.categoryIds));
    
    onSubmit(formData, { setSubmitting, resetForm });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full rounded-2xl shadow-2xl bg-card dark:bg-[#232323] p-8 border-0">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-foreground">
            {editCompany ? t('companies.editCompany') : t('companies.addCompany')}
          </DialogTitle>
        </DialogHeader>
        
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form className="space-y-5">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="title.az" className="mb-2 block">
                    {t('companies.companyName')} (az)
                  </Label>
                  <Field
                    as={Input}
                    name="title.az"
                    id="title.az"
                    placeholder={t('companies.companyNamePlaceholder')}
                    className="mb-2"
                    required
                  />
                  <ErrorMessage
                    name="title.az"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="title.en" className="mb-2 block">
                    {t('companies.companyName')} (en)
                  </Label>
                  <Field
                    as={Input}
                    name="title.en"
                    id="title.en"
                    placeholder={t('companies.companyNamePlaceholder')}
                    className="mb-2"
                    required
                  />
                  <ErrorMessage
                    name="title.en"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="title.ru" className="mb-2 block">
                    {t('companies.companyName')} (ru)
                  </Label>
                  <Field
                    as={Input}
                    name="title.ru"
                    id="title.ru"
                    placeholder={t('companies.companyNamePlaceholder')}
                    className="mb-2"
                    required
                  />
                  <ErrorMessage
                    name="title.ru"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="description.az" className="mb-2 block">
                    {t('companies.companyDescription')} (az)
                  </Label>
                  <Field
                    as={Textarea}
                    name="description.az"
                    id="description.az"
                    placeholder={t('companies.companyDescriptionPlaceholder')}
                    className="mb-2"
                    required
                  />
                  <ErrorMessage
                    name="description.az"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="description.en" className="mb-2 block">
                    {t('companies.companyDescription')} (en)
                  </Label>
                  <Field
                    as={Textarea}
                    name="description.en"
                    id="description.en"
                    placeholder={t('companies.companyDescriptionPlaceholder')}
                    className="mb-2"
                    required
                  />
                  <ErrorMessage
                    name="description.en"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="description.ru" className="mb-2 block">
                    {t('companies.companyDescription')} (ru)
                  </Label>
                  <Field
                    as={Textarea}
                    name="description.ru"
                    id="description.ru"
                    placeholder={t('companies.companyDescriptionPlaceholder')}
                    className="mb-2"
                    required
                  />
                  <ErrorMessage
                    name="description.ru"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="logo" className="mb-2 block">
                  {t('companies.companyLogo')}
                </Label>
                <Input
                  id="logo"
                  name="logo"
                  type="file"
                  accept="image/*"
                  className="mb-2"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setFieldValue("logo", file);
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () =>
                        setFieldValue("logoPreview", reader.result);
                      reader.readAsDataURL(file);
                    } else {
                      setFieldValue("logoPreview", "");
                    }
                  }}
                />
                {values.logoPreview && (
                  <div className="mt-2 flex items-center gap-2">
                    <img
                      src={values.logoPreview}
                      alt="Preview"
                      className="w-24 h-24 object-contain rounded border"
                    />
                    <button
                      type="button"
                      className="ml-2 p-1 rounded-full bg-gray-200 hover:bg-red-200 text-gray-700 hover:text-red-600 transition"
                      onClick={() => {
                        setFieldValue("logo", "");
                        setFieldValue("logoPreview", "");
                        document.getElementById("logo").value = "";
                      }}
                      title={t('common.delete')}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <ErrorMessage
                  name="logoPreview"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="categoryIds" className="mb-2 block">
                  {t('common.categories')}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <div
                      className={cn(
                        "w-full min-h-[40px] border rounded-md px-3 py-2 flex flex-wrap gap-2 cursor-pointer bg-card dark:bg-[#232323]",
                        "focus-within:ring-2 focus-within:ring-ring border-border"
                      )}
                    >
                      {values.categoryIds.length === 0 && (
                        <span className="text-gray-400 select-none">
                          {t('companies.selectCategories')}
                        </span>
                      )}
                      {values.categoryIds.map((id) => {
                        const cat = categoryList.find(
                          (c) => String(c.id) === String(id)
                        );
                        return (
                          <span
                            key={id}
                            className="flex items-center bg-[rgb(var(--primary-brand))] text-black rounded-full px-3 py-1 text-xs font-medium mr-1 mb-1 hover:bg-[rgb(var(--primary-brand-hover))]"
                          >
                            {cat?.title?.[i18n.language] ||
                              cat?.title?.az ||
                              cat?.title ||
                              id}
                            <button
                              type="button"
                              className="ml-1 text-black hover:text-red-600 focus:outline-none"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFieldValue(
                                  "categoryIds",
                                  values.categoryIds.filter(
                                    (cid) => cid !== id
                                  )
                                );
                              }}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2">
                    <div className="flex flex-col gap-1">
                      {categoryList.map((cat) => (
                        <button
                          type="button"
                          key={cat.id}
                          className={cn(
                            "flex items-center px-3 py-2 rounded hover:bg-[rgb(var(--primary-brand))] hover:text-black transition",
                            values.categoryIds.includes(String(cat.id))
                              ? "bg-[rgb(var(--primary-brand))] text-black font-semibold"
                              : ""
                          )}
                          onClick={() => {
                            if (values.categoryIds.includes(String(cat.id))) {
                              setFieldValue(
                                "categoryIds",
                                values.categoryIds.filter(
                                  (cid) => cid !== String(cat.id)
                                )
                              );
                            } else {
                              setFieldValue("categoryIds", [
                                ...values.categoryIds,
                                String(cat.id),
                              ]);
                            }
                          }}
                        >
                          {cat.title?.[i18n.language] ||
                            cat.title?.az ||
                            cat.title ||
                            cat.id}
                          {values.categoryIds.includes(String(cat.id)) && (
                            <X className="w-3 h-3 ml-2" />
                          )}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                <ErrorMessage
                  name="categoryIds"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  type="submit"
                  className="bg-[rgb(var(--primary-brand))] text-black font-semibold hover:bg-[rgb(var(--primary-brand-hover))]"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? editCompany
                      ? t('companies.updating')
                      : t('companies.creating')
                    : editCompany
                    ? t('common.save')
                    : t('common.add')}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyForm; 