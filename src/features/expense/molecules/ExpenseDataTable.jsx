import {COLORS} from '../../../constants';

const styles = {
  wrapper: 'border rounded-xl overflow-hidden mt-2',
  header: 'grid gap-1 font-bold uppercase py-2.5 text-xs font-nunito text-center',
  row: 'grid gap-1 py-2.5 items-center text-sm font-inter text-center border-b',
  total: 'flex justify-between items-center px-3 py-3',
};

function ExpenseDataTable({columns, gridTemplate, rows, renderRow, totalLabel, totalValue, headerBg = COLORS.title, scroll}) {
  return (
    <div className={styles.wrapper} style={{borderColor: COLORS.dataFields}}>
      <div className={styles.header} style={{color: COLORS.background, backgroundColor: headerBg, gridTemplateColumns: gridTemplate}}>
        {columns.map((column) => <span key={column}>{column}</span>)}
      </div>
      <div style={scroll ? {maxHeight: 240, overflowY: 'scroll', scrollbarGutter: 'stable'} : undefined}>
        {rows.map((row, index) => (
          <div key={index} className={styles.row} style={{borderColor: COLORS.dataFields, backgroundColor: index % 2 === 0 ? COLORS.background : COLORS.backgroundHeader, gridTemplateColumns: gridTemplate}}>
            {renderRow(row, index)}
          </div>
        ))}
      </div>
      <div className={styles.total} style={{backgroundColor: headerBg}}>
        <span className="text-xs font-bold font-inter uppercase" style={{color: COLORS.background}}>Total</span>
        <span className="text-sm font-bold font-inter" style={{color: COLORS.background}}>{totalValue}</span>
      </div>
    </div>
  );
}

export default ExpenseDataTable;