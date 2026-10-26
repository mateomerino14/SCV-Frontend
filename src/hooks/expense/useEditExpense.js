import {useState, useEffect, useMemo} from 'react';
import {useSearchParams} from 'react-router-dom';
import {getCategories, getExpenseDetail, updateExpense} from '../../services/expense/expenseService';
import {compressImage} from '../../utils/imageCompressor';
import {currencies} from '../../constants/currencies';
import {calculateWithholdings} from '../../utils/withholdings';
import {usdCurrency, amountLimitOf, isAmountInput, isExchangeRateInput, validateForeignCurrency, buildForeignCurrencyPayload} from '../../utils/expenseCurrency';

const maxDescription = 1000;
const maxSubitemDescription = 255;
const maxReceiptNumber = 50;

function formatDateToDMY(dateStr) {
  if (!dateStr) {
    return '';
  }
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

let subitemCounter = 0;
let backupCounter = 0;
const maxBackups = 2;

function newSubitem(description = '', amount = '') {
  return {id: `s${++subitemCounter}`, description, amount};
}

const decimalText = (value) => parseFloat(value || 0).toString();

const savedCurrencyOf = (expense) => {
  if (!expense.es_gasto_internacional || !(parseFloat(expense.tipo_cambio_bs) > 0)) {
    return {currency: usdCurrency, amount: decimalText(expense.monto_total), exchangeRate: '', bsRate: ''};
  }
  let exchangeRate = '';
  if (expense.moneda !== usdCurrency) {
    exchangeRate = decimalText(expense.tipo_cambio);
  }
  return {currency: expense.moneda, amount: decimalText(expense.monto_moneda_origen), exchangeRate, bsRate: decimalText(expense.tipo_cambio_bs)};
};

function useEditExpense(expenseId) {
  const [searchParams] = useSearchParams();
  const isInternationalExpense = searchParams.get('internacional') === 'true';
  const [type, setType] = useState('C');
  const [date, setDate] = useState('');
  const [supplier, setSupplier] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [tripId, setTripId] = useState(null);
  const [tripDateRange, setTripDateRange] = useState({start: null, end: null});
  const [currency, setCurrency] = useState(usdCurrency);
  const [exchangeRate, setExchangeRate] = useState('');
  const [bsRate, setBsRate] = useState('');
  const [usesSubitems, setUsesSubitems] = useState(false);
  const [subitems, setSubitems] = useState([newSubitem()]);
  const [subitemErrors, setSubitemErrors] = useState({});
  const amountLimit = amountLimitOf(isInternationalExpense);

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
      setReceiptNumber(expenseData.numero_recibo || '');
      setDescription(expenseData.descripcion || '');
      setCategoryId(expenseData.id_categoria || null);
      setTripId(expenseData.id_viaje || null);
      setTripDateRange({start: expenseData.Viaje?.fecha_inicio || null, end: expenseData.Viaje?.fecha_fin || null});
      const savedCurrency = savedCurrencyOf(expenseData);
      setAmount(savedCurrency.amount);
      setCurrency(savedCurrency.currency);
      setExchangeRate(savedCurrency.exchangeRate);
      setBsRate(savedCurrency.bsRate);
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
      setBackups((expenseData.Imagen_Respaldo || []).map((backup) => ({id: `r${++backupCounter}`, file: null, preview: backup.url_archivo, url: backup.url_archivo})));
      if (!categoriesData.error) {
        setCategories(categoriesData);
      }
    };
    load();
  }, [expenseId]);

  const validSubitems = useMemo(() => {
    return subitems.filter((subitem) => subitem.description.trim() && parseFloat(subitem.amount) > 0);
  }, [subitems]);

  const finalAmount = useMemo(() => {
    if (usesSubitems && validSubitems.length > 0) {
      return parseFloat(validSubitems.reduce((sum, subitem) => sum + parseFloat(subitem.amount || 0), 0).toFixed(2));
    }
    return parseFloat(amount) || 0;
  }, [amount, usesSubitems, validSubitems]);

  const withholdings = useMemo(() => {
    let subitemAmounts = [];
    if (usesSubitems) {
      subitemAmounts = validSubitems.map((subitem) => subitem.amount);
    }
    return calculateWithholdings(finalAmount, type, isInternationalExpense, subitemAmounts);
  }, [finalAmount, type, isInternationalExpense, usesSubitems, validSubitems]);

  const hasWithholdings = !isInternationalExpense && (type === 'C' || type === 'S') && finalAmount > 0;

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 4000);
  };

  const handleImageChange = async (file) => {
    if (!file) {
      return;
    }
    const compressed = await compressImage(file);
    if (imagePreview && !existingImage) {
      URL.revokeObjectURL(imagePreview);
    }
    setImage(compressed);
    setImagePreview(URL.createObjectURL(compressed));
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

  const handleAddBackup = async (file) => {
    if (!file || backups.length >= maxBackups) {
      return;
    }
    const compressed = await compressImage(file);
    setBackups((prev) => [...prev, {id: `r${++backupCounter}`, file: compressed, preview: URL.createObjectURL(compressed), url: null}].slice(0, maxBackups));
  };

  const handleRemoveBackup = (backupId) => {
    setBackups((prev) => prev.filter((backup) => {
      if (backup.id === backupId && backup.file) {
        URL.revokeObjectURL(backup.preview);
      }
      return backup.id !== backupId;
    }));
  };

  const handleAmountChange = (value) => {
    if (!isAmountInput(value, amountLimit)) {
      return;
    }
    setAmount(value);
    setFieldErrors((prev) => ({...prev, amount: undefined}));
  };

  const handleCurrencyChange = (value) => {
    setCurrency(value);
    setFieldErrors((prev) => ({...prev, exchangeRate: undefined}));
  };

  const handleExchangeRateChange = (value) => {
    if (!isExchangeRateInput(value)) {
      return;
    }
    setExchangeRate(value);
    setFieldErrors((prev) => ({...prev, exchangeRate: undefined}));
  };

  const handleBsRateChange = (value) => {
    if (!isExchangeRateInput(value)) {
      return;
    }
    setBsRate(value);
    setFieldErrors((prev) => ({...prev, bsRate: undefined}));
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
    if (!isAmountInput(value, amountLimit)) {
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

  const handleReceiptNumberChange = (value) => {
    setReceiptNumber(value.replace(/[\u0000-\u001F\u007F]/g, '').slice(0, maxReceiptNumber));
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
    const isAmountAutomatic = usesSubitems;
    if (!isAmountAutomatic && (!amount || parseFloat(amount) <= 0)) {
      errors.amount = 'El monto es requerido y debe ser mayor a 0';
    }
    if (!usesSubitems && !description.trim()) {
      errors.description = 'La descripción es requerida';
    }
    if (!categoryId) {
      errors.category = 'La categoría es requerida';
    }
    else {
      const category = categories.find((current) => current.id_categoria === categoryId);
      if (category?.requiere_comprobante !== false && !imagePreview) {
        errors.image = 'El comprobante es requerido para esta categoría';
      }
    }

    if (isInternationalExpense) {
      Object.assign(errors, validateForeignCurrency(currency, exchangeRate, bsRate));
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

    return {errors, currentSubitemErrors};
  };

  const handleSave = async () => {
    const {errors, currentSubitemErrors} = validate();
    if (Object.keys(errors).length > 0 || Object.keys(currentSubitemErrors).length > 0) {
      setFieldErrors(errors);
      setSubitemErrors(currentSubitemErrors);
      return;
    }
    setFieldErrors({});
    setSubitemErrors({});
    setLoading(true);
    const payload = {
      tipo: type,
      fecha_gasto: date,
      proveedor: supplier.trim() || null,
      numero_recibo: receiptNumber.trim() || null,
      monto_total: finalAmount,
      descripcion: description.trim(),
      id_categoria_gasto: categoryId,
      mantener_imagen: !!existingImage,
      respaldos_conservados: backups.filter((backup) => backup.url).map((backup) => backup.url),
      es_gasto_internacional: isInternationalExpense,
    };
    if (isInternationalExpense) {
      Object.assign(payload, buildForeignCurrencyPayload(finalAmount, currency, exchangeRate, bsRate));
    }
    if (usesSubitems && validSubitems.length > 0) {
      payload.subitems = validSubitems.map((subitem) => ({
        descripcion: subitem.description.trim(),
        monto: parseFloat(subitem.amount),
      }));
    }
    const newBackupFiles = backups.filter((backup) => backup.file).map((backup) => backup.file);
    const data = await updateExpense(expenseId, payload, image, newBackupFiles);
    setLoading(false);
    if (data.error) {
      showError(data.error);
      return;
    }
    setSaved(true);
  };

  return {
    type, setType,
    date, supplier, receiptNumber, amount, description,
    categoryId, categories,
    imagePreview, backups, loading, loadingData,
    error, fieldErrors, saved, tripId,
    isInternationalExpense,
    currency, exchangeRate, bsRate, finalAmount,
    usesSubitems, subitems, validSubitems, subitemErrors,
    currencies,
    withholdings, hasWithholdings,
    handleImageChange, handleRemoveImage, handleAddBackup, handleRemoveBackup,
    handleAmountChange,
    handleCurrencyChange, handleExchangeRateChange, handleBsRateChange,
    handleToggleSubitems, handleAddSubitem, handleRemoveSubitem,
    handleSubitemDescriptionChange, handleSubitemAmountChange,
    handleSupplierChange, handleReceiptNumberChange,
    handleDescriptionChange, handleDateChange,
    handleCategoryChange, handleSave,
  };
}

export default useEditExpense;