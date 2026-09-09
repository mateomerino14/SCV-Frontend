import {useState, useEffect, useRef} from 'react';

const codeLength = 7;

function useVerificationCodeInput(isOpen, expiresAt, onExpired) {
  const [digits, setDigits] = useState(Array(codeLength).fill(''));
  const [resentMessage, setResentMessage] = useState('');
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    setDigits(Array(codeLength).fill(''));
    setResending(false);

    const calculateSeconds = () => {
      if (!expiresAt) {
        return 0;
      }
      const diff = Math.floor((new Date(expiresAt) - new Date()) / 1000);
      if (diff > 0) {
        return diff;
      }
      return 0;
    };

    const timer = setInterval(() => {
      const remaining = calculateSeconds();
      if (remaining <= 0) {
        clearInterval(timer);
        onExpired();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, expiresAt]);

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) {
      return;
    }
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    if (value && index < codeLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key !== 'Backspace') {
      return;
    }
    if (digits[index]) {
      const newDigits = [...digits];
      newDigits[index] = '';
      setDigits(newDigits);
      return;
    }
    if (index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newDigits = [...digits];
      newDigits[index - 1] = '';
      setDigits(newDigits);
    }
  };

  const handleResend = async (onResend) => {
    setResending(true);
    setDigits(Array(codeLength).fill(''));
    await onResend();
    setResending(false);
    setResentMessage('Se ha reenviado el código correctamente');
    setTimeout(() => setResentMessage(''), 5000);
  };
  return {digits, resentMessage, resending, inputRefs, codeLength, handleChange, handleKeyDown, handleResend};
}

export default useVerificationCodeInput;