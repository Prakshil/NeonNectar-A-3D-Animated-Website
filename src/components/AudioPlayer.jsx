import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showPrompt, setShowPrompt] = useState(true)
  const audioRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    // Animate button entrance
    gsap.from(buttonRef.current, {
      scale: 0,
      rotation: 360,
      duration: 1,
      ease: 'back.out(1.7)',
      delay: 1.5
    })

    // Auto-play on first user interaction
    const startAudio = async () => {
      try {
        if (audioRef.current && !isPlaying) {
          await audioRef.current.play()
          setIsPlaying(true)
          setShowPrompt(false)
          // Remove listeners after first play
          document.removeEventListener('click', startAudio)
          document.removeEventListener('scroll', startAudio)
          document.removeEventListener('keydown', startAudio)
        }
      } catch (error) {
        // Autoplay blocked
        console.log('Click play button to start music')
      }
    }

    // Add event listeners for user interaction
    document.addEventListener('click', startAudio, { once: true })
    document.addEventListener('scroll', startAudio, { once: true })
    document.addEventListener('keydown', startAudio, { once: true })
    
    return () => {
      document.removeEventListener('click', startAudio)
      document.removeEventListener('scroll', startAudio)
      document.removeEventListener('keydown', startAudio)
    }
  }, [])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
      
      // Animate button
      gsap.to(buttonRef.current, {
        scale: 1.2,
        duration: 0.1,
        yoyo: true,
        repeat: 1
      })
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
      {/* Audio element */}
      <audio 
        ref={audioRef} 
        loop 
        preload="auto"
        src="/audio/background-music.mp3"
      />
      
      {/* Play/Pause Button */}
      <button
        ref={buttonRef}
        onClick={togglePlay}
        className="w-14 h-14 rounded-full bg-yellow hover:bg-yellow/80 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* Mute Button (optional) */}
      {isPlaying && (
        <button
          onClick={toggleMute}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-all duration-300"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      )}
    </div>
  )
}

export default AudioPlayer
