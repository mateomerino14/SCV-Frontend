const styles = {
  row: "flex justify-between items-center py-3 border-b",
};

function TripBudgetRow({label, value, borderColor}) {
  return (
    <div className={styles.row} style={{borderColor}}>
      <span className="text-sm font-inter opacity-80 font-semibold">{label}:</span>
      <span className="text-sm font-nunito">{value}</span>
    </div>
  );
}

export default TripBudgetRow;