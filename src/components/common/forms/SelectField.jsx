import React from "react";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SelectField = ({
  name,
  label,
  placeholder,
  options = [],
  valueKey = "id",
  labelKey = "name",
  setFieldValue,
  values,
  required = false,
  emptyOption = null,
}) => {
  const { i18n } = useTranslation();
  const currentValue = values[name] ? values[name].toString() : "none";

  // Get multilingual text based on current language
  const getMultilingualText = (multilingualObj) => {
    if (!multilingualObj || typeof multilingualObj !== "object") return "";
    return (
      multilingualObj[i18n.language] ||
      multilingualObj.az ||
      multilingualObj.en ||
      multilingualObj.ru ||
      ""
    );
  };

  return (
    <div>
      <Label htmlFor={name} className="mb-2 block">
        {label}
      </Label>
      <Select
        value={currentValue}
        onValueChange={(value) => {
          if (value === "none") {
            setFieldValue(name, "");
          } else {
            setFieldValue(name, value);
          }
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {emptyOption && (
            <SelectItem value="none">{emptyOption}</SelectItem>
          )}
          {options.map((option) => (
            <SelectItem
              key={option?.[valueKey]}
              value={option?.[valueKey]?.toString() || ""}
            >
              {typeof option?.[labelKey] === "object"
                ? getMultilingualText(option?.[labelKey]) || `Option ${option?.[valueKey]}`
                : option?.[labelKey] || `Option ${option?.[valueKey]}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectField;
