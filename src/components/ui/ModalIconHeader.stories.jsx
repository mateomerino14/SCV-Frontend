import {Users, AlertTriangle, CheckCircle2} from 'lucide-react';
import ModalIconHeader from './ModalIconHeader';
import {COLORS} from '../../constants';

export default {
  title: 'UI/ModalIconHeader',
  component: ModalIconHeader,
  parameters: {
    docs: {
      description: {
        component: 'Ícono circular usado como encabezado de los modales (solicitudes, confirmaciones, éxito).',
      },
    },
  },
};

export const Neutral = {
  args: {icon: Users, backgroundColor: COLORS.background, color: COLORS.backgroundSecondary},
  decorators: [(Story) => <div style={{backgroundColor: COLORS.primary, padding: 16, borderRadius: 16}}><Story /></div>],
};

export const Warning = {
  args: {icon: AlertTriangle, backgroundColor: COLORS.background, color: COLORS.primary},
  decorators: [(Story) => <div style={{backgroundColor: COLORS.secondary, padding: 16, borderRadius: 16}}><Story /></div>],
};

export const Success = {
  args: {icon: CheckCircle2, backgroundColor: COLORS.background, color: '#000000'},
  decorators: [(Story) => <div style={{backgroundColor: COLORS.primary, padding: 16, borderRadius: 16}}><Story /></div>],
};
