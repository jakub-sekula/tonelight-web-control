"use client";

import { useSerial } from "@/SerialDeviceProvider";

export default function SerialMonitor() {
  const { deviceData } = useSerial();

  function flatten<T extends Record<string, unknown>>(
    obj: T,
    prefix = ""
  ): Record<string, unknown> {
    return Object.keys(obj).reduce<Record<string, unknown>>((acc, key) => {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;

      // Skip flattening presets
      if (newKey === "led.presets") {
        acc[newKey] = value;
        return acc;
      }

      if (value && typeof value === "object" && !Array.isArray(value)) {
        Object.assign(acc, flatten(value as Record<string, unknown>, newKey));
      } else {
        acc[newKey] = value;
      }

      return acc;
    }, {});
  }

  const flatState = flatten(deviceData);

  // Prepare formatted presets if present
  let presetLines: string[] = [];
  const presets = deviceData?.led?.presets;
  if (presets && typeof presets === "object") {
    presetLines = Object.entries(presets).map(([index, preset]) => {
      if (
        typeof preset === "object" &&
        preset !== null &&
        "brightness" in preset &&
        Array.isArray((preset as RawDevicePreset).brightness)
      ) {
        const b = (preset as RawDevicePreset).brightness;
        const ch = (preset as RawDevicePreset).channel ?? 0;
        return `${index}: r: ${b.r} g: ${b.g} b: ${b.b} ir: ${b.ir} w: ${b.w} channel: ${ch}`;
      }
      return `${index}: ${JSON.stringify(preset)}`;
    });
  }

  return (
    <div className="p-4 font-mono text-sm">
      {Object.keys(flatState).length > 0 && (
        <>
          <h3 className="mt-6 mb-2 font-semibold">Live State</h3>
          <div className="overflow-x-auto border border-neutral-700 rounded-lg">
            <table className="min-w-full text-xs text-left font-mono text-gray-200">
              <thead className="bg-neutral-800 text-gray-400 uppercase tracking-wider text-[0.65rem]">
                <tr>
                  <th className="px-2 py-1 w-1/2">Key</th>
                  <th className="px-2 py-1 w-1/2">Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(flatState)
                  .filter(([k]) => k !== "led.presets")
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([k, v]) => (
                    <tr
                      key={k}
                      className="odd:bg-neutral-900 even:bg-neutral-950 border-b border-neutral-800"
                    >
                      <td className="px-2 py-1 text-gray-400 whitespace-nowrap">
                        {k}
                      </td>
                      <td className="px-2 py-1 text-white break-all align-top">
                        {typeof v === "object" && v !== null ? (
                          <pre className="whitespace-pre-wrap text-[0.7rem] text-neutral-300">
                            {JSON.stringify(v, null, 2)
                              .replace(/[{}"]/g, "")
                              .replace(/,/g, "")
                              .trim()}
                          </pre>
                        ) : (
                          String(v)
                        )}
                      </td>
                    </tr>
                  ))}

                {/* Preset section */}
                {presetLines.length > 0 && (
                  <tr className="bg-neutral-800">
                    <td
                      colSpan={2}
                      className="px-2 py-1 text-gray-300 font-semibold"
                    >
                      LED Presets
                    </td>
                  </tr>
                )}
                {presetLines.map((line, i) => (
                  <tr
                    key={`preset-${i}`}
                    className="odd:bg-neutral-900 even:bg-neutral-950 border-b border-neutral-800"
                  >
                    <td className="px-2 py-1 text-gray-400 whitespace-nowrap">
                      led.presets.{i}
                    </td>
                    <td className="px-2 py-1 text-neutral-200 whitespace-pre">
                      {line}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
