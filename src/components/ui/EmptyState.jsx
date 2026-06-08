import { COLORS } from '../../constants'

function EmptyState({ titulo, subtitulo, icono }) {
  return (
    <div
      className="rounded-2xl p-8 flex flex-col items-center gap-3 text-center mt-2"
      style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.title})` }}
    >
      <div
        className="rounded-full p-4 flex items-center justify-center"
        style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
      >
        {icono}
      </div>
      <p className="font-inter font-bold text-base text-white">{titulo}</p>
      <p className="font-inter text-xs text-white opacity-70">{subtitulo}</p>
    </div>
  )
}

export default EmptyState;