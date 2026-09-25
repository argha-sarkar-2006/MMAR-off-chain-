import React, { useState } from "react";
import { Phone, ArrowRight, Info, Shield, Check, Settings2, X } from "lucide-react";
import { useAppAuth } from "../auth/AuthContext";
import { isAuth0Configured, AUTH0_DOMAIN, AUTH0_CLIENT_ID } from "../auth/authConfig";
import { BrandLogo } from "../components/BrandLogo";

export const LoginPage: React.FC = () => {
  const { loginWithCredentials, loginWithSocial, loginWithRedirect, isLoading } = useAppAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // In-app Auth0 configuration modal state
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [tempDomain, setTempDomain] = useState(AUTH0_DOMAIN);
  const [tempClientId, setTempClientId] = useState(AUTH0_CLIENT_ID);
  const [tempAudience, setTempAudience] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg("Please enter an email address.");
      return;
    }
    setErrorMsg(null);
    try {
      await loginWithCredentials(email, password);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to authenticate.");
    }
  };

  const handleSocial = async (connection: string) => {
    setErrorMsg(null);
    try {
      await loginWithSocial(connection);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to authenticate with social provider.");
    }
  };

  const handleSaveAuth0 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempDomain || !tempClientId) {
      alert("Please provide both Auth0 Domain and Client ID.");
      return;
    }
    localStorage.setItem("3rdroute_auth0_domain", tempDomain.trim());
    localStorage.setItem("3rdroute_auth0_client_id", tempClientId.trim());
    if (tempAudience) {
      localStorage.setItem("3rdroute_auth0_audience", tempAudience.trim());
    }
    window.location.reload();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#ffffff",
        fontFamily: "var(--font-sans)",
        position: "relative",
      }}
    >
      {/* Top Left Branding matching 2nd.png with logo.png */}
      <header
        style={{
          padding: "20px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <BrandLogo size="md" />

        {/* Auth0 Status & Setup Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {isAuth0Configured ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 12px",
                borderRadius: "9999px",
                backgroundColor: "#f0fdf4",
                border: "1px solid #bbf7d0",
                color: "#166534",
                fontSize: "0.75rem",
                fontWeight: 500,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: "#16a34a",
                }}
              />
              <span>Auth0 Active</span>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 12px",
                borderRadius: "9999px",
                backgroundColor: "#fef3c7",
                border: "1px solid #fde68a",
                color: "#92400e",
                fontSize: "0.75rem",
                fontWeight: 500,
              }}
            >
              <Info size={14} />
              <span>Local Offline Mode</span>
            </div>
          )}

          <button
            onClick={() => setShowConfigModal(true)}
            title="Configure Auth0 Settings"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 12px",
              borderRadius: "8px",
              backgroundColor: "#f8fafc",
              border: "1px solid var(--border-subtle)",
              fontSize: "0.75rem",
              fontWeight: 500,
              color: "var(--text-secondary)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f1f5f9")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
          >
            <Settings2 size={14} />
            <span>Configure Auth0</span>
          </button>
        </div>
      </header>

      {/* Main Centered Authentication Form matching 2nd.png */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <div
          className="animate-fade-in"
          style={{
            width: "100%",
            maxWidth: "380px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Centered Main Brand Logo */}
          <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center" }}>
            <BrandLogo size="xl" showWordmark={false} />
          </div>

          {/* Form Title */}
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 600,
              color: "#000000",
              marginBottom: "28px",
              textAlign: "center",
            }}
          >
            {isSignUp ? "Create an account" : "Log in"}
          </h1>

          {errorMsg && (
            <div
              style={{
                width: "100%",
                padding: "10px 14px",
                marginBottom: "16px",
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                color: "#b91c1c",
                fontSize: "0.8125rem",
                textAlign: "center",
              }}
            >
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "10px",
                backgroundColor: "#f3f4f6",
                border: "1px solid transparent",
                fontSize: "0.9375rem",
                color: "#1e293b",
                transition: "all 0.15s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.borderColor = "#94a3b8";
              }}
              onBlur={(e) => {
                if (!e.currentTarget.value) {
                  e.currentTarget.style.backgroundColor = "#f3f4f6";
                  e.currentTarget.style.borderColor = "transparent";
                }
              }}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "10px",
                backgroundColor: "#f3f4f6",
                border: "1px solid transparent",
                fontSize: "0.9375rem",
                color: "#1e293b",
                transition: "all 0.15s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.borderColor = "#94a3b8";
              }}
              onBlur={(e) => {
                if (!e.currentTarget.value) {
                  e.currentTarget.style.backgroundColor = "#f3f4f6";
                  e.currentTarget.style.borderColor = "transparent";
                }
              }}
            />

            {/* Black Solid Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                backgroundColor: "#000000",
                color: "#ffffff",
                fontSize: "0.9375rem",
                fontWeight: 600,
                marginTop: "4px",
                cursor: "pointer",
                transition: "opacity 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              {isLoading
                ? "Connecting..."
                : isAuth0Configured
                ? isSignUp
                  ? "Sign up with Auth0"
                  : "Log in with Auth0"
                : isSignUp
                ? "Sign up"
                : "Log in"}
            </button>
          </form>

          {/* Sub Navigation Links matching 2nd.png */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "14px",
              marginTop: "16px",
              fontSize: "0.8125rem",
            }}
          >
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              style={{ color: "#6366f1", fontWeight: 500 }}
            >
              {isSignUp ? "Log In" : "Sign Up"}
            </button>
            <span style={{ color: "#cbd5e1" }}>•</span>
            <button
              onClick={() => alert("Password reset instructions are managed via your Auth0 dashboard.")}
              style={{ color: "#6366f1", fontWeight: 500 }}
            >
              Forgot Password
            </button>
            <span style={{ color: "#cbd5e1" }}>•</span>
            <button
              onClick={() => alert("For support, please consult the 3rd-Route documentation.")}
              style={{ color: "#6366f1", fontWeight: 500 }}
            >
              Contact Us
            </button>
          </div>

          {/* Divider matching 2nd.png */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              margin: "24px 0",
            }}
          >
            <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }} />
            <span style={{ padding: "0 12px", fontSize: "0.8125rem", color: "#64748b" }}>or</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }} />
          </div>

          {/* Social Login Buttons matching 2nd.png */}
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
            {/* Google */}
            <button
              onClick={() => handleSocial("google-oauth2")}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "10px",
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#1e293b",
                transition: "background-color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isSignUp ? "Sign up with Google" : "Log in with Google"}</span>
            </button>

            {/* Microsoft */}
            <button
              onClick={() => handleSocial("windowslive")}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "10px",
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#1e293b",
                transition: "background-color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
            >
              <svg width="18" height="18" viewBox="0 0 21 21">
                <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
              </svg>
              <span>{isSignUp ? "Sign up with Microsoft" : "Log in with Microsoft"}</span>
            </button>

            {/* Apple */}
            <button
              onClick={() => handleSocial("apple")}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "10px",
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#1e293b",
                transition: "background-color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
            >
              <svg width="18" height="18" viewBox="0 0 170 170">
                <path
                  fill="#000000"
                  d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.74-7.95-12.14-14.6-6.85-10.35-12.03-22.18-15.53-35.48-3.5-13.3-5.26-25.7-5.26-37.2 0-14.9 3.86-27.18 11.58-36.83 7.73-9.66 17.51-14.54 29.35-14.65 4.8 0 10.15 1.25 16.06 3.75 5.91 2.5 9.77 3.8 11.58 3.92 1.34-.12 5.48-1.54 12.42-4.25 6.94-2.72 12.57-3.9 16.89-3.56 12.83.62 23.3 5.45 31.42 14.5-11.2 6.8-16.7 16.3-16.5 28.5.2 9.6 3.9 17.6 11.1 23.9 7.2 6.3 15.6 9.9 25.2 10.7-2.3 6.9-5.1 13.8-8.5 20.8zM119.22 33.15c0-7.3 2.6-14.1 7.8-20.4 5.2-6.3 11.6-10.5 19.2-12.7.2 1.2.3 2.3.3 3.3 0 7.3-2.7 14.2-8.1 20.7-5.4 6.5-11.8 10.4-19.2 11.7z"
                />
              </svg>
              <span>{isSignUp ? "Sign up with Apple" : "Log in with Apple"}</span>
            </button>

            {/* Phone */}
            <button
              onClick={() => handleSocial("sms")}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "10px",
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#1e293b",
                transition: "background-color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
            >
              <Phone size={18} color="#000000" />
              <span>{isSignUp ? "Sign up with Phone" : "Log in with Phone"}</span>
            </button>
          </div>

          {/* Quick Local Demo Option */}
          <div style={{ marginTop: "24px", width: "100%", textAlign: "center" }}>
            <button
              onClick={() => loginWithRedirect()}
              style={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--accent-cyan)",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>Instant Local Demo Login</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </main>

      {/* Auth0 Configuration Modal */}
      {showConfigModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.4)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "16px",
          }}
          onClick={() => setShowConfigModal(false)}
        >
          <div
            className="animate-fade-in"
            style={{
              width: "100%",
              maxWidth: "500px",
              backgroundColor: "#ffffff",
              borderRadius: "var(--radius-xl)",
              boxShadow: "var(--shadow-lg)",
              border: "1px solid var(--border-subtle)",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--border-subtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Shield size={18} color="var(--accent-cyan)" />
                <span style={{ fontSize: "0.9375rem", fontWeight: 700 }}>
                  Configure Auth0 Authentication
                </span>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                style={{ padding: "4px", color: "var(--text-muted)" }}
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleSaveAuth0}
              style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    marginBottom: "4px",
                    color: "var(--text-secondary)",
                  }}
                >
                  Auth0 Domain
                </label>
                <input
                  type="text"
                  placeholder="e.g. dev-xyz.us.auth0.com"
                  value={tempDomain}
                  onChange={(e) => setTempDomain(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-subtle)",
                    fontSize: "0.875rem",
                  }}
                  required
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    marginBottom: "4px",
                    color: "var(--text-secondary)",
                  }}
                >
                  Auth0 Client ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. 7qXyZ..."
                  value={tempClientId}
                  onChange={(e) => setTempClientId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-subtle)",
                    fontSize: "0.875rem",
                  }}
                  required
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    marginBottom: "4px",
                    color: "var(--text-secondary)",
                  }}
                >
                  Auth0 API Audience (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://api.3rd-route.local"
                  value={tempAudience}
                  onChange={(e) => setTempAudience(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-subtle)",
                    fontSize: "0.875rem",
                  }}
                />
              </div>

              <div
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  backgroundColor: "#f8fafc",
                  border: "1px solid var(--border-subtle)",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.4,
                }}
              >
                In your Auth0 Dashboard (Application Settings), ensure these are set:
                <br />• <strong>Allowed Callback URLs:</strong> <code>http://localhost:5173</code>
                <br />• <strong>Allowed Logout URLs:</strong> <code>http://localhost:5173</code>
                <br />• <strong>Allowed Web Origins:</strong> <code>http://localhost:5173</code>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "6px" }}>
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    backgroundColor: "#f1f5f9",
                    color: "var(--text-secondary)",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    backgroundColor: "var(--accent-cyan)",
                    color: "#ffffff",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Check size={14} />
                  <span>Save & Reload</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer matching 2nd.png */}
      <footer
        style={{
          padding: "20px 32px 28px 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          fontSize: "0.75rem",
          color: "#94a3b8",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <a href="#" style={{ color: "#64748b", textDecoration: "none" }}>
            Terms of Use
          </a>
          <span>|</span>
          <a href="#" style={{ color: "#64748b", textDecoration: "none" }}>
            Privacy Policy
          </a>
        </div>
        <div>© 2026 3rd-Route</div>
      </footer>
    </div>
  );
};
