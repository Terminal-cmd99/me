import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Music, Volume2, VolumeX } from 'lucide-react';

export function ChiptunePlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const reverbNodeRef = useRef<ConvolverNode | null>(null);
  const sequenceTimeoutRef = useRef<number | null>(null);
  const noteIndexRef = useRef(0);
  const isPlayingRef = useRef(false);

  const melody = [
    { note: 523.25, duration: 400 },
    { note: 587.33, duration: 400 },
    { note: 659.25, duration: 400 },
    { note: 783.99, duration: 400 },
    { note: 880.00, duration: 400 },
    { note: 783.99, duration: 400 },
    { note: 659.25, duration: 400 },
    { note: 587.33, duration: 400 },
  ];

  const bassLine = [
    { note: 261.63, duration: 3200 },
    { note: 261.63, duration: 3200 },
    { note: 196.00, duration: 3200 },
    { note: 196.00, duration: 3200 },
  ];

  const createReverb = useCallback((audioContext: AudioContext) => {
    const sampleRate = audioContext.sampleRate;
    const length = sampleRate * 1.5;
    const impulse = audioContext.createBuffer(2, length, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
      }
    }
    
    const convolver = audioContext.createConvolver();
    convolver.buffer = impulse;
    return convolver;
  }, []);

  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      
      masterGainRef.current = audioContextRef.current.createGain();
      masterGainRef.current.gain.value = 0.15;
      
      reverbNodeRef.current = createReverb(audioContextRef.current);
      
      masterGainRef.current.connect(reverbNodeRef.current);
      reverbNodeRef.current.connect(audioContextRef.current.destination);
    }
    return audioContextRef.current;
  }, [createReverb]);

  const stopPlayback = useCallback(() => {
    if (sequenceTimeoutRef.current) {
      clearTimeout(sequenceTimeoutRef.current);
      sequenceTimeoutRef.current = null;
    }
    
    if (audioContextRef.current?.state === 'running') {
      audioContextRef.current.suspend();
    }
    
    isPlayingRef.current = false;
  }, []);

  const playNote = useCallback((frequency: number, duration: number, type: OscillatorType, volume: number) => {
    if (!audioContextRef.current || !masterGainRef.current) return;

    const osc = audioContextRef.current.createOscillator();
    const gain = audioContextRef.current.createGain();

    osc.type = type;
    osc.frequency.value = frequency;

    const now = audioContextRef.current.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration / 1000);

    osc.connect(gain);
    gain.connect(masterGainRef.current);

    osc.start(now);
    osc.stop(now + duration / 1000 + 0.1);
  }, []);

  const playSequence = useCallback(() => {
    if (!isPlayingRef.current) return;

    const currentNote = melody[noteIndexRef.current % melody.length];
    const bassNote = bassLine[Math.floor(noteIndexRef.current / 8) % bassLine.length];

    playNote(currentNote.note, currentNote.duration, 'square', 0.1);
    playNote(currentNote.note * 1.5, currentNote.duration, 'triangle', 0.05);

    if (noteIndexRef.current % 8 === 0) {
      playNote(bassNote.note, bassNote.duration, 'sawtooth', 0.08);
    }

    noteIndexRef.current++;

    sequenceTimeoutRef.current = window.setTimeout(() => {
      if (isPlayingRef.current) {
        playSequence();
      }
    }, currentNote.duration);
  }, [melody, bassLine, playNote]);

  const startPlayback = useCallback(async () => {
    if (isPlayingRef.current) return;
    
    const ctx = initAudio();
    
    try {
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      
      isPlayingRef.current = true;
      noteIndexRef.current = 0;
      playSequence();
    } catch (err) {
      console.log('Audio playback failed:', err);
    }
  }, [initAudio, playSequence]);

  const togglePlay = useCallback(() => {
    if (!isPlaying) {
      startPlayback();
      setIsPlaying(true);
    } else {
      stopPlayback();
      setIsPlaying(false);
    }
  }, [isPlaying, startPlayback, stopPlayback]);

  const toggleMute = useCallback(() => {
    if (masterGainRef.current) {
      const newMuted = !isMuted;
      masterGainRef.current.gain.value = newMuted ? 0 : 0.15;
      setIsMuted(newMuted);
    }
  }, [isMuted]);

  useEffect(() => {
    return () => {
      stopPlayback();
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close();
      }
    };
  }, [stopPlayback]);

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="mb-3 px-4 py-3 font-pixel text-xs flex items-center gap-2 animate-bounce"
          style={{
            background: '#00d4ff',
            color: '#0a0a1a',
            border: '4px solid #fff',
            boxShadow: '4px 4px 0 #6b4ee6',
          }}
        >
          <Music className="w-4 h-4" />
          START MUSIC
        </button>
      )}

      <div 
        className="flex items-center gap-2 p-2"
        style={{
          background: '#1a1a3e',
          border: '4px solid #6b4ee6',
          boxShadow: '4px 4px 0 #ff6b9d',
        }}
      >
        <div 
          className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${isPlaying ? 'animate-pulse' : ''}`}
          style={{
            background: isPlaying ? '#00d4ff' : '#6b4ee6',
            boxShadow: '2px 2px 0 rgba(0,0,0,0.3)',
          }}
        >
          <Music className="w-5 h-5 text-white" />
        </div>

        <div className="flex items-center gap-2">
          <span 
            className="font-pixel text-[8px] whitespace-nowrap hidden sm:block"
            style={{ color: '#a0a0c0' }}
          >
            8-BIT BGM
          </span>
          
          <button
            onClick={togglePlay}
            className="w-10 h-10 flex items-center justify-center transition-all duration-100"
            style={{
              background: isPlaying ? 'transparent' : '#00d4ff',
              border: isPlaying ? '2px solid #00d4ff' : 'none',
              boxShadow: isPlaying ? 'none' : '2px 2px 0 rgba(0,0,0,0.3)',
            }}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" style={{ color: '#00d4ff' }} />
            ) : (
              <Play className="w-4 h-4 ml-0.5" style={{ color: '#0a0a1a' }} />
            )}
          </button>

          <button
            onClick={toggleMute}
            className="w-10 h-10 flex items-center justify-center transition-all duration-100"
            style={{
              background: isMuted ? '#ff6b9d' : 'transparent',
              border: isMuted ? 'none' : '2px solid #a0a0c0',
              boxShadow: isMuted ? '2px 2px 0 rgba(0,0,0,0.3)' : 'none',
            }}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-white" />
            ) : (
              <Volume2 className="w-4 h-4" style={{ color: '#a0a0c0' }} />
            )}
          </button>
        </div>

        {isPlaying && (
          <div className="flex gap-1 items-end h-4 px-1">
            <span className="w-1 bg-[#00d4ff]" style={{ height: '60%', animation: 'bounce 0.5s infinite' }} />
            <span className="w-1 bg-[#ff6b9d]" style={{ height: '100%', animation: 'bounce 0.7s infinite' }} />
            <span className="w-1 bg-[#6b4ee6]" style={{ height: '40%', animation: 'bounce 0.4s infinite' }} />
          </div>
        )}
      </div>
    </div>
  );
}
