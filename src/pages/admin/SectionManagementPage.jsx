import {Search, Plus, Pencil, Ban, CheckCircle} from 'lucide-react';
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import PageHeader from '../../components/ui/PageHeader';
import AdminMenu from '../../layouts/menu/AdminMenu';
import SectionFormModal from '../../features/admin/organisms/SectionFormModal';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import SuccessModal from '../../components/ui/SuccessModal';
import SkeletonList from '../../components/ui/SkeletonList';
import useSectionManagement from '../../hooks/admin/useSectionManagement';
import useMenu from '../../hooks/shared/useMenu';
import {COLORS} from '../../constants';

const styles = {
  page: 'min-h-screen flex flex-col',
  content: 'flex-1 px-5 py-6 w-full',
  subtitle: 'text-sm font-inter mb-5',
  searchWrapper: 'flex items-center border rounded-xl px-3 py-2 gap-2 mb-4',
  searchInput: 'flex-1 text-sm font-inter outline-none bg-transparent',
  sectionLabel: 'text-xs font-bold font-inter uppercase mb-3',
  card: 'rounded-2xl p-4 mb-3 shadow-sm flex items-center gap-3',
  cardIcon: 'w-12 h-12 rounded-full flex items-center justify-center shrink-0',
  cardInfo: 'flex flex-col flex-1 min-w-0',
  cardName: 'text-sm font-bold font-inter',
  actionsRow: 'flex items-center gap-2 shrink-0',
  actionBtn: 'w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer',
  fab: 'fixed bottom-24 right-5 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg cursor-pointer z-10',
  noticeCard: 'rounded-2xl p-4 flex items-center gap-3 mt-7 mb-4',
  noticeText: 'flex flex-col flex-1',
  noticeTitle: 'text-sm font-bold font-inter',
  noticeSub: 'text-xs font-inter',
};

function SectionManagementPage() {
  const {menuOpen, user, openMenu, closeMenu} = useMenu();
  const {
    sections, loading, savingAction, error, fieldErrors, setFieldErrors,
    search, setSearch, selectedSection,
    showCreate, setShowCreate, showEdit, setShowEdit, showSuspend, setShowSuspend,
    showSuccess, setShowSuccess, successMessage, formData, setFormData,
    openCreate, openEdit, openSuspend, handleCreate, handleEdit, handleToggleActive,
  } = useSectionManagement();
  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <Navbar text="Gestión de Secciones" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
      <AdminMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
      <div className={styles.content}>
        <PageHeader title="Gestión de Secciones" subtitle="Administra las secciones o departamentos de la empresa." />
        <div className={styles.searchWrapper} style={{borderColor: COLORS.dataFields, backgroundColor: COLORS.background}}>
          <Search size={16} style={{color: COLORS.labels}} />
          <input className={styles.searchInput} style={{color: COLORS.text}} placeholder="Buscar secciones..." value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
        <p className={styles.sectionLabel} style={{color: COLORS.labels}}>Secciones Registradas</p>
        {loading && <SkeletonList count={4} />}
        {!loading && sections.map((section) => (
          <div key={section.id_seccion} className={styles.card} style={{backgroundColor: COLORS.backgroundHeader}}>
            <div className={styles.cardIcon} style={{backgroundColor: COLORS.positionRole}}>
              <span style={{color: COLORS.primary, fontWeight: 'bold', fontSize: 16}}>{section.nombre.charAt(0).toUpperCase()}</span>
            </div>
            <div className={styles.cardInfo}>
              <p className={styles.cardName} style={{color: COLORS.text}}>{section.nombre}</p>
            </div>
            <div className={styles.actionsRow}>
              <div className={styles.actionBtn} style={{backgroundColor: section.activo ? '#d4edda' : COLORS.error}}>
                <div style={{width: 8, height: 8, borderRadius: '50%', backgroundColor: section.activo ? '#2d7a3a' : COLORS.secondary}} />
              </div>
              <div className={styles.actionBtn} style={{backgroundColor: COLORS.primary}} onClick={() => openEdit(section)}>
                <Pencil size={14} style={{color: COLORS.background}} />
              </div>
              <div className={styles.actionBtn} style={{backgroundColor: section.activo ? COLORS.error : '#d4edda'}} onClick={() => openSuspend(section)}>
                {section.activo ? <Ban size={14} style={{color: COLORS.secondary}} /> : <CheckCircle size={14} style={{color: '#2d7a3a'}} />}
              </div>
            </div>
          </div>
        ))}
        {!loading && sections.length === 0 && (
          <EmptyState title="Sin secciones registradas" subtitle="No se encontraron secciones con los filtros aplicados"
            icon={
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="6" y="8" width="20" height="16" rx="2" fill="rgba(255,255,255,0.4)" />
                <path d="M6 14H26" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
                <path d="M11 19H15" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            } />
        )}
        <div className={styles.noticeCard} style={{backgroundColor: COLORS.error}}>
          <Ban size={22} style={{color: COLORS.secondary}} />
          <div className={styles.noticeText}>
            <p className={styles.noticeTitle} style={{color: COLORS.secondary}}>Bloquear Sección</p>
            <p className={styles.noticeSub} style={{color: COLORS.secondary}}>Inhabilita su uso temporalmente; no borra a los usuarios que ya la tienen asignada</p>
          </div>
        </div>
      </div>
      <div className={styles.fab} style={{backgroundColor: COLORS.secondary}} onClick={openCreate}>
        <Plus size={26} style={{color: COLORS.background}} />
      </div>
      <SectionFormModal isOpen={showCreate} onClose={() => setShowCreate(false)} onConfirm={handleCreate}
        title="Agregar Nueva Sección" subtitle="Defina una nueva sección o departamento de la empresa."
        btnLabel="Registrar" formData={formData} setFormData={setFormData} loading={savingAction} error={error}
        fieldErrors={fieldErrors} setFieldErrors={setFieldErrors} />
      <SectionFormModal isOpen={showEdit} onClose={() => setShowEdit(false)} onConfirm={handleEdit}
        title="Editar Sección" subtitle="Actualice el nombre de la sección seleccionada."
        btnLabel="Actualizar" formData={formData} setFormData={setFormData} loading={savingAction} error={error}
        fieldErrors={fieldErrors} setFieldErrors={setFieldErrors} />
      <ConfirmDialog isOpen={showSuspend} icon={selectedSection?.activo ? Ban : CheckCircle} iconColor={COLORS.text} iconBackgroundColor={COLORS.background}
        title={selectedSection?.activo ? 'Bloquear Sección' : 'Activar Sección'}
        message={selectedSection?.activo ? '¿Estás seguro de que deseas bloquear esta sección?' : '¿Estás seguro de que deseas activar esta sección?'}
        confirmText={selectedSection?.activo ? 'Bloquear' : 'Activar'} loading={savingAction}
        onConfirm={handleToggleActive} onCancel={() => setShowSuspend(false)} />
      <SuccessModal isOpen={showSuccess} title="Éxito" message={successMessage} onAccept={() => setShowSuccess(false)} />
      <Footer />
    </div>
  );
}

export default SectionManagementPage;
