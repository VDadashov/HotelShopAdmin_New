import React from "react";
import BaseDeleteModal from "@/components/common/modals/BaseDeleteModal";

const CategoryDeleteModal = ({ category, isOpen, onClose, onConfirm, isDeleting }) => {
  return (
    <BaseDeleteModal
      data={category}
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      isDeleting={isDeleting}
      titleKey="categories"
    />
  );
};

export default CategoryDeleteModal;