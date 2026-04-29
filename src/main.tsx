import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerNotificationSW, scheduleAppFallback } from "./lib/dailyNotifications";
import { initTelegramMiniApp } from "./lib/telegramMiniApp";

// Initialize Telegram Mini App SDK (no-op outside Telegram)
initTelegramMiniApp();

createRoot(document.getElementById("root")!).render(<App />);

// Register notification service worker & set up app-level fallback
registerNotificationSW().then(() => {
  scheduleAppFallback();
});
