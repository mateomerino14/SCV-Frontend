import {useState} from 'react';

function useInvoiceDetailPanel(detail, onAdd, onRemove) {
  const [item, setItem] = useState({nombre_producto: '', precio: '', cantidad: 1});
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleSelectRow = (index) => {
    setSelectedIndex(index);
    setItem({
      nombre_producto: detail[index].nombre_producto,
      precio: detail[index].precio,
      cantidad: detail[index].cantidad,
    });
    setFieldErrors({});
  };

  const handleFieldChange = (key, value) => {
    if (key === 'precio') {
      const validDecimal = value.replace(',', '.').replace(/[^0-9.]/g, '');
      const parts = validDecimal.split('.');
      if (parts.length > 2) {
        return;
      }
      if (parts.length === 2 && parts[1].length > 2) {
        return;
      }
      setItem((prev) => ({...prev, [key]: validDecimal}));
    }
    else if (key === 'cantidad') {
      const onlyIntegers = value.replace(/[^0-9]/g, '');
      setItem((prev) => ({...prev, [key]: onlyIntegers}));
    }
    else if (key === 'nombre_producto') {
      if (value.length > 50) {
        return;
      }
      setItem((prev) => ({...prev, [key]: value}));
    }
    else {
      setItem((prev) => ({...prev, [key]: value}));
    }
    setFieldErrors((prev) => ({...prev, [key]: undefined}));
  };

  const validate = () => {
    const errors = {};
    if (!item.nombre_producto.trim()) {
      errors.nombre_producto = 'La descripción es requerida';
    }
    if (!item.precio || parseFloat(item.precio) <= 0) {
      errors.precio = 'El precio es requerido y debe ser mayor a 0';
    }
    if (!item.cantidad || parseInt(item.cantidad) <= 0) {
      errors.cantidad = 'La cantidad debe ser mayor a 0';
    }
    return errors;
  };

  const handleAdd = () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    onAdd({
      nombre_producto: item.nombre_producto.trim(),
      precio: parseFloat(parseFloat(item.precio).toFixed(2)),
      cantidad: parseInt(item.cantidad),
    });
    setItem({nombre_producto: '', precio: '', cantidad: 1});
    setSelectedIndex(null);
    setFieldErrors({});
  };

  const handleModify = () => {
    if (selectedIndex === null) {
      return;
    }
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    onRemove(selectedIndex);
    onAdd({
      nombre_producto: item.nombre_producto.trim(),
      precio: parseFloat(parseFloat(item.precio).toFixed(2)),
      cantidad: parseInt(item.cantidad),
    });
    setItem({nombre_producto: '', precio: '', cantidad: 1});
    setSelectedIndex(null);
    setFieldErrors({});
  };

  return {
    item,
    selectedIndex,
    fieldErrors,
    handleSelectRow,
    handleFieldChange,
    handleAdd,
    handleModify,
  };
}

export default useInvoiceDetailPanel;