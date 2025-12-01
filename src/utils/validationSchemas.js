import * as Yup from "yup";
import { useTranslation } from "react-i18next";

export const createMultilingualValidation = (fieldName, titleKey) => {
  const { t } = useTranslation();
  
  return Yup.object({
    az: Yup.string().required(t(`${titleKey}.validation.${fieldName}AzRequired`)),
  });
};

export const createBasicValidation = (fields) => {
  return Yup.object(fields);
};

export const commonValidations = {
  createBasicValidation: createBasicValidation,
  multilingualName: (titleKey) => createMultilingualValidation("name", titleKey),
  multilingualTitle: (titleKey) => createMultilingualValidation("title", titleKey),
  multilingualDescription: (titleKey) => createMultilingualValidation("description", titleKey),
  index: (titleKey) => {
    const { t } = useTranslation();
    return Yup.number().min(0, t(`${titleKey}.validation.indexInvalid`));
  },
  isActive: Yup.boolean(),
  parentId: Yup.number().nullable(),
  required: (message) => Yup.string().required(message),
  rating: (message) => Yup.number().min(1, message).max(5, message).required(message),
  imageUrl: Yup.string().url(),
};
