"use client";

import { useSyncExternalStore } from "react";
import { getImageQuality, isMobile, shouldReduceAnimations } from "@/lib/utils/performance";

export interface DeviceFlags {
  mobile: boolean;
  reduceAnimations: boolean;
  imageQuality: number;
}

// Values the server renders with. During hydration React uses getServerSnapshot, so the first
// client render matches the server HTML; it then switches to the real device values.
const SERVER_FLAGS: DeviceFlags = { mobile: false, reduceAnimations: false, imageQuality: 40 };

let cached: DeviceFlags = SERVER_FLAGS;

function getSnapshot(): DeviceFlags {
  const next: DeviceFlags = {
    mobile: isMobile(),
    reduceAnimations: shouldReduceAnimations(),
    imageQuality: getImageQuality(),
  };
  if (
    next.mobile !== cached.mobile ||
    next.reduceAnimations !== cached.reduceAnimations ||
    next.imageQuality !== cached.imageQuality
  ) {
    cached = next;
  }
  return cached;
}

function getServerSnapshot(): DeviceFlags {
  return SERVER_FLAGS;
}

function subscribe(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}

export function useDeviceFlags(): DeviceFlags {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
