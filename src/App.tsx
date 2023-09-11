import { SimplePool, Event } from "nostr-tools";
import { useEffect, useState, useRef } from "react";
import "./App.css";
import NotesList from "./components/NotesList";
import { useDebounce } from "use-debounce";
import CreateNote from "./components/CreateNote";
import HashtagsFilter from "./components/HashtagsFilter";

export const RELAYS = [
  "wss://nostr-pub.wellorder.net",
  "wss://nostr.drss.io",
  "wss://nostr.swiss-enigma.ch",
  "wss://relay.damus.io",
];

export interface Metadata {
  name?: string;
  picture?: string;
  about?: string;
  nip05?: string;
}

function App() {
  const [pool, setPool] = useState<SimplePool | null>(null);
  const [eventsImmediate, setEvents] = useState<Event[]>([]);
  const [events] = useDebounce(eventsImmediate, 1500);
  const [metadata, setMetadata] = useState<Record<string, Metadata>>({});
  const metadataFethced = useRef<Record<string, boolean>>({});
  const [hashtags, setHashtags] = useState<string[]>([]);

  useEffect(() => {
    const _pool = new SimplePool();
    setPool(_pool);

    return () => {
      _pool.close(RELAYS);
    };
  }, []);

  useEffect(() => {
    if (!pool) return;

    const sub = pool.sub(RELAYS, [
      {
        kinds: [1],
        limit: 100,
        "#t": hashtags,
      },
    ]);

    sub.on("event", (event: Event) => {
      setEvents((events) => [...events, event]);
    });

    return () => {
      sub.unsub();
    };
  }, [hashtags, pool]);

  useEffect(() => {
    if (!pool) return;

    const pubkeysToFetch = events
      .filter((event) => metadataFethced.current[event.pubkey] !== true)
      .map((event) => event.pubkey);

    pubkeysToFetch.forEach(
      (pubkey) => (metadataFethced.current[pubkey] = true)
    );

    const sub = pool.sub(RELAYS, [
      {
        kinds: [0],
        authors: pubkeysToFetch,
      },
    ]);

    sub.on("event", (event: Event) => {
      const metadata = JSON.parse(event.content) as Metadata;

      setMetadata((cur) => ({
        ...cur,
        [event.pubkey]: metadata,
      }));
    });

    sub.on("eose", () => {
      sub.unsub();
    });

    console.log(metadata);

    return () => {};
  }, [events, pool]);

  if (!pool) return null;

  return (
    <div>
      <div className="flex flex-col gap-12">
        <h1 className="text-h1 text-white">Nostr Simple Project</h1>
        <CreateNote pool={pool} hashtags={hashtags} />
        <HashtagsFilter hashtags={hashtags} onChange={setHashtags} />
        <NotesList metadata={metadata} notes={events} />
      </div>
    </div>
  );
}

export default App;
