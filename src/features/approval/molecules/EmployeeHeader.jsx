import {COLORS} from '../../../constants';
import StatusBadge from '../atoms/StatusBadge';

const avatarDefault = "https://www.shutterstock.com/image-vector/avatar-photo-default-user-icon-600nw-2558759027.jpg";

const styles = {
  headerRow: "flex items-center gap-3 mb-3",
  avatar: "w-12 h-12 rounded-full object-cover shrink-0",
  info: "flex flex-col flex-1 min-w-0",
  name: "text-sm font-semibold font-inter leading-tight truncate",
  position: "text-xs font-inter mt-0.5 truncate",
};

function EmployeeHeader({employee, statusLabel, statusBg, statusColor}) {
  return (
    <div className={styles.headerRow}>
      <img src={employee?.foto_perfil || avatarDefault} alt="empleado" className={styles.avatar} />
      <div className={styles.info}>
        <p className={styles.name} style={{color: COLORS.text}}>{employee?.nombre} {employee?.apellido_paterno}</p>
        <p className={styles.position} style={{color: COLORS.labels}}>{employee?.Cargo?.nombre}</p>
      </div>
      <StatusBadge label={statusLabel} backgroundColor={statusBg} color={statusColor} />
    </div>
  );
}

export default EmployeeHeader;