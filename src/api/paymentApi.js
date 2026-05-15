import apiClient from './axios'

export const paymentApi = {
  // Tạo yêu cầu thanh toán ZaloPay cho đơn hàng
  createZaloPayOrder: (bookingId) => apiClient.post(`/Payment/create-zalopay-order/${bookingId}`),
  // Gửi thông tin phản hồi từ ZaloPay về server để xác thực
  zalopayReturn: (queryParams) => apiClient.get('/Payment/zalopay-return', { params: queryParams })
}
