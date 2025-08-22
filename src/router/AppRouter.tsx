import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import AuthLayout from '../layouts/AuthLayout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import UserList from '../features/user/UserList';
import UserEdit from '../features/user/UserEdit';
import SignupWelcome from '../features/signup/pages/SignupWelcome';
import SignupFormPage from '../features/signup/pages/SignupFormPage';
import VerificationPage from '../features/signup/pages/VerificationPage';
import SetPasswordPage from '../features/signup/pages/SetPasswordPage';
import HandleSelectPage from '../features/signup/pages/HandleSelectPage';
import TermsPage from '../features/signup/pages/TermsPage';

import NotFound from '../pages/NotFound';
import RouteGuard from './RouteGuards';
import AdminConfig from '../pages/AdminConfig';

import Dashboard from '../features/dashboard/Dashboard';
import HomePage from '../features/home/pages/HomePage';
import NewPostPage from '../features/home/pages/NewPostPage';
import PostDetails from '../features/home/components/PostDetails';
import ProfilePage from '../features/home/pages/ProfilePage';
import SearchPage from '../features/home/components/SearchPage';
import NotificationsPage from '../features/home/components/NotificationsPage';
import CreatePollPage from '../features/poll/pages/CreatePollPage';
import ReportPostPage from '../features/home/pages/ReportPostPage';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
        <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/AdminConfig" element={<AuthLayout><AdminConfig/></AuthLayout>} />
        <Route path="/users" element={<RouteGuard><AppLayout><UserList /></AppLayout></RouteGuard>} />
        <Route path="/users/edit/:id" element={<RouteGuard><AppLayout><UserEdit /></AppLayout></RouteGuard>} />
        {/* Set the default route to login */}
        <Route path="/" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/signup" element={<SignupWelcome />} />
        <Route path="/signup_form" element={<AuthLayout><SignupFormPage /></AuthLayout>} />
        <Route path="/signup/verify" element={<AuthLayout><VerificationPage /></AuthLayout>} />
        <Route path="/signup/set-password" element={<AuthLayout><SetPasswordPage /></AuthLayout>} />
        <Route path="/signup/handle" element={<AuthLayout><HandleSelectPage /></AuthLayout>} />
        <Route path="/signup/terms" element={<AuthLayout><TermsPage /></AuthLayout>} />
        <Route path="/home" element={<AppLayout><HomePage /></AppLayout>} />
        <Route path="/lounges/:loungeId/new-post" element={<AppLayout><NewPostPage /></AppLayout>} />
        <Route
          path="/post/:postId" // Correct path for post details
          element={
            <AppLayout>
              <PostDetails /> {/* Render PostDetails without the posts prop */}
            </AppLayout>
          }
        />
        <Route path="/post/:postId/report" element={<AppLayout><ReportPostPage /></AppLayout>} />
        <Route path="/profile" element={<AppLayout><ProfilePage /></AppLayout>} />
        <Route path="/search" element={<AppLayout><SearchPage /></AppLayout>} />
        <Route path="/notifications" element={<AppLayout><NotificationsPage /></AppLayout>} />
        <Route path="/create/poll" element={<AppLayout><CreatePollPage /></AppLayout>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;