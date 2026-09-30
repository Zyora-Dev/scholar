import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  ArrowLeft,
  Building2,
  FileCheck
} from "lucide-react";
import { api } from "../../services/api";
import { Scholarship } from "../../types";

export const EligibilityEngineView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [selectedSchId, setSelectedSchId] = useState<string>("");
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.getScholarships().then((res) => {
      if (res.success && res.data.length > 0) {
        setScholarships(res.data);
        const urlId = searchParams.get("schId");
        const initialId = urlId || res.data[0].id;
        setSelectedSchId(initialId);
        evaluate(initialId);
      }
      setLoading(false);
    });
  }, []);

  const evaluate = (schId: string) => {
    setEvaluating(true);
    api
      .checkEligibility(schId)
      .then((res) => {
        if (res.success) setAssessment(res.data);
      })
      .finally(() => setEvaluating(false));
  };

  const handleSelect = (schId: string) => {
    setSelectedSchId(schId);
    evaluate(schId);
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-gray-500">Initializing AI Eligibility Engine...</div>;
  }

  const selectedSch = scholarships.find((s) => s.id === selectedSchId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-saffron/10 text-saffron">
            <Sparkles className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">AI Eligibility Engine</h1>
            <p className="text-xs text-gray-600 mt-0.5">
              Multi-factor dynamic evaluation based on student ST credentials, course, annual family income, and state domicile rules.
            </p>
          </div>
        </div>

        {/* Scheme Selector */}
        <div className="mt-5 max-w-xl">
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Select Scholarship / Fellowship to Assess:
          </label>
          <select
            value={selectedSchId}
            onChange={(e) => handleSelect(e.target.value)}
            className="w-full text-xs font-semibold px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron"
          >
            {scholarships.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.provider})
              </option>
            ))}
          </select>
        </div>
      </div>

      {evaluating || !assessment ? (
        <div className="p-12 text-center text-xs text-gray-500">
          Running multi-factor rule assessment...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Score Card & Breakdown */}
          <div className="bg-surface p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            <div className="text-center">
              <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
                Preliminary Assessment
              </span>
              <div className="mt-2 text-5xl font-extrabold text-gray-900">
                {assessment.matchScore}%
              </div>
              <p
                className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  assessment.status === "Eligible"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : assessment.status === "Potentially Eligible"
                    ? "bg-amber-100 text-amber-900 border border-amber-300"
                    : "bg-rose-100 text-rose-800 border border-rose-300"
                }`}
              >
                {assessment.status}
              </p>
            </div>

            {/* Breakdown Chips */}
            <div className="space-y-2.5 pt-4 border-t border-gray-100 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-600">ST Category Match</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {assessment.breakdown.category}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-600">Course & Level</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {assessment.breakdown.course}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-600">Income Criteria</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {assessment.breakdown.income}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-600">State Domicile</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {assessment.breakdown.location}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-600">Document Readiness</span>
                <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  {assessment.breakdown.documents}
                </span>
              </div>
            </div>

            {/* Apply CTA */}
            <div className="pt-2">
              <Link
                to={`/student/apply?schId=${selectedSchId}`}
                className="w-full py-2.5 bg-saffron hover:bg-saffron-dark text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
              >
                Proceed to Smart Application Wizard <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right: Explainable Reasons & Trust Banner */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-surface p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h2 className="text-sm font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-tribal" /> Explainable Eligibility Factors
              </h2>

              <div className="mt-4 space-y-3">
                {assessment.factors.map((f: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex items-start gap-3 text-xs ${
                      f.type === "SUCCESS"
                        ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                        : f.type === "WARNING"
                        ? "bg-amber-50/70 border-amber-200 text-amber-900"
                        : "bg-rose-50/70 border-rose-200 text-rose-900"
                    }`}
                  >
                    {f.type === "SUCCESS" && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />}
                    {f.type === "WARNING" && <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />}
                    {f.type === "DANGER" && <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />}
                    <div>
                      <span className="font-semibold">{f.message}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mandatory Ethical AI Notice */}
            <div className="p-4 rounded-xl bg-gray-100 border border-gray-200 flex items-start gap-3 text-xs text-gray-700">
              <ShieldAlert className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-900 font-bold mb-0.5">Government Eligibility Policy Notice:</strong>
                {assessment.disclaimer}
                <p className="mt-1 text-[11px] text-gray-500">
                  Saksham AI conducts rule-matching to help students prevent missing criteria and avoidable rejections. Formal sanction and fund disbursement are strictly governed by competent department scrutiny and PFMS guidelines.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
