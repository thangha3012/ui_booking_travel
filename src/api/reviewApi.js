import apiClient from './axios';

const getByTourId = (tourId) => {
    return apiClient.get(`/Review/tour/${tourId}`);
};

const createReview = (reviewData) => {
    return apiClient.post('/Review', reviewData);
};

const getAllForAdmin = () => {
    return apiClient.get('/Review/admin/all');
};

const updateStatus = (id, status) => {
    return apiClient.put(`/Review/${id}/status`, { status });
};

const deleteReview = (id) => {
    return apiClient.delete(`/Review/${id}`);
};

export default {
    getByTourId,
    createReview,
    getAllForAdmin,
    updateStatus,
    deleteReview
};
