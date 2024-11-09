'use client';
import { useEffect, useRef, useState } from 'react';
import { useGameTime } from '../../GameTimeContext';
import Image from 'next/image';
import { useUser } from "@/hooks/useUser";
import BossAnimation from './BossAnimation';
import { useTasks } from '../../TaskContext';
import { api } from "@/trpc/react";

interface Meeting {
  id: number;
  title: string;
  time: string;
  host: string;
}

const MEETINGS: Meeting[] = [
  { id: 1, title: 'Meeting with Boss Man', time: '13:00', host: 'Team Lead' },
];

const UserVideoPlaceholder = ({ initials }: { initials: string }) => (
  <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white">
    <span className="text-6xl font-bold">{initials}</span>
  </div>
);

const Mooz = () => {
  const { timeHours, timeMinutes } = useGameTime();
  const [inCall, setInCall] = useState(false);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [hasWebcamPermission, setHasWebcamPermission] = useState(() => {
    // Load from localStorage if available
    if (typeof window !== 'undefined') {
      return localStorage.getItem('webcamPermission') === 'true';
    }
    return false;
  });
  const { getInitials } = useUser();
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { completeAction } = useTasks();

  const meetingTime = 13 * 60; // 13:00
  const meetingEndTime = meetingTime + 20; // 13:20
  const earliestJoinTime = meetingTime - 15; // 12:45
  const currentTimeInMinutes = timeHours * 60 + timeMinutes;

  const canJoinMeeting = currentTimeInMinutes >= earliestJoinTime && currentTimeInMinutes < meetingEndTime;
  const meetingEnded = currentTimeInMinutes >= meetingEndTime;
  const meetingStarted = currentTimeInMinutes >= meetingTime;

  const createGameEvent = api.gameEvent.create.useMutation();

  const startWebcam = async () => {
    try {
      if (webcamStream) {
        stopWebcam(); // Clean up existing stream first
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      
      setWebcamStream(stream);
      setHasWebcamPermission(true);
      localStorage.setItem('webcamPermission', 'true');

      // Create game event for enabling webcam
      createGameEvent.mutate({
        type: "WEBCAM_ENABLED",
        oceanScores: {
          extraversion: 0.1,        // Boost for being willing to be on camera
          openness: 0.05,           // Small boost for embracing technology
          neuroticism: -0.05        // Slight decrease for being comfortable on camera
        }
      });
    } catch (error) {
      console.error('Error accessing webcam:', error);
      setHasWebcamPermission(false);
      localStorage.setItem('webcamPermission', 'false');

      // Create game event for webcam denial
      createGameEvent.mutate({
        type: "WEBCAM_DENIED",
        oceanScores: {
          neuroticism: 0.1,         // Increase for anxiety about camera
          extraversion: -0.05       // Slight decrease for avoiding visibility
        }
      });
    }
  };

  const stopWebcam = () => {
    if (webcamStream) {
      webcamStream.getTracks().forEach(track => {
        track.enabled = false;
        track.stop();
      });
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setWebcamStream(null);
  };

  const joinMeeting = () => {
    setInCall(true);
    completeAction(1, 'attendMeeting');
    void startWebcam();
    if (audioRef.current) {
      void audioRef.current.play();
    }

    // Create game event for joining meeting
    createGameEvent.mutate({
      type: "MEETING_JOINED",
      oceanScores: {
        conscientiousness: 0.15,    // Good boost for attending meetings
        extraversion: 0.1,          // Boost for social participation
        neuroticism: -0.05          // Slight decrease for handling professional situations
      }
    });

    // If joined early, give extra conscientiousness boost
    if (currentTimeInMinutes < meetingTime) {
      createGameEvent.mutate({
        type: "MEETING_EARLY",
        oceanScores: {
          conscientiousness: 0.1,   // Additional boost for being early
        }
      });
    }
  };

  const leaveMeeting = () => {
    setInCall(false);
    stopWebcam();
    if (audioRef.current) {
      void audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Only create event if leaving before meeting ends
    if (!meetingEnded) {
      createGameEvent.mutate({
        type: "MEETING_LEFT_EARLY",
        oceanScores: {
          conscientiousness: -0.15,  // Penalty for leaving early
          agreeableness: -0.05      // Small penalty for being inconsiderate
        }
      });
    } else {
      createGameEvent.mutate({
        type: "MEETING_COMPLETED",
        oceanScores: {
          conscientiousness: 0.1,    // Bonus for completing the meeting
          extraversion: 0.05         // Small boost for social engagement
        }
      });
    }
  };

  useEffect(() => {
    if (meetingEnded && inCall) {
      leaveMeeting();
    }
  }, [meetingEnded, inCall]);


  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  useEffect(() => {
    if (webcamStream && videoRef.current) {
      videoRef.current.srcObject = webcamStream;
      webcamStream.getVideoTracks().forEach(track => {
        track.enabled = true;
      });
    }
  }, [webcamStream]);

  const showPermissionModal = (message: string) => {
    setModalMessage(message);
    setShowModal(true);
  };

  const Modal = () => showModal ? (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg w-[200px]">
        <h3 className="text-sm font-bold mb-2">Permission Denied</h3>
        <p className="text-xs mb-3">{modalMessage}</p>
        <button
          onClick={() => setShowModal(false)}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
        >
          Close
        </button>
      </div>
    </div>
  ) : null;


  if (inCall) {
    return (
      <div className="w-full h-full bg-gray-900 p-4">
        <div className="grid grid-cols-2 gap-4 h-full">
          <div className="bg-black rounded-lg overflow-hidden">
            {webcamStream ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)' }}
              />
            ) : (
              <UserVideoPlaceholder initials={getInitials()} />
            )}
          </div>
          <div className="bg-black rounded-lg overflow-hidden flex items-center justify-center">
            {meetingStarted && <BossAnimation />}
          </div>
        </div>
        <audio ref={audioRef} src="/assets/audio/meeting-audio.mp3" loop />
        <button
          onClick={leaveMeeting}
          className="absolute bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Leave Meeting
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-100 p-4">
      <Modal />
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Image src="/assets/apps/Mooz.svg" alt="Mooz Logo" width={150} height={40} className="mr-2" />
        </div>
        <div className="space-x-2">
          <button
            onClick={() => showPermissionModal('You do not have permission to start an instant meeting. Contact IT for assistance.')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Start Meeting
          </button>
          <button
            onClick={() => showPermissionModal('You do not have permission to schedule meetings. Contact IT for assistance.')}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            Schedule
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Upcoming Meetings</h2>
          <div className="space-y-4">
            {MEETINGS.filter(() => { 
              return currentTimeInMinutes <= meetingEndTime;
            }).map((meeting) => (
              <div key={meeting.id} className="border-b pb-2">
                <h3 className="font-semibold">{meeting.title}</h3>
                <p className="text-sm text-gray-600">
                  {meeting.time} - Hosted by {meeting.host}
                </p>
                {meeting.time === '13:00' && canJoinMeeting && (
                  <button
                    onClick={joinMeeting}
                    className="mt-2 bg-blue-500 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Join Now
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Meeting Status</h2>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Camera Access:</span>{' '}
              {hasWebcamPermission ? 'Granted' : 'Not Granted'}
            </p>
            <p>
              <span className="font-semibold">Next Meeting:</span> Meeting with Boss Man at 13:00
            </p>
            {!canJoinMeeting && !meetingEnded && (
              <p className="text-sm text-gray-600">
                You can join the meeting 15 minutes before the scheduled time.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Mooz; 