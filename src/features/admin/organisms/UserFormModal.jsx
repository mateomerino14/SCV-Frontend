import {motion, AnimatePresence} from 'framer-motion';
import {User} from 'lucide-react';
import ModalIconHeader from '../../../components/ui/ModalIconHeader';
import ModalActions from '../../../components/ui/ModalActions';
import FormField from '../../../components/ui/FormField';
import PositionSelector from '../molecules/PositionSelector';
import RoleSelector from '../molecules/RoleSelector';
import {COLORS} from '../../../constants';
import useUserFormModal from '../hooks/useUserFormModal';

const avatarDefault = "https://www.shutterstock.com/image-vector/avatar-photo-default-user-icon-600nw-2558759027.jpg";

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-[9999] backdrop-blur-sm',
  scrollWrapper: 'w-full max-w-sm md:max-w-2xl mx-4 max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl',
  card: 'flex flex-col p-6 gap-3',
  avatarWrapper: 'flex justify-center mb-2',
  avatar: 'w-20 h-20 rounded-full object-cover border-4',
  title: 'text-2xl font-bold font-inter text-center mb-2',
  selectorGrid: 'grid grid-cols-1 md:grid-cols-2 gap-3',
  fieldsGrid: 'grid grid-cols-1 md:grid-cols-2 gap-3',
  errorMsg: 'text-xs font-inter italic text-center py-2 px-3 rounded-xl',
  cancelBtn: 'flex-1 py-3 px-8 rounded-xl font-bold font-nunito text-base cursor-pointer border-2 transition-colors',
};

const backdropVariants = {hidden: {opacity: 0}, visible: {opacity: 1}};
const cardVariants = {hidden: {opacity: 0, scale: 0.94, y: 8}, visible: {opacity: 1, scale: 1, y: 0}};

function UserFormModal({isOpen, onClose, onConfirm, title, btnLabel, formData, setFormData, positions, loading, error, fieldErrors = {}, setFieldErrors, selectedUser}) {
  const {
    roleOptions, selectedRole, roleMenuOpen, roleMenuPosition, roleTriggerRef, roleMenuRef,
    handleChange, handleToggleRoleMenu, handleSelectRole, onlyLettersRegex, onlyNumbersRegex,
  } = useUserFormModal(formData, setFormData, setFieldErrors);
  const isNew = title === 'Nuevo Usuario';
  const profilePhoto = selectedUser?.foto_perfil || null;
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className={styles.overlay} style={{backgroundColor: 'rgba(0,0,0,0.4)'}}
          variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" transition={{duration: 0.15}}>
          <motion.div className={styles.scrollWrapper} style={{backgroundColor: COLORS.background}}
            variants={cardVariants} initial="hidden" animate="visible" exit="hidden" transition={{duration: 0.22, ease: [0.22, 1, 0.36, 1]}}>
            <div className={styles.card}>
              {!isNew && profilePhoto ? (
                <div className={styles.avatarWrapper}>
                  <img src={profilePhoto} alt="foto perfil" className={styles.avatar} style={{borderColor: COLORS.primary}}
                    onError={(event) => {event.target.src = avatarDefault;}} />
                </div>
              ) : (<ModalIconHeader icon={User} backgroundColor={COLORS.backgroundHeader} color={COLORS.text} />)}
              <p className={styles.title} style={{color: COLORS.text}}>{title}</p>
              <div className={styles.selectorGrid}>
                <PositionSelector positions={positions} positionId={formData.id_cargo} error={fieldErrors.id_cargo}
                  onChange={(id) => handleChange('id_cargo', id)} />
                <RoleSelector roleOptions={roleOptions} selectedRole={selectedRole} open={roleMenuOpen} menuPosition={roleMenuPosition}
                  triggerRef={roleTriggerRef} menuRef={roleMenuRef} onToggle={handleToggleRoleMenu} onSelect={handleSelectRole} />
              </div>
              <div className={styles.fieldsGrid}>
                <FormField label="Nombre" placeholder="Juan" maxLength={30} value={formData.nombre} error={fieldErrors.nombre}
                  onChange={(event) => handleChange('nombre', event.target.value, onlyLettersRegex, 30)} />
                <FormField label="Apellido Paterno" placeholder="García" maxLength={30} value={formData.apellido_paterno} error={fieldErrors.apellido_paterno}
                  onChange={(event) => handleChange('apellido_paterno', event.target.value, onlyLettersRegex, 30)} />
                <FormField label="Apellido Materno (opcional)" placeholder="López" maxLength={30} value={formData.apellido_materno} error={fieldErrors.apellido_materno}
                  onChange={(event) => handleChange('apellido_materno', event.target.value, onlyLettersRegex, 30)} />
                <FormField label="Correo Corporativo" type="email" placeholder="juan@empresa.com" maxLength={100}
                  value={formData.email_corporativo} error={fieldErrors.email_corporativo}
                  onChange={(event) => handleChange('email_corporativo', event.target.value, null, 100)} />
                <FormField label="Teléfono (opcional)" placeholder="71234567" maxLength={8} value={formData.telefono} error={fieldErrors.telefono}
                  onChange={(event) => handleChange('telefono', event.target.value, onlyNumbersRegex, 8)} />
                <FormField label="N° Dependencia" placeholder="Ej: DEP-001" maxLength={50} value={formData.numero_dependencia} error={fieldErrors.numero_dependencia}
                  onChange={(event) => handleChange('numero_dependencia', event.target.value, null, 50)} />
                <FormField label="N° Sección" placeholder="Ej: SEC-01" maxLength={50} value={formData.numero_seccion} error={fieldErrors.numero_seccion}
                  onChange={(event) => handleChange('numero_seccion', event.target.value, null, 50)} />
                <FormField label="Carnet de Identidad (opcional)" placeholder="Ej: 1234567 LP" maxLength={20} value={formData.carnet_identidad} error={fieldErrors.carnet_identidad}
                  onChange={(event) => handleChange('carnet_identidad', event.target.value, null, 20)} />
                {isNew && (
                  <FormField label="Contraseña" type="password" placeholder="Mínimo 6 caracteres" value={formData.contrasenia} error={fieldErrors.contrasenia}
                    onChange={(event) => handleChange('contrasenia', event.target.value)} />
                )}
              </div>
              {error && <p className={styles.errorMsg} style={{color: COLORS.secondary, backgroundColor: COLORS.error}}>{error}</p>}
              <div className="flex gap-3 mt-2 justify-center">
                <button className={styles.cancelBtn} style={{borderColor: COLORS.primary, color: COLORS.primary, backgroundColor: 'transparent'}} onClick={onClose}>
                  Cancelar
                </button>
                <button className="flex-1 py-3 px-8 rounded-xl font-bold font-nunito text-base cursor-pointer transition-colors"
                  style={{backgroundColor: loading ? COLORS.fields : COLORS.secondary, color: COLORS.background, borderColor: loading ? COLORS.fields : COLORS.secondary, border: '2px solid'}}
                  onClick={onConfirm} disabled={loading}>
                  {loading ? 'Guardando...' : btnLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default UserFormModal;