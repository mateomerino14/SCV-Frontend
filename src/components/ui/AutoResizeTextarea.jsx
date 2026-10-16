import {useLayoutEffect, useRef} from 'react';

function AutoResizeTextarea({value, onChange, placeholder, maxLength, maxRows = 6, className = '', style}) {
  const textareaRef = useRef(null);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }
    // Crece con el contenido hasta maxRows líneas; desde ahí aparece el scroll
    const lineHeight = parseFloat(window.getComputedStyle(textarea).lineHeight) || 20;
    textarea.style.height = 'auto';
    const maxHeight = lineHeight * maxRows;
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }, [value, maxRows]);

  return (
    <textarea ref={textareaRef} rows={1} value={value} placeholder={placeholder} maxLength={maxLength}
      className={`w-full bg-transparent outline-none font-inter text-sm leading-5 resize-none block ${className}`} style={style}
      onChange={onChange} />
  );
}

export default AutoResizeTextarea;
