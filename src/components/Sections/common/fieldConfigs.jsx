// Section field configurations
export const sectionFieldConfigs = {
  footer: {
    fields: [
      {
        key: "copyright",
        type: "object",
        label: "Copyright Information",
        objectFields: [
          {
            key: "year",
            type: "text",
            label: "Copyright Year",
            placeholder: "2025",
            required: false,
          },
          {
            key: "text",
            type: "multilingual",
            label: "Copyright Text",
            fieldType: "textarea",
            required: false,
          },
        ],
      },
      {
        key: "companyInfo",
        type: "object",
        label: "Company Information",
        objectFields: [
          {
            key: "name",
            type: "text",
            label: "Company Name",
            placeholder: "G-STONE",
            required: false,
          },
          {
            key: "contact",
            type: "object",
            label: "Contact Information",
            objectFields: [
              {
                key: "phone",
                type: "text",
                label: "Phone",
                placeholder: "+39 049 9299011",
                required: false,
              },
              {
                key: "email",
                type: "text",
                label: "Email",
                placeholder: "info@gstonegallery",
                required: false,
              },
              {
                key: "fax",
                type: "text",
                label: "Fax",
                placeholder: "+39 049 9299000",
                required: false,
              },
            ],
          },
          {
            key: "location",
            type: "multilingual",
            label: "Location",
            required: false,
          },
        ],
      },
      {
        key: "socialMedia",
        type: "array",
        label: "Social Media Links",
        itemFields: [
          {
            key: "platform",
            type: "text",
            label: "Platform",
            placeholder: "instagram",
            required: true,
          },
          {
            key: "url",
            type: "text",
            label: "URL",
            placeholder: "https://instagram.com/gstonegallery",
            required: true,
          },
          {
            key: "icon",
            type: "text",
            label: "Icon Name",
            placeholder: "instagram",
            required: false,
          },
        ],
      },
    ],
  },

  hero: {
    fields: [
      {
        key: "isSearchActive",
        type: "boolean",
        label: "Enable Search",
        required: false,
      },
    ],
  },

  content: {
    fields: [
      {
        key: "title",
        type: "multilingual",
        label: "Section Title",
        required: false,
      },
      {
        key: "description",
        type: "multilingual",
        label: "Section Description",
        required: false,
      },
      {
        key: "Yazi",
        type: "multilingual",
        label: "Section Yazi",
        required: false,
      },
    ],
  },
};

// Default values for different field types
export const getDefaultFieldValue = (fieldType) => {
  switch (fieldType) {
    case "multilingual":
      return { az: "", en: "", ru: "" };
    case "array":
      return [];
    case "object":
      return {};
    case "boolean":
      return false;
    case "number":
      return 0;
    default:
      return "";
  }
};
