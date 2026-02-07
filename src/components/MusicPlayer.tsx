import { useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import { Play, Pause, Music, Volume2, VolumeX } from 'lucide-react';

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const playerRef = useRef<YouTube>(null);

  // Video ID from the YouTube Music link
  const videoId = 'j90nt-6GXng';

  const opts = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      loop: 1,
      playlist: videoId,
    },
  };

  const onReady = (event: { target: unknown }) => {
    setPlayerReady(true);
    if (isMuted) {
      (event.target as { mute: () => void }).mute();
    }
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
    
    const player = playerRef.current.getInternalPlayer();
    if (!player) return;

    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    
    const player = playerRef.current.getInternalPlayer();
    if (!player) return;

    if (isMuted) {
      player.unMute();
    } else {
      player.mute();
    }
    setIsMuted(!isMuted);
  };

  // Auto-collapse after 5 seconds if not interacted
  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => {
        setIsExpanded(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Hidden YouTube Player */}
      <div className="hidden">
        <YouTube
          ref={playerRef}
          videoId={videoId}
          opts={opts}
          onReady={onReady}
          onEnd={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
        />
      </div>

      {/* Player UI - Retro Style */}
      <div 
        className={`
          flex items-center gap-2 
          transition-all duration-100
          ${isExpanded ? 'pl-3 pr-2 py-2' : 'p-1'}
        `}
        style={{
          background: '#1a1a3e',
          border: '4px solid #6b4ee6',
          boxShadow: '4px 4px 0 #ff6b9d',
        }}
        onMouseEnter={() => setIsExpanded(true)}
      >
        {/* Music Icon */}
        <div 
          className={`
            w-10 h-10 flex items-center justify-center flex-shrink-0
            ${isPlaying ? 'animate-pulse' : ''}
          `}
          style={{
            background: isPlaying ? '#00d4ff' : '#6b4ee6',
            boxShadow: '2px 2px 0 rgba(0,0,0,0.3)',
          }}
        >
          <Music className="w-5 h-5 text-white" />
        </div>

        {/* Expanded Controls */}
        {isExpanded && (
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-100">
            <span className="font-pixel text-[8px] text-[#a0a0c0] whitespace-nowrap hidden sm:block">
              BGM
            </span>
            
            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              disabled={!playerReady}
              className={`
                w-10 h-10 flex items-center justify-center
                transition-all duration-100
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
              style={{
                background: isPlaying ? 'transparent' : '#00d4ff',
                border: isPlaying ? '2px solid #00d4ff' : 'none',
                boxShadow: isPlaying ? 'none' : '2px 2px 0 rgba(0,0,0,0.3)',
              }}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-[#00d4ff]" />
              ) : (
                <Play className="w-4 h-4 text-[#0a0a1a] ml-0.5" />
              )}
            </button>

            {/* Mute Button */}
            <button
              onClick={toggleMute}
              disabled={!playerReady}
              className={`
                w-10 h-10 flex items-center justify-center
                transition-all duration-100
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
              style={{
                background: isMuted ? '#ff6b9d' : 'transparent',
                border: isMuted ? 'none' : '2px solid #a0a0c0',
                boxShadow: isMuted ? '2px 2px 0 rgba(0,0,0,0.3)' : 'none',
              }}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-white" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#a0a0c0]" />
              )}
            </button>
          </div>
        )}

        {/* Collapsed indicator - pixel bars */}
        {!isExpanded && isPlaying && (
          <div className="flex gap-1 items-end h-4 px-1">
            <span 
              className="w-1 bg-[#00d4ff]"
              style={{ height: '60%', animation: 'bounce 0.5s infinite' }}
            />
            <span 
              className="w-1 bg-[#ff6b9d]"
              style={{ height: '100%', animation: 'bounce 0.7s infinite' }}
            />
            <span 
              className="w-1 bg-[#6b4ee6]"
              style={{ height: '40%', animation: 'bounce 0.4s infinite' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
