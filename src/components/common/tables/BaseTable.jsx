import React from "react";
import { useTranslation } from "react-i18next";
import { DataTable } from "@/components/ui/DataTable";
import { customFilter } from "@/components/ui/DataTable";

const BaseTable = ({
  data,
  columns,
  onView,
  onEdit,
  onDelete,
  titleKey,
  searchPlaceholder,
  filterKey = "custom",
  filterFn = customFilter,
  tableClassName = "bg-background dark:bg-[#181818] divide-y divide-gray-200",
  headerClassName = "bg-gray-100 text-gray-700",
  searchValue,
  onSearchChange,
  onFiltersChange,
  filters,
  categories = [],
  products = []
}) => {
  const { t } = useTranslation();

  return (
    <DataTable
      columns={columns}
      data={data}
      filterKey={filterKey}
      filterPlaceholder={searchPlaceholder || t(`${titleKey}.searchPlaceholder`)}
      filterFn={filterFn}
      tableClassName={tableClassName}
      headerClassName={headerClassName}
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      onFiltersChange={onFiltersChange}
      filters={filters}
      categories={categories}
      products={products}
    />
  );
};

export default BaseTable;
