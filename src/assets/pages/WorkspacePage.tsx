
import { useState } from "react";
import {
  Users,
  FolderKanban,
  FileText,
  Plus,
  Search,
  MoreHorizontal,
  X,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import "./WorkspacePage.css";

type Project = {
  id: number;
  name: string;
  description: string;
  color: string;
  progress: number;
  members: string[];
};

type TeamMember = {
  name: string;
  role: string;
  initials: string;
  color: string;
};

type BoardTask = {
  id: number;
  title: string;
  project: string;
  priority: "High" | "Medium" | "Low";
  status: "To Do" | "In Progress" | "Done";
};

const initialProjects: Project[] = [
  {
    id: 1,
    name: "IntellMeet Platform",
    description: "AI meeting and collaboration experience",
    color: "purple",
    progress: 68,
    members: ["KA", "AR", "SK"],
  },
  {
    id: 2,
    name: "Website Redesign",
    description: "Improve product UI and responsiveness",
    color: "blue",
    progress: 42,
    members: ["AR", "MK"],
  },
  {
    id: 3,
    name: "AI Meeting Assistant",
    description: "Meeting notes and summary interface",
    color: "green",
    progress: 25,
    members: ["KA", "SK"],
  },
];

const teamMembers: TeamMember[] = [
  { name: "Karthik", role: "Frontend Developer", initials: "KA", color: "purple" },
  { name: "Arun", role: "UI/UX Designer", initials: "AR", color: "blue" },
  { name: "Sneha", role: "Project Manager", initials: "SK", color: "pink" },
  { name: "Manoj", role: "Developer", initials: "MK", color: "orange" },
];

const initialBoardTasks: BoardTask[] = [
  { id: 1, title: "Build dashboard components", project: "IntellMeet Platform", priority: "High", status: "To Do" },
  { id: 2, title: "Create responsive layouts", project: "Website Redesign", priority: "Medium", status: "In Progress" },
  { id: 3, title: "Design meeting cards", project: "IntellMeet Platform", priority: "Low", status: "Done" },
  { id: 4, title: "Prepare summary screen", project: "AI Meeting Assistant", priority: "High", status: "In Progress" },
];

const initialNotes = [
  {
    id: 1,
    title: "Weekly Team Discussion",
    text: "Review dashboard progress, confirm upcoming tasks, and discuss UI improvements.",
    author: "Karthik",
    date: "Oct 12, 2026",
  },
  {
    id: 2,
    title: "Product Ideas",
    text: "Explore better meeting summaries, team collaboration tools, and a simpler user experience.",
    author: "Sneha",
    date: "Oct 11, 2026",
  },
];

export default function WorkspacePage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [boardTasks, setBoardTasks] = useState<BoardTask[]>(initialBoardTasks);
  const [notes, setNotes] = useState(initialNotes);
  const [search, setSearch] = useState("");
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteText, setNoteText] = useState("");
  const [activeTab, setActiveTab] = useState<"Projects" | "Board" | "Notes" | "Team">("Projects");

  const filteredProjects = projects.filter((project) =>
    `${project.name} ${project.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function addProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setProjects((current) => [
      {
        id: Date.now(),
        name: projectName.trim(),
        description: projectDescription.trim(),
        color: "purple",
        progress: 0,
        members: ["KA"],
      },
      ...current,
    ]);

    setProjectName("");
    setProjectDescription("");
    setShowProjectForm(false);
    setActiveTab("Projects");
    setSearch("");
  }

  function addNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setNotes((current) => [
      {
        id: Date.now(),
        title: noteTitle.trim(),
        text: noteText.trim(),
        author: "Karthik",
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
      },
      ...current,
    ]);

    setNoteTitle("");
    setNoteText("");
    setShowNoteForm(false);
    setActiveTab("Notes");
  }

  function moveTask(taskId: number, status: BoardTask["status"]) {
    setBoardTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, status } : task
      )
    );
  }

  return (
    <section className="workspace-page">
      <SectionHeading
        eyebrow="TEAM COLLABORATION"
        title="Workspace"
        subtitle="Bring projects, people, tasks, and team notes together."
        action={
          <button
            className="workspace-primary-btn"
            onClick={() => setShowProjectForm(true)}
          >
            <Plus size={18} />
            New Project
          </button>
        }
      />

      <div className="workspace-overview">
        <article className="workspace-overview-card">
          <div className="workspace-overview-icon purple">
            <FolderKanban size={21} />
          </div>
          <span>Projects</span>
          <strong>{projects.length}</strong>
          <small>Team projects</small>
        </article>

        <article className="workspace-overview-card">
          <div className="workspace-overview-icon blue">
            <Users size={21} />
          </div>
          <span>Team members</span>
          <strong>{teamMembers.length}</strong>
          <small>Demo team</small>
        </article>

        <article className="workspace-overview-card">
          <div className="workspace-overview-icon orange">
            <Clock3 size={21} />
          </div>
          <span>Active tasks</span>
          <strong>{boardTasks.filter((task) => task.status !== "Done").length}</strong>
          <small>To do and in progress</small>
        </article>

        <article className="workspace-overview-card">
          <div className="workspace-overview-icon green">
            <FileText size={21} />
          </div>
          <span>Shared notes</span>
          <strong>{notes.length}</strong>
          <small>Team notes</small>
        </article>
      </div>

      <div className="workspace-tabs">
        {(["Projects", "Board", "Notes", "Team"] as const).map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "Projects" && <FolderKanban size={16} />}
            {tab === "Board" && <CheckCircle2 size={16} />}
            {tab === "Notes" && <FileText size={16} />}
            {tab === "Team" && <Users size={16} />}
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Projects" && (
        <div className="workspace-section">
          <div className="workspace-section-heading">
            <div>
              <h2>Team projects</h2>
              <p>Track project progress and collaboration.</p>
            </div>
            <label className="workspace-search">
              <Search size={17} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search projects..."
              />
            </label>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="workspace-empty">
              <FolderKanban size={32} />
              <h3>No projects found</h3>
              <p>Try another search or create a project.</p>
            </div>
          ) : (
            <div className="workspace-project-grid">
              {filteredProjects.map((project) => (
                <article className="workspace-project-card" key={project.id}>
                  <div className="workspace-project-top">
                    <div className={`workspace-project-icon ${project.color}`}>
                      <FolderKanban size={22} />
                    </div>
                    <button
                      className="workspace-more-btn"
                      aria-label={`Delete ${project.name}`}
                      title="Delete project"
                      onClick={() =>
                        setProjects((current) =>
                          current.filter((item) => item.id !== project.id)
                        )
                      }
                    >
                      <MoreHorizontal size={20} />
                    </button>
                  </div>

                  <h3>{project.name}</h3>
                  <p className="workspace-project-description">
                    {project.description}
                  </p>

                  <div className="workspace-progress-label">
                    <span>Progress</span>
                    <strong>{project.progress}%</strong>
                  </div>
                  <div className="workspace-progress-track">
                    <div
                      className={project.color}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>

                  <div className="workspace-project-footer">
                    <div className="workspace-avatar-stack">
                      {project.members.map((member, index) => (
                        <span
                          className={`workspace-avatar avatar-${index % 4}`}
                          key={`${project.id}-${member}`}
                        >
                          {member}
                        </span>
                      ))}
                    </div>
                    <span>{project.members.length} members</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "Board" && (
        <div className="workspace-section">
          <div className="workspace-section-heading">
            <div>
              <h2>Project task board</h2>
              <p>Change task status using the dropdown on each card.</p>
            </div>
          </div>

          <div className="workspace-board">
            {(["To Do", "In Progress", "Done"] as const).map((status) => {
              const statusTasks = boardTasks.filter(
                (task) => task.status === status
              );

              return (
                <div className="workspace-board-column" key={status}>
                  <div className="workspace-board-column-heading">
                    <span className={`workspace-column-dot ${status.toLowerCase().replace(" ", "-")}`} />
                    <h3>{status}</h3>
                    <span className="workspace-task-count">
                      {statusTasks.length}
                    </span>
                  </div>

                  {statusTasks.map((task) => (
                    <article className="workspace-board-card" key={task.id}>
                      <span className={`workspace-priority ${task.priority.toLowerCase()}`}>
                        {task.priority} priority
                      </span>
                      <h4>{task.title}</h4>
                      <p>{task.project}</p>
                      <label>
                        <span>Move task</span>
                        <select
                          value={task.status}
                          onChange={(event) =>
                            moveTask(
                              task.id,
                              event.target.value as BoardTask["status"]
                            )
                          }
                        >
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Done">Done</option>
                        </select>
                      </label>
                    </article>
                  ))}

                  {statusTasks.length === 0 && (
                    <p className="workspace-column-empty">No tasks here yet.</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "Notes" && (
        <div className="workspace-section">
          <div className="workspace-section-heading">
            <div>
              <h2>Shared notes</h2>
              <p>Keep important team discussions and ideas in one place.</p>
            </div>
            <button
              className="workspace-secondary-btn"
              onClick={() => setShowNoteForm(true)}
            >
              <Plus size={17} />
              Add Note
            </button>
          </div>

          <div className="workspace-notes-grid">
            {notes.map((note) => (
              <article className="workspace-note-card" key={note.id}>
                <div className="workspace-note-icon">
                  <FileText size={20} />
                </div>
                <h3>{note.title}</h3>
                <p>{note.text}</p>
                <div className="workspace-note-footer">
                  <span>By {note.author}</span>
                  <span>{note.date}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {activeTab === "Team" && (
        <div className="workspace-section">
          <div className="workspace-section-heading">
            <div>
              <h2>Team members</h2>
              <p>Meet the people working across your projects.</p>
            </div>
          </div>

          <div className="workspace-team-grid">
            {teamMembers.map((member) => (
              <article className="workspace-member-card" key={member.initials}>
                <div className={`workspace-member-avatar ${member.color}`}>
                  {member.initials}
                </div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
                <span className="workspace-member-label">Team member</span>
              </article>
            ))}
          </div>
        </div>
      )}

      {showProjectForm && (
        <div className="workspace-modal-backdrop">
          <form className="workspace-form" onSubmit={addProject}>
            <div className="workspace-form-heading">
              <div>
                <span>PROJECT MANAGEMENT</span>
                <h2>Create a project</h2>
              </div>
              <button
                type="button"
                className="workspace-close-btn"
                onClick={() => setShowProjectForm(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <label htmlFor="workspace-project-name">Project name</label>
            <input
              id="workspace-project-name"
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
              placeholder="e.g. Mobile application"
              maxLength={80}
              required
            />

            <label htmlFor="workspace-project-description">Description</label>
            <textarea
              id="workspace-project-description"
              value={projectDescription}
              onChange={(event) => setProjectDescription(event.target.value)}
              placeholder="What is this project about?"
              maxLength={240}
              rows={3}
              required
            />

            <button type="submit" className="workspace-primary-btn">
              <Plus size={18} />
              Create Project
            </button>
            <p className="workspace-demo-note">
              Demo mode: project details are not saved to a database.
            </p>
          </form>
        </div>
      )}

      {showNoteForm && (
        <div className="workspace-modal-backdrop">
          <form className="workspace-form" onSubmit={addNote}>
            <div className="workspace-form-heading">
              <div>
                <span>TEAM COLLABORATION</span>
                <h2>Create a shared note</h2>
              </div>
              <button
                type="button"
                className="workspace-close-btn"
                onClick={() => setShowNoteForm(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <label htmlFor="workspace-note-title">Note title</label>
            <input
              id="workspace-note-title"
              value={noteTitle}
              onChange={(event) => setNoteTitle(event.target.value)}
              placeholder="e.g. Sprint meeting notes"
              maxLength={100}
              required
            />

            <label htmlFor="workspace-note-text">Note content</label>
            <textarea
              id="workspace-note-text"
              value={noteText}
              onChange={(event) => setNoteText(event.target.value)}
              placeholder="Write your notes here..."
              maxLength={2000}
              rows={5}
              required
            />

            <button type="submit" className="workspace-primary-btn">
              <Plus size={18} />
              Save Note
            </button>
            <p className="workspace-demo-note">
              Demo mode: notes are not saved to a database.
            </p>
          </form>
        </div>
      )}
    </section>
  );
}
