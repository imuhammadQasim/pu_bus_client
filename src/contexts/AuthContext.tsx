import React, { createContext, useContext, useState, useEffect } from "react";
import apiService from "@/services/index";

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  favoriteRoutes?: (number | string)[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signup: (userData: Omit<User, "id"> & { password: string }) => Promise<any>;
  login: (email: string, password: string) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  logout: () => void;
  addFavoriteRoute: (routeId: number) => void;
  removeFavoriteRoute: (routeId: number) => void;
  isFavoriteRoute: (routeId: number) => boolean;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<(number | string)[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in (from localStorage token)
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const storedFavs = JSON.parse(localStorage.getItem("favorites") || "[]");
      setFavorites(storedFavs); // Ensure they stay as originally saved

      if (token) {
        try {
          const response: any = await apiService.getProfile();
          if (response && response.data && response.data.user) {
            const userData = response.data.user;
            setUser({ ...userData, favoriteRoutes: storedFavs });
          } else {
            localStorage.removeItem("token");
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          localStorage.removeItem("token");
        }
      }
      setIsLoading(false);
    };

    fetchUser();
  }, []);

  const signup = async (userData: Omit<User, "id"> & { password: string }) => {
    try {
      setIsLoading(true);
      const response = await apiService.signup(userData);
      return response;
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response: any = await apiService.signin(email, password);
      
      if (response && response.data) {
        const { user: userData, token } = response.data;
        setUser(userData);
        localStorage.setItem("token", token);
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      setIsLoading(true);
      const response: any = await apiService.verifyOTP(email, otp);
      
      if (response && response.data) {
        const { user: userData, token } = response.data;
        setUser(userData);
        localStorage.setItem("token", token);
      }
    } catch (error) {
      console.error("OTP Verification failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const addFavoriteRoute = (routeId: number | string) => {
    const isAlreadyFav = favorites.some(fav => String(fav) === String(routeId));
    if (!isAlreadyFav) {
      const updatedFavs = [...favorites, routeId];
      setFavorites(updatedFavs);
      localStorage.setItem("favorites", JSON.stringify(updatedFavs));
      if (user) {
        setUser({ ...user, favoriteRoutes: updatedFavs });
      }
    }
  };

  const removeFavoriteRoute = (routeId: number | string) => {
    const updatedFavs = favorites.filter((favId) => String(favId) !== String(routeId));
    setFavorites(updatedFavs);
    localStorage.setItem("favorites", JSON.stringify(updatedFavs));
    if (user) {
      setUser({ ...user, favoriteRoutes: updatedFavs });
    }
  };

  const isFavoriteRoute = (routeId: number | string): boolean => {
    return favorites.some(favId => String(favId) === String(routeId));
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      setIsLoading(true);
      if (user) {
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signup,
        login,
        verifyOTP,
        logout,
        addFavoriteRoute,
        removeFavoriteRoute,
        isFavoriteRoute,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
