import {useState, useEffect, useMemo} from 'react';
import {useSearchParams} from 'react-router-dom';
import {getCategories, getExpenseDetail, updateExpense} from '../../services/expense/expenseService';

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

function formatDateToDMY(dateStr) {
  if (!dateStr) {
    return '';
  }
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

let installmentCounter = 0;
let subitemCounter = 0;

function newInstallment(currency = 'EUR', originAmount = '', exchangeRate = '') {
  return {id: `t${++installmentCounter}`, currency, originAmount, exchangeRate};
}

function newSubitem(description = '', amount = '') {
  return {id: `s${++subitemCounter}`, description, amount};
}

function useEditExpense(expenseId) {
  const [searchParams] = useSearchParams();
  const isInternationalExpense = searchParams.get('internacional') === 'true';
  const [type, setType] = useState('C');
  const [date, setDate] = useState('');
  const [supplier, setSupplier] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [tripId, setTripId] = useState(null);
  const [tripDateRange, setTripDateRange] = useState({start: null, end: null});
  const [usesOtherCurrency, setUsesOtherCurrency] = useState(false);
  const [installments, setInstallments] = useState([newInstallment()]);
  const [installmentErrors, setInstallmentErrors] = useState({});
  const [usesSubitems, setUsesSubitems] = useState(false);
  const [subitems, setSubitems] = useState([newSubitem()]);
  const [subitemErrors, setSubitemErrors] = useState({});

  useEffect(() => {
    const load = async () => {
      setLoadingData(true);
      const [expenseData, categoriesData] = await Promise.all([
        getExpenseDetail(expenseId),
        getCategories(),
      ]);
      setLoadingData(false);
      if (expenseData.error) {
        return;
      }
      setType(expenseData.tipo || 'C');
      setDate(expenseData.fecha_gasto?.split('T')[0] || '');
      setSupplier(expenseData.Proveedor?.nombre || '');
      setDescription(expenseData.descripcion || '');
      setCategoryId(expenseData.id_categoria || null);
      setTripId(expenseData.id_viaje || null);
      setTripDateRange({start: expenseData.Viaje?.fecha_inicio || null, end: expenseData.Viaje?.fecha_fin || null});
      setAmount(parseFloat(expenseData.monto_total || 0).toString());
      const savedInstallments = expenseData.Gasto_Tramo_Moneda || [];
      if (savedInstallments.length > 0) {
        setUsesOtherCurrency(true);
        setInstallments(savedInstallments.map((installment) => newInstallment(
          installment.moneda,
          parseFloat(installment.monto_origen).toString(),
          parseFloat(installment.tipo_cambio).toString(),
        )));
      }
      const savedSubitems = expenseData.Gasto_Subitem || [];
      if (savedSubitems.length > 0) {
        setUsesSubitems(true);
        setSubitems(savedSubitems.map((subitem) => newSubitem(
          subitem.descripcion,
          parseFloat(subitem.monto).toString(),
        )));
      }
      if (expenseData.Imagen?.url_archivo) {
        setExistingImage(expenseData.Imagen.url_archivo);
        setImagePreview(expenseData.Imagen.url_archivo);
      }
      if (!categoriesData.error) {
        setCategories(categoriesData);
      }
    };
    load();
  }, [expenseId]);

  const validInstallments = useMemo(() => {
    return installments.filter((installment) => installment.currency && parseFloat(installment.originAmount) > 0 && parseFloat(installment.exchangeRate) > 0);
  }, [installments]);

  const validSubitems = useMemo(() => {
    return subitems.filter((subitem) => subitem.description.trim() && parseFloat(subitem.amount) > 0);
  }, [subitems]);

  const finalAmount = useMemo(() => {
    if (!isInternationalExpense && usesSubitems && validSubitems.length > 0) {
      return parseFloat(validSubitems.reduce((sum, subitem) => sum + parseFloat(subitem.amount || 0), 0).toFixed(2));
    }
    return parseFloat(amount) || 0;
  }, [amount, isInternationalExpense, usesSubitems, validSubitems]);

  const withholdings = useMemo(() => {
    return calculateWithholdings(finalAmount, type, isInternationalExpense);
  }, [finalAmount, type, isInternationalExpense]);

  const hasWithholdings = !isInternationalExpense && (type === 'C' || type === 'S') && finalAmount > 0;

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 4000);
  };

  const handleImageChange = (file) => {
    if (!file) {
      return;
    }
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setExistingImage(null);
    setFieldErrors((prev) => ({...prev, image: undefined}));
  };

  const handleRemoveImage = () => {
    if (imagePreview && !existingImage) {
      URL.revokeObjectURL(imagePreview);
    }
    setImage(null);
    setImagePreview(null);
    setExistingImage(null);
  };

  const handleAmountChange = (value) => {
    if (value === '') {
      setAmount('');
      return;
    }
    if (!/^\d*\.?\d{0,2}$/.test(value)) {
      return;
    }
    if (parseFloat(value) > maxAmount) {
      return;
    }
    setAmount(value);
    setFieldErrors((prev) => ({...prev, amount: undefined}));
  };

  const handleAddInstallment = () => {
    setInstallments((prev) => [...prev, newInstallment()]);
  };

  const handleRemoveInstallment = (installmentId) => {
    setInstallments((prev) => {
      if (prev.length > 1) {
        return prev.filter((installment) => installment.id !== installmentId);
      }
      return prev;
    });
    setInstallmentErrors((prev) => {
      const updated = {...prev};
      delete updated[installmentId];
      return updated;
    });
  };

  const handleInstallmentCurrencyChange = (installmentId, value) => {
    setInstallments((prev) => prev.map((installment) => {
      if (installment.id === installmentId) {
        return {...installment, currency: value};
      }
      return installment;
    }));
  };

  const handleInstallmentAmountChange = (installmentId, value) => {
    if (value !== '' && !/^\d*\.?\d{0,2}$/.test(value)) {
      return;
    }
    if (value !== '' && parseFloat(value) > maxAmount) {
      return;
    }
    setInstallments((prev) => prev.map((installment) => {
      if (installment.id === installmentId) {
        return {...installment, originAmount: value};
      }
      return installment;
    }));
    setInstallmentErrors((prev) => ({...prev, [installmentId]: {...prev[installmentId], amount: undefined}}));
  };

  const handleInstallmentExchangeRateChange = (installmentId, value) => {
    if (value === '') {
      setInstallments((prev) => prev.map((installment) => {
        if (installment.id === installmentId) {
          return {...installment, exchangeRate: ''};
        }
        return installment;
      }));
      setInstallmentErrors((prev) => ({...prev, [installmentId]: {...prev[installmentId], exchangeRate: undefined}}));
      return;
    }
    if (!/^\d*\.?\d{0,4}$/.test(value)) {
      return;
    }
    if (parseFloat(value) > maxExchangeRate) {
      return;
    }
    setInstallments((prev) => prev.map((installment) => {
      if (installment.id === installmentId) {
        return {...installment, exchangeRate: value};
      }
      return installment;
    }));
    setInstallmentErrors((prev) => ({...prev, [installmentId]: {...prev[installmentId], exchangeRate: undefined}}));
  };

  const handleToggleSubitems = () => {
    setUsesSubitems((prev) => !prev);
  };

  const handleAddSubitem = () => {
    setSubitems((prev) => [...prev, newSubitem()]);
  };

  const handleRemoveSubitem = (subitemId) => {
    setSubitems((prev) => {
      if (prev.length > 1) {
        return prev.filter((subitem) => subitem.id !== subitemId);
      }
      return prev;
    });
    setSubitemErrors((prev) => {
      const updated = {...prev};
      delete updated[subitemId];
      return updated;
    });
  };

  const handleSubitemDescriptionChange = (subitemId, value) => {
    if (value.length > maxSubitemDescription) {
      return;
    }
    setSubitems((prev) => prev.map((subitem) => {
      if (subitem.id === subitemId) {
        return {...subitem, description: value};
      }
      return subitem;
    }));
    setSubitemErrors((prev) => ({...prev, [subitemId]: {...prev[subitemId], description: undefined}}));
  };

  const handleSubitemAmountChange = (subitemId, value) => {
    if (value !== '' && !/^\d*\.?\d{0,2}$/.test(value)) {
      return;
    }
    if (value !== '' && parseFloat(value) > maxAmount) {
      return;
    }
    setSubitems((prev) => prev.map((subitem) => {
      if (subitem.id === subitemId) {
        return {...subitem, amount: value};
      }
      return subitem;
    }));
    setSubitemErrors((prev) => ({...prev, [subitemId]: {...prev[subitemId], amount: undefined}}));
  };

  const handleSupplierChange = (value) => {
    if (value.length > 50) {
      return;
    }
    setSupplier(value);
  };

  const handleDescriptionChange = (value) => {
    if (value.length > maxDescription) {
      return;
    }
    setDescription(value);
    setFieldErrors((prev) => ({...prev, description: undefined}));
  };

  const handleDateChange = (value) => {
    setDate(value);
    setFieldErrors((prev) => ({...prev, date: undefined}));
  };

  const handleCategoryChange = (id) => {
    setCategoryId(id);
    setFieldErrors((prev) => ({...prev, category: undefined}));
  };

  const validate = () => {
    const errors = {};
    if (!date) {
      errors.date = 'La fecha del gasto es requerida';
    }
    else if (tripDateRange.start && tripDateRange.end && (date < tripDateRange.start || date > tripDateRange.end)) {
      errors.date = `La fecha debe estar dentro del período del viaje (${formatDateToDMY(tripDateRange.start)} - ${formatDateToDMY(tripDateRange.end)})`;
    }
    const isAmountAutomatic = !isInternationalExpense && usesSubitems;
    if (!isAmountAutomatic && (!amount || parseFloat(amount) <= 0)) {
      errors.amount = 'El monto es requerido y debe ser mayor a 0';
    }
    if (!usesSubitems && !description.trim()) {
      errors.description = 'La descripción es requerida';
    }
    if (!categoryId) {
      errors.category = 'La categoría es requerida';
    }

    const currentInstallmentErrors = {};
    if (usesOtherCurrency) {
      installments.forEach((installment) => {
        const errs = {};
        if (!installment.originAmount || parseFloat(installment.originAmount) <= 0) {
          errs.amount = 'El monto es requerido';
        }
        if (!installment.exchangeRate || parseFloat(installment.exchangeRate) <= 0) {
          errs.exchangeRate = 'El tipo de cambio es requerido';
        }
        if (Object.keys(errs).length > 0) {
          currentInstallmentErrors[installment.id] = errs;
        }
      });
    }

    const currentSubitemErrors = {};
    if (usesSubitems) {
      subitems.forEach((subitem) => {
        const errs = {};
        if (!subitem.description.trim()) {
          errs.description = 'La descripción es requerida';
        }
        if (!subitem.amount || parseFloat(subitem.amount) <= 0) {
          errs.amount = 'El monto es requerido';
        }
        if (Object.keys(errs).length > 0) {
          currentSubitemErrors[subitem.id] = errs;
        }
      });
    }

    return {errors, currentInstallmentErrors, currentSubitemErrors};
  };

  const handleSave = async () => {
    const {errors, currentInstallmentErrors, currentSubitemErrors} = validate();
    if (Object.keys(errors).length > 0 || Object.keys(currentInstallmentErrors).length > 0 || Object.keys(currentSubitemErrors).length > 0) {
      setFieldErrors(errors);
      setInstallmentErrors(currentInstallmentErrors);
      setSubitemErrors(currentSubitemErrors);
      return;
    }
    setFieldErrors({});
    setInstallmentErrors({});
    setSubitemErrors({});
    setLoading(true);
    const payload = {
      tipo: type,
      fecha_gasto: date,
      proveedor: supplier.trim() || null,
      monto_total: finalAmount,
      descripcion: description.trim(),
      id_categoria_gasto: categoryId,
      mantener_imagen: !!existingImage,
      es_gasto_internacional: isInternationalExpense,
    };
    if (usesOtherCurrency && validInstallments.length > 0) {
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
    if (usesSubitems && validSubitems.length > 0) {
      payload.subitems = validSubitems.map((subitem) => ({
        descripcion: subitem.description.trim(),
        monto: parseFloat(subitem.amount),
      }));
    }
    const data = await updateExpense(expenseId, payload, image);
    setLoading(false);
    if (data.error) {
      showError(data.error);
      return;
    }
    setSaved(true);
  };

  return {
    type, setType,
    date, supplier, amount, description,
    categoryId, categories,
    imagePreview, loading, loadingData,
    error, fieldErrors, saved, tripId,
    isInternationalExpense,
    usesOtherCurrency, setUsesOtherCurrency,
    installments, validInstallments, finalAmount,
    installmentErrors,
    usesSubitems, subitems, validSubitems, subitemErrors,
    currencies, subitemCategories,
    withholdings, hasWithholdings,
    handleImageChange, handleRemoveImage,
    handleAmountChange,
    handleAddInstallment, handleRemoveInstallment,
    handleInstallmentCurrencyChange, handleInstallmentAmountChange, handleInstallmentExchangeRateChange,
    handleToggleSubitems, handleAddSubitem, handleRemoveSubitem,
    handleSubitemDescriptionChange, handleSubitemAmountChange,
    handleSupplierChange,
    handleDescriptionChange, handleDateChange,
    handleCategoryChange, handleSave,
  };
}

export default useEditExpense;