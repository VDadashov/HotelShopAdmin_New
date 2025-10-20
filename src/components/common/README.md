# Common Components Documentation

Bu dokumentasiya admin panelində yaradılan common komponentlərin istifadəsini izah edir.

## 📁 Struktur

```
src/components/common/
├── forms/           # Form komponentləri
├── modals/          # Modal komponentləri
├── tables/          # Table komponentləri
└── index.js         # Export faylı

src/hooks/
├── useCRUDOperations.js  # CRUD əməliyyatları üçün hook
├── useTableColumns.js     # Table sütunları üçün hook
└── index.js              # Export faylı

src/utils/
└── validationSchemas.js  # Validation şablonları
```

## 🔧 Form Komponentləri

### BaseForm
Bütün formlar üçün əsas wrapper komponenti.

```jsx
import { BaseForm } from '@/components/common';

<BaseForm
  isOpen={isOpen}
  onClose={onClose}
  editData={editData}
  onSubmit={handleSubmit}
  isSubmitting={isSubmitting}
  titleKey="categories"
  initialValues={initialValues}
  validationSchema={validationSchema}
>
  {({ values, setFieldValue }) => (
    // Form content
  )}
</BaseForm>
```

### MultilingualField
Çoxdilli sahələr üçün komponent.

```jsx
import { MultilingualField } from '@/components/common';

<MultilingualField
  name="name"
  label={t("categories.categoryName")}
  placeholder={t("categories.categoryNamePlaceholder")}
  languages={["az", "en", "ru"]}
/>
```

### BasicField
Sadə input sahələri üçün komponent.

```jsx
import { BasicField } from '@/components/common';

<BasicField
  name="index"
  label={t("categories.index")}
  type="number"
  placeholder={t("categories.indexPlaceholder")}
  min="0"
/>
```

### SwitchField
Switch kontrolları üçün komponent.

```jsx
import { SwitchField } from '@/components/common';

<SwitchField
  name="isActive"
  label={t("categories.isActive")}
  setFieldValue={setFieldValue}
  values={values}
/>
```

### SelectField
Select dropdown üçün komponent.

```jsx
import { SelectField } from '@/components/common';

<SelectField
  name="parentId"
  label={t("categories.parentCategory")}
  placeholder={t("categories.selectParentCategory")}
  options={availableParentCategories}
  valueKey="id"
  labelKey="name"
  setFieldValue={setFieldValue}
  values={values}
  emptyOption={t("categories.noParent")}
/>
```

## 🪟 Modal Komponentləri

### BaseDeleteModal
Silmə təsdiqi üçün modal.

```jsx
import { BaseDeleteModal } from '@/components/common';

<BaseDeleteModal
  data={deleteData}
  isOpen={!!deleteData}
  onClose={() => setDeleteData(null)}
  onConfirm={handleDelete}
  isDeleting={deleteMutation.isPending}
  titleKey="categories"
/>
```

### BaseViewModal
Məlumat göstərmək üçün modal.

```jsx
import { BaseViewModal } from '@/components/common';

<BaseViewModal
  data={viewData}
  isOpen={!!viewData}
  onClose={() => setViewData(null)}
  titleKey="categories"
>
  {/* Modal content */}
</BaseViewModal>
```

## 📊 Table Komponentləri

### BaseTable
Əsas table komponenti.

```jsx
import { BaseTable } from '@/components/common';

<BaseTable
  data={tableData}
  columns={columns}
  onView={onView}
  onEdit={onEdit}
  onDelete={onDelete}
  titleKey="categories"
  filterFn={customFilter}
/>
```

### ActionsColumn
Table əməliyyatları üçün sütun.

```jsx
import { ActionsColumn } from '@/components/common';

{
  id: "actions",
  header: t("common.actions"),
  cell: ({ row }) => (
    <ActionsColumn
      row={row}
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
      titleKey="categories"
    />
  ),
  enableSorting: false,
  enableHiding: false,
}
```

### MultilingualCell
Çoxdilli məlumatları göstərmək üçün cell.

```jsx
import { MultilingualCell } from '@/components/common';

cell: ({ row }) => <MultilingualCell value={row.original.name} />
```

### StatusCell
Status göstərmək üçün cell.

```jsx
import { StatusCell } from '@/components/common';

cell: ({ row }) => <StatusCell isActive={row.original.isActive} />
```

## 🎣 Hooks

### useCRUDOperations
CRUD əməliyyatları üçün hook.

```jsx
import { useCRUDOperations } from '@/hooks';

const {
  showCreate,
  editData,
  deleteData,
  viewData,
  tableData,
  isLoading,
  createMutation,
  updateMutation,
  deleteMutation,
  handleEdit,
  handleFormSubmit,
  handleDelete,
  closeForm,
  setDeleteData,
  setViewData,
  setShowCreate,
} = useCRUDOperations({
  endpoint: `${ENDPOINTS.getAllCategories}`,
  queryKey: "categories",
  titleKey: "categories",
});
```

### useTableColumns
Table sütunları üçün hook.

```jsx
import { useTableColumns } from '@/hooks';

const columns = useTableColumns({
  titleKey: "categories",
  onView,
  onEdit,
  onDelete,
  customColumns: [
    // Custom columns
  ],
  showActions: true,
});
```

## ✅ Validation Schemas

### createMultilingualValidation
Çoxdilli sahələr üçün validation.

```jsx
import { createMultilingualValidation } from '@/utils/validationSchemas';

const validationSchema = Yup.object({
  name: createMultilingualValidation("name", "categories"),
});
```

### commonValidations
Ümumi validation şablonları.

```jsx
import { commonValidations } from '@/utils/validationSchemas';

const validationSchema = Yup.object({
  name: commonValidations.multilingualName("categories"),
  index: commonValidations.index("categories"),
  isActive: commonValidations.isActive,
  parentId: commonValidations.parentId,
});
```

## 🚀 İstifadə Nümunəsi

Tam bir səhifənin necə refactor edildiyini görmək üçün `src/pages/Category/index.jsx` faylına baxın.

### Əvvəlki kod:
- 150+ sətir
- Tekrarlanan kod
- Manual state management
- Manual form handling

### Yeni kod:
- 100 sətir
- Clean və readable
- Reusable komponentlər
- Centralized logic

## 📈 Faydalar

1. **Kod azalması**: 30-40% kod azalması
2. **Maintainability**: Daha asan maintain etmək
3. **Consistency**: Bütün səhifələrdə eyni UI/UX
4. **Reusability**: Komponentləri yenidən istifadə etmək
5. **Type Safety**: Daha yaxşı type checking
6. **Performance**: Optimized komponentlər

## 🔄 Refactoring Process

1. **Analyze**: Tekrarlanan patternləri müəyyən et
2. **Extract**: Common komponentləri çıxart
3. **Create**: Reusable komponentlər yarat
4. **Refactor**: Mövcud səhifələri yenilə
5. **Test**: Hər şeyin düzgün işlədiyini yoxla
6. **Document**: İstifadəni sənədləşdir
