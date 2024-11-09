'use client';

import React, { createContext, useContext, useState, type ReactNode } from 'react';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: "not_started" | "in_progress" | "completed";
  actionsRequired: string[]; // Array of action names required to complete the task
  completedActions: { action: string; time: string }[]; // To track order and time of completed actions
  startTime?: Date | null; // Track the start time of the task
  completedAt?: Date | null; // Track the completion time of the task
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
];;

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const startTask = (id: number) => {
    const startTime = new Date();
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status: "in_progress", startTime } : task
      )
    );
  };

  const completeAction = (taskId: number, action: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          // Check if action is already completed
          if (!task.actionsRequired.includes(action)) return task;

          // Calculate the relative time if task has started, otherwise set as "immediately"
          const actionTime = task.startTime
            ? `${((new Date().getTime() - task.startTime.getTime()) / 1000).toFixed(1)} seconds after start`
            : "immediately";

          const updatedCompletedActions = [
            ...task.completedActions,
            { action, time: actionTime },
          ];

          // Remove the completed action from actionsRequired
          const remainingActions = task.actionsRequired.filter(
            (reqAction) => reqAction !== action
          );

          // If all actions are completed, set the status to "completed" and add completedAt time
          const isCompleted = remainingActions.length === 0;
          const completedAt = isCompleted ? new Date() : task.completedAt;

          console.log("Completed action:", action, "Time:", actionTime);

          return {
            ...task,
            actionsRequired: remainingActions,
            completedActions: updatedCompletedActions,
            status: isCompleted ? "completed" : task.status,
            completedAt,
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
