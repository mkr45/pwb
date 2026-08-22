import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import engagementBg from './assets/engagement-bg.jpg'
import mastMaganAudio from './assets/mast-magan.mp3'
import couplePhoto from './assets/couple-photo.jpeg'
import springFrame from './assets/spring-frame.jpg'
import thirdPhotoOne from './assets/third-photo-one.jpeg'
import thirdPhotoTwo from './assets/third-photo-two.jpeg'
import './App.css'

const eventDate = new Date('2026-10-23T19:00:00+05:30')

const getTimeLeft = () => {
  const now = new Date()
  const diff = eventDate.getTime() - now.getTime()

  if (diff <= 0) {
    return { days: '00', hours: '00', minutes: '00', seconds: '00' }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  return {
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  }
}

function App() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft())
  const [scratchCelebrationKey, setScratchCelebrationKey] = useState(0)
  const [showAudioButton, setShowAudioButton] = useState(false)
  const [showMusicOverlay, setShowMusicOverlay] = useState(true)
  const [isGiftOpening, setIsGiftOpening] = useState(false)
  const [isOverlayClosing, setIsOverlayClosing] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const scratchCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const scratchDrawingRef = useRef(false)
  const scratchRevealTimeoutRef = useRef<number | null>(null)
  const musicStartTimeoutRef = useRef<number | null>(null)
  const overlayCloseTimeoutRef = useRef<number | null>(null)
  const { scrollY } = useScroll()
  const garlandDrift = useTransform(scrollY, [0, 2200], [0, -70])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft(getTimeLeft())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    audio.volume = 0.65
    audio.preload = 'auto'

    const tryPlay = async () => {
      try {
        if (audio.currentTime < 9) {
          audio.currentTime = 9
        }
        await audio.play()
        setShowAudioButton(false)
        setIsOverlayClosing(true)
        overlayCloseTimeoutRef.current = window.setTimeout(() => {
          setShowMusicOverlay(false)
          setIsOverlayClosing(false)
        }, 700)
      } catch {
        setShowAudioButton(true)
        setShowMusicOverlay(true)
      }
    }

    const handleReady = () => {
      void tryPlay()
    }

    const handleFirstInteraction = () => {
      void tryPlay()
      window.removeEventListener('pointerdown', handleFirstInteraction)
      window.removeEventListener('keydown', handleFirstInteraction)
    }

    if (audio.readyState >= 1) {
      void tryPlay()
    } else {
      audio.addEventListener('loadedmetadata', handleReady, { once: true })
    }

    window.addEventListener('pointerdown', handleFirstInteraction, { once: true })
    window.addEventListener('keydown', handleFirstInteraction, { once: true })

    return () => {
      audio.removeEventListener('loadedmetadata', handleReady)
      window.removeEventListener('pointerdown', handleFirstInteraction)
      window.removeEventListener('keydown', handleFirstInteraction)
      if (musicStartTimeoutRef.current) {
        window.clearTimeout(musicStartTimeoutRef.current)
      }
      if (overlayCloseTimeoutRef.current) {
        window.clearTimeout(overlayCloseTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))

    if (revealItems.length === 0) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.01,
        rootMargin: '0px 0px 6% 0px',
      },
    )

    revealItems.forEach((item) => {
      item.style.setProperty('--reveal-delay', '0s')
      observer.observe(item)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = scratchCanvasRef.current

    if (!canvas) {
      return
    }

    const context = canvas.getContext('2d')

    if (!context) {
      return
    }

    const clearRemainingCover = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight

      context.save()
      context.globalCompositeOperation = 'destination-out'
      context.clearRect(0, 0, width, height)
      context.restore()
      setScratchCelebrationKey((current) => current + 1)
    }

    const drawCover = () => {
      const ratio = window.devicePixelRatio || 1
      const width = canvas.clientWidth
      const height = canvas.clientHeight

      canvas.width = width * ratio
      canvas.height = height * ratio
      context.setTransform(1, 0, 0, 1, 0, 0)
      context.scale(ratio, ratio)

      const gradient = context.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, '#f5d39d')
      gradient.addColorStop(0.5, '#d9a55d')
      gradient.addColorStop(1, '#b97d39')
      context.globalCompositeOperation = 'source-over'
      context.clearRect(0, 0, width, height)
      context.fillStyle = gradient
      context.fillRect(0, 0, width, height)

      context.strokeStyle = 'rgba(255,255,255,0.28)'
      context.lineWidth = 1
      for (let line = 18; line < width + height; line += 26) {
        context.beginPath()
        context.moveTo(line, 0)
        context.lineTo(line - height, height)
        context.stroke()
      }

      context.fillStyle = 'rgba(255, 248, 236, 0.82)'
      context.font = '600 18px Georgia'
      context.textAlign = 'center'
      context.fillText('Scratch to Reveal', width / 2, height / 2 + 6)
      context.globalCompositeOperation = 'destination-out'
    }

    drawCover()
    window.addEventListener('resize', drawCover)

    canvas.dataset.clearScratch = 'ready'
    ;(canvas as HTMLCanvasElement & { clearScratch?: () => void }).clearScratch = clearRemainingCover

    return () => {
      window.removeEventListener('resize', drawCover)
      if (scratchRevealTimeoutRef.current) {
        window.clearTimeout(scratchRevealTimeoutRef.current)
      }
    }
  }, [])

  const scratchAtPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = scratchCanvasRef.current

    if (!canvas) {
      return
    }

    const context = canvas.getContext('2d')

    if (!context) {
      return
    }

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    context.beginPath()
    context.arc(x, y, 18, 0, Math.PI * 2)
    context.fill()

    if (!scratchRevealTimeoutRef.current) {
      scratchRevealTimeoutRef.current = window.setTimeout(() => {
        ;(canvas as HTMLCanvasElement & { clearScratch?: () => void }).clearScratch?.()
        scratchRevealTimeoutRef.current = null
      }, 700)
    }
  }

  return (
    <main className="page">
      <audio ref={audioRef} src={mastMaganAudio} loop autoPlay />
      {showMusicOverlay ? (
        <div className={`music-overlay ${isOverlayClosing ? 'music-overlay--closing' : ''}`}>
          <div className="music-overlay__decor" aria-hidden="true">
            <span className="music-overlay__bloom music-overlay__bloom--top-left" />
            <span className="music-overlay__bloom music-overlay__bloom--top-right" />
            <span className="music-overlay__bloom music-overlay__bloom--bottom-left" />
            <span className="music-overlay__bloom music-overlay__bloom--bottom-right" />
            <span className="music-overlay__glow music-overlay__glow--one" />
            <span className="music-overlay__glow music-overlay__glow--two" />
          </div>
          <button
            type="button"
            className={`music-gift ${isGiftOpening ? 'is-opening' : ''}`}
            onClick={() => {
              if (isGiftOpening) {
                return
              }

              setIsGiftOpening(true)
              musicStartTimeoutRef.current = window.setTimeout(async () => {
                try {
                  if (audioRef.current && audioRef.current.currentTime < 9) {
                    audioRef.current.currentTime = 9
                  }
                  await audioRef.current?.play()
                  setShowAudioButton(false)
                  setIsOverlayClosing(true)
                  overlayCloseTimeoutRef.current = window.setTimeout(() => {
                    setShowMusicOverlay(false)
                    setIsOverlayClosing(false)
                  }, 1500)
                  setIsGiftOpening(false)
                } catch {
                  setShowMusicOverlay(true)
                  setIsOverlayClosing(false)
                  setIsGiftOpening(false)
                }
              }, 1900)
            }}
          >
            <span className="music-overlay__eyebrow">A Special Surprise</span>
            <span className="music-gift__scene" aria-hidden="true">
              <span className="music-gift__spark music-gift__spark--one" />
              <span className="music-gift__spark music-gift__spark--two" />
              <span className="music-gift__spark music-gift__spark--three" />
              <span className="music-ringbox">
                <span className="music-ringbox__lid" />
                <span className="music-ringbox__base" />
                <span className="music-ringbox__inner" />
                <span className="music-ringbox__ring">
                  <span className="music-ringbox__diamond" />
                </span>
              </span>
            </span>
            <strong>{isGiftOpening ? 'Opening a little piece of our love...' : 'Tap to open the ring box and reveal our surprise'}</strong>
            <span className="music-overlay__note">A tiny moment before the celebration unfolds.</span>
          </button>
        </div>
      ) : null}
      {showAudioButton ? (
        <button
          type="button"
          className="audio-play-button"
          onClick={async () => {
            try {
              await audioRef.current?.play()
              setShowAudioButton(false)
            } catch {
              setShowAudioButton(true)
            }
          }}
        >
          Play Song
        </button>
      ) : null}
      <motion.div className="page-corner-garlands" aria-hidden="true" style={{ y: garlandDrift }}>
        <div className="page-corner-garlands__item page-corner-garlands__item--top-left">
          <span className="page-corner-garlands__top" />
          <span className="page-corner-garlands__string" />
          <span className="page-corner-garlands__string page-corner-garlands__string--short" />
          <span className="page-corner-garlands__bottom" />
        </div>
        <div className="page-corner-garlands__item page-corner-garlands__item--top-right">
          <span className="page-corner-garlands__top" />
          <span className="page-corner-garlands__string" />
          <span className="page-corner-garlands__string page-corner-garlands__string--short" />
          <span className="page-corner-garlands__bottom" />
        </div>
      </motion.div>
      <section className="hero">
        <div className="invite-card">
          <div className="reveal is-visible">
            <div className="invite-card__art">
              <img
                className="invite-card__image"
                src={engagementBg}
                alt="Engagement invitation artwork"
              />
              <div className="invite-card__content">
                <p className="invite-card__eyebrow">Engagement Ceremony</p>
                <h1>Prashant Agarwal</h1>
                <div className="invite-card__ampersand">&</div>
                <h1>Bulbul Agarwal</h1>
              </div>
            </div>
          </div>
          <div className="reveal">
            <div className="invite-card__secondary">
              <img
                className="invite-card__secondary-image"
                src={springFrame}
                alt="Secondary engagement invitation artwork"
              />
              <div className="invite-card__overlay-card">
                <img
                  className="invite-card__overlay-photo invite-card__overlay-photo--float"
                  src={couplePhoto}
                  alt="Couple portrait"
                />
                <div className="invite-card__overlay-copy">
                  <p>With love in our hearts, we invite you to share in our special day.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="reveal">
            <div className="invite-card__third">
              <img
                className="invite-card__third-image"
                src={springFrame}
                alt="Floral invitation artwork"
              />
              <div className="invite-card__third-gallery">
                <img
                  className="invite-card__third-photo invite-card__third-photo--left"
                  src={thirdPhotoOne}
                  alt="Portrait of Prashant"
                />
                <img
                  className="invite-card__third-photo invite-card__third-photo--right"
                  src={thirdPhotoTwo}
                  alt="Portrait of Bulbul"
                />
                <div className="invite-card__third-copy">
                  <p>A glimpse of the couple</p>
                  <span>Prashant and Bulbul, ready to begin their forever with love, laughter, and togetherness.</span>
                </div>
              </div>
            </div>
          </div>
          <div className="reveal">
            <div className="invite-card__fifth">
              <img
                className="invite-card__fifth-image"
                src={springFrame}
                alt="Scratch card invitation artwork"
              />
              <div className="invite-card__fifth-content">
                <p className="invite-card__fifth-eyebrow">A Special Reveal</p>
                <div className="invite-card__scratch-shell">
                  <div
                    key={scratchCelebrationKey}
                    className={`invite-card__scratch-pop ${scratchCelebrationKey > 0 ? 'is-active' : ''}`}
                    aria-hidden="true"
                  >
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="invite-card__scratch-result">
                    <span>Engagement Date</span>
                    <strong>23 October 2026</strong>
                  </div>
                  <canvas
                    ref={scratchCanvasRef}
                    className="invite-card__scratch-canvas"
                    onPointerDown={(event) => {
                      scratchDrawingRef.current = true
                      scratchAtPoint(event)
                    }}
                    onPointerMove={(event) => {
                      if (scratchDrawingRef.current) {
                        scratchAtPoint(event)
                      }
                    }}
                    onPointerUp={() => {
                      scratchDrawingRef.current = false
                    }}
                    onPointerLeave={() => {
                      scratchDrawingRef.current = false
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="reveal">
            <div className="invite-card__fourth">
              <img
                className="invite-card__fourth-image"
                src={springFrame}
                alt="Countdown invitation artwork"
              />
              <div className="invite-card__fourth-content">
                <p className="invite-card__fourth-eyebrow">Counting Down To Our Day</p>
                <div className="invite-card__fourth-grid">
                  <div className="invite-card__fourth-box">
                    <strong>{timeLeft.days}</strong>
                    <span>Days</span>
                  </div>
                  <div className="invite-card__fourth-box">
                    <strong>{timeLeft.hours}</strong>
                    <span>Hours</span>
                  </div>
                  <div className="invite-card__fourth-box">
                    <strong>{timeLeft.minutes}</strong>
                    <span>Minutes</span>
                  </div>
                  <div className="invite-card__fourth-box">
                    <strong>{timeLeft.seconds}</strong>
                    <span>Seconds</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
