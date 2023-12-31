import { EventTemplate, Event } from "nostr-tools";

declare global {
  interface Window {
    webln: any;
    nostr: Nostr;
  }
}

type Nostr = {
  getPublicKey(): Promise<string>;
  signEvent(event: EventTemplate): Promise<Event>;
};
