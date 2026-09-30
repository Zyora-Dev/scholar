import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import {
  BarChart3,
  Users,
  FileCheck,
  Clock,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  MapPin,
  TrendingUp,
  FileText
} from "lucide-react";
import { api } from "../../services/api";

const COLORS = ["#E85D26", "#1B6B3A", "#F4A261", "#2A9D8F", "#E76F51", "#264653"];

export const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminAnalytics().then((res) => {
      if (res.success) setAnalytics(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-xs text-gray-500">Loading State & National Analytics...</div>;
  }

  const kpis = analytics?.kpis;
  const stateData = analytics?.stateDistribution || [];
  const monthlyData = analytics?.monthlyTrends || [];
  const docFailures = analytics?.documentFailurePatterns || [];

  return (
    <div className="space-y-6">
      {/* Header with Mandatory Ethical Hackathon Disclaimer */}
      <div className="bg-surface p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <BarChart3 className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase text-blue-600">
              Directorate Analytics & Monitoring
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mt-1">
            State & National Welfare Analytics
          </h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Cross-state application throughput, DBT disbursement velocity, and AI anomaly detection across tribal regions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/map"
            className="px-3.5 py-2 bg-tribal text-white font-bold text-xs rounded-lg hover:bg-tribal-dark shadow-xs flex items-center gap-1.5"
          >
            <MapPin className="w-4 h-4" /> Tribal Region Map
          </Link>
          <Link
            to="/admin/flags"
            className="px-3.5 py-2 bg-saffron text-white font-bold text-xs rounded-lg hover:bg-saffron-dark shadow-xs flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" /> AI Flags ({kpis?.aiFlagsCount || 2})
          </Link>
        </div>
      </div>

      {/* SAMPLE / DEMO DATA MANDATORY DISCLAIMER BANNER */}
      <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between text-xs text-amber-900">
        <div className="flex items-center gap-2 font-medium">
          <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            <strong>Data Disclosure:</strong> All metrics, state distributions, and charts below are rendered from a <strong>Sample Dataset</strong> for hackathon prototype testing. They do not represent official published Ministry statistics.
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-200 text-amber-900 whitespace-nowrap">
          Sample Dataset
        </span>
      </div>

      {/* Top KPIs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-surface p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-gray-400 text-[11px] font-bold uppercase">Total Students</span>
          <p className="text-2xl font-extrabold text-gray-900 mt-1">{kpis?.totalStudents || 341}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">+18% this cycle</span>
        </div>

        <div className="bg-surface p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-gray-400 text-[11px] font-bold uppercase">Applications</span>
          <p className="text-2xl font-extrabold text-gray-900 mt-1">{kpis?.totalApplications || 513}</p>
          <span className="text-[10px] text-gray-500 font-medium">Across all states</span>
        </div>

        <div className="bg-surface p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-gray-400 text-[11px] font-bold uppercase">Pending Review</span>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">{kpis?.pendingApplications || 90}</p>
          <span className="text-[10px] text-amber-700 font-medium">College scrutiny</span>
        </div>

        <div className="bg-surface p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-gray-400 text-[11px] font-bold uppercase">DBT Sanctioned</span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{kpis?.approvedApplications || 381}</p>
          <span className="text-[10px] text-emerald-700 font-semibold">Credited to Bank</span>
        </div>

        <div className="bg-surface p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-gray-400 text-[11px] font-bold uppercase">Rescue Recovered</span>
          <p className="text-2xl font-extrabold text-rose-600 mt-1">{kpis?.returnedApplications || 43}</p>
          <span className="text-[10px] text-rose-700 font-semibold">In Rescue Center</span>
        </div>

        <div className="bg-surface p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-gray-400 text-[11px] font-bold uppercase">AI Anomaly Flags</span>
          <p className="text-2xl font-extrabold text-purple-600 mt-1">{kpis?.aiFlagsCount || 2}</p>
          <span className="text-[10px] text-purple-700 font-medium">Under Review</span>
        </div>
      </div>

      {/* Main Charts Row 1: State Applications & Monthly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications by State BarChart */}
        <div className="bg-surface p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-bold text-sm text-gray-900">Applications by State & Sanctions</h3>
            <span className="text-xs text-gray-400">Sample Dataset</span>
          </div>
          <div className="h-64 mt-4 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="state" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="applications" name="Applications" fill="#E85D26" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sanctioned" name="Sanctioned (DBT)" fill="#1B6B3A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Submission Trends LineChart */}
        <div className="bg-surface p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-bold text-sm text-gray-900">Monthly Application & Disbursement Trends</h3>
            <span className="text-xs text-gray-400">AY 2025-2026</span>
          </div>
          <div className="h-64 mt-4 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Line
                  type="monotone"
                  dataKey="applications"
                  name="Applications Submitted"
                  stroke="#E85D26"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="disbursements"
                  name="PFMS DBT Disbursed"
                  stroke="#1B6B3A"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Document Failure Patterns & Common Student Barriers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PieChart for Document Failure Patterns */}
        <div className="bg-surface p-5 rounded-2xl border border-gray-200 shadow-xs">
          <h3 className="font-bold text-sm text-gray-900 pb-3 border-b border-gray-100">
            Document Scrutiny Bottlenecks
          </h3>
          <div className="h-56 mt-2 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={docFailures}
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  dataKey="percentage"
                  nameKey="reason"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {docFailures.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1 text-[11px] text-gray-600">
            {docFailures.map((f: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  {f.reason}
                </span>
                <span className="font-bold text-gray-800">{f.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Dashboard */}
        <div className="lg:col-span-2 bg-surface p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-sm text-gray-900">
                System Impact Metrics (Prototype Demonstration)
              </h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                High Efficiency
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-[10px] text-gray-500 block font-semibold">Avg Correction Time</span>
                <strong className="text-base font-extrabold text-gray-900">2.4 Days</strong>
                <span className="text-[9px] text-emerald-600 block">Down from 18 days</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-[10px] text-gray-500 block font-semibold">Rescued via Portal</span>
                <strong className="text-base font-extrabold text-rose-600">92% Rate</strong>
                <span className="text-[9px] text-gray-500 block">Applications recovered</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-[10px] text-gray-500 block font-semibold">Renewals Retained</span>
                <strong className="text-base font-extrabold text-emerald-600">98.4%</strong>
                <span className="text-[9px] text-emerald-700 block">Zero dropouts</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-[10px] text-gray-500 block font-semibold">Mismatches Pre-Flagged</span>
                <strong className="text-base font-extrabold text-tribal">100%</strong>
                <span className="text-[9px] text-tribal block">Human review mode</span>
              </div>
            </div>

            <div className="mt-5 p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600">
              <strong className="text-gray-900 block mb-1">Administrative Insight:</strong>
              The top reason for application return across tribal regions is name spelling variations in Tahsildar revenue certificates (44%). Saksham AI’s phonetic mismatch detection alerts students prior to rejection, reducing re-application cycles.
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
            <span>Powered by Ministry of Tribal Affairs Smart Governance Engine</span>
            <Link to="/admin/audit-logs" className="text-tribal font-bold hover:underline flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> View Audit Trail
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
