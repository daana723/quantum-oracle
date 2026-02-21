// ============================================================
// Daily Notification Manager — Client-Side Only
// Registers SW, manages permissions, schedules via postMessage
// ============================================================

const SW_PATH = "/notification-sw.js";
const SETTINGS_KEY = "oracle-notif-settings";
const LAST_NOTIF_KEY = "oracle-last-notif-date";

export interface NotifSettings {
  enabled: boolean;
  hour: number;
  minute: number;
}

const DEFAULT_SETTINGS: NotifSettings = { enabled: false, hour: 8, minute: 0 };

// ---- Persistence ----

export function getNotifSettings(): NotifSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {}
  return { ...DEFAULT_SETTINGS };
}

export function saveNotifSettings(settings: NotifSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function getLastNotifDate(): string {
  return localStorage.getItem(LAST_NOTIF_KEY) || "";
}

function setLastNotifDate(date: string): void {
  localStorage.setItem(LAST_NOTIF_KEY, date);
}

// ---- Service Worker Registration ----

let swRegistration: ServiceWorkerRegistration | null = null;

export async function registerNotificationSW(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) return null;

  try {
    swRegistration = await navigator.serviceWorker.register(SW_PATH, { scope: "/" });

    // Listen for "shown" messages from SW
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data?.type === "NOTIF_SHOWN") {
        setLastNotifDate(event.data.date);
      }
    });

    // Push current settings to SW
    await syncSettingsToSW();

    // Try registering periodic background sync
    await registerPeriodicSync();

    return swRegistration;
  } catch (err) {
    console.warn("Notification SW registration failed:", err);
    return null;
  }
}

async function registerPeriodicSync(): Promise<void> {
  if (!swRegistration) return;
  try {
    // @ts-ignore - periodicSync is not in all TS defs
    const status = await navigator.permissions.query({ name: "periodic-background-sync" });
    if (status.state === "granted" && "periodicSync" in swRegistration) {
      // @ts-ignore
      await swRegistration.periodicSync.register("daily-oracle-sync", {
        minInterval: 24 * 60 * 60 * 1000, // 24 hours
      });
    }
  } catch {
    // Periodic sync not supported — alarm loop in SW is the fallback
  }
}

// ---- Permission Flow ----

export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (!("Notification" in window)) return "unsupported";
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission | "unsupported"> {
  if (!("Notification" in window)) return "unsupported";
  const result = await Notification.requestPermission();
  return result;
}

// ---- Sync Settings to SW ----

export async function syncSettingsToSW(): Promise<void> {
  if (!swRegistration?.active) {
    // Wait for SW to activate
    await new Promise<void>((resolve) => {
      if (!swRegistration) { resolve(); return; }
      const sw = swRegistration.installing || swRegistration.waiting;
      if (!sw) { resolve(); return; }
      sw.addEventListener("statechange", () => {
        if (sw.state === "activated") resolve();
      });
      // If already active
      if (swRegistration.active) resolve();
    });
  }

  const settings = getNotifSettings();
  const lastDate = getLastNotifDate();

  swRegistration?.active?.postMessage({
    type: "UPDATE_NOTIF_SETTINGS",
    enabled: settings.enabled,
    hour: settings.hour,
    minute: settings.minute,
    lastNotifDate: lastDate,
  });
}

// ---- Enable / Disable ----

export async function enableNotifications(hour: number, minute: number): Promise<boolean> {
  const perm = await requestNotificationPermission();
  if (perm !== "granted") return false;

  if (!swRegistration) {
    await registerNotificationSW();
  }

  saveNotifSettings({ enabled: true, hour, minute });
  await syncSettingsToSW();
  return true;
}

export async function disableNotifications(): Promise<void> {
  saveNotifSettings({ enabled: false, hour: 8, minute: 0 });
  await syncSettingsToSW();
}

// ---- Test Notification ----

export function sendTestNotification(): void {
  swRegistration?.active?.postMessage({ type: "TEST_NOTIFICATION" });
}

// ---- App Visibility Fallback ----
// When the app is open, schedule a setTimeout to the next notification time
// This catches cases where the SW alarm loop isn't running

export function scheduleAppFallback(): void {
  const settings = getNotifSettings();
  if (!settings.enabled) return;

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const lastDate = getLastNotifDate();

  if (lastDate === todayStr) return; // Already shown

  const target = new Date();
  target.setHours(settings.hour, settings.minute, 0, 0);

  if (now >= target) {
    // Should have fired already — trigger now
    sendTestNotification();
    return;
  }

  const delay = target.getTime() - now.getTime();
  setTimeout(() => {
    sendTestNotification();
  }, delay);
}
