import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardEmpleadoPage from './pages/DashboardEmpleadoPage';
import CrearViajePage  from './pages/CrearViajePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard/empleado" element={<DashboardEmpleadoPage />} />
      <Route path='/dashboard/empleado/crear-viaje' element={<CrearViajePage/>}></Route>
    </Routes>
  )
}

export default App;