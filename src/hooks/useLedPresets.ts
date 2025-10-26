import { useCallback, useEffect, useRef, useState } from "react";
import { useSerial } from "@/SerialDeviceProvider";

export interface LedPanelState {
  r: number;
  g: number;
  b: number;
  w: number;
  ir: number;
  channel: number;
}

export interface LedPreset {
  name: string;
  slots: LedPanelState[]; // exactly 3
}

const STORAGE_KEY = "tonelight-presets";

// --- Default presets ---
const DEFAULT_PRESETS: LedPreset[] = [
  {
    name: "Basic RGB",
    slots: [
      { r: 1023, g: 0, b: 0, w: 0, ir: 0, channel: 0 },
      { r: 0, g: 1023, b: 0, w: 0, ir: 0, channel: 1 },
      { r: 0, g: 0, b: 1023, w: 0, ir: 0, channel: 2 },
    ],
  },
  {
    name: "Blank",
    slots: [
      { r: 0, g: 0, b: 0, w: 0, ir: 0, channel: 0 },
      { r: 0, g: 0, b: 0, w: 0, ir: 0, channel: 1 },
      { r: 0, g: 0, b: 0, w: 0, ir: 0, channel: 2 },
    ],
  },
];

export function useLedPresets() {
  const { deviceData, sendToQueue, pushPreset } = useSerial();
  const deviceRef = useRef(deviceData);
  const [presets, setPresets] = useState<LedPreset[]>([]);
  const [activePreset, setActivePreset] = useState<LedPreset | null>({
    name: "default",
    slots: [
      { r: 0, g: 0, b: 0, w: 0, ir: 0, channel: 0 },
      { r: 0, g: 0, b: 0, w: 0, ir: 0, channel: 0 },
      { r: 0, g: 0, b: 0, w: 0, ir: 0, channel: 0 },
    ],
  });

  // Whether current activePreset matches anything in localStorage
  const [isDirty, setIsDirty] = useState(false);

  // Keep ref in sync
  useEffect(() => {
    deviceRef.current = deviceData;
  }, [deviceData]);

  // Load presets from storage
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      persist(DEFAULT_PRESETS);
      setActivePreset(DEFAULT_PRESETS[0]);
      return;
    }
    try {
      const parsed: LedPreset[] = JSON.parse(raw);
      if (Array.isArray(parsed)) setPresets(parsed);
    } catch {
      console.warn("Invalid preset storage, resetting");
    }
  }, []);

  const persist = useCallback((list: LedPreset[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    setPresets(list);
  }, []);

  // --- Select a preset from localStorage ---
  const selectPreset = (name: string) => {
    const found = presets.find((p) => p.name === name);
    if (found) {
      // Clone to ensure independence from stored copy
      setActivePreset(structuredClone(found));
      setIsDirty(false);
    }
  };

  // --- Save current LED state from MCU to current in-memory preset slot ---
  const saveSlot = async (index: number) => {
    sendToQueue("status");
    await new Promise((r) => setTimeout(r, 150));
    const led = deviceRef.current?.led;
    if (!led) return;

    setActivePreset((prev) => {
      if (!prev) return prev;
      const updated = structuredClone(prev);
      updated.slots[index] = {
        r: led.r ?? 0,
        g: led.g ?? 0,
        b: led.b ?? 0,
        w: led.w ?? 0,
        ir: led.ir ?? 0,
        channel: 0,
      };
      return updated;
    });
    setIsDirty(true); // mark unsaved changes
  };

  // --- Explicit save to localStorage ---
  const savePresetsToLocalStorage = (name: string, preset?: LedPreset) => {
    const base = preset ?? activePreset;
    if (!base) return; // nothing to save if null

    const snapshot = structuredClone(base);
    snapshot.name = name;

    const existingIndex = presets.findIndex((p) => p.name === name);
    const updatedList =
      existingIndex >= 0
        ? presets.map((p, i) => (i === existingIndex ? snapshot : p))
        : [...presets, snapshot];

    persist(updatedList);
    setActivePreset(snapshot);
    setIsDirty(false); // saved = clean
  };

  function deletePresetFromLocalStorage(name: string) {
    try {
      // Filter out the deleted preset
      const updatedList = presets.filter((p) => p.name !== name);

      // Persist updated list to localStorage (same helper used in save)
      persist(updatedList);

      // Update in-memory state
      setPresets(updatedList);

      // Optional: if you track the active preset, clear it if deleted
      setActivePreset((prev) => (prev?.name === name ? null : prev));
    } catch (err) {
      console.error("[useLedPresets] Failed to delete preset:", err);
    }
  }
  // --- Apply current slot to LED (legacy function) ---
  const applySlot = (index: number) => {
    if (!activePreset || !Array.isArray(activePreset.slots)) return;
    const slot = activePreset.slots[index];
    if (!slot) return;
    sendToQueue(`led set r ${slot.r}`);
    sendToQueue(`led set g ${slot.g}`);
    sendToQueue(`led set b ${slot.b}`);
    sendToQueue(`led set w ${slot.w}`);
    sendToQueue(`led set ir ${slot.ir}`);
    sendToQueue("status");
  };

  // --- Push all slots of active preset to device (new system) ---
  const pushPresetToDevice = useCallback(() => {
    if (!activePreset || !Array.isArray(activePreset.slots)) return;
    activePreset.slots.forEach((slot, i) => {
      const sum = slot.r + slot.g + slot.b + slot.w + slot.ir;
      if (sum === 0) return; // skip empty slots
      pushPreset(i, { ...slot, channel: slot.channel ?? i });
    });
  }, [activePreset, pushPreset]);

  return {
    presets,
    activePreset,
    isDirty,
    selectPreset,
    savePresetsToLocalStorage,
    deletePresetFromLocalStorage,
    saveSlot,
    applySlot,
    pushPresetToDevice,
  };
}
