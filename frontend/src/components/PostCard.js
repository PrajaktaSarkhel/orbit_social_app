import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Box,
  Collapse,
  TextField,
  Button,
  Snackbar,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  Bookmark,
  BookmarkBorder,
  ShareOutlined,
  Send as SendIcon,
} from '@mui/icons-material';
import API from '../api';
import { useAuth } from '../context/AuthContext';

// Helper to format friendly relative timestamps
const formatRelativeTime = (timestamp) => {
  if (!timestamp) return '';
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return 'just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return past.toLocaleDateString();
};

// Subtle modern solid badge colors for avatars without pictures
const getAvatarColor = (username = '') => {
  const colors = [
    '#0f172a',
    '#2563eb',
    '#059669',
    '#d97706',
    '#dc2626',
    '#7c3aed',
    '#0891b2',
    '#475569',
  ];
  const charCode = username.charCodeAt(0) || 0;
  return colors[charCode % colors.length];
};

const PostCard = ({ post, onPostUpdated }) => {
  const { user, requireAuth } = useAuth();

  // Optimistic local state
  const currentUsername = user?.username;
  const [likes, setLikes] = useState(post.likes || []);
  const [savedBy, setSavedBy] = useState(post.savedBy || []);
  const [comments, setComments] = useState(post.comments || []);
  const [sharesCount, setSharesCount] = useState(post.sharesCount || 0);

  const [commentsExpanded, setCommentsExpanded] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });
  const [likeAnimation, setLikeAnimation] = useState(false);

  const isLiked = currentUsername && likes.includes(currentUsername);
  const isSaved = currentUsername && savedBy.includes(currentUsername);

  // 1. Like with Optimistic UI & Local fallback
  const handleLike = () => {
    requireAuth(async () => {
      const prevLikes = [...likes];
      const hasLiked = prevLikes.includes(currentUsername);

      // Trigger pop animation
      setLikeAnimation(true);
      setTimeout(() => setLikeAnimation(false), 400);

      // Optimistic update
      const newLikes = hasLiked
        ? prevLikes.filter((u) => u !== currentUsername)
        : [...prevLikes, currentUsername];
      setLikes(newLikes);

      try {
        const res = await API.put(`/posts/${post._id}/like`, { username: currentUsername });
        if (res.data?.likes) {
          setLikes(res.data.likes);
        }
      } catch (err) {
        // In local/fallback mode, keep optimistic update!
        console.warn('Backend not responding to like, kept locally:', err.message);
      }
    }, 'Sign in to like this post');
  };

  // 2. Save / Bookmark with Optimistic UI & Local fallback
  const handleSave = () => {
    requireAuth(async () => {
      const prevSaved = [...savedBy];
      const hasSaved = prevSaved.includes(currentUsername);

      const newSaved = hasSaved
        ? prevSaved.filter((u) => u !== currentUsername)
        : [...prevSaved, currentUsername];
      setSavedBy(newSaved);

      setToast({
        open: true,
        message: !hasSaved ? 'Post saved to your collection' : 'Post removed from saved',
        severity: 'success',
      });

      try {
        const res = await API.put(`/posts/${post._id}/save`, { username: currentUsername });
        if (res.data?.savedBy) {
          setSavedBy(res.data.savedBy);
        }
      } catch (err) {
        console.warn('Backend not responding to save, kept locally:', err.message);
      }
    }, 'Sign in to save this post to your bookmarks');
  };

  // 3. Comment submission with Optimistic UI & Local fallback
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    requireAuth(async () => {
      const textToSubmit = commentText.trim();
      setCommentText('');
      setIsSubmittingComment(true);

      const optimisticComment = {
        username: currentUsername,
        text: textToSubmit,
        createdAt: new Date().toISOString(),
      };

      setComments((prev) => [...prev, optimisticComment]);

      try {
        const res = await API.post(`/posts/${post._id}/comment`, {
          username: currentUsername,
          text: textToSubmit,
        });
        if (res.data?.comments) {
          setComments(res.data.comments);
        }
      } catch (err) {
        console.warn('Backend not responding to comment, kept locally:', err.message);
      } finally {
        setIsSubmittingComment(false);
      }
    }, 'Sign in to join the conversation and comment');
  };

  // 4. Share with Web Share API & Clipboard Fallback
  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: `${post.username}'s post on Orbit`,
      text: post.text ? post.text.substring(0, 100) : 'Check out this post on Orbit!',
      url: shareUrl,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setToast({ open: true, message: 'Post link copied to clipboard!', severity: 'success' });
      }

      setSharesCount((c) => c + 1);
      API.post(`/posts/${post._id}/share`).catch(() => {});
    } catch (err) {
      if (err.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(shareUrl);
          setToast({ open: true, message: 'Post link copied to clipboard!', severity: 'success' });
        } catch {
          setToast({ open: true, message: 'Could not share link', severity: 'error' });
        }
      }
    }
  };

  return (
    <>
      <Card
        sx={{
          mb: 3,
          borderRadius: 3.5,
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
          transition: 'box-shadow 0.2s ease, transform 0.15s ease',
          '&:hover': {
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.06)',
          },
        }}
      >
        {/* Header with Avatar and Author info */}
        <CardHeader
          avatar={
            <Avatar
              src={post.userAvatar || undefined}
              sx={{
                bgcolor: getAvatarColor(post.username),
                color: '#fff',
                fontWeight: 700,
                width: 40,
                height: 40,
                border: '1px solid #f1f5f9',
              }}
            >
              {post.username ? post.username[0].toUpperCase() : 'O'}
            </Avatar>
          }
          title={
            <Typography variant="subtitle1" fontWeight="700" sx={{ color: '#0f172a', fontSize: '0.95rem' }}>
              {post.username}
            </Typography>
          }
          subheader={
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.8rem' }}>
              {formatRelativeTime(post.createdAt)}
            </Typography>
          }
          sx={{ pb: 1, pt: 1.5, px: 2 }}
        />

        {/* Post Text Content */}
        {post.text && (
          <CardContent sx={{ pt: 0.5, pb: 1.5, px: 2 }}>
            <Typography
              variant="body1"
              sx={{
                color: '#1e293b',
                lineHeight: 1.6,
                fontSize: '0.94rem',
                whiteSpace: 'pre-line',
              }}
            >
              {post.text}
            </Typography>
          </CardContent>
        )}

        {/* Media Image */}
        {post.image && (
          <Box
            sx={{
              maxHeight: 520,
              overflow: 'hidden',
              backgroundColor: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderTop: '1px solid #f1f5f9',
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            <CardMedia
              component="img"
              image={post.image}
              alt="Post media"
              loading="lazy"
              sx={{
                width: '100%',
                maxHeight: 520,
                objectFit: 'cover',
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </Box>
        )}

        {/* Social Engagement Actions Bar */}
        <CardActions
          disableSpacing
          sx={{
            px: 2,
            py: 1,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {/* LIKE BUTTON */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title={isLiked ? 'Unlike' : 'Like'}>
                <IconButton
                  aria-label="like post"
                  onClick={handleLike}
                  sx={{
                    color: isLiked ? '#ef4444' : '#64748b',
                    transition: 'all 0.15s ease',
                    transform: likeAnimation ? 'scale(1.25)' : 'scale(1)',
                    '&:hover': {
                      color: '#ef4444',
                      backgroundColor: '#fee2e2',
                    },
                  }}
                >
                  {isLiked ? <Favorite sx={{ fontSize: 22 }} /> : <FavoriteBorder sx={{ fontSize: 22 }} />}
                </IconButton>
              </Tooltip>
              <Typography
                variant="body2"
                sx={{
                  color: isLiked ? '#ef4444' : '#0f172a',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  minWidth: 16,
                }}
              >
                {likes.length}
              </Typography>
            </Box>

            {/* COMMENT BUTTON */}
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 1.5 }}>
              <Tooltip title="View or add comments">
                <IconButton
                  aria-label="comment on post"
                  onClick={() => setCommentsExpanded((prev) => !prev)}
                  sx={{
                    color: commentsExpanded ? '#0f172a' : '#64748b',
                    '&:hover': {
                      color: '#0f172a',
                      backgroundColor: '#f1f5f9',
                    },
                  }}
                >
                  <ChatBubbleOutline sx={{ fontSize: 21 }} />
                </IconButton>
              </Tooltip>
              <Typography
                variant="body2"
                sx={{
                  color: '#0f172a',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  minWidth: 16,
                }}
              >
                {comments.length}
              </Typography>
            </Box>

            {/* SHARE BUTTON */}
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 1.5 }}>
              <Tooltip title="Share post">
                <IconButton
                  aria-label="share post"
                  onClick={handleShare}
                  sx={{
                    color: '#64748b',
                    '&:hover': {
                      color: '#0284c7',
                      backgroundColor: '#e0f2fe',
                    },
                  }}
                >
                  <ShareOutlined sx={{ fontSize: 21 }} />
                </IconButton>
              </Tooltip>
              {sharesCount > 0 && (
                <Typography variant="body2" sx={{ color: '#0f172a', fontWeight: 600, fontSize: '0.88rem' }}>
                  {sharesCount}
                </Typography>
              )}
            </Box>
          </Box>

          {/* SAVE / BOOKMARK BUTTON */}
          <Box>
            <Tooltip title={isSaved ? 'Saved in collection' : 'Save post'}>
              <IconButton
                aria-label="save post"
                onClick={handleSave}
                sx={{
                  color: isSaved ? '#d97706' : '#64748b',
                  '&:hover': {
                    color: '#d97706',
                    backgroundColor: '#fef3c7',
                  },
                }}
              >
                {isSaved ? <Bookmark sx={{ fontSize: 22 }} /> : <BookmarkBorder sx={{ fontSize: 22 }} />}
              </IconButton>
            </Tooltip>
          </Box>
        </CardActions>

        {/* Expandable Comments Drawer */}
        <Collapse in={commentsExpanded} timeout="auto" unmountOnExit>
          <Box
            sx={{
              p: 2,
              backgroundColor: '#f8fafc',
              borderTop: '1px solid #e2e8f0',
            }}
          >
            {/* List existing comments */}
            <Box sx={{ mb: 2, maxHeight: 240, overflowY: 'auto' }}>
              {comments.length === 0 ? (
                <Typography variant="body2" sx={{ color: '#64748b', fontStyle: 'italic', py: 1 }}>
                  No comments yet. Be the first to start the conversation!
                </Typography>
              ) : (
                comments.map((comm, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1.2,
                      mb: 1.5,
                      p: 1.2,
                      borderRadius: 2,
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <Avatar
                      src={comm.userAvatar || undefined}
                      sx={{
                        width: 28,
                        height: 28,
                        fontSize: '0.8rem',
                        bgcolor: getAvatarColor(comm.username),
                        fontWeight: 700,
                      }}
                    >
                      {comm.username ? comm.username[0].toUpperCase() : 'U'}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" fontWeight="700" sx={{ color: '#0f172a' }}>
                          {comm.username}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.7rem' }}>
                          {formatRelativeTime(comm.createdAt)}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#334155', mt: 0.3, fontSize: '0.88rem' }}>
                        {comm.text}
                      </Typography>
                    </Box>
                  </Box>
                ))
              )}
            </Box>

            {/* Inline Comment Input Form */}
            <form onSubmit={handleCommentSubmit}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder={user ? "Write a comment..." : "Sign in to comment..."}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onFocus={() => {
                    if (!user) {
                      requireAuth(null, "Sign in to join the conversation and comment");
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#ffffff',
                      borderRadius: 2.5,
                      color: '#0f172a',
                      fontSize: '0.9rem',
                      '& fieldset': {
                        borderColor: '#cbd5e1',
                      },
                      '&:hover fieldset': {
                        borderColor: '#94a3b8',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#0f172a',
                      },
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: '#94a3b8',
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!commentText.trim() || isSubmittingComment}
                  sx={{
                    minWidth: 44,
                    px: 1.5,
                    borderRadius: 2.5,
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    '&:hover': {
                      backgroundColor: '#1e293b',
                    },
                    '&.Mui-disabled': {
                      backgroundColor: '#e2e8f0',
                      color: '#94a3b8',
                    },
                  }}
                >
                  <SendIcon sx={{ fontSize: 18 }} />
                </Button>
              </Box>
            </form>
          </Box>
        </Collapse>
      </Card>

      {/* Snackbar feedback */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          sx={{
            borderRadius: 2,
            backgroundColor: toast.severity === 'error' ? '#ef4444' : '#0f172a',
            color: '#fff',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PostCard;
