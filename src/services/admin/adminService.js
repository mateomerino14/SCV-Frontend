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

export const getDashboard = async () => {
  try {
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al obtener dashboard'};
  }
};