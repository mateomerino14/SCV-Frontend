import {Clock, CheckCircle, Wallet, Plane, ClipboardCheck, Wine, Award, XCircle, FileCheck, Receipt} from 'lucide-react';
import {statusColors} from '../../../constants/tripStatusColors';
import {statusLabels} from '../../../constants/tripStatusLabels';

const approvalPhaseStats = [
  {key: 'viajesEnRevisionViaje', label: statusLabels.EN_REVISION_VIAJE, icon: Clock, ...statusColors.EN_REVISION_VIAJE},
  {key: 'viajesAprViaje', label: statusLabels.APROBADO_VIAJE, icon: CheckCircle, ...statusColors.APROBADO_VIAJE},
  {key: 'viajesEnRevisionTesorero', label: statusLabels.EN_REVISION_TESORERO, icon: Wallet, ...statusColors.EN_REVISION_TESORERO},
];

const expensePhaseStats = [
  {key: 'viajesEnCurso', label: statusLabels.EN_CURSO, icon: Plane, ...statusColors.EN_CURSO},
  {key: 'viajesEnRevision', label: statusLabels.EN_REVISION, icon: Clock, ...statusColors.EN_REVISION},
  {key: 'viajesEnRevisionAprobador', label: statusLabels.EN_REVISION_APROBADOR, icon: Wine, ...statusColors.EN_REVISION_APROBADOR},
  {key: 'viajesAprSupervisor', label: statusLabels.APROBADO_SUPERVISOR, icon: ClipboardCheck, ...statusColors.APROBADO_SUPERVISOR},
  {key: 'viajesAprobados', label: statusLabels.APROBADO_FINAL, icon: Award, ...statusColors.APROBADO_FINAL},
];

const rejectedStat = {key: 'viajesRechazados', label: statusLabels.RECHAZADO, icon: XCircle, ...statusColors.RECHAZADO};
const approvalPhaseTotal = {icon: FileCheck, color: '#5b00a0', bg: '#e8d5ff'};
const expensePhaseTotal = {icon: Receipt, color: '#000a65', bg: '#85aff3ab'};

export {approvalPhaseStats, expensePhaseStats, rejectedStat, approvalPhaseTotal, expensePhaseTotal};