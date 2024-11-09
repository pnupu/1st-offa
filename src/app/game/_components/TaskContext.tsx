// TaskContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: "not_started" | "in_progress" | "completed";
  actionsRequired: string[]; // Array of action names required to complete the task
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
    title: "Task 1",
    description: "Complete specific actions to finish Task 1",
    status: "not_started",
    actionsRequired: ["openEmail"],
  },
  {
    id: 2,
    title: "Task 2",
    description: "Complete specific actions to finish Task 2",
    status: "not_started",
    actionsRequired: ["action1", "action2"],
  },
  {
    id: 3,
    title: "Task 3",
    description: "Complete specific actions to finish Task 1",
    status: "not_started",
    actionsRequired: ["openEmail"],
  },
  {
    id: 4,
    title: "Task 4",
    description: "Complete specific actions to finish Task 2",
    status: "not_started",
    actionsRequired: ["action1", "action2"],
  },
];

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const startTask = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status: "in_progress" } : task
      )
    );
  };

  const completeAction = (taskId: number, action: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId && task.status === "in_progress") {
          const remainingActions = task.actionsRequired.filter(
            (reqAction) => reqAction !== action
          );
          return {
            ...task,
            actionsRequired: remainingActions,
            status: remainingActions.length === 0 ? "completed" : "in_progress",
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
