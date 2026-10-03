import {Mail} from 'lucide-react';
import {COLORS} from '../../../constants';

const styles = {
  wrapper: 'mt-3',
  empty: 'text-sm font-inter text-center rounded-xl px-3 py-3',
  item: 'rounded-xl p-3 mb-2',
  header: 'flex items-start gap-2',
  name: 'text-sm font-bold font-inter break-words',
  email: 'text-xs font-inter break-all',
  subject: 'text-xs font-bold font-inter uppercase mt-2',
  list: 'mt-1 pl-5 list-disc',
  line: 'text-sm font-inter',
};

function ReminderPreviewList({preview}) {
  if (preview.total === 0) {
    return (
      <p className={styles.empty} style={{backgroundColor: COLORS.backgroundHeader, color: COLORS.labels}}>
        Nadie tiene pendientes en este momento: no se enviaría ningún correo.
      </p>
    );
  }
  return (
    <div className={styles.wrapper}>
      <p className="text-xs font-inter mb-2" style={{color: COLORS.labels}}>
        Si se enviara ahora, {preview.total === 1 ? 'llegaría 1 correo' : `llegarían ${preview.total} correos`}:
      </p>
      {preview.mensajes.map((message) => (
        <div key={`${message.correo}-${message.asunto}`} className={styles.item} style={{backgroundColor: COLORS.backgroundHeader}}>
          <div className={styles.header}>
            <Mail size={16} style={{color: COLORS.primary, marginTop: 2, flexShrink: 0}} />
            <div className="min-w-0">
              <p className={styles.name} style={{color: COLORS.text}}>{message.nombre}</p>
              <p className={styles.email} style={{color: COLORS.labels}}>{message.correo}</p>
            </div>
          </div>
          <p className={styles.subject} style={{color: COLORS.title}}>{message.asunto}</p>
          <ul className={styles.list} style={{color: COLORS.text}}>
            {message.lineas.map((line) => <li key={line} className={styles.line}>{line}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default ReminderPreviewList;
