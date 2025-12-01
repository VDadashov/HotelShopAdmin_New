import * as React from "react";
import { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Copy, Trash, Image, FileText, Video, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function UploadTable({ 
  uploadList, 
  setViewUpload, 
  setDeleteUpload,
  refetch,
  filters,
  onFiltersChange,
  pagination,
  onPaginationChange
}) {
  const { t } = useTranslation();
  const [zoomedImage, setZoomedImage] = useState(null);

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

  const getFileType = (url) => {
    if (!url) return t('upload.unknown');
    const extension = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
      return t('upload.image');
    } else if (['mp4', 'webm', 'ogg', 'mov'].includes(extension)) {
      return t('upload.video');
    } else if (['pdf'].includes(extension)) {
      return t('upload.pdf');
    }
    return t('upload.unknown');
  };

  const columns = [
    {
      accessorKey: "url",
      header: t('upload.file'),
      cell: ({ row }) => {
        const url = row.original.url || row.original.media?.url;
        if (!url) return <span>-</span>;
        
        const extension = url.split('.').pop()?.toLowerCase();
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension);
        
        return (
          <div className="flex items-center gap-2">
            {isImage ? (
              <div 
                className="relative group cursor-pointer"
                onClick={() => setZoomedImage(url)}
              >
                <img 
                  src={url} 
                  alt="Uploaded file" 
                  className="w-20 h-20 object-cover rounded border hover:opacity-80 transition-opacity pointer-events-none"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) {
                      e.target.nextSibling.style.display = 'inline';
                    }
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded border pointer-events-none">
                  <Eye className="h-6 w-6 text-white" />
                </div>
              </div>
            ) : (
              <>
                {getFileTypeIcon(url)}
                <span className="max-w-xs truncate">
                  {url}
                </span>
              </>
            )}
          </div>
        );
      }
    },
    {
      accessorKey: "type",
      header: t('upload.type'),
      cell: ({ row }) => {
        const url = row.original.url || row.original.media?.url;
        return getFileType(url);
      }
    },
    { 
      accessorKey: "createdAt", 
      header: t('common.createdAt'), 
      cell: ({ row }) => {
        const date = row.original.createdAt || row.original.media?.createdAt;
        return date ? new Date(date).toLocaleString() : "-";
      }
    },
    {
      id: "actions",
      header: t('common.actions'),
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t('common.actions')}</DropdownMenuLabel>
            <DropdownMenuItem 
              onClick={() => {
                const id = row.original.id || row.original.media?.id || row.original.publicId;
                if (id) {
                  navigator.clipboard.writeText(id);
                  toast.success(t('common.idCopied'));
                }
              }}
              className="text-blue-600 hover:bg-blue-50 focus:bg-blue-100 dark:hover:bg-blue-900 dark:hover:text-blue-200"
            >
              <Copy className="w-4 h-4 mr-2 text-blue-600" /> {t('upload.copyId')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => setViewUpload(row.original)}
              className="text-green-600 hover:bg-green-50 focus:bg-green-100 dark:hover:bg-green-900 dark:hover:text-green-200"
            >
              <Eye className="w-4 h-4 mr-2 text-green-600" /> {t('common.view')}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setDeleteUpload(row.original)}
              className="text-red-600 hover:bg-red-50 focus:bg-red-100 dark:hover:bg-red-900 dark:hover:text-red-200"
            >
              <Trash className="w-4 h-4 mr-2 text-red-600" /> {t('common.delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={Array.isArray(uploadList) ? uploadList : (uploadList.data || [])}
        filterKey="url"
        filterPlaceholder={t('upload.searchPlaceholder')}
        tableClassName="min-w-full divide-y divide-gray-200"
        headerClassName="bg-gray-100 text-gray-700"
        filters={filters}
        onFiltersChange={onFiltersChange}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
      />
      
      {/* Zoom Modal */}
      <Dialog open={!!zoomedImage} onOpenChange={() => setZoomedImage(null)}>
        <DialogPortal>
          <DialogOverlay />
          <DialogPrimitive.Content className="fixed top-[50%] left-[50%] z-50 translate-x-[-50%] translate-y-[-50%] max-w-[90vw] max-h-[90vh] w-auto h-auto p-0 bg-transparent border-0 shadow-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full"
                onClick={() => setZoomedImage(null)}
              >
                <X className="h-4 w-4" />
              </Button>
              <img 
                src={zoomedImage || ''} 
                alt="Zoomed image" 
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
            </div>
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>
    </>
  );
}

