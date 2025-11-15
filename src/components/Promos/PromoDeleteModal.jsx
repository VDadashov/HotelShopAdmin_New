import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseDeleteModal from "@/components/common/modals/BaseDeleteModal";

const PromoDeleteModal = ({ 
  promo, 
  isOpen, 
  onClose, 
  onConfirm, 
  isDeleting 
}) => {
  const { t } = useTranslation();

  return (
    <BaseDeleteModal
      data={promo}
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      isDeleting={isDeleting}
      titleKey="promos"
      getDisplayName={(promo) => {
        if (!promo) return "";
        return promo.title?.az || promo.title?.en || promo.title?.ru || `Promo ${promo.id}`;
      }}
    />
  );
};

export default PromoDeleteModal;