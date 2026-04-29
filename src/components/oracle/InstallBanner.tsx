import React, { useState, useEffect, useMemo } from "react";
import { Download, X, Share, MoreVertical, Monitor } from "lucide-react";
import { isTelegramMiniApp } from "@/lib/telegramMiniApp";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "pwa-banner-dismissed";
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

type Platform = "ios" | "android" | "desktop";

function detectPlatform(): Platform {
  const ua = navigator.userAgent || "";
  if (/iPad|iPhone|iPod/.test(ua)) return "ios";
  if (/Android/.test(ua)) return "android";
  return "desktop";
}

const InstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [visible, setVisible] = useState(false);
  const platform = useMemo(() => detectPlatform(), []);

  useEffect(() => {
    // Hide banner when running inside Telegram Mini App — install doesn't apply there
    if (isTelegramMiniApp()) {
      setIsInstalled(true);
      return;
    }
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt && Date.now() - Number(dismissedAt) < DISMISS_DURATION) {
      return;
    }

    setDismissed(false);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    const timer = setTimeout(() => setVisible(true), 3000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(timer);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setIsInstalled(true);
      setDeferredPrompt(null);
    }
    handleDismiss();
  };

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setTimeout(() => setDismissed(true), 400);
  };

  if (isInstalled || dismissed) return null;

  const platformInstructions = {
    ios: {
      icon: <Share className="w-4 h-4 text-primary inline-block" />,
      text: (
        <>Tap <Share className="w-3.5 h-3.5 inline-block text-primary mx-0.5 -mt-0.5" /> Share then <span className="text-primary font-medium">"Add to Home Screen"</span></>
      ),
    },
    android: {
      icon: <MoreVertical className="w-4 h-4 text-primary inline-block" />,
      text: (
        <>Tap <MoreVertical className="w-3.5 h-3.5 inline-block text-primary mx-0.5 -mt-0.5" /> menu then <span className="text-primary font-medium">"Install app"</span></>
      ),
    },
    desktop: {
      icon: <Monitor className="w-4 h-4 text-primary inline-block" />,
      text: (
        <>Use your browser menu → <span className="text-primary font-medium">"Install app"</span> or press <kbd className="px-1 py-0.5 rounded bg-muted text-xs font-mono">Ctrl+D</kbd></>
      ),
    },
  };

  const instructions = platformInstructions[platform];

  return (
    <div
      className={`
        fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md
        transition-all duration-500 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"}
      `}
    >
      <div className="relative rounded-xl border border-gold/30 bg-card/95 backdrop-blur-md p-4 glow-gold-rose">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="mt-0.5 p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Download className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display text-sm text-primary tracking-wider">
              Install the Oracle
            </p>
            {deferredPrompt ? (
              <>
                <p className="font-body text-xs text-muted-foreground mt-1 leading-relaxed">
                  Add to your home screen for offline readings and instant access.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={handleInstall}
                    className="px-4 py-1.5 rounded-full font-display text-xs tracking-wider border border-primary/50 text-primary bg-primary/10 hover:bg-primary/20 transition-all"
                  >
                    Install Now
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="px-3 py-1.5 font-body text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Not now
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="font-body text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  {instructions.text}
                </p>
                <button
                  onClick={handleDismiss}
                  className="mt-2 px-3 py-1 font-body text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Got it
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallBanner;
