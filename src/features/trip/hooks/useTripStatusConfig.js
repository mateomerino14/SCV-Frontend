import {COLORS} from '../../../constants';

const tripStatusConfig = {
  BORRADOR: {label: 'Borrador', bg: COLORS.dataFields, color: COLORS.text},
  EN_REVISION_VIAJE: {label: 'En Revisión Previa', bg: '#e8d5ff', color: '#5b00a0'},
  APROBADO_VIAJE: {label: 'Esperando Aprobador', bg: '#ffd700aa', color: '#7a5900'},
  EN_REVISION_TESORERO: {label: 'Esperando Fondos', bg: '#ffd8a8aa', color: '#8a4b00'},
  EN_CURSO: {label: 'En Curso', bg: COLORS.primary, color: COLORS.background},
  EN_REVISION: {label: 'En Revisión', bg: '#85aff3ab', color: '#000a65'},
  APROBADO_SUPERVISOR: {label: 'Apr. Supervisor', bg: '#ffd700aa', color: '#7a5900'},
  APROBADO_FINAL: {label: 'Aprobado', bg: '#aafac9a2', color: '#008330'},
  RECHAZADO: {label: 'Rechazado', bg: '#ffa7a8aa', color: '#500203'},
};

const tripStatusMessages = {
  EN_REVISION_VIAJE: 'Tu viaje está siendo revisado por el supervisor',
  APROBADO_VIAJE: 'Viaje aprobado por supervisor, esperando aprobador',
  EN_REVISION_TESORERO: 'Tu viaje fue aprobado y está esperando la asignación de fondos por tesorería',
  EN_CURSO: 'Viaje aprobado — registra tus gastos',
  EN_REVISION: 'Gastos enviados a revisión',
  APROBADO_SUPERVISOR: 'Gastos aprobados por supervisor — en espera de revisión final',
  APROBADO_FINAL: 'Este viaje fue aprobado definitivamente',
  RECHAZADO: 'Este viaje fue rechazado',
};

export {tripStatusConfig, tripStatusMessages};