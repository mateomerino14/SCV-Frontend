import {useState} from 'react';

const maxName = 100;

function usePositionFormModal(setFormData, setFieldErrors) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleNameChange = (event) => {
    const value = event.target.value;
    if (value.length > maxName) {
      return;
    }
    setFormData((prev) => ({...prev, nombre: value}));
    setFieldErrors?.((prev) => ({...prev, nombre: undefined}));
    setShowSuggestions(true);
  };

  const handleTypeChange = (type) => {
    setFormData((prev) => ({...prev, tipo_viatico: type}));
    setFieldErrors?.((prev) => ({...prev, tipo_viatico: undefined}));
  };

  const handleSelectSuggestion = (name) => {
    setFormData((prev) => ({...prev, nombre: name}));
    setShowSuggestions(false);
  };

  return {showSuggestions, setShowSuggestions, handleNameChange, handleTypeChange, handleSelectSuggestion};
}

export default usePositionFormModal;