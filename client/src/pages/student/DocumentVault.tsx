import React, { useState, useEffect } from "react";
import {
  FolderLock,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Trash2,
  Eye,
  Plus,
  ShieldCheck,
  Sparkles,
  Info
} from "lucide-react";
import { api } from "../../services/api";
import { DocumentItem } from "../../types";

export const DocumentVault: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState("INCOME_CERTIFICATE");
  const [docTitle, setDocTitle] = useState("");
  const [extractedName, setExtractedName] = useState("Indhira Iyappan");

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = () => {
    api.getDocuments().then((res) => {
      if (res.success) setDocuments(res.data);
      setLoading(false);
    });
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    api
      .uploadDocument({
        documentType: selectedDocType,
        title: docTitle || "Income Certificate (Updated)",
        fileName: `${selectedDocType.toLowerCase()}_2026.pdf`,
        candidateName: extractedName
      })
      .then((res) => {
        if (res.success) {
          setUploadModalOpen(false);
          loadDocs();
        }
      });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this document from the Vault?")) {
      api.deleteDocument(id).then(() => loadDocs());
    }
  };

  // Find any document mismatch for warning banner
  const mismatchedDoc = documents.find((d) => d.mismatchFlags && d.mismatchFlags.length > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-tribal/10 text-tribal">
              <FolderLock className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-gray-900">Document Intelligence Vault</h1>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Secure, encrypted vault for government certificates. AI performs pre-verification and mismatch cross-checks without automatic rejection.
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="px-4 py-2.5 bg-tribal hover:bg-tribal-dark text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" /> Upload New Certificate
        </button>
      </div>

      {/* DOCUMENT MISMATCH DETECTION BANNER (SIH CORE REQUIREMENT) */}
      {mismatchedDoc && (
        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-xs flex items-start gap-3.5">
          <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                Possible Mismatch Detected
              </span>
              <span className="text-xs text-amber-800 font-semibold">Human Review Recommended</span>
            </div>

            <p className="text-xs text-amber-950 font-medium mt-1">
              Cross-check between <strong>Student Profile</strong> and{" "}
              <strong>{mismatchedDoc.title}</strong> flagged a minor variation:
            </p>

            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg text-xs bg-white p-3 rounded-xl border border-amber-200">
              <div>
                <span className="text-[10px] text-gray-400 block font-semibold">Student Profile:</span>
                <strong className="text-gray-900">Indhira Iyappan</strong>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-semibold">Extracted from Document:</span>
                <strong className="text-rose-600">
                  {mismatchedDoc.extractedMetadata?.candidateName || "Indhira Iyyappan"}
                </strong>
              </div>
            </div>

            <p className="text-[11px] text-amber-900 mt-2 font-medium">
              ℹ️ <strong>System Protection Policy:</strong> Antigravity AI never rejects an application solely on spelling or OCR variations. This alert guides you to attach a Tahsildar clarification or an endorsed copy to prevent return.
            </p>
          </div>
        </div>
      )}

      {/* Documents Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-gray-500">Loading Document Vault...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-surface rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Status chip & type */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-gray-100 text-gray-700 uppercase">
                    {doc.documentType.replace("_", " ")}
                  </span>

                  {doc.status === "VALID" ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Valid
                    </span>
                  ) : doc.status === "REQUIRES_REVIEW" ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-300">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Requires Review
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      Expired
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-gray-900">{doc.title}</h3>
                <p className="text-[11px] text-gray-400 font-mono mt-0.5">{doc.fileName}</p>

                {/* Extracted Metadata Box */}
                <div className="mt-3 p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Certificate No:</span>
                    <strong className="text-gray-800 font-mono text-[11px]">
                      {doc.certificateNumber || "N/A"}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Extracted Name:</span>
                    <strong className="text-gray-900">
                      {doc.extractedMetadata?.candidateName || "Indhira Iyappan"}
                    </strong>
                  </div>
                  {doc.issueDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Issue Date:</span>
                      <span className="text-gray-700">{doc.issueDate}</span>
                    </div>
                  )}
                  {doc.issuingAuthority && (
                    <div className="text-[11px] text-gray-500 pt-1 border-t border-gray-200/60 truncate">
                      {doc.issuingAuthority}
                    </div>
                  )}
                </div>

                {doc.verificationNotes && (
                  <p className="mt-2 text-[10px] text-emerald-700 bg-emerald-50/80 p-2 rounded-lg border border-emerald-100 flex items-start gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span>{doc.verificationNotes}</span>
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => alert(`Previewing ${doc.title} (Simulation Mode)`)}
                  className="font-semibold text-tribal hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="text-gray-400 hover:text-rose-600 p-1"
                  title="Remove document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full p-6 space-y-4">
            <h3 className="font-extrabold text-base text-gray-900">Upload Certificate to Vault</h3>
            <p className="text-xs text-gray-500">
              AI will extract metadata (Name, DOB, Issuing authority) and verify cross-record consistency.
            </p>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Document Category</label>
                <select
                  value={selectedDocType}
                  onChange={(e) => setSelectedDocType(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron"
                >
                  <option value="INCOME_CERTIFICATE">Annual Income Certificate</option>
                  <option value="ST_CERTIFICATE">Scheduled Tribe Community Certificate</option>
                  <option value="MARKSHEET">Qualifying Academic Marksheet</option>
                  <option value="BONAFIDE_CERTIFICATE">Bonafide Student Certificate</option>
                  <option value="BANK_PASSBOOK">Bank Passbook / Cancelled Cheque</option>
                  <option value="OTHER">Other Endorsement Document</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Certificate Title / Notes</label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. Income Certificate 2026 (Kotagiri Taluk)"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Candidate Name on Document (Simulate OCR Extraction)
                </label>
                <input
                  type="text"
                  value={extractedName}
                  onChange={(e) => setExtractedName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Tip: Test "Indhira Iyappan" (exact match) vs "Indhira Iyyappan" (mismatch alert).
                </span>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 font-semibold hover:bg-gray-50 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-tribal hover:bg-tribal-dark text-white font-bold"
                >
                  Upload & Run OCR Check
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
