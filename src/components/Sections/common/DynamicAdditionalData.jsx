import React from "react";
import { sectionFieldConfigs, getDefaultFieldValue } from "./fieldConfigs";
import FieldRenderer from "./FieldRenderer";

const DynamicAdditionalData = ({ sectionType, value = {}, onChange }) => {
  const config = sectionFieldConfigs[sectionType];

  if (!config || !config.fields || config.fields.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>
          No additional data fields configured for "{sectionType}" section type.
        </p>
        <p className="text-xs mt-2">
          You can use JSON mode to add custom data.
        </p>
      </div>
    );
  }

  const updateField = (fieldKey, fieldValue) => {
    // Remove field if value is empty/default
    const isEmptyValue = (val) => {
      if (val === null || val === undefined || val === "") return true;
      if (Array.isArray(val) && val.length === 0) return true;
      if (typeof val === "object" && Object.keys(val).length === 0) return true;
      if (
        typeof val === "object" &&
        val.az === "" &&
        val.en === "" &&
        val.ru === ""
      )
        return true;
      return false;
    };

    const newValue = { ...value };

    if (isEmptyValue(fieldValue)) {
      delete newValue[fieldKey];
    } else {
      newValue[fieldKey] = fieldValue;
    }

    onChange(newValue);
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground mb-4">
        Configure additional data for{" "}
        <span className="font-medium capitalize">{sectionType}</span> section
      </div>

      {config.fields.map((field) => (
        <FieldRenderer
          key={field.key}
          field={field}
          value={value[field.key] || getDefaultFieldValue(field.type)}
          onChange={(fieldValue) => updateField(field.key, fieldValue)}
        />
      ))}
    </div>
  );
};

export default DynamicAdditionalData;
