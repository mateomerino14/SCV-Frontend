import apiClient from '../shared/apiClient';

export const getReviewerEmployees = async () => {
  try {
    const response = await apiClient.get('/user/employees');
    return response.data;
  }
  catch (error) {
    return {error: 'Error al obtener empleados'};
  }
};

export const getPendingReviews = async (filters = {}) => {
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
    const response = await apiClient.get('/reviewer/pending', {params});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al obtener pendientes'};
  }
};

export const getMyReviews = async (filters = {}) => {
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
    const response = await apiClient.get('/reviewer/mine', {params});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al obtener mis revisiones'};
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

export const approveReview = async (tripId) => {
  try {
    const response = await apiClient.post(`/reviewer/${tripId}/approve`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al aprobar'};
  }
};

export const rejectReview = async (tripId, observations) => {
  try {
    const response = await apiClient.post(`/reviewer/${tripId}/reject`, {observaciones: observations});
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