import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
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
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import axiosInstance from "../../api/axiosInstance";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  // Fetch all categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Open Add/Edit dialog
  const handleOpenDialog = (category = null) => {
    setEditingCategory(category);
    setCategoryName(category ? category.name : "");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
    setCategoryName("");
  };

  // Add or update category
  const handleSaveCategory = async () => {
    try {
      if (editingCategory) {
        await axiosInstance.put(`/categories/${editingCategory.id}`, { name: categoryName });
        setSnackbar({ open: true, message: "Category updated successfully!", severity: "success" });
      } else {
        await axiosInstance.post("/categories", { name: categoryName });
        setSnackbar({ open: true, message: "Category added successfully!", severity: "success" });
      }
      fetchCategories();
      handleCloseDialog();
    } catch (error) {
      setSnackbar({ open: true, message: "Error saving category", severity: "error" });
    }
  };

  // Delete category confirmation
  const handleDeleteCategory = async () => {
    try {
      await axiosInstance.delete(`/categories/${deleteDialog.id}`);
      setSnackbar({ open: true, message: "Category deleted successfully!", severity: "success" });
      fetchCategories();
    } catch (error) {
      setSnackbar({ open: true, message: "Error deleting category", severity: "error" });
    } finally {
      setDeleteDialog({ open: false, id: null });
    }
  };

  return (
    <Box sx={{ backgroundColor: "#F8F3D9", minHeight: "100vh", p: 3 }}>
      <Typography variant="h4" sx={{ color: "#4E342E", fontWeight: "bold", mb: 3 }}>
        Manage Categories
      </Typography>

      {/* Add Category Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: "#9E9770",
            color: "white",
            "&:hover": { backgroundColor: "#2c3e2c" },
          }}
          onClick={() => handleOpenDialog()}
        >
          Add Category
        </Button>
      </Box>

      {/* Categories Table */}
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
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Edit</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((cat) => (
              <TableRow
                key={cat.id}
                sx={{ "&:hover": { backgroundColor: "#e7e1c8" } }}
              >
                <TableCell>{cat.id}</TableCell>
                <TableCell>{cat.name}</TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      sx={{ color: "#88a060", "&:hover": { backgroundColor: "#e7e1c8" } }}
                      onClick={() => handleOpenDialog(cat)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      sx={{ color: "#7a5e48", "&:hover": { color: "#d52121ff", backgroundColor: "#e7e1c8" } }}
                      onClick={() => setDeleteDialog({ open: true, id: cat.id })}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Category Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ backgroundColor: "#9E9770", color: "white", pb :1 }}>
          {editingCategory ? "Edit Category" : "Add Category"}
        </DialogTitle>
        <DialogContent sx={{ p: 3, backgroundColor: "#f9f6e6" }}>
          <TextField
            fullWidth
            label="Category Name"
            variant="outlined"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            sx={{
                mt:2,
                "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#9E9770" },
                "&:hover fieldset": { borderColor: "#A8B79A" },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#f9f6e6", pb: 2, pr: 3 }}>
          <Button onClick={handleCloseDialog} sx={{ color: "#4E342E" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#9E9770", "&:hover": { backgroundColor: "#2c3e2c" } }}
            onClick={handleSaveCategory}
          >
            {editingCategory ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })}>
        <DialogTitle sx={{ backgroundColor: "#9E9770", color: "white" }}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ p: 3, backgroundColor: "#f9f6e6" }}>
          Are you sure you want to delete this category?
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#f9f6e6", pb: 2, pr: 3 }}>
          <Button onClick={() => setDeleteDialog({ open: false, id: null })} sx={{ color: "#4E342E" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#9E9770", "&:hover": { backgroundColor: "#2c3e2c" } }}
            onClick={handleDeleteCategory}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminCategories;
