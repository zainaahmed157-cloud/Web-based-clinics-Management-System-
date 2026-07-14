import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

function normalizeAuthResponse(authData) {
  if (!authData) return authData;

  // Unwrap nested data
  let current = authData;
  while (current && current.data && typeof current.data === 'object' && !Array.isArray(current.data)) {
    current = current.data;
  }

  const token = current.token || current.access_token || current.accessToken || current.access || authData.token || authData.access_token || authData.accessToken || authData.access;

  const targetUser = current.user || authData.user || current;
  const status = current.status || authData.status || '';

  if ((status === 'success' || targetUser.user_id || targetUser.id) && targetUser && targetUser !== authData) {
    const backendUser = targetUser;
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

const setTokenCookie = (token) => {
  if (token) {
    document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
    document.cookie = `jwt=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
  }
};

const clearTokenCookie = () => {
  document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  document.cookie = `jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  document.cookie = `auth_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  document.cookie = `refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = useCallback(async (tokenFromRefresh) => {
    try {
      const response = await axiosInstance.get('/api/user/me');
      const result = response.data;
      let authData;
      if (result.success && result.data) {
        authData = normalizeAuthResponse(result.data);
      } else if (result.user) {
         authData = normalizeAuthResponse({ status: 'success', user: result.user });
      } else {
         authData = normalizeAuthResponse(result);
      }
      
      const finalToken = tokenFromRefresh || authData.token;
      if (finalToken) {
        authData.token = finalToken;
        setTokenCookie(finalToken);
      }
      
      setUser(authData);
    } catch (err) {
      // Not authenticated
      setUser(null);
      clearTokenCookie();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1. Clear any leftover localStorage data from earlier attempts
    localStorage.removeItem('user');

    // Medaura uses /api/auth/refresh to handle initial session load. 
    // It refreshes token and then checks auth.
    let cancelled = false;

    if (localStorage.getItem('explicitlyLoggedOut') === 'true') {
      clearTokenCookie();
      setLoading(false);
      return;
    }

    const refreshPromise = axiosInstance.post('/api/auth/refresh')
      .then((res) => res.data)
      .catch(() => null);

    refreshPromise.then((result) => {
      if (!cancelled) {
        if (result && (result.success || result.status === 'success')) {
          const data = result.data || result;
          const token = data.token || data.access_token || data.accessToken || data.access;
          checkAuth(token);
        } else {
          clearTokenCookie();
          setLoading(false);
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [checkAuth]);

  const saveAuth = useCallback((authData) => {
    localStorage.removeItem('explicitlyLoggedOut');
    setUser(authData);
    setError(null);
    if (authData?.token) {
      setTokenCookie(authData.token);
    }
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.setItem('explicitlyLoggedOut', 'true');
    setUser(null);
    setError(null);
    clearTokenCookie();
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
      clearTokenCookie();
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
