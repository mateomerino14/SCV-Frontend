import {COLORS} from '../../../constants';
import {statusColors} from '../../../constants/tripStatusColors';
import {statusLabels} from '../../../constants/tripStatusLabels';

const tripStatusConfig = {
  BORRADOR: {label: statusLabels.BORRADOR, ...statusColors.BORRADOR},
  EN_REVISION_VIAJE: {label: statusLabels.EN_REVISION_VIAJE, ...statusColors.EN_REVISION_VIAJE},
  APROBADO_VIAJE: {label: statusLabels.APROBADO_VIAJE, ...statusColors.APROBADO_VIAJE},
  EN_REVISION_TESORERO: {label: statusLabels.EN_REVISION_TESORERO, ...statusColors.EN_REVISION_TESORERO},
  EN_CURSO: {label: statusLabels.EN_CURSO, bg: COLORS.primary, color: COLORS.background},
  EN_REVISION: {label: statusLabels.EN_REVISION, ...statusColors.EN_REVISION},
  EN_REVISION_APROBADOR: {label: statusLabels.EN_REVISION_APROBADOR, ...statusColors.EN_REVISION_APROBADOR},
  APROBADO_SUPERVISOR: {label: statusLabels.APROBADO_SUPERVISOR, ...statusColors.APROBADO_SUPERVISOR},
  APROBADO_FINAL: {label: statusLabels.APROBADO_FINAL, ...statusColors.APROBADO_FINAL},
  RECHAZADO: {label: statusLabels.RECHAZADO, ...statusColors.RECHAZADO},
};

const tripStatusMessages = {
  EN_REVISION_VIAJE: 'Tu viaje está siendo revisado por el supervisor',
  APROBADO_VIAJE: 'Viaje aprobado por supervisor, esperando aprobador',
  EN_REVISION_TESORERO: 'Tu viaje fue aprobado y está esperando la asignación de fondos por tesorería',
  EN_CURSO: 'Viaje aprobado — registra tus gastos',
  EN_REVISION: 'Gastos enviados a revisión',
  EN_REVISION_APROBADOR: 'Tu rendición contiene alcohol y está en revisión adicional del aprobador',
  APROBADO_SUPERVISOR: 'Gastos aprobados por supervisor — en espera de revisión final',
  APROBADO_FINAL: 'Este viaje fue aprobado definitivamente',
  RECHAZADO: 'Este viaje fue rechazado',
};

export {tripStatusConfig, tripStatusMessages};