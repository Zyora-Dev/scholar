import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  LifeBuoy,
  RefreshCw,
  FolderLock,
  Search,
  CheckCircle2,
  Users,
  Compass,
  FileCheck,
  Building2,
  Activity
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export const LandingPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-saffron/15 via-white to-tribal/15 border border-gray-200 p-8 sm:p-14 shadow-xs">
        <div className="max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tribal text-white text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            Ministry of Tribal Affairs • SIH26239
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-gray-950 tracking-tight leading-tight">
            TRIBAL SAKSHAM AI
          </h1>

          <p className="text-lg sm:text-xl font-extrabold text-saffron-dark">
            "{t("app_tagline")}"
          </p>

          <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-2xl font-normal">
            An end-to-end AI-assisted platform helping Scheduled Tribe students discover opportunities, understand eligibility, prepare documents, complete error-free applications, recover returned applications, and stay on track for renewals across all Indian States & Union Territories.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/student/scholarships"
              className="px-6 py-3 bg-saffron hover:bg-saffron-dark text-white font-extrabold text-sm rounded-xl shadow-md flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              Find My Scholarships <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold text-sm rounded-xl shadow-xs transition-colors"
            >
              1-Click Demo Login
            </Link>
          </div>

          {/* Ethical Government Trust Banner */}
          <div className="pt-4 flex items-center gap-2 text-xs font-semibold text-gray-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
            <span>"AI assists. Authorized government authorities determine official eligibility and approval."</span>
          </div>
        </div>
      </section>

      {/* 2. THE COMPLETE STUDENT SUCCESS JOURNEY */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-tribal uppercase tracking-wider">
            Core Product Vision
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
            Not Just a Listing Site — An End-to-End Success Engine
          </h2>
          <p className="text-xs text-gray-600 mt-1">
            Guiding students from early discovery through verification, rescue, disbursement, and long-term opportunity pathways.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-saffron/10 text-saffron flex items-center justify-center font-bold">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-gray-900">1. Smart Discovery</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Find verified central and state schemes filtered by ST community, education level, and income ceiling across India.
            </p>
          </div>

          <div className="bg-surface p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-tribal/10 text-tribal flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-gray-900">2. AI Eligibility Check</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Multi-factor dynamic evaluation provides clear match scores and explainable reasons before applying.
            </p>
          </div>

          <div className="bg-surface p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <FolderLock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-gray-900">3. Document Intelligence</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Encrypted Vault with OCR cross-checks detect spelling mismatches (e.g., Indhira Iyappan vs Iyyappan) without automatic rejection.
            </p>
          </div>

          <div className="bg-surface p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-gray-900">4. Application Rescue</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              If an institution returns an application, our Rescue Center gives step-by-step guidance to fix and resubmit with priority.
            </p>
          </div>
        </div>
      </section>

      {/* 3. CORE DIFFERENTIATORS GRID */}
      <section className="bg-surface rounded-3xl border border-gray-200 p-8 shadow-xs space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-saffron uppercase tracking-wider">
            Why TRIBAL SAKSHAM AI is Unique
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
            Engineered for India-Wide Impact
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 space-y-3">
            <div className="flex items-center gap-2 text-saffron font-bold text-sm">
              <LifeBuoy className="w-5 h-5" />
              <span>Application Rescue Center</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Over 40% of tribal scholarships are lost because returned applications lapse. Saksham AI's dedicated rescue workflow breaks down nodal remarks into a 4-step guided fix.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 space-y-3">
            <div className="flex items-center gap-2 text-tribal font-bold text-sm">
              <RefreshCw className="w-5 h-5" />
              <span>Renewal Guardian</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Automated countdowns alert students 45 days before deadlines with instant document readiness checks so funding continues every academic year without dropouts.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 space-y-3">
            <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
              <Compass className="w-5 h-5" />
              <span>Long-Term Opportunity Hub</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              A 3-year personalized roadmap combining scholarships with ISRO tech internships, skill certifications, and national Ph.D. research grants.
            </p>
          </div>
        </div>

        {/* 4 Roles Section */}
        <div className="pt-6 border-t border-gray-100">
          <h3 className="text-center font-bold text-sm text-gray-800 uppercase tracking-wider mb-6">
            Four Role-Based Portals (Instant Demo Access)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <Link
              to="/student/dashboard"
              className="p-4 rounded-xl bg-white border border-gray-200 hover:border-saffron hover:shadow-xs transition-all group"
            >
              <div className="font-extrabold text-sm text-gray-900 group-hover:text-saffron">
                🎓 Student
              </div>
              <p className="text-[11px] text-gray-500 mt-1">Indhira Iyappan (Irula Tribe)</p>
            </Link>

            <Link
              to="/institution/dashboard"
              className="p-4 rounded-xl bg-white border border-gray-200 hover:border-tribal hover:shadow-xs transition-all group"
            >
              <div className="font-extrabold text-sm text-gray-900 group-hover:text-tribal">
                🏛️ Institution
              </div>
              <p className="text-[11px] text-gray-500 mt-1">Nodal Scrutiny Officer</p>
            </Link>

            <Link
              to="/admin/dashboard"
              className="p-4 rounded-xl bg-white border border-gray-200 hover:border-blue-600 hover:shadow-xs transition-all group"
            >
              <div className="font-extrabold text-sm text-gray-900 group-hover:text-blue-600">
                📊 Admin
              </div>
              <p className="text-[11px] text-gray-500 mt-1">State Welfare Director</p>
            </Link>

            <Link
              to="/superadmin/master-data"
              className="p-4 rounded-xl bg-white border border-gray-200 hover:border-purple-600 hover:shadow-xs transition-all group"
            >
              <div className="font-extrabold text-sm text-gray-900 group-hover:text-purple-600">
                ⚙️ Super Admin
              </div>
              <p className="text-[11px] text-gray-500 mt-1">Master Data & Rules Plane</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
