import {useState, useEffect} from 'react';
import {useSearchParams} from 'react-router-dom';
import {getCategories, registerExpense} from '../../services/expense/expenseService';
import {getTripDetail} from '../../services/trip/tripService';
import {compressImage} from '../../utils/imageCompressor';
import {currencies} from '../../constants/currencies';
import {calculateWithholdings} from '../../utils/withholdings';
import {filterValidSubitems, amountWithSubitems, validateSubitems, buildSubitemsPayload} from '../../utils/expenseSubitems';
import {usdCurrency, amountLimitOf, isAmountInput, isExchangeRateInput, validateForeignCurrency, buildForeignCurrencyPayload} from '../../utils/expenseCurrency';

const maxDescription = 1000;
const maxSubitemDescription = 255;
const maxReceiptNumber = 50;

let subitemCounter = 0;
let itemCounter = 0;
let backupCounter = 0;
const maxBackups = 2;

function newSubitem() {
  return {id: `s${++subitemCounter}`, description: '', amount: ''};
}

function newItem() {
  return {
    id: `g${++itemCounter}`,
    type: 'C',
    date: '',
    supplier: '',
    receiptNumber: '',
    amount: '',
    description: '',
    categoryId: null,
    image: null,
    imagePreview: null,
    backups: [],
    currency: usdCurrency,
    exchangeRate: '',
    bsRate: '',
    usesSubitems: false,
    subitems: [newSubitem()],
    fieldErrors: {},
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
  const [tripRange, setTripRange] = useState({start: null, end: null});
  const [savingAll, setSavingAll] = useState(false);
  const [saveSummary, setSaveSummary] = useState(null);
  const amountLimit = amountLimitOf(isInternationalExpense);

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
      if (data.error) {
        return;
      }
      setTripRange({start: data.viaje?.fecha_inicio?.slice(0, 10) || null, end: data.viaje?.fecha_fin?.slice(0, 10) || null});
      if (data.viaje?.tipo === 'Internacional') {
        setIsInternational(true);
      }
    };
    loadTrip();
  }, [tripId]);

  const validSubitemsOf = (item) => filterValidSubitems(item.subitems);

  const finalAmountOf = (item) => amountWithSubitems(item.amount, item.usesSubitems, validSubitemsOf(item));

  const subitemAmountsOf = (item) => {
    if (!item.usesSubitems) {
      return [];
    }
    return validSubitemsOf(item).map((subitem) => subitem.amount);
  };

  const withholdingsOf = (item) => calculateWithholdings(finalAmountOf(item), item.type, isInternationalExpense, subitemAmountsOf(item));
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
    let description = original.description;
    if (original.usesSubitems) {
      description = '';
    }
    const copy = {
      ...newItem(),
      type: original.type,
      date: original.date,
      supplier: original.supplier,
      description,
      categoryId: original.categoryId,
      currency: original.currency,
      exchangeRate: original.exchangeRate,
      bsRate: original.bsRate,
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
      item?.backups.forEach((backup) => URL.revokeObjectURL(backup.preview));
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

  const handleReceiptNumberChange = (itemId, value) => {
    updateItem(itemId, {receiptNumber: value.replace(/[\u0000-\u001F\u007F]/g, '').slice(0, maxReceiptNumber)});
  };

  const handleAmountChange = (itemId, value) => {
    if (!isAmountInput(value, amountLimit)) {
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

  const handleImageChange = async (itemId, file) => {
    if (!file) {
      return;
    }
    const compressed = await compressImage(file);
    setItems((prev) => prev.map((item) => {
      if (item.id !== itemId) {
        return item;
      }
      if (item.imagePreview) {
        URL.revokeObjectURL(item.imagePreview);
      }
      return {...item, image: compressed, imagePreview: URL.createObjectURL(compressed), fieldErrors: {...item.fieldErrors, image: undefined}};
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

  const handleAddBackup = async (itemId, file) => {
    if (!file) {
      return;
    }
    const compressed = await compressImage(file);
    setItems((prev) => prev.map((item) => {
      if (item.id !== itemId || item.backups.length >= maxBackups) {
        return item;
      }
      return {...item, backups: [...item.backups, {id: `r${++backupCounter}`, file: compressed, preview: URL.createObjectURL(compressed)}]};
    }));
  };

  const handleRemoveBackup = (itemId, backupId) => {
    setItems((prev) => prev.map((item) => {
      if (item.id !== itemId) {
        return item;
      }
      const removed = item.backups.find((backup) => backup.id === backupId);
      if (removed) {
        URL.revokeObjectURL(removed.preview);
      }
      return {...item, backups: item.backups.filter((backup) => backup.id !== backupId)};
    }));
  };

  const handleCurrencyChange = (itemId, currency) => {
    setItems((prev) => prev.map((item) => {
      if (item.id === itemId) {
        return {...item, currency, fieldErrors: {...item.fieldErrors, exchangeRate: undefined}};
      }
      return item;
    }));
  };

  const handleRateChange = (itemId, field, value) => {
    if (!isExchangeRateInput(value)) {
      return;
    }
    setItems((prev) => prev.map((item) => {
      if (item.id === itemId) {
        return {...item, [field]: value, fieldErrors: {...item.fieldErrors, [field]: undefined}};
      }
      return item;
    }));
  };

  const handleExchangeRateChange = (itemId, value) => handleRateChange(itemId, 'exchangeRate', value);
  const handleBsRateChange = (itemId, value) => handleRateChange(itemId, 'bsRate', value);

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
    if (!isAmountInput(value, amountLimit)) {
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
    else {
      const category = categories.find((current) => current.id_categoria === item.categoryId);
      if (category?.requiere_comprobante !== false && !item.imagePreview) {
        errors.image = 'El comprobante es requerido para esta categoría';
      }
    }

    if (isInternationalExpense) {
      Object.assign(errors, validateForeignCurrency(item.currency, item.exchangeRate, item.bsRate));
    }

    let subitemErrors = {};
    if (item.usesSubitems) {
      subitemErrors = validateSubitems(item.subitems);
    }

    return {errors, subitemErrors};
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
      const {errors, subitemErrors} = validateItem(item);
      if (Object.keys(errors).length > 0 || Object.keys(subitemErrors).length > 0) {
        setItems((prev) => prev.map((current) => {
          if (current.id === item.id) {
            return {...current, fieldErrors: errors, subitemErrors, saveError: 'Completa los campos requeridos'};
          }
          return current;
        }));
        failed++;
        continue;
      }
      const finalAmount = finalAmountOf(item);
      const validSubitems = validSubitemsOf(item);
      const payload = {
        id_viaje: tripId,
        tipo: item.type,
        fecha_gasto: item.date,
        proveedor: item.supplier.trim() || null,
        numero_recibo: item.receiptNumber.trim() || null,
        monto_total: finalAmount,
        descripcion: item.description.trim(),
        id_categoria_gasto: item.categoryId,
        es_gasto_internacional: isInternationalExpense,
      };
      if (isInternationalExpense) {
        Object.assign(payload, buildForeignCurrencyPayload(finalAmount, item.currency, item.exchangeRate, item.bsRate));
      }
      if (item.usesSubitems && validSubitems.length > 0) {
        payload.subitems = buildSubitemsPayload(validSubitems);
      }
      const data = await registerExpense(payload, item.image, item.backups.map((backup) => backup.file));
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
            return {...current, saved: true, saveError: null, requiresAuthorization: false, fieldErrors: {}, subitemErrors: {}};
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
    tripRange,
    savingAll,
    saveSummary,
    hasRequiresAuthorization,
    allSaved,
    pendingToSave,
    currencies,
    validSubitemsOf, finalAmountOf, withholdingsOf, hasWithholdingsOf,
    handleAddItem, handleDuplicateItem, handleRemoveItem, handleSelectItem,
    handleTypeChange, handleDateChange, handleSupplierChange, handleReceiptNumberChange, handleAmountChange,
    handleDescriptionChange, handleCategoryChange,
    handleImageChange, handleRemoveImage, handleAddBackup, handleRemoveBackup,
    handleCurrencyChange, handleExchangeRateChange, handleBsRateChange,
    handleToggleSubitems, handleAddSubitem, handleRemoveSubitem, handleSubitemDescriptionChange, handleSubitemAmountChange,
    handleSaveAll,
  };
}

export default useRegisterExpense;