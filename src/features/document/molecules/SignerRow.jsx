import {PenLine, Bot} from 'lucide-react';
import {COLORS} from '../../../constants';

const styles = {
  row: 'flex items-start gap-3 py-2.5',
  icon: 'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
  info: 'flex flex-col min-w-0',
  stage: 'text-[11px] font-bold font-inter uppercase',
  name: 'text-sm font-bold font-inter',
  detail: 'text-xs font-inter',
};

const formatDateTime = (value) => new Date(value).toLocaleString('es-BO', {timeZone: 'America/La_Paz', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'});

function SignerRow({signer}) {
  let Icon = PenLine;
  let detail = `Firmó el ${formatDateTime(signer.fecha)}`;
  if (signer.automatica) {
    Icon = Bot;
    detail = `Aprobación automática el ${formatDateTime(signer.fecha)}`;
  }
  return (
    <div className={styles.row}>
      <span className={styles.icon} style={{backgroundColor: COLORS.backgroundHeader}}>
        <Icon size={15} style={{color: COLORS.primary}} />
      </span>
      <div className={styles.info}>
        <span className={styles.stage} style={{color: COLORS.labels}}>{signer.etapa}</span>
        <span className={styles.name} style={{color: COLORS.text}}>{signer.nombre}</span>
        {signer.cargo && <span className={styles.detail} style={{color: COLORS.labels}}>{signer.cargo}</span>}
        <span className={styles.detail} style={{color: COLORS.labels}}>{detail}</span>
      </div>
    </div>
  );
}

export default SignerRow;
