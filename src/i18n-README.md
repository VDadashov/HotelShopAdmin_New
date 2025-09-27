# i18next Internationalization Setup

This project has been integrated with i18next for internationalization support. The setup includes support for English, Azerbaijani, and Russian languages.

## Files Structure

```
src/
├── i18n.js                    # i18next configuration
├── components/
│   └── LanguageSwitcher.jsx   # Language switcher component
└── locales/
    ├── en/
    │   └── translation.json   # English translations
    ├── az/
    │   └── translation.json   # Azerbaijani translations
    └── ru/
        └── translation.json   # Russian translations
```

## How to Use

### 1. Basic Translation Usage

In any React component, import and use the `useTranslation` hook:

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.dashboard')}</h1>
      <p>{t('auth.loginTitle')}</p>
    </div>
  );
}
```

### 2. Translation Keys Structure

The translation files are organized in nested objects:

```json
{
  "common": {
    "dashboard": "Dashboard",
    "products": "Products",
    "save": "Save",
    "cancel": "Cancel"
  },
  "auth": {
    "loginTitle": "Login to Admin Panel",
    "emailPlaceholder": "Enter your email"
  },
  "products": {
    "title": "Products",
    "addProduct": "Add Product",
    "noProducts": "No products found"
  }
}
```

### 3. Language Switcher

The language switcher component is already integrated into the header. Users can switch between:
- 🇺🇸 English
- 🇦🇿 Azərbaycan (Azerbaijani)
- 🇷🇺 Русский (Russian)

### 4. Adding New Translations

To add new translation keys:

1. Add the key to all three language files (`en`, `az`, `ru`)
2. Use the key in your component with `t('key.path')`

Example:
```json
// In all three translation files
{
  "newSection": {
    "title": "New Section Title",
    "description": "New section description"
  }
}
```

```jsx
// In your component
const { t } = useTranslation();
return <h1>{t('newSection.title')}</h1>;
```

### 5. Interpolation

For dynamic values, use interpolation:

```json
{
  "welcome": "Welcome, {{name}}!",
  "itemsCount": "You have {{count}} items"
}
```

```jsx
const { t } = useTranslation();
return (
  <div>
    <p>{t('welcome', { name: 'John' })}</p>
    <p>{t('itemsCount', { count: 5 })}</p>
  </div>
);
```

### 6. Pluralization

i18next supports pluralization:

```json
{
  "item": "{{count}} item",
  "item_plural": "{{count}} items"
}
```

### 7. Language Detection

The system automatically detects the user's preferred language from:
1. localStorage (if previously set)
2. Browser language
3. Falls back to English

### 8. Available Translation Keys

#### Common Keys
- `common.dashboard` - Dashboard
- `common.products` - Products
- `common.categories` - Categories
- `common.companies` - Companies
- `common.contacts` - Contacts
- `common.gallery` - Gallery
- `common.settings` - Settings
- `common.profile` - Profile
- `common.save` - Save
- `common.cancel` - Cancel
- `common.delete` - Delete
- `common.edit` - Edit
- `common.add` - Add
- `common.search` - Search
- `common.loading` - Loading...
- `common.read` - Read
- `common.unread` - Unread
- `common.deleting` - Deleting...
- `common.category` - Category
- `common.company` - Company
- `common.categories` - Categories

#### Table Keys
- `table.rowsPerPage` - Rows per page
- `table.columns` - Columns
- `table.noResults` - No results.
- `table.page` - Page
- `table.of` - of
- `table.goToFirstPage` - Go to first page
- `table.goToPreviousPage` - Go to previous page
- `table.goToNextPage` - Go to next page
- `table.goToLastPage` - Go to last page

#### Auth Keys
- `auth.loginTitle` - Login to Admin Panel
- `auth.emailPlaceholder` - Enter your email
- `auth.passwordPlaceholder` - Enter your password
- `auth.loginButton` - Sign In
- `auth.logoutSuccess` - Logout successful

#### Dashboard Keys
- `dashboard.welcome` - Welcome to G-Stone Admin
- `dashboard.contactsBreakdown` - Contacts Read/Unread Breakdown
- `dashboard.latestProducts` - Latest Products
- `dashboard.latestGalleryItems` - Latest Gallery Items
- `dashboard.latestContacts` - Latest Contacts

#### Product Keys
- `products.title` - Products
- `products.addProduct` - Add Product
- `products.editProduct` - Edit Product
- `products.productName` - Product Name
- `products.productDescription` - Product Description
- `products.productPrice` - Product Price
- `products.productCategory` - Product Category
- `products.productCompany` - Product Company
- `products.productImages` - Product Images
- `products.mainImage` - Main Image
- `products.imageList` - Image List
- `products.detailPdf` - Detail PDF
- `products.noProducts` - No products found
- `products.productAdded` - Product added successfully
- `products.productUpdated` - Product updated successfully
- `products.productDeleted` - Product deleted successfully
- `products.productDetails` - Product Details
- `products.copyId` - Copy ID
- `products.idCopied` - ID copied!
- `products.productNamePlaceholder` - Enter product name
- `products.productDescriptionPlaceholder` - Enter product description
- `products.searchPlaceholder` - Search by product name...
- `products.deleteProduct` - Delete Product
- `products.deleteConfirmation` - Are you sure you want to delete this product?
- `products.creating` - Creating...
- `products.updating` - Updating...
- `products.selectCategory` - Select category...
- `products.selectCompany` - Select company...
- `products.downloadPdf` - Download PDF
- `products.existingPdf` - Existing PDF
- `products.validation.titleAzRequired` - Azerbaijani title is required
- `products.validation.titleEnRequired` - English title is required
- `products.validation.titleRuRequired` - Russian title is required
- `products.validation.categoryRequired` - Category is required
- `products.validation.companyRequired` - Company is required
- `products.imagePreview` - Image Preview
- `products.removeImage` - Remove Image
- `products.addImages` - Add Images
- `products.removeImages` - Remove Images
- `products.pdfPreview` - PDF Preview
- `products.removePdf` - Remove PDF

#### Category Keys
- `categories.title` - Categories
- `categories.addCategory` - Add Category
- `categories.editCategory` - Edit Category
- `categories.categoryName` - Category Name
- `categories.categoryDescription` - Category Description
- `categories.noCategories` - No categories found
- `categories.categoryAdded` - Category added successfully
- `categories.categoryUpdated` - Category updated successfully
- `categories.categoryDeleted` - Category deleted successfully
- `categories.categoryDetails` - Category Details
- `categories.copyId` - Copy ID
- `categories.idCopied` - ID copied!
- `categories.categoryNamePlaceholder` - Enter category name
- `categories.searchPlaceholder` - Search by category name...
- `categories.deleteCategory` - Delete Category
- `categories.deleteConfirmation` - Are you sure you want to delete this category?
- `categories.creating` - Creating...
- `categories.updating` - Updating...
- `categories.validation.titleAzRequired` - Azerbaijani title is required
- `categories.validation.titleEnRequired` - English title is required
- `categories.validation.titleRuRequired` - Russian title is required

#### Company Keys
- `companies.title` - Companies
- `companies.addCompany` - Add Company
- `companies.noCompanies` - No companies found
- `companies.companyName` - Company Name
- `companies.companyDescription` - Company Description
- `companies.companyLogo` - Company Logo
- `companies.companyDetails` - Company Details
- `companies.noLogo` - No Logo
- `companies.copyId` - Copy ID
- `companies.idCopied` - ID copied!
- `companies.companyNamePlaceholder` - Enter company name
- `companies.companyDescriptionPlaceholder` - Enter company description
- `companies.selectCategories` - Select categories
- `companies.searchPlaceholder` - Search by company, description or category...
- `companies.deleteCompany` - Delete Company
- `companies.deleteConfirmation` - Are you sure you want to delete this company?
- `companies.creating` - Creating...
- `companies.updating` - Updating...
- `companies.companyAdded` - Company added successfully
- `companies.companyUpdated` - Company updated successfully
- `companies.companyDeleted` - Company deleted successfully

#### Company Validation Keys
- `companies.validation.titleAzRequired` - Azerbaijani title is required
- `companies.validation.titleEnRequired` - English title is required
- `companies.validation.titleRuRequired` - Russian title is required
- `companies.validation.descriptionAzRequired` - Azerbaijani description is required
- `companies.validation.descriptionEnRequired` - English description is required
- `companies.validation.descriptionRuRequired` - Russian description is required
- `companies.validation.logoRequired` - Logo is required
- `companies.validation.categoryRequired` - At least one category must be selected

#### Contact Keys
- `contacts.title` - Contacts
- `contacts.addContact` - Add Contact
- `contacts.editContact` - Edit Contact
- `contacts.contactName` - Contact Name
- `contacts.contactEmail` - Contact Email
- `contacts.contactPhone` - Contact Phone
- `contacts.contactMessage` - Contact Message
- `contacts.contactDetails` - Contact Details
- `contacts.contactSubject` - Contact Subject
- `contacts.contactId` - Contact ID
- `contacts.searchPlaceholder` - Search by name...
- `contacts.deleteContact` - Delete Contact
- `contacts.deleteConfirmation` - Are you sure you want to delete this contact? This action cannot be undone.
- `contacts.markAsRead` - Mark as Read
- `contacts.markedAsRead` - Marked as read!
- `contacts.noContacts` - No contacts found
- `contacts.contactAdded` - Contact added successfully
- `contacts.contactUpdated` - Contact updated successfully
- `contacts.contactDeleted` - Contact deleted successfully

#### Gallery Keys
- `gallery.title` - Gallery
- `gallery.addItem` - Add Gallery Item
- `gallery.editItem` - Edit Gallery Item
- `gallery.itemTitle` - Item Title
- `gallery.itemDescription` - Item Description
- `gallery.itemImage` - Item Image
- `gallery.itemDetails` - Item Details
- `gallery.itemNamePlaceholder` - Enter item name
- `gallery.itemDescriptionPlaceholder` - Enter item description
- `gallery.searchPlaceholder` - Search by item name...
- `gallery.deleteItem` - Delete Item
- `gallery.deleteConfirmation` - Are you sure you want to delete this item?
- `gallery.mainImage` - Main Image
- `gallery.imageList` - Image List
- `gallery.selectCategory` - Select category
- `gallery.noItems` - No gallery items found
- `gallery.itemAdded` - Gallery item added successfully
- `gallery.itemUpdated` - Gallery item updated successfully
- `gallery.itemDeleted` - Gallery item deleted successfully

#### Gallery Validation Keys
- `gallery.validation.titleAzRequired` - Azerbaijani title is required
- `gallery.validation.titleEnRequired` - English title is required
- `gallery.validation.titleRuRequired` - Russian title is required
- `gallery.validation.categoryRequired` - Category is required

#### Gallery Category Keys
- `galleryCategory.title` - Gallery Categories
- `galleryCategory.addCategory` - Add Gallery Category
- `galleryCategory.editCategory` - Edit Gallery Category
- `galleryCategory.categoryName` - Category Name
- `galleryCategory.categoryDescription` - Category Description
- `galleryCategory.categoryDetails` - Category Details
- `galleryCategory.categoryNamePlaceholder` - Enter category name
- `galleryCategory.searchPlaceholder` - Search by category name...
- `galleryCategory.deleteCategory` - Delete Category
- `galleryCategory.deleteConfirmation` - Are you sure you want to delete this category?
- `galleryCategory.noCategories` - No gallery categories found
- `galleryCategory.categoryAdded` - Gallery category added successfully
- `galleryCategory.categoryUpdated` - Gallery category updated successfully
- `galleryCategory.categoryDeleted` - Gallery category deleted successfully

#### Gallery Category Validation Keys
- `galleryCategory.validation.titleAzRequired` - Azerbaijani title is required
- `galleryCategory.validation.titleEnRequired` - English title is required
- `galleryCategory.validation.titleRuRequired` - Russian title is required

#### Error Keys
- `errors.required` - This field is required
- `errors.invalidEmail` - Please enter a valid email
- `errors.networkError` - Network error occurred

## Configuration

The i18next configuration is in `src/i18n.js`. Key features:

- **Fallback Language**: English
- **Language Detection**: Automatic from localStorage, browser, or HTML tag
- **Debug Mode**: Enabled in development
- **Interpolation**: Enabled with React-safe escaping

## Adding New Languages

To add a new language:

1. Create a new folder in `src/locales/` (e.g., `fr/`)
2. Create `translation.json` with all the translation keys
3. Add the language to the `LanguageSwitcher.jsx` component
4. Import and add to the resources in `i18n.js`

Example for French:
```jsx
// In LanguageSwitcher.jsx
const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'az', name: 'Azərbaycan', flag: '🇦🇿' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }  // Add this
];
```

```jsx
// In i18n.js
import frTranslations from './locales/fr/translation.json';

const resources = {
  en: { translation: enTranslations },
  az: { translation: azTranslations },
  ru: { translation: ruTranslations },
  fr: { translation: frTranslations }  // Add this
};
``` 