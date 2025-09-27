import React from "react";
import { Label } from "@/components/ui/label";
import FieldRenderer from "./FieldRenderer";
import { getDefaultFieldValue } from "./fieldConfigs";

const ObjectField = ({
  label,
  value = {},
  onChange,
  objectFields = [],
  required = false,
}) => {
  const updateField = (fieldKey, fieldValue) => {
    onChange({
      ...value,
      [fieldKey]: fieldValue,
    });
  };

  return (
    <div className="space-y-4">
      <Label className="block font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      <div className="bg-muted/10 p-4 rounded-lg border space-y-4">
        {objectFields.map((field) => (
          <FieldRenderer
            key={field.key}
            field={field}
            value={value[field.key] || getDefaultFieldValue(field.type)}
            onChange={(fieldValue) => updateField(field.key, fieldValue)}
          />
        ))}
      </div>
    </div>
  );
};

export default ObjectField;
