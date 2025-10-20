import React from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const BaseViewModal = ({
  data,
  isOpen,
  onClose,
  titleKey,
  children,
  maxWidth = "max-w-lg",
}) => {
  const { t } = useTranslation();

  if (!data) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${maxWidth} w-full rounded-2xl shadow-2xl bg-card dark:bg-[#232323] p-8 border-0`}>
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-foreground">
            {t(`${titleKey}.details`)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BaseViewModal;
