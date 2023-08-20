import axios from "axios";
import { BASE_URL } from "./constants/AppConstants";
import { logout } from "./shared/utils/logout";

const apiClient = axios.create({
  baseURL: BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const userDetails = localStorage.getItem("user");

    if (userDetails) {
      const token = JSON.parse(userDetails).token;
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Public Routes
export const login = async (data) => {
  try {
    return await apiClient.post("/auth/login", data);
  } catch (exception) {
    return {
      error: true,
      exception,
    };
  }
};

export const register = async (data) => {
  try {
    return await apiClient.post("/auth/register", data);
  } catch (exception) {
    return {
      error: true,
      exception,
    };
  }
};

export const sellerLogin = async (data) => {
  try {
    return await apiClient.post("/auth/seller/login", data);
  } catch (exception) {
    return {
      error: true,
      exception,
    };
  }
};

export const sellerRegister = async (data) => {
  try {
    return await apiClient.post("/auth/seller/register", data);
  } catch (exception) {
    return {
      error: true,
      exception,
    };
  }
};

export const getAllProducts = async () => {
  try {
    return await apiClient.get("/main/getAllProducts");
  } catch (exception) {
    return {
      error: true,
      exception,
    };
  }
};

export const getSellerProducts = async () => {
  try {
    return await apiClient.get("/main/getSellerProducts");
  } catch (exception) {
    return {
      error: true,
      exception,
    };
  }
};

export const availLoyaltyProgram = async () => {
  try {
    return await apiClient.post("/main/availLoyaltyProgram");
  } catch (exception) {
    return {
      error: true,
      exception,
    };
  }
};

export const addToCart = async (data) => {
  try {
    console.log(data);
    return await apiClient.post("/main/addToCart", data);
  } catch (exception) {
    return {
      error: true,
      exception,
    };
  }
};

export const addNewProduct = async (data) => {
  try {
    console.log(data);
    return await apiClient.post("/main/addNewProduct", data);
  } catch (exception) {
    return {
      error: true,
      exception,
    };
  }
};

export const getCart = async () => {
  try {
    return await apiClient.get("/main/getCart");
  } catch (exception) {
    return {
      error: true,
      exception,
    };
  }
};

const checkResponseCode = (exception) => {
  const responseCode = exception?.response?.status;

  if (responseCode) {
    (responseCode === 401 || responseCode === 403) && logout();
  }
};
