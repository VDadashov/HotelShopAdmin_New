import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import BaseTable from "@/components/common/tables/BaseTable";
import ActionsColumn from "@/components/common/tables/ActionsColumn";
import MultilingualCell from "@/components/common/tables/MultilingualCell";
import StatusCell from "@/components/common/tables/StatusCell";

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
  const { t, i18n } = useTranslation();

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
              <img
                src={row.original.imageUrl}
                alt="Brand"
                className="w-16 h-16 object-contain rounded-lg border"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg border flex items-center justify-center text-gray-500 text-xs"
              style={{ display: row.original.imageUrl ? 'none' : 'flex' }}
            >
              {t('brands.noImage')}
            </div>
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
  );
};

export default BrandTable;