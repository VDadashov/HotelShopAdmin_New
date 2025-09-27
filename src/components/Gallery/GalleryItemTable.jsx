import * as React from "react";
import { useMemo } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash, Eye, Copy } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { customFilter } from "@/components/ui/DataTable";
import { toast } from "sonner";

export default function GalleryItemTable({ 
  itemList, 
  setViewItem, 
  handleEdit, 
  setDeleteItem 
}) {
  const { t } = useTranslation();

  // Table üçün data-nı dilə uyğun string-lərlə hazırlayıram
  const tableData = useMemo(() => {
    let rawData = Array.isArray(itemList) ? itemList : Array.isArray(itemList?.data) ? itemList.data : [];
    return rawData.map(item => ({
      ...item,
      searchableTitle: item.title ? Object.values(item.title).join(' ') : '',
      searchText: item.title ? Object.values(item.title).join(' ').toLowerCase() : '',
    }));
  }, [itemList]);

  const columns = useMemo(() => [
    {
      accessorKey: "mainImage",
      header: t('gallery.mainImage'),
      cell: ({ row }) => row.original.mainImage ? (
        <img src={row.original.mainImage} alt="main" className="w-12 h-12 object-contain rounded border" />
      ) : null,
      enableSorting: false,
    },
    {
      accessorKey: "title",
      header: t('common.name'),
      cell: ({ row }) => row.original.title?.[i18n.language] || "",
    },
    {
      accessorKey: "description",
      header: t('common.description'),
      cell: ({ row }) => row.original.description?.[i18n.language] || "",
    },
    {
      accessorKey: "galleryCategory",
      header: t('common.category'),
      cell: ({ row }) => row.original.galleryCategory?.title?.[i18n.language] || row.original.galleryCategory?.title || row.original.galleryCategoryId,
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
                navigator.clipboard.writeText(row.original.id); 
                toast.success(t('common.idCopied'))
              }}
              className="text-blue-600 hover:bg-blue-50 focus:bg-blue-100 dark:hover:bg-blue-900 dark:hover:text-blue-200"
            >
              <Copy className="w-4 h-4 mr-2 text-blue-600" /> {t('common.copyId')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setViewItem(row.original)}
              className="text-green-600 hover:bg-green-50 focus:bg-green-100 dark:hover:bg-green-900 dark:hover:text-green-200"
            >
              <Eye className="w-4 h-4 mr-2 text-green-600" /> {t('common.view')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleEdit(row.original)}
              className="text-yellow-600 hover:bg-yellow-50 focus:bg-yellow-100 dark:hover:bg-yellow-900 dark:hover:text-yellow-200"
            >
              <Pencil className="w-4 h-4 mr-2 text-yellow-600" /> {t('common.edit')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setDeleteItem(row.original)}
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
  ], [t, i18n.language]);

  return (
    <DataTable
      columns={columns}
      data={tableData}
      filterKey="custom"
      filterPlaceholder={t('gallery.searchPlaceholder')}
      filterFn={customFilter}
      tableClassName="bg-background dark:bg-[#181818] divide-y divide-gray-200"
      headerClassName="bg-gray-100 text-gray-700"
    />
  );
} 