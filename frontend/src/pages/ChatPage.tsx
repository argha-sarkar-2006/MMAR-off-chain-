import React, { useState, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { ChatArea } from "../components/ChatArea";
import { HubModal } from "../components/HubModal";
import { KnowledgeModal } from "../components/KnowledgeModal";
import { SettingsModal } from "../components/SettingsModal";
import { useChat } from "../hooks/useChat";

export const ChatPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isHubOpen, setIsHubOpen] = useState(false);
  const [isKnowledgeOpen, setIsKnowledgeOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<string | null>(null);

  const {
    conversations,
    activeChatId,
    messages,
    isLoading,
    activeStage,
    useWeb,
    toggleWeb,
    backendStatus,
    isConnected,
    checkStatus,
    setActiveChatId,
    createNewChat,
    deleteChat,
    clearAllChats,
    sendMessage,
  } = useChat();

  // Keyboard shortcuts matching 1st.png: ⌘N / Ctrl+N (new chat), ⌘K / Ctrl+K (search), etc.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isModifier = e.metaKey || e.ctrlKey;
      if (isModifier && e.key.toLowerCase() === "n") {
        e.preventDefault();
        createNewChat(activeProject || undefined);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeProject, createNewChat]);

  // Responsive sidebar collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        backgroundColor: "var(--bg-app)",
      }}
    >
      {/* Left Sidebar */}
      <Sidebar
        conversations={conversations}
        activeId={activeChatId}
        onSelectChat={setActiveChatId}
        onNewChat={() => createNewChat(activeProject || undefined)}
        onDeleteChat={deleteChat}
        onOpenHub={() => setIsHubOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenKnowledge={() => setIsKnowledgeOpen(true)}
        isOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        projects={["Studies", "Work"]}
        activeProject={activeProject}
        onSelectProject={setActiveProject}
      />

      {/* Main Chat Area */}
      <ChatArea
        messages={messages}
        isLoading={isLoading}
        activeStage={activeStage}
        backendStatus={backendStatus}
        isConnected={isConnected}
        useWeb={useWeb}
        onToggleWeb={toggleWeb}
        onSendMessage={sendMessage}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
        onOpenHub={() => setIsHubOpen(true)}
        onOpenKnowledge={() => setIsKnowledgeOpen(true)}
      />

      {/* Hub Modal */}
      <HubModal
        isOpen={isHubOpen}
        onClose={() => setIsHubOpen(false)}
        backendStatus={backendStatus}
        isConnected={isConnected}
      />

      {/* Knowledge Base Modal */}
      <KnowledgeModal
        isOpen={isKnowledgeOpen}
        onClose={() => setIsKnowledgeOpen(false)}
        documentCount={backendStatus?.knowledge_documents || 0}
        onRefreshCount={checkStatus}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onClearAllChats={clearAllChats}
      />
    </div>
  );
};
