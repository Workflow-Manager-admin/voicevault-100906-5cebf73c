import React, { useEffect, useRef, useState } from "react";
import "./VoiceVaultContainer.css";
import { useAuth } from "./AuthContext";

/**
 * PUBLIC_INTERFACE
 * Main container component for VoiceVault (ColorCraft frontend Container).
 * Provides voice recording, listing, playback, download, and delete features.
 * Now supports per-user notes using localStorage isolation, requires login.
 */
function VoiceVaultContainer() {
  // User from AuthContext
  const { user } = useAuth();

  // Get the storage key for this user's notes
  function getStorageKey() {
    return user ? `voicevault-recordings-${user.id}` : "voicevault-recordings";
  }

  // State for recordings and mic/recording
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [recordingChunks] = useState([]); // We now use a direct array, not state
  const [error, setError] = useState(null);
  const audioRefs = useRef({}); // For multiple audio elements

  // Load recordings for this user from localStorage on mount/login
  useEffect(() => {
    if (!user) {
      setRecordings([]); // No user, no notes
      return;
    }
    const key = getStorageKey();
    const savedRecordings = JSON.parse(
      localStorage.getItem(key) || "[]"
    );
    setRecordings(savedRecordings);
    // eslint-disable-next-line
  }, [user?.id]);

  // Save recordings to localStorage whenever they change (scoped to user)
  useEffect(() => {
    if (!user) return;
    const key = getStorageKey();
    localStorage.setItem(key, JSON.stringify(recordings));
  }, [recordings, user]);

  // PUBLIC_INTERFACE
  // Start recording audio from mic
  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new window.MediaRecorder(stream);

      let chunks = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        const now = new Date();
        const recording = {
          id: Date.now().toString(),
          url,
          name: `VoiceVault-${now.toLocaleDateString()}-${now
            .toLocaleTimeString()
            .replace(/:/g, "-")}`,
          created: now.toISOString(),
          type: blob.type,
          blob, // store for download
        };
        setRecordings((prev) => [recording, ...prev]);
      };
      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
    } catch (e) {
      setError("Could not access microphone. Please check permissions.");
    }
  };

  // PUBLIC_INTERFACE
  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      setMediaRecorder(null);
    }
    setIsRecording(false);
  };

  // PUBLIC_INTERFACE
  // Remove a recording
  const deleteRecording = (id) => {
    setRecordings((prev) => prev.filter((rec) => rec.id !== id));
    // Release object URL to avoid memory leak
    if (audioRefs.current[id]?.src) {
      URL.revokeObjectURL(audioRefs.current[id].src);
    }
  };

  // PUBLIC_INTERFACE
  // Download a recording
  const downloadRecording = (rec) => {
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = rec.url;
    a.download = `${rec.name}.${rec.type === "audio/webm" ? "webm" : "wav"}`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
    }, 100);
  };

  // PUBLIC_INTERFACE
  // Playback: Control the audio element for each recording
  const handlePlayback = (id) => {
    if (audioRefs.current[id]) {
      audioRefs.current[id].play();
    }
  };

  // Generate label for record button
  const recordLabel = isRecording ? "Stop Recording" : "Start Recording";

  // Prevention: don't allow component use if not logged in (should be handled by parent, but robust)
  if (!user) return null;

  return (
    <div className="voicevault-container">
      <div className="header">
        <h2 className="vault-title" tabIndex={0}>
          VoiceVault
        </h2>
        {/* Central Recording Button */}
        <button
          className={`record-btn${isRecording ? " recording" : ""}`}
          onClick={isRecording ? stopRecording : startRecording}
          aria-pressed={isRecording}
          aria-label={recordLabel}
        >
          <span className="record-circle" />
          {recordLabel}
        </button>
        <div className="desc">
          Your private voice locker.
          <span style={{ marginLeft: 10, color: "#888", fontWeight: 400 }}>
            Signed in as <span style={{ color: "#1976D2" }}>{user.email}</span>
          </span>
        </div>
        {error && <div className="error">{error}</div>}
      </div>
      <div className="recordings-list-container">
        <h3 className="list-title">Saved Recordings</h3>
        {recordings.length === 0 ? (
          <div className="empty-list">No recordings yet.</div>
        ) : (
          <ul className="recordings-list">
            {recordings.map((rec) => (
              <li className="recording-item" key={rec.id}>
                <div className="meta">
                  <span className="rec-label">
                    {rec.name}
                  </span>
                  <span className="timestamp">
                    {new Date(rec.created).toLocaleString()}
                  </span>
                </div>
                <div className="rec-controls">
                  <audio
                    ref={(el) => (audioRefs.current[rec.id] = el)}
                    src={rec.url}
                    controls
                  />
                  <button
                    className="btn-control"
                    title="Play"
                    aria-label={`Play ${rec.name}`}
                    onClick={() => handlePlayback(rec.id)}
                  >
                    <svg height="20" width="20" viewBox="0 0 24 24">
                      <polygon points="6,4 21,12 6,20" fill="#1976D2" />
                    </svg>
                  </button>
                  <button
                    className="btn-control"
                    title="Download"
                    aria-label={`Download ${rec.name}`}
                    onClick={() => downloadRecording(rec)}
                  >
                    <svg height="20" width="20" viewBox="0 0 24 24">
                      <path
                        d="M12 16v-8m0 8l-4-4m4 4l4-4"
                        stroke="#FF4081"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                      <rect
                        x="4"
                        y="18"
                        width="16"
                        height="2"
                        rx="1"
                        fill="#1976D2"
                      />
                    </svg>
                  </button>
                  <button
                    className="btn-control"
                    title="Delete"
                    aria-label={`Delete ${rec.name}`}
                    onClick={() => deleteRecording(rec.id)}
                  >
                    <svg height="20" width="20" viewBox="0 0 24 24">
                      <rect
                        x="6"
                        y="7"
                        width="12"
                        height="13"
                        rx="2"
                        fill="#FF4081"
                        opacity="0.7"
                      />
                      <rect
                        x="10"
                        y="11"
                        width="4"
                        height="6"
                        fill="#fff"
                        opacity="0.96"
                      />
                      <rect
                        x="9"
                        y="2"
                        width="6"
                        height="3"
                        rx="1"
                        fill="#1976D2"
                      />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default VoiceVaultContainer;
