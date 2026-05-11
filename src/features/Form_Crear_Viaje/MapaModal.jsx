import { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import Button from '../../components/ui/Button'
import { COLORS } from '../../constants'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const styles = {
  overlay: "fixed inset-0 flex items-center justify-center z-50",
  container: "rounded-2xl overflow-hidden w-[90%] max-w-lg shadow-2xl",
  addressBar: "px-4 py-3 text-center font-inter text-sm font-bold uppercase",
  mapWrapper: "w-full h-64",
  buttons: "flex flex-col gap-3 p-4",
}

function LocationPicker({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng)
    }
  })
  return null
}

function MapaModal({ isOpen, onClose, onConfirm }) {
  const [position, setPosition] = useState(null)
  const [address, setAddress] = useState('Selecciona una ubicación en el mapa')

  const handleSelect = async (latlng) => {
    setPosition(latlng)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`
      )
      const data = await res.json()
      setAddress(data.display_name || `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`)
    } catch {
      setAddress(`${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`)
    }
  }

  const handleConfirm = () => {
    if (!position) return
    onConfirm(address)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className={styles.overlay}
      style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
    >
      <div className={styles.container} style={{ backgroundColor: COLORS.background }}>
        <div
          className={styles.addressBar}
          style={{ color: COLORS.text, borderBottom: `1px solid ${COLORS.dataFields}` }}
        >
          {address}
        </div>

        <div className={styles.mapWrapper}>
          <MapContainer
            center={[-16.5, -68.15]}
            zoom={13}
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationPicker onSelect={handleSelect} />
            {position && <Marker position={position} />}
          </MapContainer>
        </div>

        <div className={styles.buttons}>
          <Button text="Confirmar" variant="primary" onClick={handleConfirm} />
          <Button text="Cancelar" variant="secondary" onClick={onClose} />
        </div>
      </div>
    </div>
  )
}

export default MapaModal