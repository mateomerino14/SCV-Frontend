import {useState, useRef, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {ChevronDown} from 'lucide-react';
import {COLORS} from '../../../constants';

const styles = {
  selectorContainer: 'flex flex-col gap-1 relative flex-1 min-w-[180px]',
  trigger: 'w-full px-4 py-3 rounded-xl border flex items-center justify-between cursor-pointer',
  triggerText: 'text-sm font-bold font-inter',
  dropdown: 'absolute z-50 w-full rounded-xl border shadow-lg overflow-hidden',
  list: 'max-h-56 overflow-y-auto',
  option: 'px-4 py-2.5 text-sm font-inter cursor-pointer transition-colors',
};

function HistoryDropdownSelector({options, selectedValue, onSelect}) {
  const [open, setOpen] = useState(false);
  const [opensUpward, setOpensUpward] = useState(false);
  const [hoveredValue, setHoveredValue] = useState(null);
  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);
  const selectedOption = options.find((option) => option.value === selectedValue);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpensUpward(spaceBelow < 260);
    }
    setOpen(!open);
  };

  const handleSelect = (option) => {
    onSelect(option.value);
    setOpen(false);
  };

  return (
    <div className={styles.selectorContainer} ref={wrapperRef}>
      <div ref={triggerRef} className={styles.trigger} style={{borderColor: COLORS.dataFields, backgroundColor: COLORS.background}} onClick={handleToggle}>
        <span className={styles.triggerText} style={{color: COLORS.text}}>{selectedOption ? selectedOption.label : 'Seleccionar'}</span>
        <motion.div animate={{rotate: open ? 180 : 0}} transition={{duration: 0.15}}>
          <ChevronDown size={16} style={{color: COLORS.labels}} />
        </motion.div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div className={styles.dropdown}
            style={{borderColor: COLORS.dataFields, backgroundColor: COLORS.background, [opensUpward ? 'bottom' : 'top']: '100%', marginBottom: opensUpward ? 4 : 0, marginTop: opensUpward ? 0 : 4}}
            initial={{opacity: 0, y: opensUpward ? 6 : -6}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: opensUpward ? 6 : -6}} transition={{duration: 0.15}}>
            <div className={styles.list}>
              {options.map((option) => {
                const isSelected = selectedValue === option.value;
                const isHovered = hoveredValue === option.value;
                let backgroundColor = 'transparent';
                if (isSelected) {
                  backgroundColor = COLORS.primary;
                }
                else if (isHovered) {
                  backgroundColor = COLORS.backgroundHeader;
                }
                return (
                  <div key={option.value} className={styles.option}
                    style={{color: isSelected ? COLORS.background : COLORS.text, backgroundColor, fontWeight: isSelected ? 'bold' : 'normal'}}
                    onMouseEnter={() => setHoveredValue(option.value)} onMouseLeave={() => setHoveredValue(null)}
                    onClick={() => handleSelect(option)}>
                    {option.label}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default HistoryDropdownSelector;