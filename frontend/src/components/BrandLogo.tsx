import React from "react";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showWordmark?: boolean;
  subtitle?: string;
  className?: string;
}

/**
 * Original bespoke brand mark for 3rd-Route.
 * Inspired by the "3 RD router" reference, reimagined into a modern,
 * vector-native emblem representing 3 intelligent routing pathways:
 * (1) Vision, (2) Reasoning, (3) Coding.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = "md",
  showWordmark = true,
  subtitle,
  className = "",
}) => {
  const pixelSizes = {
    sm: 24,
    md: 32,
    lg: 48,
    xl: 64,
  };

  const dim = pixelSizes[size];

  return (
    <div
      className={`brand-logo-container ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size === "sm" ? "8px" : size === "md" ? "10px" : "14px",
        userSelect: "none",
      }}
    >
      {/* Bespoke Vector Mark */}
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, borderRadius: "10px" }}
      >
        <defs>
          {/* Subtle modern dark gradient */}
          <linearGradient id="bgGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#090d16" />
            <stop offset="1" stopColor="#1e293b" />
          </linearGradient>

          {/* Three routing pathways gradient */}
          <linearGradient id="routeCyan" x1="16" y1="12" x2="38" y2="12" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38bdf8" />
            <stop offset="1" stopColor="#0ea5e9" />
          </linearGradient>
          <linearGradient id="routeIndigo" x1="16" y1="24" x2="38" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#818cf8" />
            <stop offset="1" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="routeEmerald" x1="16" y1="36" x2="38" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#34d399" />
            <stop offset="1" stopColor="#10b981" />
          </linearGradient>
        </defs>

        {/* Squircle Badge Background */}
        <rect
          width="48"
          height="48"
          rx="12"
          fill="url(#bgGrad)"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="1.5"
        />

        {/* Stylized Modern "3" Spine with Routing nodes */}
        {/* Top arc of 3 flowing into Route 1 */}
        <path
          d="M 14 14 C 14 11 20 10 26 12 C 30 13.5 31 17 28 20 C 25 23 21 24 21 24"
          stroke="#ffffff"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Bottom arc of 3 flowing into Route 3 */}
        <path
          d="M 21 24 C 23 24 28 24.5 31 28 C 33 31.5 30 36 25 37 C 18 38 14 35 14 32"
          stroke="#ffffff"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 3 Pathway Router Nodes inspired by "RD router" */}
        {/* Route 1: Top (Vision / Cyan) */}
        <circle cx="37" cy="13" r="3" fill="url(#routeCyan)" />
        <line x1="29" y1="13" x2="34" y2="13" stroke="url(#routeCyan)" strokeWidth="2" strokeDasharray="2 2" />

        {/* Route 2: Mid (Reasoning / Indigo) */}
        <circle cx="37" cy="24" r="3" fill="url(#routeIndigo)" />
        <line x1="22" y1="24" x2="34" y2="24" stroke="url(#routeIndigo)" strokeWidth="2" strokeDasharray="2 2" />

        {/* Route 3: Bottom (Coding / Emerald) */}
        <circle cx="37" cy="35" r="3" fill="url(#routeEmerald)" />
        <line x1="28" y1="35" x2="34" y2="35" stroke="url(#routeEmerald)" strokeWidth="2" strokeDasharray="2 2" />
      </svg>

      {/* Wordmark */}
      {showWordmark && (
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "4px",
              lineHeight: 1.1,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: size === "sm" ? "0.875rem" : size === "md" ? "1rem" : size === "lg" ? "1.25rem" : "1.5rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                letterSpacing: "-0.03em",
              }}
            >
              3rd-Route
            </span>
            <span
              style={{
                fontSize: "0.625rem",
                fontWeight: 600,
                color: "var(--accent-cyan)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                padding: "1px 4px",
                borderRadius: "4px",
                backgroundColor: "rgba(14, 165, 233, 0.08)",
                border: "1px solid rgba(14, 165, 233, 0.2)",
              }}
            >
              router
            </span>
          </div>

          {subtitle && (
            <span
              style={{
                fontSize: "0.6875rem",
                color: "var(--text-muted)",
                marginTop: "2px",
                letterSpacing: "-0.01em",
              }}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
