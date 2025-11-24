import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
  Alert,
  MenuItem,
  Grid,
} from "@mui/material";
import {
  Edit as EditIcon,
  //Search as SearchIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import axiosInstance from "../../api/axiosInstance";

// 🧠 MEMOIZED ROW COMPONENT (renders only when that row’s props change)
const OrderRow = React.memo(({ order, onEdit }) => (
  <TableRow
    sx={{
      "&:hover": { backgroundColor: "#e7e1c8" },
      transition: "background-color 0.3s ease",
    }}
  >
    <TableCell>{order.id}</TableCell>
    <TableCell>
      <Box display="flex" alignItems="center" gap={2}>
        <img
          src={order.image}
          alt={order.title}
          width={50}
          height={70}
          style={{ borderRadius: 4, objectFit: "cover" }}
        />
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {order.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            by {order.author}
          </Typography>
        </Box>
      </Box>
    </TableCell>
    <TableCell>{order.email}</TableCell>
    <TableCell>{order.purchaseDate}</TableCell>
    <TableCell>{order.deliveryDate}</TableCell>
    <TableCell>{order.status}</TableCell>
    <TableCell>{order.deliveryAddress}</TableCell>
    <TableCell>
      <Tooltip title="Edit Order">
        <IconButton
          onClick={() => onEdit(order)}
          sx={{
            color: "#88a060",
            "&:hover": { backgroundColor: "#e7e1c8" },
          }}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
    </TableCell>
  </TableRow>
));

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Search & filter
  const [searchEmail, setSearchEmail] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(""); // 👈 Debounced value
  const [filterStatus, setFilterStatus] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get("/purchase/admin/all");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setNotification({
        open: true,
        message: "Failed to fetch orders",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🕐 Debounce search to avoid lag on typing
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchEmail);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchEmail]);

  // 🧠 Memoized filtered orders (runs only when filters or data change)
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesEmail = debouncedSearch
        ? order.email.toLowerCase().includes(debouncedSearch.toLowerCase())
        : true;
      const matchesStatus = filterStatus
        ? order.status === filterStatus
        : true;
      return matchesEmail && matchesStatus;
    });
  }, [orders, debouncedSearch, filterStatus]);

  const handleOpenEdit = (order) => {
    setSelectedOrder({ ...order });
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setSelectedOrder(null);
    setOpenEdit(false);
  };

  // 💡 Optimized save — updates only one order in state instead of refetching all
  const handleSave = async () => {
    if (!selectedOrder) return;
    try {
      const payload = {
        status: selectedOrder.status,
        deliveryDate: selectedOrder.deliveryDate,
      };
      const res = await axiosInstance.put(
        `/purchase/update/${selectedOrder.id}`,
        payload
      );

      // Update only that order in local state
      setOrders((prev) =>
        prev.map((order) =>
          order.id === selectedOrder.id ? res.data : order
        )
      );

      setNotification({
        open: true,
        message: "Order updated successfully!",
        severity: "success",
      });
      handleCloseEdit();
    } catch (err) {
      console.error("Error updating order:", err);
      const errorMessage =
        err.response?.data && typeof err.response.data === "string"
          ? err.response.data
          : "Failed to update order";
      setNotification({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const orderStatuses = [
    "Order Placed",
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  const handleResetFilters = () => {
    setSearchEmail("");
    setFilterStatus("");
  };

  return (
    <Box sx={{ backgroundColor: "#F8F3D9", minHeight: "100vh", p: 3 }}>
      <Typography
        variant="h4"
        sx={{ color: "#4E342E", fontWeight: "bold", mb: 3 }}
      >
        Manage Orders
      </Typography>

      {/* Search + Filter Controls */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          backgroundColor: "#f3edda",
          borderRadius: 3,
          boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              label="Search by Email"
              variant="outlined"
              size="small"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              sx={{ backgroundColor: "#fff", borderRadius: 1 }}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              select
              fullWidth
              label="Filter by Status"
              variant="outlined"
              size="small"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              sx={{ backgroundColor: "#fff", borderRadius: 1 }}
            >
              <MenuItem value="">All</MenuItem>
              {orderStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={4} display="flex" gap={1}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleResetFilters}
              sx={{
                color: "#4E342E",
                borderColor: "#4E342E",
                "&:hover": {
                  borderColor: "#9E9770",
                  backgroundColor: "#faf8f1",
                },
              }}
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Orders Table */}
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: "#f3edda",
          borderRadius: 3,
          boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#9E9770" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Book</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Buyer</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Purchase Date</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Delivery Date</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Address</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <OrderRow key={order.id} order={order} onEdit={handleOpenEdit} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog
        open={openEdit}
        onClose={handleCloseEdit}
        PaperProps={{
          sx: { borderRadius: 3, backgroundColor: "#FAF8F1", p: 1 },
        }}
      >
        <DialogTitle sx={{ color: "#4E342E", fontWeight: "bold" }}>
          Edit Order
        </DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            margin="dense"
            label="Status"
            value={selectedOrder?.status || ""}
            onChange={(e) =>
              setSelectedOrder((prev) => ({ ...prev, status: e.target.value }))
            }
            sx={{ backgroundColor: "#fff", borderRadius: 1 }}
          >
            {orderStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            margin="dense"
            type="date"
            label="Delivery Date"
            value={selectedOrder?.deliveryDate || ""}
            onChange={(e) =>
              setSelectedOrder((prev) => ({
                ...prev,
                deliveryDate: e.target.value,
              }))
            }
            sx={{ backgroundColor: "#fff", borderRadius: 1 }}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} sx={{ color: "#7A5E48" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              backgroundColor: "#9E9770",
              "&:hover": { backgroundColor: "#4E342E" },
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={notification.severity} sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminOrders;
