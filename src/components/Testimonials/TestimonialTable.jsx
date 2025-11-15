import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import BaseTable from "@/components/common/tables/BaseTable";
import ActionsColumn from "@/components/common/tables/ActionsColumn";
import StatusCell from "@/components/common/tables/StatusCell";
import MultilingualCell from "@/components/common/tables/MultilingualCell";
import { Star } from "lucide-react";

// Testimonial-specific filter function
const testimonialFilter = (row, columnId, value) => {
  const item = row.original;
  const searchTerm = value.toLowerCase();
  
  // Name field-da axtar (multilingual)
  const nameMatch = item.name && typeof item.name === 'object' && Object.values(item.name).some(val =>
    val && val.toLowerCase().includes(searchTerm)
  );
  
  // Message field-da axtar (multilingual)
  const messageMatch = item.message && typeof item.message === 'object' && Object.values(item.message).some(val =>
    val && val.toLowerCase().includes(searchTerm)
  );
  
  // Rating-də axtar
  const ratingMatch = item.rating && item.rating.toString().includes(searchTerm);
  
  return nameMatch || messageMatch || ratingMatch;
};

const TestimonialTable = ({ 
  data, 
  onView, 
  onEdit, 
  onDelete, 
  onSearch, 
  searchValue, 
  onFiltersChange, 
  filters 
}) => {
  const { t } = useTranslation();

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
                alt="Testimonial"
                className="w-16 h-16 object-cover rounded-lg border"
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
              {t('testimonials.noImage')}
            </div>
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "name",
        header: t("common.name"),
        cell: ({ row }) => (
          <MultilingualCell 
            value={row.original.name} 
            fallback={t("testimonials.noName")}
          />
        ),
      },
      {
        accessorKey: "message",
        header: t("testimonials.message"),
        cell: ({ row }) => (
          <div className="max-w-[400px]">
            <div className="text-sm text-gray-900 dark:text-gray-100 whitespace-normal break-words">
              {row.original.message?.az || row.original.message?.en || row.original.message?.ru || t("testimonials.noMessage")}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "rating",
        header: t("testimonials.rating"),
        cell: ({ row }) => {
          const rating = row.original.rating || 0;
          return (
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < rating
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                ({rating})
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
        id: "actions",
        header: t("common.actions"),
        cell: ({ row }) => (
          <ActionsColumn
            row={row}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            titleKey="testimonials"
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
      titleKey="testimonials"
      searchPlaceholder={t("testimonials.searchPlaceholder")}
      filterKey="custom"
      filterFn={testimonialFilter}
      searchValue={searchValue}
      onSearchChange={handleSearchChange}
      onFiltersChange={onFiltersChange}
      filters={filters}
    />
  );
};

export default TestimonialTable;
