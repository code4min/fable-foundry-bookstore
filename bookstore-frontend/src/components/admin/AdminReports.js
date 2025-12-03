// src/components/admin/AdminReports.js
import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Divider,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import RefreshIcon from "@mui/icons-material/Refresh";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import axiosInstance from "../../api/axiosInstance";
import { format } from "date-fns";
import InventoryCard from "./InventoryCard";

const THEME = {
  brown: "#4E342E",
  beige: "#D7CCC8",
  cream: "#F8F3D9",
  sage: "#9E9770",
  accent: "#7A8B71",
  beige2 : "#d7bd8a"
};

const ENDPOINT = {
  SUMMARY: "/admin/reports/summary",
  DAILY_SALES: "/admin/reports/daily-sales",
  SALES_BY_CATEGORY: "/admin/reports/sales-by-category",
  BEST_SELLERS: "/admin/reports/best-sellers",
  INVENTORY: "/admin/reports/inventory",
};

const COLORS_PIE = [THEME.sage, "#C9B79B", "#A7B29B", THEME.beige2 , THEME.brown];

const AdminReports = () => {
  
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 29);
    return d;
  });
  const [endDate, setEndDate] = useState(() => new Date());

 
  const [summary, setSummary] = useState(null);
  const [dailySales, setDailySales] = useState([]);
  const [salesByCategory, setSalesByCategory] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [inventory, setInventory] = useState([]);

 
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false); // for refresh button
  const [notif, setNotif] = useState({ open: false, message: "", severity: "success" });

  
  const fmt = (d) => format(d, "yyyy-MM-dd");

  const fetchAll = async (opts = {}) => {
    setFetching(true);
    const start = opts.start || fmt(startDate);
    const end = opts.end || fmt(endDate);

    try {
      
      const [summaryRes, dailyRes, catRes, bestRes, invRes] = await Promise.all([
        axiosInstance.get(`${ENDPOINT.SUMMARY}?start=${start}&end=${end}`),
        axiosInstance.get(`${ENDPOINT.DAILY_SALES}?start=${start}&end=${end}`),
        axiosInstance.get(`${ENDPOINT.SALES_BY_CATEGORY}?start=${start}&end=${end}`),
        axiosInstance.get(`${ENDPOINT.BEST_SELLERS}?limit=5`),
        axiosInstance.get(ENDPOINT.INVENTORY),
      ]);

      setSummary(summaryRes.data || null);

      
      const mappedDaily = (dailyRes.data || []).map((d) => ({
        date: d.date ?? d.dateString ?? d[0],
        sales: Number(d.salesAmount ?? d.revenue ?? d.amount ?? d[1] ?? 0),
      }));
      setDailySales(mappedDaily);

      const mappedCat = (catRes.data || []).map((c) => ({
        name: c.categoryName ?? c.name ?? c[0],
        revenue: Number(c.revenue ?? c.amount ?? c[1] ?? 0),
      }));
      setSalesByCategory(mappedCat);

      const mappedBest = (bestRes.data || []).map((b) => ({
        bookId: b.bookId ?? b.id ?? b[0],
        title: b.title ?? b.name ?? String(b[1] ?? ""),
        count: Number(b.count ?? b.salesCount ?? b[2] ?? 0),
      }));
      setBestSellers(mappedBest);

      
      const invPayload = invRes.data;
      let invNormalized = [];
      if (Array.isArray(invPayload)) {
       
        if (invPayload.length > 0 && (invPayload[0].bookId !== undefined || invPayload[0].title !== undefined)) {
          
          invNormalized = invPayload.map((it) => ({
            bookId: it.bookId ?? it.id ?? null,
            title: it.title ?? it.name ?? "—",
            category: it.category ?? it.categoryName ?? "—",
            stock: Number(it.stock ?? it.quantity ?? it[3] ?? 0),
          }));
        } else {
          
          invNormalized = [
            {
              summaryTotalStock: invPayload[0]?.totalStock ?? invPayload[0]?.total ?? invPayload[0]?.summaryTotalStock ?? null,
              summaryLowStock: invPayload[0]?.lowStock ?? invPayload[0]?.low ?? invPayload[0]?.summaryLowStock ?? null,
              summaryOutOfStock: invPayload[0]?.outOfStock ?? invPayload[0]?.out ?? invPayload[0]?.summaryOutOfStock ?? null,
            },
          ];
        }
      } else if (invPayload && typeof invPayload === "object") {
        
        if (invPayload.bookId !== undefined || invPayload.title !== undefined) {
          invNormalized = [
            {
              bookId: invPayload.bookId ?? invPayload.id ?? null,
              title: invPayload.title ?? invPayload.name ?? "—",
              category: invPayload.category ?? invPayload.categoryName ?? "—",
              stock: Number(invPayload.stock ?? invPayload.quantity ?? invPayload[3] ?? 0),
            },
          ];
        } else {
          invNormalized = [
            {
              summaryTotalStock: invPayload.totalStock ?? invPayload.total ?? invPayload.summaryTotalStock ?? null,
              summaryLowStock: invPayload.lowStock ?? invPayload.low ?? invPayload.summaryLowStock ?? null,
              summaryOutOfStock: invPayload.outOfStock ?? invPayload.out ?? invPayload.summaryOutOfStock ?? null,
            },
          ];
        }
      }

      setInventory(invNormalized);

      setNotif({ open: true, message: "Reports loaded", severity: "success" });
    } catch (err) {
      console.error("Error fetching reports:", err);
      setNotif({ open: true, message: "Failed to load reports", severity: "error" });
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    
    setLoading(true);
    fetchAll().finally(() => setLoading(false));
    
  }, []);

  
  const lineData = useMemo(
    () =>
      dailySales.map((d) => ({
        date: d.date,
        sales: d.sales,
      })),
    [dailySales]
  );

  const pieData = useMemo(() => salesByCategory.map((s) => ({ name: s.name, value: s.revenue })), [salesByCategory]);

  
  const downloadCSV = () => {
    const lines = [];
    lines.push(["Report Summary"]);
    if (summary) {
      lines.push(["Total Orders", summary.totalOrders ?? summary.totalOrdersCount ?? ""]);
      lines.push(["Total Revenue", summary.totalRevenue ?? summary.totalSales ?? ""]);
      lines.push(["Total Users", summary.totalUsers ?? summary.userCount ?? ""]);
      lines.push(["Average Order Value", summary.averageOrderValue ?? summary.avgOrderValue ?? ""]);
    }
    lines.push([]);
    lines.push(["Daily Sales"]);
    lines.push(["Date", "Sales"]);
    for (const r of lineData) lines.push([r.date, r.sales]);
    lines.push([]);
    lines.push(["Sales By Category"]);
    lines.push(["Category", "Revenue"]);
    for (const r of pieData) lines.push([r.name, r.value]);
    lines.push([]);
    lines.push(["Best Sellers"]);
    lines.push(["Title", "Count"]);
    for (const b of bestSellers) lines.push([b.title, b.count]);
    lines.push([]);
    
    if (inventory.length && inventory[0].bookId !== undefined) {
      lines.push(["Inventory"]);
      lines.push(["BookId", "Title", "Category", "Stock"]);
      for (const i of inventory) lines.push([i.bookId, i.title, i.category, i.stock]);
    } else {
      lines.push(["Inventory Summary"]);
      if (inventory[0]) {
        lines.push(["TotalStock", inventory[0].summaryTotalStock]);
        lines.push(["LowStock", inventory[0].summaryLowStock]);
        lines.push(["OutOfStock", inventory[0].summaryOutOfStock]);
      }
    }

    const csv = lines.map((r) => r.map((c) => `"${(c ?? "").toString().replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reports_${fmt(startDate)}_to_${fmt(endDate)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ backgroundColor: THEME.cream, minHeight: "100vh", p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" sx={{ color: THEME.brown, mb: 2 }}>
        Reports
      </Typography>

      <Paper sx={{ p: 2, mb: 3, backgroundColor: "#f3edda" }}>
        <Grid container spacing={2} alignItems="center">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid item xs={12} sm={4}>
              <DatePicker label="Start Date" value={startDate} onChange={(newVal) => setStartDate(newVal)} renderInput={(params) => <TextField {...params} fullWidth size="small" />} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <DatePicker label="End Date" value={endDate} onChange={(newVal) => setEndDate(newVal)} renderInput={(params) => <TextField {...params} fullWidth size="small" />} />
            </Grid>
          </LocalizationProvider>

          <Grid item xs={12} sm={4} sx={{ display: "flex", gap: 1 }}>
            <Button variant="contained" onClick={() => fetchAll({ start: fmt(startDate), end: fmt(endDate) })} sx={{ backgroundColor: THEME.sage }}>
              Generate Report
            </Button>

            <Button variant="outlined" onClick={() => fetchAll()} startIcon={<RefreshIcon />}>
              Refresh
            </Button>

            <IconButton onClick={downloadCSV} sx={{ ml: "auto" }} title="Export CSV">
              <DownloadIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: "#e5dcbb" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: THEME.brown }}>
                    Total Orders
                  </Typography>
                  <Typography variant="h4">{summary?.totalOrders ?? summary?.totalOrdersCount ?? 0}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: "#e5dcbb" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: THEME.brown }}>
                    Total Revenue
                  </Typography>
                  <Typography variant="h4">
                    ₹{Number(summary?.totalRevenue ?? summary?.totalSales ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: "#e5dcbb" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: THEME.brown }}>
                    Total Users
                  </Typography>
                  <Typography variant="h4">{summary?.totalUsers ?? 0}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: "#e5dcbb" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: THEME.brown }}>
                    Avg Order Value
                  </Typography>
                  <Typography variant="h4">₹{Number(summary?.averageOrderValue ?? summary?.avgOrderValue ?? 0).toFixed(2)}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          
          <Grid container spacing={5}>
            <Grid item xs={12} md={7}>
              <Card sx={{ p: 2, backgroundColor: "#f3edda", minHeight: 360, minWidth :810 }}>
                <Typography variant="h6" sx={{ color: THEME.brown, mb: 1 }}>
                  Daily Sales
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fill: THEME.brown }} />
                    <YAxis tick={{ fill: THEME.brown }} />
                    <ChartTooltip />
                    <Line type="monotone" dataKey="sales" stroke={THEME.brown} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Grid>

            <Grid item xs={12} md={7}>
              <Card sx={{ p: 2, backgroundColor: "#f3edda", minHeight: 360 , minWidth :500}}>
                <Typography variant="h6" sx={{ color: THEME.brown, mb: 1 }}>
                  Sales by Category
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={100} label>
                      {pieData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={COLORS_PIE[idx % COLORS_PIE.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <ChartTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          
          <Grid container spacing={5}>
            <Grid item xs={12} md={7}>
              <Card sx={{ p: 2, backgroundColor: "#f3edda", minHeight: 360, minWidth: 810 }}>
                <Typography variant="h6" sx={{ color: THEME.brown, mb: 1 }}>
                  Best Sellers
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={bestSellers}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="title" tick={{ fill: THEME.brown }} />
                    <YAxis tick={{ fill: THEME.brown }} />
                    <ChartTooltip />
                    <Bar dataKey="count" fill={"#ab976f"} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Grid>

            <Grid item xs={12} md={5}>
              
              <InventoryCard inventoryData={inventory} theme={THEME} />
            </Grid>
          </Grid>
        </>
      )}

      <Snackbar open={notif.open} autoHideDuration={3000} onClose={() => setNotif((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity={notif.severity} sx={{ width: "100%", backgroundColor: THEME.beige, color: THEME.brown }}>
          {notif.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminReports;
