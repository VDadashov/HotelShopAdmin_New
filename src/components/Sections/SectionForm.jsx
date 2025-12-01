import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DynamicAdditionalData from "./common/DynamicAdditionalData";
import FilePicker from "@/components/common/FilePicker";

const SectionForm = ({
  isOpen,
  onClose,
  editSection,
  onSubmit,
  pageList = [],
  uploadMedia,
}) => {
  const { t, i18n } = useTranslation();
  const [mediaType, setMediaType] = useState("image");
  const [uploading, setUploading] = useState(false);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [additionalDataMode, setAdditionalDataMode] = useState("input");
  const [dynamicFormData, setDynamicFormData] = useState({});
  const [showFilePicker, setShowFilePicker] = useState(false);

  // Parse additional data when editing
  React.useEffect(() => {
    if (editSection?.additionalData) {
      let parsedData = {};
      try {
        parsedData =
          typeof editSection.additionalData === "string"
            ? JSON.parse(editSection.additionalData)
            : editSection.additionalData;
      } catch (e) {
        parsedData = {};
      }
      setDynamicFormData(parsedData);
    } else {
      setDynamicFormData({});
    }
  }, [editSection]);

  const initialValues = editSection
    ? {
        ...editSection,
        additionalData:
          typeof editSection.additionalData === "object"
            ? JSON.stringify(editSection.additionalData, null, 2)
            : editSection.additionalData || "",
      }
    : {
        name: "",
        type: "hero",
        title: { az: "", en: "", ru: "" },
        description: { az: "", en: "", ru: "" },
        pageId: pageList.length > 0 ? pageList[0].id : 0,
        order: 0,
        visibility: "both",
        isActive: true,
        media: null,
        additionalData: "",
      };

  React.useEffect(() => {
    if (editSection?.media) {
      setMediaPreview(editSection.media);
      setMediaType(editSection.media.type || "image");
    }
  }, [editSection]);

  const getPageTitle = (page) => {
    const currentLanguage = i18n.language;
    if (page.title?.[currentLanguage]) {
      return page.title[currentLanguage];
    }
    return (
      page.title?.az ||
      page.title?.en ||
      page.title?.ru ||
      page.name ||
      `Page ${page.id}`
    );
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(t("section.validation.nameRequired")),
    type: Yup.string().required(t("section.validation.typeRequired")),
    title: Yup.object({
      az: Yup.string().required(t("section.validation.titleAzRequired")),
      en: Yup.string().required(t("section.validation.titleEnRequired")),
      ru: Yup.string().required(t("section.validation.titleRuRequired")),
    }),
    pageId: Yup.number().required(),
    additionalData: Yup.string().test(
      "is-json",
      "Invalid JSON format",
      function (value) {
        if (!value || additionalDataMode === "input") return true;
        try {
          JSON.parse(value);
          return true;
        } catch (e) {
          return false;
        }
      }
    ),
  });

  const handleFileUpload = async (event, setFieldValue) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!uploadMedia) {
      return;
    }

    try {
      setUploading(true);
      const uploadedMedia = await uploadMedia(file, mediaType);
      setMediaPreview(uploadedMedia);
      setFieldValue("media", uploadedMedia);
    } catch (error) {
      // File upload failed
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    let processedAdditionalData = null;

    if (additionalDataMode === "input") {
      // Use dynamic form data (already processed by DynamicAdditionalData)
      processedAdditionalData =
        Object.keys(dynamicFormData).length > 0 ? dynamicFormData : null;
    } else {
      // JSON mode
      if (values.additionalData && values.additionalData.trim()) {
        try {
          processedAdditionalData = JSON.parse(values.additionalData);
        } catch (error) {
          processedAdditionalData = null;
        }
      }
    }

    const cleanValues = {
      name: values.name,
      type: values.type,
      title: values.title,
      description: values.description,
      pageId: Number(values.pageId),
      order: values.order || 0,
      visibility: values.visibility || "both",
      isActive: values.isActive !== undefined ? values.isActive : true,
      media: values.media,
      additionalData: processedAdditionalData,
    };

    onSubmit(cleanValues, { setSubmitting, resetForm });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full rounded-2xl shadow-2xl bg-card dark:bg-[#232323] p-8 border-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-foreground">
            {editSection ? t("section.editSection") : t("section.addSection")}
          </DialogTitle>
        </DialogHeader>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="mb-2 block">
                    {t("section.sectionName")}
                  </Label>
                  <Field
                    as={Input}
                    name="name"
                    id="name"
                    placeholder={t("section.sectionNamePlaceholder")}
                    required
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="type" className="mb-2 block">
                    {t("section.sectionType")}
                  </Label>
                  <Select
                    value={values.type}
                    onValueChange={(value) => {
                      setFieldValue("type", value);
                      // Reset dynamic form data when type changes
                      setDynamicFormData({});
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("section.selectType")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hero">Hero</SelectItem>
                      <SelectItem value="content">Content</SelectItem>
                      <SelectItem value="about">About</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="gallery">Gallery</SelectItem>
                      <SelectItem value="contact">Contact</SelectItem>
                      <SelectItem value="footer">Footer</SelectItem>
                      <SelectItem value="navbar">Navbar</SelectItem>
                      <SelectItem value="testimonial">Testimonial</SelectItem>
                      <SelectItem value="blog">Blog</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <ErrorMessage
                    name="type"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              </div>

              {/* Page ID and Visibility */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pageId" className="mb-2 block">
                    {t("section.page")}
                  </Label>
                  <Select
                    value={
                      values.pageId?.toString() ||
                      (pageList.length > 0 ? pageList[0].id.toString() : "")
                    }
                    onValueChange={(value) =>
                      setFieldValue("pageId", Number(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("section.selectPage")} />
                    </SelectTrigger>
                    <SelectContent>
                      {pageList.map((page) => (
                        <SelectItem key={page.id} value={page.id.toString()}>
                          {getPageTitle(page)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ErrorMessage
                    name="pageId"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="visibility" className="mb-2 block">
                    {t("section.visibility")}
                  </Label>
                  <Select
                    value={values.visibility}
                    onValueChange={(value) =>
                      setFieldValue("visibility", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("section.selectVisibility")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="both">{t("section.both")}</SelectItem>
                      <SelectItem value="desktop">
                        {t("section.desktop")}
                      </SelectItem>
                      <SelectItem value="mobile">
                        {t("section.mobile")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Titles */}
              <div>
                <Label className="mb-3 block font-semibold">
                  {t("section.sectionTitle")}
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="title.az" className="mb-2 block text-sm">
                      {t("section.sectionTitle")} (az)
                    </Label>
                    <Field
                      as={Input}
                      name="title.az"
                      id="title.az"
                      placeholder={t("section.titlePlaceholder")}
                      required
                    />
                    <ErrorMessage
                      name="title.az"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="title.en" className="mb-2 block text-sm">
                      {t("section.sectionTitle")} (en)
                    </Label>
                    <Field
                      as={Input}
                      name="title.en"
                      id="title.en"
                      placeholder={t("section.titlePlaceholder")}
                      required
                    />
                    <ErrorMessage
                      name="title.en"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="title.ru" className="mb-2 block text-sm">
                      {t("section.sectionTitle")} (ru)
                    </Label>
                    <Field
                      as={Input}
                      name="title.ru"
                      id="title.ru"
                      placeholder={t("section.titlePlaceholder")}
                      required
                    />
                    <ErrorMessage
                      name="title.ru"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <Label className="mb-3 block font-semibold">
                  {t("section.sectionDescription")}
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label
                      htmlFor="description.az"
                      className="mb-2 block text-sm"
                    >
                      {t("section.sectionDescription")} (az)
                    </Label>
                    <Field
                      as={Textarea}
                      name="description.az"
                      id="description.az"
                      placeholder={t("section.descriptionPlaceholder")}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="description.en"
                      className="mb-2 block text-sm"
                    >
                      {t("section.sectionDescription")} (en)
                    </Label>
                    <Field
                      as={Textarea}
                      name="description.en"
                      id="description.en"
                      placeholder={t("section.descriptionPlaceholder")}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="description.ru"
                      className="mb-2 block text-sm"
                    >
                      {t("section.sectionDescription")} (ru)
                    </Label>
                    <Field
                      as={Textarea}
                      name="description.ru"
                      id="description.ru"
                      placeholder={t("section.descriptionPlaceholder")}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Media Upload Section */}
              <div className="space-y-4">
                <Label className="block font-semibold">
                  {t("section.media")}
                </Label>

                <div>
                  <Label className="mb-2 block text-sm">
                    {t("section.mediaType")}
                  </Label>
                  <Select value={mediaType} onValueChange={setMediaType}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">
                        {t("section.image")}
                      </SelectItem>
                      <SelectItem value="video">
                        {t("section.video")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2 block text-sm">
                    {mediaType === "image"
                      ? t("section.selectImage")
                      : t("section.selectVideo")}
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowFilePicker(true)}
                    disabled={!uploadMedia}
                    className="w-full sm:w-auto"
                  >
                    {mediaType === "image" ? t("section.selectImage") : t("section.selectVideo")}
                  </Button>
                  
                  {/* FilePicker Modal */}
                  <FilePicker
                    isOpen={showFilePicker}
                    onClose={() => setShowFilePicker(false)}
                    onSelect={(url) => {
                      setMediaPreview({
                        type: mediaType,
                        url: url
                      });
                      setFieldValue('media', {
                        type: mediaType,
                        url: url
                      });
                      setShowFilePicker(false);
                    }}
                    acceptTypes={mediaType === "image" ? ["image"] : ["video"]}
                    title={mediaType === "image" ? t("section.selectImage") : t("section.selectVideo")}
                  />
                </div>

                {mediaPreview && (
                  <div className="border rounded-lg p-4">
                    <Label className="mb-2 block text-sm font-medium">
                      {t("section.preview")}
                    </Label>
                    {mediaPreview.type === "image" ? (
                      <img
                        src={mediaPreview.url}
                        alt="Preview"
                        className="max-w-xs max-h-48 object-cover rounded"
                      />
                    ) : (
                      <video
                        src={mediaPreview.url}
                        controls
                        className="max-w-xs max-h-48 rounded"
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Dynamic Additional Data */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="block font-semibold">
                    {t("section.additionalData")}
                  </Label>
                  <Select
                    value={additionalDataMode}
                    onValueChange={setAdditionalDataMode}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="input">Input</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {additionalDataMode === "input" ? (
                  <div className="bg-muted/20 rounded-lg p-4">
                    <DynamicAdditionalData
                      sectionType={values.type}
                      value={dynamicFormData}
                      onChange={setDynamicFormData}
                    />
                  </div>
                ) : (
                  <div>
                    <Field
                      as={Textarea}
                      name="additionalData"
                      id="additionalData"
                      placeholder={`{
  "buttonText": {
    "az": "Başla",
    "en": "Get Started", 
    "ru": "Начать"
  },
  "buttonUrl": "/contact"
}`}
                      rows={8}
                      className="font-mono text-sm"
                    />
                    <ErrorMessage
                      name="additionalData"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      Enter valid JSON format for additional data
                    </div>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting || uploading}
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  type="submit"
                  className="bg-[rgb(var(--primary-brand))] text-black font-semibold hover:bg-[rgb(var(--primary-brand-hover))]"
                  disabled={isSubmitting || uploading}
                >
                  {isSubmitting
                    ? editSection
                      ? t("section.updating")
                      : t("section.creating")
                    : editSection
                    ? t("common.save")
                    : t("common.add")}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default SectionForm;
