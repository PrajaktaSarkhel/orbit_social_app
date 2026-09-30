import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Button,
  Box,
  Typography,
  Skeleton,
  Card,
  CardHeader,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  Explore as ExploreIcon,
  Whatshot as TrendingIcon,
  Bookmark as BookmarkIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import API from '../api';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import { useAuth } from '../context/AuthContext';
import { initialInstagramPosts } from '../data/samplePosts';

const Feed = () => {
  const { user, requireAuth } = useAuth();
  const [posts, setPosts] = useState(initialInstagramPosts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'trending' | 'saved'

  // Helper to filter and sort sample fallback posts
  const getFallbackPosts = useCallback(
    (filter) => {
      let result = [...initialInstagramPosts];
      if (filter === 'trending') {
        result.sort((a, b) => {
          const scoreA = (a.likes?.length || 0) + (a.comments?.length || 0) + (a.sharesCount || 0);
          const scoreB = (b.likes?.length || 0) + (b.comments?.length || 0) + (b.sharesCount || 0);
          return scoreB - scoreA;
        });
      } else if (filter === 'saved') {
        if (!user?.username) return [];
        result = result.filter((p) => p.savedBy?.includes(user.username));
      }
      return result;
    },
    [user?.username]
  );

  const fetchPosts = useCallback(
    async (currentPage = 1, filter = activeTab, replace = false) => {
      if (currentPage === 1) setLoading(true);
      else setLoadingMore(true);

      try {
        let endpoint = '';
        if (filter === 'saved') {
          if (!user?.username) {
            setPosts([]);
            setLoading(false);
            setLoadingMore(false);
            return;
          }
          endpoint = `/posts/saved/${user.username}`;
        } else {
          endpoint = `/posts/feed?page=${currentPage}&limit=8&filter=${filter}`;
        }

        const res = await API.get(endpoint);
        const incomingPosts = res.data.posts || [];

        // If backend returned no posts in explore/trending, fallback to Instagram sample posts
        if (incomingPosts.length === 0 && filter !== 'saved') {
          const fallback = getFallbackPosts(filter);
          setPosts(fallback);
          setHasMore(false);
        } else if (filter === 'saved') {
          if (incomingPosts.length === 0) {
            const fallbackSaved = getFallbackPosts('saved');
            setPosts(fallbackSaved);
          } else {
            setPosts(incomingPosts);
          }
          setHasMore(false);
        } else {
          if (currentPage >= (res.data.totalPages || 1) || incomingPosts.length === 0) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }

          if (replace || currentPage === 1) {
            setPosts(incomingPosts);
          } else {
            setPosts((prev) => {
              const existingIds = new Set(prev.map((p) => p._id));
              const fresh = incomingPosts.filter((p) => !existingIds.has(p._id));
              return [...prev, ...fresh];
            });
          }
        }
      } catch (err) {
        console.warn('API fetch issue, using local Instagram showcase posts:', err.message);
        const fallback = getFallbackPosts(filter);
        setPosts(fallback);
        setHasMore(false);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [activeTab, user?.username, getFallbackPosts]
  );

  useEffect(() => {
    setPage(1);
    fetchPosts(1, activeTab, true);
  }, [activeTab, fetchPosts]);

  const handleTabChange = (newValue) => {
    if (newValue === activeTab) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (newValue === 'saved') {
      const authorized = requireAuth(
        () => {
          setActiveTab('saved');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        'Sign in to view your saved bookmarks collection'
      );
      if (!authorized) return;
    }
    setActiveTab(newValue);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostUpdated = () => {
    fetchPosts(1, activeTab, true);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage, activeTab, false);
  };

  return (
    <Container maxWidth="sm" sx={{ pt: { xs: 2, sm: 3 }, pb: { xs: 11, sm: 12 } }}>
      {/* Category / Context Banner for Trending and Saved */}
      {activeTab === 'saved' ? (
        <Box
          sx={{
            mb: 3,
            p: 2,
            borderRadius: 3,
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              backgroundColor: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <BookmarkIcon sx={{ fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight="700" sx={{ color: '#0f172a', lineHeight: 1.2 }}>
              Saved Bookmarks
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Your private collection of posts saved for later
            </Typography>
          </Box>
        </Box>
      ) : activeTab === 'trending' ? (
        <Box
          sx={{
            mb: 2.5,
            p: 1.5,
            px: 2,
            borderRadius: 2.5,
            backgroundColor: '#fff1f2',
            border: '1px solid #ffe4e6',
            display: 'flex',
            alignItems: 'center',
            gap: 1.2,
          }}
        >
          <TrendingIcon sx={{ color: '#ef4444', fontSize: 20 }} />
          <Typography variant="body2" fontWeight="700" sx={{ color: '#9f1239' }}>
            Trending Feed • Posts with highest community engagement
          </Typography>
        </Box>
      ) : null}

      {/* Post Creator Box */}
      {activeTab !== 'saved' && <CreatePost onPostCreated={handleNewPost} />}

      {/* Loading Skeleton Shimmers */}
      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {[1, 2, 3].map((n) => (
            <Card
              key={n}
              sx={{
                borderRadius: 3.5,
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                p: 1,
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <CardHeader
                avatar={<Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: '#f1f5f9' }} />}
                title={<Skeleton width="40%" height={20} sx={{ bgcolor: '#f1f5f9' }} />}
                subheader={<Skeleton width="20%" height={15} sx={{ bgcolor: '#f8fafc' }} />}
              />
              <CardContent sx={{ py: 1 }}>
                <Skeleton variant="text" width="90%" sx={{ bgcolor: '#f1f5f9' }} />
                <Skeleton variant="text" width="65%" sx={{ bgcolor: '#f1f5f9' }} />
              </CardContent>
              <Skeleton
                variant="rectangular"
                height={260}
                sx={{ borderRadius: 2, bgcolor: '#f1f5f9', mx: 2, mb: 2 }}
              />
            </Card>
          ))}
        </Box>
      ) : posts.length === 0 ? (
        /* Empty State */
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 2,
            backgroundColor: '#ffffff',
            borderRadius: 3.5,
            border: '1px dashed #cbd5e1',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          }}
        >
          <Typography variant="h6" fontWeight="700" sx={{ color: '#0f172a', mb: 1 }}>
            {activeTab === 'saved'
              ? 'No saved posts yet'
              : activeTab === 'trending'
              ? 'No trending posts right now'
              : 'The orbit feed is clear!'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', maxWidth: 360, mx: 'auto', mb: 3 }}>
            {activeTab === 'saved'
              ? 'Tap the bookmark icon on any post across Orbit to save it for later.'
              : 'Be the first to share your thoughts, images, and spark a conversation!'}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => fetchPosts(1, activeTab, true)}
            sx={{
              color: '#0f172a',
              borderColor: '#cbd5e1',
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#0f172a',
                backgroundColor: '#f1f5f9',
              },
            }}
          >
            Refresh Feed
          </Button>
        </Box>
      ) : (
        /* Posts Feed List */
        posts.map((post) => (
          <PostCard key={post._id} post={post} onPostUpdated={handlePostUpdated} />
        ))
      )}

      {/* Pagination / Load More Button */}
      {!loading && hasMore && activeTab !== 'saved' && (
        <Box textAlign="center" mt={4} mb={2}>
          <Button
            variant="outlined"
            onClick={handleLoadMore}
            disabled={loadingMore}
            startIcon={loadingMore ? <CircularProgress size={16} sx={{ color: '#0f172a' }} /> : null}
            sx={{
              color: '#0f172a',
              borderColor: '#cbd5e1',
              borderRadius: 2.5,
              px: 4,
              py: 1.2,
              textTransform: 'none',
              fontWeight: 600,
              backgroundColor: '#ffffff',
              '&:hover': {
                borderColor: '#0f172a',
                backgroundColor: '#f1f5f9',
              },
            }}
          >
            {loadingMore ? 'Fetching more posts...' : 'Load More Posts'}
          </Button>
        </Box>
      )}

      {/* Sticky Bottom Navigation Bar (Instagram Style) */}
      <Box
        component="nav"
        aria-label="Feed Navigation"
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
          backgroundColor: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid #e2e8f0',
          boxShadow: '0 -4px 20px rgba(15, 23, 42, 0.06)',
          py: 0.8,
          px: { xs: 1.5, sm: 2 },
        }}
      >
        <Container maxWidth="sm" disableGutters>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              gap: { xs: 1, sm: 2 },
            }}
          >
            {/* Explore Tab */}
            <Button
              onClick={() => handleTabChange('all')}
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 0.8,
                px: 1,
                borderRadius: 2.5,
                textTransform: 'none',
                minWidth: 0,
                backgroundColor: activeTab === 'all' ? '#0f172a' : 'transparent',
                color: activeTab === 'all' ? '#ffffff' : '#64748b',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: activeTab === 'all' ? '#1e293b' : '#f1f5f9',
                  color: activeTab === 'all' ? '#ffffff' : '#0f172a',
                },
              }}
            >
              <ExploreIcon sx={{ fontSize: 22, mb: 0.25 }} />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: activeTab === 'all' ? 700 : 500,
                  fontSize: '0.75rem',
                  lineHeight: 1,
                }}
              >
                Explore
              </Typography>
            </Button>

            {/* Trending Tab */}
            <Button
              onClick={() => handleTabChange('trending')}
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 0.8,
                px: 1,
                borderRadius: 2.5,
                textTransform: 'none',
                minWidth: 0,
                backgroundColor: activeTab === 'trending' ? '#0f172a' : 'transparent',
                color: activeTab === 'trending' ? '#ffffff' : '#64748b',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: activeTab === 'trending' ? '#1e293b' : '#f1f5f9',
                  color: activeTab === 'trending' ? '#ffffff' : '#0f172a',
                },
              }}
            >
              <TrendingIcon
                sx={{
                  fontSize: 22,
                  mb: 0.25,
                  color: activeTab === 'trending' ? '#f87171' : 'inherit',
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: activeTab === 'trending' ? 700 : 500,
                  fontSize: '0.75rem',
                  lineHeight: 1,
                }}
              >
                Trending
              </Typography>
            </Button>

            {/* Saved Tab */}
            <Button
              onClick={() => handleTabChange('saved')}
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 0.8,
                px: 1,
                borderRadius: 2.5,
                textTransform: 'none',
                minWidth: 0,
                backgroundColor: activeTab === 'saved' ? '#0f172a' : 'transparent',
                color: activeTab === 'saved' ? '#ffffff' : '#64748b',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: activeTab === 'saved' ? '#1e293b' : '#f1f5f9',
                  color: activeTab === 'saved' ? '#ffffff' : '#0f172a',
                },
              }}
            >
              <BookmarkIcon
                sx={{
                  fontSize: 22,
                  mb: 0.25,
                  color: activeTab === 'saved' ? '#fbbf24' : 'inherit',
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: activeTab === 'saved' ? 700 : 500,
                  fontSize: '0.75rem',
                  lineHeight: 1,
                }}
              >
                Saved
              </Typography>
            </Button>
          </Box>
        </Container>
      </Box>
    </Container>
  );
};

export default Feed;
