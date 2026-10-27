import {useState, useEffect, useRef} from 'react';
import {extractInvoice, saveInvoice} from '../../services/expense/invoiceService';
import {getCategories} from '../../services/expense/expenseService';
import {compressImage} from '../../utils/imageCompressor';

const validationSaveError = 'Completa los campos requeridos';

const clearFieldErrors = (invoice, fields) => {
  const fieldErrors = {...invoice.fieldErrors};
  fields.forEach((field) => {
    delete fieldErrors[field];
  });
  const hasErrors = Object.values(fieldErrors).some(Boolean);
  let saveError = invoice.saveError;
  if (!hasErrors && saveError === validationSaveError) {
    saveError = null;
  }
  return {fieldErrors, saveError};
};

const positionOf = (invoices, id) => {
  const position = invoices.findIndex((invoice) => invoice.id === id);
  if (position === -1) {
    return null;
  }
  return position;
};

function useUploadInvoice(tripId) {
  const [invoices, setInvoices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const lastInvoiceId = useRef(0);
  const [savingAll, setSavingAll] = useState(false);
  const [error, setError] = useState('');
  const [saveSummary, setSaveSummary] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [indexToDelete, setIndexToDelete] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await getCategories();
      if (!data.error) {
        setCategories(data);
      }
    };
    loadCategories();
  }, []);

  const createInvoiceId = () => {
    lastInvoiceId.current += 1;
    return lastInvoiceId.current;
  };

  const idAt = (index) => invoices[index]?.id ?? null;

  const updateInvoice = (id, update) => {
    setInvoices((prev) => prev.map((invoice) => {
      if (invoice.id !== id) {
        return invoice;
      }
      return update(invoice);
    }));
  };

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 3000);
  };

  const handleAddFiles = async (files) => {
    const compressedFiles = await Promise.all(Array.from(files).map((file) => compressImage(file)));
    const newInvoices = compressedFiles.map((file) => ({
      id: createInvoiceId(),
      file,
      name: file.name,
      preview: URL.createObjectURL(file),
      data: null,
      loading: true,
      error: null,
      saved: false,
      saveError: null,
      requiresAuthorization: false,
      fieldErrors: {},
      manuallyModified: false,
      manual: false,
    }));

    setInvoices((prev) => [...prev, ...newInvoices]);
    for (const newInvoice of newInvoices) {
      const data = await extractInvoice(newInvoice.file);
      let invoiceData = null;
      if (!data.error) {
        invoiceData = {...data, id_categoria_gasto: null};
      }
      updateInvoice(newInvoice.id, (invoice) => ({
        ...invoice,
        loading: false,
        data: invoiceData,
        error: data.error || null,
        manuallyModified: false,
      }));
      if (!data.error) {
        setCurrentId((previous) => previous ?? newInvoice.id);
        setExpandedId((previous) => previous ?? newInvoice.id);
      }
    }
  };

  const handleAddManual = () => {
    const newInvoice = {
      id: createInvoiceId(),
      file: null,
      name: 'Factura Manual',
      preview: null,
      data: {
        proveedor: '',
        numero_factura: '',
        nit: '',
        cuf: '',
        fecha_emision: '',
        monto: '',
        iva: '',
        monto_total: '',
        tipo_doc: 'F',
        detalle: [],
        id_categoria_gasto: null,
      },
      loading: false,
      error: null,
      saved: false,
      saveError: null,
      requiresAuthorization: false,
      fieldErrors: {},
      manuallyModified: true,
      manual: true,
    };

    setInvoices((prev) => [...prev, newInvoice]);
    setCurrentId(newInvoice.id);
    setExpandedId(newInvoice.id);
  };

  const handleSelectInvoice = (index) => {
    const id = idAt(index);
    setExpandedId((previous) => {
      if (previous === id) {
        return null;
      }
      return id;
    });
    setCurrentId(id);
  };

  const handleRequestDelete = (index) => {
    setIndexToDelete(index);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    const invoiceToDelete = invoices[indexToDelete];
    if (invoiceToDelete?.preview) {
      URL.revokeObjectURL(invoiceToDelete.preview);
    }
    const deletedId = invoiceToDelete?.id;
    setInvoices((prev) => prev.filter((invoice) => invoice.id !== deletedId));
    if (currentId === deletedId) {
      setCurrentId(null);
    }
    if (expandedId === deletedId) {
      setExpandedId(null);
    }
    setShowDeleteModal(false);
    setIndexToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setIndexToDelete(null);
  };

  const handleFieldChange = (index, field, value, silent = false) => {
    if (index === null || index === undefined) {
      return;
    }
    updateInvoice(idAt(index), (invoice) => {
      let manuallyModified = invoice.manuallyModified;
      if (!silent) {
        manuallyModified = true;
      }
      return {
        ...invoice,
        data: {...invoice.data, [field]: value},
        ...clearFieldErrors(invoice, [field]),
        manuallyModified,
      };
    });
  };

  const handleManualImageChange = async (file, index) => {
    if (!file) {
      return;
    }
    const id = idAt(index);
    const compressed = await compressImage(file);
    updateInvoice(id, (invoice) => {
      if (invoice.preview) {
        URL.revokeObjectURL(invoice.preview);
      }
      return {
        ...invoice,
        file: compressed,
        preview: URL.createObjectURL(compressed),
        name: compressed.name,
        ...clearFieldErrors(invoice, ['image']),
      };
    });
  };

  const handleAddDetail = (index, item) => {
    if (index === null || index === undefined) {
      return;
    }
    updateInvoice(idAt(index), (invoice) => ({
      ...invoice,
      data: {...invoice.data, detalle: [...(invoice.data.detalle || []), item]},
      ...clearFieldErrors(invoice, ['detalle']),
      manuallyModified: true,
    }));
  };

  const handleRemoveDetail = (index, detailIndex) => {
    if (index === null || index === undefined) {
      return;
    }
    updateInvoice(idAt(index), (invoice) => ({
      ...invoice,
      data: {...invoice.data, detalle: invoice.data.detalle.filter((_, j) => j !== detailIndex)},
      manuallyModified: true,
    }));
  };

  const validateInvoice = (invoice) => {
    const errors = {};
    if (!invoice.data.proveedor?.trim()) {
      errors.proveedor = 'El proveedor es requerido';
    }
    if (!invoice.data.numero_factura?.trim()) {
      errors.numero_factura = 'El número de factura es requerido';
    }
    if (!invoice.data.fecha_emision) {
      errors.fecha_emision = 'La fecha de emisión es requerida';
    }
    if (!invoice.data.monto_total || parseFloat(invoice.data.monto_total) <= 0) {
      errors.monto_total = 'El total de la factura es requerido y debe ser mayor a 0';
    }
    if (!invoice.data.id_categoria_gasto) {
      errors.id_categoria_gasto = 'La categoría es requerida';
    }
    if (invoice.manual && !invoice.file) {
      errors.image = 'Debes subir una imagen o comprobante de la factura';
    }
    if (!invoice.data.detalle || invoice.data.detalle.length === 0) {
      errors.detalle = 'Debes agregar al menos un producto al detalle';
    }
    return errors;
  };

  const handleSave = async () => {
    const readyInvoices = invoices.filter((invoice) => invoice.data !== null && !invoice.loading && !invoice.saved);
    if (readyInvoices.length === 0) {
      showError('No hay facturas listas para guardar');
      return;
    }
    setSavingAll(true);
    setSaveSummary(null);
    let totalSaved = 0;
    let totalFailed = 0;
    for (const invoice of invoices) {
      if (!invoice.data || invoice.loading || invoice.saved) {
        continue;
      }
      const errors = validateInvoice(invoice);
      if (Object.keys(errors).length > 0) {
        updateInvoice(invoice.id, (current) => ({...current, fieldErrors: errors, saveError: validationSaveError}));
        totalFailed++;
        continue;
      }
      const data = await saveInvoice(
        {
          id_viaje: tripId,
          ...invoice.data,
          modificado_manualmente: invoice.manuallyModified,
        },
        invoice.file
      );
      if (data.error) {
        totalFailed++;
        updateInvoice(invoice.id, (current) => ({...current, saveError: data.error, requiresAuthorization: !!data.requiereAutorizacion}));
      }
      else {
        totalSaved++;
        updateInvoice(invoice.id, (current) => ({...current, saved: true, saveError: null, requiresAuthorization: false, fieldErrors: {}}));
      }
    }
    setSavingAll(false);
    setSaveSummary({saved: totalSaved, failed: totalFailed});
  };

  const currentIndex = positionOf(invoices, currentId);
  const expandedIndex = positionOf(invoices, expandedId);
  let currentInvoice = null;
  if (currentIndex !== null) {
    currentInvoice = invoices[currentIndex];
  }
  const hasInvoicesWithError = invoices.some((invoice) => invoice.saveError);
  const hasRequiresAuthorization = invoices.some((invoice) => invoice.requiresAuthorization);
  const allSaved = invoices.length > 0 && invoices.every((invoice) => invoice.saved || invoice.loading || invoice.error);

  return {
    invoices,
    categories,
    currentInvoice,
    currentIndex,
    expandedIndex,
    savingAll,
    error,
    saveSummary,
    showDeleteModal,
    hasInvoicesWithError,
    hasRequiresAuthorization,
    allSaved,
    handleAddFiles,
    handleAddManual,
    handleSelectInvoice,
    handleRequestDelete,
    handleConfirmDelete,
    handleCancelDelete,
    handleFieldChange,
    handleManualImageChange,
    handleAddDetail,
    handleRemoveDetail,
    handleSave,
  };
}

export default useUploadInvoice;