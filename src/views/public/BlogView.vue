<template>
  <div class="blog-view">
    <!-- Hero -->
    <section class="page-hero">
      <div class="container">
        <span class="page-hero__label">Cẩm nang</span>
        <h1 class="page-hero__title">Tin Tức</h1>
        <div class="page-hero__breadcrumb">
          <RouterLink to="/">Trang chủ</RouterLink>
          <i class="pi pi-angle-right"></i>
          <span class="current">Tin tức</span>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="blog-nav">
      <div class="container">
        <div class="nav-inner">
          <button v-for="c in categories" :key="c" 
            :class="['nav-btn', { active: activeCat === c }]"
            @click="activeCat = c">
            {{ c }}
          </button>
        </div>
      </div>
    </section>

    <!-- Featured Post -->
    <section class="section featured-post">
      <div class="container">
        <div class="featured-card">
          <div class="featured-img">
            <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80" alt="Featured" />
          </div>
          <div class="featured-content">
            <span class="post-tag">Nổi bật</span>
            <h2>Top 10 bãi biển đẹp nhất Việt Nam nên ghé thăm vào mùa hè này</h2>
            <p>Mùa hè đang đến gần, bạn đã lên kế hoạch cho chuyến đi biển của mình chưa? Hãy cùng khám phá danh sách những thiên đường biển xanh...</p>
            <div class="post-meta">
              <span><i class="pi pi-calendar"></i> 15/05/2026</span>
              <span><i class="pi pi-user"></i> By Admin</span>
            </div>
            <button class="btn-read">Đọc thêm <i class="pi pi-arrow-right"></i></button>
          </div>
        </div>
      </div>
    </section>

    <!-- Post Grid -->
    <section class="section posts-section">
      <div class="container">
        <div class="posts-grid">
          <article v-for="p in posts" :key="p.id" class="post-card">
            <div class="post-img">
              <img :src="p.img" :alt="p.title" />
              <span class="post-cat">{{ p.cat }}</span>
            </div>
            <div class="post-body">
              <div class="post-meta">
                <span>{{ p.date }}</span>
              </div>
              <h3>{{ p.title }}</h3>
              <p>{{ p.excerpt }}</p>
              <RouterLink to="#" class="read-link">Đọc tiếp <i class="pi pi-arrow-right"></i></RouterLink>
            </div>
          </article>
        </div>
        
        <div class="pagination">
          <button class="page-btn active">1</button>
          <button class="page-btn">2</button>
          <button class="page-btn">3</button>
          <button class="page-btn next"><i class="pi pi-angle-right"></i></button>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="newsletter">
      <div class="container newsletter-inner">
        <div class="content">
          <h2>Đăng ký nhận bản tin</h2>
          <p>Nhận ngay những ưu đãi độc quyền và mẹo du lịch mới nhất qua Email.</p>
        </div>
        <form @submit.prevent class="subscribe-form">
          <input type="email" placeholder="Địa chỉ email của bạn" />
          <button type="submit">Đăng ký ngay</button>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeCat = ref('Tất cả')
const categories = ['Tất cả', 'Cẩm nang', 'Trải nghiệm', 'Ẩm thực', 'Tin khuyến mãi']

const posts = [
  {
    id: 1,
    title: 'Bí kíp săn vé máy bay giá rẻ cho kỳ nghỉ lễ sắp tới',
    excerpt: 'Làm thế nào để sở hữu tấm vé máy bay với mức giá tốt nhất? Hãy bỏ túi ngay những mẹo nhỏ sau đây...',
    img: 'https://images.unsplash.com/photo-1436491865332-7a61a109c051?w=800&q=80',
    cat: 'Cẩm nang',
    date: '12/05/2026'
  },
  {
    id: 2,
    title: 'Khám phá Hà Giang - Mảnh đất địa đầu Tổ quốc',
    excerpt: 'Hà Giang không chỉ có cao nguyên đá mà còn có những nụ cười tỏa nắng của những đứa trẻ vùng cao...',
    img: 'https://images.unsplash.com/photo-1581009146145-b5ef03a7403f?w=800&q=80',
    cat: 'Trải nghiệm',
    date: '10/05/2026'
  },
  {
    id: 3,
    title: 'Ăn gì ở Đà Nẵng? 5 món đặc sản không thể bỏ qua',
    excerpt: 'Đến Đà Nẵng mà chưa thử qua những món này thì coi như chưa đến. Hãy cùng điểm mặt gọi tên các đặc sản...',
    img: 'https://images.unsplash.com/photo-1563805042-7684c849a135?w=800&q=80',
    cat: 'Ẩm thực',
    date: '08/05/2026'
  },
  {
    id: 4,
    title: 'Review chi tiết tour du thuyền 5 sao trên Vịnh Hạ Long',
    excerpt: 'Trải nghiệm đẳng cấp nghỉ dưỡng giữa kỳ quan thiên nhiên thế giới sẽ như thế nào?',
    img: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&q=80',
    cat: 'Trải nghiệm',
    date: '05/05/2026'
  },
  {
    id: 5,
    title: 'Những lưu ý khi đi du lịch nước ngoài một mình',
    excerpt: 'An toàn luôn là yếu tố quan trọng nhất. Đừng quên chuẩn bị kỹ lưỡng các bước sau đây...',
    img: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
    cat: 'Cẩm nang',
    date: '03/05/2026'
  },
  {
    id: 6,
    title: 'Chương trình khuyến mãi hè rực rỡ - Giảm đến 40%',
    excerpt: 'Cơ hội vàng để vi vu cùng gia đình với mức giá cực hời chỉ có tại Triptopia trong tháng 6 này...',
    img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
    cat: 'Khuyến mãi',
    date: '01/05/2026'
  }
]
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.blog-hero {
  background: #0f172a;
  color: white;
  padding: 140px 0 60px;
  text-align: center;
  .label { font-weight: 800; color: $color-primary; text-transform: uppercase; letter-spacing: 4px; margin-bottom: $space-4; }
  h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: $space-6; }
  .desc { font-size: 1.2rem; opacity: 0.7; max-width: 600px; margin: 0 auto; }
}

.blog-nav {
  background: white;
  padding: $space-6 0;
  border-bottom: 1px solid #f1f5f9;
  position: sticky;
  top: $navbar-height;
  z-index: 100;

  .nav-inner {
    display: flex;
    justify-content: center;
    gap: $space-2;
    flex-wrap: wrap;
  }

  .nav-btn {
    border: none;
    background: transparent;
    padding: 10px 24px;
    border-radius: 50px;
    font-weight: 700;
    cursor: pointer;
    color: #64748b;
    transition: all 0.3s;
    &:hover { color: $color-primary; background: rgba($color-primary-rgb, 0.05); }
    &.active { background: $color-primary; color: white; }
  }
}

.featured-post {
  padding-top: $space-16;
}

.featured-card {
  display: grid;
  grid-template-columns: 1fr;
  background: white;
  border-radius: 40px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0,0,0,0.05);

  @include lg {
    grid-template-columns: 1.2fr 1fr;
  }

  .featured-img {
    height: 400px;
    img { width: 100%; height: 100%; object-fit: cover; }
  }

  .featured-content {
    padding: $space-12;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .post-tag {
      background: #eff6ff;
      color: #3b82f6;
      padding: 6px 16px;
      border-radius: 50px;
      font-weight: 800;
      font-size: 12px;
      width: fit-content;
      margin-bottom: $space-6;
    }

    h2 { font-size: 2.25rem; font-weight: 800; line-height: 1.2; margin-bottom: $space-6; }
    p { color: #64748b; line-height: 1.7; margin-bottom: $space-8; }

    .post-meta {
      display: flex;
      gap: $space-6;
      color: #94a3b8;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: $space-8;
      i { color: $color-primary; margin-right: 5px; }
    }

    .btn-read {
      width: fit-content;
      background: #1e293b;
      color: white;
      border: none;
      padding: 14px 30px;
      border-radius: 50px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: all 0.3s;
      &:hover { transform: translateX(5px); background: #0f172a; }
    }
  }
}

.posts-section {
  background: #f8fafc;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: $space-8;

  @include md { grid-template-columns: repeat(2, 1fr); }
  @include lg { grid-template-columns: repeat(3, 1fr); }
}

.post-card {
  background: white;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.03);
  transition: all 0.3s;
  border: 1px solid transparent;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.08);
    border-color: #f1f5f9;
  }

  .post-img {
    height: 240px;
    position: relative;
    img { width: 100%; height: 100%; object-fit: cover; }
    .post-cat {
      position: absolute;
      top: 20px;
      left: 20px;
      background: white;
      padding: 6px 14px;
      border-radius: 10px;
      font-weight: 800;
      font-size: 12px;
      color: $color-primary;
    }
  }

  .post-body {
    padding: $space-8;
    .post-meta { font-size: 13px; color: #94a3b8; font-weight: 700; margin-bottom: $space-3; }
    h3 { font-size: 1.25rem; font-weight: 800; margin-bottom: $space-4; line-height: 1.4; color: #1e293b; }
    p { color: #64748b; font-size: 14px; line-height: 1.6; margin-bottom: $space-6; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
    .read-link {
      color: $color-primary;
      text-decoration: none;
      font-weight: 800;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 5px;
      i { transition: transform 0.3s; }
      &:hover i { transform: translateX(5px); }
    }
  }
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: $space-16;

  .page-btn {
    width: 45px;
    height: 45px;
    border: 1px solid #e2e8f0;
    background: white;
    border-radius: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s;
    &:hover { border-color: $color-primary; color: $color-primary; }
    &.active { background: $color-primary; color: white; border-color: $color-primary; }
  }
}

.newsletter {
  padding: $space-20 0;
  .newsletter-inner {
    background: linear-gradient(135deg, $color-primary, #f59e0b);
    padding: $space-16;
    border-radius: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    color: white;

    @include lg { flex-direction: row; text-align: left; justify-content: space-between; }

    h2 { font-size: 2.5rem; font-weight: 800; margin-bottom: 10px; }
    p { opacity: 0.9; font-size: 1.1rem; }

    .subscribe-form {
      margin-top: $space-8;
      display: flex;
      background: white;
      padding: 6px;
      border-radius: 18px;
      width: 100%;
      max-width: 500px;
      @include lg { margin-top: 0; }

      input { border: none; padding: 10px 20px; flex: 1; border-radius: 12px; outline: none; font-size: 15px; }
      button { background: #1e293b; color: white; border: none; padding: 0 24px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: all 0.3s; &:hover { background: #000; } }
    }
  }
}
</style>
