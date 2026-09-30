import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ListOrdered,
  FileCheck,
  ShieldCheck,
  Users
} from "lucide-react";
import { api } from "../../services/api";
import { ApplicationStatusBadge } from "../../components/Badges";

export const InstitutionDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.getInstitutionDashboard().then((res) => {
      if (res.success) setData(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-xs text-gray-500">Loading Institution Portal...</div>;
  }

  const pendingApps = data?.pendingApplications || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-tribal/10 text-tribal">
              <Building2 className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase text-tribal">Nodal Verification Authority</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mt-1">
            College Nodal Officer Dashboard
          </h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Government College of Technology, Coimbatore • Tribal Welfare Scrutiny Cell
          </p>
        </div>

        <Link
          to="/institution/queue"
          className="px-4 py-2.5 bg-tribal hover:bg-tribal-dark text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <ListOrdered className="w-4 h-4" /> Open Verification Queue ({data?.pendingCount || 0})
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-surface p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-semibold block">Pending Scrutiny</span>
            <strong className="text-2xl font-extrabold text-gray-900">{data?.pendingCount || 1}</strong>
            <span className="text-[10px] text-amber-700 block font-semibold">Requires Physical / Registry Verification</span>
          </div>
        </div>

        <div className="bg-surface p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-semibold block">Recommended to State</span>
            <strong className="text-2xl font-extrabold text-gray-900">{data?.recommendedCount || 4}</strong>
            <span className="text-[10px] text-emerald-700 block font-semibold">Forwarded for DBT Sanction</span>
          </div>
        </div>

        <div className="bg-surface p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-semibold block">Returned to Students</span>
            <strong className="text-2xl font-extrabold text-gray-900">{data?.returnedCount || 1}</strong>
            <span className="text-[10px] text-rose-700 block font-semibold">In Rescue Center for correction</span>
          </div>
        </div>
      </div>

      {/* Pending Queue Summary */}
      <div className="bg-surface p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-saffron" /> Applications Waiting in Scrutiny Queue
          </h3>
          <Link to="/institution/queue" className="text-xs font-bold text-tribal hover:underline">
            View All ({data?.totalQueue || 3})
          </Link>
        </div>

        <div className="mt-4 divide-y divide-gray-100">
          {pendingApps.map((app: any) => (
            <div key={app.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <strong className="text-xs font-bold text-gray-900">{app.personalDetails?.fullName || "Indhira Iyappan"}</strong>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-tribal/10 text-tribal">
                    {app.personalDetails?.stCommunity || "Irula"} Tribe
                  </span>
                </div>
                <p className="text-xs text-gray-700 mt-0.5">{app.scholarshipName}</p>
                <p className="text-[11px] text-gray-400 font-mono">
                  #{app.applicationNumber} • Submitted: {new Date(app.submittedAt || Date.now()).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <ApplicationStatusBadge status={app.status} />
                <button
                  onClick={() => navigate("/institution/queue")}
                  className="px-3.5 py-1.5 bg-tribal text-white font-bold text-xs rounded-lg hover:bg-tribal-dark flex items-center gap-1"
                >
                  Verify <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
