import {useState, useEffect} from 'react';

function useNotFoundAnimation() {
  const [eyes, setEyes] = useState({x: 0, y: 0});
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    const handleMove = (event) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const deltaX = (event.clientX - centerX) / centerX;
      const deltaY = (event.clientY - centerY) / centerY;
      setEyes({x: deltaX * 4, y: deltaY * 4});
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 150);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return {eyes, blinking};
}

export default useNotFoundAnimation;