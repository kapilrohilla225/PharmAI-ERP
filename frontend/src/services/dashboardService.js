import axios from "../api/axios";

export const getDashboardStats = () =>
  axios.get("/dashboard");
