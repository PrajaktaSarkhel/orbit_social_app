import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  EmailOutlined,
  LockOutlined,
  PersonOutline,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OrbitLogo from '../components/OrbitLogo';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username.trim()) {
      setError('Username is required');
      return;
    }

    setLoading(true);
    try {
      const res = await signup(formData.username, formData.email, formData.password);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 6 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          backgroundColor: '#ffffff',
          color: '#0f172a',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <OrbitLogo
            size={48}
            sx={{
              borderRadius: '14px',
              mb: 1.5,
              boxShadow: '0 4px 14px rgba(15, 23, 42, 0.18)',
            }}
          />
          <Typography variant="h5" align="center" fontWeight="800" sx={{ letterSpacing: '-0.5px', color: '#0f172a' }}>
            Join the Orbit Network
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Create an account to share, like, comment, and bookmark posts
          </Typography>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2.5,
              borderRadius: 2,
              backgroundColor: '#fef2f2',
              color: '#991b1b',
              border: '1px solid #fecaca',
            }}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="username"
            placeholder="Username"
            margin="dense"
            required
            value={formData.username}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutline sx={{ color: '#94a3b8' }} />
                </InputAdornment>
              ),
            }}
            sx={inputStyles}
          />
          <TextField
            fullWidth
            type="email"
            name="email"
            placeholder="Email address"
            margin="dense"
            required
            value={formData.email}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlined sx={{ color: '#94a3b8' }} />
                </InputAdornment>
              ),
            }}
            sx={inputStyles}
          />
          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            margin="dense"
            required
            value={formData.password}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined sx={{ color: '#94a3b8' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setShowPassword((p) => !p)}
                    sx={{ color: '#94a3b8' }}
                  >
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={inputStyles}
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{
              mt: 3,
              py: 1.25,
              borderRadius: 2.5,
              backgroundColor: '#0f172a',
              color: '#ffffff',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)',
              '&:hover': {
                backgroundColor: '#1e293b',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.22)',
              },
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Register & Start Exploring'}
          </Button>
        </form>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

const inputStyles = {
  mb: 1.5,
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#f8fafc',
    borderRadius: 2.5,
    color: '#0f172a',
    '& fieldset': {
      borderColor: '#e2e8f0',
    },
    '&:hover fieldset': {
      borderColor: '#cbd5e1',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#0f172a',
    },
  },
  '& .MuiInputBase-input::placeholder': {
    color: '#94a3b8',
    opacity: 1,
  },
};

export default Signup;