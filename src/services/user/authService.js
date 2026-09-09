import apiClient from '../shared/apiClient';

export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/auth', {email_corporativo: email, contrasenia: password});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Credenciales incorrectas'};
  }
};

export const logout = async () => {
  try {
    await apiClient.post('/auth/logout');
  }
  catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
  finally {
    localStorage.removeItem('token');
  }
};

export const checkEmail = async (email) => {
  try {
    const response = await apiClient.post('/user/check-email', {email_corporativo: email});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al verificar email'};
  }
};

export const sendCode = async (email) => {
  try {
    const response = await apiClient.post('/auth/send-code', {email_corporativo: email});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al enviar código'};
  }
};

export const verifyCode = async (email, code) => {
  try {
    const response = await apiClient.post('/auth/verify-code', {email_corporativo: email, codigo: code});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Código incorrecto'};
  }
};