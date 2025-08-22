import React, { useEffect, useState } from 'react';
import {
  Box, Button, Container, CircularProgress, Snackbar, Alert, Tabs, Tab,
  Card, Stack, Grid, Typography
} from '@mui/material';
import ProfileHeader from '../components/ProfileHeader';
import ProfileActivity from '../components/ProfileActivity';
import ProfilePostList from '../components/ProfilePostList';
import ProfileSettingsDialog from '../components/ProfileSettingsDialog';
import { fetchUserProfile } from '../services/profileService';
import PostList from '../components/PostList';
import { useNavigate } from 'react-router-dom';
import { fetchLounges, fetchPosts, createPost, likePost, commentPost, viewPost, fetchComments, addComment, dislikePost, savePost, unsavePost } from '../services/loungeService';

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
    const [posts, setPosts] = useState<any[]>([]);
      const [loading, setLoading] = useState(false);
      const [openDialog, setOpenDialog] = useState(false);
      const [commentDrawerOpen, setCommentDrawerOpen] = useState(false);
      const [selectedPost, setSelectedPost] = useState<any>(null);
      const [otherCollegeId, setOtherCollegeId] = useState<number | null>(null);
        const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);
      const [tabIndex, setTabIndex] = useState(0);
    
      // Dummy comments state for demonstration (replace with your real comments logic)
      const [comments, setComments] = useState<{ [postId: number]: Comment[] }>({});
      const [loadingComments, setLoadingComments] = useState(false);
  const navigate = useNavigate();

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
        const userHandle = localStorage.getItem('userHandle') ?? '';
        await likePost(postId, userHandle); // backend should toggle like/unlike
      } catch (e) {
        // Optionally revert UI if backend fails
      }
    };

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
          localStorage.setItem('Your Post', JSON.stringify(Array.from(updated)));
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
        // Create the post and get the new post object from the response
        const res = await createPost(myCollegeId!, { ...data, userHandle });
        setOpenDialog(false);
    
        // Option 1: Prepend the new post to the current posts array
        setPosts(prev => [
          {
            ...res.data,
            id: res.data.id ?? res.data.postId,
            institution: res.data.collegeName, // for consistency
          },
          ...prev,
        ]);
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
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const handle = user.handle;
    if (!handle) {
      setSnackbar({ open: true, message: 'User not found. Please log in.', severity: 'error' });
      setLoading(false);
      return;
    }
    fetchUserProfile(handle)
      .then(setProfile)
      .catch(() => setSnackbar({ open: true, message: 'Failed to load profile.', severity: 'error' }))
      .finally(() => setLoading(false));
  }, []);

  const handleSettingsSave = (data: { handle: string; profilePicture?: string }) => {
    setProfile((prev: any) => ({
      ...prev,
      handle: data.handle,
      profilePicture: data.profilePicture,
    }));
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    user.handle = data.handle;
    localStorage.setItem('user', JSON.stringify(user));
    if (data.profilePicture) localStorage.setItem('profilePicture', data.profilePicture);
    setSnackbar({ open: true, message: 'Profile updated.', severity: 'success' });
  };

  const handleDraftClick = (draft: any) => {
    navigate('/lounges/0/new-post', { state: { draft } });
  };

  const handlePostClick = (post: any) => {
    navigate(`/post/${post.postId || post.id}`, { state: { post, headerTitle: 'Your Post' } });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) return null;

  // Ensure joinYear is valid
  const joinYear = profile.joinYear && profile.joinYear > 2000 ? profile.joinYear : '';

  return (
    <>
      <Box sx={{ position: 'relative', minHeight: '100vh', pb: { xs: 10, md: 10 } }}>
        <Card sx={{
          maxWidth: 1000,
          mx: 'auto',
          p: { xs: 1, md: 2 }, // smaller padding
          boxShadow: '0 4px 24px 0 rgba(60,72,120,0.10)',
          background: '#fff',
          position: 'sticky',
          top: 0,
          height: '80vh',
          overflowY: 'auto',
        }}>
          <Button sx={{
            position: 'absolute',
            left: 15,
            top: 15,
            minWidth: 36,
            borderRadius: 2,
            bgcolor: '#f5f7fa',
            color: '#000',
            fontWeight: 700,
            boxShadow: 0,
            '&:hover': { bgcolor: '#f4f5f8ff' },
          }}
            onClick={() => navigate(-1)}
          >
            ←
          </Button>
          <Stack spacing={2} alignItems="center" sx={{ mt: 4, mb: 2 }}>
            <ProfileHeader
              handle={profile.handle}
              collegeName={profile.collegeName}
              joinYear={joinYear}
              profilePicture={profile.profilePicture}
              onEditPhoto={() => setSettingsOpen(true)}
            />
            <Box width="100%">
              <Typography fontWeight={700} fontSize="1rem" mb={1}>Activity</Typography>
              <ProfileActivity {...profile.activity} />
            </Box>
          </Stack>
          <Tabs
            value={tabIndex}
            onChange={(_, v) => setTabIndex(v)}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            sx={{ mt: 2, mb: 2 }}
          >
            <Tab label="Your Posts" />
            <Tab label="Saved Posts" />
            <Tab label="Draft Posts" />
          </Tabs>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              {tabIndex === 0 && (
                <PostList
                  posts={posts}
                  onLike={handleLike}
                  onDislike={handleDislike}
                  onComment={handleComment}
                  onView={handleView}
                  onSaveToggle={handleSaveToggle}
                  tabIndex={tabIndex}
                  onClickPost={(post: any) =>
                    navigate(`/post/${post.id ?? post.postId ?? post}`, { state: { post, headerTitle: 'Your Post' } })
                  }
                />
              )}
              {tabIndex === 1 && (
                <PostList
                  posts={posts.filter(p => p.saved)}
                  onLike={handleLike}
                  onDislike={handleDislike}
                  onComment={handleComment}
                  onView={handleView}
                  onSaveToggle={handleSaveToggle}
                  tabIndex={tabIndex}
                  onClickPost={(post: any) => {
                    const postObj = typeof post === 'object' ? post : posts.find(p => p.id === post || p.postId === post);
                    if (postObj && postObj.id) {
                      navigate(`/post/${postObj.id}`, { state: { post: postObj, headerTitle: 'Saved Post' } });
                    }
                  }}
                />
              )}
              {tabIndex === 2 && (
                <ProfilePostList
                  title=""
                  posts={profile.draftPosts}
                  onClickPost={handleDraftClick}
                  isDraft
                  noCard
                />
              )}
            </Grid>
          </Grid>
          <ProfileSettingsDialog
            open={settingsOpen}
            onClose={() => setSettingsOpen(false)}
            profile={{ handle: profile.handle, profilePicture: profile.profilePicture }}
            onSave={handleSettingsSave}
          />
          <Snackbar
            open={snackbar.open}
            autoHideDuration={2000}
            onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          >
            <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
          </Snackbar>
        </Card>
      </Box>
    </>
  );
};

export default ProfilePage;