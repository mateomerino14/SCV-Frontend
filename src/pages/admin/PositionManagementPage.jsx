import {Search, Plus, Pencil, Ban, CheckCircle} from 'lucide-react';
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import PageHeader from '../../components/ui/PageHeader';
import AdminMenu from '../../layouts/menu/AdminMenu';
import PositionFormModal from '../../features/admin/organisms/PositionFormModal';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import SuccessModal from '../../components/ui/SuccessModal';
import SkeletonList from '../../components/ui/SkeletonList';
import usePositionManagement from '../../hooks/admin/usePositionManagement';
import useMenu from '../../hooks/shared/useMenu';
import {COLORS} from '../../constants';

const positionImage = "https://i.pinimg.com/474x/92/59/28/9259282c3e36ed39f345a91a1a182041.jpg";

const styles = {
  page: 'min-h-screen flex flex-col',
  content: 'flex-1 px-5 py-6 w-full',
  subtitle: 'text-sm font-inter mb-5',
  searchWrapper: 'flex items-center border rounded-xl px-3 py-2 gap-2 mb-4',
  searchInput: 'flex-1 text-sm font-inter outline-none bg-transparent',
  sectionLabel: 'text-xs font-bold font-inter uppercase mb-3',
  card: 'rounded-2xl p-4 mb-3 shadow-sm flex items-center gap-3',
  cardImage: 'w-15 h-15 rounded-full object-cover shrink-0',
  cardInfo: 'flex flex-col flex-1 min-w-0',
  cardName: 'text-sm font-bold font-inter',
  cardAmount: 'text-xs font-inter',
  cardAmountUsd: 'text-xs font-inter',
  actionsRow: 'flex items-center gap-2 shrink-0',
  actionBtn: 'w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer',
  fab: 'fixed bottom-24 right-5 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg cursor-pointer z-10',
  noticeCard: 'rounded-2xl p-4 flex items-center gap-3 mt-7 mb-4',
  noticeText: 'flex flex-col flex-1',
  noticeTitle: 'text-sm font-bold font-inter',
  noticeSub: 'text-xs font-inter',
};

function PositionManagementPage() {
  const {menuOpen, user, openMenu, closeMenu, sessionExpired} = useMenu();
  const {
    positions, loading, savingAction, error, fieldErrors, setFieldErrors,
    search, setSearch, selectedPosition,
    showCreate, setShowCreate, showEdit, setShowEdit, showSuspend, setShowSuspend,
    showSuccess, setShowSuccess, successMessage, formData, setFormData, suggestions,
    openCreate, openEdit, openSuspend, handleCreate, handleEdit, handleToggleActive,
  } = usePositionManagement();
  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <Navbar text="Gestión de Cargos" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
      <AdminMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
      <div className={styles.content}>
        <PageHeader title="Gestión de Cargos" subtitle="Administra los cargos y salarios del sistema." />
        <div className={styles.searchWrapper} style={{borderColor: COLORS.dataFields, backgroundColor: COLORS.background}}>
          <Search size={16} style={{color: COLORS.labels}} />
          <input className={styles.searchInput} style={{color: COLORS.text}} placeholder="Buscar cargos..." value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
        <p className={styles.sectionLabel} style={{color: COLORS.labels}}>Puesto y Salario Diario</p>
        {loading && <SkeletonList count={4} />}
        {!loading && positions.map((position) => (
          <div key={position.id_cargo} className={styles.card} style={{backgroundColor: COLORS.backgroundHeader}}>
            <img src={positionImage} alt="cargo" className={styles.cardImage} />
            <div className={styles.cardInfo}>
              <p className={styles.cardName} style={{color: COLORS.text}}>{position.nombre}</p>
              <p className={styles.cardAmount} style={{color: COLORS.labels}}>{parseFloat(position.monto_diario).toFixed(2)} Bs / día</p>
              {position.monto_diario_usd > 0 && (
                <p className={styles.cardAmountUsd} style={{color: COLORS.primary}}>{parseFloat(position.monto_diario_usd).toFixed(2)} USD / día</p>
              )}
            </div>
            <div className={styles.actionsRow}>
              <div className={styles.actionBtn} style={{backgroundColor: position.activo ? '#d4edda' : COLORS.error}}>
                <div style={{width: 8, height: 8, borderRadius: '50%', backgroundColor: position.activo ? '#2d7a3a' : COLORS.secondary}} />
              </div>
              <div className={styles.actionBtn} style={{backgroundColor: COLORS.primary}} onClick={() => openEdit(position)}>
                <Pencil size={14} style={{color: COLORS.background}} />
              </div>
              <div className={styles.actionBtn} style={{backgroundColor: position.activo ? COLORS.error : '#d4edda'}} onClick={() => openSuspend(position)}>
                {position.activo ? <Ban size={14} style={{color: COLORS.secondary}} /> : <CheckCircle size={14} style={{color: '#2d7a3a'}} />}
              </div>
            </div>
          </div>
        ))}
        {!loading && positions.length === 0 && (
          <EmptyState title="Sin cargos registrados" subtitle="No se encontraron cargos con los filtros aplicados"
            icon={
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="8" y="10" width="16" height="12" rx="2" fill="rgba(255,255,255,0.4)" />
                <path d="M12 10V8C12 6.9 12.9 6 14 6H18C19.1 6 20 6.9 20 8V10" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
                <path d="M12 16H20" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            } />
        )}
        <div className={styles.noticeCard} style={{backgroundColor: COLORS.error}}>
          <Ban size={22} style={{color: COLORS.secondary}} />
          <div className={styles.noticeText}>
            <p className={styles.noticeTitle} style={{color: COLORS.secondary}}>Bloquear Cargo</p>
            <p className={styles.noticeSub} style={{color: COLORS.secondary}}>Inhabilita el uso temporalmente</p>
          </div>
        </div>
      </div>
      <div className={styles.fab} style={{backgroundColor: COLORS.secondary}} onClick={openCreate}>
        <Plus size={26} style={{color: COLORS.background}} />
      </div>
      <PositionFormModal isOpen={showCreate} onClose={() => setShowCreate(false)} onConfirm={handleCreate}
        title="Agregar Nuevo Cargo" subtitle="Defina las especificaciones del nuevo rol dentro de la estructura organizacional."
        btnLabel="Registrar" formData={formData} setFormData={setFormData} loading={savingAction} error={error}
        fieldErrors={fieldErrors} setFieldErrors={setFieldErrors} suggestions={suggestions} />
      <PositionFormModal isOpen={showEdit} onClose={() => setShowEdit(false)} onConfirm={handleEdit}
        title="Editar Cargo" subtitle="Actualice la información estructural y financiera para la posición seleccionada."
        btnLabel="Actualizar" formData={formData} setFormData={setFormData} loading={savingAction} error={error}
        fieldErrors={fieldErrors} setFieldErrors={setFieldErrors} suggestions={suggestions} />
      <ConfirmDialog isOpen={showSuspend} icon={selectedPosition?.activo ? Ban : CheckCircle} iconColor={COLORS.text} iconBackgroundColor={COLORS.background}
        title={selectedPosition?.activo ? 'Bloquear Cargo' : 'Activar Cargo'}
        message={selectedPosition?.activo ? '¿Estás seguro de que deseas bloquear este cargo?' : '¿Estás seguro de que deseas activar este cargo?'}
        confirmText={selectedPosition?.activo ? 'Bloquear' : 'Activar'} loading={savingAction}
        onConfirm={handleToggleActive} onCancel={() => setShowSuspend(false)} />
      <SuccessModal isOpen={showSuccess} title="Éxito" message={successMessage} onAccept={() => setShowSuccess(false)} />
      <Footer />
    </div>
  );
}

export default PositionManagementPage;