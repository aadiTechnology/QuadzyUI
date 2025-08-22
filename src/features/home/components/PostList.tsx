import React from 'react';
import PostCard, { Post } from './PostCard';
import { Box } from '@mui/material';

interface PostListProps {
  posts: Post[];
  onLike?: (postId: number) => void;
  onDislike?: (postId: number) => void;
  onComment?: (postId: number) => void;
  onView?: (postId: number) => void;
  onSaveToggle?: (postId: number, saved: boolean) => void;
  onClickPost?: (postId: number) => void;
  tabIndex?: number; // <-- Add this line
}

const PostList: React.FC<PostListProps> = ({ posts, onLike, onDislike, onComment, onView, onSaveToggle, onClickPost, tabIndex }) => (
  <>
    {posts.map(post => (
      <PostCard
        key={post.id}
        post={post}
        onLike={onLike}
        onDislike={onDislike}
        onComment={onComment}
        onView={onView}
        onSaveToggle={onSaveToggle}
        onClickPost={onClickPost ? (p => onClickPost(p.id)) : undefined}
        tabIndex={tabIndex} // <-- Add this line
      />
    ))}
  </>
);

export default PostList;