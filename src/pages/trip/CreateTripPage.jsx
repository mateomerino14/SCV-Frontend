import {useNavigate} from 'react-router-dom';
import {ArrowLeft, Target, MapPin, LocateFixed} from 'lucide-react';
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import DynamicMenu from '../../layouts/menu/DynamicMenu';
import PageHeader from '../../components/ui/PageHeader';
import TripBudgetSummary from '../../features/trip/organisms/TripBudgetSummary';
import TripPolicies from '../../features/trip/molecules/TripPolicies';
import TripCreatedModal from '../../features/trip/organisms/TripCreatedModal';
import SessionExpiredModal from '../../features/user/organisms/SessionExpiredModal';
import InputField from '../../components/ui/InputField';
import useCreateTrip from '../../hooks/trip/useCreateTrip';
import useCurrentUser from '../../hooks/user/useCurrentUser';
import useMenu from '../../hooks/shared/useMenu';
import {COLORS} from '../../constants';
import {routes} from '../../constants/routes';

const styles = {
  page: "min-h-screen flex flex-col",
  content: "flex-1 px-5 py-6 max-w-8xl mx-auto w-full",
  backBtn: "flex items-center gap-1 cursor-pointer mb-4 w-fit",
  grid: "grid grid-cols-1 md:grid-cols-2 gap-8",
  formCard: "rounded-2xl p-6 flex flex-col gap-5 shadow-lg",
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
  errorMsg: "text-xs font-inter italic text-center mt-3",
  rightCol: "flex flex-col gap-4",
  policiesWrapper: "px-5 pb-6 max-w-8xl mx-auto w-full",
  internationalBadge: "text-xs font-inter p-3 rounded-xl flex items-start gap-2",
};

function CreateTripPage() {
  const navigate = useNavigate();
  const {user} = useCurrentUser();
  const {
    reason, origin, destination, startDate, endDate, type, setType, transport, setTransport,
    days, nationalDays, internationalDays, totalAmount, totalAmountUsd, dailyRate, dailyRateUsd,
    loading, error, fieldErrors, showConfirmation, setShowConfirmation, loadingLocation,
    handleReasonChange, handleOriginChange, handleDestinationChange, handleStartDateChange, handleEndDateChange,
    handleUseCurrentLocation, handleSaveDraft,
  } = useCreateTrip(user);
  const {menuOpen, openMenu, closeMenu, sessionExpired, handleSessionExpiredClose, user: menuUser} = useMenu();
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Registro de Viaje" onMenuClick={openMenu} profilePhoto={menuUser?.foto_perfil} />
      <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={menuUser} />
      <div className={styles.content}>
        <button className={styles.backBtn} onClick={() => navigate(routes.employeeDashboard)}>
          <ArrowLeft size={25} style={{color: COLORS.title}} />
        </button>
        <PageHeader title="Nuevo Viaje" subtitle="Completa los datos para planificar tu próximo viaje." />
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
                  {['Terrestre', 'Aéreo'].map((option) => (
                    <button key={option} className={styles.radioBtn} onClick={() => setTransport(option)}
                      style={{backgroundColor: transport === option ? COLORS.primary : COLORS.dataFields, borderColor: transport === option ? COLORS.primary : COLORS.fields, color: transport === option ? COLORS.background : COLORS.labels}}>
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {type === 'Internacional' && days > 0 && (
              <div className={styles.internationalBadge} style={{backgroundColor: COLORS.backgroundHeader}}>
                <span style={{color: COLORS.primary, fontSize: 17}}>ⓘ</span>
                <p className="text-xs font-inter mt-1" style={{color: COLORS.labels}}>
                  Día de salida y regreso en <strong>Bs</strong> ({nationalDays} día{nationalDays !== 1 ? 's' : ''}).
                  Días intermedios en <strong>USD</strong> ({internationalDays} día{internationalDays !== 1 ? 's' : ''}).
                </p>
              </div>
            )}
            {error && <p className={styles.errorMsg} style={{color: COLORS.secondary}}>{error}</p>}
            <button className={styles.confirmBtn} style={{backgroundColor: loading ? COLORS.fields : COLORS.secondary}} onClick={handleSaveDraft} disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Borrador'}
            </button>
          </div>
          <div className={styles.rightCol}>
            <TripBudgetSummary position={user?.Cargo?.nombre} dailyRate={dailyRate} dailyRateUsd={dailyRateUsd} totalAmount={totalAmount}
              totalAmountUsd={totalAmountUsd} nationalDays={nationalDays} internationalDays={internationalDays} type={type} transport={transport} />
          </div>
        </div>
      </div>
      <div className={styles.policiesWrapper}>
        <TripPolicies />
      </div>
      <TripCreatedModal isOpen={showConfirmation} onClose={() => {setShowConfirmation(false); navigate(routes.employeeDashboard);}} />
      <Footer />
    </div>
  );
}

export default CreateTripPage;