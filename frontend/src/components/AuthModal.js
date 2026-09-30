import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
  TextField,
  Button,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import {
  Close as CloseIcon,
  AutoAwesome as SparkleIcon,
  EmailOutlined,
  LockOutlined,
  PersonOutline,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const AuthModal = () => {
  const {
    authModalOpen,
    authModalTab,
    authModalMessage,
    setAuthModalTab,
    closeAuthModal,
    login,
    signup,
  } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    setLoading(true);

    try {
      if (authModalTab === 'login') {
        const res = await login(formData.email, formData.password);
        if (!res.success) {
          setError(res.message);
        }
      } else {
        if (!formData.username.trim()) {
          setError('Username is required');
          setLoading(false);
          return;
        }
        const res = await signup(formData.username, formData.email, formData.password);
        if (!res.success) {
          setError(res.message);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setAuthModalTab(newValue);
    setError('');
  };

  return (
    <Dialog
      open={authModalOpen}
      onClose={closeAuthModal}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          backgroundColor: '#ffffff',
          color: '#0f172a',
          border: '1px solid #e2e8f0',
          boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
          overflow: 'hidden',
          p: 1,
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1, pr: 1 }}>
        <IconButton onClick={closeAuthModal} sx={{ color: '#94a3b8' }} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 3, pb: 4, pt: 0 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '12px',
              backgroundColor: '#0f172a',
              mb: 1.5,
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
            }}
          >
            <SparkleIcon sx={{ color: '#fff', fontSize: 24 }} />
          </Box>
          <Typography variant="h5" fontWeight="800" sx={{ letterSpacing: '-0.5px', color: '#0f172a' }}>
            Orbit Community
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: '#64748b', mt: 0.75, px: 1, fontSize: '0.9rem' }}
          >
            {authModalMessage ||
              'Sign in or register to like, comment, save, and share posts with creators.'}
          </Typography>
        </Box>

        <Tabs
          value={authModalTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            minHeight: 44,
            mb: 3,
            backgroundColor: '#f1f5f9',
            borderRadius: 2.5,
            p: 0.5,
            '& .MuiTabs-indicator': {
              display: 'none',
            },
            '& .MuiTab-root': {
              minHeight: 36,
              borderRadius: 2,
              color: '#64748b',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'all 0.15s ease',
              '&.Mui-selected': {
                color: '#0f172a',
                backgroundColor: '#ffffff',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
              },
            },
          }}
        >
          <Tab label="Sign In" value="login" id="auth-tab-login" />
          <Tab label="Create Account" value="signup" id="auth-tab-signup" />
        </Tabs>

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
          {authModalTab === 'signup' && (
            <TextField
              fullWidth
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              margin="dense"
              size="medium"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline sx={{ color: '#94a3b8' }} />
                  </InputAdornment>
                ),
              }}
              sx={inputStyles}
            />
          )}

          <TextField
            fullWidth
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
            margin="dense"
            size="medium"
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
            value={formData.password}
            onChange={handleChange}
            required
            margin="dense"
            size="medium"
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
            type="submit"
            variant="contained"
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
                boxShadow: '0 4px 10px rgba(15, 23, 42, 0.22)',
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: '#fff' }} />
            ) : authModalTab === 'login' ? (
              'Sign In'
            ) : (
              'Join Orbit'
            )}
          </Button>
        </form>

        <Box sx={{ textAlign: 'center', mt: 2.5 }}>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            {authModalTab === 'login' ? "Don't have an account yet?" : 'Already a member?'}
          </Typography>{' '}
          <Typography
            component="span"
            variant="caption"
            sx={{
              color: '#2563eb',
              fontWeight: 700,
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
            }}
            onClick={() => {
              setAuthModalTab(authModalTab === 'login' ? 'signup' : 'login');
              setError('');
            }}
          >
            {authModalTab === 'login' ? 'Sign up free' : 'Sign in'}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
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

export default AuthModal;
