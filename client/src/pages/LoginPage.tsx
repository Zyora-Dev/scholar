import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, User, Lock, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { UserRole } from "../types";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("student@demo.saksham.gov.in");
  const [password, setPassword] = useState("Demo@123");
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [loading, setLoading] = useState(false);
  const { login, demoSwitch } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, role);
    setLoading(false);
    if (success) {
      redirectByRole(role);
    } else {
      alert("Invalid credentials. Try using 1-Click Demo Login.");
    }
  };

  const handleOneClickDemo = async (targetRole: UserRole, demoEmail: string) => {
    setLoading(true);
    setEmail(demoEmail);
    setRole(targetRole);
    await demoSwitch(targetRole);
    setLoading(false);
    redirectByRole(targetRole);
  };

  const redirectByRole = (r: UserRole) => {
    if (r === "STUDENT") navigate("/student/dashboard");
    else if (r === "INSTITUTION") navigate("/institution/dashboard");
    else if (r === "ADMIN") navigate("/admin/dashboard");
    else if (r === "SUPER_ADMIN") navigate("/superadmin/master-data");
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-saffron to-tribal p-0.5 mx-auto flex items-center justify-center shadow-sm">
          <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center font-extrabold text-saffron text-xl">
            TS
          </div>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">Sign In to Saksham Portal</h1>
        <p className="text-xs text-gray-500">Ministry of Tribal Affairs • Smart India Hackathon Prototype</p>
      </div>

      {/* 1-CLICK DEMO LOGIN BUTTONS FOR EVALUATORS */}
      <div className="bg-surface p-5 rounded-2xl border-2 border-saffron/30 shadow-xs space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-saffron-dark">
          <Sparkles className="w-4 h-4 text-saffron" />
          <span>Quick 1-Click Hackathon Demo Access:</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
          <button
            onClick={() => handleOneClickDemo("STUDENT", "student@demo.saksham.gov.in")}
            className="p-2.5 rounded-lg bg-gray-50 hover:bg-saffron/10 border border-gray-200 hover:border-saffron text-gray-800 hover:text-saffron-dark transition-all text-left"
          >
            🎓 Student
            <span className="block text-[10px] text-gray-400 font-normal">Indhira Iyappan</span>
          </button>

          <button
            onClick={() => handleOneClickDemo("INSTITUTION", "institution@demo.saksham.gov.in")}
            className="p-2.5 rounded-lg bg-gray-50 hover:bg-tribal/10 border border-gray-200 hover:border-tribal text-gray-800 hover:text-tribal transition-all text-left"
          >
            🏛️ Institution
            <span className="block text-[10px] text-gray-400 font-normal">Nodal Scrutiny</span>
          </button>

          <button
            onClick={() => handleOneClickDemo("ADMIN", "admin@demo.saksham.gov.in")}
            className="p-2.5 rounded-lg bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-500 text-gray-800 hover:text-blue-600 transition-all text-left"
          >
            📊 Admin
            <span className="block text-[10px] text-gray-400 font-normal">State Welfare</span>
          </button>

          <button
            onClick={() => handleOneClickDemo("SUPER_ADMIN", "superadmin@demo.saksham.gov.in")}
            className="p-2.5 rounded-lg bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-500 text-gray-800 hover:text-purple-700 transition-all text-left"
          >
            ⚙️ Super Admin
            <span className="block text-[10px] text-gray-400 font-normal">Master Data Plane</span>
          </button>
        </div>
      </div>

      {/* Manual Login Form */}
      <form onSubmit={handleLogin} className="bg-surface p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4 text-xs">
        <div>
          <label className="block font-bold text-gray-700 mb-1">Email Address</label>
          <div className="relative">
            <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">Select Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg"
          >
            <option value="STUDENT">Student (Tribal Scholar)</option>
            <option value="INSTITUTION">Institution (Nodal Officer)</option>
            <option value="ADMIN">Admin (State Welfare Directorate)</option>
            <option value="SUPER_ADMIN">Super Admin (System / Master Data)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-saffron hover:bg-saffron-dark text-white font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
        >
          {loading ? "Authenticating..." : "Sign In to Portal"} <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-[10px] text-gray-400 text-center pt-2">
          Demo Default Password: <strong className="font-mono text-gray-600">Demo@123</strong>
        </p>
      </form>
    </div>
  );
};
