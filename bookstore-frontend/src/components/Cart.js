// Cart.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import {
  Container,
  Typography,
  Button,
  Snackbar,
  IconButton,
  Divider,
  Box,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Header from './Header';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';

const Cart = () => {
  const [cartBooks, setCartBooks] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [lastRemoved, setLastRemoved] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [bookToRemove, setBookToRemove] = useState(null);

  const email = localStorage.getItem('email');
  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('name') || 'Guest';

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = localStorage.getItem('email');
    if (!userEmail) return;

    axiosInstance
      .get(`/auth?email=${userEmail}`)
      .then((res) => {
        setDeliveryAddress(res.data.address || '');
        setPhoneNumber(res.data.number || '');
      })
      .catch((err) => console.error('Error fetching user details:', err));
  }, []);

  useEffect(() => {
    if (!email || !token) return;

    axiosInstance
      .get(`/cart?email=${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCartBooks(res.data))
      .catch((err) => console.error('Error fetching cart:', err));
  }, [email, token]);

  useEffect(() => {
    axiosInstance
      .get('/purchase/estimateDelivery')
      .then((res) => setEstimatedDelivery(res.data))
      .catch((err) => {
        console.error('Error fetching estimated delivery:', err);
        setEstimatedDelivery(null);
      });
  }, []);

  const askRemove = (book) => {
    setBookToRemove(book);
    setConfirmOpen(true);
  };

  const confirmRemove = async () => {
    if (!bookToRemove) return;
    try {
      await axiosInstance.delete(`/cart/remove`, {
        data: { email, bookId: bookToRemove.id },
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartBooks((prev) => prev.filter((b) => b.id !== bookToRemove.id));
      setLastRemoved(bookToRemove);
      setSnackbarMessage('Book removed from cart');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Error removing from cart:', err);
      setSnackbarMessage('Failed to remove from cart');
      setSnackbarOpen(true);
    } finally {
      setConfirmOpen(false);
      setBookToRemove(null);
    }
  };

  const handleUndo = async () => {
    if (!lastRemoved) return;
    try {
      await axiosInstance.post(
        `/cart/add`,
        { email, bookId: lastRemoved.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCartBooks((prev) => [...prev, lastRemoved]);
      setLastRemoved(null);
    } catch (err) {
      console.error('Error undoing remove:', err);
    } finally {
      setSnackbarOpen(false);
    }
  };

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  const handleBuyAll = async () => {
    try {
      const url =
        `/purchase/buyAll?email=${email}` +
        `&deliveryAddress=${encodeURIComponent(deliveryAddress)}` +
        (estimatedDelivery ? `&deliveryDate=${estimatedDelivery}` : '');

      const response = await axiosInstance.post(url, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSnackbarMessage(response.data || 'Purchase successful!');
      setSnackbarOpen(true);
      setCartBooks([]);
    } catch (err) {
      console.error('Error during purchase:', err);
      setSnackbarMessage('Failed to complete purchase.');
      setSnackbarOpen(true);
    }
  };

  const hasOutOfStock = cartBooks.some((book) => book.stock === 0);
  const totalPrice = cartBooks.reduce((sum, book) => sum + (book.price || 0), 0);
  const isDetailsMissing = !deliveryAddress || !phoneNumber;

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      sx={{
        
        background: 'linear-gradient(135deg, #FCF7E8, #F4ECD2)',
      }}
    >
      <Header />

      <Container maxWidth="xl" sx={{ mt: 5, mb: 6, flexGrow: 1 }}>
        <Box sx={{ width: '90%', mx: 'auto' }}>

          <Typography variant="h4" sx={{ color: '#5A3825' }}>
            {userName}'s Cart 🛒
          </Typography>

          <Divider sx={{ my: 2 }} />

          {cartBooks.length === 0 ? (
            <Typography variant="h6" sx={{ mt: 2, color: '#888' }}>
              Your cart is empty.
            </Typography>
          ) : (
            <>
              {/* BOOK LIST */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {cartBooks.map((book) => (
                  <Paper
                    key={book.id}
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 3,

                      
                      backgroundColor: '#f8e2b4ff',
                      backgroundImage:
                        "url('https://www.transparenttextures.com/patterns/paper.png')",
                      border: '1px solid #e0d8c3',

                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2,

                      opacity: book.stock === 0 ? 0.65 : 1,
                    }}
                  >
                    <Box
                      component="img"
                      src={book.image}
                      alt={book.title}
                      sx={{
                        width: 90,
                        height: 120,
                        objectFit: 'cover',
                        borderRadius: 1,
                        flexShrink: 0,
                      }}
                    />

                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ color: '#4A3A2F' }}>
                        {book.title}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        by {book.author}
                      </Typography>

                      <Typography
                        variant="subtitle1"
                        sx={{ mt: 1, color: '#4A3A2F', fontWeight: 'bold' }}
                      >
                        ₹{book.price}
                      </Typography>

                      {book.stock === 0 ? (
                        <Typography variant="body2" sx={{ color: 'error.main' }}>
                          Out of Stock
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          In Stock: {book.stock}
                        </Typography>
                      )}
                    </Box>

                    
                    <Button
                      variant="outlined"
                      onClick={() => askRemove(book)}
                      sx={{
                        color: '#7A4F3A',
                        borderColor: '#7A4F3A',
                        '&:hover': {
                          backgroundColor: '#7A4F3A',
                          color: 'white',
                        },
                      }}
                    >
                      Remove
                    </Button>
                  </Paper>
                ))}
              </Box>

              <Divider sx={{ my: 4 }} />

              
              <Paper
                elevation={1}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: '#ebe0c6ff',
                  border: '1px solid #e0d8c3',
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ color: '#5A3825' }}>
                  Delivery Details
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <HomeOutlinedIcon sx={{ mr: 1, color: '#5A3825' }} />
                  <Typography variant="body1">
                    {deliveryAddress || 'Not provided'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PhoneOutlinedIcon sx={{ mr: 1, color: '#5A3825' }} />
                  <Typography variant="body1">
                    {phoneNumber || 'Not provided'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocalShippingOutlinedIcon sx={{ mr: 1, color: '#5A3825' }} />
                  <Typography variant="body1">
                    {estimatedDelivery
                      ? new Date(`${estimatedDelivery}T00:00:00`).toLocaleDateString()
                      : '—'}
                  </Typography>
                </Box>

                {isDetailsMissing && (
                  <>
                    <Alert severity="warning" sx={{ mt: 2 , backgroundColor:"#fef1d9ff"}}>
                      Please complete your delivery details before proceeding.
                    </Alert>
                      <Button variant="outlined" sx={{
                        mt: 2,
                        color: "brown",
                        borderColor: "brown",
                        '&:hover': {
                          backgroundColor: '#d7bb99ff',
                          borderColor: 'brown'
                        }
                      }}
                      onClick={() => navigate('/profile')}>
                      Go to Profile
                    </Button>
                  </>
                )}
              </Paper>

              <Divider sx={{ my: 3 }} />

              {hasOutOfStock && (
                <Alert severity="error" sx={{ mb: 2 , backgroundColor:"#e6d5aeff", color:"#62563bff"}}>
                  Some items are out of stock. Please remove them before checkout.
                </Alert>
              )}

              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#5A3825' }}>
                  Total Price: ₹{totalPrice}
                </Typography>

                
                <Button
                  variant="contained"
                  sx={{
                    mt: 2,
                    backgroundColor: '#9d7f57',
                    '&:hover': { backgroundColor: '#7b6244' },
                    color: 'white',
                    px: 4,
                  }}
                  onClick={handleBuyAll}
                  disabled={isDetailsMissing || hasOutOfStock}
                >
                  Buy
                </Button>
              </Box>
            </>
          )}

         
          <Dialog
            open={confirmOpen}
            onClose={() => setConfirmOpen(false)}
            PaperProps={{
              sx: {
                backgroundColor: "#F8F3D9",  
                borderRadius: 3,
                paddingBottom: 1
              }
            }}
          >
            <DialogTitle sx={{ color: "#5A3825", fontWeight: "bold" }}>
              Remove from cart?
            </DialogTitle>

            <DialogContent>
              <DialogContentText sx={{ color: "#5A3825" }}>
                {bookToRemove
                  ? `Are you sure you want to remove “${bookToRemove.title}” from your cart?`
                  : 'Are you sure you want to remove this book from your cart?'}
              </DialogContentText>
            </DialogContent>

            <DialogActions sx={{ padding: "12px 20px" }}>
              <Button
                onClick={() => setConfirmOpen(false)}
                sx={{
                  color: "#5A3825",
                  borderColor: "#5A3825",
                  "&:hover": { backgroundColor: "#ecdcb3" }
                }}
                variant="outlined"
              >
                Cancel
              </Button>

              <Button
                color="error"
                variant="contained"
                onClick={confirmRemove}
                sx={{
                  backgroundColor: "#b84a4a",
                  "&:hover": { backgroundColor: "#8a3636" }
                }}
              >
                Remove
              </Button>
            </DialogActions>
          </Dialog>


          {/* Snackbar */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={4000}
            onClose={handleCloseSnackbar}
            message={snackbarMessage}
            action={
              lastRemoved ? (
                <>
                  <Button sx={{ color: '#f5b883ff' }} size="small" onClick={handleUndo}>
                    UNDO
                  </Button>
                  <IconButton size="small" color="inherit" onClick={handleCloseSnackbar}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <IconButton size="small" color="inherit" onClick={handleCloseSnackbar}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              )
            }
          />
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default Cart;
