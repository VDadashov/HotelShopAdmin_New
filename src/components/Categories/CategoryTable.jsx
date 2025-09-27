import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Pencil,
  Trash,
  Eye,
  Copy,
  Tag,
  CheckCircle,
  XCircle,
  Image,
  FolderTree,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { customFilter } from "@/components/ui/DataTable";

const CategoryTable = ({ data, onView, onEdit, onDelete }) => {
  const { t, i18n } = useTranslation();

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: t("common.name"),
        cell: ({ row }) => {
          const name = row.original.name;
          const imageUrl = row.original.imageUrl;

          let displayName = "";
          if (typeof name === "object" && name !== null) {
            displayName =
              name[i18n.language] || name.az || name.en || name.ru || "";
          } else {
            displayName = name || "";
          }

          return (
            <div className="flex items-center space-x-3">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={displayName}
                  className="h-8 w-8 rounded-md object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <Image
                className="h-8 w-8 text-gray-400 bg-gray-100 p-1 rounded-md"
                style={{ display: imageUrl ? "none" : "flex" }}
              />
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {displayName}
                </div>
                {row.original.parent && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Parent:{" "}
                    {typeof row.original.parent.name === "object"
                      ? row.original.parent.name[i18n.language] ||
                        row.original.parent.name.en
                      : row.original.parent.name}
                  </div>
                )}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "level",
        header: t("common.level"),
        cell: ({ row }) => {
          const level = row.original.level || (row.original.parentId ? 2 : 1);
          return (
            <div className="flex items-center space-x-2">
              <FolderTree className="h-4 w-4 text-gray-500" />
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Level {level}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "isActive",
        header: t("common.status"),
        cell: ({ row }) => {
          const isActive = row.original.isActive;
          return (
            <div className="flex items-center space-x-2">
              {isActive ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {t("common.active")}
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    {t("common.inactive")}
                  </span>
                </>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "isProductHolder",
        header: t("categories.productHolder"),
        cell: ({ row }) => {
          const isProductHolder = row.original.isProductHolder;
          return (
            <div className="flex items-center space-x-2">
              {isProductHolder ? (
                <>
                  <Tag className="h-4 w-4 text-purple-600" />
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    {t("common.yes")}
                  </span>
                </>
              ) : (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                  {t("common.no")}
                </span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "children",
        header: t("categories.subcategories"),
        cell: ({ row }) => {
          const children = row.original.children || [];
          const childrenCount = children.length;

          if (childrenCount === 0) {
            return <span className="text-gray-400 dark:text-gray-500">-</span>;
          }

          return (
            <div className="flex items-center space-x-2">
              <FolderTree className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {childrenCount}{" "}
                {childrenCount === 1 ? "subcategory" : "subcategories"}
              </span>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: t("common.actions"),
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("common.actions")}</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(row.original.id);
                  toast.success(t("categories.idCopied"));
                }}
                className="text-blue-600 hover:bg-blue-50 focus:bg-blue-100 dark:hover:bg-blue-900 dark:hover:text-blue-200"
              >
                <Copy className="w-4 h-4 mr-2 text-blue-600" />{" "}
                {t("categories.copyId")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onView(row.original)}
                className="text-green-600 hover:bg-green-50 focus:bg-green-100 dark:hover:bg-green-900 dark:hover:text-green-200"
              >
                <Eye className="w-4 h-4 mr-2 text-green-600" />{" "}
                {t("common.view")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onEdit(row.original)}
                className="text-yellow-600 hover:bg-yellow-50 focus:bg-yellow-100 dark:hover:bg-yellow-900 dark:hover:text-yellow-200"
              >
                <Pencil className="w-4 h-4 mr-2 text-yellow-600" />{" "}
                {t("common.edit")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(row.original)}
                className="text-red-600 hover:bg-red-50 focus:bg-red-100 dark:hover:bg-red-900 dark:hover:text-red-200"
              >
                <Trash className="w-4 h-4 mr-2 text-red-600" />{" "}
                {t("common.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [t, i18n.language, onView, onEdit, onDelete]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      filterKey="custom"
      filterPlaceholder={t("categories.searchPlaceholder")}
      filterFn={customFilter}
      tableClassName="bg-background dark:bg-[#181818] divide-y divide-gray-200"
      headerClassName="bg-gray-100 text-gray-700"
    />
  );
};

export default CategoryTable;
