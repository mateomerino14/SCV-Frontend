import apiClient from '../shared/apiClient';

export const takeAlcoholReview = async (tripId) => {
  try {
    const response = await apiClient.post(`/approver/alcohol-review/${tripId}/take`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al tomar la revisión'};
  }
};

export const returnAlcoholReview = async (tripId) => {
  try {
    const response = await apiClient.post(`/approver/alcohol-review/${tripId}/return`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al devolver la revisión'};
  }
};

export const getAlcoholReviewDetail = async (tripId) => {
  try {
    const response = await apiClient.get(`/approver/alcohol-review/${tripId}`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al obtener detalle'};
  }
};

export const approveAlcoholReview = async (tripId, password = null) => {
  try {
    const response = await apiClient.post(`/approver/alcohol-review/${tripId}/approve`, {contrasenia: password});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al aprobar'};
  }
};

export const rejectAlcoholReview = async (tripId) => {
  try {
    const response = await apiClient.post(`/approver/alcohol-review/${tripId}/reject`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al rechazar'};
  }
};

export const addAlcoholReviewComment = async (tripId, description, expenseId = null) => {
  try {
    const response = await apiClient.post(`/approver/alcohol-review/${tripId}/comment`, {descripcion: description, id_gasto: expenseId});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al agregar comentario'};
  }
};

export const editAlcoholReviewComment = async (tripId, commentId, description) => {
  try {
    const response = await apiClient.put(`/approver/alcohol-review/${tripId}/comment/${commentId}`, {descripcion: description});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al editar comentario'};
  }
};

export const deleteAlcoholReviewComment = async (tripId, commentId) => {
  try {
    const response = await apiClient.delete(`/approver/alcohol-review/${tripId}/comment/${commentId}`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al eliminar comentario'};
  }
};
