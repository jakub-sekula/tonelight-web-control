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
    DONE: "Finished"
  };
  if (state) {
    return labels[state];
  } else {
    return "N/A";
  }
}

export function getIOModeString(
  state: IOModeName | undefined
): string {
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
