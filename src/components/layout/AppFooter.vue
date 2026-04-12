<template>
  <footer class="footer">
    <div class="container footer__content">
      <!-- Column 1: Brand -->
      <div class="footer__column brand-section">
        <div class="footer__logo">
          <i class="pi pi-send logo-icon"></i>
          <span class="logo-text">Triptopia</span>
        </div>
        <p class="footer__description">
          {{ t('footer.description', 'Triptopia - Hành trình khám phá những điểm đến tuyệt vời nhất tại Việt Nam. Chúng tôi mang đến trải nghiệm du lịch chuyên nghiệp và tận tâm.') }}
        </p>
        <div class="footer__socials">
          <a v-for="s in socials" :key="s.icon" :href="s.link" class="social-link" target="_blank">
            <i :class="['pi', s.icon]"></i>
          </a>
        </div>
      </div>

      <!-- Column 2: About -->
      <div class="footer__column">
        <h4 class="footer__title">{{ t('footer.aboutTitle', 'Thông tin') }}</h4>
        <ul class="footer__list">
          <li v-for="link in aboutLinks" :key="link.path">
            <RouterLink :to="link.path">{{ link.label }}</RouterLink>
          </li>
        </ul>
      </div>

      <!-- Column 3: Contact -->
      <div class="footer__column">
        <h4 class="footer__title">{{ t('footer.contactTitle', 'Liên hệ') }}</h4>
        <ul class="footer__list contact-list">
          <li>
            <i class="pi pi-phone"></i>
            <span>+012 345 67890</span>
          </li>
          <li>
            <i class="pi pi-envelope"></i>
            <span>contact@triptopia.vn</span>
          </li>
          <li>
            <i class="pi pi-map-marker"></i>
            <span>123 Street, Da Nang, VN</span>
          </li>
        </ul>
      </div>

      <!-- Column 4: Gallery -->
      <div class="footer__column">
        <h4 class="footer__title">{{ t('footer.galleryTitle', 'Bộ sưu tập') }}</h4>
        <div class="footer__gallery">
          <div v-for="i in 6" :key="i" class="gallery-item">
            <img :src="getGalleryImg(i)" :alt="'Gallery ' + i" />
          </div>
        </div>
      </div>
    </div>

    <!-- Copyright Bar -->
    <div class="footer__bottom">
      <div class="container bottom-content">
        <p>© {{ year }} Triptopia. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const year = new Date().getFullYear()

const socials = [
  { icon: 'pi-facebook', link: '#' },
  { icon: 'pi-instagram', link: '#' },
  { icon: 'pi-twitter', link: '#' },
  { icon: 'pi-pinterest', link: '#' }
]

const aboutLinks = computed(() => [
  { label: t('footer.aboutUs', 'Về chúng tôi'), path: '/about' },
  { label: t('footer.services', 'Dịch vụ'), path: '/services' },
  { label: t('footer.privacy', 'Chính sách bảo mật'), path: '/privacy' },
  { label: t('footer.terms', 'Điều khoản sử dụng'), path: '/terms' }
])

function getGalleryImg(i) {
  const imgs = [
    'https://images.unsplash.com/photo-1555921015-5532091f6026?w=200&q=70',
    'https://images.unsplash.com/photo-1528127269322-539801943592?w=200&q=70',
    'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=200&q=70',
    'https://images.unsplash.com/photo-1573390016527-19ef6f38ebe3?w=200&q=70',
    'https://images.unsplash.com/photo-1595959183082-7b570a7a3829?w=200&q=70',
    'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=200&q=70',
  ]
  return imgs[(i - 1) % imgs.length]
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.footer {
  background: linear-gradient(180deg, #0d1b2b 0%, #1a2e42 100%);
  color: rgba(255, 255, 255, 0.75);
  border-top: none;
  padding-top: $space-20;

  &__content {
    display: grid;
    grid-template-columns: 1fr;
    gap: $space-12;
    padding-bottom: $space-12;

    @include md {
      grid-template-columns: repeat(2, 1fr);
    }

    @include lg {
      grid-template-columns: 1.5fr 1fr 1.2fr 1.3fr;
    }
  }

  &__column {
    display: flex;
    flex-direction: column;
    gap: $space-6;
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: $space-3;
    
    .logo-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, $color-primary, #1E6B8C);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      color: white;
      box-shadow: 0 4px 12px rgba(35, 87, 137, 0.4);
    }
    
    .logo-text {
      font-size: 1.5rem;
      font-weight: 800;
      font-family: $font-heading;
      letter-spacing: -0.02em;
      color: white;
      span { color: #FF6B35; }
    }
  }

  &__description {
    font-size: 0.9rem;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.55);
    max-width: 300px;
  }

  &__socials {
    display: flex;
    gap: $space-4;
    margin-top: $space-2;

    .social-link {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.6);
      transition: all 0.3s ease;
      text-decoration: none;

      i { font-size: 1rem; }

      &:hover {
        transform: translateY(-3px);
        background: $color-primary;
        color: white;
        border-color: $color-primary;
        box-shadow: 0 8px 20px rgba(35, 87, 137, 0.4);
      }
    }
  }

  &__title {
    font-size: 0.95rem;
    font-weight: 700;
    margin: 0;
    position: relative;
    padding-bottom: $space-3;
    color: white;
    
    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 32px;
      height: 2px;
      background: $color-accent;
      border-radius: $border-radius-full;
    }
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: $space-4;

    li {
      a {
        color: rgba(255, 255, 255, 0.55);
        text-decoration: none;
        transition: $transition-fast;
        font-size: 0.875rem;

        &:hover {
          color: white;
          padding-left: 5px;
        }
      }
    }

    &.contact-list {
      li {
        display: flex;
        align-items: center;
        gap: $space-3;
        color: rgba(255, 255, 255, 0.55);
        font-size: 0.875rem;

        i {
          color: $color-accent;
          font-size: 0.9rem;
          flex-shrink: 0;
        }
      }
    }
  }

  &__gallery {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: $space-3;
    max-width: 280px;

    .gallery-item {
      aspect-ratio: 1;
      overflow: hidden;
      border-radius: $border-radius-md;
      background: #eee;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
        
        &:hover {
          transform: scale(1.15);
        }
      }
    }
  }

  &__bottom {
    background: rgba(0, 0, 0, 0.25);
    border-top: 1px solid rgba(255, 255, 255, 0.07);
    padding: $space-5 0;
    text-align: center;
    color: rgba(255, 255, 255, 0.35);
    font-size: 0.82rem;
    font-weight: 400;
  }
}
</style>
