import React, { useState } from 'react';
import {
  //Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        name,
        email,
        password,
      });

      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err) {
      setError('Email already exists or invalid data');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper elevation={4} sx={{ p: 4, backgroundColor: '#F8F3D9' }}>
        <Typography variant="h4" align="center" mb={3} sx={{ color: '#4E342E' }}>
          Register
        </Typography>

        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{
                backgroundColor: '#fff',  
                '& input': {
                  backgroundColor: '#fff',
                },
                '& input:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 1000px #fff inset',
                  WebkitTextFillColor: '#000', 
                },
                '& input:focus': {
                  backgroundColor: '#fff',
                }
              }}
        />

        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
                backgroundColor: '#fff',  
                '& input': {
                  backgroundColor: '#fff',
                },
                '& input:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 1000px #fff inset',
                  WebkitTextFillColor: '#000', 
                },
                '& input:focus': {
                  backgroundColor: '#fff',
                }
              }}
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
                backgroundColor: '#fff',  
                '& input': {
                  backgroundColor: '#fff',
                },
                '& input:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 1000px #fff inset',
                  WebkitTextFillColor: '#000', 
                },
                '& input:focus': {
                  backgroundColor: '#fff',
                }
              }}
        />

        {error && (
          <Typography color="error" mt={1}>
            {error}
          </Typography>
        )}

        {success && (
          <Typography color="green" mt={1}>
            Registered successfully! Redirecting to login...
          </Typography>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 3,
            backgroundColor: '#9e9770ff',
            color: 'white',
            '&:hover': {
              backgroundColor: '#504B38',
            },
          }}
          onClick={handleRegister}
        >
          Register
        </Button>
      </Paper>
    </Container>
  );
}

export default Register;
