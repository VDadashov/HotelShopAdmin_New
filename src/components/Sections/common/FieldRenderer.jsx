import React from "react";
import MultilingualField from "./MultilingualField";
import BasicField from "./BasicField";
import ArrayField from "./ArrayField";
import ObjectField from "./ObjectField";

const FieldRenderer = ({ field, value, onChange }) => {
  const { type, key, ...fieldProps } = field;

  switch (type) {
    case "multilingual":
      return (
        <MultilingualField {...fieldProps} value={value} onChange={onChange} />
      );

    case "text":
    case "number":
      return (
        <BasicField
          {...fieldProps}
          type={type}
          value={value}
          onChange={onChange}
        />
      );

    case "array":
      return <ArrayField {...fieldProps} value={value} onChange={onChange} />;

    case "object":
      return <ObjectField {...fieldProps} value={value} onChange={onChange} />;

    case "boolean":
      return (
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <label className="text-sm font-medium">
            {fieldProps.label}
            {fieldProps.required && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </label>
        </div>
      );

    default:
      return <BasicField {...fieldProps} value={value} onChange={onChange} />;
  }
};

export default FieldRenderer;
