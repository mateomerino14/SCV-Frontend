import { useState, useEffect } from 'react'
import { getMiCargo } from '../services/usuarioService'

const CARGO_TESORERO = 'asistente de caja y tesorería'

const normalizar = (str) =>
  (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()

function useEsTesorero() {
  const [esTesorero, setEsTesorero] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const verificar = async () => {
      const data = await getMiCargo()
      if (!data.error && data.cargo) {
        setEsTesorero(normalizar(data.cargo) === normalizar(CARGO_TESORERO))
      }
      setCargando(false)
    }
    verificar()
  }, [])

  return { esTesorero, cargando }
}

export default useEsTesorero;