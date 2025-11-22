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
        key: "subtitle",
        type: "multilingual",
        label: "Hero Subtitle",
        placeholder: "ƏLAQƏ SAXLAYIN",
        required: false,
      },
      {
        key: "title",
        type: "multilingual",
        label: "Hero Title",
        placeholder: "Bizimlə əlaqə qurmaq çox asandır",
        required: false,
      },
      {
        key: "description",
        type: "multilingual",
        label: "Hero Description",
        placeholder: "Əgər hər hansı bir sualınız varsa birbaşa saytdan bizə ünvanlaya bilərsiniz. Komandamız sizə yardım etməyə həmişə hazırdır.",
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
  contact: {
    fields: [
      {
        key: "pageTitle",
        type: "multilingual",
        label: "Page Title",
        placeholder: "Bizimlə əlaqə",
        required: false,
      },
      {
        key: "pageDescription",
        type: "multilingual",
        label: "Page Description",
        placeholder: "Əgər hər hansı bir sualınız varsa birbaşa saytdan bizə ünvanlaya bilərsiniz.",
        required: false,
      },
      {
        key: "address",
        type: "multilingual",
        label: "Address",
        placeholder: "Bakı şəhəri, Nərimanov rayonu, H.Əliyev 56",
        required: false,
      },
      {
        key: "email",
        type: "text",
        label: "Email Address",
        placeholder: "info@hotelshop.az",
        required: false,
      },
      {
        key: "phone",
        type: "text",
        label: "Phone Number",
        placeholder: "+994 55 555 55 55",
        required: false,
      },
      {
        key: "formNameLabel",
        type: "multilingual",
        label: "Name Field Label",
        placeholder: "Adınız",
        required: false,
      },
      {
        key: "formNamePlaceholder",
        type: "multilingual",
        label: "Name Field Placeholder",
        placeholder: "Adınızı daxil edin",
        required: false,
      },
      {
        key: "formEmailLabel",
        type: "multilingual",
        label: "Email Field Label",
        placeholder: "E-mail",
        required: false,
      },
      {
        key: "formEmailPlaceholder",
        type: "multilingual",
        label: "Email Field Placeholder",
        placeholder: "Email ünvanınız",
        required: false,
      },
      {
        key: "formMessageLabel",
        type: "multilingual",
        label: "Message Field Label",
        placeholder: "Mətn",
        required: false,
      },
      {
        key: "formMessagePlaceholder",
        type: "multilingual",
        label: "Message Field Placeholder",
        placeholder: "Mesajınızı yazın...",
        required: false,
      },
      {
        key: "submitButtonText",
        type: "multilingual",
        label: "Submit Button Text",
        placeholder: "Göndər",
        required: false,
      },
      {
        key: "mapIframeUrl",
        type: "text",
        label: "Google Maps Iframe URL",
        placeholder: "https://www.google.com/maps/embed?pb=!1m18!1m12...",
        required: false,
      },
      {
        key: "workingHours",
        type: "multilingual",
        label: "Working Hours",
        placeholder: "09:00 - 18:00 (B.e - C.a)",
        required: false,
      },
      {
        key: "contactInfoTitle",
        type: "multilingual",
        label: "Contact Info Title",
        placeholder: "Əlaqə məlumatları",
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
