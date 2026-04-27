import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  favoriteRoutes?: number[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signup: (userData: Omit<User, "id"> & { password: string }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const signup = async (userData: Omit<User, "id"> & { password: string }) => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call when backend is ready
      // For now, we'll simulate signup
      const newUser: User = {
        id: Date.now().toString(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        favoriteRoutes: [],
      };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
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
      // TODO: Replace with actual API call when backend is ready
      // For now, we'll simulate login
      const mockUser: User = {
        id: Date.now().toString(),
        firstName: "Demo",
        lastName: "User",
        email: email,
        phoneNumber: "03001234567",
        favoriteRoutes: [],
      };
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const addFavoriteRoute = (routeId: number) => {
    if (user) {
      const updatedUser = {
        ...user,
        favoriteRoutes: [...(user.favoriteRoutes || []), routeId],
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const removeFavoriteRoute = (routeId: number) => {
    if (user) {
      const updatedUser = {
        ...user,
        favoriteRoutes: (user.favoriteRoutes || []).filter(id => id !== routeId),
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const isFavoriteRoute = (routeId: number): boolean => {
    return (user?.favoriteRoutes || []).includes(routeId);
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call when backend is ready
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
