import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { TransactionsPage } from '../pages/TransactionsPage';
import { CategoriesPage } from '../pages/CategoriesPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { AIAssistantPage } from '../pages/AIAssistantPage';
import { ProfilePage } from '../pages/ProfilePage';
import { AuthPage } from '../pages/Authpage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />

      {/* Main App Layout (Protected Routes) */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/ai-hub" element={<AIAssistantPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Catch All Redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};