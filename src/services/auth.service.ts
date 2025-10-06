import axiosInstance, { setAccessToken, getAccessToken } from "@/lib/axios.customize";
import {
  LoginFormData,
  RegisterFormData,
  AuthResponse,
  RefreshTokenResponse,
} from "@/types/auth";

export const authService = {
  /**
   * Register a new user
   * POST /api/v1/auth/register
   * Refresh token được set tự động vào HttpOnly cookie bởi backend
   */
  register: async (data: RegisterFormData): Promise<AuthResponse> => {
    const { data: response } = await axiosInstance.post<AuthResponse>("/auth/register", data);
    
    // Lưu access token vào memory (KHÔNG dùng localStorage)
    if (response.accessToken) {
      setAccessToken(response.accessToken);
    }
    
    return response;
  },

  /**
   * Sign in user
   * POST /api/v1/auth/sign-in
   * Refresh token được set tự động vào HttpOnly cookie bởi backend
   */
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const { data: response } = await axiosInstance.post<AuthResponse>("/auth/sign-in", data);
    
    // Lưu access token vào memory (KHÔNG dùng localStorage)
    if (response.accessToken) {
      setAccessToken(response.accessToken);
    }
    
    return response;
  },

  /**
   * Refresh access token using HttpOnly cookie
   * POST /api/v1/auth/refresh-token
   * Cookie được gửi tự động, backend sẽ set cookie mới
   */
  refreshToken: async (): Promise<RefreshTokenResponse> => {
    const { data: response } = await axiosInstance.post<RefreshTokenResponse>("/auth/refresh-token");
    
    // Lưu access token mới vào memory
    if (response.accessToken) {
      setAccessToken(response.accessToken);
    }
    
    return response;
  },

  /**
   * Logout user
   * POST /api/v1/auth/logout
   * Backend sẽ thu hồi token và xóa cookie
   */
  logout: async (): Promise<void> => {
    const accessToken = getAccessToken();
    
    if (accessToken) {
      await axiosInstance.post("/auth/logout", { accessToken });
    }
    
    // Xóa access token khỏi memory
    setAccessToken(null);
  },
};
