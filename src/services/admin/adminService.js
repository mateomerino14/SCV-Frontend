import apiClient from '../shared/apiClient';

export const getUsers = async () => {
  try {
    const response = await apiClient.get('/user/all');
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al obtener usuarios'};
  }
};

export const createUser = async (user) => {
  try {
    const response = await apiClient.post('/user', user);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al crear usuario'};
  }
};

export const updateUser = async (id, data) => {
  try {
    const response = await apiClient.put(`/user/${id}`, data);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al actualizar usuario'};
  }
};

export const suspendUser = async (id) => {
  try {
    const response = await apiClient.patch(`/user/${id}/suspend`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al suspender usuario'};
  }
};

export const activateUser = async (id) => {
  try {
    const response = await apiClient.patch(`/user/${id}/activate`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al activar usuario'};
  }
};

export const getPositions = async () => {
  try {
    const response = await apiClient.get('/position');
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al obtener cargos'};
  }
};

export const createPosition = async (position) => {
  try {
    const response = await apiClient.post('/position', position);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al crear cargo'};
  }
};

export const updatePosition = async (id, data) => {
  try {
    const response = await apiClient.put(`/position/${id}`, data);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al actualizar cargo'};
  }
};

export const suspendPosition = async (id) => {
  try {
    const response = await apiClient.patch(`/position/${id}/suspend`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al suspender cargo'};
  }
};

export const activatePosition = async (id) => {
  try {
    const response = await apiClient.patch(`/position/${id}/activate`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al activar cargo'};
  }
};

export const getSections = async () => {
  try {
    const response = await apiClient.get('/section');
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al obtener secciones'};
  }
};

export const createSection = async (section) => {
  try {
    const response = await apiClient.post('/section', section);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al crear sección'};
  }
};

export const updateSection = async (id, data) => {
  try {
    const response = await apiClient.put(`/section/${id}`, data);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al actualizar sección'};
  }
};

export const suspendSection = async (id) => {
  try {
    const response = await apiClient.patch(`/section/${id}/suspend`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al suspender sección'};
  }
};

export const activateSection = async (id) => {
  try {
    const response = await apiClient.patch(`/section/${id}/activate`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al activar sección'};
  }
};

export const getDashboard = async () => {
  try {
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al obtener dashboard'};
  }
};

export const getAudits = async (filters = {}) => {
  try {
    const params = {};
    if (filters.tipo) {
      params.tipo = filters.tipo;
    }
    if (filters.id_usuario) {
      params.id_usuario = filters.id_usuario;
    }
    if (filters.fecha_inicio) {
      params.fecha_inicio = filters.fecha_inicio;
    }
    if (filters.fecha_fin) {
      params.fecha_fin = filters.fecha_fin;
    }
    const response = await apiClient.get('/audit', {params});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al obtener el historial de auditoría'};
  }
};