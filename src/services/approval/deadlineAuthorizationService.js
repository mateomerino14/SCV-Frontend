import apiClient from '../shared/apiClient';

export const requestAuthorization = async (tripId, reason) => {
  try {
    const response = await apiClient.post(`/deadline-authorization/trip/${tripId}/request`, {motivo: reason});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al enviar la solicitud'};
  }
};

export const getRequestStatus = async (tripId) => {
  try {
    const response = await apiClient.get(`/deadline-authorization/trip/${tripId}/status`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al consultar la solicitud'};
  }
};

export const getPendingRequests = async () => {
  try {
    const response = await apiClient.get('/deadline-authorization/pending');
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al obtener solicitudes'};
  }
};

export const getRequestHistory = async () => {
  try {
    const response = await apiClient.get('/deadline-authorization/history');
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al obtener historial'};
  }
};

export const approveRequest = async (requestId) => {
  try {
    const response = await apiClient.post(`/deadline-authorization/${requestId}/approve`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al aprobar la solicitud'};
  }
};

export const rejectRequest = async (requestId, observation) => {
  try {
    const response = await apiClient.post(`/deadline-authorization/${requestId}/reject`, {observacion: observation});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al rechazar la solicitud'};
  }
};