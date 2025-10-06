"use client";

import { createContext, useCallback, useEffect, useState } from "react";
import { AuthContextType, LoginFormData, RegisterFormData, User } from "@/types/auth";
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Thử refresh token từ HttpOnly cookie
        // Nếu có cookie hợp lệ, sẽ nhận được access token mới
        await authService.refreshToken();
        
        // Sau khi refresh thành công, lấy user info
        const currentUser = await userService.getCurrentUser();
        setUser(currentUser);
      } catch {
        // Không có session hợp lệ, user chưa đăng nhập
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (data: LoginFormData) => {
    try {
      await authService.login(data);
      // Lấy thông tin đầy đủ từ API /me
      const currentUser = await userService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      throw error;
    }
  }, []);

  const register = useCallback(async (data: RegisterFormData) => {
    try {
      await authService.register(data);
      // Lấy thông tin đầy đủ từ API /me
      const currentUser = await userService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      await authService.refreshToken();
      const refreshedUser = await userService.getCurrentUser();
      setUser(refreshedUser);
    } catch (error) {
      setUser(null);
      throw error;
    }
  }, []);

  const refreshUserData = useCallback((updatedUser: User) => {
    setUser(updatedUser);
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
