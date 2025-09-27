import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";

export default function ContactViewModal({ 
  viewContact, 
  setViewContact 
}) {
  const { t } = useTranslation();

  return (
    <Dialog open={!!viewContact} onOpenChange={v => { if (!v) setViewContact(null); }}>
      <DialogContent className="max-w-lg w-full rounded-2xl shadow-2xl bg-card dark:bg-[#232323] p-8 border-0">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-foreground">
            {t('contacts.contactDetails')}
          </DialogTitle>
        </DialogHeader>
        {viewContact && (
          <div className="space-y-4">
            <div><b>{t('contacts.contactId')}:</b> {viewContact.id}</div>
            <div><b>{t('contacts.contactName')}:</b> {viewContact.name}</div>
            <div><b>{t('contacts.contactEmail')}:</b> {viewContact.email}</div>
            <div><b>{t('contacts.contactPhone')}:</b> {viewContact.phone}</div>
            <div><b>{t('contacts.contactSubject')}:</b> {viewContact.subject}</div>
            <div><b>{t('contacts.contactMessage')}:</b> {viewContact.message}</div>
            <div><b>{t('common.read')}?:</b> {viewContact.isRead ? "✔️" : "❌"}</div>
            <div><b>{t('common.createdAt')}:</b> {new Date(viewContact.createdAt).toLocaleString()}</div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 