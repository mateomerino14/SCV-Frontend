import { Routes, Route, Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import LoginPage from './pages/LoginPage'
import DashboardEmpleadoPage from './pages/DashboardEmpleadoPage'
import CrearViajePage from './pages/CrearViajePage'
import DetalleViajePage from './pages/DetalleViajePage'
import SubirFacturaPage from './pages/SubirFacturaPage'
import RegistrarGastoPage from './pages/RegistrarGastoPage'
import DetalleGastoPage from './pages/DetalleGastoPage'
import EditarFacturaPage from './pages/EditarFacturaPage'
import EditarGastoPage from './pages/EditarGastoPage'
import HistorialViajesPage from './pages/HistorialViajesPage'
import ConfiguracionPage from './pages/ConfiguracionPage'
import PerfilPage from './pages/PerfilPage'
import DashboardAdminPage from './pages/DashboardAdminPage'
import GestionUsuariosPage from './pages/GestionUsuariosPage'
import GestionCargosPage from './pages/GestionCargosPage'
import NotFoundPage from './pages/NotFoundPage'
import RevisionesPendientesPage from './pages/RevisionesPendientesPage'
import HistorialRevisionesPage from './pages/HistorialRevisionesPage'
import DetalleRevisionPage from './pages/DetalleRevisionPage'
import RevisionRevisorPage from './pages/RevisionRevisorPage'
import HistorialRevisorPage from './pages/HistorialRevisorPage'
import DetalleRevisorPage from './pages/DetalleRevisorPage'

function RutaProtegida({ children, rolesPermitidos }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/" replace />
  try {
    const decoded = jwtDecode(token)
    if (rolesPermitidos && !rolesPermitidos.includes(decoded.id_rol)) {
      return <Navigate to="/" replace />
    }
    return children
  } catch {
    return children
  }
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard/empleado" element={<RutaProtegida><DashboardEmpleadoPage /></RutaProtegida>} />
      <Route path="/dashboard/empleado/crear-viaje" element={<RutaProtegida><CrearViajePage /></RutaProtegida>} />
      <Route path="/dashboard/empleado/viaje/:id" element={<RutaProtegida><DetalleViajePage /></RutaProtegida>} />
      <Route path="/dashboard/empleado/viaje/:id/subir-factura" element={<RutaProtegida><SubirFacturaPage /></RutaProtegida>} />
      <Route path="/dashboard/empleado/viaje/:id/registrar-gasto" element={<RutaProtegida><RegistrarGastoPage /></RutaProtegida>} />
      <Route path="/dashboard/empleado/gasto/:id" element={<RutaProtegida><DetalleGastoPage /></RutaProtegida>} />
      <Route path="/dashboard/empleado/gasto/:id/editar-factura" element={<RutaProtegida><EditarFacturaPage /></RutaProtegida>} />
      <Route path="/dashboard/empleado/gasto/:id/editar-gasto" element={<RutaProtegida><EditarGastoPage /></RutaProtegida>} />
      <Route path="/dashboard/empleado/historial" element={<RutaProtegida><HistorialViajesPage /></RutaProtegida>} />
      <Route path="/dashboard/empleado/configuracion" element={<RutaProtegida><ConfiguracionPage /></RutaProtegida>} />
      <Route path="/dashboard/empleado/perfil" element={<RutaProtegida><PerfilPage /></RutaProtegida>} />
      <Route path="/dashboard/supervisor" element={<RutaProtegida><RevisionesPendientesPage /></RutaProtegida>} />
      <Route path="/dashboard/supervisor/historial" element={<RutaProtegida><HistorialRevisionesPage /></RutaProtegida>} />
      <Route path="/dashboard/supervisor/revision/:id" element={<RutaProtegida><DetalleRevisionPage /></RutaProtegida>} />
      <Route path="/dashboard/supervisor/perfil" element={<RutaProtegida><PerfilPage /></RutaProtegida>} />
      <Route path="/dashboard/supervisor/configuracion" element={<RutaProtegida><ConfiguracionPage /></RutaProtegida>} />
      <Route path="/dashboard/supervisor/gasto/:id" element={<RutaProtegida><DetalleGastoPage /></RutaProtegida>} />
      <Route path="/dashboard/administrador" element={<RutaProtegida rolesPermitidos={[1]}><DashboardAdminPage /></RutaProtegida>} />
      <Route path="/dashboard/administrador/usuarios" element={<RutaProtegida rolesPermitidos={[1]}><GestionUsuariosPage /></RutaProtegida>} />
      <Route path="/dashboard/administrador/cargos" element={<RutaProtegida rolesPermitidos={[1]}><GestionCargosPage /></RutaProtegida>} />
      <Route path="/dashboard/administrador/perfil" element={<RutaProtegida rolesPermitidos={[1]}><PerfilPage /></RutaProtegida>}/>
      <Route path="/dashboard/administrador/configuracion" element={<RutaProtegida rolesPermitidos={[1]}><ConfiguracionPage /></RutaProtegida>} />
      <Route path="/dashboard/revisor" element={<RutaProtegida rolesPermitidos={[4]}><RevisionRevisorPage /></RutaProtegida>} />
      <Route path="/dashboard/revisor/historial" element={<RutaProtegida rolesPermitidos={[4]}><HistorialRevisorPage /></RutaProtegida>} />
      <Route path="/dashboard/revisor/revision/:id" element={<RutaProtegida rolesPermitidos={[4]}><DetalleRevisorPage /></RutaProtegida>} />
      <Route path="/dashboard/revisor/historial/:id" element={<RutaProtegida rolesPermitidos={[4]}><DetalleRevisorPage /></RutaProtegida>} />
      <Route path="/dashboard/revisor/perfil" element={<RutaProtegida rolesPermitidos={[4]}><PerfilPage /></RutaProtegida>} />
      <Route path="/dashboard/revisor/configuracion" element={<RutaProtegida rolesPermitidos={[4]}><ConfiguracionPage /></RutaProtegida>} />
      <Route path="/dashboard/revisor/gasto/:id" element={<RutaProtegida rolesPermitidos={[4]}><DetalleGastoPage /></RutaProtegida>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App;