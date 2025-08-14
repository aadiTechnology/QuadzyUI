import React, { useEffect, useState, useRef } from 'react';
import { Box, Fab, CircularProgress, IconButton, Tabs, Tab, TextField, Card } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import LoungeTabs from '../components/LoungeTabs';
import PostList from '../components/PostList';
import { fetchLounges, fetchPosts, createPost, likePost, commentPost, viewPost, fetchComments, addComment, dislikePost, savePost, unsavePost } from '../services/loungeService';
import type { Comment } from '../../../types';
import { useNavigate } from 'react-router-dom';
import PollCard from '../../poll/components/PollCard';

const HomePage: React.FC = () => {
  const [lounges, setLounges] = useState<{ id: number; name: string }[]>([]);
 
  // Get my collegeId from token user object
  const user =  localStorage.getItem('user');
  let myCollegeId: number | null = null;
  if (user) {
    try {
      myCollegeId = JSON.parse(user).collegeId ?? null;
    } catch (e) {
      myCollegeId = null;
    }
  }
//  const [selectedLounge, setSelectedLounge] = useState<number | null>(myCollegeId);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [commentDrawerOpen, setCommentDrawerOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [otherCollegeId, setOtherCollegeId] = useState<number | null>(null);
  const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);

  // Dummy comments state for demonstration (replace with your real comments logic)
  const [comments, setComments] = useState<{ [postId: number]: Comment[] }>({});
  const [loadingComments, setLoadingComments] = useState(false);
  
  const [savedPolls, setSavedPolls] = useState<any[]>([]);
  const [mergedFeed, setMergedFeed] = useState<any[]>([]);

  const navigate = useNavigate();

  // Long press handler for 2nd tab
  const handleTabMouseDown = (tabIdx: number) => {
    if (tabIdx === 1) {
      dropdownTimeout.current = setTimeout(() => {
        setShowCollegeDropdown(true);
      }, 600); // 600ms for long press
    }
  };

  const handleTabMouseUp = () => {
    if (dropdownTimeout.current) {
      clearTimeout(dropdownTimeout.current);
      dropdownTimeout.current = null;
    }
  };

  // Filtered lounges for dropdown search
  const filteredLounges = lounges
    .filter((c: any) =>  c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  useEffect(() => {
    fetchLounges().then(res => {
      setLounges(res.data);
      localStorage.setItem('colleges', JSON.stringify(res.data));

      // Pick the first college that's not mine as the default "other" college
      const other = res.data.find((c: any) => c.id !== myCollegeId);
      setOtherCollegeId(other ? other.id : null);
    });
  }, []);

  useEffect(() => {
    let fetchFn;
    let collegeIdToFetch;
    if (tabIndex === 0) {
      // My college, private posts
      fetchFn = () => fetchPosts(myCollegeId);
      collegeIdToFetch = myCollegeId;
    } else if (tabIndex === 1 && otherCollegeId) {
      // Other college, public (not private) posts
      fetchFn = () => fetchPosts(otherCollegeId);
      collegeIdToFetch = otherCollegeId;
    } else {
      // Generic tab: fetch all public posts (implement as needed)
      fetchFn = () => fetchPosts(0);
      collegeIdToFetch = 0;
    }
    setLoading(true);
    fetchFn().then(res => {
      let filtered = res.data.map((p: any) => ({
        ...p,
        id: p.id ?? p.postId,
        institution: p.collegeName, // <-- Map collegeName to institution
      }));
      if (tabIndex === 0) {
        // Show posts where loungeId === myCollegeId and isPrivate === true
        filtered = filtered.filter(
          (p: any) => (p.loungeId === myCollegeId || p.institutionId === myCollegeId) && p.isPrivate === true
        );
      } else if (tabIndex === 1) {
        // Show posts where loungeId === otherCollegeId and isPrivate === false
        filtered = filtered.filter(
          (p: any) => (p.loungeId === otherCollegeId || p.institutionId === otherCollegeId) && p.isPrivate === false
        );
      } else if (tabIndex === 2) {
        // Show posts where loungeId == null (do not check isPrivate)
        filtered = filtered.filter(
          (p: any) => p.loungeId == null || p.loungeId === undefined
        );
      } else {
        filtered = filtered.filter((p: any) => !p.isPrivate);
      }
      setPosts(filtered);
      setLoading(false);
    });
  }, [tabIndex, myCollegeId, otherCollegeId]);

  // Handler for Like
  const handleLike = async (postId: number) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
    try {
      await likePost(postId); // backend should toggle like/unlike
    } catch (e) {
      // Optionally revert UI if backend fails
    }
  };
   // Fetch posts and polls, then merge and sort
  useEffect(() => {
    const polls = JSON.parse(localStorage.getItem('createdPolls') || '[]');
    polls.forEach((p: any) => { p._type = 'poll'; });
    // Assume posts already fetched and in `posts` state
    const postsWithType = posts.map(p => ({ ...p, _type: 'post' }));

    // Merge and sort by createdAt/created_at/timestamp
    const merged = [...polls, ...postsWithType].sort((a, b) => {
      const aTime = new Date(a.createdAt || a.created_at || a.timestamp).getTime();
      const bTime = new Date(b.createdAt || b.created_at || b.timestamp).getTime();
      return bTime - aTime;
    });
    setMergedFeed(merged);
  }, [posts, savedPolls]); // Make sure to update when posts or polls change


  // Handler for Dislike
  const handleDislike = async (postId: number) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              disliked: !post.disliked,
              dislikes: post.disliked ? post.dislikes - 1 : post.dislikes + 1,
            }
          : post
      )
    );
    try {
      await dislikePost(postId);
    } catch (e) {
      // Optionally revert UI if backend fails
    }
  };

  // Handler for Comment
  const handleComment = async (postId: number) => {
    try {
      const res = await commentPost(postId);
      const { postId: updatedId, comments } = res.data;
      setPosts(prev =>
        prev.map(post =>
          post.id === updatedId ? { ...post, comments } : post
        )
      );
    } catch (e) {
      // handle error
    }
  };

  const [viewedPosts, setViewedPosts] = useState<Set<number>>(() => {
    // Optionally persist viewed posts in localStorage for session persistence
    const stored = localStorage.getItem('viewedPosts');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  // Handler for View
  const handleView = async (postId: number) => {
    // Prevent duplicate views by the same user
    if (viewedPosts.has(postId)) return;

    setViewedPosts(prev => {
      const updated = new Set(prev);
      updated.add(postId);
      localStorage.setItem('viewedPosts', JSON.stringify(Array.from(updated)));
      return updated;
    });

    try {
      const res = await viewPost(postId);
      const { postId: updatedId, views } = res.data;
      setPosts(prev =>
        prev.map(post =>
          post.id === updatedId ? { ...post, views } : post
        )
      );
    } catch (e) {
      // handle error
    }
  };

  const handleCreatePost = async (data: any) => {
    const userHandle = localStorage.getItem('userHandle');
    await createPost(myCollegeId!, { ...data, userHandle }); // add userHandle to post data
    setOpenDialog(false);
    // Refresh posts
    const res = await fetchPosts(myCollegeId!);
    setPosts(
      res.data.map((p: any) => ({
        ...p,
        id: p.id ?? p.postId,
      }))
    );
  };

  const handleOpenComments = async (post: any) => {
    setSelectedPost(post);
    setCommentDrawerOpen(true);
    setLoadingComments(true);
    try {
      const res = await fetchComments(post.id);
      setComments(prev => ({
        ...prev,
        [post.id]: res.data, // res.data should be Comment[]
      }));
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async (comment: string) => {
    if (selectedPost) {
      const userHandle = localStorage.getItem('userHandle') ?? '';
      await addComment(selectedPost.id, comment, userHandle); // pass userHandle
      // Re-fetch comments after adding
      const res = await fetchComments(selectedPost.id);
      setComments(prev => ({
        ...prev,
        [selectedPost.id]: res.data,
      }));
      setPosts(prev =>
        prev.map(post =>
          post.id === selectedPost.id
            ? { ...post, comments: res.data.length }
            : post
        )
      );
    }
  };

  const handleSaveToggle = async (postId: number, saved: boolean) => {
    const user = localStorage.getItem('userHandle');
    const handle = user ? JSON.parse(user).handle : '';
    if (!handle) return;
    try {
      if (saved) {
        await savePost(postId, handle);
      } else {
        await unsavePost(postId, handle);
      }
      setPosts(prev =>
        prev.map(post =>
          post.id === postId ? { ...post, saved } : post
        )
      );
    } catch (e) {
      // Optionally handle error
    }
  };

    useEffect(() => {
    const polls = JSON.parse(localStorage.getItem('createdPolls') || '[]');
    // Sort by createdAt descending
    polls.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setSavedPolls(polls);
  }, []);

  const userObj = user ? JSON.parse(user) : {};
const myCollegeName = userObj.collegeName || localStorage.getItem('collegeName') || 'Your College';
const myHandle = userObj.handle || localStorage.getItem('userHandle') || 'userHandle';

  return (
    <Box sx={{ position: 'relative',  minHeight: '100vh',  pb: { xs: 10, md: 10 }, }} >
        <Card sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 3 },  boxShadow: '0 4px 24px 0 rgba(60,72,120,0.10)', background: '#fff',position: 'sticky',
       top: 0, 
    height: '80vh', 
    overflowY: 'auto',  }} >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Tabs
          value={tabIndex}
          onChange={(_, v) => setTabIndex(v)}
          variant="fullWidth"
        >
          <Tab
            label={lounges.find((c: any) => c.id === myCollegeId)?.name || 'My College'}
          />
          <Tab
            label={lounges.find((c: any) => c.id === otherCollegeId)?.name || 'Other College'}
            disabled={!otherCollegeId}
            onMouseDown={() => handleTabMouseDown(1)}
            onMouseUp={handleTabMouseUp}
            onMouseLeave={handleTabMouseUp}
          />
          <Tab label="Pulse" />
        </Tabs>
        {showCollegeDropdown && (
          <Box sx={{
            position: 'absolute',
            top: 60,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            background: '#fff',
            boxShadow: 3,
            p: 2,
            borderRadius: 2,
            minWidth: 250,
          }}>
            <TextField
              autoFocus
              placeholder="Search college"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
            />
            <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
              {filteredLounges.map((c: any) => (
                <Box
                  key={c.id}
                  sx={{
                    p: 1,
                    cursor: 'pointer',
                    '&:hover': { background: '#f0f0f0' }
                  }}
                  onClick={() => {
                    setOtherCollegeId(c.id);
                    setShowCollegeDropdown(false);
                    setTabIndex(1);
                    setSearchTerm('');
                  }}
                >
                  {c.name}
                </Box>
              ))}
              {filteredLounges.length === 0 && (
                <Box sx={{ p: 1, color: 'text.secondary' }}>No colleges found</Box>
              )}
            </Box>
          </Box>
        )}
      </Box>

       {/* Move Your Polls section here */}
      {tabIndex === 0 && savedPolls.length > 0 && (
        <Box sx={{ mb: 3 }}>
          {savedPolls
            .filter(
              poll =>
                (poll.collegeName === myCollegeName || !poll.collegeName || poll.collegeName === '' || poll.collegeName === undefined) // fallback for old polls
            )
            .map((poll, idx) => (
              <PollCard
                key={poll.createdAt || idx}
                poll={{
                  ...poll,
                  handle: poll.handle || myHandle,
                  collegeName: poll.collegeName || myCollegeName,
                }}
              />
            ))}
        </Box>
      )}
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
          sx={{ mb: 10 }} // Add margin-bottom to lift it above the sticky footer
        >
          <CircularProgress />
        </Box>
      ) : (
        <PostList
          posts={posts}
          onLike={handleLike}
          onDislike={handleDislike}
          onComment={handleComment}
          onView={handleView}
          onSaveToggle={handleSaveToggle}
          tabIndex={tabIndex} // <-- Add this line
        />
      )}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 90, // Place it above the sticky footer (footer height + some gap)
          right: 26,
          zIndex: 1201, // Make sure it's above the footer
        }}
        onClick={() => {
          let collegeId, collegeName, isPrivate;
          
          if (tabIndex === 0) {
            // Tab 1 - My college, private posts
            collegeId = myCollegeId;
            collegeName = lounges.find((c: any) => c.id === myCollegeId)?.name || '';
            isPrivate = true;
          } else if (tabIndex === 1) {
            // Tab 2 - Other college, public posts
            collegeId = otherCollegeId;
            collegeName = lounges.find((c: any) => c.id === otherCollegeId)?.name || '';
            isPrivate = false;
          } else {
            // Tab 3 - Pulse posts
            collegeId = null;
            collegeName = '';
            isPrivate = null;
          }
          
          navigate(`/lounges/${tabIndex === 0 ? myCollegeId : otherCollegeId}/new-post`, {
            state: {
              collegeId,
              collegeName,
              isPrivate,
              tabIndex
            }
          });
        }}
      >
        <AddIcon />
      </Fab>
      </Card>
    </Box>
  );
};

export default HomePage;