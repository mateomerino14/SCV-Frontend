import {useState} from 'react';

const maxLength = 500;

function useDeadlineRequestModal(isOpen, onConfirm) {
  const [reason, setReason] = useState('');
  const [wasOpen, setWasOpen] = useState(isOpen);

  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) {
      setReason('');
    }
  }

  const exceedsLimit = reason.length > maxLength;
  const handleConfirm = () => {
    if (!reason.trim() || exceedsLimit) {
      return;
    }
    onConfirm(reason.trim());
  };
  return {reason, setReason, maxLength, exceedsLimit, handleConfirm};
}

export default useDeadlineRequestModal;