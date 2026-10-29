import {Search, Plus, Pencil, Ban, CheckCircle, Car} from 'lucide-react';
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import PageHeader from '../../components/ui/PageHeader';
import AdminMenu from '../../layouts/menu/AdminMenu';
import VehicleFormModal from '../../features/admin/organisms/VehicleFormModal';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import SuccessModal from '../../components/ui/SuccessModal';
import SkeletonList from '../../components/ui/SkeletonList';
import ListCount from '../../components/ui/ListCount';
import useVehicleManagement from '../../hooks/admin/useVehicleManagement';
import useMenu from '../../hooks/shared/useMenu';
import SessionExpiredModal from '../../features/user/organisms/SessionExpiredModal';
import {COLORS} from '../../constants';

const styles = {
  page: 'min-h-screen flex flex-col',
  content: 'flex-1 px-5 py-6 w-full',
  searchWrapper: 'flex items-center border rounded-xl px-3 py-2 gap-2 mb-4',
  searchInput: 'flex-1 text-sm font-inter outline-none bg-transparent',
  sectionLabel: 'text-xs font-bold font-inter uppercase mb-3',
  card: 'rounded-2xl p-4 mb-3 shadow-sm flex items-center gap-3',
  cardIcon: 'w-12 h-12 rounded-full flex items-center justify-center shrink-0',
  cardInfo: 'flex flex-col flex-1 min-w-0',
  cardName: 'text-sm font-bold font-inter',
  cardDetail: 'text-xs font-inter truncate',
  statusBadge: 'inline-flex w-fit items-center text-[11px] font-bold font-inter rounded-full px-2 py-0.5 mt-1',
  actionsRow: 'flex items-center gap-2 shrink-0',
  actionBtn: 'w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer',
  fab: 'fixed bottom-24 right-5 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg cursor-pointer z-10',
};

const statusOf = (vehicle) => {
  if (!vehicle.activo) {
    return {label: 'Suspendido', color: COLORS.secondary, background: COLORS.error};
  }
  if (vehicle.viaje_actual) {
    return {label: 'En viaje', color: COLORS.warningText, background: COLORS.backgroundHeader};
  }
  return {label: 'Libre', color: COLORS.successStrong, background: COLORS.successBackground};
};

function VehicleManagementPage() {
  const {menuOpen, user, openMenu, closeMenu, sessionExpired, handleSessionExpiredClose} = useMenu();
  const {
    vehicles, loading, savingAction, error, fieldErrors, setFieldErrors, search, setSearch, selectedVehicle,
    showForm, setShowForm, showSuspend, setShowSuspend, showSuccess, setShowSuccess, successMessage,
    formData, setFormData, openCreate, openEdit, openSuspend, handleSave, handleToggleActive,
  } = useVehicleManagement();
  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Vehículos" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
      <AdminMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
      <div className={styles.content}>
        <PageHeader title="Vehículos" subtitle="Flota de la empresa. Al crear un viaje en vehículo de la empresa solo se ofrecen los activos y libres; un vehículo se libera cuando el empleado termina su viaje." />
        <div className={styles.searchWrapper} style={{borderColor: COLORS.dataFields, backgroundColor: COLORS.background}}>
          <Search size={16} style={{color: COLORS.labels}} />
          <input className={styles.searchInput} style={{color: COLORS.text}} placeholder="Buscar por placa o descripción..." value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
        <p className={styles.sectionLabel} style={{color: COLORS.labels}}>Vehículos Registrados</p>
        {loading && <SkeletonList count={3} />}
        {!loading && vehicles.length > 0 && <ListCount shown={vehicles.length} total={vehicles.length} singular="vehículo" plural="vehículos" />}
        {!loading && vehicles.map((vehicle) => {
          const status = statusOf(vehicle);
          const trip = vehicle.viaje_actual;
          return (
            <div key={vehicle.id_vehiculo} className={styles.card} style={{backgroundColor: COLORS.backgroundHeader}}>
              <div className={styles.cardIcon} style={{backgroundColor: COLORS.positionRole}}>
                <Car size={20} style={{color: COLORS.primary}} />
              </div>
              <div className={styles.cardInfo}>
                <p className={styles.cardName} style={{color: COLORS.text}}>{vehicle.placa}</p>
                {vehicle.descripcion && <p className={styles.cardDetail} style={{color: COLORS.labels}}>{vehicle.descripcion}</p>}
                {trip && <p className={styles.cardDetail} style={{color: COLORS.labels}}>{trip.Usuario?.nombre} {trip.Usuario?.apellido_paterno} — {trip.destino}</p>}
                <span className={styles.statusBadge} style={{color: status.color, backgroundColor: status.background}}>{status.label}</span>
              </div>
              <div className={styles.actionsRow}>
                <button type="button" aria-label={`Editar ${vehicle.placa}`} className={styles.actionBtn} style={{backgroundColor: COLORS.primary}} onClick={() => openEdit(vehicle)}>
                  <Pencil size={14} style={{color: COLORS.background}} />
                </button>
                <button type="button" aria-label={`${vehicle.activo ? 'Suspender' : 'Activar'} ${vehicle.placa}`} className={styles.actionBtn}
                  style={{backgroundColor: vehicle.activo ? COLORS.error : COLORS.successBackground}} onClick={() => openSuspend(vehicle)}>
                  {vehicle.activo ? <Ban size={14} style={{color: COLORS.secondary}} /> : <CheckCircle size={14} style={{color: COLORS.successStrong}} />}
                </button>
              </div>
            </div>
          );
        })}
        {!loading && vehicles.length === 0 && (
          <EmptyState title="Sin vehículos registrados" subtitle="Registra los vehículos de la empresa con el botón +"
            icon={<Car size={30} style={{color: COLORS.onColorText80}} />} />
        )}
      </div>
      <button type="button" aria-label="Registrar vehículo" className={styles.fab} style={{backgroundColor: COLORS.secondary}} onClick={openCreate}>
        <Plus size={26} style={{color: COLORS.background}} />
      </button>
      <VehicleFormModal isOpen={showForm} isEditing={!!selectedVehicle} onClose={() => setShowForm(false)} onConfirm={handleSave}
        formData={formData} setFormData={setFormData} loading={savingAction} error={error} fieldErrors={fieldErrors} setFieldErrors={setFieldErrors} />
      <ConfirmDialog isOpen={showSuspend} icon={selectedVehicle?.activo ? Ban : CheckCircle} iconColor={COLORS.text} iconBackgroundColor={COLORS.background}
        title={selectedVehicle?.activo ? 'Suspender Vehículo' : 'Activar Vehículo'}
        message={selectedVehicle?.activo ? 'El vehículo ya no se ofrecerá al crear viajes. ¿Deseas suspenderlo?' : 'El vehículo volverá a ofrecerse al crear viajes. ¿Deseas activarlo?'}
        confirmText={selectedVehicle?.activo ? 'Suspender' : 'Activar'} loading={savingAction}
        onConfirm={handleToggleActive} onCancel={() => setShowSuspend(false)} />
      <SuccessModal isOpen={showSuccess} title="Vehículos" message={successMessage} onAccept={() => setShowSuccess(false)} />
      <Footer />
    </div>
  );
}

export default VehicleManagementPage;
