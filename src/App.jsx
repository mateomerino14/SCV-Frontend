import {useState, useEffect, lazy, Suspense} from 'react';
import {Routes, Route, Navigate, useLocation} from 'react-router-dom';
import {AnimatePresence, motion} from 'framer-motion';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import {getToken, setToken} from './services/shared/tokenStore';
import {COLORS} from './constants';

import LoginPage from './pages/user/LoginPage';

const SettingsPage = lazy(() => import('./pages/user/SettingsPage'));
const ProfilePage = lazy(() => import('./pages/user/ProfilePage'));
const DashboardAdminPage = lazy(() => import('./pages/admin/DashboardAdminPage'));
const UserManagementPage = lazy(() => import('./pages/admin/UserManagementPage'));
const PositionManagementPage = lazy(() => import('./pages/admin/PositionManagementPage'));
const SectionManagementPage = lazy(() => import('./pages/admin/SectionManagementPage'));
const AuditLogPage = lazy(() => import('./pages/admin/AuditLogPage'));
const EmployeeDashboardPage = lazy(() => import('./pages/trip/EmployeeDashboardPage'));
const CreateTripPage = lazy(() => import('./pages/trip/CreateTripPage'));
const EditTripPage = lazy(() => import('./pages/trip/EditTripPage'));
const TripHistoryPage = lazy(() => import('./pages/trip/TripHistoryPage'));
const TripDetailPage = lazy(() => import('./pages/trip/TripDetailPage'));
const RegisterExpensePage = lazy(() => import('./pages/expense/RegisterExpensePage'));
const UploadInvoicePage = lazy(() => import('./pages/expense/UploadInvoicePage'));
const EditExpensePage = lazy(() => import('./pages/expense/EditExpensePage'));
const EditInvoicePage = lazy(() => import('./pages/expense/EditInvoicePage'));
const ExpenseDetailPage = lazy(() => import('./pages/expense/ExpenseDetailPage'));
const SupervisorPendingTripsPage = lazy(() => import('./pages/approval/SupervisorPendingTripsPage'));
const SupervisorTripHistoryPage = lazy(() => import('./pages/approval/SupervisorTripHistoryPage'));
const SupervisorTripReviewDetailPage = lazy(() => import('./pages/approval/SupervisorTripReviewDetailPage'));
const SupervisorPendingExpenseReviewsPage = lazy(() => import('./pages/approval/SupervisorPendingExpenseReviewsPage'));
const SupervisorExpenseReviewHistoryPage = lazy(() => import('./pages/approval/SupervisorExpenseReviewHistoryPage'));
const SupervisorExpenseReviewDetailPage = lazy(() => import('./pages/approval/SupervisorExpenseReviewDetailPage'));
const ApproverPendingTripsPage = lazy(() => import('./pages/approval/ApproverPendingTripsPage'));
const ApproverTripHistoryPage = lazy(() => import('./pages/approval/ApproverTripHistoryPage'));
const ApproverReviewsPage = lazy(() => import('./pages/approval/ApproverReviewsPage'));
const ApproverAlcoholReviewsPage = lazy(() => import('./pages/approval/ApproverAlcoholReviewsPage'));
const ApproverAlcoholReviewDetailPage = lazy(() => import('./pages/approval/ApproverAlcoholReviewDetailPage'));
const ApproverTripReviewDetailPage = lazy(() => import('./pages/approval/ApproverTripReviewDetailPage'));
const ReviewerReviewsPage = lazy(() => import('./pages/approval/ReviewerReviewsPage'));
const ReviewerReviewDetailPage = lazy(() => import('./pages/approval/ReviewerReviewDetailPage'));
const DeadlineAuthorizationRequestsPage = lazy(() => import('./pages/approval/DeadlineAuthorizationRequestsPage'));
const SubstitutionRequestsPage = lazy(() => import('./pages/approval/SubstitutionRequestsPage'));
const TreasurerReviewsPage = lazy(() => import('./pages/approval/TreasurerReviewsPage'));
const TreasurerReviewDetailPage = lazy(() => import('./pages/approval/TreasurerReviewDetailPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

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

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: COLORS.background}}>
      <div className="w-10 h-10 rounded-full border-4 animate-spin" style={{borderColor: COLORS.dataFields, borderTopColor: COLORS.primary}} />
    </div>
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
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
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
        <Route path="/dashboard/administrador/secciones" element={<ProtectedRoute allowedRoles={[1]}><PageTransition><SectionManagementPage /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/administrador/historial-accesos" element={<ProtectedRoute allowedRoles={[1]}><PageTransition><AuditLogPage /></PageTransition></ProtectedRoute>} />
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
    </Suspense>
  );
}

export default App;