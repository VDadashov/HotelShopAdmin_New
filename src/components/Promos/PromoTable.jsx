import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import BaseTable from "@/components/common/tables/BaseTable";
import ActionsColumn from "@/components/common/tables/ActionsColumn";
import MultilingualCell from "@/components/common/tables/MultilingualCell";
import StatusCell from "@/components/common/tables/StatusCell";
import { Calendar, Package } from "lucide-react";

// Promo-specific filter function
const promoFilter = (row, columnId, value) => {
  const item = row.original;
  const searchTerm = value.toLowerCase();
  
  // Title field-da axtar (multilingual)
  const titleMatch = item.title && typeof item.title === 'object' && Object.values(item.title).some(val =>
    val && val.toLowerCase().includes(searchTerm)
  );
  
  // Subtitle field-da axtar (multilingual)
  const subtitleMatch = item.subtitle && typeof item.subtitle === 'object' && Object.values(item.subtitle).some(val =>
    val && val.toLowerCase().includes(searchTerm)
  );
  
  // Description field-da axtar (multilingual)
  const descriptionMatch = item.description && typeof item.description === 'object' && Object.values(item.description).some(val =>
    val && val.toLowerCase().includes(searchTerm)
  );
  
  // Product ID-də axtar
  const productMatch = item.productId && item.productId.toString().includes(searchTerm);
  
  return titleMatch || subtitleMatch || descriptionMatch || productMatch;
};

const PromoTable = ({ 
  data, 
  onView, 
  onEdit, 
  onDelete, 
  onSearch, 
  searchValue, 
  onFiltersChange, 
  filters,
  products = []
}) => {
  const { t, i18n } = useTranslation();

  // Debug: Log the data received by PromoTable
  console.log("PromoTable received data:", data);
  console.log("PromoTable data length:", data?.length);

  // Debounced search handler
  const handleSearchChange = (value) => {
    if (onSearch) {
      onSearch(value);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "backgroundImg",
        header: t("common.image"),
        cell: ({ row }) => (
          <div className="flex items-center justify-start">
            {row.original.backgroundImg ? (
              <img
                src={row.original.backgroundImg}
                alt="Promotion"
                className="w-16 h-16 object-cover rounded-lg border"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg border flex items-center justify-center text-gray-500 text-xs"
              style={{ display: row.original.backgroundImg ? 'none' : 'flex' }}
            >
              {t('promos.noImage')}
            </div>
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "title",
        header: t("promos.titleField"),
        cell: ({ row }) => (
          <MultilingualCell 
            value={row.original.title} 
            fallback={t("promos.noTitle")}
          />
        ),
      },
      {
        accessorKey: "subtitle",
        header: t("promos.subtitle"),
        cell: ({ row }) => (
          <div className="max-w-xs">
            <MultilingualCell 
              value={row.original.subtitle} 
              fallback={t("promos.noSubtitle")}
              className="text-sm line-clamp-3"
            />
          </div>
        ),
      },
      {
        accessorKey: "description",
        header: t("promos.description"),
        cell: ({ row }) => (
          <div className="max-w-xs">
            <MultilingualCell 
              value={row.original.description} 
              fallback={t("promos.noDescription")}
              className="text-sm line-clamp-3"
            />
          </div>
        ),
      },
      {
        accessorKey: "dateRange",
        header: t("promos.dateRange"),
        cell: ({ row }) => {
          const startDate = row.original.startDate ? new Date(row.original.startDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }) : "-";
          const endDate = row.original.endDate ? new Date(row.original.endDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }) : "-";
          return (
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <div>{startDate}</div>
                <div className="text-xs">to {endDate}</div>
              </div>
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
        id: "actions",
        header: t("common.actions"),
        cell: ({ row }) => (
          <ActionsColumn
            row={row}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            titleKey="promos"
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
      titleKey="promos"
      searchPlaceholder={t("promos.searchPlaceholder")}
      filterKey="custom"
      filterFn={promoFilter}
      searchValue={searchValue}
      onSearchChange={handleSearchChange}
      onFiltersChange={onFiltersChange}
      filters={filters}
      products={products}
    />
  );
};

export default PromoTable;
