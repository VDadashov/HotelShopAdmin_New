# Layihə İrəliləyiş Gündəliyi

Bu fayl, frontend inkişaf prosesindəki mərhələləri xronoloji olaraq qeyd etmək üçün istifadə olunur.

---

## 2024-12-02

- **Tarix**: 2024-12-02
- **Mərhələ**: Tətbiq / İcmal
- **Kapsam**: Media (Upload) modulu və FilePicker komponenti əlavə edildi, bütün formlarda inteqrasiya edildi

- **Görülən işlər**:
  - Upload səhifəsi tam funksional olaraq əlavə edildi
    - UploadTable komponenti yaradıldı (şəkil, video, PDF göstərmə)
    - UploadDeleteModal komponenti yaradıldı (DELETE request body ilə publicId və resourceType göndərmə)
    - UploadViewModal komponenti yaradıldı
    - UploadForm komponenti yaradıldı (image, PDF, video yükləmə, drag & drop, preview)
    - Pagination dəstəyi əlavə edildi (pageSize seçimi)
    - ResourceType filter əlavə edildi (image, video, raw)
  - FilePicker komponenti yaradıldı
    - Mövcud faylları seçmək üçün tab
    - Yeni fayl yükləmək üçün tab
    - ResourceType filter (dropdown)
    - Pagination dəstəyi
    - Şəkil preview və seçim
  - Bütün formlarda FilePicker inteqrasiyası
    - ProductForm - şəkil yükləmə üçün
    - BrandForm - şəkil yükləmə üçün
    - PromoForm - arxa plan şəkli üçün
    - SectionForm - media (image/video) üçün
  - UploadTable-da zoom funksiyası
    - Şəkil üzərinə hover-da eye icon
    - Click edəndə zoom modal açılır
    - Modal-da böyük şəkil göstərilir
  - Digər table-larda zoom funksiyası əlavə edildi
    - ProductTable - mainImg üçün
    - BrandTable - imageUrl üçün
    - PromoTable - backgroundImg üçün
    - Bütün table-larda vahid dizayn (w-20 h-20, hover eye icon, zoom modal)
  - Translation key-ləri əlavə edildi
    - `upload.*` - Upload səhifəsi üçün
    - `filePicker.*` - FilePicker komponenti üçün
    - `common.showing`, `common.of`, `common.next` - Pagination üçün
    - `products.selectProductImage`, `brands.selectBrandImage`, `promos.selectBackgroundImage`
  - Brand edit-də PUT metodu istifadəsi
    - `usePatch` → `useUpdate` (PUT metodu)
  - Sidebar naviqasiya düzəldildi
    - `<a href>` → `<Link to>` (React Router client-side navigation)
    - Səhifə yenilənməsi problemi həll edildi
  - "Upload files" → "Media" adlandırılması
    - Translation key-ləri yeniləndi
    - Sidebar icon `Upload` → `ImageIcon` dəyişdirildi
  - UploadDeleteModal-da silmə prosesi düzəldildi
    - DELETE request body-də `publicId` və `resourceType` göndərilir
    - ResourceType avtomatik müəyyənləşdirilir (URL extension-ına görə)
  - İstifadə olunmayan importlar silindi
    - ProductTable, BrandTable, PromoTable, UploadTable, FilePicker komponentlərindən
    - `i18n`, `DialogContent`, `customFilter`, `Package`, `Select`, `UploadIcon`, `toast` və s.

- **Qeydlər/Risklər**:
  - FilePicker komponenti bütün formlarda vahid şəkildə işləyir
  - Upload səhifəsində pagination və filter funksionallığı tam işləyir
  - Zoom funksiyası bütün table-larda vahid dizayn və davranışa malikdir
  - React Router client-side navigation düzgün işləyir, səhifə yenilənmir

---

