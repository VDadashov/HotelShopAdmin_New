import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useDelete } from "@/utils/hooks/useCustomMutation";
import { ENDPOINTS } from "@/utils/constants/Endpoints";
import { toast } from "sonner";

export default function ContactDeleteModal({ 
  deleteContact, 
  setDeleteContact,
  refetch 
}) {
  const { t } = useTranslation();
  const deleteContactMutation = useDelete("contacts", ENDPOINTS.contact, deleteContact?.id);

  const confirmDelete = () => {
    if (!deleteContact) return;
    deleteContactMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success(t('contacts.contactDeleted'));
        setDeleteContact(null);
        refetch();
      },
      onError: (error) => {
        toast.error(error?.message || t('errors.generalError'));
      },
    });
  };

  return (
    <Dialog open={!!deleteContact} onOpenChange={v => { if (!v) setDeleteContact(null); }}>
      <DialogContent className="max-w-sm w-full rounded-2xl shadow-2xl bg-card dark:bg-[#232323] p-8 border-0">
        <DialogHeader>
          <DialogTitle>{t('contacts.deleteContact')}</DialogTitle>
        </DialogHeader>
        <div>{t('contacts.deleteConfirmation')}</div>
        <DialogFooter className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setDeleteContact(null)}>
            {t('common.cancel')}
          </Button>
          <Button 
            className="bg-red-600 text-white hover:bg-red-700" 
            onClick={confirmDelete}
          >
            {t('common.delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 