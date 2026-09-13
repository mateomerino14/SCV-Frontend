import apiClient from '../shared/apiClient';

export const requestSubstitution = async (tripId, substituteId) => {
  try {
    const response = await apiClient.post(`/substitution/trip/${tripId}/request`, {id_sustituto: substituteId});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al enviar la solicitud'};
  }
};

export const getSubstitutionStatus = async (tripId) => {
  try {
    const response = await apiClient.get(`/substitution/trip/${tripId}/status`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al consultar la solicitud'};
  }
};

export const getPendingSubstitutions = async () => {
  try {
    const response = await apiClient.get('/substitution/pending');
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al obtener solicitudes'};
  }
};

export const getSubstitutionHistory = async () => {
  try {
    const response = await apiClient.get('/substitution/history');
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al obtener historial'};
  }
};

export const approveSubstitution = async (requestId) => {
  try {
    const response = await apiClient.post(`/substitution/${requestId}/approve`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al aprobar la solicitud'};
  }
};

export const rejectSubstitution = async (requestId, observation) => {
  try {
    const response = await apiClient.post(`/substitution/${requestId}/reject`, {observacion: observation});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al rechazar la solicitud'};
  }
};
