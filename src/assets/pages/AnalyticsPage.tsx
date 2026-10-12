
import { useState } from "react";
import {
  Activity,
  CalendarDays,
  Clock3,
  Download,
  TrendingUp,
  Users,
  CheckCircle2,
} from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import "./AnalyticsPage.css";

type Period = "7 days" | "30 days" | "90 days";

const weeklyData = [
  { day: "Mon", meetings: 5, hours: 3 },
  { day: "Tue", meetings: 8, hours: 5 },
  { day: "Wed", meetings: 6, hours: 4 },
  { day: "Thu", meetings: 10, hours: 7 },
  { day: "Fri", meetings: 7, hours: 4 },
  { day: "Sat", meetings: 3, hours: 2 },
  { day: "Sun", meetings: 4, hours: 3 },
];

const durationData = [
  { label: "Under 15 min", value: 18, color: "purple" },
  { label: "15–30 min", value: 32, color: "blue" },
  { label: "30–60 min", value: 35, color: "green" },
  { label: "Over 60 min", value: 15, color: "orange" },
];

const taskData = [
  { label: "Completed", value: 72, color: "green" },
  { label: "In Progress", value: 18, color: "purple" },
  { label: "Pending", value: 10, color: "orange" },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("7 days");

  const multiplier = period === "7 days" ? 1 : period === "30 days" ? 3 : 6;
  const meetingTotal = 43 * multiplier;
  const hourTotal = 28 * multiplier;
  const taskTotal = 86 * multiplier;

  function exportReport() {
    const rows = [
      ["Metric", "Value"],
      ["Period", period],
      ["Total meetings", String(meetingTotal)],
      ["Meeting hours", String(hourTotal)],
      ["Tasks completed", String(Math.round(taskTotal * 0.72))],
      ["Task completion rate", "72%"],
      [],
      ["Day", "Meetings", "Hours"],
      ...weeklyData.map((item) => [
        item.day,
        String(item.meetings * multiplier),
        String(item.hours * multiplier),
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((cell) => {
            const value = String(cell ?? "");
            return `"${value.replace(/"/g, '""')}"`;
          })
          .join(",")
      )
      .join("\r\n");

    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = `intellmeet-analytics-${period.replace(" ", "-")}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="analytics-page">
      <SectionHeading
        eyebrow="PERFORMANCE INSIGHTS"
        title="Analytics"
        subtitle="Understand meeting activity, team productivity, and collaboration trends."
        action={
          <button className="analytics-export-btn" onClick={exportReport}>
            <Download size={17} />
            Export CSV
          </button>
        }
      />

      <div className="analytics-toolbar">
        <div className="analytics-period-label">
          <CalendarDays size={17} />
          <span>Reporting period</span>
        </div>

        <div className="analytics-period-control">
          {(["7 days", "30 days", "90 days"] as Period[]).map((item) => (
            <button
              key={item}
              className={period === item ? "active" : ""}
              onClick={() => setPeriod(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="analytics-stat-grid">
        <article className="analytics-stat-card">
          <div className="analytics-stat-top">
            <span>Total meetings</span>
            <div className="analytics-icon purple">
              <CalendarDays size={20} />
            </div>
          </div>
          <strong>{meetingTotal}</strong>
          <small><TrendingUp size={14} /> Demo activity data</small>
        </article>

        <article className="analytics-stat-card">
          <div className="analytics-stat-top">
            <span>Meeting hours</span>
            <div className="analytics-icon blue">
              <Clock3 size={20} />
            </div>
          </div>
          <strong>{hourTotal}h</strong>
          <small><Activity size={14} /> Total time in meetings</small>
        </article>

        <article className="analytics-stat-card">
          <div className="analytics-stat-top">
            <span>Tasks completed</span>
            <div className="analytics-icon green">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <strong>{Math.round(taskTotal * 0.72)}</strong>
          <small><TrendingUp size={14} /> 72% completion rate</small>
        </article>

        <article className="analytics-stat-card">
          <div className="analytics-stat-top">
            <span>Participants</span>
            <div className="analytics-icon orange">
              <Users size={20} />
            </div>
          </div>
          <strong>{19 * multiplier}</strong>
          <small>Demo participant count</small>
        </article>
      </div>

      <div className="analytics-main-grid">
        <article className="analytics-panel analytics-activity-panel">
          <div className="analytics-panel-heading">
            <div>
              <h2>Meeting activity</h2>
              <p>Meeting volume across the week</p>
            </div>
            <span className="analytics-legend">
              <i />
              Meetings
            </span>
          </div>

          <div className="analytics-chart">
            <div className="analytics-y-labels">
              <span>{12 * multiplier}</span>
              <span>{9 * multiplier}</span>
              <span>{6 * multiplier}</span>
              <span>{3 * multiplier}</span>
              <span>0</span>
            </div>

            <div className="analytics-bars-area">
              <div className="analytics-grid-lines">
                {[0, 1, 2, 3, 4].map((line) => (
                  <span key={line} />
                ))}
              </div>

              {weeklyData.map((item) => (
                <div className="analytics-bar-column" key={item.day}>
                  <div className="analytics-bar-track">
                    <div
                      className="analytics-bar"
                      style={{
                        height: `${(item.meetings / 12) * 100}%`,
                      }}
                      title={`${item.meetings * multiplier} meetings`}
                    />
                  </div>
                  <span>{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="analytics-chart-note">
            <Activity size={16} />
            <span>Illustrative weekly activity — sample data, not live usage.</span>
          </div>
        </article>

        <article className="analytics-panel">
          <div className="analytics-panel-heading">
            <div>
              <h2>Task completion</h2>
              <p>Sample task status breakdown</p>
            </div>
          </div>

          <div className="analytics-task-total">
            <strong>{taskTotal}</strong>
            <span>Total tracked tasks</span>
          </div>

          <div className="analytics-task-progress">
            {taskData.map((item) => (
              <div className="analytics-task-row" key={item.label}>
                <div className="analytics-task-label">
                  <span><i className={item.color} />{item.label}</span>
                  <strong>{item.value}%</strong>
                </div>
                <div className="analytics-progress-track">
                  <div
                    className={item.color}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="analytics-completion-footer">
            <CheckCircle2 size={18} />
            <div>
              <strong>72% completed</strong>
              <span>Illustrative completion rate</span>
            </div>
          </div>
        </article>
      </div>

      <div className="analytics-bottom-grid">
        <article className="analytics-panel">
          <div className="analytics-panel-heading">
            <div>
              <h2>Meeting duration</h2>
              <p>Distribution of meeting lengths</p>
            </div>
          </div>

          <div className="analytics-duration-list">
            {durationData.map((item) => (
              <div className="analytics-duration-row" key={item.label}>
                <span className="analytics-duration-dot">
                  <i className={item.color} />
                </span>
                <span className="analytics-duration-label">{item.label}</span>
                <div className="analytics-duration-track">
                  <div
                    className={item.color}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
                <strong>{item.value}%</strong>
              </div>
            ))}
          </div>
          <p className="analytics-footnote">
            Illustrative distribution. Actual duration data requires backend integration.
          </p>
        </article>

        <article className="analytics-insight-card">
          <div className="analytics-insight-icon">
            <Activity size={23} />
          </div>
          <span className="analytics-insight-eyebrow">WORKSPACE INSIGHT</span>
          <h2>Better collaboration starts with visibility.</h2>
          <p>
            Track meeting time, review task completion, and identify
            opportunities to make team collaboration more effective.
          </p>
          <div className="analytics-insight-metric">
            <div>
              <span>Sample completion rate</span>
              <strong>72%</strong>
            </div>
            <div className="analytics-mini-track">
              <span />
            </div>
          </div>
        </article>
      </div>

      <p className="analytics-disclaimer">
        Demo analytics only. Metrics are illustrative and will be replaced with real application data during final integration.
      </p>
    </section>
  );
}
