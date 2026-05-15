import apiClient from './axios';

// Lấy danh sách đánh giá của một tour
const getByTourId = (tourId) => {
    return apiClient.get(`/Review/tour/${tourId}`);
};

// Gửi đánh giá mới cho tour
const createReview = (reviewData) => {
    return apiClient.post('/Review', reviewData);
};

// Lấy toàn bộ danh sách đánh giá (Admin)
const getAllForAdmin = () => {
    return apiClient.get('/Review/admin/all');
};

// Cập nhật trạng thái duyệt/ẩn đánh giá (Admin)
const updateStatus = (id, status) => {
    return apiClient.put(`/Review/${id}/status`, { status });
};

// Xóa đánh giá (Admin)
const deleteReview = (id) => {
    return apiClient.delete(`/Review/${id}`);
};

export default {
    getByTourId,
    createReview,
    getAllForAdmin,
    updateStatus,
    deleteReview,
    // Lấy danh sách các đánh giá mới nhất đã duyệt
    getLatest: (count = 6) => apiClient.get(`/Review/latest?count=${count}`)
};
