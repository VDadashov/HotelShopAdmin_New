import * as React from "react";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useGet } from "@/utils/hooks/useCustomQuery";
import { usePost, useUpdate, useDelete } from "@/utils/hooks/useCustomMutation";
import { ENDPOINTS } from "@/utils/constants/Endpoints";

// Import components
import PageForm from "@/components/Pages/PageForm";
import PageViewModal from "@/components/Pages/PageViewModal";
import PageDeleteModal from "@/components/Pages/PageDeleteModal";
import PageTable from "@/components/Pages/PageTable";

export default function Page() {
  const { t } = useTranslation();

  const [showCreate, setShowCreate] = useState(false);
  const [editPage, seteditPage] = useState(null);
  const [deletePage, setdeletePage] = useState(null);
  const [viewPage, setviewPage] = useState(null);

  const { data: pageList = [] } = useGet(
    "pages",
    `${ENDPOINTS.pages}?allLanguages=true`
  );
  const createPage = usePost("pages", ENDPOINTS.pages);
  const updatePage = useUpdate("pages", ENDPOINTS.pages, editPage?.id);
  const deletePageMutation = useDelete(
    "pages",
    ENDPOINTS.pages,
    deletePage?.id
  );

  const tableData = useMemo(() => {
    let rawData = Array.isArray(pageList)
      ? pageList
      : Array.isArray(pageList?.data)
      ? pageList.data
      : [];
    return rawData.map((item) => ({
      ...item,
      searchableTitle: item.title ? Object.values(item.title).join(" ") : "",
      searchText: item.title
        ? Object.values(item.title).join(" ").toLowerCase()
        : "",
    }));
  }, [pageList]);

  // Edit üçün açılan modalı idarə et
  const handleEdit = (page) => {
    seteditPage(page);
    setShowCreate(true);
  };

  const handleFormSubmit = (values, { setSubmitting, resetForm }) => {
    if (editPage) {
      updatePage.mutate(values, {
        onSuccess: () => {
          toast.success(t("page.pageUpdated"));
          setShowCreate(false);
          seteditPage(null);
          resetForm();
        },
        onError: (error) => {
          toast.error(error?.message || t("common.error"));
        },
        onSettled: () => setSubmitting(false),
      });
    } else {
      createPage.mutate(values, {
        onSuccess: () => {
          toast.success(t("page.pageAdded"));
          setShowCreate(false);
          resetForm();
        },
        onError: (error) => {
          toast.error(error?.message || t("common.error"));
        },
        onSettled: () => setSubmitting(false),
      });
    }
  };

  const handleDelete = () => {
    if (!deletePage || !deletePage.id) return;
    deletePageMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success(t("page.pageDeleted"));
        setdeletePage(null);
      },
      onError: (error) => {
        toast.error(error?.message || t("common.error"));
      },
    });
  };

  return (
    <div className="w-full mx-auto py-10 px-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">{t("page.title")}</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            onClick={() => {
              setShowCreate(true);
              seteditPage(null);
            }}
            className="bg-[rgb(var(--primary-brand))] text-black font-semibold hover:bg-[rgb(var(--primary-brand-hover))] w-full sm:w-auto"
          >
            {t("page.addPage")}
          </Button>
        </div>
      </div>

      <PageForm
        isOpen={showCreate}
        onClose={() => {
          setShowCreate(false);
          seteditPage(null);
        }}
        editPage={editPage}
        onSubmit={handleFormSubmit}
        isSubmitting={createPage.isPending || updatePage.isPending}
      />

      {/* Page View Modal */}
      <PageViewModal
        page={viewPage}
        isOpen={!!viewPage}
        onClose={() => setviewPage(null)}
      />

      {/* Page Delete Modal */}
      <PageDeleteModal
        page={deletePage}
        isOpen={!!deletePage}
        onClose={() => setdeletePage(null)}
        onConfirm={handleDelete}
        isDeleting={deletePageMutation.isPending}
      />

      {/* Page Table */}
      <PageTable
        data={tableData}
        onView={setviewPage}
        onEdit={handleEdit}
        onDelete={setdeletePage}
      />

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
