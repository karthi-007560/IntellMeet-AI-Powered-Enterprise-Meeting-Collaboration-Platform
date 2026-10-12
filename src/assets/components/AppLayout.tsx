
import { useState, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import "./AppLayout.css";

type AppLayoutProps = {
  children: ReactNode;
};

const navigation = [
  { label: "Dashboard", path: "/", icon: "▦" },
  { label: "Meetings", path: "/meetings", icon: "▣" },
  { label: "Tasks", path: "/tasks", icon: "✓" },
  { label: "Workspace", path: "/workspace", icon: "▤" },
  { label: "Analytics", path: "/analytics", icon: "▥" },
  { label: "Settings", path: "/settings", icon: "⚙" },
];

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      {sidebarOpen && (
        <button
          className="sidebar-overlay"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`app-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="app-brand">
          <div className="brand-mark">IM</div>
          <div>
            <strong>IntellMeet</strong>
            <span>Smart collaboration</span>
          </div>
        </div>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="sidebar-nav">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <div className="help-icon">?</div>
            <strong>Need help?</strong>
            <p>Explore your workspace and get things done.</p>
          </div>

          <div className="sidebar-user">
            <div className="user-avatar">K</div>
            <div className="user-details">
              <strong>Karthik</strong>
              <span>Frontend Developer</span>
            </div>
            <span className="user-menu">···</span>
          </div>
        </div>
      </aside>

      <div className="app-main">
        <header className="app-topbar">
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle navigation"
          >
            ☰
          </button>

          <div className="topbar-breadcrumb">
            <span>Workspace</span>
            <span className="breadcrumb-divider">/</span>
            <strong>IntellMeet</strong>
          </div>

          <div className="topbar-actions">
            <label className="topbar-search">
              <span>⌕</span>
              <input aria-label="Search" placeholder="Search anything..." />
              <kbd>⌘ K</kbd>
            </label>

            <button
              className="notification-button"
              aria-label="Notifications"
              onClick={() => alert("You're all caught up!")}
            >
              ♧<span />
            </button>

            <div className="topbar-avatar">K</div>
          </div>
        </header>

        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}
