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
  console.log('SwitchField - name:', name);
  console.log('SwitchField - values:', values);
  console.log('SwitchField - values[name]:', values?.[name]);
  
  // Ensure values is not undefined and get the current value
  const safeValues = values || {};
  const currentValue = safeValues[name];
  
  console.log('SwitchField - currentValue:', currentValue);
  console.log('SwitchField - typeof currentValue:', typeof currentValue);
  
  const handleChange = (checked) => {
    console.log('SwitchField - onCheckedChange:', checked);
    console.log('SwitchField - setFieldValue function:', setFieldValue);
    console.log('SwitchField - name:', name);
    
    // Ensure setFieldValue is available
    if (setFieldValue && typeof setFieldValue === 'function') {
      try {
        setFieldValue(name, checked);
        console.log('SwitchField - setFieldValue called successfully');
      } catch (error) {
        console.error('SwitchField - setFieldValue error:', error);
      }
    } else {
      console.error('SwitchField - setFieldValue is not available or not a function');
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
