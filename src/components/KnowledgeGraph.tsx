import Link from "next/link";
import AskGaussButton from "./AskGaussButton";
import { getRelatedTopics, type Topic } from "@/data/curriculum";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSocialAccessStatus } from "@/lib/entitlements";
import type { Dictionary } from "@/i18n/dictionaries";

type CommunityHit = { id: string; community_id: string };
type ChatHit = { id: string; conversation_id: string };

export default async function KnowledgeGraph({ topic, dict }: { topic: Topic; dict: Dictionary["knowledgeGraph"] }) {
  const relatedTopics = getRelatedTopics(topic);

  let communityHits: CommunityHit[] = [];
  let chatHits: ChatHit[] = [];

  if (isSupabaseConfigured && (await getSocialAccessStatus()) === "granted") {
    const supabase = await createClient();
    if (supabase) {
      const [{ data: communityData }, { data: chatData }] = await Promise.all([
        supabase
          .from("community_messages")
          .select("id, community_id")
          .ilike("body", `%${topic.title}%`)
          .order("created_at", { ascending: false })
          .limit(3),
        supabase
          .from("dm_messages")
          .select("id, conversation_id")
          .ilike("body", `%${topic.title}%`)
          .order("created_at", { ascending: false })
          .limit(3),
      ]);
      communityHits = (communityData as CommunityHit[] | null) ?? [];
      chatHits = (chatData as ChatHit[] | null) ?? [];
    }
  }

  return (
    <div className="mt-10 flex flex-col gap-6">
      {relatedTopics.length > 0 && (
        <div>
          <h2 className="mb-3 font-display text-xl font-semibold text-foreground">{dict.relatedHeading}</h2>
          <ul className="flex flex-wrap gap-2">
            {relatedTopics.map(({ level, topic: relatedTopic }) => (
              <li key={`${level.id}-${relatedTopic.id}`}>
                <Link
                  href={`/trilha/${level.id}/${relatedTopic.id}`}
                  className="inline-block rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary"
                >
                  {relatedTopic.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {(communityHits.length > 0 || chatHits.length > 0) && (
        <div>
          <h2 className="mb-3 font-display text-xl font-semibold text-foreground">{dict.discussionsHeading}</h2>
          <ul className="flex flex-col gap-2">
            {communityHits.map((hit) => (
              <li key={`community-${hit.id}`}>
                <Link
                  href={`/comunidades/${hit.community_id}`}
                  className="inline-block rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary"
                >
                  {dict.openCommunityLink}
                </Link>
              </li>
            ))}
            {chatHits.map((hit) => (
              <li key={`chat-${hit.id}`}>
                <Link
                  href={`/chat/${hit.conversation_id}`}
                  className="inline-block rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary"
                >
                  {dict.openChatLink}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <AskGaussButton topicTitle={topic.title} />
    </div>
  );
}
