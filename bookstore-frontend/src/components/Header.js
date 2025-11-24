// src/components/Header.js
import { AppBar, Toolbar, Typography,  IconButton, Box } from '@mui/material';
//import LogoutIcon from '@mui/icons-material/Logout';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';


function Header() {
  const navigate = useNavigate();
  const [tokenExists, setTokenExists] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setTokenExists(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setTokenExists(false);
    navigate('/');
  };


  return (
    <AppBar position="static" sx={{ backgroundColor: 'black' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          variant="h5"
          component="div"
          sx={{
            color: 'white',
            fontFamily: `'Playfair Display', cursive`, // elegant font
            fontWeight: 600,
          }}
        >
          Fable Foundry
        </Typography>
        
        <Box>
          {tokenExists && (
            <Tooltip title="Logout">
              <IconButton
                onClick={handleLogout}
                sx={{
                  color: '#fff',
                  backgroundColor: 'black',
                  borderRadius: '50%',
                  p: 1,
                  ml: 2,
                  '&:hover': {
                    backgroundColor: '#fff',
                    color:'black'
                  },
                }}
              >
                <PowerSettingsNewIcon />
              </IconButton>
            </Tooltip>

          )}
        </Box>
        
      </Toolbar>
    </AppBar>
  );
}

export default Header;
