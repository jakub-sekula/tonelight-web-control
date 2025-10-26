export function getMotorStateString(state: MotorStateName | undefined): string {
  const labels: Record<MotorStateName, string> = {
    OFF: "Disabled",
    IDLE: "Ready",
    MOVING_FWD: "Moving",
    MOVING_REV: "Moving",
    FEEDING_FWD: "Feeding",
    FEEDING_REV: "Feeding",
    JOGGING: "Jogging",
  };
  if (state) {
    return labels[state];
  } else {
    return "N/A";
  }
}

export function getShutterStateString(
  state: ShutterStateName | undefined
): string {
  const labels: Record<ShutterStateName, string> = {
    IDLE: "Ready",
    FOCUS: "Focus",
    BETWEEN_SHOTS: "Shooting",
    SHUTTER_ON: "Shooting",
    POST_HOLD: "Holding",
    DONE: "Finished",
  };
  if (state) {
    return labels[state];
  } else {
    return "N/A";
  }
}

export function getIOModeString(state: IOModeName | undefined): string {
  const labels: Record<IOModeName, string> = {
    LED_CONTROL: "LED",
    MOTOR_CONTROL: "Motor",
  };
  if (state) {
    return labels[state];
  } else {
    return "N/A";
  }
}

export function getStateColor(
  type: "shutter" | "motor" | "io" | "status",
  value?: string
) {
  switch (type) {
    case "shutter":
    case "motor":
      if (!value || value === "N/A") return "gray";
      if (value === "Ready") return "green";
      if (value === "Disabled") return "red";
      return "amber";
    case "io":
      if (!value || value === "N/A") return "gray";
      return value === "LED" ? "white" : "amber";
    case "status":
      if (value === "connected") return "green";
      if (value === "error") return "red";
      if (value === "reconnecting") return "amber";
      return "gray";
    default:
      return "gray";
  }
}

export function getDominantPresetColorClass(preset: LedPresetState) {
  const { r, g, b, w, ir } = preset;
  const max = Math.max(r, g, b, w, ir);

  let bgClass = "bg-neutral-900"; // default

  if (max < 50) return bgClass;

  if (max === r) bgClass = "bg-red-700";
  else if (max === g) bgClass = "bg-green-700";
  else if (max === b) bgClass = "bg-blue-700";
  else if (max === w) bgClass = "bg-gray-200/20";
  else if (max === ir) bgClass = "bg-purple-700";
  return bgClass;
}

export function getDominantColor(preset: LedPresetState): string {
  const entries = Object.entries(preset) as [keyof LedPresetState, number][];
  let dominant: keyof LedPresetState = "r";
  let maxValue = -Infinity;

  for (const [key, value] of entries) {
    if (typeof value === "number" && value > maxValue && key !== "channel") {
      maxValue = value;
      dominant = key;
    }
  }
  switch (dominant) {
    case "r":
      return "red";
    case "g":
      return "green";
    case "b":
      return "blue";
    case "ir":
      return "purple";
    case "w":
      return "grey";
    default:
      return "grey";
  }
}


export function getApproxRGBColor(preset: LedPresetState): string {
  const { r = 0, g = 0, b = 0, w = 0 } = preset;

  const norm = (v: number) => Math.max(0, Math.min(255, (v / 1023) * 255));

  const total = r + g + b + 1e-6;
  const blueRatio = Math.min(1, b / total);
  const whiteFactor = 0.6 + 0.8 * blueRatio;

  const rMix = norm(r + w * whiteFactor);
  const gMix = norm(g + w * whiteFactor);
  const bMix = norm(b + w * whiteFactor + 0.1 * w);

  const clamp = (v: number) => Math.min(255, Math.max(0, v));
  let rOut = clamp(rMix);
  let gOut = clamp(gMix);
  let bOut = clamp(bMix);

  // --- Enforce minimum perceived brightness ---
  const minBrightness = 255; // adjust to taste (0–255)
  const maxChannel = Math.max(rOut, gOut, bOut, 1); // avoid divide by zero

  if (maxChannel < minBrightness) {
    const scale = minBrightness / maxChannel;
    rOut = clamp(rOut * scale);
    gOut = clamp(gOut * scale);
    bOut = clamp(bOut * scale);
  }

  return `rgb(${Math.round(rOut)}, ${Math.round(gOut)}, ${Math.round(bOut)})`;
}
