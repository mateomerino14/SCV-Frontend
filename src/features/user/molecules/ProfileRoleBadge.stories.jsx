import ProfileRoleBadge from './ProfileRoleBadge';

export default {
  title: 'User/Molecules/ProfileRoleBadge',
  component: ProfileRoleBadge,
  parameters: {
    docs: {
      description: {
        component: 'Distintivo del rol del usuario en su perfil.',
      },
    },
  },
  args: {
    roleName: 'SUPERVISOR',
  },
};

export const Default = {};
