import * as React from "react";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useGet } from "@/utils/hooks/useCustomQuery";
import { usePost, useDelete, usePatch } from "@/utils/hooks/useCustomMutation";
import { ENDPOINTS } from "@/utils/constants/Endpoints";

// Import components
import SectionForm from "@/components/Sections/SectionForm";
import SectionViewModal from "@/components/Sections/SectionViewModal";
import SectionDeleteModal from "@/components/Sections/SectionDeleteModal";
import SectionTable from "@/components/Sections/SectionTable";

export default function Section() {
  const { t } = useTranslation();

  const [showCreate, setShowCreate] = useState(false);
  const [editSection, setEditSection] = useState(null);
  const [deleteSection, setDeleteSection] = useState(null);
  const [viewSection, setViewSection] = useState(null);

  const { data: sectionList = [] } = useGet(
    "sections",
    `${ENDPOINTS.sections}?allLanguages=true`
  );

  // Page list məlumatlarını almaq
  const { data: pageList = [] } = useGet(
    "pages",
    `${ENDPOINTS.pages}?allLanguages=true`
  );

  const createSection = usePost("section", ENDPOINTS.sections);
  const updateSection = usePatch(
    "sections",
    ENDPOINTS.sections,
    editSection?.id
  );
  const deleteSectionMutation = useDelete(
    "sections",
    ENDPOINTS.sections,
    deleteSection?.id
  );

  // Upload mutations
  const uploadImageMutation = usePost("upload-image", ENDPOINTS.uploadImage);
  const uploadVideoMutation = usePost("upload-video", ENDPOINTS.uploadVideo);

  const tableData = useMemo(() => {
    let rawData = Array.isArray(sectionList)
      ? sectionList
      : Array.isArray(sectionList?.data)
      ? sectionList.data
      : [];
    return rawData.map((item) => ({
      ...item,
      searchableTitle: item.title ? Object.values(item.title).join(" ") : "",
      searchableName: item.name || "",
      searchText: [
        item.title ? Object.values(item.title).join(" ") : "",
        item.name || "",
        item.type || "",
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    }));
  }, [sectionList]);

  // Page list-i formatlaşdırmaq
  const formattedPageList = useMemo(() => {
    let rawData = Array.isArray(pageList)
      ? pageList
      : Array.isArray(pageList?.data)
      ? pageList.data
      : [];
    return rawData;
  }, [pageList]);

  // Edit üçün açılan modalı idarə et
  const handleEdit = (section) => {
    setEditSection(section);
    setShowCreate(true);
  };

  // Media upload funksiyasını düzəldilmiş versiyası
  const uploadMedia = async (file, type) => {
    const formData = new FormData();

    // Server "file" field adını gözləyir
    formData.append("file", file);

    try {
      // ENDPOINTS sabitindən düzgün URL-ləri istifadə et
      const uploadUrl =
        type === "image" ? ENDPOINTS.uploadImage : ENDPOINTS.uploadVideo;

      // Authorization header və ya digər lazımi header-ları əlavə et
      const headers = {};

      // Əgər authentication token varsa
      const token = localStorage.getItem("auth-token"); // və ya sessionStorage
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      console.log(
        "Uploading file:",
        file.name,
        "Type:",
        type,
        "URL:",
        uploadUrl
      );

      const response = await fetch(uploadUrl, {
        method: "POST",
        headers, // Content-Type-ı qoyma, browser avtomatik təyin edəcək
        body: formData,
      });

      console.log("Upload response status:", response.status);

      // Response-u oxumaq üçün əvvəlcə text olaraq oxu
      const responseText = await response.text();
      console.log("Response text:", responseText);

      if (!response.ok) {
        // Serverdən gələn xəta mesajını göstər
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          // JSON parse edilə bilmirsə, response text-ini istifadə et
          if (responseText) {
            errorMessage = responseText;
          }
        }

        throw new Error(errorMessage);
      }

      // Response-u JSON olaraq parse et
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        throw new Error("Server invalid response format returned");
      }

      console.log("Upload successful:", data);
      return data.media || data.url || data.path || data; // Müxtəlif response format-larını dəstəklə
    } catch (error) {
      console.error("Upload error:", error);

      // Network error-ları üçün daha anlaşıqlı mesaj
      if (
        error.name === "TypeError" &&
        error.message.includes("Failed to fetch")
      ) {
        toast.error("Network error: Unable to connect to server");
      } else {
        toast.error(`Upload failed: ${error.message}`);
      }

      throw error;
    }
  };

  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      console.log("Form submit başladı:", values);

      // Media upload məsələsini həll et
      let finalValues = { ...values };

      // Əgər media faylı varsa və yüklənməyibsə, əvvəlcə yüklə
      if (values.mediaFile && !values.media) {
        console.log("Media faylı yüklənir...");
        const uploadedMedia = await uploadMedia(
          values.mediaFile,
          values.mediaType || "image"
        );
        finalValues.media = uploadedMedia;
        delete finalValues.mediaFile; // Temp field-i sil
        delete finalValues.mediaType; // Temp field-i sil
      }

      // Media məlumatını values-dan götür (SectionForm-dan gəlir)
      if (!finalValues.media && values.media) {
        finalValues.media = values.media;
      }

      console.log("Final values hazırlandı:", finalValues);

      if (editSection) {
        console.log("Section update edilir...", editSection.id);
        updateSection.mutate(finalValues, {
          onSuccess: (response) => {
            console.log("Update uğurlu:", response);
            toast.success(t("section.sectionUpdated"));
            setShowCreate(false);
            setEditSection(null);
            resetForm();
          },
          onError: (error) => {
            console.error("Update xətası:", error);
            toast.error(
              error?.response?.data?.message ||
                error?.message ||
                t("common.error")
            );
          },
          onSettled: () => setSubmitting(false),
        });
      } else {
        console.log("Yeni section yaradılır...");
        createSection.mutate(finalValues, {
          onSuccess: (response) => {
            console.log("Create uğurlu:", response);
            toast.success(t("section.sectionAdded"));
            setShowCreate(false);
            resetForm();
          },
          onError: (error) => {
            console.error("Create xətası:", error);
            toast.error(
              error?.response?.data?.message ||
                error?.message ||
                t("common.error")
            );
          },
          onSettled: () => setSubmitting(false),
        });
      }
    } catch (error) {
      console.error("Form submit xətası:", error);
      toast.error(`Error: ${error.message}`);
      setSubmitting(false);
    }
  };


  const handleDelete = () => {
    if (!deleteSection || !deleteSection.id) return;
    deleteSectionMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success(t("section.sectionDeleted"));
        setDeleteSection(null);
      },
      onError: (error) => {
        toast.error(error?.message || t("common.error"));
      },
    });
  };

  return (
    <div className="w-full mx-auto py-10 px-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">{t("section.title")}</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            onClick={() => {
              setShowCreate(true);
              setEditSection(null);
            }}
            className="bg-[rgb(var(--primary-brand))] text-black font-semibold hover:bg-[rgb(var(--primary-brand-hover))] w-full sm:w-auto"
          >
            {t("section.addSection")}
          </Button>
        </div>
      </div>

      <SectionForm
        isOpen={showCreate}
        onClose={() => {
          setShowCreate(false);
          setEditSection(null);
        }}
        editSection={editSection}
        onSubmit={handleFormSubmit}
        isSubmitting={createSection.isPending || updateSection.isPending}
        pageList={formattedPageList}
        uploadMedia={uploadMedia} // Upload funksiyasını SectionForm-a göndər
        uploadLoading={
          uploadImageMutation.isPending || uploadVideoMutation.isPending
        } // Loading state-i də göndər
      />

      {/* Section View Modal */}
      <SectionViewModal
        section={viewSection}
        isOpen={!!viewSection}
        onClose={() => setViewSection(null)}
      />

      {/* Section Delete Modal */}
      <SectionDeleteModal
        section={deleteSection}
        isOpen={!!deleteSection}
        onClose={() => setDeleteSection(null)}
        onConfirm={handleDelete}
        isDeleting={deleteSectionMutation.isPending}
      />

      {/* Section Table */}
      <SectionTable
        data={tableData}
        onView={setViewSection}
        onEdit={handleEdit}
        onDelete={setDeleteSection}
      />

      <Toaster
        position="top-right"
        toastOptions={{
          classNames: {
            success: "!bg-green-500 !text-white",
            error: "!bg-red-500 !text-white",
          },
        }}
      />
    </div>
  );
}
