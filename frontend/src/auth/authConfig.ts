/**
 * Auth0 Configuration
 * Reads from Vite environment variables (VITE_AUTH0_*)
 * with fallback to localStorage for dynamic testing.
 */

const getStored = (key: string): string => {
  try {
    return typeof window !== "undefined" ? localStorage.getItem(key) || "" : "";
  } catch {
    return "";
  }
};

export const AUTH0_DOMAIN =
  import.meta.env.VITE_AUTH0_DOMAIN || getStored("3rdroute_auth0_domain") || "";
export const AUTH0_CLIENT_ID =
  import.meta.env.VITE_AUTH0_CLIENT_ID || getStored("3rdroute_auth0_client_id") || "";
export const AUTH0_AUDIENCE =
  import.meta.env.VITE_AUTH0_AUDIENCE || getStored("3rdroute_auth0_audience") || "";

export const isAuth0Configured = Boolean(
  AUTH0_DOMAIN &&
  AUTH0_CLIENT_ID &&
  !AUTH0_DOMAIN.includes("your-tenant") &&
  !AUTH0_CLIENT_ID.includes("your-client-id")
);

export const auth0Config = {
  domain: AUTH0_DOMAIN,
  clientId: AUTH0_CLIENT_ID,
  authorizationParams: {
    redirect_uri: typeof window !== "undefined" ? window.location.origin : "",
    ...(AUTH0_AUDIENCE ? { audience: AUTH0_AUDIENCE } : {}),
  },
};
