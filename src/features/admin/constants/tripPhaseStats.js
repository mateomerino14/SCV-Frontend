import {Clock, CheckCircle, Wallet, Plane, ClipboardCheck, Wine, Award, XCircle, FileCheck, Receipt} from 'lucide-react';
import {COLORS} from '../../../constants';
import {statusColors} from '../../../constants/tripStatusColors';

const approvalPhaseStats = [
  {key: 'viajesEnRevisionViaje', label: 'Revisión de Supervisor', icon: Clock, ...statusColors.EN_REVISION_VIAJE},
  {key: 'viajesAprViaje', label: 'Esperando Aprobación', icon: CheckCircle, ...statusColors.APROBADO_VIAJE},
  {key: 'viajesEnRevisionTesorero', label: 'Esperando Fondos', icon: Wallet, ...statusColors.EN_REVISION_TESORERO},
];

const expensePhaseStats = [
  {key: 'viajesEnCurso', label: 'Registrando Gastos', icon: Plane, color: COLORS.primary, bg: COLORS.error},
  {key: 'viajesEnRevision', label: 'Revisión de Gastos', icon: Clock, ...statusColors.EN_REVISION},
  {key: 'viajesEnRevisionAprobador', label: 'Revisión por Alcohol', icon: Wine, ...statusColors.EN_REVISION_APROBADOR},
  {key: 'viajesAprSupervisor', label: 'Apr. Preliminar', icon: ClipboardCheck, ...statusColors.APROBADO_SUPERVISOR},
  {key: 'viajesAprobados', label: 'Rendición Aprobada', icon: Award, ...statusColors.APROBADO_FINAL},
];

const rejectedStat = {key: 'viajesRechazados', label: 'Rechazados', icon: XCircle, ...statusColors.RECHAZADO};
const approvalPhaseTotal = {icon: FileCheck, color: '#5b00a0', bg: '#e8d5ff'};
const expensePhaseTotal = {icon: Receipt, color: '#000a65', bg: '#85aff3ab'};

export {approvalPhaseStats, expensePhaseStats, rejectedStat, approvalPhaseTotal, expensePhaseTotal};