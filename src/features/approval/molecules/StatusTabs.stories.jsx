import {useState} from 'react';
import StatusTabs from './StatusTabs';

export default {
  title: 'Approval/Molecules/StatusTabs',
  component: StatusTabs,
  parameters: {
    docs: {
      description: {
        component: 'Pestañas de estado de las listas de revisión (Pendientes, Aprobados, Rechazados).',
      },
    },
  },
};

const tabs = [
  {valor: 'pendientes', label: 'Pendientes'},
  {valor: 'aprobados', label: 'Aprobados'},
  {valor: 'rechazados', label: 'Rechazados'},
];

export const Interactive = {
  render: () => {
    const [activeTab, setActiveTab] = useState('pendientes');
    return (
      <div style={{width: 380}}>
        <StatusTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>
    );
  },
};
