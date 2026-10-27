import {COLORS} from '../../../constants';
import {documentSources, systemReceiptNote} from '../../../utils/documentNumber';

const styles = {
  plain: 'font-inter',
  system: 'inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-inter font-bold',
  tag: 'text-[9px] uppercase',
};

function DocumentNumberBadge({number, source}) {
  if (!number) {
    return <span className={styles.plain} style={{color: COLORS.labels}}>—</span>;
  }
  if (source !== documentSources.system) {
    return <span className={styles.plain} style={{color: COLORS.text}}>{number}</span>;
  }
  return (
    <span className={styles.system} title={systemReceiptNote} style={{backgroundColor: COLORS.systemReceipt, color: COLORS.systemReceiptText}}>
      {number}
      <span className={styles.tag}>Sistema</span>
    </span>
  );
}

export default DocumentNumberBadge;
