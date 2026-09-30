import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Avatar,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Explore as ExploreIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  PersonAdd as SignupIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
        zIndex: 1100,
      }}
    >
      <Container maxWidth="md">
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, sm: 2 }, py: 0.5 }}>
          {/* Brand / Logo */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              gap: 1.2,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                backgroundColor: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)',
              }}
            >
              <ExploreIcon sx={{ color: '#fff', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.25rem', sm: '1.4rem' },
                  letterSpacing: '-0.5px',
                  color: '#0f172a',
                }}
              >
                Orbit
              </Typography>
            </Box>
          </Box>

          {/* Top-Right Corner Auth Controls */}
          <Box disablegutters="true" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {isAuthenticated && user ? (
              <>
                <Chip
                  avatar={
                    <Avatar
                      sx={{
                        bgcolor: '#0f172a',
                        color: '#fff',
                        fontWeight: 700,
                        width: 28,
                        height: 28,
                      }}
                    >
                      {user.username ? user.username[0].toUpperCase() : 'U'}
                    </Avatar>
                  }
                  label={user.username}
                  sx={{
                    color: '#0f172a',
                    backgroundColor: '#f1f5f9',
                    fontWeight: 600,
                    border: '1px solid #e2e8f0',
                    display: { xs: 'none', sm: 'inline-flex' },
                  }}
                />

                <Tooltip title="Log out">
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<LogoutIcon fontSize="small" />}
                    onClick={logout}
                    sx={{
                      color: '#64748b',
                      borderColor: '#cbd5e1',
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: '#ef4444',
                        color: '#ef4444',
                        backgroundColor: '#fee2e2',
                      },
                    }}
                  >
                    Logout
                  </Button>
                </Tooltip>
              </>
            ) : (
              <>
                {/* Clean, prominent Login & Sign Up buttons at top-right */}
                <Button
                  id="nav-login-btn"
                  variant="text"
                  startIcon={<LoginIcon sx={{ fontSize: 18 }} />}
                  onClick={() => openAuthModal({ tab: 'login', message: 'Welcome back! Sign in to your account.' })}
                  sx={{
                    color: '#0f172a',
                    fontWeight: 600,
                    textTransform: 'none',
                    px: { xs: 1.5, sm: 2 },
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: '#f1f5f9',
                    },
                  }}
                >
                  Log In
                </Button>

                <Button
                  id="nav-signup-btn"
                  variant="contained"
                  startIcon={<SignupIcon sx={{ fontSize: 18 }} />}
                  onClick={() => openAuthModal({ tab: 'signup', message: 'Join Orbit to connect, share, and discover.' })}
                  sx={{
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    fontWeight: 600,
                    textTransform: 'none',
                    px: { xs: 2, sm: 2.5 },
                    borderRadius: 2,
                    boxShadow: '0 2px 6px rgba(15, 23, 42, 0.12)',
                    '&:hover': {
                      backgroundColor: '#1e293b',
                      boxShadow: '0 4px 10px rgba(15, 23, 42, 0.18)',
                    },
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;