const styles = {
  badge: 'inline-flex items-center gap-1 text-xs font-bold font-inter px-2 py-0.5 rounded-lg w-fit',
};

function IconBadge({icon: Icon, label, color, backgroundColor, size = 10}) {
  return (
    <span className={styles.badge} style={{backgroundColor, color}}>
      <Icon size={size} />
      {label}
    </span>
  );
}

export default IconBadge;