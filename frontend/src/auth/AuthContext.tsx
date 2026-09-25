import React, { createContext, useContext, useState } from "react";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { auth0Config, isAuth0Configured } from "./authConfig";

export interface AuthUser {
  name?: string;
  email?: string;
  picture?: string;
  sub?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  loginWithRedirect: (options?: Record<string, unknown>) => Promise<void>;
  loginWithCredentials: (email: string, password?: string) => Promise<void>;
  loginWithSocial: (connection: string) => Promise<void>;
  logout: () => void;
  getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local fallback provider when Auth0 credentials are not yet configured in .env
const LocalAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem("3rdroute_local_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const loginWithRedirect = async (options?: Record<string, unknown>) => {
    setIsLoading(true);
    // Simulated login for local offline testing when no Auth0 keys are configured
    const mockUser: AuthUser = {
      name: "Local User",
      email: (options?.login_hint as string) || "user@3rdroute.local",
      picture: "https://api.dicebear.com/7.x/bottts/svg?seed=3rdRoute",
      sub: "local|123456",
    };
    localStorage.setItem("3rdroute_local_user", JSON.stringify(mockUser));
    setUser(mockUser);
    setIsLoading(false);
  };

  const loginWithCredentials = async (email: string) => {
    setIsLoading(true);
    const mockUser: AuthUser = {
      name: email.split("@")[0] || "User",
      email,
      picture: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
      sub: `local|${Date.now()}`,
    };
    localStorage.setItem("3rdroute_local_user", JSON.stringify(mockUser));
    setUser(mockUser);
    setIsLoading(false);
  };

  const loginWithSocial = async (connection: string) => {
    setIsLoading(true);
    const providerName = connection.replace("-oauth2", "");
    const mockUser: AuthUser = {
      name: `${providerName.toUpperCase()} User`,
      email: `user@${providerName}.com`,
      picture: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(providerName)}`,
      sub: `${connection}|${Date.now()}`,
    };
    localStorage.setItem("3rdroute_local_user", JSON.stringify(mockUser));
    setUser(mockUser);
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("3rdroute_local_user");
    setUser(null);
  };

  const getAccessToken = async () => {
    return "demo_access_token_3rd_route";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        isConfigured: false,
        loginWithRedirect,
        loginWithCredentials,
        loginWithSocial,
        logout,
        getAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Real Auth0 wrapper component
const Auth0InnerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth0 = useAuth0();

  const loginWithRedirect = async (options?: Record<string, unknown>) => {
    await auth0.loginWithRedirect(options);
  };

  const loginWithCredentials = async (email: string) => {
    // When using Auth0, forward email as login_hint to Auth0 Universal Login
    await auth0.loginWithRedirect({
      authorizationParams: {
        login_hint: email,
      },
    });
  };

  const loginWithSocial = async (connection: string) => {
    await auth0.loginWithRedirect({
      authorizationParams: {
        connection,
      },
    });
  };

  const logout = () => {
    auth0.logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  const getAccessToken = async (): Promise<string | null> => {
    try {
      if (auth0.isAuthenticated) {
        const token = await auth0.getAccessTokenSilently();
        return token ?? null;
      }
      return null;
    } catch {
      return null;
    }
  };

  const formattedUser: AuthUser | null = auth0.user
    ? {
        name: auth0.user.name,
        email: auth0.user.email,
        picture: auth0.user.picture,
        sub: auth0.user.sub,
      }
    : null;

  return (
    <AuthContext.Provider
      value={{
        user: formattedUser,
        isAuthenticated: auth0.isAuthenticated,
        isLoading: auth0.isLoading,
        isConfigured: true,
        loginWithRedirect,
        loginWithCredentials,
        loginWithSocial,
        logout,
        getAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const CustomAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  if (isAuth0Configured) {
    return (
      <Auth0Provider
        domain={auth0Config.domain}
        clientId={auth0Config.clientId}
        authorizationParams={auth0Config.authorizationParams}
      >
        <Auth0InnerProvider>{children}</Auth0InnerProvider>
      </Auth0Provider>
    );
  }

  return <LocalAuthProvider>{children}</LocalAuthProvider>;
};

export const useAppAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAppAuth must be used within CustomAuthProvider");
  }
  return context;
};
