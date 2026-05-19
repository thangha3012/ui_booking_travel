<template>
  <div class="contact-view">
    <!-- Header -->
    <section class="page-hero">
      <div class="container">
        <span class="page-hero__label">Kết nối</span>
        <h1 class="page-hero__title">Liên Hệ</h1>
        <div class="page-hero__breadcrumb">
          <RouterLink to="/">Trang chủ</RouterLink>
          <i class="pi pi-angle-right"></i>
          <span class="current">Liên hệ</span>
        </div>
      </div>
    </section>

    <section class="section contact-body">
      <div class="container">
        <div class="contact-grid">
          <!-- Contact Info -->
          <div class="contact-info">
            <div class="info-card">
              <div class="info-item">
                <div class="icon"><i class="pi pi-map-marker"></i></div>
                <div>
                  <h3>Địa chỉ văn phòng</h3>
                  <p>123 Đường Du Lịch, Quận 1, TP. Hồ Chí Minh</p>
                </div>
              </div>
              <div class="info-item">
                <div class="icon"><i class="pi pi-phone"></i></div>
                <div>
                  <h3>Hotline hỗ trợ</h3>
                  <p>1900 123 456</p>
                  <p>090 888 9999</p>
                </div>
              </div>
              <div class="info-item">
                <div class="icon"><i class="pi pi-envelope"></i></div>
                <div>
                  <h3>Email liên hệ</h3>
                  <p>hello@triptopia.vn</p>
                  <p>support@triptopia.vn</p>
                </div>
              </div>
              <div class="info-item">
                <div class="icon"><i class="pi pi-clock"></i></div>
                <div>
                  <h3>Giờ làm việc</h3>
                  <p>Thứ 2 - Thứ 7: 08:00 - 18:00</p>
                  <p>Chủ nhật: 09:00 - 16:00</p>
                </div>
              </div>
            </div>

            <div class="social-box">
              <h3>Theo dõi chúng tôi</h3>
              <div class="social-links">
                <a href="#" class="social-btn fb"><i class="pi pi-facebook"></i></a>
                <a href="#" class="social-btn ig"><i class="pi pi-instagram"></i></a>
                <a href="#" class="social-btn tw"><i class="pi pi-twitter"></i></a>
                <a href="#" class="social-btn yt"><i class="pi pi-youtube"></i></a>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="contact-form-container">
            <form @submit.prevent="handleSubmit" class="contact-form">
              <div class="form-header">
                <h2>Gửi yêu cầu tư vấn</h2>
                <p>Điền thông tin dưới đây, chúng tôi sẽ phản hồi trong vòng 24h.</p>
              </div>
              <div class="form-grid">
                <div class="form-group">
                  <label>Họ và tên</label>
                  <input type="text" v-model="form.name" placeholder="Nguyễn Văn A" required />
                </div>
                <div class="form-group">
                  <label>Số điện thoại</label>
                  <input type="tel" v-model="form.phone" placeholder="0901234567" required />
                </div>
                <div class="form-group full">
                  <label>Địa chỉ Email</label>
                  <input type="email" v-model="form.email" placeholder="email@gmail.com" required />
                </div>
                <div class="form-group full">
                  <label>Chủ đề</label>
                  <select v-model="form.subject">
                    <option value="consult">Tư vấn tour</option>
                    <option value="feedback">Góp ý dịch vụ</option>
                    <option value="partner">Hợp tác kinh doanh</option>
                    <option value="other">Vấn đề khác</option>
                  </select>
                </div>
                <div class="form-group full">
                  <label>Nội dung tin nhắn</label>
                  <textarea v-model="form.message" rows="5" placeholder="Bạn cần chúng tôi hỗ trợ điều gì?"></textarea>
                </div>
              </div>
              <button type="submit" class="btn-submit" :disabled="submitting">
                <i class="pi pi-send"></i>
                {{ submitting ? 'Đang gửi...' : 'Gửi tin nhắn ngay' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Map Section -->
    <section class="map-section">
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m12!1m3!1d3919.460232428357!2d106.6647221!3d10.7760194!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3855799c43%3A0x1d227b2c93994e43!2zSOG7kyBDaMOtIE1pbmgsIFRowrG deG7mSBOaOG6pXQsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1625624567890!5m2!1svi!2s" 
        width="100%" height="500" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  name: '',
  phone: '',
  email: '',
  subject: 'consult',
  message: ''
})

const submitting = ref(false)

function handleSubmit() {
  submitting.ref = true
  // Giả lập gửi API
  setTimeout(() => {
    alert('Cảm ơn bạn! Chúng tôi đã nhận được yêu cầu và sẽ liên hệ lại sớm nhất.')
    submitting.value = false
    form.value = { name: '', phone: '', email: '', subject: 'consult', message: '' }
  }, 1500)
}
</script>

<style lang="scss" scoped>
@use "sass:color";
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.contact-view {
  background: #f8fafc;
}

.contact-header {
  background: linear-gradient(135deg, #0d2137, #235789);
  color: white;
  padding: 120px 0 80px;
  text-align: center;
  h1 {
    font-size: 3.5rem;
    font-weight: 800;
    margin-bottom: $space-4;
  }
  p {
    font-size: 1.25rem;
    opacity: 0.8;
  }
}

.contact-body {
  margin-top: -60px;
  position: relative;
  z-index: 10;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: $space-10;

  @include lg {
    grid-template-columns: 400px 1fr;
  }
}

.info-card {
  background: white;
  padding: $space-10;
  border-radius: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  margin-bottom: $space-8;

  .info-item {
    display: flex;
    gap: $space-6;
    margin-bottom: $space-8;
    &:last-child { margin-bottom: 0; }

    .icon {
      width: 50px;
      height: 50px;
      background: rgba($color-primary-rgb, 0.1);
      color: $color-primary;
      border-radius: 15px;
      @include flex-center;
      font-size: 20px;
      flex-shrink: 0;
    }

    h3 {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 5px;
    }
    p {
      color: #64748b;
      font-size: 14px;
      line-height: 1.5;
    }
  }
}

.social-box {
  background: white;
  padding: $space-8;
  border-radius: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  text-align: center;

  h3 { margin-bottom: $space-6; font-size: 1.1rem; }

  .social-links {
    display: flex;
    justify-content: center;
    gap: $space-4;
  }

  .social-btn {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    @include flex-center;
    color: white;
    text-decoration: none;
    transition: all 0.3s;
    background: #e2e8f0;
    color: #475569;

    &:hover {
      transform: translateY(-3px);
      &.fb { background: #1877f2; color: white; }
      &.ig { background: #e4405f; color: white; }
      &.tw { background: #1da1f2; color: white; }
      &.yt { background: #ff0000; color: white; }
    }
  }
}

.contact-form-container {
  background: white;
  padding: $space-12;
  border-radius: 40px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.05);

  .form-header {
    margin-bottom: $space-10;
    h2 { font-size: 2rem; font-weight: 800; margin-bottom: 5px; }
    p { color: #64748b; }
  }
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-6;

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &.full { grid-column: span 2; }

    label { font-weight: 700; font-size: 14px; color: #1e293b; }

    input, select, textarea {
      padding: 14px 20px;
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      font-size: 15px;
      transition: all 0.3s;
      &:focus {
        border-color: $color-primary;
        box-shadow: 0 0 0 4px rgba($color-primary-rgb, 0.1);
        outline: none;
      }
    }
  }
}

.btn-submit {
  width: 100%;
  margin-top: $space-8;
  background: $color-primary;
  color: white;
  border: none;
  padding: 18px;
  border-radius: 15px;
  font-weight: 700;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $space-3;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: color.adjust($color-primary, $lightness: -5%);
    transform: translateY(-2px);
  }
  &:disabled { opacity: 0.7; cursor: not-allowed; }
}

.map-section {
  margin-top: $space-20;
}
</style>
