import ExportButton from '../../components/ui/ExportButton';
import useAdminExcelExport from '../../hooks/admin/useAdminExcelExport';
import {Search, Plus, Pencil, Ban, CheckCircle} from 'lucide-react';
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import PageHeader from '../../components/ui/PageHeader';
import AdminMenu from '../../layouts/menu/AdminMenu';
import UserFormModal from '../../features/admin/organisms/UserFormModal';
import UserImportModal from '../../features/admin/organisms/UserImportModal';
import useUserImport from '../../hooks/admin/useUserImport';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import SuccessModal from '../../components/ui/SuccessModal';
import SkeletonList from '../../components/ui/SkeletonList';
import SectionDropdown from '../../components/ui/SectionDropdown';
import useUserManagement from '../../hooks/admin/useUserManagement';
import useMenu from '../../hooks/shared/useMenu';
import {COLORS} from '../../constants';
import {avatarDefault} from '../../constants/defaultImages';
import LoadMoreButton from '../../components/ui/LoadMoreButton';
import useClientPagination from '../../hooks/shared/useClientPagination';
import SessionExpiredModal from '../../features/user/organisms/SessionExpiredModal';
import ListCount from '../../components/ui/ListCount';

const styles = {
  page: 'min-h-screen flex flex-col',
  content: 'flex-1 px-5 py-6 w-full',
  subtitle: 'text-sm font-inter mb-5',
  searchWrapper: 'flex items-center border rounded-xl px-3 py-2 gap-2 mb-4',
  searchInput: 'flex-1 text-sm font-inter outline-none bg-transparent',
  tabsRow: 'flex gap-2 mb-4 flex-wrap',
  tab: 'py-1.5 px-3 rounded-full text-xs font-bold font-inter cursor-pointer border text-center transition-colors',
  card: 'rounded-2xl p-4 mb-3 shadow-sm flex items-center gap-3',
  avatar: 'w-11 h-11 rounded-full object-cover shrink-0',
  cardInfo: 'flex flex-col flex-1 min-w-0',
  cardName: 'text-sm font-bold font-inter',
  cardPosition: 'text-xs font-inter',
  cardRole: 'text-xs font-bold font-inter px-2 py-0.5 rounded-full uppercase mt-1 self-start',
  actionsRow: 'flex items-center gap-2 shrink-0',
  actionBtn: 'w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer',
  fab: 'fixed bottom-24 right-5 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg cursor-pointer z-10',
  noticeCard: 'rounded-2xl p-4 flex items-center gap-3 mt-7 mb-4',
  noticeText: 'flex flex-col flex-1',
  noticeTitle: 'text-sm font-bold font-inter',
  noticeSub: 'text-xs font-inter',
  excelRow: 'grid grid-cols-1 sm:grid-cols-2 gap-3',
  importBtn: 'flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-bold font-nunito text-sm cursor-pointer mb-4 border-2',
};

const tabs = [
  {valor: 'TODOS', label: 'Todos'},
  {valor: 'EMPLEADO', label: 'Empleados'},
  {valor: 'SUPERVISOR', label: 'Supervisores'},
  {valor: 'APROBADOR', label: 'Aprobadores'},
  {valor: 'REVISOR', label: 'Revisores'},
  {valor: 'ADMINISTRADOR', label: 'Administradores'},
];

const roleConfig = {
  ADMINISTRADOR: {label: 'Administrador', bg: COLORS.successBackground, color: COLORS.success},
  SUPERVISOR: {label: 'Supervisor', bg: COLORS.adminBadge, color: COLORS.adminBadgeText},
  APROBADOR: {label: 'Aprobador', bg: COLORS.pendingHighlight, color: COLORS.warningStrong},
  REVISOR: {label: 'Revisor', bg: COLORS.warningBackground, color: COLORS.warningText},
  EMPLEADO: {label: 'Empleado', bg: COLORS.environmentTypes, color: COLORS.background},
};

function UserManagementPage() {
  const {menuOpen, user: menuUser, openMenu, closeMenu, sessionExpired, handleSessionExpiredClose} = useMenu();
  const {
    users, positions, sections, loading, savingAction, error, fieldErrors, setFieldErrors,
    search, setSearch, roleFilter, setRoleFilter, sectionFilter, setSectionFilter, selectedUser,
    showCreate, setShowCreate, showEdit, setShowEdit, showSuspend, setShowSuspend,
    showSuccess, setShowSuccess, successMessage, formData, setFormData,
    openCreate, openEdit, openSuspend, handleCreate, handleEdit, handleToggleActive,
    allUsers, reload,
  } = useUserManagement();
  const userImport = useUserImport({positions, sections, onImported: reload});
  const {exporting, exportError, exportUsers} = useAdminExcelExport();
  const pagination = useClientPagination(users, 15, `${search}|${roleFilter}|${sectionFilter}`);

  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Usuarios" onMenuClick={openMenu} profilePhoto={menuUser?.foto_perfil} />
      <AdminMenu isOpen={menuOpen} onClose={closeMenu} user={menuUser} />
      <div className={styles.content}>
        <PageHeader title="Usuarios" subtitle="Crea usuarios uno por uno o impórtalos desde Excel, y asígnales rol, cargo, sección y jefe directo; también puedes suspender o reactivar cuentas." />
        <div className={styles.searchWrapper} style={{borderColor: COLORS.dataFields, backgroundColor: COLORS.background}}>
          <Search size={16} style={{color: COLORS.labels}} />
          <input className={styles.searchInput} style={{color: COLORS.text}} placeholder="Buscar usuarios..." value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
        {sections.length > 0 && (
          <div className="mb-4">
            <SectionDropdown sections={sections} selectedSection={sectionFilter} onSelect={setSectionFilter} placeholder="Todas las secciones" />
          </div>
        )}
        <div className={styles.tabsRow}>
          {tabs.map((tab) => (
            <button key={tab.valor} className={styles.tab} onClick={() => setRoleFilter(tab.valor)}
              style={{backgroundColor: roleFilter === tab.valor ? COLORS.primary : 'transparent', borderColor: roleFilter === tab.valor ? COLORS.primary : COLORS.dataFields, color: roleFilter === tab.valor ? COLORS.background : COLORS.labels}}>
              {tab.label}
            </button>
          ))}
        </div>
        <div className={styles.excelRow}>
          <button className={styles.importBtn} onClick={userImport.open} disabled={loading}
            style={{borderColor: COLORS.secondary, color: COLORS.secondary, backgroundColor: COLORS.background, opacity: loading ? 0.6 : 1}}>
            Importar desde Excel
          </button>
          <ExportButton onClick={() => exportUsers(users)} exporting={exporting} disabled={loading || users.length === 0} />
        </div>
        {exportError && <p className="text-xs font-inter italic text-center mb-3" style={{color: COLORS.secondary}}>{exportError}</p>}
        {loading && <SkeletonList count={4} />}
        {!loading && pagination.total > 0 && (
          <ListCount shown={pagination.visibleItems.length} total={pagination.total} singular="usuario" plural="usuarios" />
        )}
        {!loading && pagination.visibleItems.map((currentUser) => {
          const config = roleConfig[currentUser.Rol?.nombre] || roleConfig['EMPLEADO'];
          return (
            <div key={currentUser.id_usuario} className={styles.card} style={{backgroundColor: COLORS.backgroundHeader}}>
              <img src={currentUser.foto_perfil || avatarDefault} alt="avatar" className={styles.avatar}
                onError={(event) => {event.target.src = avatarDefault;}} />
              <div className={styles.cardInfo}>
                <p className={styles.cardName} style={{color: COLORS.text}}>{currentUser.nombre} {currentUser.apellido_paterno}</p>
                <p className={styles.cardPosition} style={{color: COLORS.labels}}>{currentUser.Cargo?.nombre || 'Sin cargo'}</p>
                <span className={styles.cardRole} style={{backgroundColor: config.bg, color: config.color}}>{config.label}</span>
              </div>
              <div className={styles.actionsRow}>
                <div className={styles.actionBtn} style={{backgroundColor: currentUser.activo ? COLORS.successBackground : COLORS.error}}>
                  <div style={{width: 8, height: 8, borderRadius: '50%', backgroundColor: currentUser.activo ? COLORS.successStrong : COLORS.secondary}} />
                </div>
                <div className={styles.actionBtn} role="button" aria-label={`Editar a ${currentUser.nombre} ${currentUser.apellido_paterno}`} style={{backgroundColor: COLORS.primary}} onClick={() => openEdit(currentUser)}>
                  <Pencil size={14} style={{color: COLORS.background}} />
                </div>
                <div className={styles.actionBtn} style={{backgroundColor: currentUser.activo ? COLORS.error : COLORS.successBackground}} onClick={() => openSuspend(currentUser)}>
                  {currentUser.activo ? <Ban size={14} style={{color: COLORS.secondary}} /> : <CheckCircle size={14} style={{color: COLORS.successStrong}} />}
                </div>
              </div>
            </div>
          );
        })}
        {!loading && pagination.hasMorePages && <LoadMoreButton onClick={pagination.loadMore} label="Cargar más usuarios" />}
        {!loading && users.length === 0 && (
          <EmptyState title="Sin usuarios registrados" subtitle="No se encontraron usuarios con los filtros aplicados"
            icon={
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="12" r="5" fill={COLORS.onColorText60} />
                <path d="M6 26C6 21 10 18 16 18C22 18 26 21 26 26" stroke={COLORS.onColorText60} strokeWidth="2" strokeLinecap="round" />
              </svg>
            } />
        )}
        <div className={styles.noticeCard} style={{backgroundColor: COLORS.error}}>
          <Ban size={22} style={{color: COLORS.secondary}} />
          <div className={styles.noticeText}>
            <p className={styles.noticeTitle} style={{color: COLORS.secondary}}>Suspender Cuenta</p>
            <p className={styles.noticeSub} style={{color: COLORS.secondary}}>Inhabilita el acceso temporalmente</p>
          </div>
        </div>
      </div>
      <div className={styles.fab} style={{backgroundColor: COLORS.secondary}} onClick={openCreate}>
        <Plus size={26} style={{color: COLORS.background}} />
      </div>
      <UserFormModal isOpen={showCreate} onClose={() => setShowCreate(false)} onConfirm={handleCreate}
        title="Nuevo Usuario" btnLabel="Registrar" formData={formData} setFormData={setFormData} positions={positions} allUsers={allUsers} sections={sections}
        loading={savingAction} error={error} fieldErrors={fieldErrors} setFieldErrors={setFieldErrors} selectedUser={null} />
      <UserFormModal isOpen={showEdit} onClose={() => setShowEdit(false)} onConfirm={handleEdit}
        title="Editar Usuario" btnLabel="Actualizar" formData={formData} setFormData={setFormData} positions={positions} allUsers={allUsers} sections={sections}
        loading={savingAction} error={error} fieldErrors={fieldErrors} setFieldErrors={setFieldErrors} selectedUser={selectedUser} />
      <ConfirmDialog isOpen={showSuspend} icon={selectedUser?.activo ? Ban : CheckCircle} iconColor={COLORS.text} iconBackgroundColor={COLORS.background}
        title={selectedUser?.activo ? 'Suspender Usuario' : 'Activar Usuario'}
        message={selectedUser?.activo ? '¿Estás seguro de que deseas suspender este usuario?' : '¿Estás seguro de que deseas activar este usuario?'}
        confirmText={selectedUser?.activo ? 'Suspender' : 'Activar'} loading={savingAction}
        onConfirm={handleToggleActive} onCancel={() => setShowSuspend(false)} />
      <UserImportModal isOpen={userImport.isOpen} onClose={userImport.close} fileName={userImport.fileName} preview={userImport.preview}
        result={userImport.result} error={userImport.error} validRows={userImport.validRows} invalidRows={userImport.invalidRows}
        checking={userImport.checking} importing={userImport.importing} downloading={userImport.downloading}
        onDownloadTemplate={userImport.downloadTemplate} onSelectFile={userImport.selectFile} onConfirm={userImport.confirmImport} />
      <SuccessModal isOpen={showSuccess} title="Éxito" message={successMessage} onAccept={() => setShowSuccess(false)} />
      <Footer />
    </div>
  );
}

export default UserManagementPage;