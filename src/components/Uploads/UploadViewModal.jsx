import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseViewModal from "@/components/common/modals/BaseViewModal";
import { FileText, Image, Video, Calendar, ExternalLink } from "lucide-react";
import Badge from '@/components/ui/badge';

const UploadViewModal = ({ 
  upload, 
  isOpen, 
  onClose 
}) => {
  const { t, i18n } = useTranslation();

  if (!upload) return null;

  const fileUrl = upload.url || upload.media?.url;
  const publicId = upload.publicId || upload.id || upload.media?.publicId;
  const createdAt = upload.createdAt || upload.media?.createdAt;
  const updatedAt = upload.updatedAt || upload.media?.updatedAt;

  const getFileType = (url) => {
    if (!url) return 'unknown';
    const extension = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
      return 'image';
    } else if (['mp4', 'webm', 'ogg', 'mov'].includes(extension)) {
      return 'video';
    } else if (['pdf'].includes(extension)) {
      return 'pdf';
    }
    return 'unknown';
  };

  const fileType = getFileType(fileUrl);

  return (
    <BaseViewModal
      data={upload}
      isOpen={isOpen}
      onClose={onClose}
      titleKey="upload"
      maxWidth="max-w-4xl"
    >
      {/* Header with File Type */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          {fileType === 'image' && <Image size={24} className="text-blue-500" />}
          {fileType === 'video' && <Video size={24} className="text-red-500" />}
          {fileType === 'pdf' && <FileText size={24} className="text-red-600" />}
          {fileType === 'unknown' && <FileText size={24} className="text-gray-500" />}
          {t('upload.fileDetails')}
        </h2>
        <Badge variant="outline" className="text-sm">
          {fileType === 'image' && t('upload.image')}
          {fileType === 'video' && t('upload.video')}
          {fileType === 'pdf' && t('upload.pdf')}
          {fileType === 'unknown' && t('upload.unknown')}
        </Badge>
      </div>

      {/* File URL */}
      <div className="border-t pt-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ExternalLink size={20} className="text-primary" />
          {t('upload.fileUrl')}
        </h3>
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <a 
            href={fileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline break-all"
          >
            {fileUrl || "-"}
          </a>
        </div>
      </div>

      {/* File Preview */}
      {fileType === 'image' && fileUrl && (
        <div className="border-t pt-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">{t('upload.preview')}</h3>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <img 
              src={fileUrl} 
              alt={t('upload.preview')}
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}

      {fileType === 'video' && fileUrl && (
        <div className="border-t pt-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">{t('upload.preview')}</h3>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <video 
              src={fileUrl} 
              controls
              className="max-w-full h-auto rounded-lg"
            >
              {t('upload.videoNotSupported')}
            </video>
          </div>
        </div>
      )}

      {/* File Information */}
      <div className="border-t pt-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText size={20} className="text-primary" />
          {t('upload.fileInformation')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Public ID */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              {t('upload.publicId')}
            </div>
            <div className="font-medium text-foreground break-all">
              {publicId || "-"}
            </div>
          </div>

          {/* File Type */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              {t('upload.type')}
            </div>
            <div className="font-medium text-foreground">
              {fileType === 'image' && t('upload.image')}
              {fileType === 'video' && t('upload.video')}
              {fileType === 'pdf' && t('upload.pdf')}
              {fileType === 'unknown' && t('upload.unknown')}
            </div>
          </div>
        </div>
      </div>

      {/* Timestamps */}
      <div className="border-t pt-6 text-xs text-gray-500 dark:text-gray-400 space-y-2">
        {createdAt && (
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <span>
              {t('common.createdAt')}:{" "}
              {new Date(createdAt).toLocaleString(i18n.language)}
            </span>
          </div>
        )}
        {updatedAt && (
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <span>
              {t('common.updatedAt')}:{" "}
              {new Date(updatedAt).toLocaleString(i18n.language)}
            </span>
          </div>
        )}
      </div>
    </BaseViewModal>
  );
};

export default UploadViewModal;

