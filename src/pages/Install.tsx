import React, { useState, useEffect } from "react";
import { Download, Smartphone, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

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

  return (
    <div className="min-h-screen bg-cosmic bg-nebula-overlay bg-vignette flex flex-col items-center justify-center px-4 relative">
      <div className="max-w-md w-full text-center space-y-8">
        <Smartphone className="w-12 h-12 text-gold/70 mx-auto" />

        <h1 className="font-display text-2xl md:text-3xl text-gold tracking-wider">
          Install Quantum Veil
        </h1>

        <p className="font-body text-foreground/70 leading-relaxed">
          Add the oracle to your home screen for instant access. 
          Works offline, loads instantly, and feels like a native app.
        </p>

        {isInstalled ? (
          <div className="flex items-center justify-center gap-2 text-gold/80">
            <CheckCircle className="w-5 h-5" />
            <span className="font-display tracking-wider">Already Installed</span>
          </div>
        ) : deferredPrompt ? (
          <button
            onClick={handleInstall}
            className="px-8 py-3 rounded-full font-display text-base tracking-wider border border-gold/50 text-gold bg-transparent hover:bg-gold/10 hover:border-gold transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <Download className="w-4 h-4" />
            Install App
          </button>
        ) : (
          <div className="space-y-4 text-left font-body text-sm text-foreground/70">
            <p className="text-center text-gold/60 font-display text-sm tracking-wider">
              How to Install
            </p>
            <div className="space-y-3">
              <p><strong className="text-gold/80">iPhone/iPad:</strong> Tap the Share button <span className="text-gold/60">(⬆)</span> → "Add to Home Screen"</p>
              <p><strong className="text-gold/80">Android:</strong> Tap the menu <span className="text-gold/60">(⋮)</span> → "Install app" or "Add to Home Screen"</p>
              <p><strong className="text-gold/80">Desktop:</strong> Look for the install icon in your browser's address bar</p>
            </div>
          </div>
        )}

        <Link
          to="/"
          className="inline-block mt-4 text-gold/50 hover:text-gold font-body text-sm transition-colors"
        >
          ← Return to Oracle
        </Link>
      </div>
    </div>
  );
};

export default Install;
