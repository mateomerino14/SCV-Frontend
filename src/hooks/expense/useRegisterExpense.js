import {useState, useEffect} from 'react';
import {useSearchParams} from 'react-router-dom';
import {getCategories, registerExpense} from '../../services/expense/expenseService';
import {getTripDetail} from '../../services/trip/tripService';

const maxAmount = 99999.99;
const maxDescription = 1000;
const maxExchangeRate = 9999.9999;
const maxSubitemDescription = 255;

const currencies = [
  {codigo: 'EUR', nombre: 'Euro'},
  {codigo: 'PEN', nombre: 'Sol peruano'},
  {codigo: 'ARS', nombre: 'Peso argentino'},
  {codigo: 'BRL', nombre: 'Real brasileño'},
  {codigo: 'CLP', nombre: 'Peso chileno'},
  {codigo: 'COP', nombre: 'Peso colombiano'},
  {codigo: 'MXN', nombre: 'Peso mexicano'},
];

const subitemCategories = ['Alimentación', 'Alojamiento', 'Transporte', 'Combustible', 'Peajes', 'Estacionamiento', 'Materiales de Oficina', 'Otros', 'Movilidad'];

function calculateWithholdings(amount, type, isInternational) {
  const amountNum = parseFloat(amount) || 0;
  if (isInternational || type === 'F' || type === 'R' || amountNum <= 0) {
    return {base: amountNum, rcIva: 0, iue: 0, it: 0, cost: amountNum};
  }
  if (type === 'C') {
    const base = parseFloat((amountNum / 0.92).toFixed(2));
    const iue = parseFloat((base * 0.05).toFixed(2));
    const it = parseFloat((base * 0.03).toFixed(2));
    return {base, rcIva: 0, iue, it, cost: base};
  }
  if (type === 'S') {
    const base = parseFloat((amountNum / 0.84).toFixed(2));
    const rcIva = parseFloat((base * 0.13).toFixed(2));
    const it = parseFloat((base * 0.03).toFixed(2));
    return {base, rcIva, iue: 0, it, cost: base};
  }
  return {base: amountNum, rcIva: 0, iue: 0, it: 0, cost: amountNum};
}

let installmentCounter = 0;
let subitemCounter = 0;
let itemCounter = 0;

function newInstallment() {
  return {id: `t${++installmentCounter}`, currency: 'EUR', originAmount: '', exchangeRate: ''};
}

function newSubitem() {
  return {id: `s${++subitemCounter}`, description: '', amount: ''};
}

function newItem() {
  return {
    id: `g${++itemCounter}`,
    type: 'C',
    date: '',
    supplier: '',
    amount: '',
    description: '',
    categoryId: null,
    image: null,
    imagePreview: null,
    usesOtherCurrency: false,
    installments: [newInstallment()],
    usesSubitems: false,
    subitems: [newSubitem()],
    fieldErrors: {},
    installmentErrors: {},
    subitemErrors: {},
    saved: false,
    saveError: null,
    requiresAuthorization: false,
  };
}

function useRegisterExpense(tripId) {
  const [searchParams] = useSearchParams();
  const isInternationalExpense = searchParams.get('internacional') === 'true';
  const [items, setItems] = useState([newItem()]);
  const [expandedId, setExpandedId] = useState(items[0].id);
  const [categories, setCategories] = useState([]);
  const [isInternational, setIsInternational] = useState(false);
  const [savingAll, setSavingAll] = useState(false);
  const [error, setError] = useState('');
  const [saveSummary, setSaveSummary] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await getCategories();
      if (!data.error) {
        setCategories(data);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadTrip = async () => {
      const data = await getTripDetail(tripId);
      if (!data.error && data.viaje?.tipo === 'Internacional') {
        setIsInternational(true);
      }
    };
    loadTrip();
  }, [tripId]);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 4000);
  };

  const validInstallmentsOf = (item) => {
    return item.installments.filter((installment) => installment.currency && parseFloat(installment.originAmount) > 0 && parseFloat(installment.exchangeRate) > 0);
  };

  const validSubitemsOf = (item) => {
    return item.subitems.filter((subitem) => subitem.description.trim() && parseFloat(subitem.amount) > 0);
  };

  const finalAmountOf = (item) => {
    if (item.usesSubitems) {
      const valid = validSubitemsOf(item);
      if (valid.length > 0) {
        return parseFloat(valid.reduce((sum, subitem) => sum + parseFloat(subitem.amount || 0), 0).toFixed(2));
      }
    }
    return parseFloat(item.amount) || 0;
  };

  const withholdingsOf = (item) => calculateWithholdings(finalAmountOf(item), item.type, isInternationalExpense);
  const hasWithholdingsOf = (item) => !isInternationalExpense && (item.type === 'C' || item.type === 'S') && finalAmountOf(item) > 0;

  const updateItem = (itemId, changes) => {
    setItems((prev) => prev.map((item) => {
      if (item.id === itemId) {
        return {...item, ...changes};
      }
      return item;
    }));
  };

  const handleAddItem = () => {
    const item = newItem();
    setItems((prev) => [...prev, item]);
    setExpandedId(item.id);
  };

  const handleDuplicateItem = (itemId) => {
    const original = items.find((item) => item.id === itemId);
    if (!original) {
      return;
    }
    const copy = {
      ...newItem(),
      type: original.type,
      date: original.date,
      supplier: original.supplier,
      description: original.usesSubitems ? '' : original.description,
      categoryId: original.categoryId,
    };
    setItems((prev) => {
      const index = prev.findIndex((item) => item.id === itemId);
      const updated = [...prev];
      updated.splice(index + 1, 0, copy);
      return updated;
    });
    setExpandedId(copy.id);
  };

  const handleRemoveItem = (itemId) => {
    setItems((prev) => {
      if (prev.length <= 1) {
        return prev;
      }
      const item = prev.find((current) => current.id === itemId);
      if (item?.imagePreview) {
        URL.revokeObjectURL(item.imagePreview);
      }
      return prev.filter((current) => current.id !== itemId);
    });
  };

  const handleSelectItem = (itemId) => {
    setExpandedId((prev) => {
      if (prev === itemId) {
        return null;
      }
      return itemId;
    });
  };

  const handleTypeChange = (itemId, type) => updateItem(itemId, {type});
  const handleDateChange = (itemId, value) => {
    setItems((prev) => prev.map((item) => {
      if (item.id === itemId) {
        return {...item, date: value, fieldErrors: {...item.fieldErrors, date: undefined}};
      }
      return item;
    }));
  };

  const handleSupplierChange = (itemId, value) => {
    if (value.length > 50) {
      return;
    }
    updateItem(itemId, {supplier: value});
  };

  const handleAmountChange = (itemId, value) => {
    if (value === '') {
      setItems((prev) => prev.map((item) => {
        if (item.id === itemId) {
          return {...item, amount: '', fieldErrors: {...item.fieldErrors, amount: undefined}};
        }
        return item;
      }));
      return;
    }
    if (!/^\d*\.?\d{0,2}$/.test(value)) {
      return;
    }
    if (parseFloat(value) > maxAmount) {
      return;
    }
    setItems((prev) => prev.map((item) => {
      if (item.id === itemId) {
        return {...item, amount: value, fieldErrors: {...item.fieldErrors, amount: undefined}};
      }
      return item;
    }));
  };

  const handleDescriptionChange = (itemId, value) => {
    if (value.length > maxDescription) {
      return;
    }
    setItems((prev) => prev.map((item) => {
      if (item.id === itemId) {
        return {...item, description: value, fieldErrors: {...item.fieldErrors, description: undefined}};
      }
      return item;
    }));
  };

  const handleCategoryChange = (itemId, categoryId) => {
    setItems((prev) => prev.map((item) => {
      if (item.id === itemId) {
        return {...item, categoryId, fieldErrors: {...item.fieldErrors, category: undefined}};
      }
      return item;
    }));
  };

  const handleImageChange = (itemId, file) => {
    if (!file) {
      return;
    }
    setItems((prev) => prev.map((item) => {
      if (item.id !== itemId) {
        return item;
      }
      if (item.imagePreview) {
        URL.revokeObjectURL(item.imagePreview);
      }
      return {...item, image: file, imagePreview: URL.createObjectURL(file), fieldErrors: {...item.fieldErrors, image: undefined}};
    }));
  };

  const handleRemoveImage = (itemId) => {
    setItems((prev) => prev.map((item) => {
      if (item.id !== itemId) {
        return item;
      }
      if (item.imagePreview) {
        URL.revokeObjectURL(item.imagePreview);
      }
      return {...item, image: null, imagePreview: null};
    }));
  };

  const handleToggleOtherCurrency = (itemId) => {
    setItems((prev) => prev.map((item) => {
      if (item.id === itemId) {
        return {...item, usesOtherCurrency: !item.usesOtherCurrency};
      }
      return item;
    }));
  };

  const handleAddInstallment = (itemId) => {
    setItems((prev) => prev.map((item) => {
      if (item.id === itemId) {
        return {...item, installments: [...item.installments, newInstallment()]};
      }
      return item;
    }));
  };

  const handleRemoveInstallment = (itemId, installmentId) => {
    setItems((prev) => prev.map((item) => {
      if (item.id !== itemId) {
        return item;
      }
      if (item.installments.length <= 1) {
        return item;
      }
      const updatedErrors = {...item.installmentErrors};
      delete updatedErrors[installmentId];
      return {...item, installments: item.installments.filter((installment) => installment.id !== installmentId), installmentErrors: updatedErrors};
    }));
  };

  const handleInstallmentCurrencyChange = (itemId, installmentId, value) => {
    setItems((prev) => prev.map((item) => {
      if (item.id !== itemId) {
        return item;
      }
      return {...item, installments: item.installments.map((installment) => {
        if (installment.id === installmentId) {
          return {...installment, currency: value};
        }
        return installment;
      })};
    }));
  };

  const handleInstallmentAmountChange = (itemId, installmentId, value) => {
    if (value !== '' && !/^\d*\.?\d{0,2}$/.test(value)) {
      return;
    }
    if (value !== '' && parseFloat(value) > maxAmount) {
      return;
    }
    setItems((prev) => prev.map((item) => {
      if (item.id !== itemId) {
        return item;
      }
      return {
        ...item,
        installments: item.installments.map((installment) => {
          if (installment.id === installmentId) {
            return {...installment, originAmount: value};
          }
          return installment;
        }),
        installmentErrors: {...item.installmentErrors, [installmentId]: {...item.installmentErrors[installmentId], amount: undefined}},
      };
    }));
  };

  const handleInstallmentExchangeRateChange = (itemId, installmentId, value) => {
    if (value !== '' && !/^\d*\.?\d{0,4}$/.test(value)) {
      return;
    }
    if (value !== '' && parseFloat(value) > maxExchangeRate) {
      return;
    }
    setItems((prev) => prev.map((item) => {
      if (item.id !== itemId) {
        return item;
      }
      return {
        ...item,
        installments: item.installments.map((installment) => {
          if (installment.id === installmentId) {
            return {...installment, exchangeRate: value};
          }
          return installment;
        }),
        installmentErrors: {...item.installmentErrors, [installmentId]: {...item.installmentErrors[installmentId], exchangeRate: undefined}},
      };
    }));
  };

  const handleToggleSubitems = (itemId) => {
    setItems((prev) => prev.map((item) => {
      if (item.id === itemId) {
        return {...item, usesSubitems: !item.usesSubitems};
      }
      return item;
    }));
  };

  const handleAddSubitem = (itemId) => {
    setItems((prev) => prev.map((item) => {
      if (item.id === itemId) {
        return {...item, subitems: [...item.subitems, newSubitem()]};
      }
      return item;
    }));
  };

  const handleRemoveSubitem = (itemId, subitemId) => {
    setItems((prev) => prev.map((item) => {
      if (item.id !== itemId) {
        return item;
      }
      if (item.subitems.length <= 1) {
        return item;
      }
      const updatedErrors = {...item.subitemErrors};
      delete updatedErrors[subitemId];
      return {...item, subitems: item.subitems.filter((subitem) => subitem.id !== subitemId), subitemErrors: updatedErrors};
    }));
  };

  const handleSubitemDescriptionChange = (itemId, subitemId, value) => {
    if (value.length > maxSubitemDescription) {
      return;
    }
    setItems((prev) => prev.map((item) => {
      if (item.id !== itemId) {
        return item;
      }
      return {
        ...item,
        subitems: item.subitems.map((subitem) => {
          if (subitem.id === subitemId) {
            return {...subitem, description: value};
          }
          return subitem;
        }),
        subitemErrors: {...item.subitemErrors, [subitemId]: {...item.subitemErrors[subitemId], description: undefined}},
      };
    }));
  };

  const handleSubitemAmountChange = (itemId, subitemId, value) => {
    if (value !== '' && !/^\d*\.?\d{0,2}$/.test(value)) {
      return;
    }
    if (value !== '' && parseFloat(value) > maxAmount) {
      return;
    }
    setItems((prev) => prev.map((item) => {
      if (item.id !== itemId) {
        return item;
      }
      return {
        ...item,
        subitems: item.subitems.map((subitem) => {
          if (subitem.id === subitemId) {
            return {...subitem, amount: value};
          }
          return subitem;
        }),
        subitemErrors: {...item.subitemErrors, [subitemId]: {...item.subitemErrors[subitemId], amount: undefined}},
      };
    }));
  };

  const validateItem = (item) => {
    const errors = {};
    if (!item.date) {
      errors.date = 'La fecha del gasto es requerida';
    }
    const isAmountAutomatic = item.usesSubitems;
    if (!isAmountAutomatic && (!item.amount || parseFloat(item.amount) <= 0)) {
      errors.amount = 'El monto es requerido y debe ser mayor a 0';
    }
    if (!item.usesSubitems && !item.description.trim()) {
      errors.description = 'La descripción es requerida';
    }
    if (!item.categoryId) {
      errors.category = 'La categoría es requerida';
    }

    const installmentErrors = {};
    if (item.usesOtherCurrency) {
      item.installments.forEach((installment) => {
        const currentErrors = {};
        if (!installment.originAmount || parseFloat(installment.originAmount) <= 0) {
          currentErrors.amount = 'El monto es requerido';
        }
        if (!installment.exchangeRate || parseFloat(installment.exchangeRate) <= 0) {
          currentErrors.exchangeRate = 'El tipo de cambio es requerido';
        }
        if (Object.keys(currentErrors).length > 0) {
          installmentErrors[installment.id] = currentErrors;
        }
      });
    }

    const subitemErrors = {};
    if (item.usesSubitems) {
      item.subitems.forEach((subitem) => {
        const currentErrors = {};
        if (!subitem.description.trim()) {
          currentErrors.description = 'La descripción es requerida';
        }
        if (!subitem.amount || parseFloat(subitem.amount) <= 0) {
          currentErrors.amount = 'El monto es requerido';
        }
        if (Object.keys(currentErrors).length > 0) {
          subitemErrors[subitem.id] = currentErrors;
        }
      });
    }

    return {errors, installmentErrors, subitemErrors};
  };

  const handleSaveAll = async () => {
    setSavingAll(true);
    setSaveSummary(null);
    let saved = 0;
    let failed = 0;
    for (const item of items) {
      if (item.saved) {
        continue;
      }
      const {errors, installmentErrors, subitemErrors} = validateItem(item);
      if (Object.keys(errors).length > 0 || Object.keys(installmentErrors).length > 0 || Object.keys(subitemErrors).length > 0) {
        setItems((prev) => prev.map((current) => {
          if (current.id === item.id) {
            return {...current, fieldErrors: errors, installmentErrors, subitemErrors, saveError: 'Completa los campos requeridos'};
          }
          return current;
        }));
        failed++;
        continue;
      }
      const finalAmount = finalAmountOf(item);
      const validInstallments = validInstallmentsOf(item);
      const validSubitems = validSubitemsOf(item);
      const payload = {
        id_viaje: tripId,
        tipo: item.type,
        fecha_gasto: item.date,
        proveedor: item.supplier.trim() || null,
        monto_total: finalAmount,
        descripcion: item.description.trim(),
        id_categoria_gasto: item.categoryId,
        es_gasto_internacional: isInternationalExpense,
      };
      if (item.usesOtherCurrency && validInstallments.length > 0) {
        payload.tramos = validInstallments.map((installment) => ({
          moneda: installment.currency,
          monto_origen: parseFloat(installment.originAmount),
          tipo_cambio: parseFloat(installment.exchangeRate),
        }));
        payload.moneda = validInstallments[0].currency;
        payload.tipo_cambio = parseFloat(validInstallments[0].exchangeRate);
        payload.monto_moneda_origen = validInstallments.reduce((sum, installment) => sum + parseFloat(installment.originAmount), 0);
      }
      else {
        payload.moneda = 'USD';
        payload.tipo_cambio = 1;
        payload.monto_moneda_origen = finalAmount;
      }
      if (item.usesSubitems && validSubitems.length > 0) {
        payload.subitems = validSubitems.map((subitem) => ({
          descripcion: subitem.description.trim(),
          monto: parseFloat(subitem.amount),
        }));
      }
      const data = await registerExpense(payload, item.image);
      if (data.error) {
        failed++;
        setItems((prev) => prev.map((current) => {
          if (current.id === item.id) {
            return {...current, saveError: data.error, requiresAuthorization: !!data.requiereAutorizacion};
          }
          return current;
        }));
      }
      else {
        saved++;
        setItems((prev) => prev.map((current) => {
          if (current.id === item.id) {
            return {...current, saved: true, saveError: null, requiresAuthorization: false, fieldErrors: {}, installmentErrors: {}, subitemErrors: {}};
          }
          return current;
        }));
      }
    }
    setSavingAll(false);
    setSaveSummary({saved, failed});
  };

  const hasRequiresAuthorization = items.some((item) => item.requiresAuthorization);
  const allSaved = items.length > 0 && items.every((item) => item.saved);
  const pendingToSave = items.filter((item) => !item.saved).length;

  return {
    items,
    expandedId,
    categories,
    isInternational,
    isInternationalExpense,
    savingAll,
    error,
    saveSummary,
    hasRequiresAuthorization,
    allSaved,
    pendingToSave,
    currencies,
    subitemCategories,
    validInstallmentsOf, validSubitemsOf, finalAmountOf, withholdingsOf, hasWithholdingsOf,
    handleAddItem, handleDuplicateItem, handleRemoveItem, handleSelectItem,
    handleTypeChange, handleDateChange, handleSupplierChange, handleAmountChange,
    handleDescriptionChange, handleCategoryChange,
    handleImageChange, handleRemoveImage,
    handleToggleOtherCurrency,
    handleAddInstallment, handleRemoveInstallment, handleInstallmentCurrencyChange, handleInstallmentAmountChange, handleInstallmentExchangeRateChange,
    handleToggleSubitems, handleAddSubitem, handleRemoveSubitem, handleSubitemDescriptionChange, handleSubitemAmountChange,
    handleSaveAll,
  };
}

export default useRegisterExpense;