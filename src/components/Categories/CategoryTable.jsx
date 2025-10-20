import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import BaseTable from "@/components/common/tables/BaseTable";
import ActionsColumn from "@/components/common/tables/ActionsColumn";
import MultilingualCell from "@/components/common/tables/MultilingualCell";
import StatusCell from "@/components/common/tables/StatusCell";
import { FolderTree, Tag } from "lucide-react";

// Category-specific filter function
const categoryFilter = (row, columnId, value) => {
  const item = row.original;
  const searchTerm = value.toLowerCase();
  
  // Name field-da axtar (multilingual)
  const nameMatch = item.name && typeof item.name === 'object' && Object.values(item.name).some(val =>
    val && val.toLowerCase().includes(searchTerm)
  );
  
  // Parent name-də axtar (əgər varsa)
  const parentMatch = item.parent && item.parent.name && typeof item.parent.name === 'object' && Object.values(item.parent.name).some(val =>
    val && val.toLowerCase().includes(searchTerm)
  );
  
  // Index-də axtar
  const indexMatch = item.index && item.index.toString().includes(searchTerm);
  
  // Level-də axtar
  const levelMatch = item.level && item.level.toString().includes(searchTerm);
  
  return nameMatch || parentMatch || indexMatch || levelMatch;
};

const CategoryTable = ({ 
  data, 
  onView, 
  onEdit, 
  onDelete, 
  onSearch, 
  searchValue, 
  onFiltersChange, 
  filters 
}) => {
  const { t, i18n } = useTranslation();

  // Debounced search handler
  const handleSearchChange = (value) => {
    console.log('CategoryTable handleSearchChange:', value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: t("common.name"),
        cell: ({ row }) => {
          const name = row.original.name;
          return (
            <div>
              <MultilingualCell value={name} />
              {row.original.parent && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Parent: <MultilingualCell value={row.original.parent.name} />
                </div>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "index",
        header: t("categories.index"),
        cell: ({ row }) => {
          const index = row.original.index ?? 0;
          return (
            <div className="flex items-center">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                {index}
              </span>
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
        cell: ({ row }) => <StatusCell isActive={row.original.isActive} />,
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
          <ActionsColumn
            row={row}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            titleKey="categories"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [t, onView, onEdit, onDelete]
  );

  return (
    <BaseTable
      data={data}
      columns={columns}
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
      titleKey="categories"
      filterKey="global"
      filterFn={null} // API-based search istifadə edirik
      searchValue={searchValue}
      onSearchChange={handleSearchChange}
      onFiltersChange={onFiltersChange}
      filters={filters}
    />
  );
};

export default CategoryTable;
