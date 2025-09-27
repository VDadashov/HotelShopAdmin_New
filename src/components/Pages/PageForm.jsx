import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PageForm = ({ isOpen, onClose, editPage, onSubmit, isSubmitting }) => {
  const { t } = useTranslation();

  const initialValues = editPage
    ? {
        ...editPage,
      }
    : {
        title: { az: "", en: "", ru: "" },
        isActive: true,
      };

  const validationSchema = Yup.object({
    title: Yup.object({
      az: Yup.string().required(t("page.validation.titleAzRequired")),
      en: Yup.string().required(t("page.validation.titleEnRequired")),
      ru: Yup.string().required(t("page.validation.titleRuRequired")),
    }),
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const cleanValues = {
      title: values.title,
      isActive: values.isActive !== undefined ? values.isActive : true,
    };
    onSubmit(cleanValues, { setSubmitting, resetForm });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full rounded-2xl shadow-2xl bg-card dark:bg-[#232323] p-8 border-0">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-foreground">
            {editPage ? t("page.editPage") : t("page.addPage")}
          </DialogTitle>
        </DialogHeader>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="title.az" className="mb-2 block">
                    {t("page.pageTitle")} (az)
                  </Label>
                  <Field
                    as={Input}
                    name="title.az"
                    id="title.az"
                    placeholder={t("page.pageTitlePlaceholder")}
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
                    {t("page.pageTitle")} (en)
                  </Label>
                  <Field
                    as={Input}
                    name="title.en"
                    id="title.en"
                    placeholder={t("page.pageTitlePlaceholder")}
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
                    {t("page.pageTitle")} (ru)
                  </Label>
                  <Field
                    as={Input}
                    name="title.ru"
                    id="title.ru"
                    placeholder={t("page.pageTitlePlaceholder")}
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

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  type="submit"
                  className="bg-[rgb(var(--primary-brand))] text-black font-semibold hover:bg-[rgb(var(--primary-brand-hover))]"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? editPage
                      ? t("page.updating")
                      : t("page.creating")
                    : editPage
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

export default PageForm;
