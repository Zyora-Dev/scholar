import { v4 as uuidv4 } from "uuid";
import { UserRole, AuditLog } from "../types/index.js";
import { store } from "./store.js";

export function logAuditEvent(params: {
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  previousState?: any;
  newState?: any;
  ipAddress?: string;
}): AuditLog {
  const logEntry: AuditLog = {
    id: `log-${Date.now()}-${uuidv4().substring(0, 6)}`,
    actorId: params.actorId,
    actorName: params.actorName,
    actorRole: params.actorRole,
    action: params.action,
    entityType: params.entityType,
    entityId: params.entityId,
    previousState: params.previousState,
    newState: params.newState,
    ipAddress: params.ipAddress || "127.0.0.1",
    timestamp: new Date().toISOString()
  };

  store.auditLogs.unshift(logEntry);
  return logEntry;
}
