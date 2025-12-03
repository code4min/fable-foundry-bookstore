// src/components/AdminDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  LibraryBooks as BooksIcon,
  People as UsersIcon,
  ShoppingCart as OrdersIcon,
  BarChart as ReportsIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const drawerWidth = 240;

const AdminDashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [overview, setOverview] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const adminName = localStorage.getItem("name");

  useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); 

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const summaryRes = await axios.get("http://localhost:8080/api/admin/dashboard/summary", config);
      const trendRes = await axios.get("http://localhost:8080/api/admin/dashboard/sales-trend?days=7", config);

      console.log("📦 Summary Response:", summaryRes.data);
      setOverview(summaryRes.data);

      const mapped = (trendRes.data || []).map((pt) => ({
        date: pt.date,
        sales: pt.revenue ?? 0,
      }));
      setMetrics(mapped);
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);


  const handleDrawerToggle = () => {
    setDrawerOpen((s) => !s);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
    { text: "Books", icon: <BooksIcon />, path: "/admin/books" },
    { text: "Categories", icon: <CategoryIcon />, path: "/admin/categories" },
    { text: "Orders", icon: <OrdersIcon />, path: "/admin/orders" },
    { text: "Users", icon: <UsersIcon />, path: "/admin/users" },
    { text: "Reports", icon: <ReportsIcon />, path: "/admin/reports" },
  ];

  const drawer = (
    <Box sx={{ backgroundColor: "#E9E5D6", height: "100%" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ color: "#4E342E", fontWeight: "bold" }}>
          Admin Panel
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (window.innerWidth < 600) setDrawerOpen(false);
            }}
            sx={{ "&:hover": { backgroundColor: "#D7CCC8" } }}
          >
            <ListItemIcon sx={{ color: "#4E342E" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} sx={{ color: "#4E342E" }} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", backgroundColor: "#F8F3D9", minHeight: "100vh" }}>
      <CssBaseline />

      {/* Top Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: drawerOpen ? { sm: `calc(100% - ${drawerWidth}px)` } : { sm: "100%" },
          ml: drawerOpen ? { sm: `${drawerWidth}px` } : 0,
          backgroundColor: "#9E9770",
          transition: "all 0.3s ease",
        }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
            {drawerOpen ? <ArrowBackIcon /> : <MenuIcon />}
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Welcome, {adminName || "Admin"}
          </Typography>

          <Tooltip title="Logout">
            <IconButton
              onClick={handleLogout}
              sx={{
                color: "#fff",
                borderRadius: "50%",
                p: 1,
                ml: 2,
                "&:hover": { backgroundColor: "#fff", color: "black" },
              }}
            >
              <PowerSettingsNewIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      {drawerOpen && (
        <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 }, transition: "all 0.3s ease" }}>
          <Drawer
            variant="persistent"
            open={drawerOpen}
            sx={{ "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth } }}
          >
            {drawer}
          </Drawer>
        </Box>
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: drawerOpen ? { sm: `calc(100% - ${drawerWidth}px)` } : { sm: "100%" },
          transition: "all 0.3s ease",
        }}
      >
        <Toolbar />
        <Typography variant="h4" sx={{ color: "#4E342E", mb: 3 }}>
          Dashboard Overview
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Summary Cards */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ backgroundColor: "#D7CCC8" }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: "#4E342E" }}>
                      Books
                    </Typography>
                    <Typography variant="h4">{overview?.totalBooks ?? 0}</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ backgroundColor: "#D7CCC8" }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: "#4E342E" }}>
                      Users
                    </Typography>
                    <Typography variant="h4">{overview?.totalUsers ?? 0}</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ backgroundColor: "#D7CCC8" }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: "#4E342E" }}>
                      Orders
                    </Typography>
                    <Typography variant="h4">{overview?.totalOrders ?? 0}</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ backgroundColor: "#D7CCC8" }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: "#4E342E" }}>
                      Total Sales
                    </Typography>
                    <Typography variant="h4">
                      ₹{(overview?.totalRevenue ?? 0).toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Sales Trend Chart */}
            <Box sx={{ mt: 5 }}>
              <Typography variant="h5" sx={{ mb: 2, color: "#4E342E" }}>
                Sales Trends (last 7 days)
              </Typography>
              <Card sx={{ backgroundColor: "#E9E5D6", p: 2 }}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={metrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#4E342E" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
