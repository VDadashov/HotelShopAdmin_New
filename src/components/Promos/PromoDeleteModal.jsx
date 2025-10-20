import React from "react";
import { useTranslation } from "react-i18next";
import BaseDeleteModal from "@/components/common/modals/BaseDeleteModal";

const PromoDeleteModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  promo,
  isDeleting 
}) => {
  const { t } = useTranslation();

  const getLanguageName = (multilingual) => {
    if (!multilingual) return "";
    return (
      multilingual.az ||
      multilingual.en ||
      multilingual.ru ||
      ""
    );
  };

  return (
    <BaseDeleteModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      isDeleting={isDeleting}
      title={t("promos.delete")}
      message={t("promos.deleteConfirm")}
      itemName={getLanguageName(promo?.title) || `Promo #${promo?.id}`}
    />
  );
};

export default PromoDeleteModal;
