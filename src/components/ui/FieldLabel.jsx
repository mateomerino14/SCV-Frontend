import {COLORS} from '../../constants';

function FieldLabel({text, required = false, className, color = COLORS.labels}) {
  return (
    <p className={className} style={{color}}>
      {text}
      {required && <span style={{color: COLORS.secondary}}> *</span>}
    </p>
  );
}

export default FieldLabel;
