
import { useMemo, useState } from "react";
import { CalendarDays, Clock3, Plus, Search, Video, X } from "lucide-react";
import { demoMeetings } from "../data/demoData";
import type { Meeting } from "../components/MeetingCard";
import SectionHeading from "../components/SectionHeading";
import "./MeetingsPage.css";

type FilterType = "All" | "Upcoming" | "In Progress" | "Completed";

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>(demoMeetings);
  const [filter, setFilter] = useState<FilterType>("All");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("Team Meeting");

  const filteredMeetings = useMemo(() => {
    return meetings.filter((meeting) => {
      const matchesFilter =
        filter === "All" || meeting.status === filter;

      const matchesSearch =
        meeting.title.toLowerCase().includes(search.toLowerCase()) ||
        meeting.category.toLowerCase().includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [meetings, filter, search]);

  function scheduleMeeting(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newMeeting: Meeting = {
      id: `meeting-${Date.now()}`,
      title: title.trim(),
      date,
      time,
      duration: "30 min",
      participants: ["You"],
      category,
      color: "purple",
      status: "Upcoming",
    };

    setMeetings((current) => [newMeeting, ...current]);
    setTitle("");
    setDate("");
    setTime("");
    setCategory("Team Meeting");
    setShowForm(false);
    setFilter("All");
    setSearch("");
  }

  function joinMeeting(meeting: Meeting) {
    alert(
      `Demo mode: "${meeting.title}" selected. Video calling will work after backend and WebRTC integration.`
    );
  }

  return (
    <section className="meetings-page">
      <SectionHeading
        eyebrow="MEETING CENTER"
        title="Your Meetings"
        subtitle="Plan conversations, manage sessions, and stay connected with your team."
        action={
          <button
            className="meeting-primary-btn"
            onClick={() => setShowForm(true)}
          >
            <Plus size={18} />
            Schedule Meeting
          </button>
        }
      />

      <div className="meeting-summary">
        <div className="meeting-summary-card">
          <span>Total Meetings</span>
          <strong>{meetings.length}</strong>
          <small>All your sessions</small>
        </div>

        <div className="meeting-summary-card">
          <span>Upcoming</span>
          <strong>
            {meetings.filter((m) => m.status === "Upcoming").length}
          </strong>
          <small>Ready to attend</small>
        </div>

        <div className="meeting-summary-card">
          <span>In Progress</span>
          <strong>
            {meetings.filter((m) => m.status === "In Progress").length}
          </strong>
          <small>Currently active</small>
        </div>

        <div className="meeting-summary-card">
          <span>Completed</span>
          <strong>
            {meetings.filter((m) => m.status === "Completed").length}
          </strong>
          <small>Past sessions</small>
        </div>
      </div>

      <div className="meetings-toolbar">
        <div className="meetings-search">
          <Search size={18} />
          <input
            type="search"
            placeholder="Search meetings..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="meeting-filters">
          {(["All", "Upcoming", "In Progress", "Completed"] as FilterType[]).map(
            (item) => (
              <button
                key={item}
                className={filter === item ? "active" : ""}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            )
          )}
        </div>
      </div>

      {showForm && (
        <div className="meeting-modal-backdrop">
          <form
            className="meeting-form"
            onSubmit={scheduleMeeting}
          >
            <div className="meeting-form-heading">
              <div>
                <span>NEW SESSION</span>
                <h2>Schedule a meeting</h2>
              </div>

              <button
                type="button"
                className="meeting-close-btn"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <label htmlFor="meeting-title">Meeting title</label>
            <input
              id="meeting-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Project planning"
              required
              maxLength={100}
            />

            <label htmlFor="meeting-category">Meeting type</label>
            <select
              id="meeting-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option>Team Meeting</option>
              <option>Client Meeting</option>
              <option>One-on-One</option>
              <option>Project Review</option>
            </select>

            <div className="meeting-form-row">
              <div>
                <label htmlFor="meeting-date">Date</label>
                <input
                  id="meeting-date"
                  type="date"
                  min={new Date().toLocaleDateString("en-CA")}
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="meeting-time">Time</label>
                <input
                  id="meeting-time"
                  type="time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  required
                />
              </div>
            </div>

            <p className="meeting-demo-note">
              Demo only: this meeting stays in the current page session.
            </p>

            <button type="submit" className="meeting-submit-btn">
              <CalendarDays size={18} />
              Create Meeting
            </button>
          </form>
        </div>
      )}

      <div className="meetings-list-heading">
        <div>
          <h2>Meeting Schedule</h2>
          <p>{filteredMeetings.length} meeting(s) found</p>
        </div>
      </div>

      {filteredMeetings.length === 0 ? (
        <div className="meetings-empty">
          <CalendarDays size={36} />
          <h3>No meetings found</h3>
          <p>Try another search or schedule a new meeting.</p>
          <button
            className="meeting-primary-btn"
            onClick={() => setShowForm(true)}
          >
            <Plus size={18} />
            Schedule Meeting
          </button>
        </div>
      ) : (
        <div className="meetings-grid">
          {filteredMeetings.map((meeting) => (
            <article className="meeting-detail-card" key={meeting.id}>
              <div className="meeting-detail-top">
                <div className={`meeting-video-icon ${meeting.color ?? "purple"}`}>
                  <Video size={22} />
                </div>

                <span
                  className={`meeting-status ${(
                    meeting.status ?? "Upcoming"
                  ).toLowerCase().replace(" ", "-")}`}
                >
                  {meeting.status ?? "Upcoming"}
                </span>
              </div>

              <span className="meeting-category-label">
                {meeting.category}
              </span>

              <h3>{meeting.title}</h3>

              <div className="meeting-detail-info">
                <span>
                  <CalendarDays size={16} />
                  {meeting.date}
                </span>
                <span>
                  <Clock3 size={16} />
                  {meeting.time} · {meeting.duration}
                </span>
              </div>

              <div className="meeting-detail-footer">
                <div className="meeting-participants">
                  {meeting.participants.slice(0, 4).map((person, index) => (
                    <span
                      className={`meeting-avatar avatar-${index % 4}`}
                      key={`${meeting.id}-${person}-${index}`}
                      title={person}
                    >
                      {person.charAt(0).toUpperCase()}
                    </span>
                  ))}
                  <small>{meeting.participants.length} participant(s)</small>
                </div>

                <button
                  className="meeting-join-btn"
                  disabled={meeting.status === "Completed"}
                  onClick={() => joinMeeting(meeting)}
                >
                  {meeting.status === "Completed" ? "Completed" : "Join"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
