import axios from "../api/axios";

export const getEmployees = (params) =>
  axios.get("/employees", { params });

export const getEmployee = (id) =>
  axios.get(`/employees/${id}`);

export const createEmployee = (data) =>
  axios.post("/employees", data);

export const updateEmployee = (id, data) =>
  axios.put(`/employees/${id}`, data);

export const deleteEmployee = (id) =>
  axios.delete(`/employees/${id}`);