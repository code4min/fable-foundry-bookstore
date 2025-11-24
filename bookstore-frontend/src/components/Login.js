// src/components/Login.js
import React, { useState } from "react";
import {
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });

      const data = response.data;
      const token = data.token;
      const roleFromResponse = data.role || ""; // e.g. "ROLE_ADMIN" or "ADMIN"
      const name = data.name || "";
      const emailResp = data.email || email;

      // normalize role: remove ROLE_ prefix and uppercase for reliable checks
      let normalized = roleFromResponse.toString().toUpperCase();
      if (normalized.startsWith("ROLE_")) normalized = normalized.substring(5);

      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", roleFromResponse); // store original form too
      localStorage.setItem("role_normalized", normalized); // handy for quick checks
      localStorage.setItem("name", name);
      localStorage.setItem("email", emailResp);

      // Redirect by role
      if (normalized === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      // Better error message if backend returns 401 etc.
      if (err.response && err.response.status === 401) {
        setError("Invalid email or password");
      } else if (err.response && err.response.data) {
        setError(typeof err.response.data === "string" ? err.response.data : "Login failed");
      } else {
        setError("Server error — try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper elevation={4} sx={{ p: 4, backgroundColor: "#F8F3D9" }}>
        <Typography variant="h4" align="center" mb={3} sx={{ color: "#4E342E" }}>
          Login
        </Typography>

        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            backgroundColor: "#fff",
            "& input": { backgroundColor: "#fff" },
            "& input:-webkit-autofill": {
              WebkitBoxShadow: "0 0 0 1000px #fff inset",
              WebkitTextFillColor: "#000",
            },
            "& input:focus": { backgroundColor: "#fff" },
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
            backgroundColor: "#fff",
            "& input": { backgroundColor: "#fff" },
            "& input:-webkit-autofill": {
              WebkitBoxShadow: "0 0 0 1000px #fff inset",
              WebkitTextFillColor: "#000",
            },
            "& input:focus": { backgroundColor: "#fff" },
          }}
        />

        {error && (
          <Typography color="error" mt={1}>
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{
            mt: 3,
            backgroundColor: "#9e9770ff",
            color: "white",
            "&:hover": { backgroundColor: "#504B38" },
          }}
          onClick={handleLogin}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </Paper>
    </Container>
  );
}

export default Login;
