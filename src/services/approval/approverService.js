import apiClient from '../shared/apiClient';

export const getTripReviewDetail = async (tripId) => {
  try {
    const response = await apiClient.get(`/approver/trip/${tripId}`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al obtener detalle'};
  }
};

export const approveTripReview = async (tripId, password = null) => {
  try {
    const response = await apiClient.post(`/approver/trip/${tripId}/approve`, {contrasenia: password});
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