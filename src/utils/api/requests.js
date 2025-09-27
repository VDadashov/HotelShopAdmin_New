import axiosInstance from "./axiosInstance";


export const getData = async (endpoint) => {
  try {
    const response = await axiosInstance.get(endpoint);
    return response.data;
  } catch (error) {
    throw error.response.data.message || "Nese sehv bas verdi";
  }
};

export const getOneData = async (endpoint, slug) => {
  try {
    const [baseUrl, queryString] = endpoint.split("?");

    const finalUrl = queryString
      ? `${baseUrl}/${slug}?${queryString}`
      : `${endpoint}/${slug}`;

    const response = await axiosInstance.get(finalUrl);

    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const postData = async (endpoint, newData) => {
  try {
    const response = await axiosInstance.post(endpoint, newData);
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};
export const patchData = async (endpoint, slug, updatedData) => {
  try {
    const [baseUrl, queryString] = endpoint.split("?");

    const finalUrl = queryString
      ? `${baseUrl}/${slug}?${queryString}`
      : `${endpoint}/${slug}`;

    const response = await axiosInstance.patch(finalUrl, updatedData);
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};
export const updateData = async (endpoint, slug, updatedData) => {
  try {
    const [baseUrl, queryString] = endpoint.split("?");

    const finalUrl = queryString
      ? `${baseUrl}/${slug}?${queryString}`
      : `${endpoint}/${slug}`;

    const response = await axiosInstance.put(finalUrl, updatedData);
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const deleteData = async (endpoint, slug) => {
  try {
    const [baseUrl, queryString] = endpoint.split("?");

    const finalUrl = queryString
      ? `${baseUrl}/${slug}?${queryString}`
      : `${endpoint}/${slug}`;

    const response = await axiosInstance.delete(finalUrl);
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

