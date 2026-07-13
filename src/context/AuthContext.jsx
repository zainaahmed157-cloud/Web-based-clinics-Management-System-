import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

function normalizeAuthResponse(authData) {
  const token = authData.token || authData.access_token || authData.accessToken || authData.access;

  if (authData.status === 'success' && authData.user) {
    const backendUser = authData.user;
    return {
      id: backendUser.user_id || backendUser.id,
      email: backendUser.email,
      user_type: backendUser.role || backendUser.user_type,
      profile: backendUser.profile,
      token,
      ...(typeof backendUser.photo === 'string' ? { photo: backendUser.photo } : {}),
      name: backendUser.profile?.full_name || backendUser.profile?.name || backendUser.name || backendUser.full_name || '',
    };
  }

  return {
    ...authData,
    token,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/user/me');
      const result = response.data;
      if (result.success && result.data) {
        setUser(normalizeAuthResponse(result.data));
      } else if (result.user) {
         setUser(normalizeAuthResponse({ status: 'success', user: result.user }));
      } else {
         setUser(normalizeAuthResponse(result));
      }
    } catch (err) {
      // Not authenticated
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1. Clear any leftover localStorage data from earlier attempts
    localStorage.removeItem('user');
    
    // 2. Clear any custom cookies created in earlier attempts
    document.cookie = `auth_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

    // Medaura uses /api/auth/refresh to handle initial session load. 
    // It refreshes token and then checks auth.
    let cancelled = false;

    const refreshPromise = axiosInstance.post('/api/auth/refresh')
      .then((res) => true)
      .catch(() => false);

    refreshPromise.then((isSuccess) => {
      if (!cancelled) {
        if (isSuccess) {
          checkAuth();
        } else {
          setLoading(false);
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [checkAuth]);

  const saveAuth = useCallback((authData) => {
    setUser(authData);
    setError(null);
  }, []);

  const clearAuth = useCallback(() => {
    setUser(null);
    setError(null);
  }, []);

  const login = useCallback(
    async (email, password) => {
      try {
        setError(null);
        const response = await axiosInstance.post('/api/auth/login', { email, password });
        const result = response.data;
        
        let authData;
        if (result.success && result.data) {
          authData = normalizeAuthResponse(result.data);
        } else if (result.status === 'success' && result.user) {
          authData = normalizeAuthResponse(result);
        } else {
           // Fallback for simple responses
           authData = normalizeAuthResponse(result);
        }
        
        saveAuth(authData);
        return authData;
      } catch (err) {
        const authError = err instanceof Error ? err : new Error('Login failed');
        setError(authError);
        throw authError;
      }
    },
    [saveAuth]
  );

  const register = useCallback(
    async (payload) => {
      try {
        setError(null);
        const response = await axiosInstance.post('/api/auth/signup', payload);
        const result = response.data;
        
        let authData;
        if (result.success && result.data) {
          authData = normalizeAuthResponse(result.data);
        } else if (result.status === 'success' && result.user) {
          authData = normalizeAuthResponse(result);
        } else {
           authData = normalizeAuthResponse(result);
        }
        
        saveAuth(authData);
        return authData;
      } catch (err) {
        const authError = err instanceof Error ? err : new Error('Signup failed');
        setError(authError);
        throw authError;
      }
    },
    [saveAuth]
  );

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await axiosInstance.post('/api/auth/logout');
    } catch (err) {
      // Even if logout fails, clear local state
    } finally {
      clearAuth();
      setLoading(false);
    }
  }, [clearAuth]);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      isAuthenticated: Boolean(user),
      login,
      register, // Map to register to match old component expectations
      logout,
    }),
    [error, loading, login, logout, register, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
