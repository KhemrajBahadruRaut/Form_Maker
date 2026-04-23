import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_BASE = 'https://jotform.gr8.com.np/GR8_JOTFORM/Backend';
// const API_BASE = 'http://localhost/GR8_JOTFORM/Backend';

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check localStorage on mount (no backend session check needed)
  useEffect(() => {
    const storedLoggedIn = localStorage.getItem('adminLoggedIn');
    const storedUsername = localStorage.getItem('adminUsername');
    if (storedLoggedIn === 'true' && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
    setLoading(false);
  }, []);

  const login = async (usernameInput, password) => {
    const res = await fetch(`${API_BASE}/login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: usernameInput, password }),
    });
    const data = await res.json();
    if (data.success) {
      setIsLoggedIn(true);
      setUsername(data.username);
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('adminUsername', data.username);
      return { success: true };
    } else {
      return { success: false, error: data.error };
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername(null);
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUsername');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
