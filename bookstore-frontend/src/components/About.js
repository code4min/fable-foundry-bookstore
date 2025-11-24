import React from 'react';
import { Box, Typography, Container, Divider } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import CodeIcon from '@mui/icons-material/Code';
import FavoriteIcon from '@mui/icons-material/Favorite';

const cardStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: 2,
  p: 3,
  borderRadius: 3,
  backgroundColor: '#f8e2b4ff',
  backgroundImage: "url('https://www.transparenttextures.com/patterns/paper.png')",
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  border: '1px solid #e0d8c3',
  mb: 4,
};

const iconStyle = {
  fontSize: 48,
  color: '#9c7b5b',
};

const titleStyle = {
  fontFamily: 'Georgia',
  color: '#8a6d52',
  fontWeight: 'bold',
};

const textStyle = {
  color: '#4a3b32',
  lineHeight: 1.8,
};

const About = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 8,
        background: 'linear-gradient(135deg, #FCF7E8, #F4ECD2)',
      }}
    >
      <Container maxWidth="md">

        {/* Page Header */}
        <Typography
          variant="h3"
          align="center"
          sx={{
            fontFamily: 'Georgia',
            color: '#805c45',
            mb: 4,
          }}
        >
          About Our Bookstore
        </Typography>

        <Divider sx={{ mb: 5, borderColor: '#c7b199' }} />

        {/* --- Card 1: About the Store --- */}
        <Box sx={cardStyle}>
          <MenuBookIcon sx={iconStyle} />
          <Box>
            <Typography variant="h5" sx={titleStyle} gutterBottom>
              Who We Are
            </Typography>
            <Typography variant="body1" sx={textStyle}>
              Welcome to our cozy corner of the literary world. This online bookstore
              was born out of a love for books and a passion for building beautiful
              user experiences. Whether you're into fiction, non-fiction, danmei
              novels, or modern favorites, our store is tailored for readers of all
              kinds.
            </Typography>
          </Box>
        </Box>

        {/* --- Card 2: Mission --- */}
        <Box sx={cardStyle}>
          <EmojiObjectsIcon sx={iconStyle} />
          <Box>
            <Typography variant="h5" sx={titleStyle} gutterBottom>
              Our Mission
            </Typography>
            <Typography variant="body1" sx={textStyle}>
              Our goal is to provide a seamless and enjoyable platform for book lovers
              to explore, discover, and purchase books effortlessly. We want this digital
              experience to feel as warm as flipping through pages in a cozy bookstore.
            </Typography>
          </Box>
        </Box>

        {/* --- Card 3: Technologies --- */}
        <Box sx={cardStyle}>
          <CodeIcon sx={iconStyle} />
          <Box>
            <Typography variant="h5" sx={titleStyle} gutterBottom>
              Technologies Used
            </Typography>
            <Typography variant="body1" sx={textStyle}>
              Built with love using React, Material UI, Spring Boot, MySQL, and
              JWT-based authentication. Every feature from book listings to purchases is
              crafted with care and purpose.
            </Typography>
          </Box>
        </Box>

        {/* --- Card 4: Developer Note --- */}
        <Box sx={cardStyle}>
          <FavoriteIcon sx={iconStyle} />
          <Box>
            <Typography variant="h5" sx={titleStyle} gutterBottom>
              Developer Note
            </Typography>
            <Typography variant="body1" sx={textStyle}>
              This bookstore project was crafted with love and dedication. We're
              continuously improving it, and we're grateful to have you here as part of
              this journey. Happy reading! 
            </Typography>
          </Box>
        </Box>

      </Container>
    </Box>
  );
};

export default About;
