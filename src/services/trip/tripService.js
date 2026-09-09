import apiClient from '../shared/apiClient';

export const getDashboard = async () => {
  try {
    const response = await apiClient.get('/trip/dashboard');
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al obtener dashboard'};
  }
};

export const createTrip = async (trip) => {
  try {
    const response = await apiClient.post('/trip', trip);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al crear viaje'};
  }
};

export const getTripDetail = async (tripId) => {
  try {
    const response = await apiClient.get(`/trip/${tripId}`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al obtener el viaje'};
  }
};

export const confirmCompletion = async (tripId, justification) => {
  try {
    const response = await apiClient.put(`/trip/${tripId}/confirm-completion`, {justificacion: justification});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al confirmar finalización'};
  }
};

export const editTrip = async (tripId, data) => {
  try {
    const response = await apiClient.put(`/trip/${tripId}/edit`, data);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al editar el viaje'};
  }
};

export const getTripHistory = async (page = 1, limit = 20, filter = 'TODOS') => {
  try {
    const response = await apiClient.get('/trip/history', {params: {pagina: page, limite: limit, filtro: filter}});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al obtener el historial'};
  }
};

export const submitTripForReview = async (tripId) => {
  try {
    const response = await apiClient.put(`/trip/${tripId}/submit-review`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al enviar el viaje a revisión'};
  }
};