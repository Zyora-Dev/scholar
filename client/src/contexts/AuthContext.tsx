import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "../types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  demoSwitch: (role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("saksham_user");
    return saved
      ? JSON.parse(saved)
      : {
          id: "usr-student-01",
          email: "student@demo.saksham.gov.in",
          name: "Indhira Iyappan",
          role: "STUDENT" as UserRole,
          state: "Tamil Nadu",
          district: "Nilgiris"
        };
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("saksham_token") || "Bearer usr-student-01";
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("saksham_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("saksham_user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("saksham_token", token);
    } else {
      localStorage.removeItem("saksham_token");
    }
  }, [token]);

  const login = async (email: string, role?: UserRole) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setToken(data.token);
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const demoSwitch = async (role: UserRole) => {
    try {
      const res = await fetch("/api/auth/demo-switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setToken(data.token);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("saksham_user");
    localStorage.removeItem("saksham_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        demoSwitch,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
