import api from '../../../services/api';

export interface ReportPostPayload {
  handle: string;
  reason: string;
  details?: string;
}

export const reportPost = async (postId: number, payload: ReportPostPayload) => {
  return api.post(`/auth/posts/${postId}/report`, payload);
};