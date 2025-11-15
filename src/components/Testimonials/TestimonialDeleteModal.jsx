import React from "react";
import { useTranslation } from "react-i18next";
import BaseDeleteModal from "@/components/common/modals/BaseDeleteModal";

const TestimonialDeleteModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  testimonial,
  isDeleting
}) => {
  const { t } = useTranslation();

  return (
    <BaseDeleteModal
      data={testimonial}
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      isDeleting={isDeleting}
      title={t("testimonials.delete")}
      message={t("testimonials.deleteConfirm")}
    />
  );
};

export default TestimonialDeleteModal;
