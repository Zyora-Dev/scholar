import React, { useState, useEffect } from "react";
import {
  Compass,
  Calendar,
  Briefcase,
  GraduationCap,
  Sparkles,
  ExternalLink,
  BookOpen,
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle2
} from "lucide-react";
import { api } from "../../services/api";
import { VerificationBadge } from "../../components/Badges";
import { Opportunity } from "../../types";

export const OpportunityHub: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ALL" | "FELLOWSHIP" | "INTERNSHIP" | "SKILL_PROGRAM" | "COMPETITIVE_EXAM">("ALL");

  useEffect(() => {
    api.getOpportunities().then((res) => {
      if (res.success) setOpportunities(res.data);
      setLoading(false);
    });
  }, []);

  const filtered = activeTab === "ALL" ? opportunities : opportunities.filter((o) => o.type === activeTab);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-tribal/10 text-tribal">
              <Compass className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase text-tribal">Holistic Growth Ecosystem</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mt-1">Opportunity Hub & Future Pathways</h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Beyond scholarships: Fellowships, R&D internships, high-impact skill bootcamps, and civil service coaching for tribal students.
          </p>
        </div>
      </div>

      {/* STUDENT OPPORTUNITY TIMELINE (LONG-TERM ROADMAP) */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-tribal-dark text-white p-6 rounded-2xl shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-saffron" />
            <h2 className="text-base font-extrabold tracking-tight">
              Personalized Long-Term Student Pathway (2026 - 2029)
            </h2>
          </div>
          <span className="text-[11px] font-semibold bg-white/20 px-2.5 py-0.5 rounded-full text-white/90">
            Advisory Pathway Only
          </span>
        </div>

        <p className="text-xs text-gray-300">
          Tailored for B.Tech Computer Science student from Irula Community, Nilgiris District:
        </p>

        {/* 3-Year Milestones */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* 2026: Undergrad Maintenance */}
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-saffron">2026 • CURRENT YEAR</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <h4 className="text-sm font-bold text-white">Post-Matric ST Scholarship</h4>
            <p className="text-xs text-gray-300">
              Secures full college tuition and living allowance during 3rd year engineering.
            </p>
          </div>

          {/* 2027: National Internship */}
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-accent">2027 • PRE-FINAL / FINAL</span>
              <Sparkles className="w-4 h-4 text-accent" />
            </div>
            <h4 className="text-sm font-bold text-white">ISRO / Premier Tech Internship</h4>
            <p className="text-xs text-gray-300">
              Hands-on space telemetry internship + NSDC AI Certification for corporate placement.
            </p>
          </div>

          {/* 2028-29: Fellowship / Higher Ed */}
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-emerald-400">2028 - 2029 • HIGHER ED</span>
              <GraduationCap className="w-4 h-4 text-emerald-400" />
            </div>
            <h4 className="text-sm font-bold text-white">National Overseas / NFST Ph.D.</h4>
            <p className="text-xs text-gray-300">
              Full government grant for Master’s abroad or national doctoral fellowship in AI systems.
            </p>
          </div>
        </div>

        <p className="text-[10px] text-gray-400 text-center pt-1">
          * Career pathway milestones are advisory recommendations. Selections depend on individual qualifying exam scores and formal guidelines.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold no-scrollbar">
        {[
          { key: "ALL", label: "All Opportunities" },
          { key: "FELLOWSHIP", label: "Research Fellowships" },
          { key: "INTERNSHIP", label: "R&D Internships" },
          { key: "SKILL_PROGRAM", label: "Skill Bootcamps" },
          { key: "COMPETITIVE_EXAM", label: "Exam Coaching" }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? "bg-tribal text-white shadow-xs"
                : "bg-surface border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Opportunity Cards */}
      {loading ? (
        <div className="p-12 text-center text-xs text-gray-500">Loading opportunities...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((opp) => (
            <div
              key={opp.id}
              className="bg-surface rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <VerificationBadge status={opp.verificationStatus} />
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-gray-100 text-gray-700 uppercase">
                    {opp.type.replace("_", " ")}
                  </span>
                </div>

                <h3 className="font-bold text-base text-gray-900 leading-snug">{opp.title}</h3>
                <p className="text-xs text-tribal font-semibold mt-0.5">{opp.organization}</p>

                <p className="text-xs text-gray-600 mt-2 line-clamp-2">{opp.description}</p>

                <div className="mt-4 p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Stipend / Benefit:</span>
                    <strong className="text-emerald-700 font-bold">{opp.stipendOrBenefit}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Eligibility:</span>
                    <span className="text-gray-800 text-right truncate max-w-[200px]">{opp.eligibility}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location:</span>
                    <span className="text-gray-800 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" /> {opp.location}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-500">
                  Deadline: <strong>{opp.deadline}</strong>
                </span>

                <a
                  href={opp.officialLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-tribal text-white font-bold hover:bg-tribal-dark transition-colors"
                >
                  View Opportunity <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
