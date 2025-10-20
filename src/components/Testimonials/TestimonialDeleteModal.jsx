import React from "react";
import { useTranslation } from "react-i18next";
import BaseDeleteModal from "@/components/common/modals/BaseDeleteModal";

const TestimonialDeleteModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  testimonial 
}) => {
  const { t } = useTranslation();

  return (
    <BaseDeleteModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={t("testimonials.delete")}
      message={t("testimonials.deleteConfirm")}
    />
  );
};

export default TestimonialDeleteModal;
