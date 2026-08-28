import Button from './Button';

const styles = {
  row: 'flex gap-3 mt-2 justify-center',
};

function ModalActions({onCancel, onConfirm, confirmLabel, loading, cancelLabel = 'Cancelar', hideConfirm}) {
  return (
    <div className={styles.row}>
      <Button text={cancelLabel} variant="secondary" onClick={onCancel} disabled={loading} />
      {!hideConfirm && <Button text={confirmLabel} variant="primary" onClick={onConfirm} disabled={loading} />}
    </div>
  );
}

export default ModalActions;