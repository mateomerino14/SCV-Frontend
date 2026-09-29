import {statusColors} from '../../../constants/tripStatusColors';
import {statusLabels} from '../../../constants/tripStatusLabels';
const approverTripStatusConfig = {
  APROBADO_VIAJE: {label: statusLabels.APROBADO_VIAJE, ...statusColors.APROBADO_VIAJE},
  EN_REVISION_TESORERO: {label: statusLabels.EN_REVISION_TESORERO, ...statusColors.EN_REVISION_TESORERO},
  EN_CURSO: {label: statusLabels.EN_CURSO, ...statusColors.EN_CURSO},
  RECHAZADO: {label: statusLabels.RECHAZADO, ...statusColors.RECHAZADO},
};

export default approverTripStatusConfig;