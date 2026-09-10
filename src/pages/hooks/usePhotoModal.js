import {useState} from 'react';

function usePhotoModal(onChangePhoto, onRemovePhoto, reloadUser) {
  const [showModal, setShowModal] = useState(false);
  const open = () => setShowModal(true);
  const close = () => setShowModal(false);

  const handleNewPhoto = async (file) => {
    close();
    await onChangePhoto(file);
    reloadUser();
  };

  const handleRemovePhoto = async () => {
    close();
    await onRemovePhoto();
    reloadUser();
  };
  return {showModal, open, close, handleNewPhoto, handleRemovePhoto};
}

export default usePhotoModal;