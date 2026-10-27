import {useState} from 'react';
import ReminderTimesPicker from './ReminderTimesPicker';

export default {
  title: 'Admin/Molecules/ReminderTimesPicker',
  component: ReminderTimesPicker,
  parameters: {
    docs: {
      description: {
        component: 'Horas de envío de los recordatorios: cuadrícula de horas frecuentes que se marcan con un toque, hasta el máximo, y «Otra hora» para una distinta.',
      },
    },
  },
};

export const Interactive = {
  render: () => {
    const [times, setTimes] = useState(['08:00', '16:00']);
    const [newTime, setNewTime] = useState('');
    const toggle = (time) => {
      if (times.includes(time)) {
        setTimes(times.filter((item) => item !== time));
      }
      else {
        setTimes([...times, time].sort());
      }
    };
    const add = () => {
      if (newTime && !times.includes(newTime)) {
        setTimes([...times, newTime].sort());
      }
      setNewTime('');
    };
    return (
      <div style={{width: 360}}>
        <ReminderTimesPicker times={times} maxTimes={4} newTime={newTime} setNewTime={setNewTime} onToggleTime={toggle} onAddTime={add} />
      </div>
    );
  },
};
