import api from '../../../services/api';

export const fetchLounges = () => api.get('/auth/colleges');
export const fetchPosts = (loungeId: number | null = null) => api.get(`/auth/lounges/${loungeId}/posts`);
export const createPost = (loungeId: number, data: any) =>
  api.post(`/auth/lounges/${loungeId}/posts`, data);

export const likePost = (postId: number) => api.post(`/auth/posts/${postId}/like`);
export const commentPost = (postId: number) => api.post(`/auth/posts/${postId}/comment`);
export const viewPost = (postId: number) => api.post(`/auth/posts/${postId}/view`);

export const fetchComments = (postId: number) =>
  api.get(`/auth/posts/${postId}/comments`);

export const addComment = (
  postId: number,
  content: string,
  handle: string,
  parentId?: number | null
) =>
  api.post(`/auth/posts/${postId}/comments`, { content, handle, parentId });

export const dislikePost = (postId: number) => api.post(`/auth/posts/${postId}/dislike`);

export const savePost = (postId: number, handle: string) =>
  api.post(`/auth/posts/${postId}/save`, { handle });
export const unsavePost = (postId: number, handle: string) =>
api.post(`/auth/posts/${postId}/unsave`, { handle });

export const likeComment = (commentId: number) => api.post(`/auth/comments/${commentId}/like`);

export const dislikeComment = (commentId: number) =>
  api.post(`/auth/comments/${commentId}/dislike`);

export const viewComment = (commentId: number) => api.post(`/auth/comments/${commentId}/view`);

export const fetchSavedPosts = (handle: string) =>
  api.get(`/auth/users/${handle}/saved-posts`);

export const updatePost = (postId: number, data: any) =>
  api.put(`/auth/posts/${postId}`, data);