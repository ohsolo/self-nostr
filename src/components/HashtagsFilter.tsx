import React, { useState } from "react";

interface Props {
  hashtags: string[];
  onChange: (hashtags: string[]) => void;
}

export default function HashtagsFilter({ hashtags, onChange }: Props) {
  const [input, setInput] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onChange([...hashtags, input.toLowerCase()]);
    setInput("");
  };

  const removeHashtag = (hashtag: string) => {
    onChange(hashtags.filter((h) => h !== hashtag));
  };

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-h3 text-white">Filtering hashtags</h3>
      <form onSubmit={onSubmit} className="flex gap-6">
        <input
          type="text"
          className="grow p-3 rounded bg-gray-500 text-white"
          placeholder="Write a hashtag"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="bg-gray-500 px-6 py-3 rounded-8 font-bold hover: bg-gray-600 active: scale-90"
          type="submit"
        >
          + Add
        </button>
      </form>
      <ul className="flex flex-wrap gap-4">
        {hashtags.map((hashtag) => (
          <li
            className="rounded-2xl bg-gray-300 text-body5 text-gray-900 font-medium rounded-24 px-4 py-1"
            key={hashtag}
          >
            {hashtag}
            <button
              className="ml-2 rounded-2xl bg-gray-300 text-body5 text-gray-900 font-medium rounded-24 px-1 py-0"
              onClick={() => removeHashtag(hashtag)}
            >
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
