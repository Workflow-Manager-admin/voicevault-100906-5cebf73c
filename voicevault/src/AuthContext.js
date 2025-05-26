import React, { createContext, useContext, useState, useEffect } from "react";

// PUBLIC_INTERFACE
// User Authentication Context and Provider for app-wide state.
// Mocked login/logout supporting email and social providers.
// Also persists session in localStorage.

const AuthContext = createContext();

const AUTH_USER_KEY = "voicevault-auth-user";

// Returns a promise to simulate async login (mock)
function mockSignIn({ email, provider }) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (provider) {
        // e.g. Google, GitHub
        resolve({
          id: `${provider.toLowerCase()}-id-${email || "anon"}`,
          name: provider === "Google" ? "Google User" : provider === "GitHub" ? "Octocat" : "Jane Doe",
          email: email || `${provider.toLowerCase()}_user@mock.com`,
          avatarUrl:
            provider === "Google"
              ? "https://i.pravatar.cc/150?img=12"
              : provider === "GitHub"
              ? "https://i.pravatar.cc/150?img=3"
              : "https://i.pravatar.cc/150?img=8",
          provider,
        });
      } else {
        // email sign in
        resolve({
          id: `email-${email}`,
          name: email.split("@")[0] || "User",
          email,
          avatarUrl: "https://i.pravatar.cc/150?img=5",
          provider: "email",
        });
      }
    }, 600);
  });
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load session from localStorage
  useEffect(() => {
    const u = localStorage.getItem(AUTH_USER_KEY);
    if (u) setUser(JSON.parse(u));
  }, []);

  // Save user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }, [user]);

  // PUBLIC_INTERFACE
  const login = async ({ email, provider }) => {
    const u = await mockSignIn({ email, provider });
    setUser(u);
  };

  // PUBLIC_INTERFACE
  const logout = () => {
    setUser(null);
  };

  // PUBLIC_INTERFACE
  return (
    <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useAuth() {
  return useContext(AuthContext);
}
