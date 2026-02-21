import React, { useState, useEffect } from "react";
import { Bell, BellOff, BellRing, Clock, Send } from "lucide-react";
import {
  getNotifSettings,
  enableNotifications,
  disableNotifications,
  getNotificationPermission,
  sendTestNotification,
  type NotifSettings,
} from "@/lib/dailyNotifications";

interface NotificationSettingsProps {
  onClose?: () => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ onClose }) => {
  const [settings, setSettings] = useState<NotifSettings>(getNotifSettings);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");
  const [hour, setHour] = useState(settings.hour);
  const [minute, setMinute] = useState(settings.minute);
  const [saving, setSaving] = useState(false);
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    setPermission(getNotificationPermission());
  }, []);

  const handleEnable = async () => {
    setSaving(true);
    const ok = await enableNotifications(hour, minute);
    if (ok) {
      setSettings({ enabled: true, hour, minute });
      setPermission("granted");
    } else {
      setPermission(getNotificationPermission());
    }
    setSaving(false);
  };

  const handleDisable = async () => {
    await disableNotifications();
    setSettings({ enabled: false, hour: 8, minute: 0 });
  };

  const handleTest = () => {
    sendTestNotification();
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  const formatTime = (h: number, m: number) => {
    const period = h >= 12 ? "PM" : "AM";
    const displayH = h % 12 || 12;
    return `${displayH}:${m.toString().padStart(2, "0")} ${period}`;
  };

  if (permission === "unsupported") {
    return (
      <div className="p-5 text-center space-y-3">
        <BellOff className="w-8 h-8 text-muted-foreground mx-auto" />
        <p className="font-body text-sm text-muted-foreground">
          Notifications are not supported in this browser.
        </p>
      </div>
    );
  }

  if (permission === "denied") {
    return (
      <div className="p-5 text-center space-y-3">
        <BellOff className="w-8 h-8 text-destructive/60 mx-auto" />
        <p className="font-body text-sm text-muted-foreground">
          Notification permission was denied. Please enable notifications in your browser settings to receive daily oracle messages.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {settings.enabled ? (
            <BellRing className="w-5 h-5 text-primary" />
          ) : (
            <Bell className="w-5 h-5 text-muted-foreground" />
          )}
          <span className="font-display text-sm tracking-wider text-foreground">
            {settings.enabled ? "Daily Oracle Active" : "Daily Oracle Notifications"}
          </span>
        </div>
        {settings.enabled && (
          <span className="text-xs font-body text-primary/70">
            {formatTime(settings.hour, settings.minute)}
          </span>
        )}
      </div>

      {!settings.enabled ? (
        <>
          <p className="font-body text-xs text-muted-foreground leading-relaxed">
            Receive a daily tarot card and lunar phase message at your chosen time.
            Works offline — all data is stored locally on your device.
          </p>

          {/* Time picker */}
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min={0}
                max={23}
                value={hour}
                onChange={(e) => setHour(Math.max(0, Math.min(23, Number(e.target.value))))}
                className="w-14 px-2 py-1.5 rounded bg-card border border-border text-center text-sm font-body text-foreground focus:border-primary focus:outline-none"
                aria-label="Hour"
              />
              <span className="text-muted-foreground font-body">:</span>
              <input
                type="number"
                min={0}
                max={59}
                step={5}
                value={minute}
                onChange={(e) => setMinute(Math.max(0, Math.min(59, Number(e.target.value))))}
                className="w-14 px-2 py-1.5 rounded bg-card border border-border text-center text-sm font-body text-foreground focus:border-primary focus:outline-none"
                aria-label="Minute"
              />
              <span className="text-xs text-muted-foreground font-body ml-1">
                ({formatTime(hour, minute)})
              </span>
            </div>
          </div>

          <button
            onClick={handleEnable}
            disabled={saving}
            className="w-full px-6 py-2.5 rounded-full font-display text-sm tracking-wider border border-primary/50 text-primary bg-primary/10 hover:bg-primary/20 transition-all disabled:opacity-50"
          >
            {saving ? "Enabling…" : "Enable Daily Notifications"}
          </button>
        </>
      ) : (
        <div className="space-y-3">
          <p className="font-body text-xs text-muted-foreground leading-relaxed">
            You'll receive your daily oracle at {formatTime(settings.hour, settings.minute)}.
            Each message includes the day's tarot card and current moon phase.
          </p>

          <div className="flex gap-2">
            <button
              onClick={handleTest}
              disabled={testSent}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-full font-display text-xs tracking-wider border border-primary/30 text-primary/80 hover:bg-primary/10 transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {testSent ? "Sent!" : "Test Notification"}
            </button>
            <button
              onClick={handleDisable}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-full font-display text-xs tracking-wider border border-destructive/30 text-destructive/70 hover:bg-destructive/10 transition-all"
            >
              <BellOff className="w-3.5 h-3.5" />
              Disable
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSettings;
