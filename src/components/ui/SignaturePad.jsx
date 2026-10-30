import {useRef, useEffect, useState} from 'react';
import {Eraser} from 'lucide-react';
import {COLORS} from '../../constants';

const styles = {
  wrapper: 'w-full flex flex-col gap-1.5',
  box: 'relative w-full rounded-xl border-2 border-dashed overflow-hidden',
  canvas: 'block w-full touch-none cursor-crosshair',
  hint: 'absolute inset-x-0 bottom-7 text-center text-xs font-inter pointer-events-none select-none',
  baseline: 'absolute left-6 right-6 bottom-6 border-t pointer-events-none',
  footer: 'flex items-center justify-between',
  note: 'text-[11px] font-inter',
  clear: 'flex items-center gap-1 text-xs font-bold font-inter cursor-pointer',
};

const minPoints = 12;
const strokeColor = '#1f2a5c';

function SignaturePad({onChange, height = 150, disabled = false, noteColor = COLORS.labels, clearColor = COLORS.primary}) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const lastPoint = useRef(null);
  const pointCount = useRef(0);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ratio = window.devicePixelRatio || 1;
    const width = canvas.offsetWidth;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    const context = canvas.getContext('2d');
    context.scale(ratio, ratio);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = 2.4;
    context.strokeStyle = strokeColor;
  }, [height]);

  const pointOf = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {x: event.clientX - rect.left, y: event.clientY - rect.top};
  };

  const handlePointerDown = (event) => {
    if (disabled) {
      return;
    }
    event.preventDefault();
    canvasRef.current.setPointerCapture(event.pointerId);
    drawing.current = true;
    lastPoint.current = pointOf(event);
  };

  const handlePointerMove = (event) => {
    if (!drawing.current) {
      return;
    }
    const point = pointOf(event);
    const context = canvasRef.current.getContext('2d');
    context.beginPath();
    context.moveTo(lastPoint.current.x, lastPoint.current.y);
    context.lineTo(point.x, point.y);
    context.stroke();
    lastPoint.current = point;
    pointCount.current += 1;
  };

  const handlePointerUp = () => {
    if (!drawing.current) {
      return;
    }
    drawing.current = false;
    if (pointCount.current >= minPoints) {
      setIsEmpty(false);
      onChange(canvasRef.current.toDataURL('image/png'));
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    pointCount.current = 0;
    setIsEmpty(true);
    onChange(null);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.box} style={{borderColor: COLORS.dataFields, backgroundColor: COLORS.background}}>
        <canvas ref={canvasRef} className={styles.canvas} style={{height}} aria-label="Recuadro para firmar"
          onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} onPointerCancel={handlePointerUp} />
        <div className={styles.baseline} style={{borderColor: COLORS.dataFields}} />
        {isEmpty && <p className={styles.hint} style={{color: COLORS.labels}}>Firma aquí con el dedo o el mouse</p>}
      </div>
      <div className={styles.footer}>
        <span className={styles.note} style={{color: noteColor}}>Se guarda con tu nombre, la fecha y la hora</span>
        <button type="button" className={styles.clear} style={{color: clearColor}} onClick={handleClear} disabled={disabled}>
          <Eraser size={13} />
          Borrar
        </button>
      </div>
    </div>
  );
}

export default SignaturePad;
