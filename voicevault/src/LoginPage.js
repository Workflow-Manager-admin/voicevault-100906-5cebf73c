import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import "./App.css";

// PUBLIC_INTERFACE
// Login UI for email/password and social login (mocked)
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  // Handle mock email login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setPending(true);
    try {
      if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
        setError("Please enter a valid email.");
        setPending(false);
        return;
      }
      await login({ email });
    } catch (e) {
      setError("Login failed.");
    }
    setPending(false);
  };

  // Handle mock social login
  const handleSocialLogin = async (provider) => {
    setError("");
    setPending(true);
    try {
      await login({ provider });
    } catch (e) {
      setError("Social login failed");
    }
    setPending(false);
  };

  return (
    <div className="container" style={{ marginTop: 110, maxWidth: 390 }}>
      <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 3px 12px #eee", padding: 32 }}>
        <h2 className="vault-title" style={{ color: "#1976D2" }}>
          VoiceVault
        </h2>
        <div className="subtitle" style={{ color: "#E87A41", marginBottom: 18 }}>Sign In</div>
        <form onSubmit={handleEmailLogin} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input
            key="emailinput"
            type="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            style={{
              fontSize: "1rem",
              padding: "9px 12px",
              borderRadius: 5,
              border: "1px solid #eee"
            }}
            disabled={pending}
          />
          <button type="submit" className="btn btn-large" disabled={pending} style={{ marginTop: 8 }}>
            {pending ? "Signing in..." : "Sign in with Email"}
          </button>
        </form>
        <div style={{ textAlign: "center", margin: "18px 0 6px 0", fontWeight: 500, color: "#555" }}>or</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            className="btn"
            style={{ background: "#FF4A4A", color: "#fff" }}
            disabled={pending}
            onClick={() => handleSocialLogin("Google")}
          >
            <span style={{ fontWeight: 700, marginRight: 5 }}>G</span> Sign in with Google
          </button>
          <button
            className="btn"
            style={{ background: "#333", color: "#fff" }}
            disabled={pending}
            onClick={() => handleSocialLogin("GitHub")}
          >
            <span style={{ fontWeight: 700, marginRight: 5 }}>GH</span> Sign in with GitHub
          </button>
        </div>
        {error && <div className="error" style={{ marginTop: 12 }}>{error}</div>}
      </div>
    </div>
  );
}
