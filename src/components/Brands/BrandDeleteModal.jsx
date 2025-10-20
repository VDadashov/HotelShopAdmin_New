import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseDeleteModal from "@/components/common/modals/BaseDeleteModal";

const BrandDeleteModal = ({
  brand,
  isOpen,
  onClose,
  onConfirm,
  isDeleting
}) => {
  const { t, i18n } = useTranslation();

  const getLanguageName = (multilingual, lang = i18n.language) => {
    if (!multilingual) return "";
    return (
      multilingual[lang] ||
      multilingual.az ||
      multilingual.en ||
      multilingual.ru ||
      ""
    );
  };

  return (
    <BaseDeleteModal
      data={brand}
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      isDeleting={isDeleting}
      titleKey="brands"
      getDisplayName={(brand) => getLanguageName(brand?.name)}
    />
  );
};

export default BrandDeleteModal;