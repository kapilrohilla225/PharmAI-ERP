import axios from "../api/axios";

export const getInventorySummary = () =>
  axios.get("/inventory");

export const adjustStock = (data) =>
  axios.post("/inventory/adjust", data);
