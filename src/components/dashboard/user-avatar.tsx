import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type User } from "@prisma/client";

interface UserAvatarProps {
  user: User & {
    files?: { url: string }[];
  };
}

export function UserAvatar({ user }: UserAvatarProps) {
  return (
    <Avatar className="h-16 w-16">
      <AvatarImage src={user.files?.[0]?.url} />
      <AvatarFallback>
        {user.name?.[0]?.toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
} 