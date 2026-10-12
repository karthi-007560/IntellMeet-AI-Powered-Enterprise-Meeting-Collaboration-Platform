
import { useEffect, useState } from "react";
import {
  UserRound,
  Bell,
  SlidersHorizontal,
  Video,
  Save,
  CheckCircle2,
  Monitor,
} from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import "./SettingsPage.css";

type Settings = {
  name: string;
  email: string;
  role: string;
  theme: string;
  language: string;
  timezone: string;
  emailNotifications: boolean;
  meetingReminders: boolean;
  taskNotifications: boolean;
  cameraEnabled: boolean;
  microphoneEnabled: boolean;
};

const defaultSettings: Settings = {
  name: "Karthik",
  email: "karthik@example.com",
  role: "Frontend Developer",
  theme: "Light",
  language: "English",
  timezone: "Asia/Kolkata",
  emailNotifications: true,
  meetingReminders: true,
  taskNotifications: false,
  cameraEnabled: true,
  microphoneEnabled: true,
};

const storageKey = "intellmeet_settings";

function readSettings(): Settings {
  try {
    const saved = localStorage.getItem(storageKey);
    return saved
      ? { ...defaultSettings, ...JSON.parse(saved) }
      : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(readSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const timer = window.setTimeout(() => setSaved(false), 2500);
    return () => window.clearTimeout(timer);
  }, [saved]);

  function update<K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) {
    setSettings((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function saveSettings() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(settings));
      setSaved(true);
    } catch {
      window.alert("Settings could not be saved in this browser.");
    }
  }

  function resetSettings() {
    setSettings(defaultSettings);
    try {
      localStorage.removeItem(storageKey);
      setSaved(true);
    } catch {
      setSaved(false);
    }
  }

  return (
    <section className="settings-page">
      <SectionHeading
        eyebrow="PERSONALIZE YOUR EXPERIENCE"
        title="Settings"
        subtitle="Manage your profile, notifications and meeting preferences."
      />

      <div className="settings-profile-banner">
        <div className="settings-avatar">
          {settings.name.trim().charAt(0).toUpperCase() || "U"}
        </div>
        <div className="settings-profile-info">
          <h2>{settings.name || "Your name"}</h2>
          <p>{settings.email || "Your email"}</p>
          <span>{settings.role}</span>
        </div>
        <div className="settings-profile-badge">
          <CheckCircle2 size={15} />
          Local profile
        </div>
      </div>

      <div className="settings-layout">
        <div className="settings-main">
          <article className="settings-card">
            <div className="settings-card-heading">
              <div className="settings-heading-icon purple">
                <UserRound size={19} />
              </div>
              <div>
                <h2>Profile information</h2>
                <p>Update your personal information.</p>
              </div>
            </div>

            <div className="settings-form-grid">
              <label className="settings-field">
                <span>Full name</span>
                <input
                  value={settings.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Enter your name"
                />
              </label>

              <label className="settings-field">
                <span>Email address</span>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@example.com"
                />
              </label>

              <label className="settings-field settings-full-width">
                <span>Role</span>
                <input
                  value={settings.role}
                  onChange={(e) => update("role", e.target.value)}
                  placeholder="Your job role"
                />
              </label>
            </div>
          </article>

          <article className="settings-card">
            <div className="settings-card-heading">
              <div className="settings-heading-icon blue">
                <Monitor size={19} />
              </div>
              <div>
                <h2>Appearance & preferences</h2>
                <p>Choose how IntellMeet looks and behaves.</p>
              </div>
            </div>

            <div className="settings-form-grid">
              <label className="settings-field">
                <span>Theme</span>
                <select
                  value={settings.theme}
                  onChange={(e) => update("theme", e.target.value)}
                >
                  <option>Light</option>
                  <option>Dark</option>
                  <option>System</option>
                </select>
              </label>

              <label className="settings-field">
                <span>Language</span>
                <select
                  value={settings.language}
                  onChange={(e) => update("language", e.target.value)}
                >
                  <option>English</option>
                  <option>Tamil</option>
                  <option>Hindi</option>
                </select>
              </label>

              <label className="settings-field settings-full-width">
                <span>Timezone</span>
                <select
                  value={settings.timezone}
                  onChange={(e) => update("timezone", e.target.value)}
                >
                  <option value="Asia/Kolkata">
                    India Standard Time (IST)
                  </option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">
                    Eastern Time
                  </option>
                  <option value="Europe/London">
                    London Time
                  </option>
                </select>
              </label>
            </div>

            <p className="settings-helper">
              These preferences are stored locally. Theme selection does not
              automatically change the entire app theme yet.
            </p>
          </article>

          <article className="settings-card">
            <div className="settings-card-heading">
              <div className="settings-heading-icon orange">
                <Bell size={19} />
              </div>
              <div>
                <h2>Notifications</h2>
                <p>Choose which reminders you want to enable.</p>
              </div>
            </div>

            <div className="settings-toggle-list">
              <div className="settings-toggle-row">
                <div>
                  <strong>Email notifications</strong>
                  <span>Receive product updates by email.</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.emailNotifications}
                  className={`settings-switch ${
                    settings.emailNotifications ? "on" : ""
                  }`}
                  onClick={() =>
                    update(
                      "emailNotifications",
                      !settings.emailNotifications
                    )
                  }
                >
                  <span />
                </button>
              </div>

              <div className="settings-toggle-row">
                <div>
                  <strong>Meeting reminders</strong>
                  <span>Remind you about upcoming meetings.</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.meetingReminders}
                  className={`settings-switch ${
                    settings.meetingReminders ? "on" : ""
                  }`}
                  onClick={() =>
                    update("meetingReminders", !settings.meetingReminders)
                  }
                >
                  <span />
                </button>
              </div>

              <div className="settings-toggle-row">
                <div>
                  <strong>Task notifications</strong>
                  <span>Get updates about assigned tasks.</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.taskNotifications}
                  className={`settings-switch ${
                    settings.taskNotifications ? "on" : ""
                  }`}
                  onClick={() =>
                    update("taskNotifications", !settings.taskNotifications)
                  }
                >
                  <span />
                </button>
              </div>
            </div>
          </article>

          <article className="settings-card">
            <div className="settings-card-heading">
              <div className="settings-heading-icon green">
                <Video size={19} />
              </div>
              <div>
                <h2>Meeting preferences</h2>
                <p>Set your preferred camera and microphone states.</p>
              </div>
            </div>

            <div className="settings-toggle-list">
              <div className="settings-toggle-row">
                <div>
                  <strong>Camera enabled by default</strong>
                  <span>Preferred camera state when joining meetings.</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.cameraEnabled}
                  className={`settings-switch ${
                    settings.cameraEnabled ? "on" : ""
                  }`}
                  onClick={() =>
                    update("cameraEnabled", !settings.cameraEnabled)
                  }
                >
                  <span />
                </button>
              </div>

              <div className="settings-toggle-row">
                <div>
                  <strong>Microphone enabled by default</strong>
                  <span>Preferred microphone state when joining meetings.</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.microphoneEnabled}
                  className={`settings-switch ${
                    settings.microphoneEnabled ? "on" : ""
                  }`}
                  onClick={() =>
                    update("microphoneEnabled", !settings.microphoneEnabled)
                  }
                >
                  <span />
                </button>
              </div>
            </div>
          </article>

          <div className="settings-actions">
            <button
              type="button"
              className="settings-reset-btn"
              onClick={resetSettings}
            >
              Reset defaults
            </button>

            <button
              type="button"
              className="settings-save-btn"
              onClick={saveSettings}
            >
              <Save size={17} />
              Save settings
            </button>
          </div>

          {saved && (
            <div className="settings-saved-message" role="status">
              <CheckCircle2 size={17} />
              Settings saved in this browser!
            </div>
          )}
        </div>

        <aside className="settings-side">
          <div className="settings-side-card">
            <div className="settings-side-icon">
              <SlidersHorizontal size={21} />
            </div>
            <h3>Your workspace, your way.</h3>
            <p>
              Personalize your IntellMeet experience with your preferred
              profile, reminders and meeting defaults.
            </p>
          </div>

          <div className="settings-side-card settings-local-card">
            <h3>Storage information</h3>
            <p>
              Settings are stored in this browser using localStorage.
              They are not synced to an account or another device.
            </p>
            <span>
              <CheckCircle2 size={15} />
              Frontend demo
            </span>
          </div>
        </aside>
      </div>
    </section>
  );
}
