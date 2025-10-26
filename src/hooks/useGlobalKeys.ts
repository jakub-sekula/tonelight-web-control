import { useEffect } from "react";

export function useGlobalKeys(callback: (event: KeyboardEvent) => void) {
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const tag = target.tagName;

      const isEditable =
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target.isContentEditable;

      if (isEditable) return; // ignore when typing in any input

      callback(e);
    };

    window.addEventListener("keyup", handle);
    return () => window.removeEventListener("keyup", handle);
  }, [callback]);
}
