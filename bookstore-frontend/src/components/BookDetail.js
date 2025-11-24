// src/components/BookDetail.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../api/axiosInstance";
import { Typography, Button, Snackbar, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled, keyframes } from "@mui/material/styles";

/* -----------------------------
   Soft fade + slide animation (Option A)
   ----------------------------- */
const fadeSlide = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

/* -----------------------------
   Styled Page component (aged paper + curls)
   ----------------------------- */
const Page = styled(Box)(({ theme, side }) => ({
  backgroundColor: "#f9e7beff",
  backgroundImage:
    "url('https://www.transparenttextures.com/patterns/paper.png')",
  flex: 1,
  padding: "24px",
  borderRadius: "6px",
  position: "relative",
  boxShadow: "0px 0px 20px rgba(0,0,0,0.08)",
  animation: `${fadeSlide} 700ms ease both`,
  height: "520px",
  overflow: "hidden",

  "&::before, &::after": {
    content: '""',
    position: "absolute",
    width: "26px",
    height: "26px",
    background: "linear-gradient(135deg, rgba(0,0,0,0.06), transparent)",
    zIndex: 2,
  },
  "&::before": {
    top: 6,
    ...(side === "left"
      ? {
          left: 6,
          borderTopLeftRadius: "6px",
          clipPath: "polygon(0 0, 100% 0, 0 100%)",
        }
      : {
          right: 6,
          borderTopRightRadius: "6px",
          clipPath: "polygon(0 0, 100% 0, 100% 100%)",
        }),
  },
  "&::after": {
    bottom: 6,
        ...(side === "left"
      ? {
          left: 6,
          borderBottomLeftRadius: "6px",
          clipPath: "polygon(0 0, 0 100%, 100% 100%)",
        }
      : {
          right: 6,
          borderBottomRightRadius: "6px",
          clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
        }),
  },
}));

export default function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/books/${id}`)
      .then((res) => setBook(res.data))
      .catch((err) => console.error("Error fetching book:", err));
  }, [id]);

  const handleAddToCart = () => {
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    if (!email || !token) {
      setSnackbarMessage("Please login to add to cart");
      setSnackbarOpen(true);
      return;
    }

    axiosInstance
      .post(
        "/cart/add",
        { email, bookId: book.id },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setSnackbarMessage("Book added to cart");
        setSnackbarOpen(true);
      })
      .catch(() => {
        setSnackbarMessage("Failed to add to cart");
        setSnackbarOpen(true);
      });
  };

  const handleAddToWishlist = () => {
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    if (!email || !token) {
      setSnackbarMessage("Please login to add to wishlist");
      setSnackbarOpen(true);
      return;
    }

    axiosInstance
      .post(
        "/wishlist/add",
        { email, bookId: book.id },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setSnackbarMessage("Book added to wishlist");
        setSnackbarOpen(true);
      })
      .catch(() => {
        setSnackbarMessage("Failed to add to wishlist");
        setSnackbarOpen(true);
      });
  };

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  if (!book) {
    return (
      <Typography sx={{ mt: 4, textAlign: "center" }}>
        Loading book details...
      </Typography>
    );
  }

  return (
    /* ----------------------------------
       FULL PAGE BACKGROUND FIX (ONLY CHANGE)
       ---------------------------------- */
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(135deg, #FCF7E8, #F4ECD2)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: 4,
      }}
    >
      {/* Book Wrapper */}
      <Box
        sx={{
          width: "85%",
          maxWidth: 1200,
          display: "flex",
          gap: 0,
          borderRadius: 3,
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 6px 28px rgba(0,0,0,0.09)",

          "&::after": {
            content: '""',
            position: "absolute",
            left: "50%",
            top: 16,
            bottom: 16,
            width: 4,
            transform: "translateX(-50%)",
            background: "linear-gradient(to bottom, #c8b796, #e8dcc0, #c8b796)",
            boxShadow: "0px 0px 6px rgba(0,0,0,0.12)",
            opacity: 0.95,
            borderRadius: 2,
          },
        }}
      >
        {/* LEFT PAGE */}
        <Page
          side="left"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pr: { md: 3 },
            animationDelay: "0s",
          }}
        >

          <Box
            sx={{
              width: "100%",
              height: "90%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              borderRadius: 2,
            }}
          >
            <Box
              component="img"
              src={book.image}
              alt={book.title}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
                filter: "saturate(1.02) contrast(0.98)",
                transition: "transform 300ms ease",
                "&:hover": { transform: "scale(1.02)" },
              }}
            />
          </Box>
        </Page>

        {/* RIGHT PAGE */}
        <Page
          side="right"
          sx={{
            pl: { md: 7 },      // increased for better centering
            pr: { md: 3 },      // new: adds symmetry
            maxWidth: "520px",  // keeps text centered visually
            margin: "0 auto",   // fully centers inside the page
            animationDelay: "120ms",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >

          <Typography
            variant="h4"
            sx={{ color: "#4A3021", fontWeight: 700, mb: 1.2 }}
          >
            {book.title}
          </Typography>

          <Typography variant="subtitle1" sx={{ color: "#7A5C42", mb: 1 }}>
            by {book.author}
          </Typography>

          <Typography variant="body2" sx={{ color: "#7A5C42", mb: 2 }}>
            Category: {book.category?.name || "Uncategorized"}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#4A3A2F",
              lineHeight: 1.7,
              mb: 3,
              textAlign: "justify",
            }}
          >
            {book.description}
          </Typography>

          <Typography
            variant="h6"
            sx={{ color: "#4A3021", fontWeight: "bold", mb: 2 }}
          >
            Price: ₹{book.price}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
            <Button
              variant="contained"
              onClick={handleAddToCart}
              sx={{
                backgroundColor: "#9b7b55",
                color: "white",
                px: 3,
                "&:hover": { backgroundColor: "#7d6345" },
                boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
              }}
            >
              Add to Cart
            </Button>

            <Button
              variant="outlined"
              onClick={handleAddToWishlist}
              sx={{
                borderColor: "#7a5c42",
                color: "#5e4635",
                px: 3,
                "&:hover": {
                  backgroundColor: "#d8c49fff",
                  borderColor: "#6b4f36",
                },
              }}
            >
              Add to Wishlist
            </Button>
          </Box>
        </Page>
      </Box>

      {/* Snackbar */}
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
  );
}
