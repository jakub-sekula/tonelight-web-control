/* eslint-disable react-refresh/only-export-components */
"use client";
import { createContext, useContext } from "react";
import { useSerialDevice } from "@/hooks/useSerialConnection";

const SerialContext = createContext<ReturnType<typeof useSerialDevice> | null>(null);

export function SerialDeviceProvider({ children }: { children: React.ReactNode }) {
  const serial = useSerialDevice();
  return <SerialContext.Provider value={serial}>{children}</SerialContext.Provider>;
}

export function useSerial() {
  const ctx = useContext(SerialContext);
  if (!ctx) throw new Error("useSerial must be used within SerialDeviceProvider");
  return ctx;
}
