//export const BASE_URL = "https://moneymantra.onrender.com/api/v1.0";
export const BASE_URL = "http://localhost:8080/api/v1.0";

const CLOUDINARY_CLOUD_NAME = "duaq2t3uq";

export const API_ENDPOINTS = {
    LOGIN: "/login",
    REGISTER: "/register",
    GET_USER_INFO: "/profile", 
    GET_ALL_CATEGORIES: "/categories",
    ADD_CATEGORY: "/categories",
    UPDATE_CATEGORY: (categoryId) => `/categories/${categoryId}`,
    GET_ALL_INCOMES: "/incomes",
    GET_CATEGORY_BY_TYPE: (type) => `/categories/${type}`,
    ADD_INCOME: "/incomes",
    DELETE_INCOME: (incomeId) => `/incomes/${incomeId}`,
    INCOME_EXCEL_DOWNLOAD: "/incomes/excel/download",
    INCOME_EMAIL: "/incomes/email",
    UPLOAD_IMAGE: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
}