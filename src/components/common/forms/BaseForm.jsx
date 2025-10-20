import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const BaseForm = ({
  isOpen,
  onClose,
  editData,
  onSubmit,
  isSubmitting,
  titleKey,
  children,
  initialValues,
  validationSchema,
  maxWidth = "max-w-2xl",
}) => {
  const { t } = useTranslation();

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    console.log('BaseForm - handleSubmit called with values:', values);
    onSubmit(values, { setSubmitting, resetForm });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${maxWidth} w-full rounded-2xl shadow-2xl bg-card dark:bg-[#232323] p-0 border-0 max-h-[90vh] overflow-hidden flex flex-col`}>
        <DialogHeader className="mb-4 px-8 pt-8">
          <DialogTitle className="text-xl font-bold text-foreground">
            {editData ? t(`${titleKey}.edit`) : t(`${titleKey}.add`)}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-8">
          <Formik
            enableReinitialize
            initialValues={initialValues || {}}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            validateOnChange={false}
            validateOnBlur={false}
          >
            {({ isSubmitting: formSubmitting, values, setFieldValue, errors, touched, handleSubmit }) => {
              console.log('BaseForm - Formik render - values:', values);
              console.log('BaseForm - Formik render - errors:', errors);
              console.log('BaseForm - Formik render - touched:', touched);
              
              // Ensure values is not undefined
              const safeValues = values || {};
              
              return (
                <>
                  <Form className="space-y-6">
                    {children({ isSubmitting: formSubmitting, values: safeValues, setFieldValue, errors, touched })}
                    
                    {/* Hidden submit button for form validation */}
                    <button type="submit" style={{ display: 'none' }} />
                  </Form>
                  
                  {/* Submit button outside form */}
                  <div className="flex justify-end gap-2 pt-4 border-t mt-4 px-8 pb-8">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      disabled={isSubmitting}
                    >
                      {t("common.cancel")}
                    </Button>
                    <Button
                      type="button"
                      className="bg-[rgb(var(--primary-brand))] text-black font-semibold hover:bg-[rgb(var(--primary-brand-hover))]"
                      disabled={isSubmitting}
                      onClick={() => {
                        console.log('BaseForm - Submit button clicked');
                        handleSubmit(); // Formik's handleSubmit
                      }}
                    >
                      {isSubmitting
                        ? editData
                          ? t(`${titleKey}.updating`)
                          : t(`${titleKey}.creating`)
                        : editData
                        ? t("common.save")
                        : t("common.add")}
                    </Button>
                  </div>
                </>
              );
            }}
          </Formik>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BaseForm;
