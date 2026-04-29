// Telegram Mini App helpers
// Docs: https://core.telegram.org/bots/webapps

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name?: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
    start_param?: string;
  };
  version: string;
  platform: string;
  colorScheme: "light" | "dark";
  themeParams: Record<string, string>;
  isExpanded: boolean;
  viewportHeight: number;
  ready: () => void;
  expand: () => void;
  close: () => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  HapticFeedback?: {
    impactOccurred: (style: "light" | "medium" | "heavy") => void;
    notificationOccurred: (type: "error" | "success" | "warning") => void;
  };
}

export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window === "undefined") return null;
  return window.Telegram?.WebApp ?? null;
}

export function isTelegramMiniApp(): boolean {
  const tg = getTelegramWebApp();
  return !!tg && !!tg.initData;
}

/**
 * Initialize the Telegram Mini App: signal ready, expand to full height,
 * and align colors with the Victorian Quantum Veil palette.
 */
export function initTelegramMiniApp(): void {
  const tg = getTelegramWebApp();
  if (!tg) return;

  try {
    tg.ready();
    tg.expand();
    // Match the burgundy theme (#1a0d10)
    tg.setHeaderColor("#1a0d10");
    tg.setBackgroundColor("#1a0d10");
  } catch (err) {
    console.warn("[Telegram] init failed", err);
  }
}

export function telegramHaptic(
  type: "light" | "medium" | "heavy" = "light",
): void {
  getTelegramWebApp()?.HapticFeedback?.impactOccurred(type);
}
