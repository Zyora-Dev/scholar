import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Globe,
  Wifi,
  WifiOff,
  User as UserIcon,
  Shield,
  Layers,
  ChevronDown,
  Menu,
  X,
  Sparkles
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useLowBandwidth } from "../contexts/LowBandwidthContext";
import { useAccessibility } from "../contexts/AccessibilityContext";
import { UserRole } from "../types";

export const Navbar: React.FC<{ onToggleSidebar?: () => void }> = ({ onToggleSidebar }) => {
  const { user, demoSwitch, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { lowBandwidth, toggleLowBandwidth, isOnline } = useLowBandwidth();
  const { fontSize, setFontSize, highContrast, toggleHighContrast } = useAccessibility();
  const navigate = useNavigate();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const handleRoleChange = async (role: UserRole) => {
    await demoSwitch(role);
    setRoleMenuOpen(false);
    if (role === "STUDENT") navigate("/student/dashboard");
    else if (role === "INSTITUTION") navigate("/institution/dashboard");
    else if (role === "ADMIN") navigate("/admin/dashboard");
    else if (role === "SUPER_ADMIN") navigate("/superadmin/master-data");
  };

  return (
    <header className="sticky top-0 z-40 bg-surface shadow-sm border-b border-gray-200">
      {/* Tri-color Top Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-saffron via-white to-tribal" />

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-3">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden"
                aria-label="Toggle navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-saffron to-tribal p-0.5 shadow-sm flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-[7px] flex items-center justify-center font-bold text-saffron text-lg">
                  TS
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight text-gray-900">
                    {t("app_name")}
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-tribal-light text-tribal border border-tribal/20">
                    SIH26239
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 hidden md:block">
                  {t("app_tagline")}
                </p>
              </div>
            </Link>
          </div>

          {/* Right: Accessibility, Low-BW, Language, Demo Role, User */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Low-Bandwidth Mode Pill */}
            <button
              onClick={toggleLowBandwidth}
              title={lowBandwidth ? "Low Bandwidth Mode ON" : "Turn On Low Bandwidth Mode"}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors border ${
                lowBandwidth
                  ? "bg-amber-100 text-amber-900 border-amber-300"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
              }`}
            >
              {isOnline ? (
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-rose-600" />
              )}
              <span className="hidden sm:inline">
                {lowBandwidth ? "Low BW: ON" : "2G/3G Mode"}
              </span>
            </button>

            {/* Accessibility Controls: Font Size & Contrast */}
            <div className="hidden lg:flex items-center gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200 text-xs font-medium text-gray-700">
              <button
                onClick={() => setFontSize("normal")}
                className={`px-1.5 py-0.5 rounded ${fontSize === "normal" ? "bg-white font-bold shadow-sm" : ""}`}
                title="Default Font Size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize("large")}
                className={`px-1.5 py-0.5 rounded text-sm ${fontSize === "large" ? "bg-white font-bold shadow-sm" : ""}`}
                title="Large Font Size"
              >
                A+
              </button>
              <button
                onClick={toggleHighContrast}
                className={`px-1.5 py-0.5 rounded ${highContrast ? "bg-black text-white font-bold" : ""}`}
                title="Toggle High Contrast"
              >
                Contrast
              </button>
            </div>

            {/* Language Switcher */}
            <div className="relative flex items-center">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="text-xs font-semibold bg-gray-50 border border-gray-300 rounded-md py-1.5 pl-2 pr-6 text-gray-700 hover:bg-white focus:outline-none focus:ring-1 focus:ring-saffron"
                aria-label="Select Language"
              >
                <option value="en">English</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="hi">हिंदी (Hindi)</option>
              </select>
            </div>

            {/* 1-Click Role Switcher for Hackathon Judges */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-tribal/10 hover:bg-tribal/20 text-tribal font-semibold rounded-md text-xs border border-tribal/30 transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-tribal" />
                <span className="uppercase">{user?.role || "STUDENT"}</span>
                <ChevronDown className="w-3.5 h-3.5 text-tribal" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface rounded-lg shadow-xl border border-gray-200 py-1.5 z-50">
                  <div className="px-3 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Switch Demo Role
                  </div>
                  <button
                    onClick={() => handleRoleChange("STUDENT")}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-gray-50 ${
                      user?.role === "STUDENT" ? "font-bold text-saffron bg-saffron/5" : "text-gray-700"
                    }`}
                  >
                    <span>🎓 Student (Indhira Iyappan)</span>
                    {user?.role === "STUDENT" && <span className="text-saffron text-[10px]">Active</span>}
                  </button>
                  <button
                    onClick={() => handleRoleChange("INSTITUTION")}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-gray-50 ${
                      user?.role === "INSTITUTION" ? "font-bold text-tribal bg-tribal/5" : "text-gray-700"
                    }`}
                  >
                    <span>🏛️ Institution (Nodal Officer)</span>
                    {user?.role === "INSTITUTION" && <span className="text-tribal text-[10px]">Active</span>}
                  </button>
                  <button
                    onClick={() => handleRoleChange("ADMIN")}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-gray-50 ${
                      user?.role === "ADMIN" ? "font-bold text-blue-600 bg-blue-50" : "text-gray-700"
                    }`}
                  >
                    <span>📊 Admin (State Welfare)</span>
                    {user?.role === "ADMIN" && <span className="text-blue-600 text-[10px]">Active</span>}
                  </button>
                  <button
                    onClick={() => handleRoleChange("SUPER_ADMIN")}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-gray-50 ${
                      user?.role === "SUPER_ADMIN" ? "font-bold text-purple-600 bg-purple-50" : "text-gray-700"
                    }`}
                  >
                    <span>⚙️ Super Admin (Master Data)</span>
                    {user?.role === "SUPER_ADMIN" && <span className="text-purple-600 text-[10px]">Active</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-600" />
            </button>

            {/* Notification Popover */}
            {notifOpen && (
              <div className="absolute right-4 top-16 w-80 sm:w-96 bg-surface rounded-xl shadow-2xl border border-gray-200 p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h4 className="font-bold text-sm text-gray-900">Notifications</h4>
                  <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                    1 Action Required
                  </span>
                </div>
                <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
                  <div
                    onClick={() => {
                      setNotifOpen(false);
                      navigate("/student/rescue");
                    }}
                    className="p-2.5 rounded-lg bg-rose-50/80 border border-rose-200 cursor-pointer hover:bg-rose-100/80 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-rose-200 text-rose-900">
                        URGENT
                      </span>
                      <span className="text-[10px] text-gray-400">Rescue Alert</span>
                    </div>
                    <p className="text-xs font-bold text-gray-900 mt-1">
                      Application Needs Correction
                    </p>
                    <p className="text-[11px] text-gray-600 mt-0.5 line-clamp-2">
                      National Overseas Scholarship requires review of your Income Certificate. Click to fix and resubmit.
                    </p>
                  </div>

                  <div
                    onClick={() => {
                      setNotifOpen(false);
                      navigate("/student/renewal");
                    }}
                    className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 cursor-pointer hover:bg-amber-100/80 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
                        IMPORTANT
                      </span>
                      <span className="text-[10px] text-gray-400">18 Days Left</span>
                    </div>
                    <p className="text-xs font-bold text-gray-900 mt-1">
                      Renewal Guardian Window Open
                    </p>
                    <p className="text-[11px] text-gray-600 mt-0.5">
                      Post-Matric Scholarship renewal window is active for 2025-2026.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
