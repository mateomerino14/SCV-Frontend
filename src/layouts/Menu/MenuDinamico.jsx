import { jwtDecode } from 'jwt-decode'
import MenuEmpleado from './Menu_Empleado'
import MenuSupervisor from './Menu_Supervisor'
import MenuAdministrador from './Menu_Administrador'
import MenuRevisor from './Menu_Revisor'
import MenuAprobador from './Menu_Aprobador'

function MenuDinamico({ isOpen, onClose, usuario }) {
  const token = localStorage.getItem('token')
  let rol = null
  try {
    rol = jwtDecode(token)?.id_rol
  } catch {}

  if (rol === 1) return <MenuAdministrador isOpen={isOpen} onClose={onClose} usuario={usuario} />
  if (rol === 2) return <MenuSupervisor isOpen={isOpen} onClose={onClose} usuario={usuario} />
  if (rol === 4) return <MenuRevisor isOpen={isOpen} onClose={onClose} usuario={usuario} />
  if (rol === 5) return <MenuAprobador isOpen={isOpen} onClose={onClose} usuario={usuario} />
  return <MenuEmpleado isOpen={isOpen} onClose={onClose} usuario={usuario} />
}

export default MenuDinamico;