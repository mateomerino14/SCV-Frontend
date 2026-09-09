const styles = {
  wrapper: 'rounded-full p-4 self-center',
};

function ModalIconHeader({icon: Icon, size = 40, backgroundColor, color}) {
  return (
    <div className={styles.wrapper} style={{backgroundColor}}>
      <Icon size={size} style={{color}} />
    </div>
  );
}

export default ModalIconHeader;