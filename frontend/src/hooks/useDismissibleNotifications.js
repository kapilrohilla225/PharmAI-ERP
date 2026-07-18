import { useState, useEffect, useCallback } from "react";
import { getNotifications } from "../services/notificationService";

const STORAGE_KEY = "dismissed_notifications";

const loadDismissed = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
  } catch {
    return new Set();
  }
};

const saveDismissed = (set) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
};

const useDismissibleNotifications = () => {
  const [loading, setLoading] = useState(true);
  const [lowStock, setLowStock] = useState([]);
  const [expiringSoon, setExpiringSoon] = useState([]);
  const [expired, setExpired] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [dismissed, setDismissed] = useState(loadDismissed);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getNotifications();
      const data = res.data.data || {};
      setLowStock(data.lowStock || []);
      setExpiringSoon(data.expiringSoon || []);
      setExpired(data.expired || []);
      setAuditLogs(data.recentActivities || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const dismiss = useCallback((key) => {
    setDismissed((prev) => {
      const next = new Set(prev);
      next.add(key);
      saveDismissed(next);
      return next;
    });
  }, []);

  const dismissAll = useCallback(() => {
    setDismissed(new Set());
    saveDismissed(new Set());
  }, []);

  const dismissSection = useCallback((keys) => {
    setDismissed((prev) => {
      const next = new Set(prev);
      keys.forEach((k) => next.add(k));
      saveDismissed(next);
      return next;
    });
  }, []);

  const visibleLowStock = lowStock.filter((p) => !dismissed.has(`low_${p._id}`));
  const visibleExpiringSoon = expiringSoon.filter((p) => !dismissed.has(`exp_soon_${p._id}`));
  const visibleExpired = expired.filter((p) => !dismissed.has(`expired_${p._id}`));
  const visibleAuditLogs = auditLogs.filter((l) => !dismissed.has(`audit_${l._id}`));

  const totalCount = visibleLowStock.length + visibleExpiringSoon.length + visibleExpired.length;

  return {
    loading,
    fetch,
    lowStock: visibleLowStock,
    expiringSoon: visibleExpiringSoon,
    expired: visibleExpired,
    auditLogs: visibleAuditLogs,
    totalCount,
    dismiss,
    dismissAll,
    dismissSection,
    dismissed,
  };
};

export default useDismissibleNotifications;
