import {useState} from 'react';

const alreadyTakenMessages = ['ya fue tomado', 'siendo revisado'];

function useTakeInbox(takeReview, reload, setActionError) {
  const [taking, setTaking] = useState(null);
  const [alreadyTaken, setAlreadyTaken] = useState(false);

  const handleTake = async (tripId) => {
    setTaking(tripId);
    const data = await takeReview(tripId);
    setTaking(null);
    await reload();
    if (!data.error) {
      return;
    }
    if (alreadyTakenMessages.some((message) => data.error.includes(message))) {
      setAlreadyTaken(true);
    }
    else {
      setActionError(data.error);
    }
  };

  return {taking, alreadyTaken, closeAlreadyTakenModal: () => setAlreadyTaken(false), handleTake};
}

export default useTakeInbox;
