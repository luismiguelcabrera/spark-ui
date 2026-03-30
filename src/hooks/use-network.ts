"use client";

import { useState, useEffect } from "react";

export type NetworkState = {
  online: boolean;
  downlink?: number;
  effectiveType?: string;
  rtt?: number;
  saveData?: boolean;
};

// Extend Navigator to include the Network Information API
interface NetworkInformation extends EventTarget {
  downlink?: number;
  effectiveType?: string;
  rtt?: number;
  saveData?: boolean;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
}

function getNetworkState(): NetworkState {
  // SSR guard
  if (typeof navigator === "undefined") {
    return { online: true };
  }

  const nav = navigator as NavigatorWithConnection;
  const connection = nav.connection;

  return {
    online: navigator.onLine,
    downlink: connection?.downlink,
    effectiveType: connection?.effectiveType,
    rtt: connection?.rtt,
    saveData: connection?.saveData,
  };
}

/**
 * Returns network status information.
 *
 * Listens to online/offline events and Navigator.connection changes.
 * SSR-safe: returns `{ online: true }` when navigator is not available.
 *
 * @returns NetworkState
 */
export function useNetwork(): NetworkState {
  const [state, setState] = useState<NetworkState>(getNetworkState);

  useEffect(() => {
    const updateState = () => {
      setState(getNetworkState());
    };

    window.addEventListener("online", updateState);
    window.addEventListener("offline", updateState);

    const nav = navigator as NavigatorWithConnection;
    const connection = nav.connection;

    if (connection) {
      connection.addEventListener("change", updateState);
    }

    return () => {
      window.removeEventListener("online", updateState);
      window.removeEventListener("offline", updateState);

      if (connection) {
        connection.removeEventListener("change", updateState);
      }
    };
  }, []);

  return state;
}
