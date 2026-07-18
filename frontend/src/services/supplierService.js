import axios from "../api/axios";

export const getSuppliers = (params) =>
  axios.get("/suppliers", { params });

export const getSupplier = (id) =>
  axios.get(`/suppliers/${id}`);

export const createSupplier = (data) =>
  axios.post("/suppliers", data);

export const updateSupplier = (id, data) =>
  axios.put(`/suppliers/${id}`, data);

export const deleteSupplier = (id) =>
  axios.delete(`/suppliers/${id}`);
