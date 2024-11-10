'use client';

import { api } from "@/trpc/react";
import { useState, useEffect, useMemo } from "react";
import { useGameTime } from "../../GameTimeContext";
import { useAppState } from "../AppStateContext";
import { useTasks } from "../../TaskContext";

interface Email {
  id: string;
  subject: string;
  content: string;
  from: string;
  position: string;
  sentTime: number;
  archived: boolean;
  read: boolean;
  replies: Array<{
    id: string;
    content: string;
    openness: number | null;
    conscientiousness: number | null;
    extraversion: number | null;
    agreeableness: number | null;
    neuroticism: number | null;
    createdAt: Date;
    emailId: string;
  }>;
}

const Koolout = () => {
  const { timeAsNumber } = useGameTime();
  const { appStates, updateAppState } = useAppState();
  const [replyContent, setReplyContent] = useState("");

  const { completeAction } = useTasks();

  const { data: allEmails, refetch } = api.email.getAll.useQuery(undefined, {
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const selectedEmail = useMemo(() => {
    return allEmails?.find(email => email.id === appStates.Koolout.selectedEmailId) ?? null;
  }, [allEmails, appStates.Koolout.selectedEmailId]);

  // Reset reply content when selected email changes
  useEffect(() => {
    setReplyContent("");
  }, [selectedEmail?.id]);

  // Filter emails based on current game time
  const availableEmails = useMemo(() => {
    return allEmails?.filter(email => email.sentTime <= timeAsNumber) ?? [];
  }, [allEmails, timeAsNumber]);

  const { mutate: markAsRead } = api.email.markAsRead.useMutation({
    onSuccess: () => {
      void refetch();
    }
  });

  const { mutate: evaluateResponse } = api.openai.evaluateResponse.useMutation();
  
  const { mutate: sendReply } = api.email.reply.useMutation({
    onSuccess: (reply) => {
      setReplyContent("");
      evaluateResponse({
        replyId: reply.id,
        response: reply.content,
      });
      void refetch();
    },
  });

  const handleEmailClick = (email: Email) => {
    updateAppState('Koolout', { selectedEmailId: email.id });
    if (!email.read) {
      markAsRead({ id: email.id });
    }
  };

  const handleSendReply = () => {
    if (selectedEmail && replyContent.trim()) {
      sendReply({
        emailId: selectedEmail.id,
        content: replyContent,
      });

      switch (selectedEmail.from) {
        case "Julia Chen":
          completeAction(1, "answerMeetingEmail");
          break;
        case "Anna Torres":
          completeAction(2, "respondInternEmail");
          break;
        case "Derek Hall":
          completeAction(3, "sendSummaryDerek");
          break;
        case "Carlos Mendes":
          completeAction(4, "respondEventEmail");
          break;
        case "Paula Edwards":
          completeAction(5, "respondToPaula");
          break;
        case "Lisa Bauer":
          completeAction(5, "respondToLisa");
          break;
        case "Sean Matthews":
          completeAction(6, "sendPinnacleReply");
          break;
        case "Thomas Yoo":
          completeAction(7, "sendThomasReply");
          break;
        case "Sophie Nguyen":
          completeAction(8, "sendSophieReply");
          break;
        default:
          break;
      }
    }
  };

  return (
    <div className="h-full flex">
      {/* Email List */}
      <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
        {availableEmails.map((email) => (
          <div
            key={email.id}
            onClick={() => handleEmailClick(email)}
            className={`p-2 cursor-pointer hover:bg-gray-100 ${
              !email.read ? 'font-bold' : ''
            } ${selectedEmail?.id === email.id ? 'bg-gray-100' : ''}`}
          >
            <div className="text-sm truncate">{email.from}</div>
            <div className="text-sm truncate">{email.subject}</div>
          </div>
        ))}
      </div>

      {/* Email Content */}
      <div className="w-2/3 p-4 overflow-y-auto">
        {selectedEmail ? (
          <div>
            <div className="mb-4">
              <div className="font-bold">{selectedEmail.subject}</div>
              <div className="text-sm text-gray-600">From: {selectedEmail.from}</div>
              <div className="mt-2 whitespace-pre-wrap">{selectedEmail.content}</div>
            </div>

            {/* Replies */}
            {selectedEmail.replies.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <div className="font-bold mb-2">Replies:</div>
                {selectedEmail.replies.map((reply) => (
                  <div key={reply.id} className="mb-2 pl-4 border-l-2">
                    <div className="whitespace-pre-wrap">{reply.content}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Form */}
            <div className="mt-4 border-t pt-4">
              <textarea
                key={`reply-${selectedEmail.id}`}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full h-24 p-2 border rounded text-black bg-white"
                placeholder="Write your reply..."
              />
              <button
                onClick={handleSendReply}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Send Reply
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-10">
            Select an email to read
          </div>
        )}
      </div>
    </div>
  );
};

export default Koolout;