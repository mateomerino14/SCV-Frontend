import apiClient from '../shared/apiClient';

export const extractInvoice = async (file) => {
  try {
    const formData = new FormData();
    formData.append('factura', file);
    const response = await apiClient.post('/invoice/extract', formData);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al extraer la factura'};
  }
};

export const saveInvoice = async (data, imageFile) => {
  try {
    const formData = new FormData();
    formData.append('datos', JSON.stringify(data));
    if (imageFile) {
      formData.append('imagen', imageFile);
    }
    const response = await apiClient.post('/invoice/save', formData);
    return response.data;
  }
  catch (error) {
    return {
      error: error.response?.data?.error || 'Error al guardar la factura',
      requiereAutorizacion: !!error.response?.data?.requiereAutorizacion,
    };
  }
};

export const updateInvoice = async (expenseId, data, imageFile) => {
  try {
    const formData = new FormData();
    formData.append('datos', JSON.stringify(data));
    if (imageFile) {
      formData.append('imagen', imageFile);
    }
    const response = await apiClient.put(`/invoice/${expenseId}/update`, formData);
    return response.data;
  }
  catch (error) {
    return {
      error: error.response?.data?.error || 'Error al actualizar la factura',
      requiereAutorizacion: !!error.response?.data?.requiereAutorizacion,
    };
  }
};