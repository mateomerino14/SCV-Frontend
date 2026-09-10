import SkeletonCard from './SkeletonCard';

function SkeletonList({count = 3, lines = 3}) {
  return (
    <div>
      {Array.from({length: count}).map((_, index) => (
        <SkeletonCard key={index} lines={lines} />
      ))}
    </div>
  );
}

export default SkeletonList;