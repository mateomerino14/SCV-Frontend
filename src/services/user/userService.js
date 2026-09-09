import apiClient from '../shared/apiClient';

export const getMyPosition = async () => {
  try {
    const response = await apiClient.get('/user/my-position');
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al obtener cargo'};
  }
};

export const getMe = async () => {
  try {
    const response = await apiClient.get('/user/me');
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al obtener usuario'};
  }
};

export const updateProfile = async (data) => {
  try {
    const response = await apiClient.put('/user/me/update', data);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al actualizar el perfil'};
  }
};

export const updateProfilePhoto = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('foto', imageFile);
    const response = await apiClient.put('/user/me/photo', formData);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al actualizar la foto'};
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await apiClient.put('/user/me/change-password', {contrasenia_actual: currentPassword, contrasenia_nueva: newPassword});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al cambiar la contraseña'};
  }
};

export const getEmployees = async () => {
  try {
    const response = await apiClient.get('/user/employees');
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al obtener empleados'};
  }
};