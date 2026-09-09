import {motion} from 'framer-motion';
import {COLORS} from '../../constants';

const styles = {
  card: "rounded-2xl p-4 mb-3 flex flex-col gap-3",
  line: "rounded-lg",
};

const shimmerTransition = {duration: 1.2, repeat: Infinity, ease: 'easeInOut'};

function SkeletonLine({width = '100%', height = 12}) {
  return (
    <motion.div className={styles.line} style={{width, height, backgroundColor: COLORS.dataFields}}
      animate={{opacity: [0.4, 0.9, 0.4]}} transition={shimmerTransition} />
  );
}

function SkeletonCard({lines = 3}) {
  return (
    <div className={styles.card} style={{backgroundColor: COLORS.background, border: `1px solid ${COLORS.dataFields}`}}>
      <SkeletonLine width="60%" height={14} />
      {Array.from({length: lines}).map((_, index) => (
        <SkeletonLine key={index} width={index === lines - 1 ? '40%' : '85%'} />
      ))}
    </div>
  );
}

export {SkeletonLine};
export default SkeletonCard;