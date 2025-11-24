// src/components/Footer.js
import React from 'react';
import { Box, Typography } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        mt: 'auto',
        backgroundColor: '#7d5c3b',
        color:'white',
        textAlign: 'center',
      }}
    >
      <Typography variant="body2" color="white">
        © {new Date().getFullYear()} Fable Foundry. All rights reserved.
      </Typography>
    </Box>
  );
}

export default Footer;
