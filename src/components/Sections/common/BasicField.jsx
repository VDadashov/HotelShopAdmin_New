import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const BasicField = ({
  label,
  value = "",
  onChange,
  type = "text",
  fieldType = "input",
  placeholder = "",
  required = false,
}) => {
  const handleChange = (e) => {
    const newValue =
      type === "number" ? Number(e.target.value) : e.target.value;
    onChange(newValue);
  };

  const Component = fieldType === "textarea" ? Textarea : Input;
  const componentProps = {
    ...(fieldType === "textarea" ? { rows: 3 } : {}),
    ...(type === "number" ? { type: "number" } : { type: "text" }),
  };

  return (
    <div className="space-y-2">
      <Label className="block font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Component
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        {...componentProps}
      />
    </div>
  );
};

export default BasicField;
