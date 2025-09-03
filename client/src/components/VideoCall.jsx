import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Monitor,
} from 'lucide-react';
import Peer from 'simple-peer';
import socket from '../socket';

const VideoCall = ({
  isOpen,
  onClose,
  appointmentId,
  otherUser,
  currentUser,
  isInitiator = false,
}) => {
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState('');
  const [callerSignal, setCallerSignal] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    if (!isOpen) return;

    // Get user media
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      })
      .catch((err) => {
        console.error('Error accessing media devices:', err);
        // Try audio only if video fails
        navigator.mediaDevices
          .getUserMedia({
            video: false,
            audio: true,
          })
          .then((audioStream) => {
            setStream(audioStream);
            setVideoEnabled(false);
          })
          .catch((audioErr) => {
            console.error('Error accessing audio:', audioErr);
          });
      });

    // Socket event listeners
    socket.on('callUser', ({ from, signal }) => {
      setReceivingCall(true);
      setCaller(from);
      setCallerSignal(signal);
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);
      if (connectionRef.current) {
        connectionRef.current.signal(signal);
      }
    });

    socket.on('callEnded', () => {
      setCallEnded(true);
      if (connectionRef.current) {
        connectionRef.current.destroy();
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      onClose();
    });

    return () => {
      socket.off('callUser');
      socket.off('callAccepted');
      socket.off('callEnded');
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, stream, onClose]);

  const callUser = () => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on('signal', (data) => {
      socket.emit('callUser', {
        userToCall: appointmentId,
        signalData: data,
        from: currentUser.name,
        name: currentUser.name,
      });
    });

    peer.on('stream', (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on('signal', (data) => {
      socket.emit('answerCall', {
        signal: data,
        to: caller,
      });
    });

    peer.on('stream', (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    socket.emit('endCall', { to: appointmentId });
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    onClose();
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const shareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      const videoTrack = screenStream.getVideoTracks()[0];
      if (connectionRef.current && connectionRef.current.streams[0]) {
        const sender = connectionRef.current._pc
          .getSenders()
          .find((s) => s.track && s.track.kind === 'video');
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
      }

      setScreenSharing(true);

      videoTrack.onended = () => {
        setScreenSharing(false);
        // Switch back to camera
        if (stream) {
          const cameraTrack = stream.getVideoTracks()[0];
          if (connectionRef.current && cameraTrack) {
            const sender = connectionRef.current._pc
              .getSenders()
              .find((s) => s.track && s.track.kind === 'video');
            if (sender) {
              sender.replaceTrack(cameraTrack);
            }
          }
        }
      };
    } catch (err) {
      console.error('Error sharing screen:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="w-full h-full max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-semibold">
            Video Call with {otherUser?.name}
          </h2>
          <button
            onClick={leaveCall}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
          >
            <PhoneOff className="h-5 w-5" />
          </button>
        </div>

        {/* Video Container */}
        <div className="relative h-[calc(100vh-200px)] bg-gray-900 rounded-lg overflow-hidden">
          {/* Remote Video (Main) */}
          {callAccepted && !callEnded && (
            <video
              ref={userVideo}
              autoPlay
              className="w-full h-full object-cover"
            />
          )}

          {/* Local Video (Picture-in-Picture) */}
          <div className="absolute top-4 right-4 w-64 h-48 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
            <video
              ref={myVideo}
              muted
              autoPlay
              className="w-full h-full object-cover"
            />
            {!videoEnabled && (
              <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
                <VideoOff className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Call Status */}
          {!callAccepted && !receivingCall && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-pulse mb-4">
                  <Phone className="h-16 w-16 text-blue-400 mx-auto" />
                </div>
                <p className="text-white text-lg mb-4">
                  {isInitiator ? 'Calling...' : 'Waiting for call...'}
                </p>
                {isInitiator && (
                  <button
                    onClick={callUser}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    Start Call
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Incoming Call */}
          {receivingCall && !callAccepted && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
              <div className="text-center">
                <div className="animate-bounce mb-4">
                  <Phone className="h-16 w-16 text-green-400 mx-auto" />
                </div>
                <p className="text-white text-lg mb-4">
                  {caller} is calling...
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={answerCall}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Phone className="h-5 w-5" />
                    <span>Answer</span>
                  </button>
                  <button
                    onClick={leaveCall}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <PhoneOff className="h-5 w-5" />
                    <span>Decline</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center space-x-4 mt-4">
          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full transition-colors ${
              videoEnabled
                ? 'bg-gray-600 hover:bg-gray-700 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {videoEnabled ? (
              <Video className="h-5 w-5" />
            ) : (
              <VideoOff className="h-5 w-5" />
            )}
          </button>

          <button
            onClick={toggleAudio}
            className={`p-3 rounded-full transition-colors ${
              audioEnabled
                ? 'bg-gray-600 hover:bg-gray-700 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {audioEnabled ? (
              <Mic className="h-5 w-5" />
            ) : (
              <MicOff className="h-5 w-5" />
            )}
          </button>

          <button
            onClick={shareScreen}
            className={`p-3 rounded-full transition-colors ${
              screenSharing
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            <Monitor className="h-5 w-5" />
          </button>

          <button
            onClick={leaveCall}
            className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transition-colors"
          >
            <PhoneOff className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
