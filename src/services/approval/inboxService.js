import apiClient from '../shared/apiClient';

export const getInboxPage = async (inboxName, params) => {
  try {
    const response = await apiClient.get(`/inbox/${inboxName}`, {params});
    return response.data;
  }
  catch (error) {
    return {error: error.response?.data?.error || 'Error al cargar la bandeja'};
  }
};
