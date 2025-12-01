import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import BaseTable from "@/components/common/tables/BaseTable";
import ActionsColumn from "@/components/common/tables/ActionsColumn";
import MultilingualCell from "@/components/common/tables/MultilingualCell";
import StatusCell from "@/components/common/tables/StatusCell";
import { Button } from "@/components/ui/button";
import { Eye, X } from "lucide-react";
import { Dialog, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";

const BrandTable = ({ 
  data, 
  onView, 
  onEdit, 
  onDelete, 
  onSearch, 
  searchValue, 
  onFiltersChange, 
  filters
}) => {
  const { t } = useTranslation();
  const [zoomedImage, setZoomedImage] = useState(null);

  // Debounced search handler
  const handleSearchChange = (value) => {
    if (onSearch) {
      onSearch(value);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "imageUrl",
        header: t("common.image"),
        cell: ({ row }) => (
          <div className="flex items-center justify-start">
            {row.original.imageUrl ? (
              <div 
                className="relative group cursor-pointer"
                onClick={() => setZoomedImage(row.original.imageUrl)}
              >
                <img
                  src={row.original.imageUrl}
                  alt="Brand"
                  className="w-20 h-20 object-cover rounded border hover:opacity-80 transition-opacity pointer-events-none"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) {
                      e.target.nextSibling.style.display = 'flex';
                    }
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded border pointer-events-none">
                  <Eye className="h-6 w-6 text-white" />
                </div>
              </div>
            ) : (
              <div
                className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded border flex items-center justify-center text-gray-500 text-xs"
              >
                {t('brands.noImage')}
              </div>
            )}
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "name",
        header: t("common.name"),
        cell: ({ row }) => <MultilingualCell value={row.original.name} />,
      },
      {
        accessorKey: "isActive",
        header: t("common.status"),
        cell: ({ row }) => <StatusCell isActive={row.original.isActive} />,
      },
      {
        id: "actions",
        header: t("common.actions"),
        cell: ({ row }) => (
          <ActionsColumn
            row={row}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            titleKey="brands"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [t, onView, onEdit, onDelete]
  );

  return (
    <>
      <BaseTable
        data={data}
        columns={columns}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        titleKey="brands"
        filterKey="global"
        filterFn={null}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        onFiltersChange={onFiltersChange}
        filters={filters}
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
};

export default BrandTable;