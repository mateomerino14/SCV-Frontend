function useFileDropZone(onFiles) {
  const handleDrop = (event) => {
    event.preventDefault();
    onFiles(event.dataTransfer.files);
  };

  const handleDragOver = (event) => event.preventDefault();

  const handleSelect = (event) => {
    onFiles(event.target.files);
    event.target.value = '';
  };

  return {handleDrop, handleDragOver, handleSelect};
}

export default useFileDropZone;