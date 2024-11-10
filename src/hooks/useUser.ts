import { api } from "@/trpc/react";

export const useUser = () => {
  const { data: user, isLoading, error } = api.user.getProfile.useQuery();

  const getInitials = () => {
    if (!user?.name) return ":)";
    const names = user.name.split(" ");
    if (names.length === 1) {
      const firstChar = names[0]?.[0];
      if (!firstChar) return ":)";
      return firstChar.toUpperCase();
    }
    const firstInitial = names[0]?.[0];
    const lastInitial = names[names.length - 1]?.[0];
    if (!firstInitial || !lastInitial) return ":)";
    return (firstInitial + lastInitial).toUpperCase();
  };

  return {
    user,
    isLoading,
    error,
    getInitials,
  };
};