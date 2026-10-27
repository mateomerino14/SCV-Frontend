import Button from './Button';

const styles = {
  row: 'flex gap-3 mt-2 justify-center',
};

function ModalActions({onCancel, onConfirm, confirmLabel, loading, cancelLabel = 'Cancelar', hideConfirm, confirmDisabled, onLight = false}) {
  let cancelVariant = 'secondary';
  if (onLight) {
    cancelVariant = 'outline';
  }
  return (
    <div className={styles.row}>
      <Button text={cancelLabel} variant={cancelVariant} onClick={onCancel} disabled={loading} />
      {!hideConfirm && <Button text={confirmLabel} variant="primary" onClick={onConfirm} disabled={loading || confirmDisabled} />}
    </div>
  );
}

export default ModalActions;