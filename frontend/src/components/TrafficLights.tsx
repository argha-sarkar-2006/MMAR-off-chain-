import React from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

interface TrafficLightsProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const TrafficLights: React.FC<TrafficLightsProps> = ({
  onToggleSidebar,
  isSidebarOpen = true,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "14px 16px 8px 16px",
      }}
    >

      {onToggleSidebar && (
        <button
          onClick={onToggleSidebar}
          title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          style={{
            padding: "4px",
            borderRadius: "6px",
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--sidebar-hover)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </button>
      )}
    </div>
  );
};
