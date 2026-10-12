
import { useState } from "react";
import {
  Sparkles,
  FileText,
  ListChecks,
  Clock3,
  Copy,
  Download,
  Search,
  CheckCircle2,
  Circle,
  Users,
  MessageSquareText,
  WandSparkles,
} from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import "./AISummaryPage.css";

type ActionItem = {
  id: number;
  title: string;
  owner: string;
  dueDate: string;
  completed: boolean;
};

const initialActions: ActionItem[] = [
  {
    id: 1,
    title: "Complete the dashboard responsive layout",
    owner: "Karthik",
    dueDate: "Oct 14",
    completed: false,
  },
  {
    id: 2,
    title: "Review API integration requirements",
    owner: "Arun Kumar",
    dueDate: "Oct 15",
    completed: false,
  },
  {
    id: 3,
    title: "Prepare the next sprint task list",
    owner: "Priya Sharma",
    dueDate: "Oct 16",
    completed: true,
  },
  {
    id: 4,
    title: "Share updated UI designs with the team",
    owner: "Rahul Dev",
    dueDate: "Oct 17",
    completed: false,
  },
];

const transcript = [
  {
    time: "00:02",
    speaker: "Karthik",
    text: "Let's review the dashboard progress and discuss what needs to be completed this week.",
  },
  {
    time: "03:15",
    speaker: "Arun Kumar",
    text: "The API requirements are ready for review. We need to confirm the response structure before integration.",
  },
  {
    time: "06:40",
    speaker: "Priya Sharma",
    text: "The team should prioritize the responsive layout and verify it on mobile and desktop screens.",
  },
  {
    time: "10:20",
    speaker: "Rahul Dev",
    text: "I will share the updated design files so that development can continue with the latest UI.",
  },
  {
    time: "14:05",
    speaker: "Karthik",
    text: "Let's track the action items and review progress in our next team meeting.",
  },
];

export default function AISummaryPage() {
  const [activeTab, setActiveTab] = useState<"summary" | "transcript" | "actions">("summary");
  const [actions, setActions] = useState(initialActions);
  const [search, setSearch] = useState("");
  const [summary, setSummary] = useState(
    "The Product Team Sync focused on dashboard development, API integration, and sprint planning. The team agreed to prioritize responsive design, review API requirements, share updated UI assets, and track the agreed action items before the next meeting."
  );
  const [generating, setGenerating] = useState(false);
  const [notice, setNotice] = useState("");

  const completedCount = actions.filter((item) => item.completed).length;

  const filteredTranscript = transcript.filter(
    (item) =>
      item.speaker.toLowerCase().includes(search.toLowerCase()) ||
      item.text.toLowerCase().includes(search.toLowerCase())
  );

  function showNotice(text: string) {
    setNotice(text);
    window.setTimeout(() => setNotice(""), 2500);
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      showNotice("Copied to clipboard!");
    } catch {
      showNotice("Clipboard access is unavailable in this browser.");
    }
  }

  function downloadSummary() {
    const content = [
      "INTELLMEET — MEETING SUMMARY",
      "",
      "Meeting: Product Team Sync",
      "Date: October 12, 2026",
      "Duration: 18 minutes",
      "",
      "SUMMARY",
      summary,
      "",
      "KEY DISCUSSION POINTS",
      ...[
        "Dashboard responsive layout needs to be completed.",
        "API response structure needs review before integration.",
        "Updated UI design files will be shared with the team.",
        "Action items will be reviewed in the next meeting.",
      ].map((item, index) => `${index + 1}. ${item}`),
      "",
      "ACTION ITEMS",
      ...actions.map(
        (item) =>
          `${item.completed ? "[Completed]" : "[Pending]"} ${item.title} — ${item.owner} — ${item.dueDate}`
      ),
      "",
      "Note: This report uses demo content. It is not generated from a real recording.",
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "intellmeet-meeting-summary.txt";
    anchor.click();
    URL.revokeObjectURL(url);
    showNotice("Summary downloaded!");
  }

  function regenerateSummary() {
    setGenerating(true);
    window.setTimeout(() => {
      setSummary(
        "The Product Team Sync covered dashboard progress, API readiness, and sprint priorities. The team will complete responsive UI work, review API response requirements, share the latest designs, and follow up on outstanding action items during the next meeting."
      );
      setGenerating(false);
      showNotice("Demo summary refreshed.");
    }, 900);
  }

  return (
    <main className="ai-summary-page">
      <SectionHeading
        eyebrow="AI-POWERED MEETINGS"
        title="Meeting Summary"
        subtitle="Review key decisions, discussion notes, and follow-up actions."
        action={
          <button className="ais-download-btn" onClick={downloadSummary}>
            <Download size={16} />
            Export report
          </button>
        }
      />

      {notice && (
        <div className="ais-notice" role="status">
          <CheckCircle2 size={16} />
          {notice}
        </div>
      )}

      <section className="ais-meeting-banner">
        <div className="ais-meeting-icon">
          <Sparkles size={24} />
        </div>
        <div className="ais-meeting-details">
          <span className="ais-completed-label">
            <CheckCircle2 size={13} /> MEETING COMPLETED
          </span>
          <h2>Product Team Sync</h2>
          <div className="ais-meeting-meta">
            <span><Clock3 size={14} /> 18 minutes</span>
            <span><Users size={14} /> 4 participants</span>
            <span><FileText size={14} /> Meeting notes</span>
          </div>
        </div>
        <div className="ais-ai-badge">
          <Sparkles size={14} /> AI Summary Demo
        </div>
      </section>

      <section className="ais-stats">
        <article className="ais-stat-card">
          <div className="ais-stat-icon purple"><FileText size={19} /></div>
          <span>Summary</span>
          <strong>1</strong>
          <small>Meeting overview</small>
        </article>
        <article className="ais-stat-card">
          <div className="ais-stat-icon blue"><MessageSquareText size={19} /></div>
          <span>Discussion points</span>
          <strong>4</strong>
          <small>Topics identified</small>
        </article>
        <article className="ais-stat-card">
          <div className="ais-stat-icon green"><ListChecks size={19} /></div>
          <span>Action items</span>
          <strong>{actions.length}</strong>
          <small>{completedCount} completed</small>
        </article>
      </section>

      <section className="ais-content-card">
        <div className="ais-tabs">
          <button
            className={activeTab === "summary" ? "active" : ""}
            onClick={() => setActiveTab("summary")}
          >
            <Sparkles size={16} /> Summary
          </button>
          <button
            className={activeTab === "transcript" ? "active" : ""}
            onClick={() => setActiveTab("transcript")}
          >
            <FileText size={16} /> Transcript
          </button>
          <button
            className={activeTab === "actions" ? "active" : ""}
            onClick={() => setActiveTab("actions")}
          >
            <ListChecks size={16} /> Action items
            <span className="ais-tab-count">{actions.length}</span>
          </button>
        </div>

        {activeTab === "summary" && (
          <div className="ais-tab-content">
            <div className="ais-section-title">
              <div>
                <h3><WandSparkles size={18} /> Meeting overview</h3>
                <p>A concise overview of the meeting discussion.</p>
              </div>
              <button
                className="ais-small-btn"
                onClick={() => copyText(summary)}
              >
                <Copy size={14} /> Copy
              </button>
            </div>

            <div className="ais-summary-box">
              <div className="ais-summary-sparkle"><Sparkles size={17} /></div>
              <p>{summary}</p>
            </div>

            <div className="ais-section-title ais-points-heading">
              <div>
                <h3>Key discussion points</h3>
                <p>The main topics discussed by the team.</p>
              </div>
            </div>

            <div className="ais-key-points">
              <article>
                <span>01</span>
                <div>
                  <strong>Responsive dashboard</strong>
                  <p>Complete and verify the layout across desktop and mobile screens.</p>
                </div>
              </article>
              <article>
                <span>02</span>
                <div>
                  <strong>API integration</strong>
                  <p>Review the API response structure before beginning integration.</p>
                </div>
              </article>
              <article>
                <span>03</span>
                <div>
                  <strong>Updated UI assets</strong>
                  <p>Share the latest design files with the development team.</p>
                </div>
              </article>
              <article>
                <span>04</span>
                <div>
                  <strong>Sprint follow-up</strong>
                  <p>Track pending tasks and review them during the next meeting.</p>
                </div>
              </article>
            </div>

            <div className="ais-summary-footer">
              <div>
                <Sparkles size={16} />
                <span>Demo-generated content · Not connected to an AI service</span>
              </div>
              <button
                className="ais-regenerate-btn"
                onClick={regenerateSummary}
                disabled={generating}
              >
                <WandSparkles size={15} />
                {generating ? "Refreshing..." : "Refresh demo summary"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "transcript" && (
          <div className="ais-tab-content">
            <div className="ais-section-title">
              <div>
                <h3>Meeting transcript</h3>
                <p>Sample notes arranged by speaker and timestamp.</p>
              </div>
              <span className="ais-demo-label">SAMPLE DATA</span>
            </div>

            <div className="ais-search">
              <Search size={17} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search speaker or transcript..."
              />
            </div>

            <div className="ais-transcript-list">
              {filteredTranscript.map((item, index) => (
                <article className="ais-transcript-item" key={`${item.time}-${index}`}>
                  <span className="ais-transcript-time">{item.time}</span>
                  <div className="ais-transcript-avatar">
                    {item.speaker.split(" ").map((word) => word[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <strong>{item.speaker}</strong>
                    <p>{item.text}</p>
                  </div>
                </article>
              ))}
              {filteredTranscript.length === 0 && (
                <p className="ais-empty-state">No matching transcript found.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "actions" && (
          <div className="ais-tab-content">
            <div className="ais-section-title">
              <div>
                <h3>Action items</h3>
                <p>Track the tasks identified during this meeting.</p>
              </div>
              <span className="ais-progress-label">
                {completedCount} of {actions.length} done
              </span>
            </div>

            <div className="ais-progress-track">
              <span style={{ width: `${(completedCount / actions.length) * 100}%` }} />
            </div>

            <div className="ais-action-list">
              {actions.map((item) => (
                <article
                  className={`ais-action-item ${item.completed ? "completed" : ""}`}
                  key={item.id}
                >
                  <button
                    className="ais-check-btn"
                    onClick={() =>
                      setActions((current) =>
                        current.map((action) =>
                          action.id === item.id
                            ? { ...action, completed: !action.completed }
                            : action
                        )
                      )
                    }
                    aria-label={item.completed ? "Mark incomplete" : "Mark completed"}
                  >
                    {item.completed
                      ? <CheckCircle2 size={21} />
                      : <Circle size={21} />}
                  </button>
                  <div className="ais-action-main">
                    <strong>{item.title}</strong>
                    <div className="ais-action-meta">
                      <span><Users size={12} /> {item.owner}</span>
                      <span><Clock3 size={12} /> Due {item.dueDate}</span>
                    </div>
                  </div>
                  <span className={`ais-action-status ${item.completed ? "done" : "pending"}`}>
                    {item.completed ? "Completed" : "Pending"}
                  </span>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>

      <p className="ais-disclaimer">
        <Sparkles size={14} />
        This is a frontend prototype. Transcripts and summaries are sample data,
        not real meeting recordings or AI-generated results.
      </p>
    </main>
  );
}
