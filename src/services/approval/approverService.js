import apiClient from '../shared/apiClient';

export const getApproverEmployees = async () => {
  try {
    const response = await apiClient.get('/user/employees');
    return response.data;
  }
  catch (error) {
    return {error: 'Error al obtener empleados'};
  }
};

export const getPendingTrips = async (filters = {}) => {
  try {
    const params = {};
    if (filters.fecha_inicio) {
      params.fecha_inicio = filters.fecha_inicio;
    }
    if (filters.fecha_fin) {
      params.fecha_fin = filters.fecha_fin;
    }
    if (filters.id_empleado) {
      params.id_empleado = filters.id_empleado;
    }
    const response = await apiClient.get('/approver/pending-trips', {params});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al obtener viajes pendientes'};
  }
};

export const getMyTrips = async () => {
  try {
    const response = await apiClient.get('/approver/my-trips');
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al obtener mis viajes'};
  }
};

export const getTripReviewDetail = async (tripId) => {
  try {
    const response = await apiClient.get(`/approver/trip/${tripId}`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al obtener detalle'};
  }
};

export const approveTripReview = async (tripId) => {
  try {
    const response = await apiClient.post(`/approver/trip/${tripId}/approve`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al aprobar'};
  }
};

export const rejectTripReview = async (tripId) => {
  try {
    const response = await apiClient.post(`/approver/trip/${tripId}/reject`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al rechazar'};
  }
};

export const addTripReviewComment = async (tripId, description) => {
  try {
    const response = await apiClient.post(`/approver/trip/${tripId}/comment`, {descripcion: description});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al agregar comentario'};
  }
};

export const editTripReviewComment = async (tripId, commentId, description) => {
  try {
    const response = await apiClient.put(`/approver/trip/${tripId}/comment/${commentId}`, {descripcion: description});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al editar comentario'};
  }
};

export const deleteTripReviewComment = async (tripId, commentId) => {
  try {
    const response = await apiClient.delete(`/approver/trip/${tripId}/comment/${commentId}`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al eliminar comentario'};
  }
};