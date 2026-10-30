import apiClient from './apiClient';

export const verifyDocument = async (code) => {
  try {
    const response = await apiClient.get(`/document/verify/${encodeURIComponent(code)}`);
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'No se pudo verificar el documento. Intenta nuevamente.'};
  }
};
