"use client";

import { useSyncExternalStore } from "react";
import {
  getAllProgressSnapshot,
  subscribeProgress,
  type ProgressStore,
} from "./progress";

const SERVER_SNAPSHOT: ProgressStore = {};

function getServerSnapshot(): ProgressStore {
  return SERVER_SNAPSHOT;
}

export function useAllProgress(): ProgressStore {
  return useSyncExternalStore(subscribeProgress, getAllProgressSnapshot, getServerSnapshot);
}
