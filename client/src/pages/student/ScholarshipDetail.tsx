import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShieldCheck,
  Calendar,
  IndianRupee,
  MapPin,
  ExternalLink,
  CheckCircle2,
  FileText,
  AlertCircle,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { api } from "../../services/api";
import { VerificationBadge, MatchScoreBadge } from "../../components/Badges";
import { Scholarship } from "../../types";

export const ScholarshipDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      api.getScholarshipById(id).then((res) => {
        if (res.success) setScholarship(res.data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading || !scholarship) {
    return (
      <div className="p-12 text-center text-xs text-gray-500">
        Loading verified scheme details...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Scholarships
      </button>

      {/* Main Header Card */}
      <div className="bg-surface p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <VerificationBadge status={scholarship.verificationStatus} />
          <MatchScoreBadge score={scholarship.id === "sch-001" ? 95 : 90} />
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
          {scholarship.name}
        </h1>
        <p className="text-sm font-semibold text-tribal mt-1">
          {scholarship.ministry || scholarship.provider}
        </p>

        <p className="text-xs text-gray-600 mt-3 leading-relaxed">
          {scholarship.description}
        </p>

        {/* Official Source Link Banner */}
        <div className="mt-5 p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-emerald-900 block">Verified Official Source:</span>
            <span className="text-emerald-700">{scholarship.sourceName} (Verified {scholarship.lastVerifiedDate})</span>
          </div>
          <a
            href={scholarship.officialSourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors whitespace-nowrap"
          >
            Visit Official Govt Portal <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Financial Benefits & Eligibility Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Financial Coverage Breakdown */}
        <div className="bg-surface p-5 rounded-2xl border border-gray-200 shadow-xs">
          <h2 className="font-bold text-sm text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-emerald-600" /> Benefit Breakdown (Annual Estimate)
          </h2>

          <div className="mt-4 space-y-2.5 text-xs">
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-600">Maintenance Allowance</span>
              <strong className="text-gray-900">
                ₹{scholarship.benefitDetails?.maintenanceAllowance?.toLocaleString("en-IN") || "Included"}
              </strong>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-600">Tuition Fee Reimbursement</span>
              <strong className="text-gray-900">
                {scholarship.benefitDetails?.tuitionFeeReimbursement || "100% standard approved fee"}
              </strong>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-600">Book & Equipment Grant</span>
              <strong className="text-gray-900">
                ₹{scholarship.benefitDetails?.bookGrant?.toLocaleString("en-IN") || "Provided"}
              </strong>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-600">Hostel Subsidy</span>
              <strong className="text-gray-900">
                ₹{scholarship.benefitDetails?.hostelSubsidy?.toLocaleString("en-IN") || "Included"}
              </strong>
            </div>
            <div className="flex justify-between pt-2 text-sm font-extrabold text-emerald-800 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-200">
              <span>Total Estimated Grant</span>
              <span>₹{scholarship.benefitAmountAnnual.toLocaleString("en-IN")}/year</span>
            </div>
          </div>
        </div>

        {/* Dynamic Eligibility Criteria */}
        <div className="bg-surface p-5 rounded-2xl border border-gray-200 shadow-xs">
          <h2 className="font-bold text-sm text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-saffron" /> Eligibility Criteria
          </h2>

          <div className="mt-4 space-y-3 text-xs">
            {scholarship.eligibilityRules.map((rule, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-gray-50">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-800 font-medium">{rule.description}</span>
              </div>
            ))}

            <div className="flex items-start gap-2.5 p-2 rounded-lg bg-gray-50">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-800 font-medium">
                Income Ceiling: Maximum ₹{scholarship.maxAnnualIncome.toLocaleString("en-IN")} per annum
              </span>
            </div>
            <div className="flex items-start gap-2.5 p-2 rounded-lg bg-gray-50">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-800 font-medium">
                Applicable Geography: {scholarship.applicableStates.includes("ALL") ? "All Indian States & UTs" : scholarship.applicableStates.join(", ")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Required Documents Checklist & Apply Banner */}
      <div className="bg-surface p-5 rounded-2xl border border-gray-200 shadow-xs">
        <h2 className="font-bold text-sm text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
          <FileText className="w-4 h-4 text-tribal" /> Mandatory Documents Required
        </h2>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {scholarship.requiredDocuments.map((doc, idx) => (
            <div key={idx} className="p-3 rounded-xl border border-gray-200 bg-gray-50/60 text-xs">
              <div className="flex items-center justify-between">
                <strong className="text-gray-900">{doc.title}</strong>
                {doc.mandatory && (
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                    Mandatory
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-500 mt-1">{doc.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-gray-500">
            Application Window: <strong>{scholarship.applicationStartDate}</strong> to{" "}
            <strong>{scholarship.applicationDeadline}</strong>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to={`/student/eligibility?schId=${scholarship.id}`}
              className="px-4 py-2 rounded-lg border border-gray-300 text-xs font-bold hover:bg-gray-50"
            >
              Check My Match
            </Link>
            <Link
              to={`/student/apply?schId=${scholarship.id}`}
              className="px-5 py-2 rounded-lg bg-saffron text-white text-xs font-bold hover:bg-saffron-dark shadow-sm flex items-center gap-1.5"
            >
              Start Application <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
