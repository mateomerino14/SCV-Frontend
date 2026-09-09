import {Clock, CheckCircle, Wallet, Plane, ClipboardCheck, ShieldCheck, Award, XCircle, FileCheck, Receipt} from 'lucide-react';
import {COLORS} from '../../../constants';

const approvalPhaseStats = [
  {key: 'viajesEnRevisionViaje', label: 'Revisión de Supervisor', icon: Clock, color: '#5b00a0', bg: '#e8d5ff'},
  {key: 'viajesAprViaje', label: 'Esperando Aprobación', icon: CheckCircle, color: '#7a5900', bg: '#ffd700aa'},
  {key: 'viajesEnRevisionTesorero', label: 'Esperando Fondos', icon: Wallet, color: '#8a4b00', bg: '#ffd8a8aa'},
];

const expensePhaseStats = [
  {key: 'viajesEnCurso', label: 'Registrando Gastos', icon: Plane, color: COLORS.primary, bg: COLORS.error},
  {key: 'viajesEnRevision', label: 'Revisión de Gastos', icon: Clock, color: '#000a65', bg: '#85aff3ab'},
  {key: 'viajesAprSupervisor', label: 'Apr. por Supervisor', icon: ClipboardCheck, color: '#7a5900', bg: '#ffd700aa'},
  {key: 'viajesAprAprobador', label: 'Apr. por Aprobador', icon: ShieldCheck, color: '#000a65', bg: '#85aff3ab'},
  {key: 'viajesAprobados', label: 'Rendición Aprobada', icon: Award, color: '#155724', bg: '#d4edda'},
];

const rejectedStat = {key: 'viajesRechazados', label: 'Rechazados', icon: XCircle, color: '#500203', bg: '#ffa7a8aa'};
const approvalPhaseTotal = {icon: FileCheck, color: '#5b00a0', bg: '#e8d5ff'};
const expensePhaseTotal = {icon: Receipt, color: '#000a65', bg: '#85aff3ab'};

export {approvalPhaseStats, expensePhaseStats, rejectedStat, approvalPhaseTotal, expensePhaseTotal};