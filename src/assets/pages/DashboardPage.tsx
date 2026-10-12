
import { useState } from "react";
import SectionHeading from "../components/SectionHeading";
import StatCard from "../components/StatCard";
import MeetingCard from "../components/MeetingCard";
import TaskList from "../components/TaskList";
import { demoMeetings, demoTasks } from "../data/demoData";
import "./DashboardPage.css";

export default function DashboardPage() {
  const [search, setSearch] = useState("");

  const filteredMeetings = demoMeetings.filter((meeting) =>
    meeting.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-page">
      <SectionHeading
        eyebrow="YOUR WORKSPACE"
        title="Good morning, Karthik 👋"
        subtitle="Here's what's happening with your team today."
        action={
          <button
            className="dashboard-primary-button"
            onClick={() => alert("Create Meeting feature will be connected next!")}
          >
            + Create meeting
          </button>
        }
      />

      <section className="dashboard-stats">
        <StatCard
          title="Total Meetings"
          value="24"
          change="+12%"
          description="vs. last month"
          icon="▣"
          color="purple"
        />
        <StatCard
          title="Upcoming Meetings"
          value="08"
          change="3 today"
          description="scheduled meetings"
          icon="◷"
          color="blue"
        />
        <StatCard
          title="Tasks Completed"
          value="18/24"
          change="75%"
          description="completion rate"
          icon="✓"
          color="green"
        />
        <StatCard
          title="Hours Saved"
          value="12.5h"
          change="+2.5h"
          description="with AI summaries"
          icon="✳"
          color="orange"
        />
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <div>
            <h2>Upcoming Meetings</h2>
            <p>Stay prepared for your next conversations.</p>
          </div>

          <button
            className="dashboard-text-button"
            onClick={() => alert("Open the Meetings page from the sidebar.")}
          >
            View all →
          </button>
        </div>

        <input
          className="meeting-search"
          type="search"
          placeholder="Search meetings..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search meetings"
        />

        <div className="dashboard-meeting-grid">
          {filteredMeetings.length > 0 ? (
            filteredMeetings.map((meeting) => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                onJoin={(selectedMeeting) =>
                  alert(`Joining: ${selectedMeeting.title}\nDemo only — video calling is not connected yet.`)
                }
              />
            ))
          ) : (
            <p className="dashboard-no-results">No meetings found.</p>
          )}
        </div>
      </section>

      <section className="dashboard-section dashboard-tasks-section">
        <div className="dashboard-section-heading">
          <div>
            <h2>Tasks & Action Items</h2>
            <p>Keep track of your team's next steps.</p>
          </div>
        </div>

        <TaskList tasks={demoTasks} />
      </section>

      <footer className="dashboard-footer">
        IntellMeet · AI-powered collaboration
        <span>Frontend demo · Sample data</span>
      </footer>
    </div>
  );
}
