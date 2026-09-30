import React, { useState, useEffect } from "react";
import {
  Sliders,
  Plus,
  CheckCircle2,
  Building2,
  MapPin,
  FileCheck,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { api } from "../../services/api";

export const MasterDataManager: React.FC = () => {
  const [states, setStates] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states for new entries
  const [newStateName, setNewStateName] = useState("");
  const [newStateCode, setNewStateCode] = useState("");
  const [newTribalPop, setNewTribalPop] = useState("");

  const [newDistrictName, setNewDistrictName] = useState("");
  const [selectedStateCode, setSelectedStateCode] = useState("TN");
  const [majorTribes, setMajorTribes] = useState("");

  const [newSchName, setNewSchName] = useState("");
  const [newSchMaxIncome, setNewSchMaxIncome] = useState(300000);
  const [newSchAnnualGrant, setNewSchAnnualGrant] = useState(50000);
  const [newSchRuleDesc, setNewSchRuleDesc] = useState("Candidate must be an active resident of the declared tribal region.");

  useEffect(() => {
    loadMasterData();
  }, []);

  const loadMasterData = () => {
    Promise.all([api.getStates(), api.getDistricts()]).then(([sRes, dRes]) => {
      if (sRes.success) setStates(sRes.data);
      if (dRes.success) setDistricts(dRes.data);
      setLoading(false);
    });
  };

  const handleAddState = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStateName || !newStateCode) return;
    const res = await api.addState({
      code: newStateCode.toUpperCase(),
      name: newStateName,
      tribalPopPercentage: Number(newTribalPop) || 0
    });
    if (res.success) {
      alert(`State ${newStateName} successfully added to database! No code changes needed.`);
      setNewStateName("");
      setNewStateCode("");
      setNewTribalPop("");
      loadMasterData();
    }
  };

  const handleAddDistrict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDistrictName) return;
    const res = await api.addDistrict({
      stateCode: selectedStateCode,
      name: newDistrictName,
      isTribalRegion: true,
      majorTribes: majorTribes.split(",").map((t) => t.trim())
    });
    if (res.success) {
      alert(`District ${newDistrictName} added to ${selectedStateCode}!`);
      setNewDistrictName("");
      setMajorTribes("");
      loadMasterData();
    }
  };

  const handleAddScheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchName) return;
    const res = await api.addScholarship({
      name: newSchName,
      tagline: "Dynamically added scheme with custom eligibility rules",
      type: "SCHOLARSHIP",
      provider: "STATE_GOVERNMENT",
      ministry: "State Tribal Welfare Directorate",
      officialSourceUrl: "https://tribal.gov.in",
      sourceName: "Welfare Directorate Notification",
      sourceType: "OFFICIAL_PORTAL",
      lastVerifiedDate: new Date().toISOString().split("T")[0],
      verificationStatus: "VERIFIED",
      applicableStates: ["ALL"],
      educationLevels: ["UNDERGRADUATE", "POSTGRADUATE"],
      coursesAllowed: ["ALL"],
      maxAnnualIncome: Number(newSchMaxIncome),
      minAcademicPercentage: 50,
      benefitAmountAnnual: Number(newSchAnnualGrant),
      benefitDetails: { totalEstAnnual: Number(newSchAnnualGrant) },
      eligibilityRules: [
        { field: "annualFamilyIncome", operator: "LESS_THAN_OR_EQUAL", value: Number(newSchMaxIncome), description: `Income under ₹${newSchMaxIncome}`, mandatory: true },
        { field: "customRule", operator: "EQUALS", value: true, description: newSchRuleDesc, mandatory: true }
      ],
      requiredDocuments: [
        { documentType: "ST_CERTIFICATE", title: "ST Certificate", mandatory: true, description: "Official ST Proof" },
        { documentType: "INCOME_CERTIFICATE", title: "Income Certificate", mandatory: true, description: "Revenue Income Proof" }
      ],
      applicationStartDate: "2026-08-01",
      applicationDeadline: "2026-11-30",
      renewalRules: { requiresPassMarks: true, minAttendancePercent: 75, annualVerification: true },
      description: "Dynamically configured scholarship scheme running through database-driven rule engine."
    });

    if (res.success) {
      alert("New Scholarship & Dynamic Eligibility Rules added to database without modifying frontend code!");
      setNewSchName("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Sliders className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase text-purple-600">
              Super Admin Control Plane
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mt-1">
            India-Wide Master Data & Rules Manager
          </h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Add new Indian States, Tribal Districts, Scholarships, and Dynamic Eligibility Rules directly into the database with zero frontend code modification.
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-900">
          Database-Driven Architecture
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form 1: Add New State */}
        <div className="bg-surface p-5 rounded-2xl border border-gray-200 shadow-xs">
          <h3 className="font-bold text-sm text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-saffron" /> 1. Add New State / UT
          </h3>
          <form onSubmit={handleAddState} className="mt-4 space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">State / UT Name</label>
              <input
                type="text"
                value={newStateName}
                onChange={(e) => setNewStateName(e.target.value)}
                placeholder="e.g. Telangana"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">State Code (2 Letters)</label>
              <input
                type="text"
                maxLength={2}
                value={newStateCode}
                onChange={(e) => setNewStateCode(e.target.value)}
                placeholder="e.g. TS"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white uppercase font-mono"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">ST Population Percentage (%)</label>
              <input
                type="number"
                step="0.1"
                value={newTribalPop}
                onChange={(e) => setNewTribalPop(e.target.value)}
                placeholder="e.g. 9.3"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-saffron hover:bg-saffron-dark text-white font-bold rounded-lg shadow-xs transition-colors"
            >
              + Save State to Master Data
            </button>
          </form>
        </div>

        {/* Form 2: Add New District */}
        <div className="bg-surface p-5 rounded-2xl border border-gray-200 shadow-xs">
          <h3 className="font-bold text-sm text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-tribal" /> 2. Add Tribal District
          </h3>
          <form onSubmit={handleAddDistrict} className="mt-4 space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Parent State</label>
              <select
                value={selectedStateCode}
                onChange={(e) => setSelectedStateCode(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg"
              >
                {states.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">District / Region Name</label>
              <input
                type="text"
                value={newDistrictName}
                onChange={(e) => setNewDistrictName(e.target.value)}
                placeholder="e.g. Bhadrachalam"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Major Tribes (Comma separated)</label>
              <input
                type="text"
                value={majorTribes}
                onChange={(e) => setMajorTribes(e.target.value)}
                placeholder="e.g. Koya, Kondareddi, Yanadi"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-tribal hover:bg-tribal-dark text-white font-bold rounded-lg shadow-xs transition-colors"
            >
              + Save District to Master Data
            </button>
          </form>
        </div>

        {/* Form 3: Add Dynamic Scholarship & Rules */}
        <div className="bg-surface p-5 rounded-2xl border border-gray-200 shadow-xs">
          <h3 className="font-bold text-sm text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" /> 3. Dynamic Scheme & Rules
          </h3>
          <form onSubmit={handleAddScheme} className="mt-4 space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Scheme Name</label>
              <input
                type="text"
                value={newSchName}
                onChange={(e) => setNewSchName(e.target.value)}
                placeholder="e.g. Special Tribal Drone Training Grant"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Income Limit (₹)</label>
                <input
                  type="number"
                  value={newSchMaxIncome}
                  onChange={(e) => setNewSchMaxIncome(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Annual Grant (₹)</label>
                <input
                  type="number"
                  value={newSchAnnualGrant}
                  onChange={(e) => setNewSchAnnualGrant(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Dynamic Eligibility Condition</label>
              <input
                type="text"
                value={newSchRuleDesc}
                onChange={(e) => setNewSchRuleDesc(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow-xs transition-colors"
            >
              + Create Scheme & Dynamic Rule
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
