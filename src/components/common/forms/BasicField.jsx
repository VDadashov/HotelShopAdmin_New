import React from "react";
import { Field, ErrorMessage } from "formik";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BasicField = ({
  name,
  label,
  placeholder,
  type = "text",
  required = false,
  className = "",
  min,
  max,
}) => {
  return (
    <div>
      <Label htmlFor={name} className="mb-2 block">
        {label}
      </Label>
      <Field
        as={Input}
        name={name}
        id={name}
        type={type}
        placeholder={placeholder}
        className={`mb-2 ${className}`}
        required={required}
        min={min}
        max={max}
      />
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-xs mt-1"
      />
    </div>
  );
};

export default BasicField;
