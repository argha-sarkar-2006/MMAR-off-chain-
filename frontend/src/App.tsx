import React from "react";
import { CustomAuthProvider, useAppAuth } from "./auth/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { ChatPage } from "./pages/ChatPage";
import { Sparkles } from "lucide-react";

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAppAuth();

  if (isLoading) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          gap: "16px",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            backgroundColor: "#000000",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="animate-pulse"
        >
          <Sparkles size={24} />
        </div>
        <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)" }}>
          Loading 3rd-Route Workbench...
        </div>
      </div>
    );
  }

  return isAuthenticated ? <ChatPage /> : <LoginPage />;
};

export const App: React.FC = () => {
  return (
    <CustomAuthProvider>
      <AppContent />
    </CustomAuthProvider>
  );
};

export default App;
