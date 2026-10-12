
import { useMemo, useState } from "react";
import {
  Search,
  CalendarDays,
  Clock3,
  Users,
  Video,
  FileText,
  Download,
  ChevronRight,
  CircleCheck,
  X,
} from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import "./MeetingHistoryPage.css";

type MeetingRecord = {
  id: number;
  title: string;
  date: string;
  time: string;
  duration: string;
  participants: number;
  host: string;
  status: "Completed" | "Cancelled";
  hasSummary: boolean;
};

const demoMeetings: MeetingRecord[] = [
  {
    id: 1,
    title: "Weekly Product Sync",
    date: "2026-10-08",
    time: "10:00 AM",
    duration: "45 min",
    participants: 8,
    host: "Alex Morgan",
    status: "Completed",
    hasSummary: true,
  },
  {
    id: 2,
    title: "Design Review",
    date: "2026-10-07",
    time: "02:30 PM",
    duration: "60 min",
    participants: 6,
    host: "Sarah Johnson",
    status: "Completed",
    hasSummary: true,
  },
  {
    id: 3,
    title: "Sprint Planning",
    date: "2026-10-06",
    time: "11:00 AM",
    duration: "50 min",
    participants: 10,
    host: "Michael Chen",
    status: "Completed",
    hasSummary: true,
  },
  {
    id: 4,
    title: "Frontend Architecture",
    date: "2026-10-05",
    time: "04:00 PM",
    duration: "35 min",
    participants: 5,
    host: "Alex Morgan",
    status: "Completed",
    hasSummary: false,
  },
  {
    id: 5,
    title: "Marketing Strategy",
    date: "2026-10-03",
    time: "09:30 AM",
    duration: "40 min",
    participants: 7,
    host: "Emily Davis",
    status: "Cancelled",
    hasSummary: false,
  },
  {
    id: 6,
    title: "Engineering Standup",
    date: "2026-10-02",
    time: "09:00 AM",
    duration: "20 min",
    participants: 9,
    host: "Michael Chen",
    status: "Completed",
    hasSummary: true,
  },
];

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function downloadMeetingReport(meeting: MeetingRecord) {
  const report = [
    "INTELLMEET - MEETING REPORT",
    "---------------------------",
    `Meeting: ${meeting.title}`,
    `Date: ${formatDate(meeting.date)}`,
    `Time: ${meeting.time}`,
    `Duration: ${meeting.duration}`,
    `Host: ${meeting.host}`,
    `Participants: ${meeting.participants}`,
    `Status: ${meeting.status}`,
    `AI Summary: ${meeting.hasSummary ? "Available" : "Not available"}`,
  ].join("\n");

  const blob = new Blob([report], {
    type: "text/plain;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `meeting-${meeting.id}-report.txt`;
  link.click();

  URL.revokeObjectURL(url);
}

export default function MeetingHistoryPage() {
  const [meetings] = useState<MeetingRecord[]>(demoMeetings);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All time");
  const [selectedMeeting, setSelectedMeeting] =
    useState<MeetingRecord | null>(null);

  const filteredMeetings = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return meetings.filter((meeting) => {
      const matchesSearch =
        meeting.title.toLowerCase().includes(normalizedSearch) ||
        meeting.host.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "All" || meeting.status === statusFilter;

      const meetingDate = new Date(`${meeting.date}T12:00:00`);
      const now = new Date();

      const daysAgo =
        (now.getTime() - meetingDate.getTime()) /
        (1000 * 60 * 60 * 24);

      const matchesDate =
        dateFilter === "All time" ||
        (dateFilter === "Last 7 days" && daysAgo >= 0 && daysAgo <= 7) ||
        (dateFilter === "Last 30 days" && daysAgo >= 0 && daysAgo <= 30);

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [meetings, search, statusFilter, dateFilter]);

  const completedCount = meetings.filter(
    (meeting) => meeting.status === "Completed"
  ).length;

  const totalParticipants = meetings.reduce(
    (total, meeting) =>
      meeting.status === "Completed"
        ? total + meeting.participants
        : total,
    0
  );

  return (
    <div className="meeting-history-page">
      <SectionHeading
        eyebrow="MEETING ARCHIVE"
        title="Meeting History"
        subtitle="Review previous meetings, participants, durations, and AI summaries."
      />

      <div className="history-stats">
        <article className="history-stat-card">
          <div className="history-stat-icon purple">
            <Video size={21} />
          </div>
          <div>
            <p>Total meetings</p>
            <h3>{meetings.length}</h3>
            <span>Across your meeting history</span>
          </div>
        </article>

        <article className="history-stat-card">
          <div className="history-stat-icon green">
            <CircleCheck size={21} />
          </div>
          <div>
            <p>Completed</p>
            <h3>{completedCount}</h3>
            <span>Successfully completed</span>
          </div>
        </article>

        <article className="history-stat-card">
          <div className="history-stat-icon blue">
            <Users size={21} />
          </div>
          <div>
            <p>Participant seats</p>
            <h3>{totalParticipants}</h3>
            <span>Across completed meetings</span>
          </div>
        </article>
      </div>

      <section className="history-panel">
        <div className="history-panel-heading">
          <div>
            <h2>Previous meetings</h2>
            <p>Find and review your past sessions.</p>
          </div>

          <span className="history-result-count">
            {filteredMeetings.length} results
          </span>
        </div>

        <div className="history-filters">
          <div className="history-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search meeting or host..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="history-select-wrap">
            <CalendarDays size={16} />
            <select
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              aria-label="Filter by date"
            >
              <option>All time</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>

          <select
            className="history-status-select"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by status"
          >
            <option value="All">All statuses</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="history-table-wrap">
          <table className="history-table">
            <thead>
              <tr>
                <th>MEETING</th>
                <th>DATE & TIME</th>
                <th>DURATION</th>
                <th>PARTICIPANTS</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {filteredMeetings.map((meeting) => (
                <tr key={meeting.id}>
                  <td>
                    <div className="history-meeting-cell">
                      <div className="history-meeting-icon">
                        <Video size={18} />
                      </div>

                      <div>
                        <strong>{meeting.title}</strong>
                        <span>Hosted by {meeting.host}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="history-date-cell">
                      <strong>{formatDate(meeting.date)}</strong>
                      <span>{meeting.time}</span>
                    </div>
                  </td>

                  <td>
                    <span className="history-duration">
                      <Clock3 size={14} />
                      {meeting.duration}
                    </span>
                  </td>

                  <td>
                    <span className="history-participants">
                      <Users size={15} />
                      {meeting.participants}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`history-status ${
                        meeting.status === "Completed"
                          ? "completed"
                          : "cancelled"
                      }`}
                    >
                      {meeting.status === "Completed" ? (
                        <CircleCheck size={13} />
                      ) : (
                        <X size={13} />
                      )}
                      {meeting.status}
                    </span>
                  </td>

                  <td>
                    <div className="history-actions">
                      <button
                        className="history-action-button"
                        onClick={() => setSelectedMeeting(meeting)}
                        title="View meeting details"
                        aria-label={`View ${meeting.title}`}
                      >
                        <ChevronRight size={18} />
                      </button>

                      <button
                        className="history-action-button"
                        onClick={() => downloadMeetingReport(meeting)}
                        title="Download meeting report"
                        aria-label={`Download ${meeting.title} report`}
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredMeetings.length === 0 && (
            <div className="history-empty">
              <Search size={30} />
              <h3>No meetings found</h3>
              <p>Try changing your search or filters.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                  setDateFilter("All time");
                }}
              >
                Reset filters
              </button>
            </div>
          )}
        </div>

        <div className="history-panel-footer">
          <span>
            Showing {filteredMeetings.length} of {meetings.length} meetings
          </span>
          <span>Demo meeting data</span>
        </div>
      </section>

      {selectedMeeting && (
        <div
          className="history-modal-backdrop"
          onClick={() => setSelectedMeeting(null)}
        >
          <section
            className="history-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="history-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="history-modal-header">
              <div className="history-modal-icon">
                <Video size={21} />
              </div>

              <button
                className="history-modal-close"
                onClick={() => setSelectedMeeting(null)}
                aria-label="Close meeting details"
              >
                <X size={20} />
              </button>
            </div>

            <h2 id="history-modal-title">{selectedMeeting.title}</h2>
            <p className="history-modal-subtitle">
              Meeting details and available resources
            </p>

            <div className="history-modal-details">
              <div>
                <CalendarDays size={17} />
                <span>Date</span>
                <strong>{formatDate(selectedMeeting.date)}</strong>
              </div>
              <div>
                <Clock3 size={17} />
                <span>Duration</span>
                <strong>{selectedMeeting.duration}</strong>
              </div>
              <div>
                <Users size={17} />
                <span>Participants</span>
                <strong>{selectedMeeting.participants}</strong>
              </div>
              <div>
                <CircleCheck size={17} />
                <span>Status</span>
                <strong>{selectedMeeting.status}</strong>
              </div>
            </div>

            <div className="history-summary-notice">
              <FileText size={19} />
              <div>
                <strong>AI meeting summary</strong>
                <p>
                  {selectedMeeting.hasSummary
                    ? "A summary is marked as available in this demo."
                    : "No AI summary is available for this demo meeting."}
                </p>
              </div>
            </div>

            <button
              className="history-modal-download"
              onClick={() => downloadMeetingReport(selectedMeeting)}
            >
              <Download size={17} />
              Download meeting report
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
