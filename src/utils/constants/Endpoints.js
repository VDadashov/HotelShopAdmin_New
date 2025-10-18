

export const MAIN_URL = "http://localhost:3001/api";

export const ENDPOINTS = {
  company: `${MAIN_URL}/company`,
  getCategories: `${MAIN_URL}/categories/all`,
  categories: `${MAIN_URL}/categories`,
  products: `${MAIN_URL}/products`,
  galleryCategory: `${MAIN_URL}/gallery-category`,
  galleryItem: `${MAIN_URL}/gallery-item`,
  contact: `${MAIN_URL}/contact`,
  markAllRead: `${MAIN_URL}/contact/mark-all-read`,
  // pages & sections
  pages: `${MAIN_URL}/pages`,
  sections: `${MAIN_URL}/sections`,
  uploadImage: `${MAIN_URL}/upload/image`,
  uploadVideo: `${MAIN_URL}/upload/video`,

  // auth
  profile: `${MAIN_URL}/auth/profile`,
  login: `${MAIN_URL}/auth/login`,
  logout: `${MAIN_URL}/auth/logout`,
};