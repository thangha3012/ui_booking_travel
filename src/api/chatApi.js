import apiClient from './axios';

export const chatApi = {
    sendMessage: (message) => apiClient.post('/Chat', { message })
};

export default chatApi;
