import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Button from '../components/ui/Button'
import { COLORS } from '../constants'

function NotFoundPage() {
  const navigate = useNavigate()
  const [ojos, setOjos] = useState({ x: 0, y: 0 })
  const [parpadeo, setParpadeo] = useState(false)
  const [flotando, setFlotando] = useState(false)

  useEffect(() => {
    const mover = (e) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      const dx = (e.clientX - cx) / cx
      const dy = (e.clientY - cy) / cy
      setOjos({ x: dx * 4, y: dy * 4 })
    }
    window.addEventListener('mousemove', mover)
    return () => window.removeEventListener('mousemove', mover)
  }, [])

  useEffect(() => {
    const intervalo = setInterval(() => {
      setParpadeo(true)
      setTimeout(() => setParpadeo(false), 150)
    }, 3000)
    return () => clearInterval(intervalo)
  }, [])

  useEffect(() => {
    const intervalo = setInterval(() => {
      setFlotando((prev) => !prev)
    }, 1500)
    return () => clearInterval(intervalo)
  }, [])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 overflow-hidden relative"
      style={{ backgroundColor: COLORS.background }}
    >
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '8%',
          width: 12,
          height: 12,
          borderRadius: '50%',
          backgroundColor: COLORS.primary,
          opacity: 0.3,
          animation: 'pulse 2s infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '20%',
          right: '12%',
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: COLORS.secondary,
          opacity: 0.25,
          animation: 'pulse 3s infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '25%',
          left: '15%',
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: COLORS.primary,
          opacity: 0.2,
          animation: 'pulse 2.5s infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '10%',
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: COLORS.secondary,
          opacity: 0.2,
          animation: 'pulse 2s infinite',
        }}
      />

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.5); opacity: 0.5; }
        }
        @keyframes flotar {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes girar {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes aparecer {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0px); }
        }
      `}</style>

      <div
        style={{
          animation: 'flotar 3s ease-in-out infinite',
          marginBottom: 32,
        }}
      >
        <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
          <circle cx="90" cy="100" r="60" fill={COLORS.primary} />
          <circle cx="90" cy="100" r="55" fill={COLORS.secondary} />

          <circle cx="90" cy="100" r="42" fill={COLORS.primary} opacity="0.15" />

          <ellipse cx="68" cy="95" rx="14" ry={parpadeo ? 1 : 14} fill="white" />
          <ellipse cx="112" cy="95" rx="14" ry={parpadeo ? 1 : 14} fill="white" />

          {!parpadeo && (
            <>
              <circle
                cx={68 + ojos.x}
                cy={95 + ojos.y}
                r="7"
                fill={COLORS.primary}
              />
              <circle
                cx={112 + ojos.x}
                cy={95 + ojos.y}
                r="7"
                fill={COLORS.primary}
              />
              <circle
                cx={70 + ojos.x}
                cy={93 + ojos.y}
                r="2.5"
                fill="white"
              />
              <circle
                cx={114 + ojos.x}
                cy={93 + ojos.y}
                r="2.5"
                fill="white"
              />
            </>
          )}

          <path
            d="M 74 115 Q 90 130 106 115"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />

          <ellipse cx="58" cy="110" rx="8" ry="5" fill="white" opacity="0.15" />
          <ellipse cx="122" cy="110" rx="8" ry="5" fill="white" opacity="0.15" />

          <rect x="72" y="42" width="16" height="24" rx="8" fill={COLORS.primary} />
          <rect x="92" y="38" width="16" height="28" rx="8" fill={COLORS.secondary} opacity="0.8" />

          <circle cx="80" cy="42" r="5" fill={COLORS.backgroundHeader} />
          <circle cx="100" cy="38" r="5" fill={COLORS.backgroundHeader} />
        </svg>
      </div>

      <div style={{ animation: 'aparecer 0.6s ease-out forwards', opacity: 0, animationDelay: '0.1s' }}>
        <h1
          className=" font-bold font-inter text-center mb-2"
          style={{ color: COLORS.primary, letterSpacing: '-4px' ,fontSize: '100px'}}
        >
          4
          <span style={{ color: COLORS.secondary }}>0</span>
          4
        </h1>
      </div>

      <div style={{ animation: 'aparecer 0.6s ease-out forwards', opacity: 0, animationDelay: '0.3s' }}>
        <p
          className="text-xl font-bold font-inter text-center mb-2"
          style={{ color: COLORS.text }}
        >
          ¡Página perdida!
        </p>
      </div>

      <div style={{ animation: 'aparecer 0.6s ease-out forwards', opacity: 0, animationDelay: '0.5s' }}>
        <p
          className="text-sm font-inter text-center mb-8 max-w-xs"
          style={{ color: COLORS.labels }}
        >
          Parece que este pequeño se perdió buscando la página. No te preocupes, podemos volver al inicio.
        </p>
      </div>

      <div style={{ animation: 'aparecer 0.6s ease-out forwards', opacity: 0, animationDelay: '0.7s' }}>
        <Button
          text="Volver al inicio"
          variant="primary"
          onClick={() => navigate(-1)}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 32,
          display: 'flex',
          gap: 8,
          animation: 'aparecer 0.6s ease-out forwards',
          opacity: 0,
          animationDelay: '0.9s',
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: i === 1 ? COLORS.secondary : COLORS.primary,
              opacity: i === 1 ? 1 : 0.4,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default NotFoundPage;