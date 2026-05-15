<template>
  <div class="legal-view">
    <!-- Header -->
    <header class="legal-header">
      <div class="container">
        <h1>Điều Khoản Sử Dụng</h1>
        <p>Hiệu lực từ ngày: 14 Tháng 5, 2026</p>
      </div>
    </header>

    <!-- Content -->
    <div class="container legal-container">
      <div class="legal-sidebar">
        <div class="toc-card">
          <h3>Nội dung chính</h3>
          <ul>
            <li v-for="(s, i) in sections" :key="i">
              <a :href="'#' + s.id">{{ s.title }}</a>
            </li>
          </ul>
        </div>
      </div>

      <main class="legal-content">
        <div class="content-card">
          <section v-for="(s, i) in sections" :key="i" :id="s.id" class="content-section">
            <div class="section-icon">
              <i :class="s.icon"></i>
            </div>
            <h2>{{ s.title }}</h2>
            <div v-html="s.content"></div>
          </section>
          
          <div class="contact-notice">
            <i class="pi pi-check-circle"></i>
            <p>Bằng việc sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản trên.</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
const sections = [
  {
    id: 'agreement',
    icon: 'pi pi-file-edit',
    title: '1. Chấp thuận điều khoản',
    content: '<p>Khi truy cập và sử dụng dịch vụ của Triptopia, bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý bị ràng buộc bởi các Điều khoản này. Nếu bạn không đồng ý, vui lòng ngưng sử dụng dịch vụ.</p>'
  },
  {
    id: 'booking',
    icon: 'pi pi-calendar-plus',
    title: '2. Quy trình đặt tour',
    content: '<p>Mọi đơn đặt tour phải được thực hiện qua website hoặc ứng dụng chính thức. Bạn chịu trách nhiệm cung cấp thông tin chính xác về người tham gia và các yêu cầu đặc biệt.</p>'
  },
  {
    id: 'payment',
    icon: 'pi pi-credit-card',
    title: '3. Thanh toán & Hoàn tiền',
    content: '<p>Thanh toán phải được thực hiện đầy đủ theo lịch trình đã cam kết. Chính sách hoàn tiền sẽ áp dụng tùy thuộc vào thời điểm hủy tour và loại tour cụ thể (chi tiết xem tại phần mô tả tour).</p>'
  },
  {
    id: 'conduct',
    icon: 'pi pi-user',
    title: '4. Trách nhiệm của khách hàng',
    content: '<p>Khách hàng có trách nhiệm tuân thủ pháp luật và các quy định tại điểm đến. Triptopia có quyền từ chối phục vụ nếu khách hàng có hành vi gây ảnh hưởng đến sự an toàn của đoàn.</p>'
  },
  {
    id: 'limitation',
    icon: 'pi pi-exclamation-triangle',
    title: '5. Giới hạn trách nhiệm',
    content: '<p>Triptopia không chịu trách nhiệm cho các sự cố bất khả kháng như thiên tai, dịch bệnh hoặc thay đổi chính sách từ chính phủ làm ảnh hưởng đến hành trình.</p>'
  }
]
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.legal-view {
  background: #f8fafc;
  min-height: 100vh;
}

.legal-header {
  background: linear-gradient(135deg, #0d2137, #235789);
  color: white;
  padding: 120px 0 60px;
  text-align: center;
  h1 { font-size: 3rem; font-weight: 800; margin-bottom: 10px; }
  p { opacity: 0.7; font-size: 15px; }
}

.legal-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: $space-10;
  padding: $space-16 0;

  @include lg {
    grid-template-columns: 300px 1fr;
  }
}

.legal-sidebar {
  .toc-card {
    background: white;
    padding: $space-8;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    position: sticky;
    top: calc(#{$navbar-height} + 20px);

    h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: $space-6; color: #1e293b; }
    
    ul {
      list-style: none;
      li {
        margin-bottom: $space-3;
        a {
          text-decoration: none;
          color: #64748b;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.3s;
          display: block;
          padding: 8px 12px;
          border-radius: 8px;
          &:hover { background: #f1f5f9; color: $color-primary; }
        }
      }
    }
  }
}

.content-card {
  background: white;
  padding: $space-12;
  border-radius: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);

  .content-section {
    margin-bottom: $space-16;
    &:last-child { margin-bottom: 0; }

    .section-icon {
      width: 45px;
      height: 45px;
      background: rgba($color-primary-rgb, 0.1);
      color: $color-primary;
      border-radius: 12px;
      @include flex-center;
      font-size: 18px;
      margin-bottom: $space-4;
    }

    h2 { font-size: 1.5rem; font-weight: 800; color: #1e293b; margin-bottom: $space-6; }
    
    :deep(p) { color: #475569; line-height: 1.7; margin-bottom: $space-4; }
    :deep(ul) {
      padding-left: $space-6;
      li { color: #475569; margin-bottom: 8px; line-height: 1.6; }
    }
  }
}

.contact-notice {
  margin-top: $space-16;
  background: #f1f5f9;
  padding: $space-6;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: $space-4;
  i { color: #10b981; font-size: 20px; }
  p { font-size: 14px; font-weight: 600; color: #475569; margin: 0; }
}
</style>
