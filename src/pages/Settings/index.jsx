import * as React from "react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Eye, Pencil, Trash, Copy, Image } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { DataTable } from "@/components/ui/DataTable";
import { useGet } from "@/utils/hooks/useCustomQuery";
import { useUpdate, useDelete } from "@/utils/hooks/useCustomMutation";
import { ENDPOINTS } from "@/utils/constants/Endpoints";
import { useTranslation } from "react-i18next";

function isImageKey(key) {
  return key.toLowerCase().includes("icon") || key.toLowerCase().includes("image");
}

function getImageUrl(row) {
  for (const key of Object.keys(row)) {
    if (isImageKey(key) && row[key]) return row[key];
  }
  return null;
}

export const Settings = () => {
  const { t } = useTranslation();
  const [showEdit, setShowEdit] = useState(false);
  const [editSettings, setEditSettings] = useState(null);
  const [viewSettings, setViewSettings] = useState(null);
  const [deleteSettings, setDeleteSettings] = useState(null);

  // API hooks
  const { data: settingsList = [], isLoading, refetch } = useGet("settings", ENDPOINTS.settings);
  const updateSetting = useUpdate("settings", ENDPOINTS.settings, editSettings?.id);
  const deleteSettingsMutation = useDelete("settings", ENDPOINTS.settings, deleteSettings?.id);

  // Only two columns: Key and Value
  const columns = [
    {
      accessorKey: 'key',
      header: t('settings.key'),
      cell: ({ row }) => row.original.key,
    },
    {
      accessorKey: 'value',
      header: t('settings.value'),
      cell: ({ row }) => {
        const { key, value } = row.original;
        if (isImageKey(key) && value) {
          return <img src={value} alt={key} className="w-10 h-10 object-cover rounded-md border" />;
        }
        return value || '-';
      },
    },
    {
      id: 'actions',
      header: t('common.actions'),
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">{t('settings.openMenu')}</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t('common.actions')}</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.key)}
              className="text-blue-600 hover:bg-blue-50 focus:bg-blue-100 dark:hover:bg-blue-900 dark:hover:text-blue-200">
              <Copy className="w-4 h-4 mr-2 text-blue-600" /> {t('settings.copyKey')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setViewSettings(row.original)}
              className="text-green-600 hover:bg-green-50 focus:bg-green-100 dark:hover:bg-green-900 dark:hover:text-green-200">
              <Eye className="w-4 h-4 mr-2 text-green-600" /> {t('common.view')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setEditSettings(row.original); setShowEdit(true); }}
              className="text-yellow-600 hover:bg-yellow-50 focus:bg-yellow-100 dark:hover:bg-yellow-900 dark:hover:text-yellow-200">
              <Pencil className="w-4 h-4 mr-2 text-yellow-600" /> {t('common.edit')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];

  // View Modal: show key and value
  const renderViewFields = (row) => {
    const { key, value } = row;
    if (isImageKey(key) && value) {
      return (
        <div className="mb-4">
          <span className="font-medium text-sm text-gray-600">{key}:</span>
          <div className="mt-1"><img src={value} alt={key} className="w-20 h-20 object-cover rounded-md border" /></div>
        </div>
      );
    }
    return (
      <div className="mb-2">
        <span className="font-medium text-sm text-gray-600">{key}:</span>
        <span className="ml-2 text-foreground">{value || t('settings.notSet')}</span>
      </div>
    );
  };

  // Edit Modal: show only the selected key
  const getInitialValues = () => {
    if (editSettings) {
      const vals = { value: editSettings.value };
      if (isImageKey(editSettings.key)) {
        vals.valuePreview = editSettings.value || null;
      }
      return vals;
    }
    return { value: '' };
  };

  const getValidationSchema = () => {
    if (!editSettings) return Yup.object({ value: Yup.string() });
    if (isImageKey(editSettings.key)) return Yup.object({});
    return Yup.object({ value: Yup.string() });
  };

  const renderFormFields = (values, setFieldValue) => {
    if (!editSettings) return null;
    const key = editSettings.key;
    if (isImageKey(key)) {
      return (
        <div>
          <Label htmlFor="value" className="mb-2 block">{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
          <Input
            id="value"
            name="value"
            type="file"
            accept="image/*"
            onChange={e => {
              const file = e.target.files[0];
              setFieldValue('value', file);
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setFieldValue('valuePreview', reader.result);
                reader.readAsDataURL(file);
              } else {
                setFieldValue('valuePreview', null);
              }
            }}
          />
          {values.valuePreview && (
            <div className="mt-2 flex items-center gap-2">
              <img src={values.valuePreview} alt="Preview" className="w-16 h-16 object-cover rounded-md border" />
              <button
                type="button"
                className="ml-2 p-1 rounded-full bg-gray-200 hover:bg-red-200 text-gray-700 hover:text-red-600 transition"
                onClick={() => {
                  setFieldValue('value', null);
                  setFieldValue('valuePreview', null);
                }}
                title={t('settings.removeImage')}
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      );
    }
    return (
      <div>
        <Label htmlFor="value" className="mb-2 block">{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
        <Field as={Input} name="value" id="value" placeholder={key} />
        <ErrorMessage name="value" component="div" className="text-red-500 text-xs mt-1" />
      </div>
    );
  };

  const handleDelete = (settings) => setDeleteSettings(settings);
  const confirmDelete = () => {
    if (!deleteSettings) return;
    deleteSettingsMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success(t('settings.deleted'));
        setDeleteSettings(null);
        refetch();
      },
      onError: (error) => {
        toast.error(error?.message || t('errors.generalError'));
      },
    });
  };

  return (
    <div className="w-full mx-auto py-10 px-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">{t('settings.title')}</h1>
      </div>
      <Dialog open={!!viewSettings} onOpenChange={v => { if (!v) setViewSettings(null); }}>
        <DialogContent className="max-w-2xl w-full rounded-2xl shadow-2xl bg-card dark:bg-[#232323] p-8 border-0">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold text-foreground">{t('settings.details')}</DialogTitle>
          </DialogHeader>
          {viewSettings && (
            <div className="space-y-4">
              {renderViewFields(viewSettings)}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={showEdit} onOpenChange={v => { setShowEdit(v); if (!v) setEditSettings(null); }}>
        <DialogContent className="max-w-2xl w-full rounded-2xl shadow-2xl bg-card dark:bg-[#232323] p-8 border-0">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold text-foreground">{t('settings.edit')}</DialogTitle>
          </DialogHeader>
          <Formik
            enableReinitialize
            initialValues={getInitialValues()}
            validationSchema={getValidationSchema()}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              const formData = new FormData();
              formData.append('key', editSettings.key);
              formData.append('id', editSettings.id);
              formData.append('value', values.value);
              updateSetting.mutate(formData, {
                onSuccess: () => {
                  toast.success(t('settings.updated'));
                  setShowEdit(false);
                  setEditSettings(null);
                  resetForm();
                  refetch();
                },
                onError: (error) => {
                  toast.error(error?.message || t('errors.generalError'));
                },
                onSettled: () => {
                  setSubmitting(false);
                },
              });
            }}
          >
            {({ isSubmitting, setFieldValue, values }) => (
              <Form className="space-y-6">
                {renderFormFields(values, setFieldValue)}
                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => { setShowEdit(false); setEditSettings(null); }} 
                    disabled={isSubmitting}
                    className="border-[rgb(var(--primary-brand))] text-black"
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-[rgb(var(--primary-brand))] text-black font-semibold hover:bg-[rgb(var(--primary-brand-hover))]" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t('common.saving') : t('common.save')}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
      <DataTable
        columns={columns}
        data={settingsList}
        filterKey="key"
        filterPlaceholder={t('settings.searchPlaceholder')}
        tableClassName="min-w-full divide-y divide-gray-200"
        headerClassName="bg-gray-100 text-gray-700"
      />
      <Toaster
        position="top-right"
        toastOptions={{
          classNames: {
            success: "!bg-green-500 !text-white",
            error: "!bg-red-500 !text-white"
          },
          duration: 1500
        }}
      />
    </div>
  );
};
