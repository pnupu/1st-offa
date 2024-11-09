// TaskContext.tsx
'use client';

import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { api } from "@/trpc/react";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: "not_started" | "in_progress" | "completed";
  actionsRequired: string[]; // Array of action names required to complete the task
  completedActions: { action: string; time: string }[]; // To track order and time of completed actions
  startTime?: Date | null; // Track the start time of the task
}

interface TaskContextProps {
  tasks: Task[];
  startTask: (id: number) => void;
  completeAction: (taskId: number, action: string) => void;
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Meeting",
    description: "Respond to meeting invite and attend meeting",
    status: "not_started",
    actionsRequired: ["answerMeetingEmail", "attendMeeting"],
    completedActions: [],
  },
  {
    id: 2,
    title: "Intern",
    description: "Introduce yourself to the new intern via email",
    status: "not_started",
    actionsRequired: ["respondInternEmail"],
    completedActions: [],
  },
  {
    id: 3,
    title: "Q3 Report",
    description: "Read Q3 report and send summary to Derek",
    status: "not_started",
    actionsRequired: ["openQ3Report", "sendSummaryDerek"],
    completedActions: [],
  },
  {
    id: 4,
    title: "Event",
    description: "Respond to team event invitation",
    status: "not_started",
    actionsRequired: ["respondEventEmail"],
    completedActions: [],
  },
  {
    id: 5,
    title: "Presentation",
    description: "Check for problems in slides",
    status: "not_started",
    actionsRequired: ["openStyleGuide", "openBowerBoint", "checkAllSlides", "respondToPaula", "respondToLisa"],
    completedActions: [],
  },
  {
    id: 6,
    title: "Pinnacle Group",
    description: "Draft a reply to the Pinnacle Group",
    status: "not_started",
    actionsRequired: ["sendPinnacleReply"],
    completedActions: [],
  },
  {
    id: 7,
    title: "Invoice",
    description: "Find issues with the invoice",
    status: "not_started",
    actionsRequired: ["openInvoice", "replyToThomas"],
    completedActions: [],
  },
  {
    id: 8,
    title: "Filenames",
    description: "Check file naming conventions",
    status: "not_started",
    actionsRequired: ["openNamingConventions", "replyToSophie"],
    completedActions: [],
  },
];

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const createGameEvent = api.gameEvent.create.useMutation();

  const startTask = (id: number) => {
    const startTime = new Date();
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === id) {
          // Create game event for starting task
          createGameEvent.mutate({
            type: "TASK_STARTED",
            taskId: id,
            taskTitle: task.title,
            oceanScores: {
              conscientiousness: 0.05, // Small boost for initiative
            }
          });
          return { ...task, status: "in_progress", startTime };
        }
        return task;
      })
    );
  };

  const completeAction = (taskId: number, action: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          if (!task.actionsRequired.includes(action)) return task;

          const actionTime = task.startTime
            ? `${((new Date().getTime() - task.startTime.getTime()) / 1000).toFixed(1)} seconds after start`
            : "immediately";

          const updatedCompletedActions = [
            ...task.completedActions,
            { action, time: actionTime },
          ];

          const remainingActions = task.actionsRequired.filter(
            (reqAction) => reqAction !== action
          );

          // If task is completed (no remaining actions)
          if (remainingActions.length === 0) {
            const completionTime = task.startTime 
              ? (new Date().getTime() - task.startTime.getTime()) / 1000
              : 0;

            // Create game event for completing task
            createGameEvent.mutate({
              type: "TASK_COMPLETED",
              taskId: task.id,
              taskTitle: task.title,
              completionTime,
              oceanScores: {
                conscientiousness: 0.1,  // Base completion bonus
                neuroticism: -0.05,      // Small confidence boost
              }
            });
          }

          return {
            ...task,
            actionsRequired: remainingActions,
            completedActions: updatedCompletedActions,
            status: remainingActions.length === 0 ? "completed" : task.status,
          };
        }
        return task;
      })
    );
  };

  return (
    <TaskContext.Provider value={{ tasks, startTask, completeAction }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used within a TaskProvider");
  return context;
};
