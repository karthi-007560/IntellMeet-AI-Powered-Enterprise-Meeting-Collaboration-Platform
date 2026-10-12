import { useEffect, useRef, useState } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  MessageCircle,
  Users,
  PhoneOff,
  Send,
  Copy,
  MoreHorizontal,
  ShieldCheck,
  X,
} from "lucide-react";
import "./VideoMeetingPage.css";

type Participant = {
  id: number;
  name: string;
  initials: string;
  color: string;
  speaking?: boolean;
};

const participants: Participant[] = [
  { id: 1, name: "Karthik (You)", initials: "K", color: "purple", speaking: true },
  { id: 2, name: "Arun Kumar", initials: "AK", color: "blue" },
  { id: 3, name: "Priya Sharma", initials: "PS", color: "pink" },
  { id: 4, name: "Rahul Dev", initials: "RD", color: "green" },
];

type ChatMessage = {
  id: number;
  name: string;
  text: string;
  time: string;
};

export default function VideoMeetingPage() {
  const [micOn, setMicOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, name: "Arun Kumar", text: "Hi everyone! Shall we start?", time: "10:02" },
    { id: 2, name: "Priya Sharma", text: "Yes, ready to go.", time: "10:03" },
    { id: 3, name: "Karthik", text: "Let's review the project updates.", time: "10:04" },
  ]);
  const [ended, setEnded] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [notice, setNotice] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const screenRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      screenRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  function showNotice(text: string) {
    setNotice(text);
    window.setTimeout(() => setNotice(""), 3000);
  }

  async function toggleCamera() {
    if (cameraOn) {
      streamRef.current?.getVideoTracks().forEach((track) => track.stop());
      streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
      setCameraOn(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraOn(true);
    } catch {
      showNotice("Camera unavailable. Check browser permissions.");
    }
  }

  async function toggleMic() {
    if (micOn) {
      streamRef.current?.getAudioTracks().forEach((track) => track.stop());
      setMicOn(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioTracks = stream.getAudioTracks();

      if (streamRef.current) {
        audioTracks.forEach((track) => streamRef.current?.addTrack(track));
      } else {
        streamRef.current = stream;
      }

      setMicOn(true);
    } catch {
      showNotice("Microphone unavailable. Check browser permissions.");
    }
  }

  async function toggleScreenShare() {
    if (sharing) {
      screenRef.current?.getTracks().forEach((track) => track.stop());
      screenRef.current = null;
      setSharing(false);
      showNotice("Screen sharing stopped.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      screenRef.current = stream;
      setSharing(true);
      stream.getVideoTracks()[0].addEventListener("ended", () => {
        setSharing(false);
        screenRef.current = null;
      });
      showNotice("Screen selected. Live sharing with other participants needs WebRTC.");
    } catch {
      showNotice("Screen sharing cancelled or unavailable.");
    }
  }

  function sendMessage() {
    const text = message.trim();
    if (!text) return;

    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        name: "Karthik",
        text,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setMessage("");
  }

  async function copyMeetingLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showNotice("Page link copied!");
    } catch {
      showNotice("Please copy the URL from your browser address bar.");
    }
  }

  function leaveMeeting() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    screenRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    screenRef.current = null;
    setCameraOn(false);
    setMicOn(false);
    setSharing(false);
    setEnded(true);
  }

  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  if (ended) {
    return (
      <main className="vm-ended">
        <div className="vm-ended-icon"><PhoneOff size={30} /></div>
        <h1>You left the meeting</h1>
        <p>Meeting duration: {formatTime(elapsed)}</p>
        <button onClick={() => { setElapsed(0); setEnded(false); }}>
          Return to meeting demo
        </button>
      </main>
    );
  }

  return (
    <main className="vm-page">
      <header className="vm-header">
        <div className="vm-brand">
          <div className="vm-brand-icon"><Video size={21} /></div>
          <div>
            <strong>IntellMeet</strong>
            <span>Meeting room</span>
          </div>
        </div>

        <div className="vm-meeting-info">
          <span className="vm-live-dot" />
          <strong>Product Team Sync</strong>
          <span className="vm-duration">{formatTime(elapsed)}</span>
        </div>

        <button className="vm-icon-button" onClick={copyMeetingLink} title="Copy page link">
          <Copy size={17} />
        </button>
      </header>

      {notice && <div className="vm-notice" role="status">{notice}</div>}

      <div className={`vm-body ${chatOpen || participantsOpen ? "with-panel" : ""}`}>
        <section className="vm-stage">
          <div className="vm-stage-top">
            <div>
              <span className="vm-secure"><ShieldCheck size={14} /> Secure room demo</span>
              <h1>Product Team Sync</h1>
            </div>
            <button
              className="vm-icon-button"
              onClick={copyMeetingLink}
              aria-label="Copy meeting link"
            >
              <MoreHorizontal size={20} />
            </button>
          </div>

          <div className="vm-participant-grid">
            {participants.map((person) => (
              <article
                className={`vm-participant ${person.speaking && micOn ? "speaking" : ""}`}
                key={person.id}
              >
                {person.id === 1 && cameraOn ? (
                  <video ref={videoRef} autoPlay muted playsInline className="vm-camera-video" />
                ) : (
                  <div className={`vm-avatar ${person.color}`}>{person.initials}</div>
                )}

                <div className="vm-participant-label">
                  <span>{person.name}</span>
                  {person.id === 1 && <span className="vm-you-tag">YOU</span>}
                </div>

                <div className="vm-participant-status">
                  {person.id === 1 && !micOn && <MicOff size={14} />}
                  {person.id !== 1 && <Mic size={14} />}
                </div>
              </article>
            ))}
          </div>

          <div className="vm-stage-footer">
            <div className="vm-participant-count">
              <Users size={16} />
              <span>4 participants</span>
            </div>
            <span>Meeting ID: IM-2048</span>
          </div>

          <div className="vm-controls">
            <button
              className={`vm-control ${micOn ? "active" : ""}`}
              onClick={toggleMic}
              title={micOn ? "Turn microphone off" : "Turn microphone on"}
            >
              {micOn ? <Mic size={20} /> : <MicOff size={20} />}
              <span>{micOn ? "Mute" : "Unmute"}</span>
            </button>

            <button
              className={`vm-control ${cameraOn ? "active" : ""}`}
              onClick={toggleCamera}
              title={cameraOn ? "Turn camera off" : "Turn camera on"}
            >
              {cameraOn ? <Video size={20} /> : <VideoOff size={20} />}
              <span>{cameraOn ? "Stop video" : "Start video"}</span>
            </button>

            <button
              className={`vm-control ${sharing ? "active" : ""}`}
              onClick={toggleScreenShare}
              title="Share screen"
            >
              <MonitorUp size={20} />
              <span>{sharing ? "Stop share" : "Share screen"}</span>
            </button>

            <button
              className={`vm-control ${chatOpen ? "active" : ""}`}
              onClick={() => { setChatOpen(!chatOpen); setParticipantsOpen(false); }}
              title="Toggle chat"
            >
              <MessageCircle size={20} />
              <span>Chat</span>
            </button>

            <button
              className={`vm-control ${participantsOpen ? "active" : ""}`}
              onClick={() => { setParticipantsOpen(!participantsOpen); setChatOpen(false); }}
              title="Toggle participants"
            >
              <Users size={20} />
              <span>People</span>
            </button>

            <button className="vm-leave-button" onClick={leaveMeeting}>
              <PhoneOff size={19} />
              <span>Leave</span>
            </button>
          </div>
        </section>

        {(chatOpen || participantsOpen) && (
          <aside className="vm-side-panel">
            <div className="vm-panel-header">
              <div>
                <h2>{chatOpen ? "Meeting chat" : "Participants"}</h2>
                <p>{chatOpen ? `${messages.length} messages` : "4 people in this room"}</p>
              </div>
              <button
                className="vm-icon-button"
                onClick={() => { setChatOpen(false); setParticipantsOpen(false); }}
                aria-label="Close panel"
              >
                <X size={18} />
              </button>
            </div>

            {chatOpen ? (
              <>
                <div className="vm-chat-messages">
                  {messages.map((item) => (
                    <div className="vm-chat-message" key={item.id}>
                      <div className="vm-chat-message-top">
                        <strong>{item.name}</strong>
                        <span>{item.time}</span>
                      </div>
                      <p>{item.text}</p>
                    </div>
                  ))}
                </div>

                <form
                  className="vm-chat-form"
                  onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                >
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    aria-label="Chat message"
                  />
                  <button type="submit" aria-label="Send message" disabled={!message.trim()}>
                    <Send size={17} />
                  </button>
                </form>
              </>
            ) : (
              <div className="vm-people-list">
                {participants.map((person) => (
                  <div className="vm-person-row" key={person.id}>
                    <div className={`vm-person-avatar ${person.color}`}>{person.initials}</div>
                    <div>
                      <strong>{person.name}</strong>
                      <span>{person.id === 1 ? "Meeting host" : "Participant"}</span>
                    </div>
                    <Mic size={15} />
                  </div>
                ))}
              </div>
            )}
          </aside>
        )}
      </div>
      <footer className="vm-footer">
        <span>IntellMeet · Frontend prototype</span>
        <span>Chat is local demo data; other participants are placeholders.</span>
      </footer>
    </main>
  );
}