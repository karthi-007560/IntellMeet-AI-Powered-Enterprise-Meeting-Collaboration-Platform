
import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Circle,
  ClipboardList,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import type { Task } from "../components/TaskList";
import "./TasksPage.css";

type TaskFilter = "All" | "Pending" | "Completed";
type Priority = "High" | "Medium" | "Low";

const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "Prepare project sprint plan",
    project: "IntellMeet",
    dueDate: "2026-10-14",
    priority: "High",
    completed: false,
  },
  {
    id: "task-2",
    title: "Review meeting notes",
    project: "Team Collaboration",
    dueDate: "2026-10-15",
    priority: "Medium",
    completed: false,
  },
  {
    id: "task-3",
    title: "Update UI component library",
    project: "Frontend Development",
    dueDate: "2026-10-17",
    priority: "High",
    completed: true,
  },
  {
    id: "task-4",
    title: "Share weekly progress",
    project: "Team Collaboration",
    dueDate: "2026-10-18",
    priority: "Low",
    completed: false,
  },
  {
    id: "task-5",
    title: "Test responsive layouts",
    project: "IntellMeet",
    dueDate: "2026-10-19",
    priority: "Medium",
    completed: false,
  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<TaskFilter>("All");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [project, setProject] = useState("IntellMeet");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");

  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.length - completedCount;
  const progress =
    tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  const visibleTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesFilter =
        filter === "All" ||
        (filter === "Completed" && task.completed) ||
        (filter === "Pending" && !task.completed);

      const query = search.trim().toLowerCase();
      const matchesSearch =
        task.title.toLowerCase().includes(query) ||
        task.project.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [tasks, filter, search]);

  function toggleTask(taskId: string) {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function addTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      project: project.trim(),
      dueDate,
      priority,
      completed: false,
    };

    setTasks((current) => [newTask, ...current]);
    setTitle("");
    setProject("IntellMeet");
    setDueDate("");
    setPriority("Medium");
    setFilter("All");
    setSearch("");
    setShowForm(false);
  }

  function deleteTask(taskId: string) {
    setTasks((current) => current.filter((task) => task.id !== taskId));
  }

  return (
    <section className="tasks-page">
      <SectionHeading
        eyebrow="WORK MANAGEMENT"
        title="My Tasks"
        subtitle="Organize your work, track priorities, and get things done."
        action={
          <button
            className="tasks-primary-btn"
            onClick={() => setShowForm(true)}
          >
            <Plus size={18} />
            Add Task
          </button>
        }
      />

      <div className="tasks-stats">
        <article className="tasks-stat-card">
          <div className="tasks-stat-icon purple">
            <ClipboardList size={21} />
          </div>
          <span>Total tasks</span>
          <strong>{tasks.length}</strong>
          <small>Tasks in your workspace</small>
        </article>

        <article className="tasks-stat-card">
          <div className="tasks-stat-icon orange">
            <Circle size={21} />
          </div>
          <span>Pending</span>
          <strong>{pendingCount}</strong>
          <small>Waiting to be completed</small>
        </article>

        <article className="tasks-stat-card">
          <div className="tasks-stat-icon green">
            <CheckCircle2 size={21} />
          </div>
          <span>Completed</span>
          <strong>{completedCount}</strong>
          <small>Tasks finished</small>
        </article>

        <article className="tasks-stat-card tasks-progress-card">
          <span>Completion rate</span>
          <strong>{progress}%</strong>
          <div
            className="tasks-progress-track"
            role="progressbar"
            aria-label="Task completion rate"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div style={{ width: `${progress}%` }} />
          </div>
          <small>Overall task progress</small>
        </article>
      </div>

      <div className="tasks-toolbar">
        <div className="tasks-search">
          <Search size={18} />
          <input
            type="search"
            placeholder="Search tasks or projects..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="tasks-filter-tabs">
          {(["All", "Pending", "Completed"] as TaskFilter[]).map((item) => (
            <button
              key={item}
              className={filter === item ? "active" : ""}
              onClick={() => setFilter(item)}
            >
              {item}
              <span>
                {item === "All"
                  ? tasks.length
                  : item === "Pending"
                    ? pendingCount
                    : completedCount}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="tasks-list-panel">
        <div className="tasks-list-heading">
          <div>
            <h2>Task list</h2>
            <p>Your work, organized in one place.</p>
          </div>
          <span className="tasks-result-count">
            {visibleTasks.length} tasks
          </span>
        </div>

        {visibleTasks.length === 0 ? (
          <div className="tasks-empty">
            <ClipboardList size={35} />
            <h3>No tasks found</h3>
            <p>Try another search or add a new task.</p>
            <button
              className="tasks-primary-btn"
              onClick={() => setShowForm(true)}
            >
              <Plus size={17} />
              Add Task
            </button>
          </div>
        ) : (
          <div className="tasks-table-wrap">
            <table className="tasks-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Project</th>
                  <th>Due date</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {visibleTasks.map((task) => (
                  <tr key={task.id}>
                    <td>
                      <button
                        className={`task-check ${task.completed ? "checked" : ""}`}
                        onClick={() => toggleTask(task.id)}
                        aria-label={
                          task.completed ? "Mark pending" : "Mark completed"
                        }
                      >
                        {task.completed ? (
                          <CheckCircle2 size={19} />
                        ) : (
                          <Circle size={19} />
                        )}
                      </button>
                      <span
                        className={`task-title ${task.completed ? "done" : ""}`}
                      >
                        {task.title}
                      </span>
                    </td>
                    <td>
                      <span className="task-project">{task.project}</span>
                    </td>
                    <td>
                      <span className="task-date">
                        {task.dueDate
                          ? new Date(`${task.dueDate}T12:00:00`).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "No date"}
                      </span>
                    </td>
                    <td>
                      <span className={`task-priority ${task.priority.toLowerCase()}`}>
                        <span />
                        {task.priority}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`task-status ${task.completed ? "complete" : "pending"}`}
                      >
                        {task.completed ? "Completed" : "Pending"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="task-delete-btn"
                        onClick={() => deleteTask(task.id)}
                        aria-label={`Delete ${task.title}`}
                        title="Delete task"
                      >
                        <Trash2 size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="tasks-modal-backdrop">
          <form className="tasks-form" onSubmit={addTask}>
            <div className="tasks-form-heading">
              <div>
                <span>WORK MANAGEMENT</span>
                <h2>Create a task</h2>
              </div>
              <button
                type="button"
                className="tasks-close-btn"
                onClick={() => setShowForm(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <label htmlFor="task-title">Task name</label>
            <input
              id="task-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="What needs to be done?"
              required
              maxLength={120}
            />

            <label htmlFor="task-project">Project</label>
            <input
              id="task-project"
              value={project}
              onChange={(event) => setProject(event.target.value)}
              placeholder="Project name"
              required
              maxLength={80}
            />

            <label htmlFor="task-due-date">Due date</label>
            <input
              id="task-due-date"
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              required
            />

            <label htmlFor="task-priority">Priority</label>
            <select
              id="task-priority"
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value as Priority)
              }
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <button type="submit" className="tasks-submit-btn">
              <Plus size={18} />
              Create Task
            </button>
            <p className="tasks-demo-note">
              Demo mode: tasks are held in page memory and are not saved to a database.
            </p>
          </form>
        </div>
      )}
    </section>
  );
}
