import react from 'react'
import FVIcon  from './FVIcon'

function AppHeader() {
  return (
    <div className="flex items-center gap-2 mb-4">
      <FVIcon />
      <span className="text-red-700 font-bold font-inter text-xl">Flujo de Viajes</span>
    </div>
  )
}

export default AppHeader;