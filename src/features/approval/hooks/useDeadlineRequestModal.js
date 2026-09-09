import {useState, useEffect} from 'react';

const maxLength = 500;

function useDeadlineRequestModal(isOpen, onConfirm) {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (isOpen) {
      setReason('');
    }
  }, [isOpen]);
  
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