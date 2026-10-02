import {Send, Eye, CheckCircle, AlertCircle} from 'lucide-react';
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import PageHeader from '../../components/ui/PageHeader';
import AdminMenu from '../../layouts/menu/AdminMenu';
import SkeletonCard from '../../components/ui/SkeletonCard';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import ReminderScheduleCard from '../../features/admin/organisms/ReminderScheduleCard';
import ReminderPreviewList from '../../features/admin/organisms/ReminderPreviewList';
import SessionExpiredModal from '../../features/user/organisms/SessionExpiredModal';
import useReminderSettings from '../../hooks/admin/useReminderSettings';
import useMenu from '../../hooks/shared/useMenu';
import {COLORS} from '../../constants';
import {formatDateTime} from '../../utils/dateFormatter';

const styles = {
  page: 'min-h-screen flex flex-col',
  content: 'flex-1 px-5 py-6 w-full max-w-3xl mx-auto',
  buttonsRow: 'flex gap-2 mb-2',
  primaryBtn: 'flex-1 py-2.5 rounded-xl text-sm font-bold font-nunito cursor-pointer border transition-colors text-center',
  lastUpdate: 'text-xs font-inter text-center mb-6',
  card: 'rounded-2xl p-4 shadow-md mb-5',
  cardTitle: 'text-xs font-bold font-inter uppercase mb-1',
  cardText: 'text-sm font-inter mb-3',
  actionsRow: 'flex flex-col sm:flex-row gap-2',
  actionBtn: 'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold font-nunito cursor-pointer border',
  errorMsg: 'text-sm font-inter text-center rounded-xl px-3 py-3 mb-4',
};

function ReminderSettingsPage() {
  const {menuOpen, user, openMenu, closeMenu, sessionExpired, handleSessionExpiredClose} = useMenu();
  const reminders = useReminderSettings();
  const busy = reminders.saving || reminders.sending;

  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Recordatorios" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
      <AdminMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
      <div className={styles.content}>
        <PageHeader title="Recordatorios" subtitle="Elige qué días y a qué horas se envía por correo el resumen de pendientes a quienes revisan, aprueban o asignan fondos." />

        {reminders.loading && <SkeletonCard />}
        {!reminders.loading && reminders.loadError && (
          <p className={styles.errorMsg} style={{backgroundColor: COLORS.error, color: COLORS.secondary}}>{reminders.loadError}</p>
        )}

        {!reminders.loading && !reminders.loadError && (
          <>
            <ReminderScheduleCard schedule={reminders.schedule} maxTimes={reminders.maxTimes}
              newTime={reminders.newTime} setNewTime={reminders.setNewTime}
              onToggleActive={reminders.toggleActive} onToggleDay={reminders.toggleDay}
              onAddTime={reminders.addTime} onRemoveTime={reminders.removeTime} />

            <div className={styles.buttonsRow}>
              <button className={styles.primaryBtn} onClick={reminders.save} disabled={busy || !reminders.hasChanges}
                style={{backgroundColor: busy || !reminders.hasChanges ? COLORS.fields : COLORS.primary, borderColor: busy || !reminders.hasChanges ? COLORS.fields : COLORS.primary, color: COLORS.background}}>
                {reminders.saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              {reminders.hasChanges && (
                <button className={styles.primaryBtn} onClick={reminders.discardChanges} disabled={busy}
                  style={{backgroundColor: 'transparent', borderColor: COLORS.dataFields, color: COLORS.labels}}>
                  Descartar
                </button>
              )}
            </div>
            {reminders.lastUpdate?.fecha && (
              <p className={styles.lastUpdate} style={{color: COLORS.labels}}>
                Última modificación: {formatDateTime(reminders.lastUpdate.fecha)}{reminders.lastUpdate.por ? ` por ${reminders.lastUpdate.por}` : ''}
              </p>
            )}

            <div className={styles.card} style={{backgroundColor: COLORS.background, border: `1px solid ${COLORS.fields}`}}>
              <p className={styles.cardTitle} style={{color: COLORS.labels}}>Enviar en este momento</p>
              <p className={styles.cardText} style={{color: COLORS.text}}>
                Consulta a quién le llegaría el resumen con los pendientes actuales o envíalo ahora, sin esperar a la próxima hora programada.
              </p>
              <div className={styles.actionsRow}>
                <button className={styles.actionBtn} onClick={reminders.loadPreview} disabled={reminders.loadingPreview || busy}
                  style={{backgroundColor: 'transparent', borderColor: COLORS.primary, color: COLORS.primary, opacity: reminders.loadingPreview ? 0.6 : 1}}>
                  <Eye size={16} />
                  {reminders.loadingPreview ? 'Consultando...' : 'Vista Previa'}
                </button>
                <button className={styles.actionBtn} onClick={reminders.openConfirmSend} disabled={busy}
                  style={{backgroundColor: COLORS.primary, borderColor: COLORS.primary, color: COLORS.background, opacity: reminders.sending ? 0.6 : 1}}>
                  <Send size={16} />
                  {reminders.sending ? 'Enviando...' : 'Enviar Ahora'}
                </button>
              </div>
              {reminders.preview && <ReminderPreviewList preview={reminders.preview} />}
            </div>
          </>
        )}
      </div>

      <ConfirmDialog isOpen={reminders.confirmSend} icon={Send} title="Enviar Resumen"
        message="Se enviará ahora el resumen de pendientes por correo a todas las personas que tienen algo pendiente."
        confirmText="Enviar" onConfirm={reminders.sendNow} onCancel={reminders.closeConfirmSend} />
      <ConfirmDialog isOpen={!!reminders.result} compact icon={reminders.result?.success ? CheckCircle : AlertCircle} iconColor={COLORS.primary}
        title={reminders.result?.success ? 'Listo' : 'No se pudo completar'} message={reminders.result?.message}
        confirmText="Entendido" hideCancel onConfirm={reminders.closeResult} />
      <Footer />
    </div>
  );
}

export default ReminderSettingsPage;
