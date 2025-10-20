import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Pencil,
  Trash,
  Eye,
  Copy,
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

const ActionsColumn = ({ 
  row, 
  onView, 
  onEdit, 
  onDelete, 
  titleKey = "common",
  showCopyId = true 
}) => {
  const { t } = useTranslation();

  const handleCopyId = () => {
    navigator.clipboard.writeText(row.original.id);
    toast.success(t(`${titleKey}.idCopied`));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t("common.actions")}</DropdownMenuLabel>
        
        {showCopyId && (
          <>
            <DropdownMenuItem
              onClick={handleCopyId}
              className="text-blue-600 hover:bg-blue-50 focus:bg-blue-100 dark:hover:bg-blue-900 dark:hover:text-blue-200"
            >
              <Copy className="w-4 h-4 mr-2 text-blue-600" />
              {t(`${titleKey}.copyId`)}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        
        <DropdownMenuItem
          onClick={() => onView(row.original)}
          className="text-green-600 hover:bg-green-50 focus:bg-green-100 dark:hover:bg-green-900 dark:hover:text-green-200"
        >
          <Eye className="w-4 h-4 mr-2 text-green-600" />
          {t("common.view")}
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => onEdit(row.original)}
          className="text-yellow-600 hover:bg-yellow-50 focus:bg-yellow-100 dark:hover:bg-yellow-900 dark:hover:text-yellow-200"
        >
          <Pencil className="w-4 h-4 mr-2 text-yellow-600" />
          {t("common.edit")}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={() => onDelete(row.original)}
          className="text-red-600 hover:bg-red-50 focus:bg-red-100 dark:hover:bg-red-900 dark:hover:text-red-200"
        >
          <Trash className="w-4 h-4 mr-2 text-red-600" />
          {t("common.delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionsColumn;
