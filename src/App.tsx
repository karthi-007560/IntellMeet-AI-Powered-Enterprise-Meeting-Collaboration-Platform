
import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "../src/assets/components/AppLayout";
import DashboardPage from "../src/assets/pages/DashboardPage";
import WorkspacePage from "../src/assets/pages/WorkspacePage";
import AnalyticsPage from "../src/assets/pages/AnalyticsPage";
import SettingsPage from "../src/assets/pages/SettingsPage";
import NotificationsPage from "../src/assets/pages/NotificationsPage";
import MeetingsPage from "../src/assets/pages/MeetingsPage";
import TasksPage from "../src/assets/pages/TasksPage";
import MeetingHistoryPage from "../src/assets/pages/MeetingHistoryPage";
function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />

        <Route path="/meetings" element={<MeetingsPage />} />

        <Route path="/tasks" element={<TasksPage />} />

        <Route path="/workspace" element={<WorkspacePage />} />

        <Route path="/analytics" element={<AnalyticsPage />} />

        <Route path="/settings" element={<SettingsPage />} />

        <Route
          path="/notifications"
          element={<NotificationsPage />}
        />

        <Route
  path="/meeting-history"
  element={<MeetingHistoryPage />}
/>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
