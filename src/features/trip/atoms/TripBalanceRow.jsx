const styles = {
  row: 'flex justify-between items-center py-2',
  label: 'text-sm font-inter',
  value: 'text-sm font-bold font-inter',
};

function TripBalanceRow({label, value, color}) {
  return (
    <div className={styles.row}>
      <p className={styles.label} style={{color}}>{label}</p>
      <p className={styles.value} style={{color}}>{value}</p>
    </div>
  );
}

export default TripBalanceRow;