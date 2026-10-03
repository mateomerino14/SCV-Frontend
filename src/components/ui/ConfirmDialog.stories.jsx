import {useState} from 'react';
import {Trash2, LogOut} from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';
import Button from './Button';
import {COLORS} from '../../constants';

export default {
  title: 'UI/ConfirmDialog',
  component: ConfirmDialog,
  parameters: {
    docs: {
      description: {
        component: 'Modal de confirmación para acciones destructivas o irreversibles (eliminar, cerrar sesión, etc). Requiere control externo de apertura/cierre.',
      },
    },
  },
};

function Template(args) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <Button text="Abrir diálogo" onClick={() => setIsOpen(true)} />
      <ConfirmDialog {...args} isOpen={isOpen} onCancel={() => setIsOpen(false)} onConfirm={() => setIsOpen(false)} />
    </div>
  );
}

export const Destructive = {
  render: Template,
  args: {
    icon: Trash2,
    iconColor: COLORS.secondary,
    iconBackgroundColor: COLORS.error,
    title: '¿Eliminar gasto?',
    message: 'Esta acción no se puede deshacer.',
    confirmText: 'Eliminar',
  },
};

export const WithWarning = {
  render: Template,
  args: {
    icon: LogOut,
    iconColor: COLORS.primary,
    iconBackgroundColor: COLORS.backgroundHeader,
    title: 'Cerrar Sesión',
    message: '¿Estás seguro de que quieres salir?',
    warning: 'Perderás los cambios no guardados.',
    confirmText: 'Cerrar Sesión',
  },
};

export const Compact = {
  render: Template,
  args: {
    icon: Trash2,
    iconColor: COLORS.secondary,
    iconBackgroundColor: COLORS.error,
    title: '¿Eliminar comentario?',
    message: 'Esta acción no se puede deshacer.',
    confirmText: 'Eliminar',
    compact: true,
  },
};
