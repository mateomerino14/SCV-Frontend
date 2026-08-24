import {COLORS} from '../../constants';

const styles = {
  item: "flex flex-col gap-1 p-4 rounded-xl border-l-4",
  date: "text-xs font-inter",
  text: "text-sm font-inter leading-relaxed",
};

function CommentCard({date, text, backgroundColor, borderColor}) {
  return (
    <div className={styles.item} style={{backgroundColor, borderLeftColor: borderColor}}>
      <p className={styles.date} style={{color: COLORS.environmentTypesText}}>{date}</p>
      <p className={styles.text} style={{color: COLORS.text}}>{text}</p>
    </div>
  );
}

export default CommentCard;