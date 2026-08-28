import {useState} from 'react';

function useExpenseObservations() {
  const [showModal, setShowModal] = useState(false);

  const open = () => setShowModal(true);
  const close = () => setShowModal(false);

  return {showModal, open, close};
}

export default useExpenseObservations;