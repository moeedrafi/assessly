import { useCallback, useEffect, useRef, useState } from "react";

type EventType =
  | "TAB_HIDDEN"
  | "TAB_VISIBLE"
  | "WINDOW_BLUR"
  | "WINDOW_FOCUS"
  | "FOCUS_LOST"
  | "FOCUS_GAINED"
  | "FULLSCREEN_EXIT"
  | "FULLSCREEN_ENTER";

const MAX_CHEATING = 100;
const EVENT_DEBOUNCE_MS = 1500;

export const useProctoring = (enabled: boolean) => {
  const lastEventRef = useRef<number>(0);
  const [cheating, setCheating] = useState<number>(0);

  const registerViolation = useCallback(() => {
    if (!enabled) return;
    const now = Date.now();

    // Debounce rapid-fire events
    if (now - lastEventRef.current < EVENT_DEBOUNCE_MS) return;
    lastEventRef.current = now;

    setCheating((prev) => prev + 1);
  }, [enabled]);

  const handleEvent = useCallback(
    (event: EventType) => {
      switch (event) {
        case "TAB_HIDDEN":
        case "WINDOW_BLUR":
        case "FOCUS_LOST":
        case "FULLSCREEN_EXIT":
          registerViolation();
          break;
        default:
          // Do nothing for "gain" events
          break;
      }
    },
    [registerViolation],
  );

  // Fullscreen enforcement
  const requestFullscreen = useCallback(async () => {
    const el = document.documentElement;
    if (!document.fullscreenElement) {
      try {
        await el.requestFullscreen();
      } catch (err) {
        console.warn("Fullscreen request failed:", err);
      }
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // Listen for tab visibility
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        handleEvent("TAB_HIDDEN");
      } else {
        handleEvent("TAB_VISIBLE");
      }
    };

    // Listen for window blur/focus
    const handleBlur = () => handleEvent("WINDOW_BLUR");
    const handleFocus = () => handleEvent("WINDOW_FOCUS");

    // Listen for fullscreen changes
    const handleFullscreen = () => {
      if (!document.fullscreenElement) {
        handleEvent("FULLSCREEN_EXIT");
        requestFullscreen(); // re-enforce fullscreen
      } else {
        handleEvent("FULLSCREEN_ENTER");
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("fullscreenchange", handleFullscreen);

    // Try to enter fullscreen on mount
    requestFullscreen();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("fullscreenchange", handleFullscreen);
    };
  }, [enabled, handleEvent, requestFullscreen]);

  // Auto-submit if cheating exceeds max
  useEffect(() => {
    if (cheating >= MAX_CHEATING) {
      console.warn("Max cheating reached! Auto-submitting quiz.");
    }
  }, [cheating]);

  return { cheating, requestFullscreen };
};
