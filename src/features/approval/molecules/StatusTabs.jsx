import {COLORS} from '../../../constants';

const styles = {
  row: "flex gap-2 overflow-x-auto pb-1",
  tab: "flex-1 py-1.5 px-3 rounded-full text-xs font-bold font-inter cursor-pointer border transition-colors whitespace-nowrap text-center",
};

function StatusTabs({tabs, activeTab, onChange}) {
  return (
    <div className={styles.row}>
      {tabs.map((tab) => (
        <button key={tab.valor} className={styles.tab} onClick={() => onChange(tab.valor)}
          style={{backgroundColor: activeTab === tab.valor ? COLORS.backgroundHeader : 'transparent', borderColor: activeTab === tab.valor ? COLORS.labels : COLORS.dataFields, color: activeTab === tab.valor ? COLORS.text : COLORS.labels}}>
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default StatusTabs;