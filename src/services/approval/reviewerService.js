import apiClient from '../shared/apiClient';

export const getReviewerEmployees = async () => {
  try {
    const response = await apiClient.get('/user/employees');
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al obtener empleados'};
  }
};

export const getReviewDetail = async (tripId) => {
  try {
    const response = await apiClient.get(`/reviewer/${tripId}`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al obtener detalle'};
  }
};

export const approveReview = async (tripId, password = null) => {
  try {
    const response = await apiClient.post(`/reviewer/${tripId}/approve`, {contrasenia: password});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al aprobar'};
  }
};

export const rejectReview = async (tripId) => {
  try {
    const response = await apiClient.post(`/reviewer/${tripId}/reject`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al rechazar'};
  }
};

export const addReviewComment = async (tripId, description, expenseId = null) => {
  try {
    const response = await apiClient.post(`/reviewer/${tripId}/comment`, {descripcion: description, id_gasto: expenseId});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al agregar comentario'};
  }
};

export const editReviewComment = async (tripId, commentId, description) => {
  try {
    const response = await apiClient.put(`/reviewer/${tripId}/comment/${commentId}`, {descripcion: description});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al editar comentario'};
  }
};

export const deleteReviewComment = async (tripId, commentId) => {
  try {
    const response = await apiClient.delete(`/reviewer/${tripId}/comment/${commentId}`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al eliminar comentario'};
  }
};