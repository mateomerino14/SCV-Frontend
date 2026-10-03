import PageHeader from './PageHeader';

export default {
  title: 'UI/PageHeader',
  component: PageHeader,
  parameters: {
    docs: {
      description: {
        component: 'Encabezado estándar de página: título grande y subtítulo descriptivo. Usado en las 23 páginas principales del sistema, reemplazando el patrón repetido de planLabel + título suelto.',
      },
    },
  },
};

export const Default = {
  args: {
    title: 'Mis Viajes',
    subtitle: 'Gestiona tus viajes y rinde tus gastos.',
  },
};

export const WithoutSubtitle = {
  args: {
    title: 'Dashboard',
  },
};
