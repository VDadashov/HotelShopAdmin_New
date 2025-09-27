import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import FieldRenderer from "./FieldRenderer";
import { getDefaultFieldValue } from "./fieldConfigs";

const ArrayField = ({
  label,
  value = [],
  onChange,
  itemFields = [],
  required = false,
}) => {
  const addItem = () => {
    const newItem = {};
    itemFields.forEach((field) => {
      newItem[field.key] = getDefaultFieldValue(field.type);
    });
    onChange([...value, newItem]);
  };

  const removeItem = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const updateItem = (index, fieldKey, fieldValue) => {
    const updatedItems = value.map((item, i) =>
      i === index ? { ...item, [fieldKey]: fieldValue } : item
    );
    onChange(updatedItems);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <Button type="button" size="sm" onClick={addItem} variant="outline">
          + Add {label.slice(0, -1)} {/* Remove 's' from plural */}
        </Button>
      </div>

      <div className="space-y-3">
        {value.map((item, index) => (
          <div key={index} className="bg-muted/20 p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">
                {label.slice(0, -1)} #{index + 1}
              </span>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => removeItem(index)}
              >
                ×
              </Button>
            </div>

            <div className="space-y-3">
              {itemFields.map((field) => (
                <FieldRenderer
                  key={field.key}
                  field={field}
                  value={item[field.key] || getDefaultFieldValue(field.type)}
                  onChange={(fieldValue) =>
                    updateItem(index, field.key, fieldValue)
                  }
                />
              ))}
            </div>
          </div>
        ))}

        {value.length === 0 && (
          <div className="text-sm text-muted-foreground text-center py-4 border-2 border-dashed rounded-lg">
            No {label.toLowerCase()} added yet. Click "Add {label.slice(0, -1)}"
            to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default ArrayField;
