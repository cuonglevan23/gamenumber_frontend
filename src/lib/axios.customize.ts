import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// API Response wrapper từ backend
interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
  timestamp: string;
}

// API Error format từ backend
interface ApiErrorResponse {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  properties?: {
    timestamp: string;
  };
}

// Access token sẽ được lưu trong memory (không dùng localStorage)
let accessTokenCache: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessTokenCache = token;
};

export const getAccessToken = () => {
  return accessTokenCache;
};

// Tạo axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Quan trọng: cho phép gửi/nhận cookies (refresh token)
});

// Request Interceptor - Tự động thêm access token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Lấy access token từ memory cache
    const accessToken = getAccessToken();

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Xử lý response và error
axiosInstance.interceptors.response.use(
  (response) => {
    // Trả về data từ ApiResponse wrapper
    const apiResponse = response.data as ApiResponse;
    response.data = apiResponse.data;
    return response;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Nếu lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Gọi API refresh token (dùng HttpOnly cookie tự động)
        const response = await axios.post<ApiResponse<{
          accessToken: string;
          tokenType: string;
          expiresIn: number;
        }>>(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"}/auth/refresh-token`,
          {},
          {
            withCredentials: true, // Gửi refresh token cookie
          }
        );

        const newAccessToken = response.data.data.accessToken;

        // Lưu token mới vào memory
        setAccessToken(newAccessToken);

        // Retry request với token mới
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh token thất bại - logout user
        setAccessToken(null);
        
        // Redirect to login (nếu đang ở client-side)
        if (typeof window !== "undefined") {
          window.location.href = "/auth";
        }

        return Promise.reject(refreshError);
      }
    }

    // Xử lý error message
    const errorMessage =
      error.response?.data?.detail ||
      error.response?.data?.title ||
      error.message ||
      "Something went wrong";

    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosInstance;
