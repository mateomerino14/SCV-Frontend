import DailyBreakdownCard from './DailyBreakdownCard';

export default {
  title: 'Trip/Molecules/DailyBreakdownCard',
  component: DailyBreakdownCard,
  parameters: {
    docs: {
      description: {
        component: 'Control diario de la rendición: una tarjeta por día con su barra por moneda (Bs y, en viajes internacionales, USD), el estado del día y el monto excedido.',
      },
    },
  },
  decorators: [(Story) => <div style={{width: 720, maxWidth: '100vw'}}><Story /></div>],
};

export const National = {
  args: {
    dailyRate: 250,
    defaultOpen: true,
    dailyBreakdown: [
      {fecha: '2026-10-13', montoBs: 140, montoUsd: 0},
      {fecha: '2026-10-14', montoBs: 215, montoUsd: 0},
      {fecha: '2026-10-15', montoBs: 320, montoUsd: 0},
    ],
  },
};

export const International = {
  args: {
    dailyRate: 250,
    dailyRateUsd: 80,
    isInternational: true,
    defaultOpen: true,
    justifiedDays: ['2026-10-21'],
    dailyBreakdown: [
      {fecha: '2026-10-20', montoBs: 180, montoUsd: 0},
      {fecha: '2026-10-21', montoBs: 0, montoUsd: 95},
      {fecha: '2026-10-22', montoBs: 60, montoUsd: 70},
      {fecha: '2026-10-23', montoBs: 290, montoUsd: 40},
    ],
  },
};

export const Collapsed = {
  args: {...International.args, defaultOpen: false},
};

export const InternationalOnlyBs = {
  name: 'Internacional con fondo solo en Bs',
  args: {
    dailyRate: 300,
    dailyRateUsd: 100,
    isInternational: true,
    defaultOpen: true,
    dailyBreakdown: [
      {fecha: '2026-10-20', montoBs: 180, montoUsd: 0, limiteBs: 300, limiteUsd: 100, soloBs: true, tipoCambio: null},
      {fecha: '2026-10-21', montoBs: 750, montoUsd: 0, limiteBs: 696, limiteUsd: 100, soloBs: true, tipoCambio: 6.96},
      {fecha: '2026-10-22', montoBs: 410, montoUsd: 0, limiteBs: 696, limiteUsd: 100, soloBs: true, tipoCambio: 6.96},
    ],
  },
};
