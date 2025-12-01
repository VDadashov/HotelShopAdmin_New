import * as React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Image, FileText, Video, X } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/utils/api/axiosInstance";
import { ENDPOINTS } from "@/utils/constants/Endpoints";

export default function UploadForm({ isOpen, onClose, onSuccess, fileTypeOnly = null, embedded = false }) {
  const { t } = useTranslation();
  const [fileType, setFileType] = useState(fileTypeOnly || "image"); // image, pdf, video
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  // Update fileType when fileTypeOnly changes
  React.useEffect(() => {
    if (fileTypeOnly) {
      setFileType(fileTypeOnly);
    }
  }, [fileTypeOnly]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    // Preview for images
    if (fileType === "image" && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error(t('upload.selectFileFirst'));
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      let endpoint;
      if (fileType === "image") {
        endpoint = ENDPOINTS.uploadImage;
      } else if (fileType === "pdf") {
        endpoint = ENDPOINTS.uploadPdf;
      } else if (fileType === "video") {
        endpoint = ENDPOINTS.uploadVideo;
      } else {
        throw new Error(t('upload.invalidFileType'));
      }

      const response = await axiosInstance.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        toast.success(t('upload.fileUploaded'));
        setSelectedFile(null);
        setPreview(null);
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || t('upload.uploadError'));
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setSelectedFile(null);
      setPreview(null);
      setFileType("image");
      onClose();
    }
  };

  const getAcceptTypes = () => {
    if (fileType === "image") return "image/*";
    if (fileType === "pdf") return "application/pdf";
    if (fileType === "video") return "video/*";
    return "*/*";
  };

  const content = (
    <>
      {!embedded && (
        <DialogHeader>
          <DialogTitle>{t('upload.uploadFile')}</DialogTitle>
        </DialogHeader>
      )}

      <div className="space-y-6 py-4">
          {/* File Type Selection - Only show if fileTypeOnly is not set */}
          {!fileTypeOnly && (
            <div className="space-y-2">
              <Label htmlFor="file-type">{t('upload.selectFileType')}</Label>
              <Select value={fileType} onValueChange={(value) => {
                setFileType(value);
                setSelectedFile(null);
                setPreview(null);
              }}>
                <SelectTrigger id="file-type">
                  <SelectValue placeholder={t('upload.selectFileType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">
                    <div className="flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      {t('upload.image')}
                    </div>
                  </SelectItem>
                  <SelectItem value="pdf">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {t('upload.pdf')}
                    </div>
                  </SelectItem>
                  <SelectItem value="video">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      {t('upload.video')}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* File Input */}
          <div className="space-y-2">
            <Label htmlFor="file-upload">
              {fileType === "image" && t('upload.selectImage')}
              {fileType === "pdf" && t('upload.selectPdf')}
              {fileType === "video" && t('upload.selectVideo')}
            </Label>
            <div className="flex flex-col gap-4">
              <input
                type="file"
                id="file-upload"
                accept={getAcceptTypes()}
                onChange={handleFileSelect}
                disabled={uploading}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {fileType === "image" && <Image className="w-10 h-10 mb-3 text-gray-400" />}
                  {fileType === "pdf" && <FileText className="w-10 h-10 mb-3 text-gray-400" />}
                  {fileType === "video" && <Video className="w-10 h-10 mb-3 text-gray-400" />}
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">{t('upload.clickToUpload')}</span> {t('upload.orDragAndDrop')}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {fileType === "image" && "PNG, JPG, GIF, WEBP"}
                    {fileType === "pdf" && "PDF"}
                    {fileType === "video" && "MP4, WEBM, MOV"}
                  </p>
                </div>
              </label>

              {selectedFile && (
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    {fileType === "image" && <Image className="h-5 w-5 text-blue-500" />}
                    {fileType === "pdf" && <FileText className="h-5 w-5 text-red-600" />}
                    {fileType === "video" && <Video className="h-5 w-5 text-red-500" />}
                    <span className="text-sm font-medium">{selectedFile.name}</span>
                    <span className="text-xs text-gray-500">
                      ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreview(null);
                    }}
                    disabled={uploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Preview for images */}
              {preview && fileType === "image" && (
                <div className="relative w-full h-48 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
                  <img
                    src={preview}
                    alt={t('upload.preview')}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

      {!embedded && (
        <DialogFooter className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={handleClose} disabled={uploading}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="bg-[rgb(var(--primary-brand))] text-black font-semibold hover:bg-[rgb(var(--primary-brand-hover))]"
          >
            {uploading ? t('common.uploading') : t('upload.upload')}
          </Button>
        </DialogFooter>
      )}

      {embedded && (
        <div className="flex justify-end gap-2 pt-4">
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="bg-[rgb(var(--primary-brand))] text-black font-semibold hover:bg-[rgb(var(--primary-brand-hover))]"
          >
            {uploading ? t('common.uploading') : t('upload.upload')}
          </Button>
        </div>
      )}
    </>
  );

  if (embedded) {
    return <div className="w-full">{content}</div>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl w-full rounded-2xl shadow-2xl bg-card dark:bg-[#232323] p-8 border-0">
        {content}
      </DialogContent>
    </Dialog>
  );
}

