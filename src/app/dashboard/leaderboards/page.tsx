'use client';

import { api } from "@/trpc/react";

const UserInitialsPlaceholder = ({ name }: { name: string | null }) => {
  // Get initials from name (up to 2 characters)
  const initials = name
    ? name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '??';

  return (
    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
      {initials}
    </div>
  );
};

export default function LeaderboardsPage() {
  const { data: leaderboardData, isLoading } = api.game.getDinoLeaderboard.useQuery();

  if (isLoading) {
    return (
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
        <div className="text-white text-2xl mb-4">Loading Leaderboard...</div>
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Bunny Jump Leaderboard</h1>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaderboardData?.map((entry, index) => (
              <tr key={entry.id} className={index < 3 ? '' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {index + 1}
                    {index < 3 && (
                      <span className="ml-2">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <UserInitialsPlaceholder name={entry.user.name} />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {entry.user.name ?? 'Anonymous'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{entry.score}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(entry.date).toLocaleDateString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 