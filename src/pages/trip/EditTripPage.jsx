import {useNavigate, useParams, useLocation} from 'react-router-dom';
import {ArrowLeft, Target, MapPin, LocateFixed} from 'lucide-react';
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import DynamicMenu from '../../layouts/menu/DynamicMenu';
import PageHeader from '../../components/ui/PageHeader';
import TripBudgetSummary from '../../features/trip/organisms/TripBudgetSummary';
import SessionExpiredModal from '../../features/user/organisms/SessionExpiredModal';
import SkeletonCard from '../../components/ui/SkeletonCard';
import InputField from '../../components/ui/InputField';
import useEditTrip from '../../hooks/trip/useEditTrip';
import useCurrentUser from '../../hooks/user/useCurrentUser';
import useMenu from '../../hooks/shared/useMenu';
import {COLORS} from '../../constants';
import {routes} from '../../constants/routes';

const styles = {
  page: "min-h-screen flex flex-col",
  content: "flex-1 px-5 py-6 max-w-8xl mx-auto w-full",
  backBtn: "flex items-center gap-1 cursor-pointer mb-4 w-fit",
  grid: "grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch",
  formCard: "rounded-2xl p-6 flex flex-col gap-5 shadow-lg h-full",
  badgeWrapper: "flex items-center gap-3 mb-2 w-fit p-3 rounded-lg",
  badgeIcon: "rounded-full p-2",
  badgeInfo: "flex flex-col",
  badgeLabel: "text-xs font-inter uppercase opacity-70 font-semibold",
  badgePosition: "text-sm font-bold font-inter",
  input: "bg-transparent w-full outline-none font-inter text-sm",
  dateRow: "grid grid-cols-1 md:grid-cols-2 gap-3",
  radioRow: "flex flex-col gap-4",
  radioGroup: "flex flex-col gap-2",
  radioLabel: "text-xs font-bold font-inter uppercase mb-1",
  radioBtns: "flex gap-2 flex-wrap",
  radioBtn: "flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer font-inter text-sm font-bold transition-colors",
  confirmBtn: "w-full py-3 rounded-xl font-bold font-nunito text-white text-base cursor-pointer transition-colors mt-3",
  cancelBtn: "w-full py-3 rounded-xl font-bold font-nunito text-base cursor-pointer mt-2 border",
  errorMsg: "text-xs font-inter italic text-center mt-3",
  rightCol: "flex flex-col gap-4 h-full",
};

function EditTripPage() {
  const {id} = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const originRoute = location.state?.from || routes.employeeDashboard;
  const {user} = useCurrentUser();
  const {menuOpen, openMenu, closeMenu, sessionExpired, handleSessionExpiredClose, user: menuUser} = useMenu();
  const {
    reason, origin, destination, startDate, endDate, type, setType, transport, setTransport,
    vehiclePlate, handleVehiclePlateChange,
    days, nationalDays, internationalDays, totalAmount, totalAmountUsd, dailyRate, dailyRateUsd, originalStatus,
    loading, loadingData, error, fieldErrors, loadingLocation,
    handleReasonChange, handleOriginChange, handleDestinationChange, handleStartDateChange, handleEndDateChange,
    handleUseCurrentLocation, handleSave,
  } = useEditTrip(id, user);
  const today = new Date().toISOString().split('T')[0];
  const isDraft = originalStatus === 'BORRADOR';

  if (loadingData) {
    return (
      <div className={styles.page} style={{backgroundColor: COLORS.background}}>
        <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
        <Navbar text="Editar Viaje" onMenuClick={openMenu} profilePhoto={menuUser?.foto_perfil} />
        <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={menuUser} />
        <div className={styles.content}><SkeletonCard lines={6} /></div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Editar Viaje" onMenuClick={openMenu} profilePhoto={menuUser?.foto_perfil} />
      <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={menuUser} />
      <div className={styles.content}>
        <button className={styles.backBtn} onClick={() => navigate(originRoute)}>
          <ArrowLeft size={25} style={{color: COLORS.title}} />
        </button>
        <PageHeader
          title={isDraft ? 'Editar Borrador' : 'Editar Viaje Rechazado'}
          subtitle={isDraft ? 'Completa los datos pendientes para enviar tu viaje a revisión.' : 'Corrige los datos observados y vuelve a enviarlo a revisión.'}
        />
        <div className={styles.badgeWrapper} style={{backgroundColor: COLORS.backgroundHeader}}>
          <div className={styles.badgeIcon} style={{backgroundColor: COLORS.primary}}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L12 7H18L13 11L15 16L10 13L5 16L7 11L2 7H8L10 2Z" fill="white" />
            </svg>
          </div>
          <div className={styles.badgeInfo}>
            <span className={styles.badgeLabel} style={{color: COLORS.labels}}>Cargo</span>
            <span className={styles.badgePosition} style={{color: COLORS.primary}}>{user?.Cargo?.nombre?.toUpperCase() || '—'}</span>
          </div>
        </div>
        <div className={styles.grid}>
          <div className={styles.formCard} style={{backgroundColor: COLORS.background}}>
            <InputField label="Motivo" icon={<Target size={16} style={{color: COLORS.primary}} />} error={fieldErrors.reason}>
              <input type="text" placeholder="Inspección técnica y de producción..." maxLength={100} className={styles.input} style={{color: COLORS.text}}
                value={reason} onChange={(event) => handleReasonChange(event.target.value)} />
            </InputField>
            <InputField label="Origen" error={fieldErrors.origin}
              icon={
                <button type="button" onClick={handleUseCurrentLocation} disabled={loadingLocation} title="Usar mi ubicación actual">
                  <LocateFixed size={16} style={{color: loadingLocation ? COLORS.labels : COLORS.primary, cursor: loadingLocation ? 'default' : 'pointer'}} />
                </button>
              }>
              <input type="text" placeholder={loadingLocation ? 'Obteniendo ubicación...' : 'Ciudad de origen...'} maxLength={200}
                className={styles.input} style={{color: COLORS.text}} value={origin} onChange={(event) => handleOriginChange(event.target.value)} />
            </InputField>
            <InputField label="Destino" icon={<MapPin size={16} style={{color: COLORS.primary}} />} error={fieldErrors.destination}>
              <input type="text" placeholder="¿A dónde se dirige?" maxLength={200} className={styles.input} style={{color: COLORS.text}}
                value={destination} onChange={(event) => handleDestinationChange(event.target.value)} />
            </InputField>
            <div className={styles.dateRow}>
              <InputField label="Fecha Inicio" error={fieldErrors.startDate}>
                <input type="date" min={today} className={styles.input} style={{color: COLORS.text}} value={startDate} onChange={(event) => handleStartDateChange(event.target.value)} />
              </InputField>
              <InputField label="Fecha Fin" error={fieldErrors.endDate}>
                <input type="date" min={today} className={styles.input} style={{color: COLORS.text}} value={endDate} onChange={(event) => handleEndDateChange(event.target.value)} />
              </InputField>
            </div>
            <div className={styles.radioRow}>
              <div className={styles.radioGroup}>
                <p className={styles.radioLabel} style={{color: COLORS.labels}}>Tipo de Viaje</p>
                <div className={styles.radioBtns}>
                  {['Nacional', 'Internacional'].map((option) => (
                    <button key={option} className={styles.radioBtn} onClick={() => setType(option)}
                      style={{backgroundColor: type === option ? COLORS.primary : COLORS.dataFields, borderColor: type === option ? COLORS.primary : COLORS.fields, color: type === option ? COLORS.background : COLORS.labels}}>
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.radioGroup}>
                <p className={styles.radioLabel} style={{color: COLORS.labels}}>Medio de Transporte</p>
                <div className={styles.radioBtns}>
                  {['Terrestre', 'Aéreo', 'Vehículo de Empresa'].map((option) => (
                    <button key={option} className={styles.radioBtn} onClick={() => setTransport(option)}
                      style={{backgroundColor: transport === option ? COLORS.primary : COLORS.dataFields, borderColor: transport === option ? COLORS.primary : COLORS.fields, color: transport === option ? COLORS.background : COLORS.labels}}>
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {transport === 'Vehículo de Empresa' && (
              <InputField label="Placa del Vehículo" error={fieldErrors.vehiclePlate}>
                <input type="text" placeholder="Ej: 1234-ABC" maxLength={20} className={styles.input} style={{color: COLORS.text}}
                  value={vehiclePlate} onChange={(event) => handleVehiclePlateChange(event.target.value)} />
              </InputField>
            )}
            {error && <p className={styles.errorMsg} style={{color: COLORS.secondary}}>{error}</p>}
            <div style={{marginTop: 'auto'}}>
              <button className={styles.confirmBtn} style={{backgroundColor: loading ? COLORS.fields : COLORS.secondary}}
                onClick={() => handleSave(() => navigate(originRoute))} disabled={loading}>
                {loading ? 'Guardando...' : (isDraft ? 'Guardar Cambios' : 'Guardar y Reenviar a Revisión')}
              </button>
              <button className={styles.cancelBtn} style={{borderColor: COLORS.primary, color: COLORS.primary}} onClick={() => navigate(originRoute)}>
                Cancelar
              </button>
            </div>
          </div>
          <div className={styles.rightCol}>
            <TripBudgetSummary position={user?.Cargo?.nombre} dailyRate={dailyRate} dailyRateUsd={dailyRateUsd} totalAmount={totalAmount}
              totalAmountUsd={totalAmountUsd} nationalDays={nationalDays} internationalDays={internationalDays} type={type} transport={transport} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default EditTripPage;