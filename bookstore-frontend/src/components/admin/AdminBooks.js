// src/components/admin/AdminBooks.js
import React, { useEffect, useState } from "react";
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
  Button,
  Tooltip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import axiosInstance from "../../api/axiosInstance";

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [openForm, setOpenForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    categoryId: "",
    description: "",
    price: "",
    image: "",
    trending: false,
    stock: "", 
  });

  
  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axiosInstance.get("/books");
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

 
  const handleOpenForm = (book = null) => {
    setEditingBook(book);
    setFormData(
      book
        ? {
            title: book.title,
            author: book.author,
            categoryId: book.category ? book.category.id : "",
            description: book.description,
            price: book.price,
            image: book.image,
            trending: book.trending,
            stock: book.stock ?? "", 
          }
        : {
            title: "",
            author: "",
            categoryId: "",
            description: "",
            price: "",
            image: "",
            trending: false,
            stock: "", 
          }
    );
    setOpenForm(true);
  };

 
  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingBook(null);
  };

  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  
  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        stock: parseInt(formData.stock || 0, 10), 
      };

      if (editingBook) {
        await axiosInstance.put(`/books/${editingBook.id}`, payload);
        setNotification({
          open: true,
          message: "Book updated successfully!",
          severity: "success",
        });
      } else {
        await axiosInstance.post("/books", payload);
        setNotification({
          open: true,
          message: "Book added successfully!",
          severity: "success",
        });
      }
      fetchBooks();
      handleCloseForm();
    } catch (error) {
      console.error("Error saving book:", error);
      setNotification({
        open: true,
        message: "Error saving book",
        severity: "error",
      });
    }
  };

  
  const handleOpenDelete = (id) => {
    setDeleteId(id);
    setOpenDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axiosInstance.delete(`/books/${deleteId}`);
      fetchBooks();
      setNotification({
        open: true,
        message: "Book deleted successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting book:", error);
      setNotification({
        open: true,
        message: "Error deleting book",
        severity: "error",
      });
    } finally {
      setOpenDeleteConfirm(false);
      setDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteConfirm(false);
    setDeleteId(null);
  };

  return (
    <Box sx={{ backgroundColor: "#F8F3D9", minHeight: "100vh", p: 3 }}>
      <Typography
        variant="h4"
        sx={{ color: "#4E342E", fontWeight: "bold", mb: 3 }}
      >
        Manage Books
      </Typography>

      
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <TextField
          placeholder="Search by title or author..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: "40%",
            backgroundColor: "#fff",
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#9E9770" },
              "&:hover fieldset": { borderColor: "#A8B79A" },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#9E9770" }} />
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
          sx={{
            backgroundColor: "#9E9770",
            color: "white",
            "&:hover": {
              backgroundColor: "#2c3e2c",
              color: "white",
            },
          }}
        >
          Add Book
        </Button>
      </Box>

      {/* Books Table */}
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
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Title</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Author</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Category</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Price</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Stock</TableCell> 
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Trending</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Edit</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBooks.map((book) => (
              <TableRow
                key={book.id}
                sx={{ "&:hover": { backgroundColor: "#e7e1c8" } }}
              >
                <TableCell>{book.id}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <img
                      src={book.image}
                      alt={book.title}
                      width={50}
                      height={70}
                      style={{ borderRadius: 4, objectFit: "cover" }}
                    />
                  </Box>
                </TableCell>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.category ? book.category.name : "—"}</TableCell>
                <TableCell>₹{book.price.toFixed(2)}</TableCell>
                <TableCell>
                  {book.stock > 0 ? (
                    <Typography sx={{ color: "#4E342E" }}>{book.stock}</Typography>
                  ) : (
                    <Typography sx={{ color: "#b71c1c", fontWeight: "bold" }}>
                      Out of Stock
                    </Typography>
                  )}
                </TableCell>
                <TableCell>{book.trending ? "🌟 Yes" : "—"}</TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenForm(book)}
                      sx={{
                        color: "#88a060",
                        "&:hover": { backgroundColor: "#e7e1c8" },
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDelete(book.id)}
                      sx={{
                        color: "#7a5e48",
                        "&:hover": {
                          color: "#d52121ff",
                          backgroundColor: "#e7e1c8",
                        },
                      }}
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

      {/* Add/Edit Book Dialog */}
      <Dialog
        open={openForm}
        onClose={handleCloseForm}
        PaperProps={{
          sx: { borderRadius: 3, backgroundColor: "#FAF8F1", p: 1 },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            color: "#4E342E",
            borderBottom: "1px solid #D9CBA7",
          }}
        >
          {editingBook ? "Edit Book" : "Add New Book"}
        </DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Title" name="title" value={formData.title} onChange={handleChange} sx={{ backgroundColor: "#fff", borderRadius: 1 }} />
          <TextField fullWidth margin="dense" label="Author" name="author" value={formData.author} onChange={handleChange} sx={{ backgroundColor: "#fff", borderRadius: 1 }} />
          <TextField select fullWidth margin="dense" label="Category" name="categoryId" value={formData.categoryId} onChange={handleChange} sx={{ backgroundColor: "#fff", borderRadius: 1 }}>
            <MenuItem value="">— Select Category —</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField fullWidth margin="dense" label="Description" name="description" multiline rows={3} value={formData.description} onChange={handleChange} sx={{ backgroundColor: "#fff", borderRadius: 1 }} />
          <TextField fullWidth margin="dense" label="Price" name="price" type="number" value={formData.price} onChange={handleChange} sx={{ backgroundColor: "#fff", borderRadius: 1 }} />
          <TextField fullWidth margin="dense" label="Stock" name="stock" type="number" value={formData.stock} onChange={handleChange} sx={{ backgroundColor: "#fff", borderRadius: 1 }} /> {/* ✅ Added */}

          <TextField fullWidth margin="dense" label="Image URL" name="image" value={formData.image} onChange={handleChange} sx={{ backgroundColor: "#fff", borderRadius: 1 }} />

          {formData.image && (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <img
                src={formData.image}
                alt="Preview"
                style={{
                  width: 120,
                  height: 160,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "1px solid #d9cba7",
                }}
                onError={(e) => (e.target.style.display = "none")}
              />
            </Box>
          )}

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.trending}
                onChange={handleChange}
                name="trending"
                sx={{
                  color: "#9E9770",
                  "&.Mui-checked": { color: "#4E342E" },
                }}
              />
            }
            label="Mark as Trending"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm} sx={{ color: "#7A5E48", fontWeight: "bold" }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: "#9E9770",
              "&:hover": { backgroundColor: "#4E342E" },
            }}
          >
            {editingBook ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={openDeleteConfirm}
        onClose={handleCancelDelete}
        PaperProps={{ sx: { borderRadius: 3, p: 1, backgroundColor: "#FAF8F1" } }}
      >
        <DialogTitle sx={{ color: "#4E342E", fontWeight: "bold" }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#7A5E48" }}>
            Are you sure you want to delete this book?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} sx={{ color: "#7A5E48" }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            sx={{ backgroundColor: "black", "&:hover": { backgroundColor: "#b71c1c" } }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={2500}
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

export default AdminBooks;
