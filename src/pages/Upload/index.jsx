import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { useTranslation } from "react-i18next";
import { useGet } from "@/utils/hooks/useCustomQuery";
import { ENDPOINTS } from "@/utils/constants/Endpoints";
import { Button } from "@/components/ui/button";

// Import components
import UploadViewModal from "@/components/Uploads/UploadViewModal";
import UploadDeleteModal from "@/components/Uploads/UploadDeleteModal";
import UploadTable from "@/components/Uploads/UploadTable";
import UploadForm from "@/components/Uploads/UploadForm";

export default function Upload() {
  const { t } = useTranslation();
  const [viewUpload, setViewUpload] = useState(null);
  const [deleteUpload, setDeleteUpload] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [filters, setFilters] = useState({
    resourceType: "image", // default: image
  });
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10
  });

  // API URL with query parameters
  const apiUrl = useMemo(() => {
    const params = new URLSearchParams();
    
    if (filters.resourceType) {
      params.append('resourceType', filters.resourceType);
    }
    
    params.append('page', pagination.currentPage);
    params.append('pageSize', pagination.limit);
    
    return `${ENDPOINTS.upload}?${params.toString()}`;
  }, [filters, pagination]);

  // API hooks
  const { data: uploadResponse, isLoading, refetch } = useGet("uploads", apiUrl);

  // Update pagination when API response changes
  useEffect(() => {
    if (uploadResponse?.pagination) {
      setPagination({
        total: uploadResponse.pagination.totalItems || 0,
        totalPages: uploadResponse.pagination.totalPages || 1,
        currentPage: uploadResponse.pagination.page || 1,
        limit: uploadResponse.pagination.limit || 10
      });
    }
  }, [uploadResponse]);

  // Extract data from response
  const uploadList = useMemo(() => {
    return uploadResponse?.data || uploadResponse || [];
  }, [uploadResponse]);

  return (
    <div className="w-full mx-auto py-10 px-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">{t('upload.title')}</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            onClick={() => setShowUploadForm(true)}
            className="bg-[rgb(var(--primary-brand))] text-black font-semibold hover:bg-[rgb(var(--primary-brand-hover))] w-full sm:w-auto"
          >
            {t('upload.uploadFile')}
          </Button>
        </div>
      </div>

      {/* Upload Form Modal */}
      <UploadForm
        isOpen={showUploadForm}
        onClose={() => setShowUploadForm(false)}
        onSuccess={() => {
          refetch();
        }}
      />

      {/* View Modal */}
      <UploadViewModal
        upload={viewUpload}
        isOpen={!!viewUpload}
        onClose={() => setViewUpload(null)}
      />

      {/* Delete Modal */}
      <UploadDeleteModal
        deleteUpload={deleteUpload}
        setDeleteUpload={setDeleteUpload}
        refetch={refetch}
      />

      {/* Table */}
      <UploadTable
        uploadList={uploadList}
        setViewUpload={setViewUpload}
        setDeleteUpload={setDeleteUpload}
        refetch={refetch}
        filters={filters}
        onFiltersChange={(newFilters) => setFilters(newFilters)}
        pagination={pagination}
        onPaginationChange={setPagination}
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
}

