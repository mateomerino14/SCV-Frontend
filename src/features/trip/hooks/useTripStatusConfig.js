import {COLORS} from '../../../constants';
import {statusColors} from '../../../constants/tripStatusColors';

const tripStatusConfig = {
  BORRADOR: {label: 'Borrador', bg: COLORS.dataFields, color: COLORS.text},
  EN_REVISION_VIAJE: {label: 'En Revisión Previa', ...statusColors.EN_REVISION_VIAJE},
  APROBADO_VIAJE: {label: 'Esperando Aprobador', ...statusColors.APROBADO_VIAJE},
  EN_REVISION_TESORERO: {label: 'Esperando Fondos', ...statusColors.EN_REVISION_TESORERO},
  EN_CURSO: {label: 'En Curso', bg: COLORS.primary, color: COLORS.background},
  EN_REVISION: {label: 'En Revisión', ...statusColors.EN_REVISION},
  EN_REVISION_APROBADOR: {label: 'Revisión Adicional', ...statusColors.EN_REVISION_APROBADOR},
  APROBADO_SUPERVISOR: {label: 'Apr. Supervisor', ...statusColors.APROBADO_SUPERVISOR},
  APROBADO_FINAL: {label: 'Aprobado', ...statusColors.APROBADO_FINAL},
  RECHAZADO: {label: 'Rechazado', ...statusColors.RECHAZADO},
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