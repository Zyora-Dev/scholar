import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  FileEdit,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Save,
  ShieldCheck,
  Send,
  FolderLock
} from "lucide-react";
import { api } from "../../services/api";
import { useLowBandwidth } from "../../contexts/LowBandwidthContext";
import { Scholarship, StudentProfile, DocumentItem } from "../../types";

export const ApplicationWizard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { saveDraftOffline, getDraftOffline, isOnline } = useLowBandwidth();

  const [step, setStep] = useState(1);
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State across 7 Steps
  const [formData, setFormData] = useState({
    // Step 1: Personal
    fullName: "",
    dob: "",
    gender: "FEMALE",
    mobile: "",
    email: "",
    state: "",
    district: "",
    stCommunity: "",
    // Step 2: Education
    educationLevel: "",
    course: "",
    stream: "",
    yearOfStudy: 3,
    institutionName: "",
    gpaOrPercentage: 84.5,
    // Step 3: Eligibility & Income Declaration
    annualFamilyIncome: 140000,
    noOtherScholarship: true,
    // Step 4: Documents (IDs)
    selectedDocIds: [] as string[],
    // Step 5: Bank / DBT
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    aadhaarLinked: true,
    // Step 6: Review & Final Check
    declarationSigned: false
  });

  const [preSubmissionFlags, setPreSubmissionFlags] = useState<any[]>([]);
  const [readinessScore, setReadinessScore] = useState(95);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([api.getScholarships(), api.getProfile(), api.getDocuments()]).then(
      ([schRes, profRes, docRes]) => {
        if (schRes.success && schRes.data.length > 0) {
          const schId = searchParams.get("schId") || schRes.data[0].id;
          const matched = schRes.data.find((s: any) => s.id === schId) || schRes.data[0];
          setScholarship(matched);
        }

        if (profRes.success && profRes.profile) {
          const p = profRes.profile;
          setProfile(p);

          // Check if offline draft exists
          const offlineDraft = getDraftOffline("current_app");
          if (offlineDraft) {
            setFormData(offlineDraft);
          } else {
            setFormData((prev) => ({
              ...prev,
              fullName: p.fullName,
              dob: p.dob,
              gender: p.gender,
              mobile: p.mobile,
              email: p.email,
              state: p.state,
              district: p.district,
              stCommunity: p.stCommunity,
              educationLevel: p.educationLevel,
              course: p.course,
              stream: p.stream,
              yearOfStudy: p.yearOfStudy,
              institutionName: p.institutionName,
              gpaOrPercentage: p.gpaOrPercentage,
              annualFamilyIncome: p.annualFamilyIncome,
              accountHolderName: p.fullName,
              accountNumber: p.bankAccountNumber || "50100456789123",
              ifscCode: p.bankIfsc || "SBIN0001234",
              bankName: p.bankName || "State Bank of India",
              selectedDocIds: (docRes.data || []).map((d: any) => d.id)
            }));
          }
        }

        if (docRes.success) {
          setDocuments(docRes.data);
        }
        setLoading(false);
      }
    );
  }, []);

  const handleSaveDraft = () => {
    saveDraftOffline("current_app", formData);
    alert("Draft saved successfully to local memory!");
  };

  const handleNext = () => {
    saveDraftOffline("current_app", formData);
    if (step === 5) {
      // Run AI Pre-submission check
      runPreSubmissionCheck();
    }
    setStep((s) => Math.min(7, s + 1));
  };

  const handleBack = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  const runPreSubmissionCheck = () => {
    const flags: any[] = [];
    if (!formData.accountNumber || !formData.ifscCode) {
      flags.push({
        type: "ERROR",
        message: "Bank details for Direct Benefit Transfer are incomplete."
      });
    }

    // Check mandatory documents from scholarship
    if (scholarship) {
      scholarship.requiredDocuments.forEach((req) => {
        const hasIt = documents.some((d) => d.documentType === req.documentType);
        if (!hasIt && req.mandatory) {
          flags.push({
            type: "ERROR",
            message: `Mandatory document not found in Vault: ${req.title}`
          });
        }
      });
    }

    // Mismatch warning check
    documents.forEach((d) => {
      if (d.mismatchFlags && d.mismatchFlags.length > 0) {
        flags.push({
          type: "WARNING",
          message: `${d.title}: Spelling difference flagged for Nodal Officer verification.`
        });
      }
    });

    setPreSubmissionFlags(flags);
    setReadinessScore(flags.some((f) => f.type === "ERROR") ? 70 : 96);
  };

  const handleSubmit = async () => {
    if (!formData.declarationSigned) {
      alert("Please check the final declaration confirmation checkbox.");
      return;
    }

    setSubmitting(true);
    try {
      // Create draft first if not yet created, then submit
      const draftRes = await api.createApplicationDraft(scholarship?.id || "sch-001");
      if (draftRes.success) {
        const appId = draftRes.data.id;
        const submitRes = await api.submitApplication(appId);
        if (submitRes.success) {
          alert("Application submitted successfully! Routed to Institution Verification.");
          navigate("/student/tracking");
        } else {
          alert(`Submission failed: ${submitRes.message}`);
        }
      }
    } catch (e) {
      alert("Error submitting application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-gray-500">Initializing Smart Wizard...</div>;
  }

  const steps = [
    "Personal Details",
    "Education & College",
    "Eligibility Declaration",
    "Document Attachments",
    "Bank / DBT Details",
    "AI Pre-Submission Check",
    "Final Review & Submit"
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Wizard Header */}
      <div className="bg-surface p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded bg-saffron/10 text-saffron">
            Smart Application Wizard
          </span>
          <h1 className="text-xl font-extrabold text-gray-900 mt-1">
            {scholarship?.name || "Scholarship Application"}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Auto-validating form with offline draft safety & AI pre-submission compliance checks.
          </p>
        </div>

        <button
          onClick={handleSaveDraft}
          className="px-3.5 py-2 rounded-lg border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
        >
          <Save className="w-4 h-4 text-tribal" /> Save Draft
        </button>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-surface p-4 rounded-xl border border-gray-200 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-gray-900">
            Step {step} of 7: <span className="text-saffron">{steps[step - 1]}</span>
          </span>
          <span className="text-xs text-gray-500 font-semibold">{Math.round((step / 7) * 100)}% Completed</span>
        </div>
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-saffron h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 7) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content Card */}
      <div className="bg-surface p-6 rounded-2xl border border-gray-200 shadow-xs min-h-[380px] flex flex-col justify-between">
        <div>
          {/* STEP 1: PERSONAL DETAILS */}
          {step === 1 && (
            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-sm text-gray-900 pb-2 border-b border-gray-100">
                1. Personal Details (Pre-filled from Student Profile)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Scheduled Tribe Community</label>
                  <input
                    type="text"
                    value={formData.stCommunity}
                    onChange={(e) => setFormData({ ...formData, stCommunity: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">State & District of Domicile</label>
                  <input
                    type="text"
                    disabled
                    value={`${formData.district}, ${formData.state}`}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: EDUCATION */}
          {step === 2 && (
            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-sm text-gray-900 pb-2 border-b border-gray-100">
                2. Academic & Institution Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Institution Name</label>
                  <input
                    type="text"
                    value={formData.institutionName}
                    onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Course & Branch</label>
                  <input
                    type="text"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Current Year / Semester</label>
                  <input
                    type="number"
                    value={formData.yearOfStudy}
                    onChange={(e) => setFormData({ ...formData, yearOfStudy: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Previous Exam Score / CGPA (%)</label>
                  <input
                    type="number"
                    value={formData.gpaOrPercentage}
                    onChange={(e) => setFormData({ ...formData, gpaOrPercentage: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: ELIGIBILITY & INCOME */}
          {step === 3 && (
            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-sm text-gray-900 pb-2 border-b border-gray-100">
                3. Annual Family Income & Eligibility Declaration
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Total Annual Family Income (All Sources)
                  </label>
                  <input
                    type="number"
                    value={formData.annualFamilyIncome}
                    onChange={(e) => setFormData({ ...formData, annualFamilyIncome: Number(e.target.value) })}
                    className="w-full max-w-sm px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Scheme Ceiling: ₹{scholarship?.maxAnnualIncome.toLocaleString("en-IN")}. Must match Revenue Income Certificate.
                  </p>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-800">
                    <input
                      type="checkbox"
                      checked={formData.noOtherScholarship}
                      onChange={(e) => setFormData({ ...formData, noOtherScholarship: e.target.checked })}
                      className="rounded border-gray-300 text-saffron focus:ring-saffron"
                    />
                    I declare that I am not receiving any duplicate maintenance scholarship from another Ministry/Department.
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: DOCUMENTS ATTACHMENTS */}
          {step === 4 && (
            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-sm text-gray-900 pb-2 border-b border-gray-100">
                4. Select Attached Documents from Vault
              </h3>
              <div className="space-y-2.5">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between"
                  >
                    <div>
                      <strong className="text-gray-900 block">{doc.title}</strong>
                      <span className="text-[11px] text-gray-500 font-mono">
                        {doc.certificateNumber || "Attached"} • {doc.status}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Linked
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: BANK DETAILS */}
          {step === 5 && (
            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-sm text-gray-900 pb-2 border-b border-gray-100">
                5. Direct Benefit Transfer (DBT) Bank Account
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Account Holder Name</label>
                  <input
                    type="text"
                    value={formData.accountHolderName}
                    onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Bank Account Number</label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={formData.ifscCode}
                    onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Bank & Branch Name</label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: AI PRE-SUBMISSION CHECK */}
          {step === 6 && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-saffron" /> AI Pre-Submission Compliance Check
                </h3>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Readiness: {readinessScore}%
                </span>
              </div>

              {preSubmissionFlags.length === 0 ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">READY TO SUBMIT</strong>
                    All mandatory fields, documents, and DBT accounts satisfy government guidelines.
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {preSubmissionFlags.map((flag, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-start gap-3 ${
                        flag.type === "ERROR"
                          ? "bg-rose-50 border-rose-200 text-rose-900"
                          : "bg-amber-50 border-amber-200 text-amber-900"
                      }`}
                    >
                      {flag.type === "ERROR" ? (
                        <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <strong className="font-bold">{flag.type}: </strong>
                        {flag.message}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 7: FINAL REVIEW & SUBMIT */}
          {step === 7 && (
            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-sm text-gray-900 pb-2 border-b border-gray-100">
                7. Final Application Confirmation
              </h3>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Applicant:</span>
                  <strong className="text-gray-900">{formData.fullName} ({formData.stCommunity} Tribe)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Scheme:</span>
                  <strong className="text-gray-900">{scholarship?.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Institution:</span>
                  <span className="text-gray-900">{formData.institutionName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">DBT Account:</span>
                  <span className="text-gray-900 font-mono">{formData.accountNumber} ({formData.ifscCode})</span>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2.5 text-xs text-gray-800 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.declarationSigned}
                    onChange={(e) => setFormData({ ...formData, declarationSigned: e.target.checked })}
                    className="rounded border-gray-300 text-saffron focus:ring-saffron mt-0.5"
                  />
                  <span>
                    I solemnly declare that all particulars furnished above and attachments in the Document Vault are true and correct to the best of my knowledge. I understand that submitting false particulars will result in forfeiture of scholarship under relevant penal codes.
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Stepper Navigation Buttons */}
        <div className="pt-5 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="px-4 py-2 rounded-lg border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>

          {step < 7 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-lg bg-saffron hover:bg-saffron-dark text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors"
            >
              Continue to Step {step + 1} <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting || !formData.declarationSigned}
              className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" /> {submitting ? "Submitting..." : "Submit to Institution"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
