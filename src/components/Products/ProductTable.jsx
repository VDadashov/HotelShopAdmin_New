import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import BaseTable from "@/components/common/tables/BaseTable";
import ActionsColumn from "@/components/common/tables/ActionsColumn";
import MultilingualCell from "@/components/common/tables/MultilingualCell";
import StatusCell from "@/components/common/tables/StatusCell";
import { customFilter } from "@/components/ui/DataTable";

const ProductTable = ({ 
  data, 
  onView, 
  onEdit, 
  onDelete, 
  onSearch, 
  searchValue, 
  onFiltersChange, 
  filters,
  categories = []
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
        accessorKey: "mainImg",
        header: t("common.image"),
        cell: ({ row }) => (
          <div className="flex items-center justify-start">
            {row.original.mainImg ? (
              <img
                src={row.original.mainImg}
                alt="Product"
                className="w-16 h-16 object-cover rounded-lg border"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg border flex items-center justify-center text-gray-500 text-xs"
              style={{ display: row.original.mainImg ? 'none' : 'flex' }}
            >
              {t("brands.noImage")}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "name",
        header: t("common.name"),
        cell: ({ row }) => <MultilingualCell value={row.original.name} />,
      },
      {
        accessorKey: "description",
        header: t("common.description"),
        cell: ({ row }) => <MultilingualCell value={row.original.description} />,
      },
      {
        accessorKey: "category",
        header: t("common.category"),
        cell: ({ row }) => <MultilingualCell value={row.original.category?.name} />,
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
            titleKey="products"
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
      titleKey="products"
      filterKey="global"
      filterFn={null}
      searchValue={searchValue}
      onSearchChange={handleSearchChange}
      onFiltersChange={onFiltersChange}
      filters={filters}
      categories={categories}
    />
  );
};

export default ProductTable;