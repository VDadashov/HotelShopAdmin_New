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

const PageTable = ({ data, onView, onEdit, onDelete }) => {
  const { t, i18n } = useTranslation();

  const columns = useMemo(
    () => [
      {
        accessorKey: "title",
        header: t("common.name"),
        cell: ({ row }) => {
          const title = row.original.title;
          if (typeof title === "object" && title !== null) {
            return (
              title[i18n.language] || title.az || title.en || title.ru || ""
            );
          }
          return title || "";
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
                  toast.success(t("page.idCopied"));
                }}
                className="text-blue-600 hover:bg-blue-50 focus:bg-blue-100 dark:hover:bg-blue-900 dark:hover:text-blue-200"
              >
                <Copy className="w-4 h-4 mr-2 text-blue-600" />{" "}
                {t("page.copyId")}
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
      filterPlaceholder={t("page.searchPlaceholder")}
      filterFn={customFilter}
      tableClassName="bg-background dark:bg-[#181818] divide-y divide-gray-200"
      headerClassName="bg-gray-100 text-gray-700"
    />
  );
};

export default PageTable;
