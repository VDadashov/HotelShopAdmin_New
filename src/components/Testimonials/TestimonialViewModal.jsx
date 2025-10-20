import React from "react";
import { useTranslation } from "react-i18next";
import BaseViewModal from "@/components/common/modals/BaseViewModal";
import MultilingualCell from "@/components/common/tables/MultilingualCell";
import { useGet } from "@/utils/hooks/useCustomQuery";
import { ENDPOINTS } from "@/utils/constants/Endpoints";
import { Star } from "lucide-react";

const TestimonialViewModal = ({ 
  isOpen, 
  onClose, 
  testimonial 
}) => {
  const { t, i18n } = useTranslation();

  // Get testimonial details with allLanguages=true
  const detailUrl = testimonial?.id ? `${ENDPOINTS.testimonials}/${testimonial.id}?allLanguages=true` : null;
  const { data: testimonialDetailResponse } = useGet("testimonialDetail", detailUrl, i18n.language);
  const displayTestimonial = testimonialDetailResponse?.data || testimonial;

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

  // Early return if testimonial is null
  if (!testimonial) return null;

  return (
    <BaseViewModal
      data={displayTestimonial}
      isOpen={isOpen}
      onClose={onClose}
      titleKey="testimonials"
      maxWidth="max-w-4xl"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          {getLanguageName(displayTestimonial.name)}
        </h2>
      </div>

      {/* Testimonial Names */}
      <div className="border-t pt-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">
          {t("testimonials.name")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Azərbaycanca
            </div>
            <div className="font-medium text-foreground">
              {displayTestimonial.name?.az || "-"}
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              English
            </div>
            <div className="font-medium text-foreground">
              {displayTestimonial.name?.en || "-"}
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Русский
            </div>
            <div className="font-medium text-foreground">
              {displayTestimonial.name?.ru || "-"}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial Messages */}
      <div className="border-t pt-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">
          {t("testimonials.message")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Azərbaycanca
            </div>
            <div className="font-medium text-foreground whitespace-pre-wrap">
              {displayTestimonial.message?.az || "-"}
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              English
            </div>
            <div className="font-medium text-foreground whitespace-pre-wrap">
              {displayTestimonial.message?.en || "-"}
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Русский
            </div>
            <div className="font-medium text-foreground whitespace-pre-wrap">
              {displayTestimonial.message?.ru || "-"}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial Image */}
      {displayTestimonial.imageUrl && (
        <div className="border-t pt-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {t("testimonials.image")}
          </h3>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="flex justify-center">
              <img
                src={displayTestimonial.imageUrl}
                alt={getLanguageName(displayTestimonial.name)}
                className="max-w-full max-h-96 object-contain rounded-lg border"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div
                className="w-64 h-64 bg-gray-200 dark:bg-gray-700 rounded-lg border flex items-center justify-center text-gray-500"
                style={{ display: 'none' }}
              >
                {t("testimonials.noImage")}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rating */}
      {displayTestimonial.rating && (
        <div className="border-t pt-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {t("testimonials.rating")}
          </h3>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="flex items-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-6 w-6 ${
                    i < displayTestimonial.rating
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-3 text-lg font-semibold text-gray-700 dark:text-gray-300">
                {displayTestimonial.rating}/5
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Status */}
      <div className="border-t pt-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">
          {t("common.status")}
        </h3>
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            displayTestimonial.isActive 
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}>
            {displayTestimonial.isActive ? t("common.active") : t("common.inactive")}
          </div>
        </div>
      </div>

      {/* Created/Updated dates */}
      {(displayTestimonial.createdAt || displayTestimonial.updatedAt) && (
        <div className="border-t pt-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {t("common.dates")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayTestimonial.createdAt && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  {t("common.createdAt")}
                </div>
                <div className="font-medium text-foreground">
                  {new Date(displayTestimonial.createdAt).toLocaleDateString()}
                </div>
              </div>
            )}
            {displayTestimonial.updatedAt && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  {t("common.updatedAt")}
                </div>
                <div className="font-medium text-foreground">
                  {new Date(displayTestimonial.updatedAt).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </BaseViewModal>
  );
};

export default TestimonialViewModal;
