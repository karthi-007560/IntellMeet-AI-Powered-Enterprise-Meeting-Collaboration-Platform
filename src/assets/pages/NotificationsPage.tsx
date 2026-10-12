
import { useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  Check,
  CheckCheck,
  Clock3,
  MessageSquare,
  Sparkles,
  Trash2,
  Users,
  Video,
  Filter,
  CheckCircle2,
} from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import "./NotificationsPage.css";

type NotificationType =
  | "meeting"
  | "message"
  | "task"
  | "ai"
  | "workspace";

type NotificationItem = {
  id: number;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  group: "Today" | "Yesterday" | "Earlier";
  unread: boolean;
};

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    type: "meeting",
    title: "Upcoming meeting",
    description:
      "Weekly Product Sync starts in 15 minutes. Get ready to join your team.",
    time: "10 min ago",
    group: "Today",
    unread: true,
  },
  {
    id: 2,
    type: "message",
    title: "New message from Sarah",
    description:
      "Sarah Johnson mentioned you: Can you review the latest design updates?",
    time: "25 min ago",
    group: "Today",
    unread: true,
  },
  {
    id: 3,
    type: "task",
    title: "Task assigned to you",
    description:
      "You have been assigned 'Review dashboard UI' by Alex Morgan.",
    time: "1 hour ago",
    group: "Today",
    unread: true,
  },
  {
    id: 4,
    type: "ai",
    title: "AI meeting summary is ready",
    description:
      "Your summary and action items from yesterday's Design Review are ready.",
    time: "2 hours ago",
    group: "Today",
    unread: false,
  },
  {
    id: 5,
    type: "workspace",
    title: "Workspace invitation",
    description:
      "Emily Davis invited you to join the Product Development workspace.",
    time: "4 hours ago",
    group: "Today",
    unread: true,
  },
  {
    id: 6,
    type: "meeting",
    title: "Meeting recording available",
    description:
      "The recording for Sprint Planning has finished processing.",
    time: "Yesterday",
    group: "Yesterday",
    unread: false,
  },
  {
    id: 7,
    type: "message",
    title: "Team chat update",
    description:
      "Michael Chen shared an update in the Engineering team channel.",
    time: "Yesterday",
    group: "Yesterday",
    unread: false,
  },
  {
    id: 8,
    type: "task",
    title: "Task deadline reminder",
    description:
      "The deadline for 'Complete API documentation' is approaching.",
    time: "2 days ago",
    group: "Earlier",
    unread: false,
  },
];

const filters = ["All", "Unread", "Meetings", "Messages", "Tasks", "AI"];

function getIcon(type: NotificationType) {
  switch (type) {
    case "meeting":
      return <Video size={20} />;
    case "message":
      return <MessageSquare size={20} />;
    case "task":
      return <CheckCircle2 size={20} />;
    case "ai":
      return <Sparkles size={20} />;
    case "workspace":
      return <Users size={20} />;
  }
}

function getFilterType(filter: string): NotificationType | null {
  switch (filter) {
    case "Meetings":
      return "meeting";
    case "Messages":
      return "message";
    case "Tasks":
      return "task";
    case "AI":
      return "ai";
    default:
      return null;
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(() => {
      try {
        const saved = localStorage.getItem("intellmeet_notifications");
        return saved ? JSON.parse(saved) : initialNotifications;
      } catch {
        return initialNotifications;
      }
    });

  const [activeFilter, setActiveFilter] = useState("All");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const unreadCount = notifications.filter((item) => item.unread).length;

  const visibleNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const filterType = getFilterType(activeFilter);
      const matchesFilter =
        activeFilter === "All" ||
        activeFilter === "Unread" ||
        item.type === filterType;

      const matchesUnread =
        !(showUnreadOnly || activeFilter === "Unread") || item.unread;

      return matchesFilter && matchesUnread;
    });
  }, [notifications, activeFilter, showUnreadOnly]);

  const saveNotifications = (updated: NotificationItem[]) => {
    setNotifications(updated);
    localStorage.setItem(
      "intellmeet_notifications",
      JSON.stringify(updated)
    );
  };

  const markAsRead = (id: number) => {
    saveNotifications(
      notifications.map((item) =>
        item.id === id ? { ...item, unread: false } : item
      )
    );
  };

  const markAllAsRead = () => {
    saveNotifications(
      notifications.map((item) => ({ ...item, unread: false }))
    );
  };

  const deleteNotification = (id: number) => {
    saveNotifications(notifications.filter((item) => item.id !== id));
  };

  const clearAll = () => {
    saveNotifications([]);
  };

  const groupedNotifications = ["Today", "Yesterday", "Earlier"].map(
    (group) => ({
      group,
      items: visibleNotifications.filter((item) => item.group === group),
    })
  );

  return (
    <div className="notifications-page">
      <SectionHeading
        eyebrow="YOUR UPDATES"
        title="Notifications"
        subtitle="Stay updated with meetings, messages, tasks, and team activity."
      />

      <section className="notification-overview">
        <div className="notification-overview-icon">
          <Bell size={25} />
        </div>

        <div className="notification-overview-copy">
          <h3>
            You're all caught up with{" "}
            <span>{unreadCount} unread</span>
          </h3>
          <p>
            {unreadCount > 0
              ? "Review your latest updates and never miss an important moment."
              : "You have no unread notifications. Enjoy your focused workspace."}
          </p>
        </div>

        <div className="notification-overview-actions">
          <button
            className="notification-button notification-button-primary"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck size={16} />
            Mark all read
          </button>
        </div>
      </section>

      <section className="notification-content">
        <div className="notification-toolbar">
          <div className="notification-filter-list">
            {filters.map((filter) => (
              <button
                key={filter}
                className={`notification-filter ${
                  activeFilter === filter ? "active" : ""
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
                {filter === "Unread" && unreadCount > 0 && (
                  <span className="filter-count">{unreadCount}</span>
                )}
              </button>
            ))}
          </div>

          <div className="notification-toolbar-actions">
            <button
              className={`notification-icon-button ${
                showUnreadOnly ? "selected" : ""
              }`}
              onClick={() => setShowUnreadOnly((value) => !value)}
              title="Toggle unread only"
              aria-label="Toggle unread only"
            >
              <Filter size={17} />
            </button>

            <button
              className="notification-clear-button"
              onClick={clearAll}
              disabled={notifications.length === 0}
            >
              <Trash2 size={16} />
              Clear all
            </button>
          </div>
        </div>

        <div className="notification-list">
          {groupedNotifications.map(
            ({ group, items }) =>
              items.length > 0 && (
                <div className="notification-group" key={group}>
                  <div className="notification-group-heading">
                    <span>{group}</span>
                    <span className="notification-group-line" />
                  </div>

                  {items.map((item) => (
                    <article
                      className={`notification-item ${
                        item.unread ? "is-unread" : ""
                      }`}
                      key={item.id}
                    >
                      <div
                        className={`notification-item-icon type-${item.type}`}
                      >
                        {getIcon(item.type)}
                      </div>

                      <div className="notification-item-content">
                        <div className="notification-item-title-row">
                          <h3>{item.title}</h3>
                          {item.unread && (
                            <span className="notification-unread-dot" />
                          )}
                        </div>

                        <p>{item.description}</p>

                        <div className="notification-item-time">
                          <Clock3 size={13} />
                          <span>{item.time}</span>
                        </div>
                      </div>

                      <div className="notification-item-actions">
                        {item.unread && (
                          <button
                            className="notification-action"
                            onClick={() => markAsRead(item.id)}
                            title="Mark as read"
                            aria-label={`Mark ${item.title} as read`}
                          >
                            <Check size={17} />
                          </button>
                        )}

                        <button
                          className="notification-action delete"
                          onClick={() => deleteNotification(item.id)}
                          title="Delete notification"
                          aria-label={`Delete ${item.title}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )
          )}

          {visibleNotifications.length === 0 && (
            <div className="notification-empty">
              <div className="notification-empty-icon">
                <CalendarDays size={28} />
              </div>
              <h3>No notifications found</h3>
              <p>
                There are no notifications in this category right now.
              </p>
              <button
                className="notification-button notification-button-primary"
                onClick={() => {
                  setActiveFilter("All");
                  setShowUnreadOnly(false);
                }}
              >
                View all notifications
              </button>
            </div>
          )}
        </div>

        <div className="notification-footer">
          Showing {visibleNotifications.length} of {notifications.length}{" "}
          notifications
        </div>
      </section>
    </div>
  );
}
