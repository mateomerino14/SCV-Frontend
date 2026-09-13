import CommentCard from './CommentCard';
import {COLORS} from '../../constants';

export default {
  title: 'UI/CommentCard',
  component: CommentCard,
  parameters: {
    docs: {
      description: {
        component: 'Tarjeta que muestra una observación o justificación registrada durante una revisión, con acciones opcionales de editar/eliminar.',
      },
    },
  },
  args: {
    date: '12 sep 2026, 14:30',
    text: 'Falta el comprobante de la factura de hotel del día 3.',
    backgroundColor: COLORS.backgroundHeader,
    borderColor: COLORS.secondary,
  },
};

export const Default = {};

export const Compact = {
  args: {compact: true, backgroundColor: 'rgba(255,255,255,0.15)'},
  decorators: [(Story) => <div style={{backgroundColor: COLORS.primary, padding: 16, borderRadius: 16}}><Story /></div>],
};

export const CompactWithActions = {
  args: {compact: true, backgroundColor: 'rgba(255,255,255,0.15)', onEdit: () => {}, onDelete: () => {}},
  decorators: [(Story) => <div style={{backgroundColor: COLORS.primary, padding: 16, borderRadius: 16}}><Story /></div>],
};
