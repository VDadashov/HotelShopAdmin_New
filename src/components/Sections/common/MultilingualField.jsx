import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const MultilingualField = ({
  label,
  value,
  onChange,
  fieldType = "input",
  placeholder = "",
  required = false,
}) => {
  // Ensure value is always an object with the expected structure
  const safeValue = React.useMemo(() => {
    if (!value || typeof value !== "object") {
      return { az: "", en: "", ru: "" };
    }
    return {
      az: value.az || "",
      en: value.en || "",
      ru: value.ru || "",
    };
  }, [value]);

  const handleChange = React.useCallback(
    (lang, newValue) => {
      if (onChange) {
        onChange({
          ...safeValue,
          [lang]: newValue,
        });
      }
    },
    [safeValue, onChange]
  );

  const Component = fieldType === "textarea" ? Textarea : Input;
  const componentProps = fieldType === "textarea" ? { rows: 3 } : {};

  return (
    <div className="space-y-3">
      <Label className="block font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label className="mb-1 block text-xs">{label} (az)</Label>
          <Component
            value={safeValue.az}
            onChange={(e) => handleChange("az", e.target.value)}
            placeholder={placeholder ? `${placeholder} (az)` : ""}
            {...componentProps}
          />
        </div>
        <div>
          <Label className="mb-1 block text-xs">{label} (en)</Label>
          <Component
            value={safeValue.en}
            onChange={(e) => handleChange("en", e.target.value)}
            placeholder={placeholder ? `${placeholder} (en)` : ""}
            {...componentProps}
          />
        </div>
        <div>
          <Label className="mb-1 block text-xs">{label} (ru)</Label>
          <Component
            value={safeValue.ru}
            onChange={(e) => handleChange("ru", e.target.value)}
            placeholder={placeholder ? `${placeholder} (ru)` : ""}
            {...componentProps}
          />
        </div>
      </div>
    </div>
  );
};

export default MultilingualField;
