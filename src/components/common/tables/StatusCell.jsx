import React from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle, XCircle } from "lucide-react";

const StatusCell = ({ isActive, activeText = "common.active", inactiveText = "common.inactive" }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center space-x-2">
      {isActive ? (
        <>
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            {t(activeText)}
          </span>
        </>
      ) : (
        <>
          <XCircle className="h-4 w-4 text-red-600" />
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            {t(inactiveText)}
          </span>
        </>
      )}
    </div>
  );
};

export default StatusCell;
