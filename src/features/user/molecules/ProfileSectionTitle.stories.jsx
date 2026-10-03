import ProfileSectionTitle from './ProfileSectionTitle';

export default {
  title: 'User/Molecules/ProfileSectionTitle',
  component: ProfileSectionTitle,
  parameters: {
    docs: {
      description: {
        component: 'Título de sección del perfil con acento de color y línea divisoria.',
      },
    },
  },
  decorators: [(Story) => <div style={{width: 340}}><Story /></div>],
  args: {
    children: 'Información Personal',
  },
};

export const Default = {};
