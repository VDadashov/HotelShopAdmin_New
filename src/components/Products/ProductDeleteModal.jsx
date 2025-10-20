import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseDeleteModal from "@/components/common/modals/BaseDeleteModal";

const ProductDeleteModal = ({ 
  product, 
  isOpen, 
  onClose, 
  onConfirm, 
  isDeleting 
}) => {
  const { t } = useTranslation();

  return (
    <BaseDeleteModal
      data={product}
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      isDeleting={isDeleting}
      titleKey="products"
      getDisplayName={(product) => {
        if (!product) return "";
        return product.title?.az || product.title?.en || product.title?.ru || `Product ${product.id}`;
      }}
    />
  );
};

export default ProductDeleteModal;