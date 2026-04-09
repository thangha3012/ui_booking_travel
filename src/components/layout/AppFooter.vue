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
  // Using relative path to the moved assets
  return new URL(`../../assets/imgs/footer/g${i}.png`, import.meta.url).href
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.footer {
  background-color: #f8f9fa; // Match light background from image
  border-top: 1px solid #e5e7eb;
  padding-top: $space-16;
  color: $color-text-primary;

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
      font-size: 1.8rem;
      color: $color-primary;
    }
    
    .logo-text {
      font-size: 1.6rem;
      font-weight: 800;
      font-family: $font-heading;
      letter-spacing: -0.02em;
    }
  }

  &__description {
    font-size: 0.95rem;
    line-height: 1.6;
    color: $color-text-secondary;
    max-width: 320px;
  }

  &__socials {
    display: flex;
    gap: $space-4;
    margin-top: $space-2;

    .social-link {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $color-text-primary;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      text-decoration: none;

      i { font-size: 1.2rem; }

      &:hover {
        transform: translateY(-3px);
        background: $color-primary;
        color: white;
        box-shadow: 0 10px 15px -3px rgba(35, 87, 137, 0.3);
      }
    }
  }

  &__title {
    font-size: 1.2rem;
    font-weight: 700;
    margin: 0;
    position: relative;
    padding-bottom: $space-2;
    
    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 40px;
      height: 3px;
      background: $color-primary;
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
        color: $color-text-secondary;
        text-decoration: none;
        transition: $transition-fast;
        font-size: 0.95rem;

        &:hover {
          color: $color-primary;
          padding-left: 5px;
        }
      }
    }

    &.contact-list {
      li {
        display: flex;
        align-items: center;
        gap: $space-3;
        color: $color-text-secondary;
        font-size: 0.95rem;

        i {
          color: $color-primary;
          font-size: 1rem;
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
    background-color: #f1f3f5;
    padding: $space-6 0;
    border-top: 1px solid #e9ecef;
    text-align: center;
    color: $color-text-secondary;
    font-size: 0.9rem;
    font-weight: 500;
  }
}
</style>
