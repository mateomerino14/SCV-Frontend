import apiClient from '../shared/apiClient';

export const getPendingAlcoholReviews = async (filters = {}) => {
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
    if (filters.id_seccion) {
      params.id_seccion = filters.id_seccion;
    }
    const response = await apiClient.get('/approver/alcohol-review/pending', {params});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al obtener pendientes'};
  }
};

export const getMyAlcoholReviews = async (filters = {}) => {
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
    if (filters.id_seccion) {
      params.id_seccion = filters.id_seccion;
    }
    const response = await apiClient.get('/approver/alcohol-review/mine', {params});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al obtener mis revisiones'};
  }
};

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

export const approveAlcoholReview = async (tripId) => {
  try {
    const response = await apiClient.post(`/approver/alcohol-review/${tripId}/approve`);
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
