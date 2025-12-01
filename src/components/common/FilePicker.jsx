import * as React from "react";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGet } from "@/utils/hooks/useCustomQuery";
import { ENDPOINTS } from "@/utils/constants/Endpoints";
import { Image, Video, FileText, X } from "lucide-react";
import UploadForm from "@/components/Uploads/UploadForm";

export default function FilePicker({
  isOpen,
  onClose,
  onSelect,
  acceptTypes = ["image"], // ["image"], ["video"], ["image", "video"], ["image", "video", "pdf"]
  title = null,
}) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("existing");
  const [selectedResourceType, setSelectedResourceType] = useState(() => {
    // Determine initial resourceType based on acceptTypes
    if (acceptTypes.includes("image") && !acceptTypes.includes("video") && !acceptTypes.includes("pdf")) {
      return "image";
    } else if (acceptTypes.includes("video") && !acceptTypes.includes("image") && !acceptTypes.includes("pdf")) {
      return "video";
    } else if (acceptTypes.includes("pdf") && !acceptTypes.includes("image") && !acceptTypes.includes("video")) {
      return "raw";
    }
    return "image"; // default
  });
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 20
  });

  // Determine resourceType based on acceptTypes
  const getResourceType = () => {
    if (acceptTypes.includes("image") && !acceptTypes.includes("video") && !acceptTypes.includes("pdf")) {
      return "image";
    } else if (acceptTypes.includes("video") && !acceptTypes.includes("image") && !acceptTypes.includes("pdf")) {
      return "video";
    } else if (acceptTypes.includes("pdf") && !acceptTypes.includes("image") && !acceptTypes.includes("video")) {
      return "raw";
    }
    return selectedResourceType;
  };

  // API URL with query parameters
  const apiUrl = useMemo(() => {
    const params = new URLSearchParams();
    const resourceType = getResourceType();
    
    if (resourceType) {
      params.append('resourceType', resourceType);
    }
    
    params.append('page', pagination.currentPage);
    params.append('pageSize', pagination.limit);

    return `${ENDPOINTS.upload}?${params.toString()}`;
  }, [selectedResourceType, pagination, acceptTypes]);

  // Fetch uploaded files
  const { data: uploadResponse, isLoading, refetch } = useGet("filePickerUploads", apiUrl);

  // Extract data from response
  const uploadList = useMemo(() => {
    return uploadResponse?.data || uploadResponse || [];
  }, [uploadResponse]);

  // Filter files based on acceptTypes (API already filters by resourceType, but we need to ensure acceptTypes match)
  const filteredFiles = useMemo(() => {
    let filtered = Array.isArray(uploadList) ? uploadList : [];

    // Additional filter by acceptTypes to ensure only allowed types are shown
    filtered = filtered.filter((file) => {
      const url = file?.url || file?.media?.url;
      if (!url) return false;

      const extension = url.split('.').pop()?.toLowerCase();
      
      if (acceptTypes.includes("image") && ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
        return true;
      }
      if (acceptTypes.includes("video") && ['mp4', 'webm', 'ogg', 'mov'].includes(extension)) {
        return true;
      }
      if (acceptTypes.includes("pdf") && ['pdf'].includes(extension)) {
        return true;
      }
      return false;
    });

    return filtered;
  }, [uploadList, acceptTypes]);

  // Get file type icon
  const getFileTypeIcon = (url) => {
    if (!url) return <FileText className="h-4 w-4" />;
    const extension = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
      return <Image className="h-4 w-4 text-blue-500" />;
    } else if (['mp4', 'webm', 'ogg', 'mov'].includes(extension)) {
      return <Video className="h-4 w-4 text-red-500" />;
    } else if (['pdf'].includes(extension)) {
      return <FileText className="h-4 w-4 text-red-600" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  // Handle file selection
  const handleFileSelect = (file) => {
    const url = file?.url || file?.media?.url;
    if (url && onSelect) {
      onSelect(url);
      onClose();
    }
  };

  // Handle upload success
  const handleUploadSuccess = () => {
    refetch();
    setActiveTab("existing");
  };

  // Update pagination when API response changes
  React.useEffect(() => {
    if (uploadResponse?.pagination) {
      setPagination({
        total: uploadResponse.pagination.totalItems || 0,
        totalPages: uploadResponse.pagination.totalPages || 1,
        currentPage: uploadResponse.pagination.page || 1,
        limit: uploadResponse.pagination.limit || 20
      });
    }
  }, [uploadResponse]);

  // Show resource type filter only if multiple types are accepted
  const showResourceTypeFilter = acceptTypes.length > 1;

  const handleClose = () => {
    setActiveTab("existing");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        handleClose();
      }
    }}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col rounded-2xl shadow-2xl bg-card dark:bg-[#232323] p-0 border-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>
            {title || t('filePicker.selectFile')}
          </DialogTitle>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="px-6 pb-4 border-b">
          <div className="flex gap-2">
            <Button
              variant={activeTab === "existing" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("existing")}
            >
              {t('filePicker.existingFiles')}
            </Button>
            <Button
              variant={activeTab === "upload" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("upload")}
            >
              {t('filePicker.uploadNew')}
            </Button>
          </div>
        </div>

        {/* Existing Files Tab */}
        {activeTab === "existing" && (
          <div className="flex-1 flex flex-col overflow-hidden px-6 pb-6">
            {/* Resource Type Filter - Always show if multiple types are accepted */}
            {(showResourceTypeFilter || acceptTypes.length > 1) && (
              <div className="mb-4">
                <Select
                  value={selectedResourceType}
                  onValueChange={(value) => {
                    setSelectedResourceType(value);
                    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page when filter changes
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t('upload.resourceTypeFilter')} />
                  </SelectTrigger>
                  <SelectContent>
                    {acceptTypes.includes("image") && (
                      <SelectItem value="image">
                        <div className="flex items-center gap-2">
                          <Image className="h-4 w-4" />
                          {t('upload.image')}
                        </div>
                      </SelectItem>
                    )}
                    {acceptTypes.includes("video") && (
                      <SelectItem value="video">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4" />
                          {t('upload.video')}
                        </div>
                      </SelectItem>
                    )}
                    {acceptTypes.includes("pdf") && (
                      <SelectItem value="raw">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          {t('upload.pdf')}
                        </div>
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Files Grid */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-gray-500">{t('common.loading')}...</div>
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <FileText className="h-12 w-12 mb-4 opacity-50" />
                  <p>{t('filePicker.noFilesFound')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {filteredFiles.map((file, index) => {
                    const url = file?.url || file?.media?.url;
                    if (!url) return null;

                    const extension = url.split('.').pop()?.toLowerCase();
                    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension);

                    return (
                      <div
                        key={file?.id || file?.publicId || index}
                        className="relative group border rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors"
                        onClick={() => handleFileSelect(file)}
                      >
                        {isImage ? (
                          <div className="aspect-square relative">
                            <img
                              src={url}
                              alt="File"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="sm" variant="secondary">
                                  {t('filePicker.select')}
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="aspect-square flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800">
                            {getFileTypeIcon(url)}
                            <p className="mt-2 text-xs text-center truncate w-full px-2">
                              {url.split('/').pop()}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="text-sm text-gray-500">
                  {t('common.showing')} {((pagination.currentPage - 1) * pagination.limit) + 1} - {Math.min(pagination.currentPage * pagination.limit, pagination.total)} {t('common.of')} {pagination.total}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.max(1, prev.currentPage - 1) }))}
                    disabled={pagination.currentPage === 1}
                  >
                    {t('common.previous')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.min(prev.totalPages, prev.currentPage + 1) }))}
                    disabled={pagination.currentPage >= pagination.totalPages}
                  >
                    {t('common.next')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Upload New Tab */}
        {activeTab === "upload" && (
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <UploadForm
              isOpen={true}
              onClose={() => {
                // Don't close FilePicker when UploadForm closes, just reset tab
                setActiveTab("existing");
              }}
              onSuccess={handleUploadSuccess}
              fileTypeOnly={acceptTypes.length === 1 ? acceptTypes[0] : null}
              embedded={true}
            />
          </div>
        )}

        {/* Cancel Button */}
        <div className="px-6 pb-6 pt-4 border-t flex justify-end">
          <Button variant="outline" onClick={handleClose}>
            {t('common.cancel')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

