import * as React from "react";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { useTranslation } from "react-i18next";
import { useGet } from "@/utils/hooks/useCustomQuery";
import { ENDPOINTS } from "@/utils/constants/Endpoints";

// Import components
import ContactViewModal from "@/components/Contacts/ContactViewModal";
import ContactDeleteModal from "@/components/Contacts/ContactDeleteModal";
import ContactTable from "@/components/Contacts/ContactTable";

export default function Contact() {
  const { t } = useTranslation();
  const [viewContact, setViewContact] = useState(null);
  const [deleteContact, setDeleteContact] = useState(null);

  // API hooks
  const { data: contactList = [], isLoading, refetch } = useGet("contacts", ENDPOINTS.contact);

  return (
    <div className="w-full mx-auto py-10 px-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">{t('contacts.title')}</h1>
      </div>

      {/* Components */}
      <ContactViewModal
        viewContact={viewContact}
        setViewContact={setViewContact}
      />

      <ContactDeleteModal
        deleteContact={deleteContact}
        setDeleteContact={setDeleteContact}
        refetch={refetch}
      />

      <ContactTable
        contactList={contactList}
        setViewContact={setViewContact}
        setDeleteContact={setDeleteContact}
        refetch={refetch}
      />

      <Toaster
        position="top-right"
        toastOptions={{
          classNames: {
            success: "!bg-green-500 !text-white",
            error: "!bg-red-500 !text-white"
          },
          duration: 1500
        }}
      />
    </div>
  );
}