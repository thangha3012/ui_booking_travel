<template>
  <div class="legal-view">
    <!-- Header -->
    <header class="legal-header">
      <div class="container">
        <h1>Chính Sách Bảo Mật</h1>
        <p>Cập nhật lần cuối: 14 Tháng 5, 2026</p>
      </div>
    </header>

    <!-- Content -->
    <div class="container legal-container">
      <div class="legal-sidebar">
        <div class="toc-card">
          <h3>Mục lục</h3>
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
            <i class="pi pi-info-circle"></i>
            <p>Nếu bạn có bất kỳ câu hỏi nào về chính sách này, vui lòng <RouterLink to="/contact">liên hệ với chúng tôi</RouterLink>.</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
const sections = [
  {
    id: 'intro',
    icon: 'pi pi-shield',
    title: '1. Giới thiệu',
    content: '<p>Chào mừng bạn đến với Triptopia. Chúng tôi cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn. Chính sách này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin khi bạn sử dụng dịch vụ của chúng tôi.</p>'
  },
  {
    id: 'collection',
    icon: 'pi pi-database',
    title: '2. Thu thập thông tin',
    content: '<p>Chúng tôi thu thập thông tin bạn cung cấp trực tiếp cho chúng tôi, bao gồm:</p><ul><li>Họ tên, địa chỉ email, số điện thoại.</li><li>Thông tin thanh toán khi bạn đặt tour.</li><li>Thông tin về các chuyến đi bạn đã đặt.</li></ul>'
  },
  {
    id: 'usage',
    icon: 'pi pi-cog',
    title: '3. Sử dụng thông tin',
    content: '<p>Thông tin của bạn được sử dụng để:</p><ul><li>Xác nhận và quản lý các đơn đặt tour của bạn.</li><li>Gửi thông báo về lịch trình và cập nhật dịch vụ.</li><li>Cải thiện trải nghiệm người dùng trên website.</li><li>Xử lý thanh toán an toàn qua các cổng đối tác.</li></ul>'
  },
  {
    id: 'sharing',
    icon: 'pi pi-users',
    title: '4. Chia sẻ thông tin',
    content: '<p>Chúng tôi không bán thông tin cá nhân của bạn. Chúng tôi chỉ chia sẻ dữ liệu với các đối tác cung cấp dịch vụ trực tiếp (như hãng hàng không, khách sạn) để hoàn tất yêu cầu đặt tour của bạn.</p>'
  },
  {
    id: 'security',
    icon: 'pi pi-lock',
    title: '5. Bảo mật dữ liệu',
    content: '<p>Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật và tổ chức để bảo vệ dữ liệu của bạn khỏi việc truy cập trái phép, mất mát hoặc thay đổi. Mọi giao dịch thanh toán đều được mã hóa SSL chuẩn quốc tế.</p>'
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
  background: linear-gradient(135deg, #0d2137, #1e3a5a);
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
  i { color: $color-primary; font-size: 20px; }
  p { font-size: 14px; font-weight: 600; color: #475569; margin: 0; }
  a { color: $color-primary; font-weight: 700; text-decoration: none; }
}
</style>
