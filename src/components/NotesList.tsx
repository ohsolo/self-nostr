import { Event, nip19 } from "nostr-tools";
import NoteCard from "./NoteCard";
import { Metadata } from "../App";

interface Props {
  notes: Event[];
  metadata: Record<string, Metadata>;
}

export default function NotesList({ notes, metadata }: Props) {
  return (
    <div className="flex flex-col gap-8">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          content={note.content}
          created_at={note.created_at}
          user={{
            name:
              metadata[note.pubkey]?.name ??
              `${nip19.npubEncode(note.pubkey).slice(0, 12)}...`,
            image:
              metadata[note.pubkey]?.picture ??
              `https://api.dicebear.com/5.x/identicon/svg?seed=${note.pubkey}`,
            pubkey: note.pubkey,
          }}
          hashtags={note.tags.filter((t) => t[0] === "t").map((t) => t[1])}
        />
      ))}
    </div>
  );
}
