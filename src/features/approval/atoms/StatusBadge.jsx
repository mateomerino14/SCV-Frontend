const styles = {
  badge: "text-xs font-bold font-inter px-2 py-1 rounded-xl text-center whitespace-nowrap",
};

function StatusBadge({label, backgroundColor, color}) {
  return <span className={styles.badge} style={{backgroundColor, color}}>{label}</span>;
}

export default StatusBadge;