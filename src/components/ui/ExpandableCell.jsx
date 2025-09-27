import React, { useState } from "react";

export default function ExpandableCell({ value, maxLength = 50 }) {
  const [expanded, setExpanded] = useState(false);
  if (!value) return null;
  const isLong = value.length > maxLength;
  const displayText = !isLong || expanded ? value : value.slice(0, maxLength) + "...";

  return (
    <span>
      {displayText}
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="ml-2 text-blue-600  text-xs focus:outline-none cursor-pointer"
        >
          {expanded ? "close" : "more"}
        </button>
      )}
    </span>
  );
} 