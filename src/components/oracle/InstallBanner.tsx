import React, { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "pwa-banner-dismissed";
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

const InstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(true); // start hidden
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Check if dismissed recently
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

    // Show banner after a short delay for non-Chrome/Android users too
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
            <p className="font-body text-xs text-muted-foreground mt-1 leading-relaxed">
              Add to your home screen for offline readings, instant access, and a native app experience.
            </p>
            <div className="flex items-center gap-2 mt-3">
              {deferredPrompt ? (
                <button
                  onClick={handleInstall}
                  className="px-4 py-1.5 rounded-full font-display text-xs tracking-wider border border-primary/50 text-primary bg-primary/10 hover:bg-primary/20 transition-all"
                >
                  Install Now
                </button>
              ) : (
                <a
                  href="/install"
                  className="px-4 py-1.5 rounded-full font-display text-xs tracking-wider border border-primary/50 text-primary bg-primary/10 hover:bg-primary/20 transition-all"
                >
                  How to Install
                </a>
              )}
              <button
                onClick={handleDismiss}
                className="px-3 py-1.5 font-body text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallBanner;
