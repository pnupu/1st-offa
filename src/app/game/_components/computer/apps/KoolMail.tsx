'use client';

import { api } from "@/trpc/react";
import { useState, useEffect } from "react";

interface Email {
  id: string;
  subject: string;
  content: string;
  from: string;
  read: boolean;
  archived: boolean;
  replies: Array<{
    id: string;
    content: string;
  }>;
}

const KoolMail = () => {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const { data: emails, refetch } = api.email.getAll.useQuery(undefined);
  const { mutate: markAsRead } = api.email.markAsRead.useMutation();
  const { mutate: evaluateResponse } = api.openai.evaluateResponse.useMutation();
  
  const { mutate: sendReply } = api.email.reply.useMutation({
    onSuccess: (reply) => {
      setReplyContent("");
      // Trigger OpenAI evaluation in the background
      evaluateResponse({
        replyId: reply.id,
        response: reply.content,
      });
      void refetch();
    },
  });

  // Update selected email with fresh data whenever emails change
  useEffect(() => {
    if (selectedEmail && emails) {
      const updatedEmail = emails.find(email => email.id === selectedEmail.id);
      if (updatedEmail && JSON.stringify(updatedEmail) !== JSON.stringify(selectedEmail)) {
        setSelectedEmail(updatedEmail);
      }
    }
  }, [emails, selectedEmail]);

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
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
    }
  };

  return (
    <div className="h-full flex">
      {/* Email List */}
      <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
        {emails?.map((email) => (
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
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full h-24 p-2 border rounded"
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

export default KoolMail;