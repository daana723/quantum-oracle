import { useEffect } from "react";
import { toast } from "sonner";

/** Shows a "new version available — refresh" toast when a fresh build is deployed. */
const UpdateNotice = () => {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const inIframe = (() => { try { return window.self !== window.top; } catch { return true; } })();
    if (inIframe || location.hostname.includes("id-preview--")) return;

    const hadController = !!navigator.serviceWorker.controller;
    let shown = false;
    const show = () => {
      if (shown || !hadController) return;
      shown = true;
      toast("A new version of the Oracle is ready", {
        description: "Refresh to see the latest features.",
        duration: Infinity,
        action: { label: "Refresh", onClick: () => window.location.reload() },
      });
    };
    navigator.serviceWorker.addEventListener("controllerchange", show);

    const check = () => navigator.serviceWorker.getRegistrations()
      .then((regs) => regs.forEach((r) => r.update().catch(() => {})));
    check();
    const id = window.setInterval(check, 60_000);
    const onVis = () => document.visibilityState === "visible" && check();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", show);
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);
  return null;
};

export default UpdateNotice;
