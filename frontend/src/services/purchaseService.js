import axios from "../api/axios";

export const getPurchases = () =>
  axios.get("/purchases");

export const createPurchase = (data) =>
  axios.post("/purchases", data);

export const updatePaymentStatus = (id, paymentStatus) =>
  axios.patch(`/purchases/${id}/payment-status`, { paymentStatus });
