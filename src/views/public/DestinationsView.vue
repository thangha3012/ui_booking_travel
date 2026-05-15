<template>
  <div class="destinations-view">
    <!-- Hero -->
    <section class="dest-hero">
      <div class="container">
        <span class="label">Khám phá thế giới</span>
        <h1>Những Điểm Đến <br/><span class="text-primary">Tuyệt Mỹ</span></h1>
        <p>Tìm kiếm cảm hứng cho hành trình tiếp theo của bạn qua bộ sưu tập những điểm đến hàng đầu.</p>
      </div>
      <div class="hero-shapes">
        <div class="shape s1"></div>
        <div class="shape s2"></div>
      </div>
    </section>

    <!-- Filter/Search -->
    <section class="dest-filter">
      <div class="container">
        <div class="search-box">
          <i class="pi pi-search"></i>
          <input type="text" placeholder="Tìm kiếm địa danh bạn muốn đến..." v-model="searchQuery" />
        </div>
      </div>
    </section>

    <!-- Destinations Grid -->
    <section class="section dest-list">
      <div class="container">
        <div class="dest-grid">
          <div v-for="d in filteredDestinations" :key="d.id" class="dest-item">
            <div class="dest-img-box">
              <img :src="d.img" :alt="d.name" />
              <div class="dest-overlay">
                <div class="dest-meta">
                  <span class="tour-count">{{ d.tourCount }} Tours</span>
                  <h3>{{ d.name }}</h3>
                  <p>{{ d.desc }}</p>
                  <RouterLink to="/tours" class="btn-explore">Khám phá ngay</RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured regions -->
    <section class="section region-section">
      <div class="container">
        <div class="section-header text-center">
          <p class="section-label">Vùng miền nổi bật</p>
          <h2 class="section-title">Khám Phá Theo Vùng</h2>
        </div>
        <div class="region-grid">
          <div v-for="r in regions" :key="r.name" class="region-card" :style="{ backgroundImage: `url(${r.img})` }">
            <div class="region-content">
              <h3>{{ r.name }}</h3>
              <p>{{ r.desc }}</p>
              <RouterLink to="/tours" class="link">Xem tất cả <i class="pi pi-arrow-right"></i></RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')

const destinations = [
  { id: 1, name: 'Hạ Long', tourCount: 15, desc: 'Kỳ quan thiên nhiên thế giới với hàng ngàn đảo đá vôi.', img: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&q=80' },
  { id: 2, name: 'Sapa', tourCount: 12, desc: 'Thị trấn trong sương với những thửa ruộng bậc thang kỳ vĩ.', img: 'https://images.unsplash.com/photo-1581009146145-b5ef03a7403f?w=800&q=80' },
  { id: 3, name: 'Đà Nẵng', tourCount: 20, desc: 'Thành phố đáng sống nhất Việt Nam với những bãi biển tuyệt đẹp.', img: 'https://images.unsplash.com/photo-1559592442-741eafb85a0b?w=800&q=80' },
  { id: 4, name: 'Phú Quốc', tourCount: 18, desc: 'Đảo ngọc thiên đường với những khu nghỉ dưỡng đẳng cấp.', img: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&q=80' },
  { id: 5, name: 'Hà Giang', tourCount: 10, desc: 'Vùng cao nguyên đá với những cung đường đèo hiểm trở.', img: 'https://images.unsplash.com/photo-1614704055277-2f3b79872c6c?w=800&q=80' },
  { id: 6, name: 'Đà Lạt', tourCount: 25, desc: 'Thành phố ngàn hoa với khí hậu ôn hòa quanh năm.', img: 'https://images.unsplash.com/photo-1613063546738-96cc65b6f0ef?w=800&q=80' },
]

const regions = [
  { name: 'Miền Bắc', desc: 'Nét văn hóa ngàn năm văn hiến', img: 'https://images.unsplash.com/photo-1599708153386-62bf3f023064?w=800&q=80' },
  { name: 'Miền Trung', desc: 'Di sản thế giới & biển xanh', img: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80' },
  { name: 'Miền Nam', desc: 'Sự nhộn nhịp & miền tây sông nước', img: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80' },
]

const filteredDestinations = computed(() => {
  return destinations.filter(d => d.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.dest-hero {
  position: relative;
  background: #0f172a;
  color: white;
  padding: 140px 0 100px;
  text-align: center;
  overflow: hidden;

  .label { font-weight: 800; color: $color-primary; text-transform: uppercase; letter-spacing: 4px; display: block; margin-bottom: $space-4; }
  h1 { font-size: 4rem; font-weight: 800; line-height: 1.1; margin-bottom: $space-6; }
  p { font-size: 1.25rem; opacity: 0.7; max-width: 600px; margin: 0 auto; }

  .hero-shapes {
    .shape { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.2; }
    .s1 { width: 400px; height: 400px; background: $color-primary; top: -100px; left: -100px; }
    .s2 { width: 300px; height: 300px; background: #3b82f6; bottom: -50px; right: -50px; }
  }
}

.dest-filter {
  margin-top: -40px;
  position: relative;
  z-index: 10;
  .search-box {
    background: white;
    padding: 20px 30px;
    border-radius: 25px;
    box-shadow: 0 15px 40px rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
    gap: 15px;
    max-width: 800px;
    margin: 0 auto;
    
    i { color: $color-primary; font-size: 20px; }
    input { border: none; font-size: 1.1rem; width: 100%; outline: none; font-weight: 600; }
  }
}

.dest-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: $space-8;
  @include md { grid-template-columns: repeat(2, 1fr); }
  @include lg { grid-template-columns: repeat(3, 1fr); }
}

.dest-item {
  border-radius: 35px;
  overflow: hidden;
  height: 450px;
  position: relative;
  cursor: pointer;

  &:hover {
    .dest-img-box img { transform: scale(1.15); }
    .dest-overlay { background: rgba(0,0,0,0.4); }
    .dest-meta { transform: translateY(0); opacity: 1; }
  }
}

.dest-img-box {
  width: 100%;
  height: 100%;
  position: relative;
  img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s ease; }
}

.dest-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  display: flex;
  align-items: flex-end;
  padding: $space-10;
  transition: all 0.4s;
}

.dest-meta {
  color: white;
  transform: translateY(20px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  .tour-count {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(5px);
    padding: 5px 15px;
    border-radius: 50px;
    font-size: 12px;
    font-weight: 800;
    margin-bottom: 15px;
    display: inline-block;
  }

  h3 { font-size: 2rem; font-weight: 800; margin-bottom: 10px; }
  p { font-size: 14px; opacity: 0.8; margin-bottom: 20px; line-height: 1.5; }

  .btn-explore {
    background: white;
    color: #0f172a;
    padding: 10px 25px;
    border-radius: 50px;
    font-weight: 800;
    text-decoration: none;
    font-size: 14px;
    display: inline-block;
    transition: all 0.3s;
    &:hover { background: $color-primary; color: white; }
  }
}

.region-section {
  background: #f8fafc;
}

.region-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: $space-8;
  @include lg { grid-template-columns: repeat(3, 1fr); }
}

.region-card {
  height: 300px;
  border-radius: 30px;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: $space-10;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 1;
  }

  .region-content {
    position: relative;
    z-index: 2;
    color: white;
    h3 { font-size: 1.75rem; font-weight: 800; margin-bottom: 10px; }
    p { opacity: 0.8; margin-bottom: 20px; font-size: 15px; }
    .link { color: $color-primary; font-weight: 800; text-decoration: none; display: flex; align-items: center; gap: 8px; &:hover { color: white; } }
  }
}
</style>
