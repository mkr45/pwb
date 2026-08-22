import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'
import engagementBg from './assets/engagement-bg.jpg'
import couplePhoto from './assets/couple-photo.jpeg'
import thirdPhotoOne from './assets/third-photo-one.jpeg'
import thirdPhotoTwo from './assets/third-photo-two.jpeg'
import thirdPanel from './assets/third-panel.avif'
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
  const { scrollY } = useScroll()
  const garlandDrift = useTransform(scrollY, [0, 2200], [0, -70])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft(getTimeLeft())
    }, 1000)

    return () => window.clearInterval(timer)
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

  return (
    <main className="page">
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
                <h1>Prashant Agrawal</h1>
                <div className="invite-card__ampersand">&</div>
                <h1>Bulbul Agrawal</h1>
                <div className="invite-card__meta">
                  <span className="invite-card__date">23 October 2026</span>
                  <p className="invite-card__time">Nagpur</p>
                </div>
              </div>
            </div>
          </div>
          <div className="reveal">
            <div className="invite-card__secondary">
              <img
                className="invite-card__secondary-image"
                src={thirdPanel}
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
                src={thirdPanel}
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
            <div className="invite-card__fourth">
              <img
                className="invite-card__fourth-image"
                src={thirdPanel}
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
