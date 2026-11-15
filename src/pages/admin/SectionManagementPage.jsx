import ExportButton from '../../components/ui/ExportButton';
import ImportButton from '../../components/ui/ImportButton';
import ExcelImportModal from '../../components/ui/ExcelImportModal';
import useCatalogImport from '../../hooks/admin/useCatalogImport';
import {sectionImportTexts} from '../../constants/importTexts';
import useAdminExcelExport from '../../hooks/admin/useAdminExcelExport';
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
import LoadMoreButton from '../../components/ui/LoadMoreButton';
import SessionExpiredModal from '../../features/user/organisms/SessionExpiredModal';
import ListCount from '../../components/ui/ListCount';

const styles = {
  excelRow: 'grid grid-cols-1 sm:grid-cols-2 gap-3',
  page: 'min-h-screen flex flex-col',
  content: 'flex-1 px-5 pt-6 pb-28 w-full',
  subtitle: 'text-sm font-inter mb-5',
  searchWrapper: 'flex items-center border rounded-xl px-3 py-2 gap-2 mb-4',
  searchInput: 'flex-1 text-sm font-inter outline-none bg-transparent',
  sectionLabel: 'text-xs font-bold font-inter uppercase mb-3',
  card: 'rounded-2xl p-4 mb-3 shadow-sm flex items-center gap-3',
  cardIcon: 'w-12 h-12 rounded-full flex items-center justify-center shrink-0',
  cardInfo: 'flex flex-col flex-1 min-w-0',
  cardName: 'text-sm font-bold font-inter',
  cardCodes: 'text-xs font-inter',
  actionsRow: 'flex items-center gap-2 shrink-0',
  actionBtn: 'w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer',
  fab: 'fixed bottom-24 right-5 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg cursor-pointer z-10',
  noticeCard: 'rounded-2xl p-4 flex items-center gap-3 mt-7 mb-4',
  noticeText: 'flex flex-col flex-1',
  noticeTitle: 'text-sm font-bold font-inter',
  noticeSub: 'text-xs font-inter',
};

function SectionManagementPage() {
  const {menuOpen, user, openMenu, closeMenu, sessionExpired, handleSessionExpiredClose} = useMenu();
  const {
    sections, loading, savingAction, error, fieldErrors, setFieldErrors,
    search, setSearch, selectedSection,
    showCreate, setShowCreate, showEdit, setShowEdit, showSuspend, setShowSuspend,
    showSuccess, setShowSuccess, successMessage, formData, setFormData,
    openCreate, openEdit, openSuspend, handleCreate, handleEdit, handleToggleActive, suggestions,
    reload, totalSections, hasMoreSections, loadMoreSections, loadingMoreSections, listFilters,
  } = useSectionManagement();
  const catalogImport = useCatalogImport('section', reload);
  const {exporting, exportError, exportSections} = useAdminExcelExport();
  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Secciones" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
      <AdminMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
      <div className={styles.content}>
        <PageHeader title="Secciones" subtitle="Crea y organiza las secciones de la empresa; se usan para asignar revisores, reemplazos y filtrar reportes." />
        <div className={styles.searchWrapper} style={{borderColor: COLORS.dataFields, backgroundColor: COLORS.background}}>
          <Search size={16} style={{color: COLORS.labels}} />
          <input className={styles.searchInput} style={{color: COLORS.text}} placeholder="Buscar secciones..." value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
        <p className={styles.sectionLabel} style={{color: COLORS.labels}}>Secciones Registradas</p>
        <div className={styles.excelRow}>
          <ImportButton onClick={catalogImport.open} disabled={loading} />
          <ExportButton onClick={() => exportSections(listFilters)} exporting={exporting} disabled={loading || totalSections === 0} />
        </div>
        {exportError && <p className="text-xs font-inter italic text-center mb-3" style={{color: COLORS.secondary}}>{exportError}</p>}
        {loading && <SkeletonList count={4} />}
        {!loading && totalSections > 0 && (
          <ListCount shown={sections.length} total={totalSections} singular="sección" plural="secciones" />
        )}
        {!loading && sections.map((section) => (
          <div key={section.id_seccion} className={styles.card} style={{backgroundColor: COLORS.backgroundHeader}}>
            <div className={styles.cardIcon} style={{backgroundColor: COLORS.positionRole}}>
              <span style={{color: COLORS.primary, fontWeight: 'bold', fontSize: 16}}>{section.nombre.charAt(0).toUpperCase()}</span>
            </div>
            <div className={styles.cardInfo}>
              <p className={styles.cardName} style={{color: COLORS.text}}>{section.nombre}</p>
              {section.codigo_seccion && <p className={styles.cardCodes} style={{color: COLORS.labels}}>Sección Oracle: {section.codigo_seccion}</p>}
            </div>
            <div className={styles.actionsRow}>
              <div className={styles.actionBtn} style={{backgroundColor: section.activo ? COLORS.successBackground : COLORS.error}}>
                <div style={{width: 8, height: 8, borderRadius: '50%', backgroundColor: section.activo ? COLORS.successStrong : COLORS.secondary}} />
              </div>
              <div className={styles.actionBtn} style={{backgroundColor: COLORS.primary}} onClick={() => openEdit(section)}>
                <Pencil size={14} style={{color: COLORS.background}} />
              </div>
              <div className={styles.actionBtn} style={{backgroundColor: section.activo ? COLORS.error : COLORS.successBackground}} onClick={() => openSuspend(section)}>
                {section.activo ? <Ban size={14} style={{color: COLORS.secondary}} /> : <CheckCircle size={14} style={{color: COLORS.successStrong}} />}
              </div>
            </div>
          </div>
        ))}
        {!loading && hasMoreSections && <LoadMoreButton onClick={loadMoreSections} loading={loadingMoreSections} label="Cargar más secciones" />}
        {!loading && sections.length === 0 && (
          <EmptyState title="Sin secciones registradas" subtitle="No se encontraron secciones con los filtros aplicados"
            icon={
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="6" y="8" width="20" height="16" rx="2" fill={COLORS.backgroundOnColorBorder} />
                <path d="M6 14H26" stroke={COLORS.onColorText70} strokeWidth="2" />
                <path d="M11 19H15" stroke={COLORS.onColorText80} strokeWidth="2" strokeLinecap="round" />
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
      <div className={styles.fab} role="button" aria-label="Agregar sección" style={{backgroundColor: COLORS.secondary}} onClick={openCreate}>
        <Plus size={26} style={{color: COLORS.background}} />
      </div>
      <SectionFormModal isOpen={showCreate} onClose={() => setShowCreate(false)} onConfirm={handleCreate}
        title="Agregar Nueva Sección" subtitle="Defina una nueva sección o departamento de la empresa."
        btnLabel="Registrar" formData={formData} setFormData={setFormData} loading={savingAction} error={error}
        fieldErrors={fieldErrors} setFieldErrors={setFieldErrors} suggestions={suggestions} />
      <SectionFormModal isOpen={showEdit} onClose={() => setShowEdit(false)} onConfirm={handleEdit}
        title="Editar Sección" subtitle="Actualice el nombre y el código de Oracle de la sección."
        btnLabel="Actualizar" formData={formData} setFormData={setFormData} loading={savingAction} error={error}
        fieldErrors={fieldErrors} setFieldErrors={setFieldErrors} suggestions={suggestions} />
      <ConfirmDialog isOpen={showSuspend} icon={selectedSection?.activo ? Ban : CheckCircle} iconColor={COLORS.text} iconBackgroundColor={COLORS.background}
        title={selectedSection?.activo ? 'Bloquear Sección' : 'Activar Sección'}
        message={selectedSection?.activo ? '¿Estás seguro de que deseas bloquear esta sección?' : '¿Estás seguro de que deseas activar esta sección?'}
        confirmText={selectedSection?.activo ? 'Bloquear' : 'Activar'} loading={savingAction}
        onConfirm={handleToggleActive} onCancel={() => setShowSuspend(false)} />
      <SuccessModal isOpen={showSuccess} title="Éxito" message={successMessage} onAccept={() => setShowSuccess(false)} />
      <ExcelImportModal texts={sectionImportTexts} isOpen={catalogImport.isOpen} onClose={catalogImport.close} fileName={catalogImport.fileName} preview={catalogImport.preview}
        result={catalogImport.result} error={catalogImport.error} validRows={catalogImport.validRows} invalidRows={catalogImport.invalidRows} actionableRows={catalogImport.actionableRows}
        checking={catalogImport.checking} importing={catalogImport.importing} downloading={catalogImport.downloading}
        onDownloadTemplate={catalogImport.downloadTemplate} onSelectFile={catalogImport.selectFile} onConfirm={catalogImport.confirmImport} />
      <Footer />
    </div>
  );
}

export default SectionManagementPage;
