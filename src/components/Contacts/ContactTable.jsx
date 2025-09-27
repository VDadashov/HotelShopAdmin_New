import * as React from "react";
import { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Copy, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { usePatch } from "@/utils/hooks/useCustomMutation";
import { ENDPOINTS } from "@/utils/constants/Endpoints";
import { toast } from "sonner";

export default function ContactTable({ 
  contactList, 
  setViewContact, 
  setDeleteContact,
  refetch 
}) {
  const { t } = useTranslation();
  const [readLoadingId, setReadLoadingId] = useState(null);
  const [markReadId, setMarkReadId] = useState(null);
  const patchMarkRead = usePatch("contacts", `${ENDPOINTS.contact}/mark-all-read`, markReadId);

  // Mark All as Read funksiyası
  const handleMarkAsRead = async (contact) => {
    setReadLoadingId(contact.id);
    setMarkReadId(contact.id);
    try {
      await patchMarkRead.mutateAsync();
      toast.success(t('contacts.markedAsRead'));
      refetch();
    } catch (e) {
      toast.error(t('errors.generalError'));
    } finally {
      setReadLoadingId(null);
      setMarkReadId(null);
    }
  };

  const columns = [
    { accessorKey: "name", header: t('contacts.contactName') },
    { accessorKey: "email", header: t('contacts.contactEmail') },
    { accessorKey: "phone", header: t('contacts.contactPhone') },
    { accessorKey: "subject", header: t('contacts.contactSubject') },
    {
      accessorKey: "isRead",
      header: t('common.read') + "?",
      cell: ({ row }) => (
        <Select
          value={row.original.isRead ? "read" : "unread"}
          onValueChange={v => v === "read" && !row.original.isRead ? handleMarkAsRead(row.original) : undefined}
          disabled={row.original.isRead || readLoadingId === row.original.id}
        >
          <SelectTrigger
            className={
              `w-28 justify-between ${row.original.isRead
                ? 'bg-green-100 text-green-800 border-green-300'
                : 'bg-red-100 text-red-800 border-red-300'} font-semibold`}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unread">{t('common.unread')}</SelectItem>
            <SelectItem value="read">{t('common.read')}</SelectItem>
          </SelectContent>
        </Select>
      )
    },
    { 
      accessorKey: "createdAt", 
      header: t('common.createdAt'), 
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleString() 
    },
    {
      id: "actions",
      header: t('common.actions'),
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t('common.actions')}</DropdownMenuLabel>
            <DropdownMenuItem 
              onClick={() => {
                navigator.clipboard.writeText(row.original.id);
                toast.success(t('common.idCopied'));
              }}
              className="text-blue-600 hover:bg-blue-50 focus:bg-blue-100 dark:hover:bg-blue-900 dark:hover:text-blue-200"
            >
              <Copy className="w-4 h-4 mr-2 text-blue-600" /> {t('contacts.contactId')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => setViewContact(row.original)}
              className="text-green-600 hover:bg-green-50 focus:bg-green-100 dark:hover:bg-green-900 dark:hover:text-green-200"
            >
              <Eye className="w-4 h-4 mr-2 text-green-600" /> {t('common.view')}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setDeleteContact(row.original)}
              className="text-red-600 hover:bg-red-50 focus:bg-red-100 dark:hover:bg-red-900 dark:hover:text-red-200"
            >
              <Trash className="w-4 h-4 mr-2 text-red-600" /> {t('common.delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={Array.isArray(contactList) ? contactList : (contactList.data || [])}
      filterKey="name"
      filterPlaceholder={t('contacts.searchPlaceholder')}
      tableClassName="min-w-full divide-y divide-gray-200"
      headerClassName="bg-gray-100 text-gray-700"
    />
  );
} 