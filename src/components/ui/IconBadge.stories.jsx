import {Wine, CheckCircle, AlertTriangle} from 'lucide-react';
import IconBadge from './IconBadge';

export default {
  title: 'UI/IconBadge',
  component: IconBadge,
  parameters: {
    docs: {
      description: {
        component: 'Distintivo pequeño con ícono y texto, usado para alertas de revisión (exceso de presupuesto, alcohol, conforme).',
      },
    },
  },
};

export const Alcohol = {
  args: {icon: Wine, label: 'ALCOHOL', color: '#721c24', backgroundColor: '#f8d7da'},
};

export const Conforme = {
  args: {icon: CheckCircle, label: 'CONFORME', color: '#155724', backgroundColor: '#d4edda'},
};

export const ExcesoPresupuesto = {
  args: {icon: AlertTriangle, label: 'EXCESO DE PRESUPUESTO', color: '#856404', backgroundColor: '#fef3cd'},
};
