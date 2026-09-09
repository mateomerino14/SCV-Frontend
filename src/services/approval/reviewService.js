import apiClient from '../shared/apiClient';

export const getReviewEmployees = async () => {
  try {
    const response = await apiClient.get('/user/employees');
    return response.data;
  }
  catch (error) {
    return {error: 'Error al obtener empleados'};
  }
};

export const getPendingTripReviews = async (filters = {}) => {
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
    const response = await apiClient.get('/review/trip-review/pending', {params});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al obtener viajes pendientes'};
  }
};

export const getMyTripReviews = async () => {
  try {
    const response = await apiClient.get('/review/trip-review/mine');
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al obtener mis viajes'};
  }
};

export const takeTripReview = async (tripId) => {
  try {
    const response = await apiClient.post(`/review/trip-review/${tripId}/take`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al tomar el viaje'};
  }
};

export const returnTripReview = async (tripId) => {
  try {
    const response = await apiClient.post(`/review/trip-review/${tripId}/return`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al devolver el viaje'};
  }
};

export const getTripReviewDetail = async (tripId) => {
  try {
    const response = await apiClient.get(`/review/trip-review/${tripId}`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al obtener detalle'};
  }
};

export const approveTripReview = async (tripId) => {
  try {
    const response = await apiClient.post(`/review/trip-review/${tripId}/approve`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al aprobar'};
  }
};

export const rejectTripReview = async (tripId) => {
  try {
    const response = await apiClient.post(`/review/trip-review/${tripId}/reject`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al rechazar'};
  }
};

export const addTripReviewComment = async (tripId, description) => {
  try {
    const response = await apiClient.post(`/review/trip-review/${tripId}/comment`, {descripcion: description});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al agregar comentario'};
  }
};

export const editTripReviewComment = async (tripId, commentId, description) => {
  try {
    const response = await apiClient.put(`/review/trip-review/${tripId}/comment/${commentId}`, {descripcion: description});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al editar comentario'};
  }
};

export const deleteTripReviewComment = async (tripId, commentId) => {
  try {
    const response = await apiClient.delete(`/review/trip-review/${tripId}/comment/${commentId}`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al eliminar comentario'};
  }
};

export const getPendingExpenseReviews = async (filters = {}) => {
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
    const response = await apiClient.get('/review/expense-review/pending', {params});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al obtener pendientes'};
  }
};

export const getMyExpenseReviews = async (filters = {}) => {
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
    const response = await apiClient.get('/review/expense-review/mine', {params});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al obtener mis revisiones'};
  }
};

export const takeExpenseReview = async (tripId) => {
  try {
    const response = await apiClient.post(`/review/expense-review/${tripId}/take`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al tomar la revisión'};
  }
};

export const returnExpenseReview = async (tripId) => {
  try {
    const response = await apiClient.post(`/review/expense-review/${tripId}/return`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al devolver la revisión'};
  }
};

export const getExpenseReviewDetail = async (tripId) => {
  try {
    const response = await apiClient.get(`/review/expense-review/${tripId}`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al obtener detalle'};
  }
};

export const approveExpenseReview = async (tripId) => {
  try {
    const response = await apiClient.post(`/review/expense-review/${tripId}/approve`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al aprobar'};
  }
};

export const rejectExpenseReview = async (tripId, observations) => {
  try {
    const response = await apiClient.post(`/review/expense-review/${tripId}/reject`, {observaciones: observations});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al rechazar'};
  }
};

export const addExpenseReviewComment = async (tripId, description, expenseId = null) => {
  try {
    const response = await apiClient.post(`/review/expense-review/${tripId}/comment`, {descripcion: description, id_gasto: expenseId});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al agregar comentario'};
  }
};

export const editExpenseReviewComment = async (tripId, commentId, description) => {
  try {
    const response = await apiClient.put(`/review/expense-review/${tripId}/comment/${commentId}`, {descripcion: description});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al editar comentario'};
  }
};

export const deleteExpenseReviewComment = async (tripId, commentId) => {
  try {
    const response = await apiClient.delete(`/review/expense-review/${tripId}/comment/${commentId}`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al eliminar comentario'};
  }
};