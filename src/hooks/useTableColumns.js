import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import ActionsColumn from "@/components/common/tables/ActionsColumn";
import MultilingualCell from "@/components/common/tables/MultilingualCell";
import StatusCell from "@/components/common/tables/StatusCell";

const useTableColumns = ({
  titleKey,
  onView,
  onEdit,
  onDelete,
  customColumns = [],
  showActions = true,
}) => {
  const { t } = useTranslation();

  const baseColumns = useMemo(() => {
    const columns = [
      {
        accessorKey: "name",
        header: t("common.name"),
        cell: ({ row }) => {
          const name = row.original.name;
          return <MultilingualCell value={name} />;
        },
      },
      {
        accessorKey: "title",
        header: t("common.name"),
        cell: ({ row }) => {
          const title = row.original.title;
          return <MultilingualCell value={title} />;
        },
      },
      {
        accessorKey: "isActive",
        header: t("common.status"),
        cell: ({ row }) => {
          const isActive = row.original.isActive;
          return <StatusCell isActive={isActive} />;
        },
      },
      ...customColumns,
    ];

    if (showActions) {
      columns.push({
        id: "actions",
        header: t("common.actions"),
        cell: ({ row }) => (
          <ActionsColumn
            row={row}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            titleKey={titleKey}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      });
    }

    return columns;
  }, [t, onView, onEdit, onDelete, titleKey, customColumns, showActions]);

  return baseColumns;
};

export default useTableColumns;
