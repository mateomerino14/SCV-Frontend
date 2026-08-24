import apiClient from '../shared/apiClient';

export const getTreasurerEmployees = async () => {
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
    const response = await apiClient.get('/treasurer/pending-trips', {params});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al obtener viajes pendientes'};
  }
};

export const getMyTrips = async () => {
  try {
    const response = await apiClient.get('/treasurer/my-trips');
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al obtener mis viajes'};
  }
};

export const getTripDetail = async (tripId) => {
  try {
    const response = await apiClient.get(`/treasurer/${tripId}`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al obtener detalle'};
  }
};

export const updateAmounts = async (tripId, assignedAmount, assignedAmountUsd) => {
  try {
    const response = await apiClient.put(`/treasurer/${tripId}/amounts`, {monto_asignado: assignedAmount, monto_asignado_usd: assignedAmountUsd});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al actualizar los montos'};
  }
};

export const approveTrip = async (tripId) => {
  try {
    const response = await apiClient.post(`/treasurer/${tripId}/approve`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al aprobar'};
  }
};

export const rejectTrip = async (tripId) => {
  try {
    const response = await apiClient.post(`/treasurer/${tripId}/reject`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al rechazar'};
  }
};

export const addTripComment = async (tripId, description) => {
  try {
    const response = await apiClient.post(`/treasurer/${tripId}/comment`, {descripcion: description});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al agregar comentario'};
  }
};

export const editTripComment = async (tripId, commentId, description) => {
  try {
    const response = await apiClient.put(`/treasurer/${tripId}/comment/${commentId}`, {descripcion: description});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al editar comentario'};
  }
};

export const deleteTripComment = async (tripId, commentId) => {
  try {
    const response = await apiClient.delete(`/treasurer/${tripId}/comment/${commentId}`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al eliminar comentario'};
  }
};