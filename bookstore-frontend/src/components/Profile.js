// src/components/Profile.js
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Grid,
  Button,
  Box,
  IconButton,
  Tooltip,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  Chip,
  Stack,
} from "@mui/material";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import SortIcon from "@mui/icons-material/Sort";
import CloseIcon from "@mui/icons-material/Close";
import RoomIcon from "@mui/icons-material/Room";
import Header from "./Header";
import Footer from "./Footer";
import axiosInstance from "../api/axiosInstance";
import { Link } from "react-router-dom";

const Profile = () => {
  const email = localStorage.getItem("email");
  const name = localStorage.getItem("name");
  const token = localStorage.getItem("token");

  
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [currentPassword, setCurrentPassword] = useState(""); 
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [sortAsc, setSortAsc] = useState(false); 
  const [openDeactivateDialog, setOpenDeactivateDialog] = useState(false);

 
  useEffect(() => {
    if (!email || !token) return;

    axiosInstance
      .get(`/auth?email=${email}`)
      .then((res) => {
        setAddress(res.data.address || "");
        setPhoneNumber(res.data.number || "");
      })
      .catch((err) => {
        console.error("Failed to fetch user info:", err);
      });
  }, [email, token]);

  
  useEffect(() => {
    if (email) {
      axiosInstance
        .get(`/purchase?email=${email}`)
        .then((res) => setPurchaseHistory(res.data || []))
        .catch((err) => console.error("Error fetching purchase history:", err));
    }
  }, [email]);

  const handleOpenDeactivateDialog = () => {
    setOpenDeactivateDialog(true);
  };

  const handleCloseDeactivateDialog = () => {
    setOpenDeactivateDialog(false);
  };

  const deactivateAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      const userEmail = localStorage.getItem("email");
      await axiosInstance.put(
        `/auth/deactivate?email=${userEmail}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.clear();
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error deactivating account:", error);
    }
  };

  const handleProfileUpdate = async () => {
    let contactUpdated = false;
    let passwordUpdated = false;

    
    if (phoneNumber.trim() !== "" || address.trim() !== "") {
      try {
        await axiosInstance.put("http://localhost:8080/api/auth/updateContact", {
          email,
          number: phoneNumber,
          address,
        });
        contactUpdated = true;
      } catch (error) {
        console.error("Error updating contact:", error);
      }
    }

    
    if (currentPassword.trim() !== "" && newPassword.trim() !== "") {
      try {
        await axiosInstance.put(
          "http://localhost:8080/api/auth/changePassword",
          {
            email,
            oldPassword: currentPassword, 
            newPassword: newPassword, 
          }
        );
        passwordUpdated = true;

        setCurrentPassword(newPassword); 
        setNewPassword(""); 
      } catch (error) {
        console.error("Error updating password:", error);
      }
    }

    if (contactUpdated || passwordUpdated) {
      
      alert("Profile updated successfully!");
    } else {
      alert("No changes were made or there was an error.");
    }
  };

  const toggleSortOrder = () => {
    setSortAsc((prev) => !prev);
  };


  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "processing":
        return "warning";
      case "shipped":
        return "info";
      case "delivered":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />

     
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          background: "linear-gradient(135deg, #f7f1e3, #f7f1e3)",
          py: 6,
        }}
      >

        <Container sx={{ maxWidth: "lg !important" }}>
          
          <Box
            sx={{
              width: "100%",
              maxWidth: 1000,
              ml: { xs: 2, md: 6 },   
              backgroundColor: "#f5e2c0",
              backgroundImage:
                "url('https://www.transparenttextures.com/patterns/paper.png')",
              border: "1px solid #f5e2c0",
              borderRadius: 3,
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              p: { xs: 3, md: 4 },
            }}
          >

            <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Typography variant="h4" sx={{ color: "#4A3021", fontWeight: 700 }}>
                Profile
              </Typography>

              <Button
                variant="outlined"
                onClick={handleOpenDeactivateDialog}
                sx={{
                  fontWeight: "bold",
                  borderColor: "#b74a4a",
                  color: "#b74a4a",
                  "&:hover": { backgroundColor: "#b74a4a", color: "white" },
                }}
              >
                Deactivate Account
              </Button>
            </Box>

            
            <Dialog
              open={openDeactivateDialog}
              onClose={handleCloseDeactivateDialog}
              PaperProps={{
                sx: {
                  backgroundColor: "#fff7ea",
                  border: "1px solid #e0c9a0",
                },
              }}
            >
              <DialogTitle sx={{ color: "#4A3021" }}>Confirm Deactivation</DialogTitle>
              <DialogContent>
                <DialogContentText sx={{ color: "#4A3021" }}>
                  Are you sure you want to deactivate your account? This action is permanent and cannot be undone.
                </DialogContentText>
              </DialogContent>
              <DialogActions sx={{ pr: 3, pb: 2 }}>
                <Button onClick={handleCloseDeactivateDialog} sx={{ color: "#4A3021" }}>
                  Cancel
                </Button>
                <Button
                  onClick={deactivateAccount}
                  variant="contained"
                  sx={{
                    backgroundColor: "#b74a4a",
                    "&:hover": { backgroundColor: "#94423f" },
                    color: "#fff",
                  }}
                >
                  Deactivate
                </Button>
              </DialogActions>
            </Dialog>

            
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                label="Name"
                fullWidth
                value={name || ""}
                InputProps={{ readOnly: true }}
              />

              <TextField
                label="Email"
                fullWidth
                value={email || ""}
                InputProps={{ readOnly: true }}
              />

              <TextField
                label="Current Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((p) => !p)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  backgroundColor: "#eee1c9ff",
                  "& input": {
                    backgroundColor: "#eee1c9ff"
                  }, "& input:-webkit-autofill": {
                    WebkitBoxShadow: "0 0 0 1000px #eee1c9ff inset",
                    WebkitTextFillColor: "#000",
                  },
                }}
              />

              
              <TextField
                label="New Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={{
                  backgroundColor: "#eee1c9ff",
                  "& input": { backgroundColor: "#eee1c9ff" },
                }}
              />

              <TextField
                label="Phone Number"
                fullWidth
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />

              <TextField
                label="Address"
                fullWidth
                multiline
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <Button
                variant="contained"
                onClick={handleProfileUpdate}
                sx={{
                  mt: 1,
                  backgroundColor: "#998368ff",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#7d6345" },
                  px: 4,
                  alignSelf: "flex-start",
                }}
              >
                Update Profile
              </Button>
            </Stack>

          </Box>

          
          <Box sx={{ maxWidth: 1100, mx: "auto", mt: 4 }}>
            <Box
              sx={{
                backgroundColor: "#d9c096",
                color: "black",
                px: 3,
                py: 2,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                mt: 2,
              }}
            >
              <Typography variant="h5" sx={{ display: "flex", alignItems: "center", color: "#3A2F2F" }}>
                <LocalMallIcon sx={{ mr: 1 }} />
                Purchase History
              </Typography>

              <Tooltip title="Sort by Purchase Date">
                <IconButton onClick={toggleSortOrder} sx={{ color: "#3A2F2F" }}>
                  <SortIcon />
                </IconButton>
              </Tooltip>
            </Box>

            
            {purchaseHistory.length === 0 ? (
              <Typography sx={{ mt: 2, color: "#3A2F2F" }}>No purchases yet.</Typography>
            ) : (
              <Stack spacing={3} sx={{ mt: 3 }}>
                {[...purchaseHistory]
                  .sort((a, b) =>
                    sortAsc ? new Date(a.purchaseDate) - new Date(b.purchaseDate) : new Date(b.purchaseDate) - new Date(a.purchaseDate)
                  )
                  .map((purchase, index) => {
                    return (
                      <Box
                        key={index}
                        sx={{
                          border: "1px solid #efe8cc",
                          borderRadius: 2,
                          p: 2,
                          display: "flex",
                          alignItems: "center",
                          backgroundColor: "#edddbfff", // cream card
                          boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                        }}
                      >
                        <img
                          src={purchase.image}
                          alt={purchase.title}
                          style={{
                            width: 90,
                            height: 120,
                            objectFit: "cover",
                            borderRadius: 5,
                            marginRight: 16,
                          }}
                        />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              textDecoration: purchase.status.toLowerCase() === "cancelled" ? "line-through" : "none",
                              color: purchase.status.toLowerCase() === "cancelled" ? "gray" : "#3A2F2F",
                              "&:hover": { textDecoration: "underline" },
                            }}
                            component={Link}
                            to={`/book/${purchase.bookId}`}
                          >
                            {purchase.title}
                          </Typography>

                          <Typography variant="body2" sx={{ mb: 1, color: "#5e4635" }}>
                            by {purchase.author}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#3A2F2F" }}>
                            ₹{purchase.price}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#3A2F2F" }}>
                            Purchased on: {new Date(purchase.purchaseDate).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#3A2F2F", mb: 1 }}>
                            Delivery by: {new Date(purchase.deliveryDate).toLocaleDateString()}
                          </Typography>

                          {purchase.deliveryAddress && (
                            <Typography variant="body2" sx={{ display: "flex", alignItems: "center", color: "#3A2F2F" }}>
                              <RoomIcon fontSize="small" sx={{ mr: 0.5, color: "#3A2F2F" }} />
                              Delivery to: {purchase.deliveryAddress}
                            </Typography>
                          )}
                        </Box>

                        <Chip label={purchase.status} color={getStatusColor(purchase.status)} sx={{ fontWeight: "bold", fontSize: "0.8rem" }} />
                      </Box>
                    );
                  })}
              </Stack>
            )}
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default Profile;
