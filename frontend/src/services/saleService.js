import axios from "../api/axios";

export const getSales = () =>
  axios.get("/sales");

export const createSale = (data) =>
  axios.post("/sales", data);

export const downloadInvoice = async (id, invoiceNumber) => {
  try {
    const response = await axios.get(`/invoice/${id}`, {
      responseType: "blob",
    });

    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);

    const link = document.createElement("a");
    link.href = fileURL;
    link.setAttribute("download", `Invoice-${invoiceNumber}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(fileURL);
  } catch (error) {
    const errorBlob = error?.response?.data;

    if (errorBlob instanceof Blob) {
      const text = await errorBlob.text();

      try {
        const parsed = JSON.parse(text);
        throw new Error(parsed.message || "Failed to download invoice PDF");
      } catch {
        throw new Error(text || "Failed to download invoice PDF");
      }
    }

    throw error;
  }
};
