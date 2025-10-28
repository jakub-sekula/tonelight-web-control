/// <reference types="@types/w3c-web-serial" />

declare global {
  // -----------------------------------------------------------
  //  LED SYSTEM
  // -----------------------------------------------------------

  interface LedPresetState {
    r: number;
    g: number;
    b: number;
    ir: number;
    w: number;
    channel: number;
  }

  interface RawDevicePreset {
    brightness: { r: number; g: number; b: number; ir: number; w: number };
    channel: number;
  }

  interface LedState {
    mode: string;
    preset: number;
    r: number;
    g: number;
    b: number;
    ir: number;
    w: number;
    channel?: string;
    page?: number;
    presets?: Record<number, LedPresetState>;
  }

  type LedChannel = "r" | "g" | "b" | "ir" | "w";

  type LedColor = "red" | "green" | "blue" | "white" | "infrared";

  // -----------------------------------------------------------
  //  MOTOR SYSTEM
  // -----------------------------------------------------------
  type MotorMode = "MANUAL" | "SEMI_AUTO" | "AUTO";
  type MotorStateName =
    | "OFF"
    | "IDLE"
    | "MOVING_FWD"
    | "MOVING_REV"
    | "FEEDING_FWD"
    | "FEEDING_REV"
    | "JOGGING";

  interface MotorState {
    state: MotorStateName;
    enabled?: boolean;
    mm_per_rev: number;
    steps_per_mm: number;
    travel_steps: number;
    travel_mm: number;
    jog_steps: number;
    jog_mm: number;
    backlash_steps: number;
    backlash_mm: number;
    max_speed?: number;
    max_accel?: number;
    feed_speed?: number;
    microsteps?: number;
    roller_diameter?: number;
    frames_auto?: number;
    current_frame?: number;
    mode: MotorMode;
  }

  // -----------------------------------------------------------
  //  SHUTTER SYSTEM
  // -----------------------------------------------------------
  type ShutterStateName =
    | "IDLE"
    | "FOCUS"
    | "BETWEEN_SHOTS"
    | "SHUTTER_ON"
    | "POST_HOLD"
    | "DONE";

  interface ShutterState {
    state: ShutterStateName;
    triplet: boolean;
    focus_time?: number;
    hold_time?: number;
    hold_time_single?: number;
    hold_factor?: number;
    time_between_shots?: number;
    fps?: number;
  }

  // -----------------------------------------------------------
  //  INDICATOR
  // -----------------------------------------------------------
  interface IndicatorState {
    active?: boolean;
    animation?: number | string;
    speed?: number;
    brightness?: number;
  }

  type IOModeName = "LED_CONTROL" | "MOTOR_CONTROL";

  interface DeviceState {
    mode?: IOModeName;
  }
  // -----------------------------------------------------------
  //  GLOBAL DEVICE STATE
  // -----------------------------------------------------------
  interface State {
    led?: LedState;
    motor?: MotorState;
    shutter?: ShutterState;
    indicator?: IndicatorState;
    device?: str;
    debug?: { level: DebugLevel };
    [key: string]: unknown;
  }

  type DebugLevel =
    | "none"
    | "api"
    | "error"
    | "warning"
    | "info"
    | "debug"
    | "verbose";
}

export {};
