// Section field configurations
export const sectionFieldConfigs = {
  footer: {
    fields: [
      {
        key: "logo",
        type: "object",
        label: "Logo Information",
        objectFields: [
          
          {
            key: "subtitle",
            type: "text",
            label: "Logo Subtitle",
            placeholder: "hotel spa boutique",
            required: false,
          },
          
        ],
      },
      {
        key: "mainPages",
        type: "object",
        label: "Main Pages Section",
        objectFields: [
          {
            key: "title",
            type: "multilingual",
            label: "Section Title",
            placeholder: "Əsas səhifələr",
            required: false,
          },
          {
            key: "links",
            type: "array",
            label: "Page Links",
            itemFields: [
              {
                key: "text",
                type: "multilingual",
                label: "Link Text",
                placeholder: "Ana Səhifə",
                required: true,
              },
              {
                key: "url",
                type: "text",
                label: "Link URL",
                placeholder: "/",
                required: true,
              },
            ],
          },
        ],
      },
      {
        key: "usefulLinks",
        type: "object",
        label: "Useful Links Section",
        objectFields: [
          {
            key: "title",
            type: "multilingual",
            label: "Section Title",
            placeholder: "Faydalı linklər",
            required: false,
          },
          {
            key: "links",
            type: "array",
            label: "Useful Links",
            itemFields: [
              {
                key: "text",
                type: "multilingual",
                label: "Link Text",
                placeholder: "FAQ",
                required: true,
              },
              {
                key: "url",
                type: "text",
                label: "Link URL",
                placeholder: "/faq",
                required: true,
              },
            ],
          },
        ],
      },
      {
        key: "socialMedia",
        type: "object",
        label: "Social Media Section",
        objectFields: [
          {
            key: "title",
            type: "multilingual",
            label: "Section Title",
            placeholder: "Bizi izləyin",
            required: false,
          },
          {
            key: "platforms",
            type: "array",
            label: "Social Media Platforms",
            itemFields: [
              {
                key: "platform",
                type: "text",
                label: "Platform Name",
                placeholder: "facebook",
                required: true,
              },
              {
                key: "url",
                type: "text",
                label: "Profile URL",
                placeholder: "https://facebook.com/hotelshop",
                required: true,
              },
              {
                key: "icon",
                type: "text",
                label: "Icon Name",
                placeholder: "facebook",
                required: false,
              },
            ],
          },
        ],
      },
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
            key: "companyName",
            type: "text",
            label: "Company Name",
            placeholder: "HotelShop",
            required: false,
          },
          {
            key: "poweredBy",
            type: "text",
            label: "Powered By",
            placeholder: "Rockvell",
            required: false,
          },
          {
            key: "fullText",
            type: "multilingual",
            label: "Full Copyright Text",
            placeholder: "Copyright © 2025 HotelShop | Powered by Rockvell",
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
