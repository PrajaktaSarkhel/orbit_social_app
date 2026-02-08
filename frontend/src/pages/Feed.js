import React, { useEffect, useState, useCallback } from 'react';
import { Container, Button, Box, Typography } from '@mui/material';
import API from '../api';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await API.get(`/posts/feed?page=${page}`);

      if (res.data.posts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => [...prev, ...res.data.posts]);
      }
    } catch (err) {
      console.error("Error fetching posts", err);
    }
  }, [page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleNewPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
        Orbit Social
      </Typography>

      <CreatePost onPostCreated={handleNewPost} />

      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}

      {hasMore && (
        <Box textAlign="center" mt={3}>
          <Button variant="outlined" onClick={() => setPage((p) => p + 1)}>
            Load More Posts
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Feed;
