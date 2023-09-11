interface Props {
  content: string;
  user: {
    name: string;
    image: string;
    pubkey: string;
  };
  created_at: number;
  hashtags: string[];
}

export default function NoteCard({
  content,
  user,
  created_at,
  hashtags,
}: Props) {
  return (
    <div className="rounded p-6 border border-gray-600 bg-gray-700 flex flex-col gap-6 break-wwords text-white grid-cols-1">
      <div className="flex gap-6 items-center ">
        <img
          src={user.image}
          alt="note"
          className="rounded-full w-12 aspect-square bg-gray-100"
        />
        <div className="overflow-hidden">
          <a
            href={`https://nostr.guru/p/${user.pubkey}`}
            className="text-body3 text-white  text-ellipsis"
          >
            {user.name}
          </a>
          <p className="text-body5 text-gray-400">
            {new Date(created_at * 1000).toISOString().split("T")[0]}
          </p>
        </div>
      </div>

      <p className="break-words">{content}</p>
      <ul className="flex flex-wrap gap-3">
        {hashtags
          .filter((t) => hashtags.indexOf(t) === hashtags.lastIndexOf(t))
          .map((hashtag) => (
            <li
              key={hashtag}
              className="rounded-2xl bg-gray-300 text-body5 text-gray-900 font-medium rounded-24 px-4 py-1"
            >
              #{hashtag}
            </li>
          ))}
      </ul>
    </div>
  );
}
