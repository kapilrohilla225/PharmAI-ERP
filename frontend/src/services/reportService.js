import axios from "../api/axios";

export const getSalesReport = () =>
  axios.get("/reports/sales");

export const getPurchaseReport = () =>
  axios.get("/reports/purchases");

export const getInventoryReport = () =>
  axios.get("/reports/inventory");

export const getEmployeeReport = () =>
  axios.get("/reports/employees");

export const downloadExcel = async (type) => {
  const response = await axios.get(`/excel/${type}`, {
    responseType: "blob",
  });
  
  const file = new Blob([response.data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  
  const fileURL = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = fileURL;
  link.setAttribute("download", `${type}-Export-${new Date().toISOString().split("T")[0]}.xlsx`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
