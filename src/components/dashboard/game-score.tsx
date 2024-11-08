import { type GameScore as GameScoreType } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";

interface GameScoreProps {
  score: GameScoreType & {
    task: {
      name: string;
    };
  };
}

export function GameScore({ score }: GameScoreProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-sm font-medium">{score.task.name}</p>
        <p className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(score.createdAt), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
} 