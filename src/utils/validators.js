// src/utils/validators.js

export const validators = {
  required: (v) => !!v || 'Trường này là bắt buộc',

  email: (v) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(v) || 'Email không hợp lệ'
  },

  minLength: (min) => (v) => (v && v.length >= min) || `Tối thiểu ${min} ký tự`,

  maxLength: (max) => (v) => (!v || v.length <= max) || `Tối đa ${max} ký tự`,

  phone: (v) => {
    const pattern = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/
    return pattern.test(v) || 'Số điện thoại không hợp lệ'
  },

  passwordMatch: (password) => (v) => v === password || 'Mật khẩu không khớp',
}
