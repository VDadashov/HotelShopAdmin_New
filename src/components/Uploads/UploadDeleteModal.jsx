import * as React from "react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/api/axiosInstance";
import { ENDPOINTS } from "@/utils/constants/Endpoints";
import { toast } from "sonner";

export default function UploadDeleteModal({ 
  deleteUpload, 
  setDeleteUpload,
  refetch 
}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  // Get publicId and resourceType from upload data
  const getPublicId = () => {
    return deleteUpload?.publicId || deleteUpload?.id || deleteUpload?.media?.publicId;
  };

  const getResourceType = () => {
    if (!deleteUpload) return "image";
    const url = deleteUpload?.url || deleteUpload?.media?.url;
    if (!url) return "image";
    
    const extension = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
      return "image";
    } else if (['mp4', 'webm', 'ogg', 'mov'].includes(extension)) {
      return "video";
    } else if (['pdf'].includes(extension)) {
      return "raw";
    }
    return "image";
  };

  const deleteUploadMutation = useMutation({
    mutationFn: async () => {
      const publicId = getPublicId();
      const resourceType = getResourceType();
      
      if (!publicId) {
        throw new Error(t('upload.publicIdRequired'));
      }

      const response = await axiosInstance.delete(ENDPOINTS.upload, {
        data: {
          publicId,
          resourceType
        }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["uploads"]);
      toast.success(t('upload.fileDeleted'));
      setDeleteUpload(null);
      refetch();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error?.message || t('errors.generalError'));
    },
    onSettled: () => {
      setIsDeleting(false);
    }
  });

  const confirmDelete = () => {
    if (!deleteUpload) return;
    setIsDeleting(true);
    deleteUploadMutation.mutate();
  };

  return (
    <Dialog open={!!deleteUpload} onOpenChange={v => { if (!v) setDeleteUpload(null); }}>
      <DialogContent className="max-w-sm w-full rounded-2xl shadow-2xl bg-card dark:bg-[#232323] p-8 border-0">
        <DialogHeader>
          <DialogTitle>{t('upload.deleteFile')}</DialogTitle>
        </DialogHeader>
        <div>{t('upload.deleteConfirmation')}</div>
        <DialogFooter className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setDeleteUpload(null)}>
            {t('common.cancel')}
          </Button>
          <Button 
            className="bg-red-600 text-white hover:bg-red-700" 
            onClick={confirmDelete}
            disabled={isDeleting || deleteUploadMutation.isPending}
          >
            {(isDeleting || deleteUploadMutation.isPending) ? t('common.deleting') : t('common.delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

