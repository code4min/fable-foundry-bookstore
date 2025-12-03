// src/components/Dashboard.js
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Menu,
  MenuItem,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
//import CategoryIcon from "@mui/icons-material/Category";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import TrendingUp from '@mui/icons-material/TrendingUp';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";
import Header from "./Header";
import ChatWidget from "./ChatWidget";


function Dashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("name") || "Guest";

  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Unified search term (author OR title)
  const [searchTerm, setSearchTerm] = useState("");

  // Menu anchor for categories
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/books")
      .then((res) => setBooks(res.data))
      .catch((err) => console.error("Failed to fetch books:", err));
  }, []);

  const trendingBooks = books.filter((book) => book.trending);

  // Extract unique categories (by id)
  const categories = [
    ...new Map(
      books
        .filter((b) => b.category && b.category.name)
        .map((b) => [b.category.id, b.category])
    ).values(),
  ];

  const handleCategoryMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleCategoryMenuClose = () => setAnchorEl(null);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    handleCategoryMenuClose();
    // When selecting a category, clear the unified search (consistent UX)
    setSearchTerm("");
  };

  // Unified filtering (title OR author)
  const filteredBooks = books.filter((book) => {
    const matchCategory = selectedCategory
      ? book.category && book.category.id === selectedCategory.id
      : true;

    const unified = searchTerm.trim().toLowerCase();
    const matchSearch = unified
      ? ((book.title || "").toLowerCase().includes(unified) ||
          (book.author || "").toLowerCase().includes(unified))
      : true;

    return matchCategory && matchSearch;
  });

  // When any filter/search is active we hide the Trending section
  const isFilterActive = Boolean(selectedCategory || (searchTerm && searchTerm.trim() !== ""));

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh"
    sx={{
        background: 'linear-gradient(135deg, #FCF7E8, #F4ECD2)',
      }}
    >
      <Header />

      {/* --- Top AppBar (updated) --- */}
      <AppBar position="static" color="default" sx={{ backgroundColor: "#d0b88f", mt: 1 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
          {/* left cluster: About (text) + small gap */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              onClick={() => navigate("/about")}
              sx={{
                marginLeft: 9,
                color: "black",
                backgroundColor: "#d0b88f",
                fontWeight: 800,
                "&:hover": { backgroundColor: "#eadbb1", color: "black" },
              }}
            >
              About
            </Button>
          </Box>

          
          <Box sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            maxWidth: "55%",
            justifyContent: "flex-start",
          }}>
          <Box>
            
            <Button
              onClick={handleCategoryMenuOpen}
              sx={{
                backgroundColor: "#d0b88f",
                color: "black",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#eadbb1" },
              }}
            >
              Category
            </Button>
          
            
            <Menu anchorEl={anchorEl} open={openMenu} onClose={handleCategoryMenuClose}>
              {categories.map((category) => (
                <MenuItem key={category.id} onClick={() => handleCategorySelect(category)}>
                  {category.name}
                </MenuItem>
              ))}
              <MenuItem
                onClick={() => {
                  setSelectedCategory(null);
                  handleCategoryMenuClose();
                }}
              >
                Show All
              </MenuItem>
            </Menu>
          </Box>  
            
            <Box sx={{ width: "150px" }} />

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            
            <TextField
              size="small"
              placeholder="Search by author or title..."
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value;
                setSearchTerm(value);
        
                setSelectedCategory(null);
              }}
              sx={{ backgroundColor: "#eadbb1", width: { xs: 180, sm: 300, md: 350 } }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1 }} />,
              }}
            />

            
            {(selectedCategory || (searchTerm && searchTerm.trim() !== "")) && (
              <Tooltip title="Clear filters" arrow>
                <IconButton
                  onClick={() => {
                    setSelectedCategory(null);
                    setSearchTerm("");
                  }}
                  sx={{ backgroundColor: "#d0b88f" }}
                >
                  <FilterListIcon sx={{ color: "black" }} />
                </IconButton>
              </Tooltip>
            )}
            </Box>
          </Box>  

          {/* right cluster: wishlist, cart, profile */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title="Wishlist" arrow>
              <IconButton onClick={() => navigate("/wishlist")} sx={{
                backgroundColor: "#d0b88f",
                "&:hover": { backgroundColor: "#eee3c2" }
              }}>
                <FavoriteBorderIcon sx={{ color: "black" }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Cart" arrow>
              <IconButton onClick={() => navigate("/cart")} sx={{
                backgroundColor: "#d0b88f",
                "&:hover": { backgroundColor: "#eee3c2" }
              }}>
                <ShoppingCartIcon sx={{ color: "black" }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Profile" arrow>
              <IconButton onClick={() => navigate("/profile")} sx={{
                backgroundColor: "#d0b88f",
                "&:hover": { backgroundColor: "#eee3c2" }
              }}>
                <AccountCircleIcon sx={{ color: "black" }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Welcome */}
      <Container sx={{ my: 4, textAlign: "center" }}>
        <Typography variant="h4" sx={{ fontFamily: "cursive", color: "#5D4037" }}>
          Welcome, {userName}!
        </Typography>
      </Container>

      
      {!isFilterActive && (
        <Container sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ color: "#3E2723", mb: 2 }}>
              <TrendingUp sx={{color :"#cd461dff"}} fontSize="large" />   Trending Books
          </Typography>

          <Box
            sx={{
              backgroundImage: 'url("/images/shelf-bg.jpg")',
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              backgroundPosition: "center",
              width: "100%",
              height: { xs: "560px", md: "700px" },
              position: "relative",
            }}
          >
            {[0, 1, 2].map((shelfIndex) => (
              <Box
                key={shelfIndex}
                sx={{
                  position: "absolute",
                  top: `${6 + shelfIndex * 32}%`,
                  left: "6%",
                  right: "6%",
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                {[0, 1, 2, 3, 4].map((bookIndex) => {
                  const bookDataIndex = shelfIndex * 5 + bookIndex;
                  const book = trendingBooks[bookDataIndex] || {
                    id: `placeholder-${bookDataIndex}`,
                    title: "Coming Soon",
                    author: "",
                    image: "/images/books/placeholder.jpg",
                  };

                  return (
                    <Card
                      key={book.id}
                      sx={{
                        width: 130,
                        height: 182,
                        backgroundColor: "#D5C58A",
                        boxShadow: 3,
                        cursor: book.title !== "Coming Soon" ? "pointer" : "default",
                        transition: "transform 0.3s ease",
                        "&:hover": book.title !== "Coming Soon" && { transform: "scale(1.05)" },
                      }}
                      onClick={() => {
                        if (book.title !== "Coming Soon") navigate(`/book/${book.id}`);
                      }}
                    >
                      <CardMedia component="img" image={book.image} alt={book.title} sx={{ height: 140, objectFit: "contain" }} />
                      <CardContent sx={{ p: 1, textAlign: "center" }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#4E342E", fontSize: "0.75rem" }}>
                          {book.title}
                        </Typography>
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            ))}
          </Box>
        </Container>
      )}

  


      {/* All Books Section */}
      <Container sx={{ mb: 6, width: "90%", mx: "auto" }}>
        <Box
          sx={{
            backgroundColor: "#7c6e55",
            color: "white",
            px: 3,
            py: 2,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            All Books
          </Typography>

          
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            {selectedCategory && (
              <Typography variant="body2" sx={{ color: "#fff" }}>
                Category: <strong>{selectedCategory.name}</strong>
              </Typography>
            )}
            {searchTerm && (
              <Typography variant="body2" sx={{ color: "#fff" }}>
                Search: <strong>{searchTerm}</strong>
              </Typography>
            )}
          </Box>
        </Box>

       
        {(selectedCategory || searchTerm) && (
          <Typography variant="subtitle1" sx={{ color: "#5D4037", mt: 2 }}>
            Showing books in: <strong>{selectedCategory ? selectedCategory.name : "All Categories"}</strong>{" "}
            {searchTerm && ` matching "${searchTerm}"`}
          </Typography>
        )}

        {/* Books Grid */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {filteredBooks.map((book) => (
            <Grid item xs={6} sm={4} md={3} key={book.id}>
              <Card
                sx={{
                  width: 215,
                  height: 320,
                  backgroundColor: "#efe0bbff",
                  boxShadow: 1,
                  cursor: "pointer",
                  "&:hover": { boxShadow: 4 },
                  display: "flex",
                  flexDirection: "column",
                }}
                onClick={() => navigate(`/book/${book.id}`)}
              >
                <CardMedia component="img" image={book.image} alt={book.title} sx={{ height: 200, objectFit: "contain" }} />
                <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#5D4037", whiteSpace: "normal", overflowWrap: "break-word" }}>
                    {book.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    by {book.author}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      
    <ChatWidget />
      <Footer />
    </Box>
  );
}

export default Dashboard;
