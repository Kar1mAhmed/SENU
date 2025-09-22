// Authentication hook for dashboard
'use client';
import { useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api-client';
import { DashboardAuth } from '../types';

console.log('🔐 Auth hook loaded - ready to manage authentication like a security guard!');

const AUTH_STORAGE_KEY = 'senu_dashboard_auth';

export function useAuth() {
  const [auth, setAuth] = useState<DashboardAuth>({
    isAuthenticated: false,
    expiresAt: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load auth from localStorage on mount
  useEffect(() => {
    console.log('🔍 Checking stored authentication...');
    
    const checkStoredAuth = async () => {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const storedAuth: DashboardAuth = JSON.parse(stored);
          
          // Check if token is still valid
          if (storedAuth.expiresAt > Date.now()) {
            console.log('✅ Found valid stored auth, expires:', new Date(storedAuth.expiresAt).toISOString());
            setAuth(storedAuth);
          } else {
            console.log('⏰ Stored auth expired, clearing...');
            localStorage.removeItem(AUTH_STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error('❌ Error loading stored auth:', error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    };

    checkStoredAuth();
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    console.log('🔑 Attempting login for user:', username.substring(0, 3) + '***');
    
    setLoading(true);
    setError(null);

    try {
      const authData = await authAPI.login(username, password);
      
      console.log('🎉 Login successful, expires:', new Date(authData.expiresAt).toISOString());
      
      setAuth(authData);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      console.error('❌ Login failed:', errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    console.log('👋 Logging out user...');
    
    setLoading(true);
    
    try {
      await authAPI.logout();
    } catch (error) {
      console.warn('⚠️ Logout API call failed:', error);
    }

    // Clear local state and storage regardless of API call result
    setAuth({ isAuthenticated: false, expiresAt: 0 });
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setError(null);
    setLoading(false);
    
    console.log('✅ User logged out successfully');
  }, []);

  const checkAuth = useCallback(async (): Promise<boolean> => {
    console.log('🔍 Checking authentication status...');
    
    try {
      const token = auth.expiresAt.toString();
      const authData = await authAPI.checkAuth(token);
      
      if (authData.isAuthenticated !== auth.isAuthenticated) {
        console.log('🔄 Auth status changed:', authData.isAuthenticated);
        setAuth(authData);
        
        if (authData.isAuthenticated) {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
        } else {
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      }
      
      return authData.isAuthenticated;
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      return false;
    }
  }, [auth.expiresAt, auth.isAuthenticated]);

  // Auto-check auth periodically
  useEffect(() => {
    if (!auth.isAuthenticated) return;

    const interval = setInterval(() => {
      // Check if token is about to expire (within 5 minutes)
      const fiveMinutes = 5 * 60 * 1000;
      if (auth.expiresAt - Date.now() < fiveMinutes) {
        console.log('⏰ Token expiring soon, checking auth...');
        checkAuth();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [auth.isAuthenticated, auth.expiresAt, checkAuth]);

  return {
    auth,
    loading,
    error,
    login,
    logout,
    checkAuth,
    isAuthenticated: auth.isAuthenticated,
    expiresAt: auth.expiresAt
  };
}
