import React from "react";
import { Field, ErrorMessage } from "formik";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MultilingualField = ({
  name,
  label,
  placeholder,
  required = true,
  className = "",
  type = "text",
  languages = ["az", "en", "ru"],
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{label}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {languages.map((lang) => (
          <div key={lang}>
            <Label htmlFor={`${name}.${lang}`} className="mb-2 block">
              {label} ({lang})
            </Label>
            <Field
              as={Input}
              name={`${name}.${lang}`}
              id={`${name}.${lang}`}
              placeholder={typeof placeholder === 'object' ? placeholder[lang] : placeholder}
              className={`mb-2 ${className}`}
              required={required}
              type={type}
            />
            <ErrorMessage
              name={`${name}.${lang}`}
              component="div"
              className="text-red-500 text-xs mt-1"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultilingualField;
