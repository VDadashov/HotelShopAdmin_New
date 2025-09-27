import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { usePost, useUpdate } from "@/utils/hooks/useCustomMutation";
import { ENDPOINTS } from "@/utils/constants/Endpoints";
import { toast } from "sonner";

export default function GalleryCategoryForm({ 
  showCreate, 
  setShowCreate, 
  editGalleryCategory, 
  setEditGalleryCategory,
  refetch 
}) {
  const { t } = useTranslation();

  // API hooks
  const createGalleryCategory = usePost("galleryCategory", ENDPOINTS.galleryCategory);
  const updateGalleryCategory = useUpdate("galleryCategory", ENDPOINTS.galleryCategory, editGalleryCategory?.id);

  // Edit və Create üçün eyni form, initialValues fərqli olacaq
  const initialValues = editGalleryCategory ? {
    ...editGalleryCategory,
  } : {
    title: { az: "", en: "", ru: "" },
  };

  return (
    <Dialog open={showCreate} onOpenChange={v => { setShowCreate(v); if (!v) setEditGalleryCategory(null); }}>
      <DialogContent className="max-w-lg w-full rounded-2xl shadow-2xl bg-card dark:bg-[#232323] p-8 border-0">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-foreground">
            {editGalleryCategory ? t('galleryCategory.editCategory') : t('galleryCategory.addCategory')}
          </DialogTitle>
        </DialogHeader>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={Yup.object({
            title: Yup.object({
              az: Yup.string().required(t('galleryCategory.validation.titleAzRequired')),
              en: Yup.string().required(t('galleryCategory.validation.titleEnRequired')),
              ru: Yup.string().required(t('galleryCategory.validation.titleRuRequired')),
            }),
          })}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            const cleanValues = { title: values.title };
            if (editGalleryCategory) {
              updateGalleryCategory.mutate(cleanValues, {
                onSuccess: () => {
                  toast.success(t('galleryCategory.categoryUpdated'));
                  setShowCreate(false);
                  setEditGalleryCategory(null);
                  resetForm();
                  refetch();
                },
                onError: (error) => {
                  toast.error(error?.message || t('errors.generalError'));
                },
                onSettled: () => setSubmitting(false),
              });
            } else {
              createGalleryCategory.mutate(cleanValues, {
                onSuccess: () => {
                  toast.success(t('galleryCategory.categoryAdded'));
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
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="title.az" className="mb-2 block">{t('galleryCategory.categoryName')} (az)</Label>
                  <Field 
                    as={Input} 
                    name="title.az" 
                    id="title.az" 
                    placeholder={t('galleryCategory.categoryNamePlaceholder')} 
                    className="mb-2" 
                    required 
                  />
                  <ErrorMessage name="title.az" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div>
                  <Label htmlFor="title.en" className="mb-2 block">{t('galleryCategory.categoryName')} (en)</Label>
                  <Field 
                    as={Input} 
                    name="title.en" 
                    id="title.en" 
                    placeholder={t('galleryCategory.categoryNamePlaceholder')} 
                    className="mb-2" 
                    required 
                  />
                  <ErrorMessage name="title.en" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div>
                  <Label htmlFor="title.ru" className="mb-2 block">{t('galleryCategory.categoryName')} (ru)</Label>
                  <Field 
                    as={Input} 
                    name="title.ru" 
                    id="title.ru" 
                    placeholder={t('galleryCategory.categoryNamePlaceholder')} 
                    className="mb-2" 
                    required 
                  />
                  <ErrorMessage name="title.ru" component="div" className="text-red-500 text-xs mt-1" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => { setShowCreate(false); setEditGalleryCategory(null); }} 
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
                    ? (editGalleryCategory ? t('common.updating') : t('common.creating')) 
                    : (editGalleryCategory ? t('common.save') : t('common.add'))
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