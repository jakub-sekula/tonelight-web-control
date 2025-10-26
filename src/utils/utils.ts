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
