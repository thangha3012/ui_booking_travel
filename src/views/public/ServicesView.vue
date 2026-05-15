<template>
  <div class="services-view">
    <!-- Hero Section -->
    <section class="page-hero">
      <div class="container">
        <span class="page-hero__label">Dịch vụ</span>
        <h1 class="page-hero__title">Dịch Vụ Của Chúng Tôi</h1>
        <div class="page-hero__breadcrumb">
          <RouterLink to="/">Trang chủ</RouterLink>
          <i class="pi pi-angle-right"></i>
          <span class="current">Dịch vụ</span>
        </div>
      </div>
    </section>

    <!-- Core Services -->
    <section class="section core-services">
      <div class="container">
        <div class="section-header text-center">
          <p class="section-label">Chúng tôi làm gì?</p>
          <h2 class="section-title">Giải Pháp Du Lịch Toàn Diện</h2>
        </div>
        <div class="services-grid">
          <div v-for="(s, idx) in services" :key="idx" class="service-card">
            <div class="service-icon" :style="{ background: s.bg }">
              <i :class="s.icon"></i>
            </div>
            <h3>{{ s.title }}</h3>
            <p>{{ s.desc }}</p>
            <ul class="service-features">
              <li v-for="f in s.features" :key="f"><i class="pi pi-check"></i> {{ f }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Us -->
    <section class="section why-us">
      <div class="container">
        <div class="why-us-inner">
          <div class="why-us-content">
            <p class="section-label">Tại sao chọn chúng tôi?</p>
            <h2 class="section-title">Cam Kết Chất Lượng Vượt Trội</h2>
            <div class="why-list">
              <div v-for="w in reasons" :key="w.title" class="why-item">
                <div class="why-icon"><i :class="w.icon"></i></div>
                <div class="why-text">
                  <h3>{{ w.title }}</h3>
                  <p>{{ w.desc }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="why-us-image">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80" alt="Why Us" />
            <div class="floating-badge">
              <i class="pi pi-verified"></i>
              <span>Dịch vụ được chứng nhận</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Process -->
    <section class="section process-section">
      <div class="container">
        <div class="section-header text-center">
          <p class="section-label">Quy trình</p>
          <h2 class="section-title">Cách Chúng Tôi Làm Việc</h2>
        </div>
        <div class="process-steps">
          <div v-for="(p, i) in steps" :key="i" class="step-item">
            <div class="step-number">{{ i + 1 }}</div>
            <h3>{{ p.title }}</h3>
            <p>{{ p.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="services-cta">
      <div class="container cta-box">
        <h2>Bạn cần một dịch vụ tùy chỉnh?</h2>
        <p>Liên hệ với chuyên gia của chúng tôi để thiết kế hành trình riêng cho bạn.</p>
        <RouterLink to="/contact" class="btn-primary-lg">Liên Hệ Ngay</RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup>
const services = [
  {
    title: 'Đặt Tour Trọn Gói',
    icon: 'pi pi-map',
    bg: 'rgba(59, 130, 246, 0.1)',
    desc: 'Cung cấp các tour du lịch đa dạng từ nghỉ dưỡng đến khám phá mạo hiểm.',
    features: ['Lịch trình tối ưu', 'Khách sạn 4-5 sao', 'HDV chuyên nghiệp']
  },
  {
    title: 'Tư Vấn Hành Trình',
    icon: 'pi pi-comments',
    bg: 'rgba(16, 185, 129, 0.1)',
    desc: 'Thiết kế lịch trình riêng theo sở thích và ngân sách của từng khách hàng.',
    features: ['Hỗ trợ 24/7', 'Tối ưu chi phí', 'Gợi ý điểm đến độc lạ']
  },
  {
    title: 'Bảo Hiểm Du Lịch',
    icon: 'pi pi-shield',
    bg: 'rgba(245, 158, 11, 0.1)',
    desc: 'Gói bảo hiểm toàn diện giúp bạn an tâm trước mọi sự cố không mong muốn.',
    features: ['Bồi thường nhanh', 'Phạm vi toàn cầu', 'Chi phí thấp']
  },
  {
    title: 'Hỗ Trợ Thủ Tục',
    icon: 'pi pi-file',
    bg: 'rgba(239, 68, 68, 0.1)',
    desc: 'Hỗ trợ làm Visa, hộ chiếu và các giấy tờ cần thiết cho chuyến đi.',
    features: ['Tỷ lệ đậu cao', 'Xử lý nhanh chóng', 'Tiết kiệm thời gian']
  }
]

const reasons = [
  { title: 'Chuyên nghiệp', desc: 'Đội ngũ có hơn 10 năm kinh nghiệm trong ngành du lịch.', icon: 'pi pi-briefcase' },
  { title: 'Công nghệ', desc: 'Hệ thống đặt tour và thanh toán trực tuyến nhanh chóng, bảo mật.', icon: 'pi pi-mobile' },
  { title: 'Đối tác', desc: 'Mạng lưới đối tác rộng khắp đảm bảo chất lượng dịch vụ tốt nhất.', icon: 'pi pi-globe' }
]

const steps = [
  { title: 'Tiếp nhận', desc: 'Lắng nghe nhu cầu và mong muốn của khách hàng.' },
  { title: 'Đề xuất', desc: 'Đưa ra các phương án hành trình và dịch vụ phù hợp nhất.' },
  { title: 'Thực hiện', desc: 'Triển khai dịch vụ và theo sát hành trình của khách.' },
  { title: 'Chăm sóc', desc: 'Lắng nghe phản hồi và hỗ trợ sau chuyến đi.' }
]
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.services-view {
  background: white;
}

.services-hero {
  height: 60vh;
  background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=1600&q=80');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  color: white;
  text-align: center;
  padding-top: $navbar-height;

  .badge {
    background: $color-primary;
    padding: 8px 20px;
    border-radius: 50px;
    font-weight: 700;
    font-size: 14px;
    margin-bottom: $space-6;
    display: inline-block;
  }

  h1 {
    font-size: 3.5rem;
    font-weight: 800;
    margin-bottom: $space-6;
    .text-gradient {
      background: linear-gradient(to right, #ff6b35, #f59e0b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  p { font-size: 1.2rem; opacity: 0.9; max-width: 600px; margin: 0 auto; }
}

.core-services {
  padding: $space-24 0;
  background: #f8fafc;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: $space-8;
  @include md { grid-template-columns: repeat(2, 1fr); }
  @include lg { grid-template-columns: repeat(4, 1fr); }
}

.service-card {
  background: white;
  padding: $space-10;
  border-radius: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.03);
  transition: all 0.3s;
  border: 1px solid transparent;

  &:hover {
    transform: translateY(-10px);
    border-color: $color-primary;
    box-shadow: 0 20px 40px rgba(0,0,0,0.08);
  }

  .service-icon {
    width: 60px;
    height: 60px;
    border-radius: 18px;
    @include flex-center;
    font-size: 24px;
    color: $color-primary;
    margin-bottom: $space-6;
  }

  h3 { font-size: 1.25rem; font-weight: 800; margin-bottom: $space-4; }
  p { font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: $space-6; }

  .service-features {
    list-style: none;
    li {
      font-size: 13px;
      font-weight: 600;
      color: #334155;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
      i { color: #10b981; font-size: 12px; }
    }
  }
}

.why-us {
  padding: $space-24 0;
  .why-us-inner {
    display: grid;
    grid-template-columns: 1fr;
    gap: $space-16;
    align-items: center;
    @include lg { grid-template-columns: 1.2fr 1fr; }
  }

  .why-list {
    margin-top: $space-10;
    .why-item {
      display: flex;
      gap: $space-6;
      margin-bottom: $space-8;
      .why-icon {
        width: 50px;
        height: 50px;
        background: #f1f5f9;
        border-radius: 50%;
        @include flex-center;
        color: $color-primary;
        font-size: 20px;
        flex-shrink: 0;
      }
      h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 5px; }
      p { color: #64748b; font-size: 14px; }
    }
  }

  .why-us-image {
    position: relative;
    img { width: 100%; border-radius: 40px; }
    .floating-badge {
      position: absolute;
      bottom: 20px;
      left: -20px;
      background: white;
      padding: 20px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 15px;
      box-shadow: 0 15px 40px rgba(0,0,0,0.1);
      i { color: #10b981; font-size: 24px; }
      span { font-weight: 800; font-size: 14px; color: #1e293b; }
    }
  }
}

.process-section {
  background: #0f172a;
  color: white;
  padding: $space-24 0;
  .section-title { color: white; }
}

.process-steps {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: $space-10;
  margin-top: $space-16;
  @include md { grid-template-columns: repeat(2, 1fr); }
  @include lg { grid-template-columns: repeat(4, 1fr); }
}

.step-item {
  text-align: center;
  position: relative;
  .step-number {
    width: 60px;
    height: 60px;
    background: $color-primary;
    border-radius: 50%;
    @include flex-center;
    font-size: 24px;
    font-weight: 800;
    margin: 0 auto $space-6;
    border: 5px solid rgba(255, 255, 255, 0.1);
  }
  h3 { font-size: 1.25rem; font-weight: 700; margin-bottom: 10px; }
  p { opacity: 0.7; font-size: 14px; line-height: 1.6; }
}

.services-cta {
  padding: $space-24 0;
  .cta-box {
    background: linear-gradient(135deg, #235789, #1a3a5c);
    padding: $space-20;
    border-radius: 50px;
    text-align: center;
    color: white;
    h2 { font-size: 2.5rem; font-weight: 800; margin-bottom: $space-6; }
    p { opacity: 0.8; margin-bottom: $space-10; }
  }
}

.btn-primary-lg {
  display: inline-block;
  background: white;
  color: #1a3a5c;
  padding: 18px 40px;
  border-radius: 50px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s;
  &:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(0,0,0,0.2); }
}

.section-label {
  font-size: 14px;
  font-weight: 800;
  color: $color-primary;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: $space-4;
  display: block;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.2;
}

.text-center { text-align: center; }
</style>
