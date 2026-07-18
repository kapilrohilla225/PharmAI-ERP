import axios from "../api/axios";

export const askAI = (prompt) =>
  axios.post("/ai/chat", { prompt });

export const getInventoryAnalysis = () =>
  axios.get("/ai/inventory-analysis");

export const getSalesSummary = () =>
  axios.get("/ai/sales-summary");

export const getDashboardSummary = () =>
  axios.get("/ai/dashboard-summary");

export const getBusinessInsights = () =>
  axios.get("/ai/business-insights");
