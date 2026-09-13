import {useState, useEffect} from 'react';
import {getExpenseDetail, getCategories} from '../../services/expense/expenseService';
import {updateInvoice} from '../../services/expense/invoiceService';
import {compressImage} from '../../utils/imageCompressor';

function useEditInvoice(expenseId) {
  const [data, setData] = useState(null);
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
  const [manuallyModified, setManuallyModified] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      const categoriesData = await getCategories();
      if (!categoriesData.error) {
        setCategories(categoriesData);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoadingData(true);
      const expenseData = await getExpenseDetail(expenseId);
      setLoadingData(false);
      if (expenseData.error) {
        return;
      }
      setTripId(expenseData.id_viaje || null);
      setManuallyModified(expenseData.modificado || false);
      const invoice = expenseData.Factura;
      const amount = parseFloat(invoice?.monto_parcial || 0);
      const tax = invoice?.Factura_Impuestos?.[0]?.Impuesto;
      const percentage = tax?.porcentaje || 0;
      const vat = parseFloat(((amount * percentage) / 100).toFixed(2));
      const totalAmount = parseFloat(expenseData.monto_total || 0);
      let amountText = '';
      if (amount > 0) {
        amountText = amount.toString();
      }
      let vatText = '';
      if (vat > 0) {
        vatText = vat.toString();
      }
      let totalAmountText = '';
      if (totalAmount > 0) {
        totalAmountText = totalAmount.toString();
      }
      setData({
        proveedor: expenseData.Proveedor?.nombre || '',
        numero_factura: invoice?.numero_factura || '',
        nit: expenseData.Proveedor?.numero_doc_fiscal || '',
        fecha_emision: invoice?.fecha_emision || '',
        monto: amountText,
        iva: vatText,
        monto_total: totalAmountText,
        tipo_doc: expenseData.tipo || 'F',
        detalle: invoice?.Detalle_Factura || [],
        id_categoria_gasto: expenseData.id_categoria || null,
      });
      if (expenseData.Imagen?.url_archivo) {
        setExistingImage(expenseData.Imagen.url_archivo);
        setImagePreview(expenseData.Imagen.url_archivo);
      }
    };
    load();
  }, [expenseId]);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 3000);
  };

  const handleFieldChange = (field, value) => {
    setData((prev) => ({...prev, [field]: value}));
    setManuallyModified(true);
    setFieldErrors((prev) => ({...prev, [field]: undefined}));
  };

  const handleAddDetail = (item) => {
    setData((prev) => ({...prev, detalle: [...(prev.detalle || []), item]}));
    setManuallyModified(true);
  };

  const handleRemoveDetail = (index) => {
    setData((prev) => ({...prev, detalle: prev.detalle.filter((_, current) => current !== index)}));
    setManuallyModified(true);
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
  };

  const handleRemoveImage = () => {
    if (imagePreview && !existingImage) {
      URL.revokeObjectURL(imagePreview);
    }
    setImage(null);
    setImagePreview(null);
    setExistingImage(null);
  };

  const validate = () => {
    const errors = {};
    if (!data?.proveedor?.trim()) {
      errors.proveedor = 'El proveedor es requerido';
    }
    if (!data?.numero_factura?.trim()) {
      errors.numero_factura = 'El número de factura es requerido';
    }
    if (!data?.fecha_emision) {
      errors.fecha_emision = 'La fecha de emisión es requerida';
    }
    if (!data?.monto || parseFloat(data.monto) <= 0) {
      errors.monto = 'El monto es requerido y debe ser mayor a 0';
    }
    if (!data?.id_categoria_gasto) {
      errors.id_categoria_gasto = 'La categoría es requerida';
    }
    return errors;
  };

  const handleSave = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setLoading(true);
    const amount = parseFloat(data.monto || 0);
    const vat = parseFloat(data.iva || 0);
    const totalAmount = parseFloat((amount + vat).toFixed(2));
    const payload = {
      ...data,
      monto: amount,
      iva: vat,
      monto_total: totalAmount,
      id_viaje: tripId,
      mantener_imagen: !!existingImage,
      modificado_manualmente: manuallyModified,
    };
    const result = await updateInvoice(expenseId, payload, image);
    setLoading(false);
    if (result.error) {
      showError(result.error);
      return;
    }
    setSaved(true);
  };

  return {
    data,
    categories,
    imagePreview,
    existingImage,
    loading,
    loadingData,
    error,
    fieldErrors,
    saved,
    manuallyModified,
    tripId,
    handleFieldChange,
    handleAddDetail,
    handleRemoveDetail,
    handleImageChange,
    handleRemoveImage,
    handleSave,
  };
}

export default useEditInvoice;