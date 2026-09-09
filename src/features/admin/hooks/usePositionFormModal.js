import {useState} from 'react';

const maxAmount = 99999.99;
const maxName = 50;

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

  const handleAmountChange = (field) => (event) => {
    const value = event.target.value;
    if (value === '') {
      setFormData((prev) => ({...prev, [field]: ''}));
      return;
    }
    if (!/^\d*\.?\d{0,2}$/.test(value)) {
      return;
    }
    if (parseFloat(value) > maxAmount) {
      return;
    }
    setFormData((prev) => ({...prev, [field]: value}));
    setFieldErrors?.((prev) => ({...prev, [field]: undefined}));
  };

  const handleAmountKeyDown = (event) => {
    const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter', '.'];
    if (allowed.includes(event.key)) {
      if (event.key === '.' && event.target.value.toString().includes('.')) {
        event.preventDefault();
      }
      return;
    }
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  };

  const handleSelectSuggestion = (name) => {
    setFormData((prev) => ({...prev, nombre: name}));
    setShowSuggestions(false);
  };

  return {showSuggestions, setShowSuggestions, handleNameChange, handleAmountChange, handleAmountKeyDown, handleSelectSuggestion};
}

export default usePositionFormModal;