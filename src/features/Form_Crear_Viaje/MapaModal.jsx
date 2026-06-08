import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import Button from '../../components/ui/Button'
import { COLORS } from '../../constants'
import { Navigation, Search, X } from 'lucide-react'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const styles = {
  overlay: "fixed inset-0 flex items-center justify-center z-[9999] px-4",
  container: "rounded-2xl overflow-hidden w-full max-w-xs sm:max-w-md md:max-w-xl lg:max-w-3xl shadow-2xl flex flex-col",
  header: "px-4 py-3 flex flex-col gap-2",
  searchWrapper: "flex items-center gap-2 border rounded-xl px-3 py-2",
  searchInput: "flex-1 text-sm font-inter outline-none bg-transparent",
  sugerenciasWrapper: "rounded-xl border shadow-lg overflow-hidden max-h-40 overflow-y-auto",
  sugerenciaItem: "px-3 py-2.5 text-sm font-inter cursor-pointer border-b",
  addressBar: "px-3 py-2 text-xs font-inter text-center",
  mapWrapper: "w-full h-56 sm:h-64 md:h-80 lg:h-96",
  buttons: "flex gap-3 p-4 justify-center",
  ubicacionBtn: "flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold font-nunito text-sm cursor-pointer border transition-colors",
}

function LocationPicker({ onSelect }) {
  useMapEvents({
    click(e) { onSelect(e.latlng) }
  })
  return null
}

function MoverMapa({ position }) {
  const map = useMap()
  useEffect(() => {
    if (position) map.flyTo(position, 15, { duration: 1 })
  }, [position])
  return null
}

function MapaModal({ isOpen, onClose, onConfirm }) {
  const [position, setPosition] = useState(null)
  const [address, setAddress] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [sugerencias, setSugerencias] = useState([])
  const [loadingUbicacion, setLoadingUbicacion] = useState(false)
  const debounceRef = useRef(null)

  const obtenerDireccion = async (latlng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json&accept-language=es`,
        { headers: { 'User-Agent': 'SCV-App/1.0' } }
      )
      const data = await res.json()
      const partes = data.display_name?.split(',').slice(0, 4).map((i) => i.trim()).join(', ')
      return partes || `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`
    } catch {
      return `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`
    }
  }

  const handleSelect = async (latlng) => {
    setPosition(latlng)
    const dir = await obtenerDireccion(latlng)
    setAddress(dir)
    setBusqueda(dir)
    setSugerencias([])
  }

  const handleBusquedaChange = (valor) => {
    setBusqueda(valor)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (valor.trim().length < 3) { setSugerencias([]); return }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(valor)}&format=json&limit=5&accept-language=es&countrycodes=bo`,
          { headers: { 'User-Agent': 'SCV-App/1.0' } }
        )
        const data = await res.json()
        setSugerencias(data)
      } catch {
        setSugerencias([])
      }
    }, 500)
  }

  const handleSeleccionarSugerencia = async (sugerencia) => {
    const latlng = { lat: parseFloat(sugerencia.lat), lng: parseFloat(sugerencia.lon) }
    setPosition(latlng)
    const partes = sugerencia.display_name.split(',').slice(0, 4).map((i) => i.trim()).join(', ')
    setAddress(partes)
    setBusqueda(partes)
    setSugerencias([])
  }

  const handleUbicacionActual = () => {
    if (!navigator.geolocation) return
    setLoadingUbicacion(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const latlng = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setPosition(latlng)
        const dir = await obtenerDireccion(latlng)
        setAddress(dir)
        setBusqueda(dir)
        setSugerencias([])
        setLoadingUbicacion(false)
      },
      () => setLoadingUbicacion(false),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handleConfirm = () => {
    if (!position || !address) return
    onConfirm(address)
    onClose()
  }

  const handleClose = () => {
    setPosition(null)
    setAddress('')
    setBusqueda('')
    setSugerencias([])
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className={styles.overlay}
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
    >
      <div className={styles.container} style={{ backgroundColor: COLORS.background }}>

        <div className={styles.header} style={{ borderBottom: `1px solid ${COLORS.dataFields}` }}>
          <div
            className={styles.searchWrapper}
            style={{ borderColor: COLORS.dataFields, backgroundColor: COLORS.background }}
          >
            <Search size={16} style={{ color: COLORS.labels }} />
            <input
              className={styles.searchInput}
              style={{ color: COLORS.text }}
              placeholder="Buscar dirección..."
              value={busqueda}
              onChange={(e) => handleBusquedaChange(e.target.value)}
            />
            {busqueda && (
              <X
                size={16}
                style={{ color: COLORS.labels, cursor: 'pointer' }}
                onClick={() => { setBusqueda(''); setSugerencias([]) }}
              />
            )}
          </div>

          {sugerencias.length > 0 && (
            <div
              className={styles.sugerenciasWrapper}
              style={{ borderColor: COLORS.dataFields, backgroundColor: COLORS.background }}
            >
              {sugerencias.map((s, i) => (
                <div
                  key={i}
                  className={styles.sugerenciaItem}
                  style={{ borderColor: COLORS.dataFields, color: COLORS.text }}
                  onClick={() => handleSeleccionarSugerencia(s)}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.backgroundHeader}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {s.display_name.split(',').slice(0, 3).join(', ')}
                </div>
              ))}
            </div>
          )}

          <button
            className={styles.ubicacionBtn}
            style={{ borderColor: COLORS.primary, color: COLORS.primary, backgroundColor: 'transparent' }}
            onClick={handleUbicacionActual}
            disabled={loadingUbicacion}
          >
            <Navigation size={14} />
            {loadingUbicacion ? 'Obteniendo ubicación...' : 'Usar mi ubicación actual'}
          </button>

          {address && (
            <p className={styles.addressBar} style={{ color: COLORS.labels }}>
              📍 {address}
            </p>
          )}
        </div>

        <div className={styles.mapWrapper}>
          <MapContainer
            center={[-16.5, -68.15]}
            zoom={13}
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            />
            <LocationPicker onSelect={handleSelect} />
            {position && <Marker position={position} />}
            {position && <MoverMapa position={position} />}
          </MapContainer>
        </div>

        <div className={styles.buttons}>
          <Button text="Confirmar" variant="primary" onClick={handleConfirm} disabled={!position} />
          <Button text="Cancelar" variant="secondary" onClick={handleClose} />
        </div>
      </div>
    </div>
  )
}

export default MapaModal;