import React, { useState, useEffect } from "react";
import { Flag, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles, Filter } from "lucide-react";
import { api } from "../../services/api";

export const AIFlagsView: React.FC = () => {
  const [flags, setFlags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFlags();
  }, []);

  const loadFlags = () => {
    api.getAiFlags().then((res) => {
      if (res.success) setFlags(res.data);
      setLoading(false);
    });
  };

  const handleResolve = async (id: string) => {
    const res = await api.resolveFlag(id);
    if (res.success) {
      alert("Flag resolved successfully and marked as verified in audit registry.");
      loadFlags();
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-gray-500">Loading AI Anomaly Flags...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Sparkles className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase text-purple-600">
              AI Anomaly & Duplicate Detection
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mt-1">
            AI Scrutiny Flags & Verification Alerts
          </h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Automated pattern matching detects potential duplicate applications and certificate spelling variances. Final enforcement requires mandatory human review.
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-800">
          Human-in-the-Loop Enforced
        </span>
      </div>

      {/* Flags List */}
      <div className="bg-surface rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-700">Active Anomaly Flags ({flags.length})</span>
        </div>

        <div className="divide-y divide-gray-100 text-xs">
          {flags.map((flag) => (
            <div key={flag.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      flag.severity === "HIGH"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {flag.severity} SEVERITY
                  </span>
                  <span className="text-xs font-bold text-gray-900">{flag.type.replace("_", " ")}</span>
                  <span className="text-[11px] text-gray-400">
                    Confidence: {Math.round(flag.confidenceScore * 100)}%
                  </span>
                </div>

                <p className="text-gray-700 font-medium">{flag.description}</p>

                <p className="text-[11px] text-gray-500">
                  Student: <strong>{flag.studentName}</strong> • Detected:{" "}
                  {new Date(flag.detectedAt).toLocaleString()}
                </p>

                {flag.resolutionNotes && (
                  <p className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                    <strong>Resolution:</strong> {flag.resolutionNotes} by {flag.resolvedBy}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                {flag.status === "RESOLVED" ? (
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                  </span>
                ) : (
                  <button
                    onClick={() => handleResolve(flag.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Resolve & Verify
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
