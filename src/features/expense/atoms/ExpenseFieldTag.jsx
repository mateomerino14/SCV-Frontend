import {COLORS} from '../../../constants';

function ExpenseFieldTag({icon: Icon, text, color}) {
  return (
    <span style={{display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: COLORS.labels, fontFamily: 'Inter'}}>
      <Icon size={11} style={{color}} />
      {text}
    </span>
  );
}

export default ExpenseFieldTag;