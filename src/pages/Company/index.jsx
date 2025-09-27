import * as React from "react";
import { useState, useMemo } from "react";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useGet } from "@/utils/hooks/useCustomQuery";
import { usePost, useUpdate, useDelete } from "@/utils/hooks/useCustomMutation";
import { ENDPOINTS } from "@/utils/constants/Endpoints";

// Import components from new location
import CompanyForm from "@/components/Company/CompanyForm";
import CompanyViewModal from "@/components/Company/CompanyViewModal";
import CompanyDeleteModal from "@/components/Company/CompanyDeleteModal";
import CompanyTable from "@/components/Company/CompanyTable";

export default function Company() {
  const { t } = useTranslation();
  
  // State management
  const [showCreate, setShowCreate] = useState(false);
  const [editCompany, setEditCompany] = useState(null);
  const [viewCompany, setViewCompany] = useState(null);
  const [deleteCompany, setDeleteCompany] = useState(null);

  // API hooks
  const {
    data: companyList = [],
    isLoading,
    refetch,
  } = useGet("company", `${ENDPOINTS.company}?allLanguages=true`);
  
  const createCompany = usePost("company", ENDPOINTS.company);
  const updateCompany = useUpdate("company", ENDPOINTS.company, editCompany?.id);
  const deleteCompanyMutation = useDelete("company", ENDPOINTS.company, deleteCompany?.id);
  
  const { data: categoryList = [] } = useGet("categories", ENDPOINTS.categories);

  // Process table data
  const tableData = useMemo(() => {
    let rawData = [];

    if (Array.isArray(companyList)) {
      rawData = companyList;
    } else if (companyList && typeof companyList === "object" && Array.isArray(companyList.data)) {
      rawData = companyList.data;
    } else if (companyList && typeof companyList === "object" && Array.isArray(companyList.items)) {
      rawData = companyList.items;
    }

    return rawData.map((item) => {
      // Extract title text for search
      let titleText = "";
      if (typeof item.title === "object" && item.title !== null) {
        titleText = Object.values(item.title).filter(Boolean).join(" ");
      } else if (typeof item.title === "string") {
        titleText = item.title;
      }

      // Extract description text for search
      let descriptionText = "";
      if (typeof item.description === "object" && item.description !== null) {
        descriptionText = Object.values(item.description).filter(Boolean).join(" ");
      } else if (typeof item.description === "string") {
        descriptionText = item.description;
      }

      // Extract categories text for search
      let categoriesText = "";
      if (Array.isArray(item.categories)) {
        categoriesText = item.categories
          .map((cat) => {
            if (typeof cat.title === "object" && cat.title !== null) {
              return Object.values(cat.title).filter(Boolean).join(" ");
            } else if (typeof cat.title === "string") {
              return cat.title;
            }
            return "";
          })
          .filter(Boolean)
          .join(" ");
      }

      return {
        ...item,
        searchableText: [titleText, descriptionText, categoriesText]
          .filter(Boolean)
          .join(" ")
          .toLowerCase(),
      };
    });
  }, [companyList]);

  // Event handlers
  const handleEdit = (company) => {
    setEditCompany(company);
    setShowCreate(true);
  };

  const handleFormSubmit = (formData, { setSubmitting, resetForm }) => {
    if (editCompany) {
      updateCompany.mutate(formData, {
        onSuccess: () => {
          toast.success(t('companies.companyUpdated'));
          setShowCreate(false);
          setEditCompany(null);
          resetForm();
          refetch();
        },
        onError: (error) => {
          toast.error(error?.message || t('errors.generalError'));
        },
        onSettled: () => setSubmitting(false),
      });
    } else {
      createCompany.mutate(formData, {
        onSuccess: () => {
          toast.success(t('companies.companyAdded'));
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
  };

  const handleDeleteConfirm = () => {
    if (!deleteCompany || !deleteCompany.id) return;
    
    deleteCompanyMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success(t('companies.companyDeleted'));
        setDeleteCompany(null);
        refetch();
      },
      onError: (error) => {
        toast.error(error?.message || t('errors.generalError'));
      },
    });
  };

  const handleFormClose = () => {
    setShowCreate(false);
    setEditCompany(null);
  };

  return (
    <div className="w-full mx-auto py-10 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">{t('companies.title')}</h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setShowCreate(true);
              setEditCompany(null);
            }}
            className="bg-[rgb(var(--primary-brand))] text-black font-semibold hover:bg-[rgb(var(--primary-brand-hover))]"
          >
            {t('companies.addCompany')}
          </Button>
        </div>
      </div>

      {/* Company Form Modal */}
      <CompanyForm
        isOpen={showCreate}
        onClose={handleFormClose}
        editCompany={editCompany}
        onSubmit={handleFormSubmit}
        isSubmitting={createCompany.isPending || updateCompany.isPending}
        categoryList={categoryList}
      />

      {/* Delete Confirmation Modal */}
      <CompanyDeleteModal
        company={deleteCompany}
        isOpen={!!deleteCompany}
        onClose={() => setDeleteCompany(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteCompanyMutation.isPending}
      />

      {/* View Company Modal */}
      <CompanyViewModal
        company={viewCompany}
        isOpen={!!viewCompany}
        onClose={() => setViewCompany(null)}
      />

      {/* Company Table */}
      <CompanyTable
        data={tableData}
        onView={setViewCompany}
        onEdit={handleEdit}
        onDelete={setDeleteCompany}
      />

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          classNames: {
            success: "!bg-green-500 !text-white",
            error: "!bg-red-500 !text-white",
          },
        }}
      />
    </div>
  );
}
