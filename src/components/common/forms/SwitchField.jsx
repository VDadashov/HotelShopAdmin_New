import React from "react";
import { Field } from "formik";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const SwitchField = ({
  name,
  label,
  description,
  setFieldValue,
  values,
}) => {
  
  // Ensure values is not undefined and get the current value
  const safeValues = values || {};
  const currentValue = safeValues[name];
  
  
  const handleChange = (checked) => {
    if (setFieldValue && typeof setFieldValue === 'function') {
      setFieldValue(name, checked);
    }
  };
  
  return (
    <div className="flex items-center justify-between">
      <div>
        <Label htmlFor={name} className="text-sm font-medium">
          {label}
        </Label>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <Switch
        id={name}
        checked={Boolean(currentValue)}
        onCheckedChange={handleChange}
      />
    </div>
  );
};

export default SwitchField;
