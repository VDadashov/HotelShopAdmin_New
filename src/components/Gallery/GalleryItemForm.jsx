import * as React from "react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { usePost, useUpdate } from "@/utils/hooks/useCustomMutation";
import { useGet } from "@/utils/hooks/useCustomQuery";
import { ENDPOINTS } from "@/utils/constants/Endpoints";
import { toast } from "sonner";

export default function GalleryItemForm({ 
  showCreate, 
  setShowCreate, 
  editItem, 
  setEditItem,
  refetch 
}) {
  const { t } = useTranslation();
  const [editImageList, setEditImageList] = useState([]);
  const [editMainImage, setEditMainImage] = useState("");

  // API hooks
  const createItem = usePost("gallery-items", ENDPOINTS.galleryItem);
  const updateItem = useUpdate("gallery-items", ENDPOINTS.galleryItem, editItem?.id);
  const { data: categoryList = [] } = useGet("gallery-category", `${ENDPOINTS.galleryCategory}?allLanguages=true`);

  useEffect(() => {
    if (editItem) {
      setEditImageList(Array.isArray(editItem.imageList) ? editItem.imageList : []);
      setEditMainImage(editItem.mainImage || "");
    } else {
      setEditImageList([]);
      setEditMainImage("");
    }
  }, [editItem]);

  // Edit və Create üçün eyni form, initialValues fərqli olacaq
  const initialValues = editItem ? {
    ...editItem,
    galleryCategoryId: editItem.galleryCategory?.id ? String(editItem.galleryCategory.id) : (editItem.galleryCategoryId ? String(editItem.galleryCategoryId) : ""),
    mainImage: "",
    imageList: [],
  } : {
    title: { az: "", en: "", ru: "" },
    description: { az: "", en: "", ru: "" },
    mainImage: "",
    imageList: [],
    galleryCategoryId: "",
  };

  return (
    <Dialog open={showCreate} onOpenChange={v => { setShowCreate(v); if (!v) setEditItem(null); }}>
      <DialogContent className="max-w-2xl w-full rounded-2xl shadow-2xl bg-card dark:bg-[#232323] p-8 border-0">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-foreground">
            {editItem ? t('gallery.editItem') : t('gallery.addItem')}
          </DialogTitle>
        </DialogHeader>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={Yup.object({
            title: Yup.object({
              az: Yup.string().required(t('gallery.validation.titleAzRequired')),
              en: Yup.string().required(t('gallery.validation.titleEnRequired')),
              ru: Yup.string().required(t('gallery.validation.titleRuRequired')),
            }),
            description: Yup.object({
              az: Yup.string(),
              en: Yup.string(),
              ru: Yup.string(),
            }),
            galleryCategoryId: Yup.string().required(t('gallery.validation.categoryRequired')),
          })}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            const formData = new FormData();
            formData.append("title", JSON.stringify(values.title));
            formData.append("description", JSON.stringify(values.description));
            if (values.mainImage) formData.append("mainImage", values.mainImage);
            const allImages = [...editImageList, ...values.imageList.filter(f => typeof f !== 'string')];
            allImages.forEach(fileOrUrl => {
              formData.append("imageList[]", fileOrUrl);
            });
            formData.append("galleryCategoryId", values.galleryCategoryId);
            
            if (editItem) {
              updateItem.mutate(formData, {
                onSuccess: () => {
                  toast.success(t('gallery.itemUpdated'));
                  setShowCreate(false);
                  setEditItem(null);
                  resetForm();
                  refetch();
                },
                onError: (error) => {
                  toast.error(error?.message || t('errors.generalError'));
                },
                onSettled: () => setSubmitting(false),
              });
            } else {
              createItem.mutate(formData, {
                onSuccess: () => {
                  toast.success(t('gallery.itemAdded'));
                  setShowCreate(false);
                  resetForm();
                  refetch();
                },
                onError: (error) => {
                  toast.error(error?.message || t('errors.generalError'));
                },
                onSettled: () => setSubmitting(false),
              });
            }
          }}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="space-y-5">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="title.az" className="mb-2 block">{t('gallery.itemTitle')} (az)</Label>
                  <Field 
                    as={Input} 
                    name="title.az" 
                    id="title.az" 
                    placeholder={t('gallery.itemNamePlaceholder')} 
                    className="mb-2" 
                    required 
                  />
                  <ErrorMessage name="title.az" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div>
                  <Label htmlFor="title.en" className="mb-2 block">{t('gallery.itemTitle')} (en)</Label>
                  <Field 
                    as={Input} 
                    name="title.en" 
                    id="title.en" 
                    placeholder={t('gallery.itemNamePlaceholder')} 
                    className="mb-2" 
                    required 
                  />
                  <ErrorMessage name="title.en" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div>
                  <Label htmlFor="title.ru" className="mb-2 block">{t('gallery.itemTitle')} (ru)</Label>
                  <Field 
                    as={Input} 
                    name="title.ru" 
                    id="title.ru" 
                    placeholder={t('gallery.itemNamePlaceholder')} 
                    className="mb-2" 
                    required 
                  />
                  <ErrorMessage name="title.ru" component="div" className="text-red-500 text-xs mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="description.az" className="mb-2 block">{t('gallery.itemDescription')} (az)</Label>
                  <Field 
                    as={Textarea} 
                    name="description.az" 
                    id="description.az" 
                    placeholder={t('gallery.itemDescriptionPlaceholder')} 
                    className="mb-2" 
                  />
                  <ErrorMessage name="description.az" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div>
                  <Label htmlFor="description.en" className="mb-2 block">{t('gallery.itemDescription')} (en)</Label>
                  <Field 
                    as={Textarea} 
                    name="description.en" 
                    id="description.en" 
                    placeholder={t('gallery.itemDescriptionPlaceholder')} 
                    className="mb-2" 
                  />
                  <ErrorMessage name="description.en" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div>
                  <Label htmlFor="description.ru" className="mb-2 block">{t('gallery.itemDescription')} (ru)</Label>
                  <Field 
                    as={Textarea} 
                    name="description.ru" 
                    id="description.ru" 
                    placeholder={t('gallery.itemDescriptionPlaceholder')} 
                    className="mb-2" 
                  />
                  <ErrorMessage name="description.ru" component="div" className="text-red-500 text-xs mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="mainImage" className="mb-2 block">{t('gallery.mainImage')}</Label>
                  <Input
                    id="mainImage"
                    name="mainImage"
                    type="file"
                    accept="image/*"
                    className="mb-2"
                    onChange={e => {
                      setFieldValue("mainImage", e.target.files[0]);
                      setEditMainImage("");
                    }}
                  />
                  {/* Edit zamanı mövcud şəkil göstərilsin və silmək imkanı olsun */}
                  {(!values.mainImage && editMainImage) && (
                    <div className="relative group mt-2 inline-block">
                      <img src={editMainImage} alt="main" className="w-24 h-24 object-contain rounded border" />
                      <button
                        type="button"
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 opacity-80 hover:opacity-100 group-hover:scale-110 transition"
                        onClick={() => setEditMainImage("")}
                        title={t('common.delete')}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {values.mainImage && typeof values.mainImage === 'object' && (
                    <img src={URL.createObjectURL(values.mainImage)} alt="preview" className="w-24 h-24 object-contain rounded border mt-2" />
                  )}
                </div>
                <div>
                  <Label htmlFor="imageList" className="mb-2 block">{t('gallery.imageList')}</Label>
                  <Input
                    id="imageList"
                    name="imageList"
                    type="file"
                    accept="image/*"
                    className="mb-2"
                    multiple
                    onChange={e => {
                      const files = Array.from(e.target.files);
                      setFieldValue("imageList", [...(values.imageList || []), ...files]);
                    }}
                  />
                  {/* Edit zamanı mövcud şəkillər göstərilsin və silmək imkanı olsun */}
                  {editImageList.length > 0 && values.imageList.filter(f => typeof f !== 'string').length === 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {editImageList.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img src={img} alt="img" className="w-16 h-16 object-contain rounded border" />
                          <button
                            type="button"
                            className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 opacity-80 hover:opacity-100 group-hover:scale-110 transition"
                            onClick={() => setEditImageList(editImageList.filter((_, i) => i !== idx))}
                            title={t('common.delete')}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Yeni seçilmiş şəkillər */}
                  {values.imageList && values.imageList.length > 0 && values.imageList.filter(f => typeof f !== 'string').length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {values.imageList.map((file, idx) => (
                        typeof file === 'string' ? null : (
                          <div key={idx} className="relative group">
                            <img src={URL.createObjectURL(file)} alt="preview" className="w-16 h-16 object-contain rounded border" />
                            <button
                              type="button"
                              className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 opacity-80 hover:opacity-100 group-hover:scale-110 transition"
                              onClick={() => {
                                setFieldValue("imageList", values.imageList.filter((_, i) => i !== idx));
                              }}
                              title={t('common.delete')}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="galleryCategoryId" className="mb-2 block">{t('galleryCategory.title')}</Label>
                <Select
                  value={values.galleryCategoryId}
                  onValueChange={v => setFieldValue("galleryCategoryId", v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('gallery.selectCategory')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryList.map(cat => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.title?.[i18n.language] || cat.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ErrorMessage name="galleryCategoryId" component="div" className="text-red-500 text-xs mt-1" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => { setShowCreate(false); setEditItem(null); }} 
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
                    ? (editItem ? t('common.updating') : t('common.creating')) 
                    : (editItem ? t('common.save') : t('common.add'))
                  }
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
} 