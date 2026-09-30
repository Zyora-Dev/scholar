import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Sparkles,
  FolderLock,
  FileEdit,
  Activity,
  LifeBuoy,
  RefreshCw,
  Compass,
  Bot,
  Building2,
  ListOrdered,
  BarChart3,
  MapPin,
  Flag,
  FileText,
  Sliders
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";

interface NavItem {
  to: string;
  label: string;
  icon: any;
  highlight?: boolean;
  badge?: string;
}

export const Sidebar: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const role = user?.role || "STUDENT";

  const studentLinks: NavItem[] = [
    { to: "/student/dashboard", label: t("nav_dashboard"), icon: LayoutDashboard },
    { to: "/student/scholarships", label: t("nav_scholarships"), icon: Search },
    { to: "/student/eligibility", label: "AI Eligibility", icon: Sparkles },
    { to: "/student/vault", label: t("nav_vault"), icon: FolderLock },
    { to: "/student/apply", label: "Smart Wizard", icon: FileEdit },
    { to: "/student/tracking", label: t("nav_tracking"), icon: Activity },
    {
      to: "/student/rescue",
      label: t("nav_rescue"),
      icon: LifeBuoy,
      highlight: true,
      badge: "Action Req"
    },
    {
      to: "/student/renewal",
      label: t("nav_renewal"),
      icon: RefreshCw,
      badge: "18 Days"
    },
    { to: "/student/opportunities", label: t("nav_opportunities"), icon: Compass },
    { to: "/student/ai-assistant", label: t("nav_ai_assistant"), icon: Bot }
  ];

  const instLinks: NavItem[] = [
    { to: "/institution/dashboard", label: "Institution Dashboard", icon: Building2 },
    { to: "/institution/queue", label: "Verification Queue", icon: ListOrdered, badge: "Pending" }
  ];

  const adminLinks: NavItem[] = [
    { to: "/admin/dashboard", label: "State Analytics", icon: BarChart3 },
    { to: "/admin/map", label: "Tribal Region Map", icon: MapPin },
    { to: "/admin/flags", label: "AI Anomaly Flags", icon: Flag, badge: "2 Active" },
    { to: "/admin/audit-logs", label: "Immutable Audit Logs", icon: FileText }
  ];

  const superAdminLinks: NavItem[] = [
    { to: "/superadmin/master-data", label: "Master Data & Rules", icon: Sliders },
    { to: "/admin/dashboard", label: "National Analytics", icon: BarChart3 },
    { to: "/admin/audit-logs", label: "Audit Registry", icon: FileText }
  ];

  const links =
    role === "INSTITUTION"
      ? instLinks
      : role === "ADMIN"
      ? adminLinks
      : role === "SUPER_ADMIN"
      ? superAdminLinks
      : studentLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 h-full w-64 bg-surface border-r border-gray-200 z-50 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Active User Badge / Context */}
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Logged in as:
            </p>
            <p className="text-sm font-bold text-gray-900 truncate">{user?.name || "Student"}</p>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{user?.district ? `${user.district}, ` : ""}{user?.state || "India-Wide"}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-saffron text-white shadow-sm"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    } ${link.highlight && !link.to.includes("active") ? "bg-rose-50 text-rose-800 border border-rose-200" : ""}`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                        link.highlight
                          ? "bg-rose-600 text-white"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Legal / Trust Note */}
          <div className="p-3 border-t border-gray-200 bg-gray-50/80 text-[10px] text-gray-500 text-center leading-tight">
            <span className="font-semibold text-gray-700">TRIBAL SAKSHAM AI</span>
            <br />
            {t("disclaimer_trust")}
          </div>
        </div>
      </aside>
    </>
  );
};
