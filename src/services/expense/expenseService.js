import apiClient from '../shared/apiClient';

export const getCategories = async () => {
  try {
    const response = await apiClient.get('/expense-category');
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al obtener las categorías'};
  }
};

export const registerExpense = async (data, imageFile) => {
  try {
    const formData = new FormData();
    formData.append('datos', JSON.stringify(data));
    if (imageFile) {
      formData.append('imagen', imageFile);
    }
    const response = await apiClient.post('/expense/register', formData);
    return response.data;
  }
  catch (error) {
    return {
      error: error.response?.data?.error || 'Error al registrar el gasto',
      requiereAutorizacion: !!error.response?.data?.requiereAutorizacion,
    };
  }
};

export const getExpenseDetail = async (expenseId) => {
  try {
    const response = await apiClient.get(`/expense/${expenseId}/detail`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al obtener el gasto'};
  }
};

export const updateExpense = async (expenseId, data, imageFile) => {
  try {
    const formData = new FormData();
    formData.append('datos', JSON.stringify(data));
    if (imageFile) {
      formData.append('imagen', imageFile);
    }
    const response = await apiClient.put(`/expense/${expenseId}/update`, formData);
    return response.data;
  }
  catch (error) {
    return {
      error: error.response?.data?.error || 'Error al actualizar el gasto',
      requiereAutorizacion: !!error.response?.data?.requiereAutorizacion,
    };
  }
};

export const deleteExpense = async (expenseId) => {
  try {
    const response = await apiClient.delete(`/expense/${expenseId}`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al eliminar el gasto'};
  }
};

export const sendGroupedReceipt = async (tripId, type, isInternational = false) => {
  try {
    const response = await apiClient.post(`/expense/trip/${tripId}/receipt/${type}`, null, {params: {internacional: isInternational}});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al generar el recibo'};
  }
};

export const sendIndividualReceipt = async (expenseId) => {
  try {
    const response = await apiClient.post(`/expense/${expenseId}/receipt`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al generar el recibo'};
  }
};