import axios from "../api/axios";

export const getNotifications = () =>
  axios.get("/notifications");
