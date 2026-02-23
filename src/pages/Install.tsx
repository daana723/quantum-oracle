import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Download, Smartphone, CheckCircle, Share, MoreVertical, Monitor, Globe } from "lucide-react";
import { Link } from "react-router-dom";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type Platform = "ios" | "android" | "desktop";

function detectPlatform(): Platform {
  const ua = navigator.userAgent || "";
  if (/iPad|iPhone|iPod/.test(ua)) return "ios";
  if (/Android/.test(ua)) return "android";
  return "desktop";
}

const steps: Record<Platform, { title: string; icon: React.ReactNode; instructions: { step: string; detail: string }[] }> = {
  ios: {
    title: "iPhone & iPad",
    icon: <Smartphone className="w-5 h-5" />,
    instructions: [
      { step: "Open in Safari", detail: "This must be done in Safari — other browsers don't support it on iOS." },
      { step: "Tap the Share button", detail: "It's the square icon with an upward arrow (⬆) at the bottom of the screen." },
      { step: "Scroll down & tap \"Add to Home Screen\"", detail: "You may need to scroll the share sheet to find it." },
      { step: "Tap \"Add\"", detail: "The oracle will appear as an app icon on your home screen." },
    ],
  },
  android: {
    title: "Android",
    icon: <Smartphone className="w-5 h-5" />,
    instructions: [
      { step: "Open in Chrome", detail: "Chrome works best — other browsers may also support this." },
      { step: "Tap the menu button", detail: "It's the three dots (⋮) in the top-right corner." },
      { step: "Tap \"Install app\" or \"Add to Home Screen\"", detail: "The wording varies by browser version." },
      { step: "Confirm", detail: "The oracle will install as an app on your device." },
    ],
  },
  desktop: {
    title: "Desktop Browser",
    icon: <Monitor className="w-5 h-5" />,
    instructions: [
      { step: "Open in Chrome or Edge", detail: "Firefox and Safari don't fully support PWA install on desktop." },
      { step: "Look for the install icon", detail: "In Chrome, it's a small monitor icon (⊕) in the right side of the address bar." },
      { step: "Click \"Install\"", detail: "Or use the browser menu (⋮) → \"Install Victorian Quantum Veil\"." },
      { step: "Done!", detail: "The oracle will open in its own window, just like a native app." },
    ],
  },
};

const platformOrder: Platform[] = ["ios", "android", "desktop"];

const Install: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const userPlatform = useMemo(() => detectPlatform(), []);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  };

  // Show user's platform first
  const sortedPlatforms = [userPlatform, ...platformOrder.filter((p) => p !== userPlatform)];

  return (
    <>
      <Helmet>
        <title>Install Quantum Veil — Victorian Quantum Veil</title>
        <meta name="description" content="Install the Victorian Quantum Veil tarot oracle as a progressive web app for offline access and instant loading." />
        <meta property="og:title" content="Install Quantum Veil" />
        <meta property="og:description" content="Add the tarot oracle to your home screen for offline access and instant loading." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Install Quantum Veil" />
        <meta name="twitter:description" content="Install the Victorian Quantum Veil oracle as a progressive web app." />
        <link rel="canonical" href="/install" />
      </Helmet>
      <div className="min-h-screen bg-cosmic bg-nebula-overlay bg-vignette flex flex-col items-center px-4 py-12 relative">
        <div className="max-w-lg w-full space-y-8">
          <div className="text-center space-y-4">
            <Smartphone className="w-10 h-10 text-gold/70 mx-auto" />
            <h1 className="font-display text-2xl md:text-3xl text-gold tracking-wider">
              Install Quantum Veil
            </h1>
            <p className="font-body text-foreground/70 leading-relaxed text-sm">
              Add the oracle to your home screen for instant access, offline readings, and a native app experience.
            </p>
          </div>

          {/* Native install button */}
          {isInstalled ? (
            <div className="flex items-center justify-center gap-2 text-gold/80">
              <CheckCircle className="w-5 h-5" />
              <span className="font-display tracking-wider">Already Installed</span>
            </div>
          ) : deferredPrompt ? (
            <div className="flex justify-center">
              <button
                onClick={handleInstall}
                className="px-8 py-3 rounded-full font-display text-base tracking-wider border border-gold/50 text-gold bg-transparent hover:bg-gold/10 hover:border-gold transition-all duration-300 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Install App
              </button>
            </div>
          ) : null}

          {/* Platform-specific instructions */}
          <div className="space-y-4">
            {sortedPlatforms.map((platform) => {
              const data = steps[platform];
              const isCurrentPlatform = platform === userPlatform;
              return (
                <div
                  key={platform}
                  className={`rounded-xl border p-5 transition-all ${
                    isCurrentPlatform
                      ? "border-gold/40 bg-card/80 ring-1 ring-gold/20"
                      : "border-border/30 bg-card/40 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-gold/70">{data.icon}</span>
                    <h2 className="font-display text-sm text-gold tracking-wider">
                      {data.title}
                    </h2>
                    {isCurrentPlatform && (
                      <span className="ml-auto text-[10px] font-display tracking-wider text-gold/60 border border-gold/30 rounded-full px-2 py-0.5">
                        YOUR DEVICE
                      </span>
                    )}
                  </div>
                  <ol className="space-y-3">
                    {data.instructions.map((inst, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs flex items-center justify-center font-display">
                          {i + 1}
                        </span>
                        <div>
                          <p className="font-display text-xs text-foreground/90 tracking-wide">
                            {inst.step}
                          </p>
                          <p className="font-body text-xs text-muted-foreground mt-0.5 leading-relaxed">
                            {inst.detail}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link
              to="/"
              className="inline-block text-gold/50 hover:text-gold font-body text-sm transition-colors"
            >
              ← Return to Oracle
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Install;
