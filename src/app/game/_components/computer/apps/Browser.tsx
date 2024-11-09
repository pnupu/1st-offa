'use client';

import { useState } from "react";

const Browser = () => {
  const [url, setUrl] = useState("https://www.google.com");
  const [inputUrl, setInputUrl] = useState(url);

  const navigateToUrl = () => {
    setUrl(inputUrl);
  };

  const handleEnterKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      navigateToUrl();
    }
  };

  const openFavorite = (favoriteUrl: string) => {
    setUrl(favoriteUrl);
    setInputUrl(favoriteUrl);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chrome-Like Navigation Bar */}
      <div className="h-[40px] bg-gray-200 flex items-center px-2 space-x-2">
        {/* Back Button */}
        <button className="bg-gray-400 w-[24px] h-[24px] rounded-full text-white flex items-center justify-center">
          ←
        </button>

        {/* Forward Button */}
        <button className="bg-gray-400 w-[24px] h-[24px] rounded-full text-white flex items-center justify-center">
          →
        </button>

        {/* Refresh Button */}
        <button
          onClick={() => setUrl(url)}
          className="bg-gray-400 w-[24px] h-[24px] rounded-full text-white flex items-center justify-center"
        >
          ⟳
        </button>

        {/* URL Input Field */}
        <input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          onKeyDown={handleEnterKey}
          className="flex-grow px-3 py-1 rounded-full text-gray-800 border border-gray-300 bg-white"
          placeholder="Search Google or type a URL"
        />

        {/* Go Button */}
        <button
          onClick={navigateToUrl}
          className="bg-blue-500 text-white px-3 py-1 rounded-full"
        >
          Go
        </button>
      </div>

      {/* Favorites Bar */}
      <div className="h-[30px] bg-gray-100 flex items-center px-2 space-x-2 border-b border-gray-300 text-sm text-gray-700">
        <button onClick={() => openFavorite("https://github.com")} className="hover:bg-gray-200 px-2 py-1 rounded">
          GitHub
        </button>
        <button onClick={() => openFavorite("https://eu.junctionplatform.com/")} className="hover:bg-gray-200 px-2 py-1 rounded">
          Junction
        </button>
        <button onClick={() => openFavorite("https://reddit.com")} className="hover:bg-gray-200 px-2 py-1 rounded">
          Reddit
        </button>
        <button onClick={() => openFavorite("https://reddit.com")} className="hover:bg-gray-200 px-2 py-1 rounded">
          Youtube
        </button>
        <button onClick={() => openFavorite("https://mycourses.aalto.fi/")} className="hover:bg-gray-200 px-2 py-1 rounded">
          MyCurses
        </button>
        <button onClick={() => openFavorite("https://reddit.com")} className="hover:bg-gray-200 px-2 py-1 rounded">
          Netflix
        </button>
        <button onClick={() => openFavorite("https://rwbk.fi")} className="hover:bg-gray-200 px-2 py-1 rounded">
          RWBK
        </button>
      </div>

      {/* Browser Content Area */}
      <div className="flex-grow bg-white">
        <iframe
          src={url}
          width="100%"
          height="100%"
          className="border-none"
          title="Browser"
        />
      </div>
    </div>
  );
};

export default Browser;
