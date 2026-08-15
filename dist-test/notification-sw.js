// ============================================================
// Daily Oracle Notification Service Worker
// Fully client-side — no backend, no API calls.
// Uses setTimeout-based alarm loop + periodic background sync.
// ============================================================

const CACHE_NAME = "oracle-notif-v1";
const NOTIFICATION_TAG = "daily-oracle";
const CHECK_INTERVAL = 60 * 1000; // Check every 60s

// ---- Embedded Tarot Data (Major Arcana) ----
const CARDS = [
  { name: "The Fool", message: "A threshold beckons. Trust precedes certainty—the first step creates the bridge.", icon: "🃏" },
  { name: "The Magician", message: "All elements align. Your will shapes reality's clay today.", icon: "✨" },
  { name: "The High Priestess", message: "Behind the veil, truths shimmer. Create silence enough to hear your inner knowing.", icon: "🌙" },
  { name: "The Empress", message: "The garden flourishes where attention flows. Receive as freely as you give.", icon: "🌿" },
  { name: "The Emperor", message: "Order emerges from chaos through will applied consistently. Lead, beginning with yourself.", icon: "👑" },
  { name: "The Hierophant", message: "Ancient wisdom offers well-worn paths. Discern which traditions serve you.", icon: "🔑" },
  { name: "The Lovers", message: "Two paths diverge, each beautiful. Unity begins within.", icon: "💞" },
  { name: "The Chariot", message: "Opposing forces can propel when unified by purpose. You have the reins.", icon: "⚡" },
  { name: "Strength", message: "True strength whispers rather than roars. What wild element awaits gentle recognition?", icon: "🦁" },
  { name: "The Hermit", message: "The lamp illuminates only the next step. In chosen solitude, answers arise.", icon: "🏔️" },
  { name: "Wheel of Fortune", message: "The wheel turns regardless of wish. What rises shall descend; what falls shall rise.", icon: "🎡" },
  { name: "Justice", message: "The scales balance by truth's weight. Clarity regarding what you've set in motion.", icon: "⚖️" },
  { name: "The Hanged Man", message: "Suspension offers what struggle cannot. The world inverts, revealing new passage.", icon: "🔮" },
  { name: "Death", message: "The old form releases for the new to emerge. Metamorphosis, not loss.", icon: "🦋" },
  { name: "Temperance", message: "Between extremes lies the path of power. Hold opposites until they merge.", icon: "🏺" },
  { name: "The Devil", message: "The chains rest loosely. Naming the pattern begins its dissolution.", icon: "🔗" },
  { name: "The Tower", message: "Lightning strikes false foundations. Liberation follows—truth demands acknowledgment.", icon: "⚡" },
  { name: "The Star", message: "After storm, stars emerge. Hope is not wish, but quiet certainty.", icon: "⭐" },
  { name: "The Moon", message: "Not all is as it appears. What fears prowl at the edges of consciousness?", icon: "🌙" },
  { name: "The Sun", message: "Joy as natural state reclaimed. What have you overcomplicated?", icon: "☀️" },
  { name: "Judgement", message: "The trumpet sounds in calling, not condemnation. What calls you to rise?", icon: "📯" },
  { name: "The World", message: "A cycle completes. You arrive at the threshold of new beginning.", icon: "🌍" },
];

// ---- Lunar Phase Calculation ----
function getMoonPhase(date) {
  const knownNewMoon = new Date(2000, 0, 6, 18, 14);
  const daysSince = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  const moonAge = daysSince % 29.53059;
  if (moonAge < 1.85) return { phase: "New Moon", icon: "🌑" };
  if (moonAge < 5.54) return { phase: "Waxing Crescent", icon: "🌒" };
  if (moonAge < 9.23) return { phase: "First Quarter", icon: "🌓" };
  if (moonAge < 12.92) return { phase: "Waxing Gibbous", icon: "🌔" };
  if (moonAge < 16.61) return { phase: "Full Moon", icon: "🌕" };
  if (moonAge < 20.30) return { phase: "Waning Gibbous", icon: "🌖" };
  if (moonAge < 23.99) return { phase: "Last Quarter", icon: "🌗" };
  if (moonAge < 27.68) return { phase: "Waning Crescent", icon: "🌘" };
  return { phase: "New Moon", icon: "🌑" };
}

// ---- Date-seeded card selection (same as app) ----
function dateSeed(dateStr) {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function getDailyCard(date) {
  const dateStr = date.toISOString().slice(0, 10);
  const seed = dateSeed(dateStr);
  return CARDS[seed % CARDS.length];
}

// ---- Notification Logic ----
function getSettings() {
  // In SW scope we can't access localStorage, so we use a message channel
  // Settings are stored via postMessage from the main thread
  return self._notifSettings || { enabled: false, hour: 8, minute: 0, lastNotifDate: "" };
}

async function showDailyNotification() {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const settings = getSettings();

  // Don't show if already shown today
  if (settings.lastNotifDate === todayStr) return;

  const card = getDailyCard(now);
  const moon = getMoonPhase(now);

  await self.registration.showNotification(`${card.icon} ${card.name} — Daily Oracle`, {
    body: `${moon.icon} ${moon.phase} · ${card.message}`,
    icon: "/pwa-192x192.png",
    badge: "/pwa-192x192.png",
    tag: NOTIFICATION_TAG,
    renotify: true,
    data: { url: "/daily", date: todayStr },
    vibrate: [100, 50, 100],
    actions: [
      { action: "open", title: "Read Full Oracle" },
      { action: "dismiss", title: "Dismiss" },
    ],
  });

  // Mark as shown
  settings.lastNotifDate = todayStr;
  self._notifSettings = settings;

  // Notify main thread to persist
  const clients = await self.clients.matchAll({ type: "window" });
  clients.forEach((client) => {
    client.postMessage({ type: "NOTIF_SHOWN", date: todayStr });
  });
}

// ---- Alarm Loop ----
// Checks every minute if it's time to fire the daily notification
function startAlarmLoop() {
  const check = () => {
    const settings = getSettings();
    if (!settings.enabled) return;

    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    if (
      settings.lastNotifDate !== todayStr &&
      now.getHours() >= settings.hour &&
      (now.getHours() > settings.hour || now.getMinutes() >= settings.minute)
    ) {
      showDailyNotification();
    }
  };

  check();
  setInterval(check, CHECK_INTERVAL);
}

// ---- Service Worker Events ----

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
  startAlarmLoop();
});

// Receive settings from main thread
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "UPDATE_NOTIF_SETTINGS") {
    self._notifSettings = {
      enabled: event.data.enabled,
      hour: event.data.hour,
      minute: event.data.minute,
      lastNotifDate: event.data.lastNotifDate || "",
    };
    // Restart check immediately
    if (event.data.enabled) {
      const now = new Date();
      const todayStr = now.toISOString().slice(0, 10);
      if (
        self._notifSettings.lastNotifDate !== todayStr &&
        now.getHours() >= event.data.hour &&
        (now.getHours() > event.data.hour || now.getMinutes() >= event.data.minute)
      ) {
        showDailyNotification();
      }
    }
  }

  if (event.data && event.data.type === "TEST_NOTIFICATION") {
    showDailyNotification();
  }
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  const urlToOpen = event.notification.data?.url || "/daily";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        // Focus existing window if available
        for (const client of windowClients) {
          if (client.url.includes(self.registration.scope)) {
            client.navigate(urlToOpen);
            return client.focus();
          }
        }
        // Open new window
        return self.clients.openWindow(urlToOpen);
      })
  );
});

// Periodic Background Sync (if supported)
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "daily-oracle-sync") {
    event.waitUntil(showDailyNotification());
  }
});

// Regular sync fallback
self.addEventListener("sync", (event) => {
  if (event.tag === "daily-oracle-sync") {
    event.waitUntil(showDailyNotification());
  }
});
