import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash, Eye, Copy } from "lucide-react";
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

const ProductTable = ({ data, onView, onEdit, onDelete }) => {
  const { t, i18n } = useTranslation();

  const columns = useMemo(
    () => [
      {
        accessorKey: "mainImg",
        header: t("common.image"),
        cell: ({ row }) =>
          row.original.mainImg ? (
            <img
              src={row.original.mainImg}
              alt="main"
              className="w-12 h-12 object-contain rounded border"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded border flex items-center justify-center">
              <span className="text-xs text-gray-400">No img</span>
            </div>
          ),
        enableSorting: false,
      },
      {
        accessorKey: "name",
        header: t("common.name"),
        cell: ({ row }) =>
          row.original.name?.[i18n.language] || row.original.name?.az || "",
      },
      {
        accessorKey: "description",
        header: t("common.description"),
        cell: ({ row }) => {
          const description =
            row.original.description?.[i18n.language] ||
            row.original.description?.az ||
            "";
          return description.length > 50
            ? description.substring(0, 50) + "..."
            : description;
        },
      },
      {
        accessorKey: "category",
        header: t("common.category"),
        cell: ({ row }) =>
          row.original.category?.name?.[i18n.language] ||
          row.original.category?.name?.az ||
          row.original.category?.name ||
          "",
      },
      {
        accessorKey: "views",
        header: t("common.views"),
        cell: ({ row }) => row.original.views || 0,
      },
      {
        accessorKey: "isActive",
        header: t("common.status"),
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              row.original.isActive
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {row.original.isActive ? t("common.active") : t("common.inactive")}
          </span>
        ),
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
                  navigator.clipboard.writeText(row.original.id.toString());
                  toast.success(t("products.idCopied"));
                }}
                className="text-blue-600 hover:bg-blue-50 focus:bg-blue-100 dark:hover:bg-blue-900 dark:hover:text-blue-200"
              >
                <Copy className="w-4 h-4 mr-2 text-blue-600" />{" "}
                {t("products.copyId")}
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
      filterPlaceholder={t("products.searchPlaceholder")}
      filterFn={customFilter}
      tableClassName="bg-background dark:bg-[#181818] divide-y divide-gray-200"
      headerClassName="bg-gray-100 text-gray-700"
    />
  );
};

export default ProductTable;
