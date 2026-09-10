const styles = {
  errorMsg: 'mt-3 text-xs font-inter italic text-center py-2 px-3 rounded-xl',
  successMsg: 'mt-3 text-sm font-inter text-center py-2 px-3 rounded-xl',
};

function InlineAlert({type = 'error', children}) {
  if (type === 'success') {
    return <p className={styles.successMsg} style={{color: '#155724', backgroundColor: '#d4edda'}}>{children}</p>;
  }
  return <p className={styles.errorMsg} style={{color: '#870002', backgroundColor: '#ffe1e2aa'}}>{children}</p>;
}

export default InlineAlert;