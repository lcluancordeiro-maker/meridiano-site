"use client";

import { useEffect } from "react";
import { setTutorContext } from "@/lib/gaussPrompt";

/** Bridges a Server Component topic page's already-resolved level/topic
 * strings into the globally-rendered Gauss tutor bubble, without the tutor
 * needing to import curriculum data itself (which would ship the entire
 * dataset to every page's client bundle — see LazyFunctionGrapher for the
 * same concern elsewhere). Plain strings in, a CustomEvent out. */
export default function SetTutorContext({ levelName, topicTitle }: { levelName: string; topicTitle: string }) {
  useEffect(() => {
    setTutorContext({ levelName, topicTitle });
    return () => setTutorContext(undefined);
  }, [levelName, topicTitle]);

  return null;
}
