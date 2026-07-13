"use client";

import { useEffect } from "react";
import { initCloudSync } from "@/lib/cloudSync";

export default function CloudSyncInit() {
  useEffect(() => {
    initCloudSync();
  }, []);

  return null;
}
