// src/components/auth/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/auth.context'; // مسار الـ AuthContext لديك

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // في حال تحميل حالة التوكن من الـ LocalStorage
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-sm font-semibold">Loading...</p>
      </div>
    );
  }

  // إذا كان مسجلاً، اترك المسار يفتح، وإلا وجهه لـ /login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};