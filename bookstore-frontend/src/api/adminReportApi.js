import axios from "axios";

const API_BASE = "http://localhost:8080/api/admin/reports";

export const getReportSummary = (start, end) =>
  axios.get(`${API_BASE}/summary`, {
    params: { start, end },
  });

export const getDailySales = (start, end) =>
  axios.get(`${API_BASE}/daily-sales`, {
    params: { start, end },
  });

export const getSalesByCategory = (start, end) =>
  axios.get(`${API_BASE}/sales-by-category`, {
    params: { start, end },
  });

export const getBestSellers = (limit = 5) =>
  axios.get(`${API_BASE}/best-sellers`, {
    params: { limit },
  });

export const getInventoryStatus = () =>
  axios.get(`${API_BASE}/inventory`);
