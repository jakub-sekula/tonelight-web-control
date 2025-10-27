import { useEffect, useRef } from "react";

type KeyCallback = (e: KeyboardEvent) => void;
type LongPressCallback = (key: string, isDown: boolean) => void;

export function useGlobalKeys(
  onKeyUp: KeyCallback,
  onLongPress?: LongPressCallback,
  longPressDelay = 400
) {
  const longPressTimers = useRef<Record<string, number>>({});
  const pressed = useRef<Record<string, boolean>>({});
  const activeFeeds = useRef<Set<string>>(new Set()); // <-- track keys that started feeding

  useEffect(() => {
    const isEditableTarget = (target: EventTarget | null) => {
      const el = target as HTMLElement | null;
      if (!el) return false;
      const tag = el.tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        el.isContentEditable
      );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) return;
      const key = e.key.toLowerCase();
      if (pressed.current[key]) return; // ignore repeats
      pressed.current[key] = true;

      if (onLongPress) {
        longPressTimers.current[key] = window.setTimeout(() => {
          activeFeeds.current.add(key);   // mark this key as feeding
          onLongPress(key, true);
        }, longPressDelay);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) return;
      const key = e.key.toLowerCase();

      const t = longPressTimers.current[key];
      if (t) {
        clearTimeout(t);
        delete longPressTimers.current[key];
      }

      // Only call release handler if this key actually long-pressed
      if (onLongPress && activeFeeds.current.has(key)) {
        onLongPress(key, false);
        activeFeeds.current.delete(key);
      }

      delete pressed.current[key];
      onKeyUp(e);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      Object.values(longPressTimers.current).forEach(clearTimeout);
    };
  }, [onKeyUp, onLongPress, longPressDelay]);
}
