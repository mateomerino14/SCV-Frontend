import {useNavigate} from 'react-router-dom';
import {ArrowLeft, Target, MapPin, Navigation} from 'lucide-react';
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
import {maxTripReasonLength} from '../../constants/tripLimits';
import AutoResizeTextarea from '../../components/ui/AutoResizeTextarea';
import DatePickerInput from '../../components/ui/DatePickerInput';

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
    reason, origin, destination, startDate, endDate, type, handleTypeChange, transport, setTransport,
    vehiclePlate, handleVehiclePlateChange,
    days, nationalDays, internationalDays, totalAmount, totalAmountUsd, dailyRate, dailyRateUsd,
    loading, error, fieldErrors, showConfirmation, setShowConfirmation,
    handleReasonChange, handleOriginChange, handleDestinationChange, handleStartDateChange, handleEndDateChange,
    handleSaveDraft,
  } = useCreateTrip(user);
  const {menuOpen, openMenu, closeMenu, sessionExpired, handleSessionExpiredClose, user: menuUser} = useMenu();
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Nuevo Viaje" onMenuClick={openMenu} profilePhoto={menuUser?.foto_perfil} />
      <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={menuUser} />
      <div className={styles.content}>
        <button className={styles.backBtn} onClick={() => navigate(routes.employeeDashboard)}>
          <ArrowLeft size={25} style={{color: COLORS.title}} />
        </button>
        <PageHeader title="Nuevo Viaje" subtitle="Completa los datos del viaje; el presupuesto se calcula según tu cargo y la cantidad de días." />
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
            <div>
              <InputField label="Motivo" required alignTop icon={<Target size={16} style={{color: COLORS.primary}} />} error={fieldErrors.reason}>
                <AutoResizeTextarea placeholder="Inspección técnica y de producción..." maxLength={maxTripReasonLength} style={{color: COLORS.text}}
                  value={reason} onChange={(event) => handleReasonChange(event.target.value)} />
              </InputField>
              <p className="text-[11px] font-inter text-right mt-1" style={{color: COLORS.labels}}>{reason.length}/{maxTripReasonLength}</p>
            </div>
            <InputField label="Origen" required icon={<Navigation size={16} style={{color: COLORS.primary}} />} error={fieldErrors.origin}>
              <input type="text" placeholder="Ciudad de origen..." maxLength={200}
                className={styles.input} style={{color: COLORS.text}} value={origin} onChange={(event) => handleOriginChange(event.target.value)} />
            </InputField>
            <InputField label="Destino" required icon={<MapPin size={16} style={{color: COLORS.primary}} />} error={fieldErrors.destination}>
              <input type="text" placeholder="¿A dónde se dirige?" maxLength={200} className={styles.input} style={{color: COLORS.text}}
                value={destination} onChange={(event) => handleDestinationChange(event.target.value)} />
            </InputField>
            <div className={styles.dateRow}>
              <InputField label="Fecha Inicio" required error={fieldErrors.startDate}>
                <DatePickerInput value={startDate} min={today} rangeStart={startDate} rangeEnd={endDate} onChange={handleStartDateChange} />
              </InputField>
              <InputField label="Fecha Fin" required error={fieldErrors.endDate}>
                <DatePickerInput value={endDate} min={today} rangeStart={startDate} rangeEnd={endDate} onChange={handleEndDateChange} />
              </InputField>
            </div>
            <div className={styles.radioRow}>
              <div className={styles.radioGroup}>
                <p className={styles.radioLabel} style={{color: COLORS.labels}}>Tipo de Viaje</p>
                <div className={styles.radioBtns}>
                  {['Nacional', 'Internacional'].map((option) => (
                    <button key={option} className={styles.radioBtn} onClick={() => handleTypeChange(option)}
                      style={{backgroundColor: type === option ? COLORS.primary : COLORS.dataFields, borderColor: type === option ? COLORS.primary : COLORS.fields, color: type === option ? COLORS.background : COLORS.labels}}>
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.radioGroup}>
                <p className={styles.radioLabel} style={{color: COLORS.labels}}>Medio de Transporte</p>
                <div className={styles.radioBtns}>
                  {(type === 'Internacional' ? ['Terrestre', 'Aéreo'] : ['Terrestre', 'Aéreo', 'Vehículo de Empresa']).map((option) => (
                    <button key={option} className={styles.radioBtn} onClick={() => setTransport(option)}
                      style={{backgroundColor: transport === option ? COLORS.primary : COLORS.dataFields, borderColor: transport === option ? COLORS.primary : COLORS.fields, color: transport === option ? COLORS.background : COLORS.labels}}>
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {transport === 'Vehículo de Empresa' && (
              <InputField label="Placa del Vehículo" required error={fieldErrors.vehiclePlate}>
                <input type="text" placeholder="Ej: 1234-ABC" maxLength={20} className={styles.input} style={{color: COLORS.text}}
                  value={vehiclePlate} onChange={(event) => handleVehiclePlateChange(event.target.value)} />
              </InputField>
            )}
            {type === 'Internacional' && days > 0 && (
              <div className={styles.internationalBadge} style={{backgroundColor: COLORS.backgroundHeader}}>
                <span style={{color: COLORS.primary, fontSize: 17}}>ⓘ</span>
                <p className="text-xs font-inter mt-1" style={{color: COLORS.labels}}>
                  El monto se calcula con la tarifa en <strong>Bs</strong> para el día de salida y el de regreso ({nationalDays} día{nationalDays !== 1 ? 's' : ''})
                  y con la tarifa en <strong>USD</strong> para los días intermedios ({internationalDays} día{internationalDays !== 1 ? 's' : ''}).
                  Puedes gastar en Bs o en USD cualquier día: cada moneda se controla con su tarifa diaria.
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