import React, { createContext, useContext, useState, useEffect } from "react";

type FontSize = "normal" | "large" | "xlarge";

interface AccessibilityContextType {
  fontSize: FontSize;
  highContrast: boolean;
  setFontSize: (size: FontSize) => void;
  toggleHighContrast: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    return (localStorage.getItem("saksham_font_size") as FontSize) || "normal";
  });
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem("saksham_high_contrast") === "true";
  });

  useEffect(() => {
    const scale = fontSize === "large" ? "1.15" : fontSize === "xlarge" ? "1.3" : "1";
    document.documentElement.style.setProperty("--font-scale", scale);
    localStorage.setItem("saksham_font_size", fontSize);
  }, [fontSize]);

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add("high-contrast");
      localStorage.setItem("saksham_high_contrast", "true");
    } else {
      document.body.classList.remove("high-contrast");
      localStorage.setItem("saksham_high_contrast", "false");
    }
  }, [highContrast]);

  const toggleHighContrast = () => setHighContrast((prev) => !prev);
  const setFontSize = (size: FontSize) => setFontSizeState(size);

  return (
    <AccessibilityContext.Provider
      value={{ fontSize, highContrast, setFontSize, toggleHighContrast }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibility must be used within AccessibilityProvider");
  return ctx;
};
