// src/components/LandingPage.js
import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import './landingpage.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />

      {/* Hero Section */}
      <Box className="landing-hero">
        <Container className="landing-hero-overlay">
          <Typography variant="h3" component="h3">
            Discover Your Next Favorite Book
          </Typography>
          <Typography variant="h6" component="h6">
            Browse thousands of titles. Save your favorites. Build your collection.
          </Typography>

          <Button
            variant="contained"
            size="large"
            className="landing-button-contained"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            size="large"
            className="landing-button-outlined"
            onClick={() => navigate('/register')}
          >
            Register
          </Button>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}

export default LandingPage;
