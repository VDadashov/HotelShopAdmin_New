import React from "react";
import { useTranslation } from "react-i18next";

const MultilingualCell = ({ 
  value, 
  fallbackKey = "name",
  showAllLanguages = false 
}) => {
  const { i18n } = useTranslation();

  if (!value) return <span className="text-gray-400 dark:text-gray-500">-</span>;

  if (typeof value === "string") {
    return <span>{value}</span>;
  }

  if (typeof value === "object" && value !== null) {
    const currentLanguageValue = value[i18n.language] || value.az || value.en || value.ru || "";
    
    if (showAllLanguages) {
      return (
        <div className="space-y-1">
          <div className="font-medium">{currentLanguageValue}</div>
          <div className="text-xs text-muted-foreground">
            <div><strong>AZ:</strong> {value.az || "-"}</div>
            <div><strong>EN:</strong> {value.en || "-"}</div>
            <div><strong>RU:</strong> {value.ru || "-"}</div>
          </div>
        </div>
      );
    }

    return <div className="flex items-center">{currentLanguageValue}</div>;
  }

  return <span className="text-gray-400 dark:text-gray-500">-</span>;
};

export default MultilingualCell;
