<template>
  <div class="about-us-view">
    <!-- Hero Section -->
    <section class="page-hero">
      <div class="container">
        <span class="page-hero__label">Về Triptopia</span>
        <h1 class="page-hero__title">Giới Thiệu</h1>
        <div class="page-hero__breadcrumb">
          <RouterLink to="/">Trang chủ</RouterLink>
          <i class="pi pi-angle-right"></i>
          <span class="current">Giới thiệu</span>
        </div>
      </div>
    </section>

    <!-- Mission & Vision -->
    <section class="section mission-vision">
      <div class="container">
        <div class="mission-grid">
          <div class="mission-image">
            <img src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&q=80" alt="Mission" />
            <div class="experience-badge">
              <span class="number">10+</span>
              <span class="text">Năm Kinh Nghiệm</span>
            </div>
          </div>
          <div class="mission-content">
            <p class="section-label">Sứ mệnh của chúng tôi</p>
            <h2 class="section-title">Kết Nối Con Người Với <br/>Vẻ Đẹp Toàn Cầu</h2>
            <p class="desc">
              Triptopia ra đời với khát khao phá bỏ mọi rào cản du lịch. Chúng tôi tin rằng mỗi chuyến đi là một cơ hội để học hỏi, trưởng thành và tìm thấy sự bình yên trong tâm hồn.
            </p>
            <div class="stats-grid">
              <div class="stat-card">
                <h3>50K+</h3>
                <p>Khách hàng tin tưởng</p>
              </div>
              <div class="stat-card">
                <h3>100+</h3>
                <p>Điểm đến toàn cầu</p>
              </div>
              <div class="stat-card">
                <h3>4.9/5</h3>
                <p>Đánh giá hài lòng</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="section values-section">
      <div class="container">
        <div class="section-header text-center">
          <p class="section-label">Giá trị cốt lõi</p>
          <h2 class="section-title">Tại Sao Chọn Triptopia?</h2>
        </div>
        <div class="values-grid">
          <div v-for="(val, idx) in coreValues" :key="idx" class="value-card">
            <div class="value-icon">
              <i :class="val.icon"></i>
            </div>
            <h3>{{ val.title }}</h3>
            <p>{{ val.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team -->
    <section class="section team-section">
      <div class="container">
        <div class="section-header text-center">
          <p class="section-label">Đội ngũ của chúng tôi</p>
          <h2 class="section-title">Những Người Đồng Hành</h2>
        </div>
        <div class="team-grid">
          <div v-for="(member, idx) in team" :key="idx" class="member-card">
            <div class="member-image">
              <img :src="member.img" :alt="member.name" />
              <div class="member-social">
                <a href="#"><i class="pi pi-facebook"></i></a>
                <a href="#"><i class="pi pi-instagram"></i></a>
                <a href="#"><i class="pi pi-linkedin"></i></a>
              </div>
            </div>
            <div class="member-info">
              <h3>{{ member.name }}</h3>
              <p>{{ member.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="about-cta">
      <div class="container">
        <div class="cta-inner">
          <h2>Sẵn sàng cho chuyến phiêu lưu tiếp theo?</h2>
          <p>Hãy để Triptopia cùng bạn lên kế hoạch cho hành trình trong mơ.</p>
          <RouterLink to="/tours" class="btn-primary-lg">Khám Phá Tour Ngay</RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const coreValues = [
  {
    icon: 'pi pi-shield',
    title: 'An Toàn Tuyệt Đối',
    desc: 'Chúng tôi ưu tiên sự an toàn và sức khỏe của khách hàng trên mọi hành trình.'
  },
  {
    icon: 'pi pi-heart',
    title: 'Tận Tâm Phục Vụ',
    desc: 'Đội ngũ hướng dẫn viên nhiệt tình, hỗ trợ 24/7 suốt chuyến đi.'
  },
  {
    icon: 'pi pi-tag',
    title: 'Giá Cả Minh Bạch',
    desc: 'Cam kết không phí ẩn, luôn mang lại giá trị tốt nhất cho ngân sách của bạn.'
  },
  {
    icon: 'pi pi-map',
    title: 'Hành Trình Độc Bản',
    desc: 'Thiết kế những trải nghiệm khác biệt, không rập khuôn theo lối mòn.'
  }
]

const team = [
  {
    name: 'Alex Nguyễn',
    role: 'Founder & CEO',
    img: 'https://i.pravatar.cc/300?img=12'
  },
  {
    name: 'Elena Trần',
    role: 'Giám đốc Điều hành',
    img: 'https://i.pravatar.cc/300?img=5'
  },
  {
    name: 'Marcus Lê',
    role: 'Chuyên gia Tour',
    img: 'https://i.pravatar.cc/300?img=11'
  },
  {
    name: 'Sarah Phạm',
    role: 'Hỗ trợ Khách hàng',
    img: 'https://i.pravatar.cc/300?img=1'
  }
]
</script>

<style lang="scss" scoped>
@use "sass:color";
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.about-us-view {
  overflow: hidden;
}

// Hero Section
.about-hero {
  position: relative;
  height: 80vh;
  display: flex;
  align-items: center;
  color: white;
  padding-top: $navbar-height;

  .hero-content {
    position: relative;
    z-index: 10;
    max-width: 800px;

    .badge {
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      padding: 8px 16px;
      border-radius: 50px;
      font-size: 14px;
      font-weight: 700;
      margin-bottom: $space-6;
      display: inline-block;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    h1 {
      font-size: clamp(2.5rem, 8vw, 4.5rem);
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: $space-6;

      .text-gradient {
        background: linear-gradient(to right, #ff6b35, #f59e0b);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    p {
      font-size: 1.25rem;
      opacity: 0.9;
      line-height: 1.6;
    }
  }

  .hero-bg {
    position: absolute;
    inset: 0;
    .overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.3), rgba(0,0,0,0.7));
      z-index: 1;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

// Mission Section
.mission-vision {
  padding: $space-24 0;

  .mission-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: $space-16;
    align-items: center;

    @include lg {
      grid-template-columns: 1fr 1fr;
    }
  }

  .mission-image {
    position: relative;
    img {
      width: 100%;
      border-radius: 40px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    }
    .experience-badge {
      position: absolute;
      bottom: -30px;
      right: 30px;
      background: $color-primary;
      color: white;
      padding: 30px;
      border-radius: 30px;
      text-align: center;
      box-shadow: 0 15px 30px rgba($color-primary-rgb, 0.3);

      .number {
        display: block;
        font-size: 3rem;
        font-weight: 800;
        line-height: 1;
      }
      .text {
        font-size: 14px;
        font-weight: 600;
        text-transform: uppercase;
      }
    }
  }

  .mission-content {
    .desc {
      font-size: 1.15rem;
      color: #64748b;
      line-height: 1.8;
      margin-bottom: $space-10;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: $space-4;
      border-top: 1px solid #f1f5f9;
      padding-top: $space-10;

      .stat-card {
        h3 {
          font-size: 2rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 5px;
        }
        p {
          font-size: 13px;
          color: #94a3b8;
          font-weight: 600;
        }
      }
    }
  }
}

// Values Section
.values-section {
  background: #f8fafc;
  padding: $space-24 0;

  .values-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: $space-8;

    @include md {
      grid-template-columns: repeat(2, 1fr);
    }
    @include lg {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .value-card {
    background: white;
    padding: $space-10;
    border-radius: 30px;
    transition: all 0.3s;
    border: 1px solid #f1f5f9;

    &:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.05);
      border-color: $color-primary;
    }

    .value-icon {
      width: 60px;
      height: 60px;
      background: rgba($color-primary-rgb, 0.1);
      color: $color-primary;
      border-radius: 18px;
      @include flex-center;
      font-size: 24px;
      margin-bottom: $space-6;
    }

    h3 {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: $space-3;
    }
    p {
      color: #64748b;
      line-height: 1.6;
      font-size: 14px;
    }
  }
}

// Team Section
.team-section {
  padding: $space-24 0;

  .team-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: $space-10;

    @include md {
      grid-template-columns: repeat(2, 1fr);
    }
    @include lg {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .member-card {
    text-align: center;

    .member-image {
      position: relative;
      border-radius: 30px;
      overflow: hidden;
      margin-bottom: $space-6;

      img {
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
        transition: transform 0.5s;
      }

      .member-social {
        position: absolute;
        inset: 0;
        background: rgba(0,0,0,0.4);
        @include flex-center;
        gap: $space-4;
        opacity: 0;
        transition: all 0.3s;

        a {
          width: 40px;
          height: 40px;
          background: white;
          color: #0f172a;
          border-radius: 50%;
          @include flex-center;
          text-decoration: none;
          transform: translateY(20px);
          transition: all 0.3s;

          &:hover {
            background: $color-primary;
            color: white;
          }
        }
      }
    }

    &:hover {
      .member-image img {
        transform: scale(1.1);
      }
      .member-social {
        opacity: 1;
        a { transform: translateY(0); }
      }
    }

    .member-info {
      h3 {
        font-size: 1.25rem;
        font-weight: 700;
        margin-bottom: 2px;
      }
      p {
        color: $color-primary;
        font-weight: 600;
        font-size: 14px;
      }
    }
  }
}

// CTA Section
.about-cta {
  padding-bottom: $space-24;
  .cta-inner {
    background: linear-gradient(135deg, #0d2137, #235789);
    padding: $space-20;
    border-radius: 50px;
    text-align: center;
    color: white;
    box-shadow: 0 20px 50px rgba(0,0,0,0.1);

    h2 {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: $space-6;
    }
    p {
      font-size: 1.1rem;
      opacity: 0.8;
      margin-bottom: $space-10;
    }
  }
}

.btn-primary-lg {
  display: inline-block;
  background: $color-primary;
  color: white;
  padding: 18px 40px;
  border-radius: 50px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba($color-primary-rgb, 0.4);
    background: color.adjust($color-primary, $lightness: -5%);
  }
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
  margin-bottom: $space-8;
}

.text-center {
  text-align: center;
}
</style>
