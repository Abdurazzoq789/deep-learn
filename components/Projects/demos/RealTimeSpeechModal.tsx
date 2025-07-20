import { useEffect, useRef, useState } from 'react';
import { Modal, Button, Typography, Alert, Tag, Row, Col, Space } from 'antd';

interface Props {
  open: boolean;
  onClose: () => void;
}

// NOTE: This is a front-end-only demo that streams raw PCM/opus WebM chunks over
// WebSocket and prints any text received back. Replace `WS_URL` with your
// actual endpoint.
const WS_URL = 'wss://api.deep-learn.uz/ws?project=ai-chat&chat_id=1';

const RealTimeSpeechModal: React.FC<Props> = ({ open, onClose }) => {
  const chunksRef = useRef<BlobPart[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const botBufferRef = useRef<string>('');
  const socketRef = useRef<WebSocket | null>(null);
  const audioRef = useRef<any>(null);
  const speakingVideoRef = useRef<HTMLVideoElement | null>(null);
  const waitingVideoRef = useRef<HTMLVideoElement | null>(null);
  const audioLoadTimeoutIdRef = useRef<any>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
  const [recording, setRecording] = useState(false);
  const [botSpeaking, setBotSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize audio and video elements
  useEffect(() => {
    if (!open) return;

    console.log('Initializing audio and video elements');

    // Initialize audio element
    if (!audioRef.current) {
      console.log('Creating new Audio element');
      const audio = new Audio();

      // Set up audio event handlers
      audio.onplay = () => {
        console.log('Audio started playing');
        setBotSpeaking(true);
      };

      audio.onended = () => {
        console.log('Audio playback ended');
        setBotSpeaking(false);
      };

      audio.onpause = () => {
        console.log('Audio playback paused');
        // Sometimes onended doesn't fire, so we use onpause as a backup
        setTimeout(() => {
          if (audioRef.current && audioRef.current.ended) {
            console.log('Audio ended detected via pause event');
            setBotSpeaking(false);
          }
        }, 100);
      };

      audio.onerror = (e) => {
        console.error('Audio error:', e);
        setError(`Audio playback error: ${audio.error?.message || 'Unknown error'}`);
        setBotSpeaking(false);
      };

      // Add canplaythrough event to ensure audio is ready before playing
      audio.oncanplaythrough = () => {
        console.log('Audio can play through without buffering');
      };

      // Set additional audio properties
      audio.preload = 'auto';
      audio.crossOrigin = 'anonymous';
      audio.volume = 1.0; // Ensure volume is at maximum

      audioRef.current = audio;
    }

    // Initialize video elements with proper event handling and preloading
    if (speakingVideoRef.current) {
      console.log('Initializing speaking video');
      speakingVideoRef.current.loop = true;
      speakingVideoRef.current.preload = 'auto';

      // Add event listeners for better debugging
      speakingVideoRef.current.onloadeddata = () => console.log('Speaking video loaded');
      speakingVideoRef.current.onerror = (e) => {
        console.error('Speaking video error:', e);
        setError('Speaking video error: Could not load video');
      };
    }

    if (waitingVideoRef.current) {
      console.log('Initializing waiting video');
      waitingVideoRef.current.loop = true;
      waitingVideoRef.current.preload = 'auto';

      // Add event listeners for better debugging
      waitingVideoRef.current.onloadeddata = () => {
        console.log('Waiting video loaded');
        // Start with waiting video playing once it's loaded
        waitingVideoRef.current?.play().catch((e) => {
          console.error('Error playing waiting video:', e);
          setError('Video playback error: Could not play waiting video');
        });
      };

      waitingVideoRef.current.onerror = (e) => {
        console.error('Waiting video error:', e);
        setError('Waiting video error: Could not load video');
      };
    }

    return () => {
      console.log('Cleaning up media elements');
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      if (speakingVideoRef.current) {
        speakingVideoRef.current.pause();
      }
      if (waitingVideoRef.current) {
        waitingVideoRef.current.pause();
      }
      // Clean up any pending audio load timeouts
      if (audioLoadTimeoutIdRef.current) {
        clearTimeout(audioLoadTimeoutIdRef.current);
        audioLoadTimeoutIdRef.current = null;
      }
    };
  }, [open]);

  // Handle video switching based on botSpeaking state
  useEffect(() => {
    if (!open) return;

    console.log('Video switching effect triggered, botSpeaking:', botSpeaking);

    // Function to safely play a video with retries
    const safePlayVideo = async (videoRef: React.RefObject<HTMLVideoElement>, videoName: string) => {
      if (!videoRef.current) {
        console.error(`${videoName} video ref is null`);
        return false;
      }

      // Make sure video is loaded before attempting to play
      if (videoRef.current.readyState < 2) { // HAVE_CURRENT_DATA or higher
        console.log(`${videoName} video not fully loaded, waiting...`);

        // Wait for video to load enough data
        try {
          await new Promise((resolve, reject) => {
            const loadHandler = () => {
              console.log(`${videoName} video loaded enough data`);
              videoRef.current?.removeEventListener('loadeddata', loadHandler);
              resolve(true);
            };

            const errorHandler = (e: Event) => {
              console.error(`${videoName} video load error:`, e);
              videoRef.current?.removeEventListener('error', errorHandler);
              reject(new Error(`Failed to load ${videoName} video`));
            };

            // Set a timeout in case the video never loads
            const timeoutId = setTimeout(() => {
              videoRef.current?.removeEventListener('loadeddata', loadHandler);
              videoRef.current?.removeEventListener('error', errorHandler);
              console.warn(`${videoName} video load timeout, trying to play anyway`);
              resolve(true);
            }, 2000);

            videoRef.current.addEventListener('loadeddata', loadHandler);
            videoRef.current.addEventListener('error', errorHandler);

            // If video is already loaded, resolve immediately
            if (videoRef.current.readyState >= 2) {
              clearTimeout(timeoutId);
              videoRef.current.removeEventListener('loadeddata', loadHandler);
              videoRef.current.removeEventListener('error', errorHandler);
              resolve(true);
            }
          });
        } catch (e) {
          console.error(`Error waiting for ${videoName} video to load:`, e);
          // Continue anyway and try to play
        }
      }

      // Attempt to play with retry logic
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        try {
          console.log(`Attempting to play ${videoName} video (attempt ${attempts + 1}/${maxAttempts})`);
          await videoRef.current.play();
          console.log(`${videoName} video playing successfully`);
          return true;
        } catch (e) {
          attempts++;
          console.error(`Error playing ${videoName} video (attempt ${attempts}/${maxAttempts}):`, e);

          if (attempts >= maxAttempts) {
            setError(`Could not play ${videoName} video after ${maxAttempts} attempts`);
            return false;
          }

          // Short delay before retry
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      return false;
    };

    // Main video switching logic
    const switchVideos = async () => {
      try {
        if (botSpeaking) {
          console.log('Bot is speaking, switching to speaking video');
          if (waitingVideoRef.current) {
            waitingVideoRef.current.pause();
          }
          await safePlayVideo(speakingVideoRef as any, 'speaking');
        } else {
          console.log('Bot is not speaking, switching to waiting video');
          if (speakingVideoRef.current) {
            speakingVideoRef.current.pause();
          }
          await safePlayVideo(waitingVideoRef as any, 'waiting');
        }
      } catch (e) {
        console.error('Error during video switching:', e);
        setError('Video switching error');
      }
    };

    // Execute the video switching
    switchVideos();

    // Force update video visibility based on botSpeaking state
    // This ensures the correct video is shown even if playback fails
    if (speakingVideoRef.current && waitingVideoRef.current) {
      speakingVideoRef.current.style.display = botSpeaking ? 'block' : 'none';
      waitingVideoRef.current.style.display = botSpeaking ? 'none' : 'block';
    }

    // Set up a periodic check to ensure video state matches botSpeaking state
    // This helps recover from situations where events might have been missed
    const videoStateCheckInterval = setInterval(() => {
      if (!open) return;

      const currentlyShowingSpeakingVideo =
        speakingVideoRef.current?.style.display === 'block' ||
        waitingVideoRef.current?.style.display === 'none';

      // If there's a mismatch between visual state and botSpeaking state, fix it
      if (currentlyShowingSpeakingVideo !== botSpeaking) {
        console.log('Video state mismatch detected, fixing...');
        console.log('Current visual state:', currentlyShowingSpeakingVideo ? 'speaking' : 'waiting');
        console.log('Current botSpeaking state:', botSpeaking);

        if (speakingVideoRef.current && waitingVideoRef.current) {
          speakingVideoRef.current.style.display = botSpeaking ? 'block' : 'none';
          waitingVideoRef.current.style.display = botSpeaking ? 'none' : 'block';

          // Also fix the playback state
          if (botSpeaking) {
            if (speakingVideoRef.current.paused) {
              console.log('Restarting speaking video');
              speakingVideoRef.current.play().catch(e =>
                console.error('Error restarting speaking video:', e)
              );
            }
            if (!waitingVideoRef.current.paused) {
              console.log('Pausing waiting video');
              waitingVideoRef.current.pause();
            }
          } else {
            if (!speakingVideoRef.current.paused) {
              console.log('Pausing speaking video');
              speakingVideoRef.current.pause();
            }
            if (waitingVideoRef.current.paused) {
              console.log('Restarting waiting video');
              waitingVideoRef.current.play().catch(e =>
                console.error('Error restarting waiting video:', e)
              );
            }
          }
        }
      }
    }, 1000); // Check every second

    // Clean up the interval when the effect is cleaned up
    return () => {
      clearInterval(videoStateCheckInterval);
    };

  }, [botSpeaking, open]);

  // open / close websocket based on modal visibility
  useEffect(() => {
    if (!open) return;
    const socket = new WebSocket(WS_URL);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      try {
        console.log('WebSocket message received:', event.data);

        // Check if the message is a plain text message starting with "webmaster"
        if (typeof event.data === 'string' && event.data.startsWith('webmaster')) {
          console.log('Received webmaster message:', event.data);
          // Handle webmaster message - typically just a system message, no need for special handling
          return;
        }

        // Try to parse as JSON
        let msg;
        try {
          msg = JSON.parse(event.data);
          console.log('Parsed message:', msg);
        } catch (parseError) {
          console.error('Failed to parse message as JSON:', parseError);
          // For non-JSON messages, create a simple object to handle them
          msg = { type: 'text', data: event.data };
          console.log('Created fallback message object:', msg);
        }

        let inner: any = msg.data || {};
        if (typeof inner === 'string') {
          try {
            inner = JSON.parse(inner);
            console.log('Parsed inner data:', inner);
          } catch (e) {
            console.log('Failed to parse inner data as JSON, using as is');
            inner = { content: inner };
          }
        }

        // Extract content and role with better fallbacks
        const content: string = inner.content || inner.text || '';
        const role: string = inner.role || '';
        const type: string = msg.type || '';

        console.log('Extracted data:', { type, role, content });

        // Handle user messages
        if (type === 'ownMessage' || role === 'user') {
          console.log('Processing user message');
          console.log('User message content:', content);

          // Get the actual user input from the message
          // Use the actual content from the websocket message, not a hardcoded value
          const userText = content || 'No text received';

          setTranscript((prev) => prev + userText);
          setMessages((prev) => [...prev, { role: 'user', text: userText }]);
        }
        // Handle bot messages - more inclusive conditions
        else if (type === 'chunk' || type === 'message' || role === 'bot' || role === 'assistant') {
          console.log('Processing bot message');
          if (content) {
            botBufferRef.current += content;
            setTranscript((prev) => prev + content);
          }

          // Check various conditions that might indicate this is the last chunk
          const isLast = inner.isLast || msg.isLast || type === 'message';

          if (isLast) {
            console.log('Processing final bot message');
            const fullText = botBufferRef.current;
            console.log('Full bot text:', fullText);

            if (fullText) {
              // Add as new bot message
              setMessages((prev) => [...prev, { role: 'bot', text: fullText }]);

              // Play audio using HTML Audio element
              if (audioRef.current) {
                console.log('Attempting to play audio');

                // Create speech synthesis URL
                const ttsUrl = `https://api.deep-learn.uz/tts?text=${encodeURIComponent(fullText)}`;
                console.log('TTS URL:', ttsUrl);

                // Reset audio element before setting new source
                audioRef.current.pause();
                audioRef.current.currentTime = 0;

                // Track retry attempts
                let retryCount = 0;
                const maxRetries = 3;

                // Function to attempt loading the audio
                const attemptLoadAudio = (retryNum = 0) => {
                  console.log(`Attempting to load audio (attempt ${retryNum + 1}/${maxRetries + 1})`);

                  // Clear any existing timeout
                  if (audioLoadTimeoutIdRef.current) {
                    clearTimeout(audioLoadTimeoutIdRef.current);
                    audioLoadTimeoutIdRef.current = null;
                  }

                  // Set up a load timeout for this attempt
                  audioLoadTimeoutIdRef.current = setTimeout(() => {
                    console.warn(`Audio load timeout on attempt ${retryNum + 1}`);

                    if (retryNum < maxRetries) {
                      // Try again with a different approach
                      console.log(`Retrying audio load (${retryNum + 2}/${maxRetries + 1})`);
                      retryCount++;

                      // Remove the previous event listener before adding a new one
                      audioRef.current?.removeEventListener('loadeddata', handleAudioLoaded);

                      // Try a different approach on each retry
                      if (retryNum === 0) {
                        // First retry: Try with a different CORS setting
                        audioRef.current.crossOrigin = 'use-credentials';
                        attemptLoadAudio(retryCount);
                      } else if (retryNum === 1) {
                        // Second retry: Try with a cache-busting parameter
                        const cacheBustUrl = `${ttsUrl}&cacheBust=${Date.now()}`;
                        audioRef.current.src = cacheBustUrl;
                        audioRef.current.crossOrigin = 'anonymous';
                        attemptLoadAudio(retryCount);
                      } else {
                        // Last retry: Try with a fetch request first to warm up the connection
                        fetch(ttsUrl, { mode: 'no-cors' })
                          .then(() => {
                            audioRef.current.src = ttsUrl;
                            audioRef.current.crossOrigin = 'anonymous';
                            attemptLoadAudio(retryCount);
                          })
                          .catch(e => {
                            console.error('Fetch pre-warming failed:', e);
                            // Continue with the retry anyway
                            audioRef.current.src = ttsUrl;
                            audioRef.current.crossOrigin = 'anonymous';
                            attemptLoadAudio(retryCount);
                          });
                      }
                    } else {
                      // All retries failed, show error and use fallback
                      console.error('All audio load attempts failed');
                      setError('Audio load timeout - check network connection');

                      // Use browser's built-in speech synthesis as fallback
                      try {
                        console.log('Using speech synthesis fallback');
                        window.speechSynthesis.cancel(); // Cancel any ongoing speech
                        const utterance = new SpeechSynthesisUtterance(fullText);
                        utterance.onstart = () => {
                          console.log('Fallback speech started');
                          setBotSpeaking(true);
                        };
                        utterance.onend = () => {
                          console.log('Fallback speech ended');
                          setBotSpeaking(false);
                        };
                        utterance.onerror = (e) => {
                          console.error('Fallback speech error:', e);
                          setBotSpeaking(false);
                        };
                        window.speechSynthesis.speak(utterance);
                      } catch (e) {
                        console.error('Speech synthesis fallback failed:', e);
                        // Force video state to reset after timeout
                        setBotSpeaking(false);
                      }
                    }
                  }, 8000); // Slightly shorter timeout for retries

                  // Set up loadeddata event handler for this specific audio load
                  const handleAudioLoaded = () => {
                    console.log('Audio data loaded successfully');
                    if (audioLoadTimeoutIdRef.current) {
                      clearTimeout(audioLoadTimeoutIdRef.current);
                      audioLoadTimeoutIdRef.current = null;
                    }
                    audioRef.current?.removeEventListener('loadeddata', handleAudioLoaded);

                    // Play the audio now that it's loaded
                    console.log('Starting audio playback');
                    const playPromise = audioRef.current?.play();
                    if (playPromise !== undefined) {
                      playPromise
                        .then(() => {
                          console.log('Audio playback started successfully');
                          setBotSpeaking(true); // Explicitly set speaking state
                        })
                        .catch((e:any) => {
                          console.error('Audio playback error:', e);
                          setError(`Audio playback error: ${e.message}`);

                          // Try fallback speech synthesis
                          try {
                            console.log('Using speech synthesis fallback after playback error');
                            window.speechSynthesis.cancel();
                            const utterance = new SpeechSynthesisUtterance(fullText);
                            utterance.onstart = () => setBotSpeaking(true);
                            utterance.onend = () => setBotSpeaking(false);
                            window.speechSynthesis.speak(utterance);
                          } catch (fallbackError) {
                            console.error('Speech synthesis fallback failed:', fallbackError);
                            // Try to recover by forcing video state cycle
                            setBotSpeaking(true);
                            setTimeout(() => {
                              console.log('Forcing botSpeaking state to false after error');
                              setBotSpeaking(false);
                            }, 5000); // Reset after 5 seconds
                          }
                        });
                    }
                  };

                  // Add the one-time event listener
                  audioRef.current.addEventListener('loadeddata', handleAudioLoaded);

                  // Also listen for the error event to handle loading failures
                  const handleAudioError = (e:any) => {
                    console.error('Audio loading error:', e);
                    audioRef.current?.removeEventListener('error', handleAudioError);

                    if (retryNum < maxRetries) {
                      // Clear timeout and retry
                      if (audioLoadTimeoutIdRef.current) {
                        clearTimeout(audioLoadTimeoutIdRef.current);
                        audioLoadTimeoutIdRef.current = null;
                      }
                      retryCount++;
                      attemptLoadAudio(retryCount);
                    }
                  };

                  audioRef.current.addEventListener('error', handleAudioError, { once: true });

                  // Ensure audio element is properly set up for this attempt
                  if (retryNum === 0) {
                    audioRef.current.src = ttsUrl;
                    audioRef.current.crossOrigin = 'anonymous';
                  }

                  // Force a load to trigger the loadeddata event
                  audioRef.current.load();
                };

                // Start the first attempt
                attemptLoadAudio(0);

                // Set speaking state immediately to show visual feedback
                // This will be maintained or reset based on actual audio playback
                setBotSpeaking(true);
              }
            }
            botBufferRef.current = '';
            setRecording(false);
          }
        }
      } catch (e) {
        // ignore parse errors
        console.error('WebSocket message parsing error:', e);
      }
    };
    socket.onerror = () => setError('WebSocket error');
    return () => {
      socket.close();
    };
  }, [open]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };
      recorder.start(500); // emit chunks every 500ms
      setRecording(true);
    } catch (e) {
      setError('Cannot access microphone');
    }
  };

  const stopRecording = async () => {
    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    setRecording(false);
    // After stop, send full buffer
    const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
    const buffer = await blob.arrayBuffer();
    chunksRef.current = [];
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(buffer);
    }
  };

  const handleAfterClose = () => {
    stopRecording();
    setTranscript('');
    chunksRef.current = [];
    setError(null);
  };

  return (
    <Modal
      title="Real-Time Conversation"
      open={open}
      onCancel={onClose}
      afterClose={handleAfterClose}
      footer={null}
      width={900}
      styles={{ body: { padding: '24px', backgroundColor: '#f8f9fa' } }}
    >
      {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}

      <Row gutter={[24, 24]}>
        {/* Video Section */}
        <Col xs={24} md={12}>
          <div style={{
            position: 'relative',
            width: '100%',
            height: '300px',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#000'
          }}>
            {/* Speaking Video (shown when bot is speaking) */}
            <video
              ref={speakingVideoRef}
              src="/ai-teacher/speaking.mp4"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                // Initial display state - will be controlled by JS
                display: 'none'
              }}
              muted
              playsInline
              preload="auto"
              // Add data attribute for debugging
              data-video-type="speaking"
            />

            {/* Waiting Video (shown when bot is not speaking) */}
            <video
              ref={waitingVideoRef}
              src="/ai-teacher/waiting.mp4"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                // Initial display state - will be controlled by JS
                display: 'block'
              }}
              muted
              playsInline
              preload="auto"
              // Add data attribute for debugging
              data-video-type="waiting"
            />

            {/* Status indicator */}
            <div style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              padding: '4px 8px',
              borderRadius: '4px',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: '#fff',
              fontSize: '12px'
            }}>
              {botSpeaking ? 'Speaking' : 'Listening'}
            </div>
          </div>

          {/* Recording Controls */}
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Space>
              {recording ? (
                <Button danger onClick={stopRecording} size="large" shape="round" icon={<span>⏹</span>}>
                  Stop Recording
                </Button>
              ) : (
                <Button type="primary" onClick={startRecording} size="large" shape="round" icon={<span>🎤</span>}>
                  Start Recording
                </Button>
              )}
              <Tag color={recording ? 'red' : 'default'} style={{ marginLeft: 8 }}>
                {recording ? 'Recording...' : 'Idle'}
              </Tag>
            </Space>
          </div>
        </Col>

        {/* Conversation Section */}
        <Col xs={24} md={12}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            height: '350px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Typography.Title level={4} style={{ marginTop: 0, marginBottom: 16 }}>
              Conversation
            </Typography.Title>

            <div style={{
              flex: 1,
              overflowY: 'auto',
              marginBottom: 16,
              padding: '8px'
            }}>
              {messages.length === 0 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  color: '#999'
                }}>
                  <Typography.Text type="secondary">Start a conversation...</Typography.Text>
                </div>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: m.role === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{
                    backgroundColor: m.role === 'user' ? '#e6f7ff' : '#f6ffed',
                    borderRadius: '12px',
                    padding: '10px 16px',
                    maxWidth: '85%',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                  }}>
                    <Typography.Text strong style={{ display: 'block', marginBottom: 4 }}>
                      {m.role === 'user' ? 'You' : 'Assistant'}
                    </Typography.Text>
                    <Typography.Text style={{ whiteSpace: 'pre-wrap' }}>
                      {m.text}
                    </Typography.Text>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </Modal>
  );
};

export default RealTimeSpeechModal;
