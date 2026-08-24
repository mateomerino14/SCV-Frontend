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
  title: 'text-2xl font-bold font-inter text-center mb-5',
  grid: 'grid grid-cols-1 md:grid-cols-2 gap-3',
  errorMsg: 'text-red-600 text-sm font-inter italic text-center',
};

function UserFormModal({isOpen, onClose, onConfirm, title, btnLabel, formData, setFormData, positions, loading, error, fieldErrors = {}, setFieldErrors, selectedUser}) {
  const {
    roleOptions, selectedRole, roleMenuOpen, roleMenuPosition, roleTriggerRef, roleMenuRef,
    handleChange, handleToggleRoleMenu, handleSelectRole, onlyLettersRegex, onlyNumbersRegex,
  } = useUserFormModal(formData, setFormData, setFieldErrors);

  if (!isOpen) {
    return null;
  }

  const isNew = title === 'Nuevo Usuario';
  const profilePhoto = selectedUser?.foto_perfil || null;

  return (
    <div className={styles.overlay}>
      <div className={styles.scrollWrapper} style={{backgroundColor: COLORS.background}}>
        <div className={styles.card}>
          {!isNew && profilePhoto ? (
            <div className={styles.avatarWrapper}>
              <img src={profilePhoto} alt="foto perfil" className={styles.avatar} style={{borderColor: COLORS.primary}}
                onError={(event) => {event.target.src = avatarDefault;}} />
            </div>
          ) : (<ModalIconHeader icon={User} backgroundColor={COLORS.backgroundHeader} color={COLORS.text} />)}
          <p className={styles.title} style={{color: COLORS.text}}>{title}</p>
          <div className={styles.grid}>
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

            {isNew && (
              <FormField label="Contraseña" type="password" placeholder="Mínimo 6 caracteres" value={formData.contrasenia} error={fieldErrors.contrasenia}
                onChange={(event) => handleChange('contrasenia', event.target.value)} />
            )}
          </div>

          <div className={styles.grid}>
            <PositionSelector positions={positions} positionId={formData.id_cargo} error={fieldErrors.id_cargo}
              onChange={(id) => handleChange('id_cargo', id)} />
            <RoleSelector roleOptions={roleOptions} selectedRole={selectedRole} open={roleMenuOpen} menuPosition={roleMenuPosition}
              triggerRef={roleTriggerRef} menuRef={roleMenuRef} onToggle={handleToggleRoleMenu} onSelect={handleSelectRole} />
          </div>

          {error && <p className={styles.errorMsg}>{error}</p>}
          <ModalActions onCancel={onClose} onConfirm={onConfirm} confirmLabel={loading ? 'Guardando...' : btnLabel} loading={loading} />
        </div>
      </div>
    </div>
  );
}

export default UserFormModal;