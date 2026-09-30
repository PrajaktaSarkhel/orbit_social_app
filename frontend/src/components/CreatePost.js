import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Avatar,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ImageOutlined,
  Send as SendIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const CreatePost = ({ onPostCreated }) => {
  const { user, requireAuth } = useAuth();
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!text.trim() && !image.trim()) return;

    requireAuth(async () => {
      setLoading(true);
      const newPostData = {
        _id: 'post_' + Date.now(),
        username: user?.username || 'you',
        userId: user?.userId || user?._id,
        userAvatar: user?.avatar || '',
        text: text.trim(),
        image: image.trim(),
        likes: [],
        savedBy: [],
        sharesCount: 0,
        comments: [],
        createdAt: new Date().toISOString(),
      };

      try {
        const res = await API.post('/posts/create', newPostData);
        onPostCreated(res.data);
      } catch (err) {
        console.warn("Backend offline or error creating post, adding locally:", err.message);
        // Add to local state so user can immediately see and use their post
        onPostCreated(newPostData);
      } finally {
        setText('');
        setImage('');
        setShowImageInput(false);
        setLoading(false);
      }
    }, "Join Orbit to create posts and share your thoughts");
  };

  const handleInputClick = (e) => {
    if (!user) {
      e.preventDefault();
      e.stopPropagation();
      if (e.target && typeof e.target.blur === 'function') {
        e.target.blur();
      }
      requireAuth(null, "Join Orbit to create and publish your posts");
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        mb: 3,
        borderRadius: 3.5,
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
      }}
    >
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
        <Avatar
          sx={{
            bgcolor: user ? '#0f172a' : '#e2e8f0',
            color: user ? '#ffffff' : '#64748b',
            fontWeight: 700,
            width: 40,
            height: 40,
          }}
        >
          {user ? user.username[0].toUpperCase() : '?'}
        </Avatar>

        <Box sx={{ flex: 1 }}>
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder={
              user
                ? `What's on your mind, ${user.username}?`
                : "What's on your mind? (Sign in to publish)"
            }
            value={text}
            onChange={(e) => setText(e.target.value)}
            onClick={handleInputClick}
            inputProps={{
              readOnly: !user,
            }}
            sx={{
              cursor: !user ? 'pointer' : 'text',
              '& .MuiInputBase-input': {
                cursor: !user ? 'pointer' : 'text',
              },
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#f8fafc',
                borderRadius: 2.5,
                color: '#0f172a',
                fontSize: '0.95rem',
                p: 1.5,
                cursor: !user ? 'pointer' : 'text',
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
            }}
          />

          {showImageInput && (
            <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Paste image URL (https://...)"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f8fafc',
                    borderRadius: 2,
                    color: '#0f172a',
                    fontSize: '0.85rem',
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
                }}
              />
              <IconButton
                size="small"
                onClick={() => {
                  setImage('');
                  setShowImageInput(false);
                }}
                sx={{ color: '#94a3b8' }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )}

          {/* Image Preview if provided */}
          {image && (
            <Box
              sx={{
                mt: 1.5,
                borderRadius: 2,
                overflow: 'hidden',
                maxHeight: 200,
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8fafc',
              }}
            >
              <img
                src={image}
                alt="Post preview"
                style={{ width: '100%', maxHeight: 200, objectFit: 'cover' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </Box>
          )}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mt: 1.5,
              pt: 1,
              borderTop: '1px solid #f1f5f9',
            }}
          >
            <Tooltip title="Attach image URL">
              <Button
                size="small"
                startIcon={<ImageOutlined />}
                onClick={() => {
                  if (!user) {
                    requireAuth(null, "Join Orbit to create and publish your posts");
                    return;
                  }
                  setShowImageInput((prev) => !prev);
                }}
                sx={{
                  color: showImageInput ? '#0f172a' : '#64748b',
                  textTransform: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  '&:hover': {
                    color: '#0f172a',
                    backgroundColor: '#f1f5f9',
                  },
                }}
              >
                Photo
              </Button>
            </Tooltip>

            <Button
              variant="contained"
              disabled={(!text.trim() && !image.trim()) || loading}
              onClick={handlePost}
              endIcon={loading ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <SendIcon />}
              sx={{
                backgroundColor: '#0f172a',
                color: '#ffffff',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                px: 2.5,
                boxShadow: '0 1px 3px rgba(15, 23, 42, 0.12)',
                '&:hover': {
                  backgroundColor: '#1e293b',
                  boxShadow: '0 2px 6px rgba(15, 23, 42, 0.18)',
                },
                '&.Mui-disabled': {
                  backgroundColor: '#e2e8f0',
                  color: '#94a3b8',
                },
              }}
            >
              Post
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default CreatePost;