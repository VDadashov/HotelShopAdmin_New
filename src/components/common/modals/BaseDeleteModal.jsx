import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const BaseDeleteModal = ({
  data,
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  titleKey,
  confirmationKey,
  maxWidth = "max-w-sm",
}) => {
  const { t } = useTranslation();

  if (!data) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${maxWidth} w-full rounded-2xl shadow-2xl bg-card dark:bg-[#232323] p-8 border-0`}>
        <DialogHeader>
          <DialogTitle>{t(`${titleKey}.delete`)}</DialogTitle>
        </DialogHeader>

        <div>{t(`${titleKey}.deleteConfirmation`)}</div>

        <DialogFooter className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            {t("common.cancel")}
          </Button>
          <Button
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? t("common.deleting") : t("common.delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BaseDeleteModal;
