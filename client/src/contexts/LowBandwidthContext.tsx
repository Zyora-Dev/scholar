import React, { createContext, useContext, useState, useEffect } from "react";

interface LowBandwidthContextType {
  lowBandwidth: boolean;
  toggleLowBandwidth: () => void;
  saveDraftOffline: (key: string, data: any) => void;
  getDraftOffline: (key: string) => any;
  isOnline: boolean;
}

const LowBandwidthContext = createContext<LowBandwidthContextType | undefined>(undefined);

export const LowBandwidthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lowBandwidth, setLowBandwidth] = useState<boolean>(() => {
    return localStorage.getItem("saksham_low_bw") === "true";
  });
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (lowBandwidth) {
      document.body.classList.add("low-bandwidth");
      localStorage.setItem("saksham_low_bw", "true");
    } else {
      document.body.classList.remove("low-bandwidth");
      localStorage.setItem("saksham_low_bw", "false");
    }
  }, [lowBandwidth]);

  const toggleLowBandwidth = () => setLowBandwidth((prev) => !prev);

  const saveDraftOffline = (key: string, data: any) => {
    try {
      localStorage.setItem(`saksham_offline_draft_${key}`, JSON.stringify(data));
    } catch (e) {
      console.warn("Offline storage quota exceeded", e);
    }
  };

  const getDraftOffline = (key: string) => {
    try {
      const saved = localStorage.getItem(`saksham_offline_draft_${key}`);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  };

  return (
    <LowBandwidthContext.Provider
      value={{
        lowBandwidth,
        toggleLowBandwidth,
        saveDraftOffline,
        getDraftOffline,
        isOnline
      }}
    >
      {children}
    </LowBandwidthContext.Provider>
  );
};

export const useLowBandwidth = () => {
  const ctx = useContext(LowBandwidthContext);
  if (!ctx) throw new Error("useLowBandwidth must be used within LowBandwidthProvider");
  return ctx;
};
