import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Snackbar,
  IconButton,
  Divider,
  Box,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import Header from './Header';
import Footer from './Footer';

const Wishlist = () => {
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const email = localStorage.getItem('email');
  const userName = localStorage.getItem('name') || 'Guest';

  useEffect(() => {
    if (!email) return;

    axiosInstance.get(`/wishlist?email=${email}`)
      .then(response => setWishlistBooks(response.data))
      .catch(error => console.error('Error fetching wishlist:', error));
  }, [email]);

  const handleRemove = (bookId) => {
    axiosInstance.delete(`/wishlist/remove`, {
      data: { email, bookId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(() => {
      setWishlistBooks(prev => prev.filter(book => book.id !== bookId));
      setSnackbarMessage('Book removed from wishlist');
      setSnackbarOpen(true);
    })
    .catch(error => {
      console.error('Error removing from wishlist:', error);
      setSnackbarMessage('Failed to remove from wishlist');
      setSnackbarOpen(true);
    });
  };

  const handleMoveToCart = (bookId) => {
    axiosInstance.post(`/cart/add`, { email, bookId }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(() => {
      handleRemove(bookId); 
      setSnackbarMessage('Book moved to cart');
      setSnackbarOpen(true);
    })
    .catch(error => {
      console.error('Error moving book to cart:', error);
      setSnackbarMessage('Failed to move to cart');
      setSnackbarOpen(true);
    });
  };

  const handleCloseSnackbar = () => setSnackbarOpen(false);

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
          
          <Typography variant="h4" gutterBottom sx={{ color: '#5A3825' }}>
            {userName}'s Wishlist 
          </Typography>

          <Divider sx={{ my: 2 }} />

          {wishlistBooks.length === 0 ? (
            <Typography variant="h6" sx={{ mt: 2, color: '#888' }}>
              Your wishlist is empty.
            </Typography>
          ) : (
            <Box display="flex" flexDirection="column" gap={3}>
              {wishlistBooks.map(book => (
                <Card
                  key={book.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#f8e2b4ff',
                    backgroundImage: "url('https://www.transparenttextures.com/patterns/paper.png')",
                    boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
                    borderRadius: 3,
                    p: 2,
                    border: '1px solid #e0d8c3',
                  }}
                >
                  <CardMedia
                    component="img"
                    image={book.image}
                    alt={book.title}
                    sx={{
                      width: 120,
                      height: 160,
                      objectFit: 'contain',
                      borderRadius: 2,
                    }}
                  />

                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ color: '#4A3A2F' }}>{book.title}</Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      by {book.author}
                    </Typography>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ color: '#4A3A2F', fontWeight: 'bold' }}
                    >
                      Price: ₹{book.price}
                    </Typography>
                  </CardContent>

                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>

                    {/* Updated Remove button */}
                    <Button
                      variant="outlined"
                      onClick={() => handleRemove(book.id)}
                      sx={{
                        color: '#7A4F3A',
                        borderColor: '#7A4F3A',
                        '&:hover': {
                          backgroundColor: '#7A4F3A',
                          color: 'white',
                        }
                      }}
                    >
                      Remove
                    </Button>

                    {/* Updated Move to Cart button */}
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#9d7f57',
                        '&:hover': { backgroundColor: '#7b6244' }
                      }}
                      onClick={() => handleMoveToCart(book.id)}
                    >
                      Move to Cart
                    </Button>
                  </Box>

                </Card>
              ))}
            </Box>
          )}

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
            message={snackbarMessage}
            action={
              <IconButton size="small" color="inherit" onClick={handleCloseSnackbar}>
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          />
        </Box>  
      </Container>

      <Footer />
    </Box>
  );
};

export default Wishlist;
