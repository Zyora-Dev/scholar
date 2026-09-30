import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  ShieldCheck,
  Calendar,
  IndianRupee,
  MapPin,
  ExternalLink,
  Sparkles,
  ArrowRight,
  BookOpen
} from "lucide-react";
import { api } from "../../services/api";
import { VerificationBadge, MatchScoreBadge } from "../../components/Badges";
import { Scholarship } from "../../types";

export const ScholarshipDiscovery: React.FC = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("ALL");
  const [selectedLevel, setSelectedLevel] = useState("ALL");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedVerification, setSelectedVerification] = useState("ALL");

  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.getScholarships(), api.getStates()]).then(([schRes, stateRes]) => {
      if (schRes.success) setScholarships(schRes.data);
      if (stateRes.success) setStates(stateRes.data);
      setLoading(false);
    });
  }, []);

  const handleFilter = () => {
    setLoading(true);
    api
      .getScholarships({
        state: selectedState,
        educationLevel: selectedLevel,
        type: selectedType,
        verificationStatus: selectedVerification,
        search
      })
      .then((res) => {
        if (res.success) setScholarships(res.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    handleFilter();
  }, [selectedState, selectedLevel, selectedType, selectedVerification]);

  return (
    <div className="space-y-6">
      {/* Title & Trust Header */}
      <div className="bg-surface p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-saffron bg-saffron/10 px-2 py-0.5 rounded">
                Pan-India Catalog
              </span>
              <span className="text-xs text-gray-500 font-medium">All 28 States & 8 UTs</span>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 mt-1">
              Smart Scholarship & Fellowship Discovery
            </h1>
            <p className="text-xs text-gray-600 mt-1 max-w-2xl">
              Discover central and state government schemes, national fellowships, and specialized grants for Scheduled Tribe scholars. Every listing is tagged with official verification status.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/student/eligibility"
              className="px-4 py-2.5 bg-tribal text-white text-xs font-bold rounded-lg shadow-sm hover:bg-tribal-dark flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" /> AI Eligibility Check
            </Link>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFilter()}
              placeholder="Search scheme name or keywords..."
              className="w-full text-xs pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron focus:bg-white"
            />
          </div>

          {/* State Filter */}
          <div>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full text-xs px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron"
            >
              <option value="ALL">All States / Central Schemes</option>
              {states.map((s) => (
                <option key={s.code} value={s.name}>
                  {s.name} ({s.tribalPopPercentage}% ST Pop)
                </option>
              ))}
            </select>
          </div>

          {/* Education Level */}
          <div>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full text-xs px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron"
            >
              <option value="ALL">All Education Levels</option>
              <option value="HIGHER_SECONDARY">Higher Secondary (Class 11-12)</option>
              <option value="DIPLOMA">Polytechnic / Diploma</option>
              <option value="UNDERGRADUATE">Undergraduate (B.Tech, B.Sc, MBBS)</option>
              <option value="POSTGRADUATE">Postgraduate (M.Tech, M.Sc, MBA)</option>
              <option value="PHD">M.Phil / Doctoral (Ph.D.)</option>
            </select>
          </div>

          {/* Opportunity Type */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full text-xs px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron"
            >
              <option value="ALL">All Types</option>
              <option value="SCHOLARSHIP">Scholarships</option>
              <option value="FELLOWSHIP">Fellowships</option>
            </select>
          </div>

          {/* Verification Status */}
          <div>
            <select
              value={selectedVerification}
              onChange={(e) => setSelectedVerification(e.target.value)}
              className="w-full text-xs px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron"
            >
              <option value="ALL">All Verification Statuses</option>
              <option value="VERIFIED">Verified Official Source Only</option>
              <option value="DEMO">Demo Data Records</option>
            </select>
          </div>
        </div>
      </div>

      {/* Scheme Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-gray-500">
          Loading matching verified schemes...
        </div>
      ) : scholarships.length === 0 ? (
        <div className="bg-surface p-12 rounded-2xl border border-gray-200 text-center">
          <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-gray-800 text-sm">No schemes found matching these criteria</h3>
          <p className="text-xs text-gray-500 mt-1">
            Try adjusting your state filter or education level.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {scholarships.map((sch) => (
            <div
              key={sch.id}
              className="bg-surface rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Badges row */}
                <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                  <VerificationBadge status={sch.verificationStatus} />
                  <MatchScoreBadge score={sch.id === "sch-001" ? 95 : sch.id === "sch-004" ? 92 : 80} />
                </div>

                {/* Scheme Title & Ministry */}
                <h3 className="font-bold text-base text-gray-900 leading-snug">
                  {sch.name}
                </h3>
                <p className="text-xs text-tribal font-semibold mt-1">
                  {sch.ministry || sch.provider}
                </p>

                <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                  {sch.tagline || sch.description}
                </p>

                {/* Key Metrics Chips */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-gray-50 border border-gray-100 flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="text-[10px] text-gray-400 block">Est. Annual Benefit</span>
                      <strong className="text-gray-900">
                        ₹{sch.benefitAmountAnnual.toLocaleString("en-IN")}/yr
                      </strong>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-gray-50 border border-gray-100 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-saffron" />
                    <div>
                      <span className="text-[10px] text-gray-400 block">Deadline</span>
                      <strong className="text-gray-900">{sch.applicationDeadline}</strong>
                    </div>
                  </div>
                </div>

                {/* Applicable Region & Source */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-gray-100">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {sch.applicableStates.includes("ALL") ? "All Indian States & UTs" : sch.applicableStates.join(", ")}
                  </span>
                  <a
                    href={sch.officialSourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-tribal font-semibold hover:underline flex items-center gap-0.5"
                  >
                    Official Portal <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                <Link
                  to={`/student/scholarships/${sch.id}`}
                  className="text-xs font-bold text-gray-700 hover:text-gray-900 hover:underline"
                >
                  View Details & Criteria
                </Link>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/student/eligibility?schId=${sch.id}`}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold hover:bg-gray-50"
                  >
                    Check Match
                  </Link>
                  <Link
                    to={`/student/apply?schId=${sch.id}`}
                    className="px-3.5 py-1.5 rounded-lg bg-saffron text-white text-xs font-bold hover:bg-saffron-dark shadow-xs flex items-center gap-1"
                  >
                    Apply Now <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
