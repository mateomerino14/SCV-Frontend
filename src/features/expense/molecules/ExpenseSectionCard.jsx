import {COLORS} from '../../../constants';

const styles = {
  card: 'rounded-2xl p-5 mb-4 shadow-md border',
  title: 'text-xs font-bold font-inter uppercase mb-4 flex items-center gap-2',
};

function ExpenseSectionCard({icon: Icon, title, children}) {
  return (
    <div className={styles.card} style={{backgroundColor: COLORS.background, borderColor: COLORS.dataFields}}>
      <p className={styles.title} style={{color: COLORS.labels}}>
        <Icon size={14} />
        {title}
      </p>
      {children}
    </div>
  );
}

export default ExpenseSectionCard;