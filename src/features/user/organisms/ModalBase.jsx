const styles = {
  overlay: "fixed inset-0 flex items-center justify-center z-50",
  container: "rounded-2xl p-10 w-[90%] max-w-sm text-white text-center flex flex-col items-center gap-4 shadow-2xl",
};

function ModalBase({isOpen, children}) {
  if (!isOpen) {
    return null;
  }
  return (
    <div className={styles.overlay} style={{backgroundColor: 'rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(4px)'}}>
      <div className={styles.container} style={{backgroundColor: '#870002'}}>
        {children}
      </div>
    </div>
  );
}

export default ModalBase;