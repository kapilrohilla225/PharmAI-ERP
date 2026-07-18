import axios from "../api/axios";

export const getSettings = () =>
  axios.get("/settings");

export const updateSettings = (data) =>
  axios.put("/settings", data);
