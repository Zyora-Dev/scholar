import React, { useState, useEffect } from "react";
import { FileText, Shield, Clock, Search } from "lucide-react";
import { api } from "../../services/api";

export const AuditLogsView: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAuditLogs().then((res) => {
      if (res.success) setLogs(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-xs text-gray-500">Loading Immutable Audit Logs...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <FileText className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase text-emerald-700">
              Security & Compliance Registry
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mt-1">
            Immutable Public-Service Audit Trail
          </h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Every application submission, scrutiny return, document upload, and rule change is recorded with timestamp and role signature.
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
          Append-Only Ledger
        </span>
      </div>

      {/* Audit Table */}
      <div className="bg-surface rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-600 uppercase font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Actor Details</th>
                <th className="py-3 px-4">Entity Ref</th>
                <th className="py-3 px-4">State Transition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-mono">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50">
                  <td className="py-3 px-4 text-gray-500 text-[11px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-gray-900 font-sans">{log.action}</span>
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <strong className="text-gray-900 block">{log.actorName}</strong>
                    <span className="text-[10px] text-gray-400 font-mono">Role: {log.actorRole}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-700 text-[11px]">
                    {log.entityType}: {log.entityId}
                  </td>
                  <td className="py-3 px-4 text-[11px] font-sans">
                    {log.previousState && log.newState ? (
                      <span className="text-amber-800 font-semibold">
                        {log.previousState} ➔ {log.newState}
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-semibold">Created / Recorded</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
