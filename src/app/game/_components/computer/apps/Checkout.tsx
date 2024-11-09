'use client';

import { api } from "@/trpc/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const BLACKLISTED_PATTERNS = {
  profanity: /\b(fuck|shit|ass|damn|bitch|perkele|vittu|paska|saatana|helvetti)\b/gi,
  slurs: /\b(n[i1]gg[e3]r|f[a@]g|r[e3]t[a@]rd|hintti|homppeli|n[e3][e3]k[e3]r[i1])\b/gi,
  spam: /\b(viagra|crypto|btc|ethereum|\\$\\$\\$|www\.|http|pikavippi|kasino|lainaa|luotto)\b/gi,
  excessive: /(.)\1{4,}/g, // Matches 5 or more of the same character
};


// Simple spam detection
const isSpam = (text: string) => {
  // Check for repeated characters
  const hasExcessiveRepeats = BLACKLISTED_PATTERNS.excessive.test(text);
  // Check for all caps
  const allCaps = text === text.toUpperCase() && text.length > 10;
  // Check for repeated words
  const words = text.toLowerCase().split(' ');
  const repeatedWords = words.some((word) => 
    words.filter(w => w === word).length > 3
  );
  // Check for spam keywords
  const hasSpamKeywords = BLACKLISTED_PATTERNS.spam.test(text);

  return hasExcessiveRepeats || allCaps || repeatedWords || hasSpamKeywords;
};

// Enhanced content filter
const containsProfanity = (text: string) => {
  return BLACKLISTED_PATTERNS.profanity.test(text) || BLACKLISTED_PATTERNS.slurs.test(text);
};

const UserVideoPlaceholder = ({ initials }: { initials: string }) => (
  <div className="h-8 w-8 flex items-center justify-center bg-blue-600 text-white rounded-full">
    <span className="text-sm font-bold">{initials}</span>
  </div>
);

export default function Checkout() {
  const [newPost, setNewPost] = useState("");
  const [error, setError] = useState<string | null>(null);
  const utils = api.useUtils();

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    api.post.getAll.useInfiniteQuery(
      {
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      setNewPost("");
      setError(null);
      void utils.post.getAll.invalidate();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedPost = newPost.trim();
    if (!trimmedPost) return;
    
    // Content validation
    if (trimmedPost.length < 3) {
      setError("Post is too short");
      return;
    }

    if (isSpam(trimmedPost)) {
      setError("This post looks like spam");
      return;
    }

    if (containsProfanity(trimmedPost)) {
      setError("This post contains inappropriate language");
      return;
    }
    
    setError(null);
    createPost.mutate({ content: trimmedPost });
  };

  return (
    <div className="h-full overflow-y-auto p-4">
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={newPost}
          onChange={(e) => {
            setNewPost(e.target.value);
            setError(null);
          }}
          className="w-full rounded border p-2"
          placeholder="What's on your mind?"
          maxLength={280}
        />
        {error && (
          <div className="mt-2 text-red-500 text-sm">
            {error}
          </div>
        )}
        <Button 
          type="submit" 
          disabled={createPost.isPending}
          className="mt-2"
        >
          {createPost.isPending ? "Posting..." : "Post"}
        </Button>
      </form>

      <div className="space-y-4">
        {data?.pages.map((page) =>
          page.posts.map((post) => (
            <div
              key={post.id}
              className="rounded-lg border bg-white p-4 shadow"
            >
              <div className="flex items-center gap-2">
                  <UserVideoPlaceholder initials={post.author.name ? post.author.name.charAt(0).toUpperCase() : "?"} />
                <span className="font-semibold">{post.author.name}</span>
              </div>
              <p className="mt-2">{post.content}</p>
              <span className="mt-2 text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleString()}
              </span>
            </div>
          ))
        )}

        {hasNextPage && (
          <Button
            onClick={() => void fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Loading..." : "Load more"}
          </Button>
        )}
      </div>
    </div>
  );
}