import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer} from 'recharts';
import {COLORS} from '../../../constants';
import TripStatCard from '../molecules/TripStatCard';

const styles = {
  wrapper: 'mb-6',
  header: 'flex items-baseline justify-between mb-3',
  title: 'text-sm font-bold font-inter uppercase',
  total: 'text-xs font-inter',
  grid: 'grid grid-cols-2 md:grid-cols-3 gap-3 mb-4',
  chartCard: 'rounded-2xl p-4 shadow-sm',
};

function TripPhaseSection({title, stats, data, showChart}) {
  const chartData = stats.map((stat) => ({name: stat.label, valor: data?.[stat.key] || 0, fill: stat.color}));
  const total = stats.reduce((sum, stat) => sum + (data?.[stat.key] || 0), 0);
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <p className={styles.title} style={{color: COLORS.labels}}>{title}</p>
        <p className={styles.total} style={{color: COLORS.labels}}>{total} viaje{total !== 1 ? 's' : ''}</p>
      </div>
      <div className={styles.grid}>
        {stats.map((stat) => (
          <TripStatCard key={stat.key} icon={stat.icon} label={stat.label} value={data?.[stat.key]} color={stat.color} bg={stat.bg} />
        ))}
      </div>
      {showChart && total > 0 && (
        <div className={styles.chartCard} style={{backgroundColor: COLORS.backgroundHeader}}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.dataFields} />
              <XAxis dataKey="name" tick={{fontSize: 9, fontFamily: 'Inter', fill: COLORS.labels}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize: 10, fontFamily: 'Inter', fill: COLORS.labels}} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip formatter={(value) => [`${value} viajes`]}
                contentStyle={{backgroundColor: COLORS.background, border: `1px solid ${COLORS.dataFields}`, borderRadius: 12, fontSize: 12, fontFamily: 'Inter'}} />
              <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default TripPhaseSection;