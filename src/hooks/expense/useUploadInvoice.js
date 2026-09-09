import {useState} from 'react';
import {extractInvoice, saveInvoice} from '../../services/expense/invoiceService';

function useUploadInvoice(tripId) {
  const [invoices, setInvoices] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [savingAll, setSavingAll] = useState(false);
  const [error, setError] = useState('');
  const [saveSummary, setSaveSummary] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [indexToDelete, setIndexToDelete] = useState(null);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 3000);
  };

  const handleAddFiles = async (files) => {
    const newInvoices = Array.from(files).map((file) => ({
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

    let baseIndex = 0;
    setInvoices((prev) => {
      baseIndex = prev.length;
      return [...prev, ...newInvoices];
    });
    await new Promise((resolve) => setTimeout(resolve, 0));

    for (let i = 0; i < newInvoices.length; i++) {
      const index = baseIndex + i;
      const data = await extractInvoice(newInvoices[i].file);
      setInvoices((prev) =>
        prev.map((invoice, idx) => {
          if (idx !== index) {
            return invoice;
          }
          let invoiceData = null;
          if (!data.error) {
            invoiceData = data;
          }
          return {
            ...invoice,
            loading: false,
            data: invoiceData,
            error: data.error || null,
            manuallyModified: false,
          };
        })
      );
      setCurrentIndex((prevIndex) => {
        if (prevIndex === null && !data.error) {
          return index;
        }
        return prevIndex;
      });
      setExpandedIndex((prevExpanded) => {
        if (prevExpanded === null && !data.error) {
          return index;
        }
        return prevExpanded;
      });
    }
  };

  const handleAddManual = () => {
    const newInvoice = {
      file: null,
      name: 'Factura Manual',
      preview: null,
      data: {
        proveedor: '',
        numero_factura: '',
        nit: '',
        fecha_emision: '',
        monto: '',
        iva: '',
        monto_total: 0,
        tipo_doc: 'F',
        detalle: [],
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

    setInvoices((prev) => {
      const newIndex = prev.length;
      setTimeout(() => {
        setCurrentIndex(newIndex);
        setExpandedIndex(newIndex);
      }, 0);
      return [...prev, newInvoice];
    });
  };

  const handleSelectInvoice = (index) => {
    setExpandedIndex((prev) => {
      if (prev === index) {
        return null;
      }
      return index;
    });
    setCurrentIndex(index);
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
    setInvoices((prev) => prev.filter((_, i) => i !== indexToDelete));
    if (currentIndex === indexToDelete) {
      setCurrentIndex(null);
    }
    if (expandedIndex === indexToDelete) {
      setExpandedIndex(null);
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
    setInvoices((prev) =>
      prev.map((invoice, i) => {
        if (i !== index) {
          return invoice;
        }
        let manuallyModified = invoice.manuallyModified;
        if (!silent) {
          manuallyModified = true;
        }
        return {
          ...invoice,
          data: {...invoice.data, [field]: value},
          fieldErrors: {...invoice.fieldErrors, [field]: undefined},
          manuallyModified,
        };
      })
    );
  };

  const handleManualImageChange = (file, index) => {
    setInvoices((prev) =>
      prev.map((invoice, i) => {
        if (i !== index) {
          return invoice;
        }
        return {
          ...invoice,
          file,
          preview: URL.createObjectURL(file),
          name: file.name,
          fieldErrors: {...invoice.fieldErrors, image: undefined},
        };
      })
    );
  };

  const handleAddDetail = (index, item) => {
    if (index === null || index === undefined) {
      return;
    }
    setInvoices((prev) =>
      prev.map((invoice, i) => {
        if (i !== index) {
          return invoice;
        }
        return {
          ...invoice,
          data: {...invoice.data, detalle: [...(invoice.data.detalle || []), item]},
          manuallyModified: true,
        };
      })
    );
  };

  const handleRemoveDetail = (index, detailIndex) => {
    if (index === null || index === undefined) {
      return;
    }
    setInvoices((prev) =>
      prev.map((invoice, i) => {
        if (i !== index) {
          return invoice;
        }
        return {
          ...invoice,
          data: {...invoice.data, detalle: invoice.data.detalle.filter((_, j) => j !== detailIndex)},
          manuallyModified: true,
        };
      })
    );
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
    if (!invoice.data.monto || parseFloat(invoice.data.monto) <= 0) {
      errors.monto = 'El monto es requerido y debe ser mayor a 0';
    }
    if (invoice.manual && !invoice.file) {
      errors.imagen = 'Debes subir una imagen o comprobante de la factura';
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

    for (let i = 0; i < invoices.length; i++) {
      const invoice = invoices[i];
      if (!invoice.data || invoice.loading || invoice.saved) {
        continue;
      }

      const errors = validateInvoice(invoice);
      if (Object.keys(errors).length > 0) {
        setInvoices((prev) =>
          prev.map((current, idx) => {
            if (idx === i) {
              return {...current, fieldErrors: errors, saveError: 'Completa los campos requeridos'};
            }
            return current;
          })
        );
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
        setInvoices((prev) =>
          prev.map((current, idx) => {
            if (idx === i) {
              return {...current, saveError: data.error, requiresAuthorization: !!data.requiereAutorizacion};
            }
            return current;
          })
        );
      }
      else {
        totalSaved++;
        setInvoices((prev) =>
          prev.map((current, idx) => {
            if (idx === i) {
              return {...current, saved: true, saveError: null, requiresAuthorization: false, fieldErrors: {}};
            }
            return current;
          })
        );
      }
    }

    setSavingAll(false);
    setSaveSummary({saved: totalSaved, failed: totalFailed});
  };

  const currentInvoice = currentIndex !== null ? invoices[currentIndex] : null;
  const hasInvoicesWithError = invoices.some((invoice) => invoice.saveError);
  const hasRequiresAuthorization = invoices.some((invoice) => invoice.requiresAuthorization);
  const allSaved = invoices.length > 0 && invoices.every((invoice) => invoice.saved || invoice.loading || invoice.error);

  return {
    invoices,
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