import React from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SectionViewModal = ({ section, isOpen, onClose }) => {
  const { t, i18n } = useTranslation();

  if (!section) return null;

  const getCurrentTitle = () => {
    if (typeof section.title === "object") {
      return section.title[i18n.language] || section.title.az || "";
    }
    return section.title || "";
  };

  const getCurrentDescription = () => {
    if (typeof section.description === "object") {
      return section.description[i18n.language] || section.description.az || "";
    }
    return section.description || "";
  };

  const formatVisibility = (visibility) => {
    switch (visibility) {
      case "both":
        return t("section.both");
      case "desktop":
        return t("section.desktop");
      case "mobile":
        return t("section.mobile");
      default:
        return visibility;
    }
  };

  const formatSectionType = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full rounded-2xl shadow-2xl bg-card dark:bg-[#232323] p-8 border-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-xl font-bold text-foreground">
            {t("section.sectionDetails")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg text-foreground">
                {getCurrentTitle()}
              </h3>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                ID: {section.id}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">
                  {t("section.sectionName")}:
                </span>
                <p className="text-foreground mt-1">{section.name}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">
                  {t("section.sectionType")}:
                </span>
                <p className="text-foreground mt-1">
                  {formatSectionType(section.type)}
                </p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">
                  {t("section.visibility")}:
                </span>
                <p className="text-foreground mt-1">
                  {formatVisibility(section.visibility)}
                </p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">
                  {t("section.order")}:
                </span>
                <p className="text-foreground mt-1">{section.order}</p>
              </div>
            </div>

            {section.pageId && (
              <div className="text-sm">
                <span className="font-medium text-muted-foreground">
                  {t("section.pageId")}:
                </span>
                <p className="text-foreground mt-1">{section.pageId}</p>
              </div>
            )}
          </div>

          {/* Multilingual Titles */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">
              {t("section.sectionTitle")}
            </h4>
            <div className="bg-muted/20 rounded-lg p-4 space-y-3 text-sm">
              <div>
                <strong className="text-foreground">Azərbaycanca:</strong>
                <p className="text-muted-foreground mt-1">
                  {section.title?.az || "—"}
                </p>
              </div>
              <div>
                <strong className="text-foreground">English:</strong>
                <p className="text-muted-foreground mt-1">
                  {section.title?.en || "—"}
                </p>
              </div>
              <div>
                <strong className="text-foreground">Русский:</strong>
                <p className="text-muted-foreground mt-1">
                  {section.title?.ru || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Multilingual Descriptions */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">
              {t("section.sectionDescription")}
            </h4>
            <div className="bg-muted/20 rounded-lg p-4 space-y-3 text-sm">
              <div>
                <strong className="text-foreground">Azərbaycanca:</strong>
                <p className="text-muted-foreground mt-1">
                  {section.description?.az || "—"}
                </p>
              </div>
              <div>
                <strong className="text-foreground">English:</strong>
                <p className="text-muted-foreground mt-1">
                  {section.description?.en || "—"}
                </p>
              </div>
              <div>
                <strong className="text-foreground">Русский:</strong>
                <p className="text-muted-foreground mt-1">
                  {section.description?.ru || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Media */}
          {section.media && (
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">
                {t("section.media")}
              </h4>
              <div className="bg-muted/20 rounded-lg p-4">
                <div className="text-sm text-muted-foreground">
                  {section.media.type === "image"
                    ? t("section.image")
                    : t("section.video")}
                </div>
                <div className="mt-2">
                  {section.media.type === "image" ? (
                    <img
                      src={section.media.url}
                      alt={section.media.altText || getCurrentTitle()}
                      className="max-w-full h-32 object-cover rounded-lg border"
                    />
                  ) : (
                    <video
                      src={section.media.url}
                      className="max-w-full h-32 object-cover rounded-lg border"
                      controls
                    />
                  )}
                </div>
                {section.media.altText && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    <strong>{t("section.altText")}:</strong>{" "}
                    {section.media.altText}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Data */}
          {section.additionalData &&
            Object.keys(section.additionalData).length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">
                  {t("section.additionalData")}
                </h4>
                <div className="bg-muted/20 rounded-lg p-4">
                  <pre className="text-xs text-muted-foreground overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(section.additionalData, null, 2)}
                  </pre>
                </div>
              </div>
            )}

          {/* Status & Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/40">
            <div className="text-sm">
              <span className="font-medium text-muted-foreground">Status:</span>
              <p className="text-foreground mt-1 flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    section.isActive ? "bg-green-500" : "bg-red-500"
                  }`}
                ></span>
                {section.isActive ? "Active" : "Inactive"}
              </p>
            </div>

            {section.createdAt && (
              <div className="text-sm">
                <span className="font-medium text-muted-foreground">
                  Created:
                </span>
                <p className="text-foreground mt-1">
                  {new Date(section.createdAt).toLocaleDateString(
                    i18n.language,
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </div>
            )}

            {section.updatedAt && (
              <div className="text-sm">
                <span className="font-medium text-muted-foreground">
                  Updated:
                </span>
                <p className="text-foreground mt-1">
                  {new Date(section.updatedAt).toLocaleDateString(
                    i18n.language,
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SectionViewModal;
