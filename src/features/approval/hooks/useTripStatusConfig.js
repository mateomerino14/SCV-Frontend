import {statusColors} from '../../../constants/tripStatusColors';
import {statusLabels} from '../../../constants/tripStatusLabels';
import {COLORS} from '../../../constants';

export const tripStatusConfig = {
  EN_REVISION_VIAJE: {label: statusLabels.EN_REVISION_VIAJE, ...statusColors.EN_REVISION_VIAJE},
  APROBADO_VIAJE: {label: statusLabels.APROBADO_VIAJE, ...statusColors.APROBADO_VIAJE},
  EN_REVISION_TESORERO: {label: statusLabels.EN_REVISION_TESORERO, ...statusColors.EN_REVISION_TESORERO},
  EN_CURSO: {label: statusLabels.EN_CURSO, ...statusColors.EN_CURSO},
  EN_REVISION: {label: statusLabels.EN_REVISION, ...statusColors.EN_REVISION},
  EN_REVISION_APROBADOR: {label: statusLabels.EN_REVISION_APROBADOR, ...statusColors.EN_REVISION_APROBADOR},
  APROBADO_SUPERVISOR: {label: statusLabels.APROBADO_SUPERVISOR, ...statusColors.APROBADO_SUPERVISOR},
  APROBADO_FINAL: {label: statusLabels.APROBADO_FINAL, ...statusColors.APROBADO_FINAL},
  RECHAZADO: {label: statusLabels.RECHAZADO, ...statusColors.RECHAZADO},
};

export const reviewStatusConfig = {
  CONFORME: {label: 'Conforme', bg: COLORS.successBackground, color: COLORS.success},
  OBSERVADO: {label: 'Observado', bg: COLORS.warningBackground, color: COLORS.warningText},
};

export const alertConfig = {
  EXCESO_PRESUPUESTO: {label: 'Exceso Detectado', color: COLORS.warningText, bg: COLORS.warningBackground},
  ALCOHOL: {label: 'No deducible', color: COLORS.dangerText, bg: COLORS.dangerBackground},
};
