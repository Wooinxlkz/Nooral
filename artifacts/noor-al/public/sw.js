/* NoorAl Service Worker — Quran Reading Reminders */

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

/* Schedule a notification at a given HH:MM time */
function msUntil(hhmm) {
  const now = new Date();
  const [hh, mm] = hhmm.split(":").map(Number);
  const target = new Date(now);
  target.setHours(hh, mm, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  return target - now;
}

let scheduledTimer = null;

function scheduleNext(time, streak) {
  if (scheduledTimer) clearTimeout(scheduledTimer);
  const delay = msUntil(time);
  scheduledTimer = setTimeout(() => {
    self.registration.showNotification("Time to read Quran 📖", {
      body: streak > 0
        ? `You're on a ${streak}-day streak! Keep it going.`
        : "Open NoorAl and continue your journey.",
      icon: "/favicon.svg",
      badge: "/favicon.svg",
      tag: "quran-reminder",
      renotify: true,
      data: { url: "/reader" },
    });
    scheduleNext(time, streak); // reschedule for tomorrow
  }, delay);
}

self.addEventListener("message", (e) => {
  if (e.data?.type === "SCHEDULE_REMINDER") {
    const { time, streak } = e.data;
    scheduleNext(time, streak ?? 0);
  }
  if (e.data?.type === "CANCEL_REMINDER") {
    if (scheduledTimer) clearTimeout(scheduledTimer);
    scheduledTimer = null;
  }
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = e.notification.data?.url ?? "/reader";
  e.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(url)) return client.focus();
      }
      return self.clients.openWindow(url);
    })
  );
});
