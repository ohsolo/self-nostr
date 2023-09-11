import { useState } from "react";
import { EventTemplate, Event, getEventHash, SimplePool } from "nostr-tools";
import { RELAYS } from "../App";

interface Props {
  pool: SimplePool;
  hashtags: string[];
}

export default function CreateNote({ pool, hashtags }: Props) {
  const [input, setInput] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!window.nostr) {
      alert("Nostr extensionnot found");
      return;
    }
    const _baseEvent = {
      content: input,
      created_at: Math.round(Date.now() / 1000),
      kind: 1,
      tags: [...hashtags.map((hashtag) => ["t", hashtag])],
    } as EventTemplate;

    try {
      const pubkey = await window.nostr.getPublicKey();

      const sig = await (await window.nostr.signEvent(_baseEvent)).sig;

      const event: Event = {
        ..._baseEvent,
        sig,
        pubkey,
        id: getEventHash({ ..._baseEvent, pubkey }),
      };

      pool.publish(RELAYS, event);
    } catch (error) {
      alert("User rejected operation");
    }
  };

  return (
    <div>
      <h2 className="text-h3 text-white mb-12">What's In Your Mind??</h2>
      <form onSubmit={onSubmit}>
        <textarea
          placeholder="Write your note here..."
          className="w-full p-3 rounded bg-gray-500 text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={6}
        />
        <div className="flex justify-end">
          <button className="bg-violet-500 px-4 py-2 rounded-8 font-bold hover:bg-violet-600 active:scale-90">
            Publish
          </button>
        </div>
      </form>
    </div>
  );
}
