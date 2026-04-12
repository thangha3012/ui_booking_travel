import apiClient from './axios'

export const paymentApi = {
  createVNPayUrl: (bookingId) => apiClient.post(`/Payment/create-vnpay-url/${bookingId}`),
}
