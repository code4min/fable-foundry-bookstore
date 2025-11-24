import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  MenuItem,
  //Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  RemoveCircle as BanIcon,
  Restore as ReactivateIcon,
  Visibility as LogsIcon,
  Info as InfoIcon,
} from "@mui/icons-material";

import {
  Email,
  Phone,
  Home,
  Badge,
  Person,
  Shield,
  ToggleOn,
  ToggleOff,
} from "@mui/icons-material";

import axiosInstance from "../../api/axiosInstance";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // logs dialog
  const [logsOpen, setLogsOpen] = useState(false);
  const [logsData, setLogsData] = useState(null);
  const [logsLoading, setLogsLoading] = useState(false);

  // ✅ NEW: user details dialog
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // notification
  const [notif, setNotif] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [togglingUserId, setTogglingUserId] = useState(null);

  // ================== FETCH USERS ==================
  const fetchUsers = async (opts = {}) => {
    const query =
      opts.searchQuery !== undefined ? opts.searchQuery : searchQuery;
    const status =
      opts.filterStatus !== undefined ? opts.filterStatus : filterStatus;

    try {
      setLoading(true);
      let endpoint = "/admin/users";

      if (query && query.trim() !== "") {
        endpoint = `/admin/users/search?query=${encodeURIComponent(
          query.trim()
        )}`;
      } else if (status) {
        endpoint = `/admin/users/status?status=${encodeURIComponent(status)}`;
      }

      const res = await axiosInstance.get(endpoint);
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setNotif({
        open: true,
        message: "Failed to fetch users",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearchFilter = () => {
    fetchUsers({ searchQuery, filterStatus });
  };

  const handleReset = () => {
    setSearchQuery("");
    setFilterStatus("");
    fetchUsers({ searchQuery: "", filterStatus: "" });
  };

  // ================== TOGGLE STATUS ==================
  const toggleUserStatus = async (user) => {
    const id = user.id;
    try {
      setTogglingUserId(id);
      await axiosInstance.put(`/admin/users/${id}/toggle`);
      setNotif({
        open: true,
        message:
          user.isActive === false || user.active === false
            ? "User reactivated"
            : "User banned",
        severity: "success",
      });
      fetchUsers();
    } catch (err) {
      console.error("Toggle user failed:", err);
      setNotif({
        open: true,
        message: "Failed to update user status",
        severity: "error",
      });
    } finally {
      setTogglingUserId(null);
    }
  };

  // ================== LOGS ==================
  const openLogs = async (user) => {
    try {
      setLogsLoading(true);
      setLogsOpen(true);
      // ✅ UPDATED endpoint
      const res = await axiosInstance.get(`/admin/activities/user/${user.id}`);
      setLogsData(res.data);
    } catch (err) {
      console.error("Failed to fetch logs:", err);
      setNotif({ open: true, message: "Failed to fetch logs", severity: "error" });
      setLogsData(null);
    } finally {
      setLogsLoading(false);
    }
  };

  const closeLogs = () => {
    setLogsOpen(false);
    setLogsData(null);
  };

  // ================== DETAILS DIALOG ==================
  const openDetails = (user) => {
    setSelectedUser(user);
    setDetailsOpen(true);
  };

  const closeDetails = () => {
    setDetailsOpen(false);
    setSelectedUser(null);
  };

  return (
    <Box sx={{ backgroundColor: "#F8F3D9", minHeight: "100vh", p: 3 }}>
      <Typography
        variant="h4"
        sx={{ color: "#4E342E", fontWeight: "bold", mb: 3 }}
      >
        Manage Users
      </Typography>

      {/* Search + Filter */}
      <Paper sx={{ p: 2, mb: 3, backgroundColor: "#f3edda", borderRadius: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              size="small"
              label="Search by name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: "#9E9770" }} />,
              }}
              sx={{ backgroundColor: "#fff", borderRadius: 1 }}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              select
              fullWidth
              size="small"
              label="Filter by status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              sx={{ backgroundColor: "#fff", borderRadius: 1 }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={4} sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              onClick={handleSearchFilter}
              sx={{
                backgroundColor: "#9E9770",
                "&:hover": { backgroundColor: "black" },
              }}
              startIcon={<SearchIcon />}
            >
              Search / Filter
            </Button>

            <Button
              variant="outlined"
              onClick={handleReset}
              startIcon={<RefreshIcon />}
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

      {/* USERS TABLE */}
      <TableContainer
        component={Paper}
        sx={{ backgroundColor: "#f3edda", borderRadius: 3 }}
      >
        {loading ? (
          <Box sx={{ p: 6, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead sx={{ backgroundColor: "#9E9770" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Phone</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Action</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>View Logs</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => {
                  const isActive = user.isActive ?? user.active ?? true;
                  return (
                    <TableRow key={user.id} sx={{ "&:hover": { backgroundColor: "#e7e1c8" } }}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.number ?? "—"}</TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            color: isActive ? "#2e7d32" : "#b71c1c",
                            fontWeight: 600,
                          }}
                        >
                          {isActive ? "Active" : "Inactive"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={isActive ? "Ban user" : "Reactivate user"}>
                          <span>
                            <IconButton
                              onClick={() => toggleUserStatus(user)}
                              disabled={togglingUserId === user.id}
                              sx={{ color: isActive ? "#b71c1c" : "#2e7d32" }}
                            >
                              {togglingUserId === user.id ? (
                                <CircularProgress size={18} />
                              ) : isActive ? (
                                <BanIcon />
                              ) : (
                                <ReactivateIcon />
                              )}
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Logs">
                          <IconButton onClick={() => openLogs(user)} sx={{ color: "#4E342E" }}>
                            <LogsIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Details">
                          <IconButton onClick={() => openDetails(user)} sx={{ color: "#4E342E" }}>
                            <InfoIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* ================== LOGS DIALOG ================== */}
      {/* ================== LOGS DIALOG ================== */}
      <Dialog open={logsOpen} onClose={closeLogs} fullWidth maxWidth="sm">
        <DialogTitle sx={{ backgroundColor: "#9E9770", color: "white" }}>
          User Activity Logs
        </DialogTitle>

        <DialogContent sx={{ backgroundColor: "#fdf9ec" }}>
          {logsLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : logsData && logsData.length > 0 ? (
            logsData.map((log, idx) => (
              <Paper
                key={idx}
                elevation={0}
                sx={{
                  p: 2,
                  mb: 1.5,
                  borderLeft: "4px solid #9E9770",
                  backgroundColor: idx % 2 === 0 ? "#fffaf0" : "#f6f2e4",
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#4E342E" }}>
                  {new Date(log.createdAt).toLocaleString()}
                </Typography>

                <Typography variant="body1" sx={{ mt: 0.5 }}>
                  <strong>Action:</strong> {log.action}
                </Typography>

                {log.details && (
                  <Typography variant="body2" sx={{ color: "#6d5b46", mt: 0.3 }}>
                    <strong>Details:</strong> {log.details}
                  </Typography>
                )}
              </Paper>
            ))
          ) : (
            <Typography sx={{ color: "#6d5b46", py: 2 }}>
              No logs available for this user.
            </Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ backgroundColor: "#f3edda" }}>
          <Button
            onClick={closeLogs}
            sx={{
              color: "#4E342E",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#e7e1c8" },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>


      {/* ================== USER DETAILS DIALOG ================== */}
      {/* ================== USER DETAILS DIALOG ================== */}
      {/* ================== USER DETAILS DIALOG ================== */}
<Dialog open={detailsOpen} onClose={closeDetails} fullWidth maxWidth="sm">
  <DialogTitle
    sx={{
      backgroundColor: "#9E9770",
      color: "white",
      fontWeight: "bold",
      letterSpacing: 0.5,
      display: "flex",
      alignItems: "center",
      gap: 1,
    }}
  >
    <Person fontSize="medium" />
    User Details
  </DialogTitle>

  <DialogContent
    sx={{
      backgroundColor: "#fdf9ec",
      py: 3,
      px: 4,
    }}
  >
    {selectedUser ? (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.4,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#4E342E",
            mb: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Badge sx={{ color: "#4E342E" }} />
          {selectedUser.name}
        </Typography>

        <Typography
          variant="body1"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <Email sx={{ color: "#6d5b46" }} fontSize="small" />
          <strong>Email:</strong> {selectedUser.email}
        </Typography>

        <Typography
          variant="body1"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <Phone sx={{ color: "#6d5b46" }} fontSize="small" />
          <strong>Phone:</strong> {selectedUser.number || "—"}
        </Typography>

        <Typography
          variant="body1"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <Home sx={{ color: "#6d5b46" }} fontSize="small" />
          <strong>Address:</strong> {selectedUser.address || "—"}
        </Typography>

        <Typography
          variant="body1"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <Shield sx={{ color: "#6d5b46" }} fontSize="small" />
          <strong>Role:</strong> {selectedUser.role}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mt: 1,
          }}
        >
          {selectedUser.active ? (
            <ToggleOn sx={{ color: "#558B2F" }} />
          ) : (
            <ToggleOff sx={{ color: "#C62828" }} />
          )}
          <strong>Status:</strong>
          <Box
            sx={{
              backgroundColor: selectedUser.active ? "#C5E1A5" : "#EF9A9A",
              color: selectedUser.active ? "#33691E" : "#B71C1C",
              px: 1.5,
              py: 0.3,
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "0.9rem",
            }}
          >
            {selectedUser.active ? "Active" : "Inactive"}
          </Box>
        </Typography>
      </Box>
    ) : (
      <Typography sx={{ color: "#6d5b46" }}>No user selected.</Typography>
    )}
  </DialogContent>

  <DialogActions sx={{ backgroundColor: "#f3edda" }}>
    <Button
      onClick={closeDetails}
      sx={{
        color: "#4E342E",
        fontWeight: "bold",
        "&:hover": { backgroundColor: "#e7e1c8" },
      }}
    >
      Close
    </Button>
  </DialogActions>
</Dialog>


      {/* ================== SNACKBAR ================== */}
      <Snackbar
        open={notif.open}
        autoHideDuration={3000}
        onClose={() => setNotif((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={notif.severity}
          sx={{
            width: "100%",
            backgroundColor:
              notif.severity === "success"
                ? "#D7CCC8"
                : notif.severity === "error"
                ? "#EF9A9A"
                : "#FFF3E0",
            color: "#4E342E",
            fontWeight: "bold",
          }}
        >
          {notif.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminUsers;
