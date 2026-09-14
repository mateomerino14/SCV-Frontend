import {useState, useEffect} from 'react';
import {Routes, Route, Navigate, useLocation} from 'react-router-dom';
import {AnimatePresence, motion} from 'framer-motion';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import {getToken, setToken} from './services/shared/tokenStore';
import {COLORS} from './constants';

import LoginPage from './pages/user/LoginPage';
import SettingsPage from './pages/user/SettingsPage';
import ProfilePage from './pages/user/ProfilePage';
import DashboardAdminPage from './pages/admin/DashboardAdminPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import PositionManagementPage from './pages/admin/PositionManagementPage';
import EmployeeDashboardPage from './pages/trip/EmployeeDashboardPage';
import CreateTripPage from './pages/trip/CreateTripPage';
import EditTripPage from './pages/trip/EditTripPage';
import TripHistoryPage from './pages/trip/TripHistoryPage';
import TripDetailPage from './pages/trip/TripDetailPage';
import RegisterExpensePage from './pages/expense/RegisterExpensePage';
import UploadInvoicePage from './pages/expense/UploadInvoicePage';
import EditExpensePage from './pages/expense/EditExpensePage';
import EditInvoicePage from './pages/expense/EditInvoicePage';
import ExpenseDetailPage from './pages/expense/ExpenseDetailPage';
import SupervisorPendingTripsPage from './pages/approval/SupervisorPendingTripsPage';
import SupervisorTripHistoryPage from './pages/approval/SupervisorTripHistoryPage';
import SupervisorTripReviewDetailPage from './pages/approval/SupervisorTripReviewDetailPage';
import SupervisorPendingExpenseReviewsPage from './pages/approval/SupervisorPendingExpenseReviewsPage';
import SupervisorExpenseReviewHistoryPage from './pages/approval/SupervisorExpenseReviewHistoryPage';
import SupervisorExpenseReviewDetailPage from './pages/approval/SupervisorExpenseReviewDetailPage';
import ApproverPendingTripsPage from './pages/approval/ApproverPendingTripsPage';
import ApproverTripHistoryPage from './pages/approval/ApproverTripHistoryPage';
import ApproverReviewsPage from './pages/approval/ApproverReviewsPage';
import ApproverAlcoholReviewsPage from './pages/approval/ApproverAlcoholReviewsPage';
import ApproverAlcoholReviewDetailPage from './pages/approval/ApproverAlcoholReviewDetailPage';
import ApproverTripReviewDetailPage from './pages/approval/ApproverTripReviewDetailPage';
import ReviewerReviewsPage from './pages/approval/ReviewerReviewsPage';
import ReviewerReviewDetailPage from './pages/approval/ReviewerReviewDetailPage';
import DeadlineAuthorizationRequestsPage from './pages/approval/DeadlineAuthorizationRequestsPage';
import SubstitutionRequestsPage from './pages/approval/SubstitutionRequestsPage';
import TreasurerReviewsPage from './pages/approval/TreasurerReviewsPage';
import TreasurerReviewDetailPage from './pages/approval/TreasurerReviewDetailPage';
import NotFoundPage from './pages/NotFoundPage';

function getRoleFromToken() {
  const token = getToken();
  if (!token) {
    return null;
  }
  try {
    return jwtDecode(token)?.id_rol;
  }
  catch {
    return null;
  }
}

function ProtectedRoute({allowedRoles, children}) {
  const token = getToken();
  if (!token) {
    return <Navigate to="/" replace />;
  }
  const role = getRoleFromToken();
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

const pageVariants = {
  initial: {opacity: 0, y: 8},
  animate: {opacity: 1, y: 0},
  exit: {opacity: 0, y: -8},
};

function PageTransition({children}) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{duration: 0.22, ease: [0.22, 1, 0.36, 1]}}>
      {children}
    </motion.div>
  );
}

function App() {
  const location = useLocation();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const bootstrapSession = async () => {
      if (!getToken()) {
        try {
          const baseUrl = import.meta.env.VITE_API_URL;
          const response = await axios.post(`${baseUrl}/auth/refresh`, {}, {withCredentials: true});
          setToken(response.data.token);
        }
        catch {
          setToken(null);
        }
      }
      setAuthReady(true);
    };
    bootstrapSession();
  }, []);

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: COLORS.background}}>
        <div className="w-10 h-10 rounded-full border-4 animate-spin" style={{borderColor: COLORS.dataFields, borderTopColor: COLORS.primary}} />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/dashboard/empleado" element={<ProtectedRoute><PageTransition><EmployeeDashboardPage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/empleado/crear-viaje" element={<ProtectedRoute><PageTransition><CreateTripPage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/empleado/viaje/:id" element={<ProtectedRoute><PageTransition><TripDetailPage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/empleado/viaje/:id/editar" element={<ProtectedRoute><PageTransition><EditTripPage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/empleado/viaje/:id/registrar-gasto" element={<ProtectedRoute><PageTransition><RegisterExpensePage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/empleado/viaje/:id/subir-factura" element={<ProtectedRoute><PageTransition><UploadInvoicePage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/empleado/historial" element={<ProtectedRoute><PageTransition><TripHistoryPage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/empleado/perfil" element={<ProtectedRoute><PageTransition><ProfilePage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/empleado/configuracion" element={<ProtectedRoute><PageTransition><SettingsPage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/empleado/gasto/:id" element={<ProtectedRoute><PageTransition><ExpenseDetailPage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/empleado/gasto/:id/editar-gasto" element={<ProtectedRoute><PageTransition><EditExpensePage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/empleado/gasto/:id/editar-factura" element={<ProtectedRoute><PageTransition><EditInvoicePage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/administrador" element={<ProtectedRoute allowedRoles={[1]}><PageTransition><DashboardAdminPage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/administrador/usuarios" element={<ProtectedRoute allowedRoles={[1]}><PageTransition><UserManagementPage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/administrador/cargos" element={<ProtectedRoute allowedRoles={[1]}><PageTransition><PositionManagementPage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/administrador/perfil" element={<ProtectedRoute allowedRoles={[1]}><PageTransition><ProfilePage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/administrador/configuracion" element={<ProtectedRoute allowedRoles={[1]}><PageTransition><SettingsPage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/supervisor" element={<ProtectedRoute allowedRoles={[2]}><PageTransition><SupervisorPendingExpenseReviewsPage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/supervisor/historial" element={<ProtectedRoute allowedRoles={[2]}><PageTransition><SupervisorExpenseReviewHistoryPage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/supervisor/revision/:id" element={<ProtectedRoute allowedRoles={[2]}><PageTransition><SupervisorExpenseReviewDetailPage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/supervisor/gasto/:id" element={<ProtectedRoute allowedRoles={[2]}><PageTransition><ExpenseDetailPage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/supervisor/viajes-pendientes" element={<ProtectedRoute allowedRoles={[2]}><PageTransition><SupervisorPendingTripsPage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/supervisor/viajes-historial" element={<ProtectedRoute allowedRoles={[2]}><PageTransition><SupervisorTripHistoryPage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/supervisor/viaje-previo/:id" element={<ProtectedRoute allowedRoles={[2]}><PageTransition><SupervisorTripReviewDetailPage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/supervisor/perfil" element={<ProtectedRoute allowedRoles={[2]}><PageTransition><ProfilePage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/supervisor/configuracion" element={<ProtectedRoute allowedRoles={[2]}><PageTransition><SettingsPage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/aprobador/revisiones" element={<ProtectedRoute allowedRoles={[5]}><PageTransition><ApproverReviewsPage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/aprobador/revision-alcohol" element={<ProtectedRoute allowedRoles={[5]}><PageTransition><ApproverAlcoholReviewsPage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/aprobador/revision-alcohol/:id" element={<ProtectedRoute allowedRoles={[5]}><PageTransition><ApproverAlcoholReviewDetailPage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/aprobador/gasto/:id" element={<ProtectedRoute allowedRoles={[5]}><PageTransition><ExpenseDetailPage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/aprobador/viajes-pendientes" element={<ProtectedRoute allowedRoles={[5]}><PageTransition><ApproverPendingTripsPage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/aprobador/viajes-historial" element={<ProtectedRoute allowedRoles={[5]}><PageTransition><ApproverTripHistoryPage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/aprobador/viaje-previo/:id" element={<ProtectedRoute allowedRoles={[5]}><PageTransition><ApproverTripReviewDetailPage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/aprobador/perfil" element={<ProtectedRoute allowedRoles={[5]}><PageTransition><ProfilePage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/aprobador/configuracion" element={<ProtectedRoute allowedRoles={[5]}><PageTransition><SettingsPage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/revisor" element={<ProtectedRoute allowedRoles={[4]}><PageTransition><ReviewerReviewsPage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/revisor/revision/:id" element={<ProtectedRoute allowedRoles={[4]}><PageTransition><ReviewerReviewDetailPage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/revisor/gasto/:id" element={<ProtectedRoute allowedRoles={[4]}><PageTransition><ExpenseDetailPage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/revisor/solicitudes-plazo" element={<ProtectedRoute allowedRoles={[4]}><PageTransition><DeadlineAuthorizationRequestsPage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/revisor/reemplazos" element={<ProtectedRoute allowedRoles={[4]}><PageTransition><SubstitutionRequestsPage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/revisor/perfil" element={<ProtectedRoute allowedRoles={[4]}><PageTransition><ProfilePage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/revisor/configuracion" element={<ProtectedRoute allowedRoles={[4]}><PageTransition><SettingsPage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/tesorero/revisiones" element={<ProtectedRoute><PageTransition><TreasurerReviewsPage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/tesorero/viaje/:id" element={<ProtectedRoute><PageTransition><TreasurerReviewDetailPage /></PageTransition></ProtectedRoute>} />
        <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;