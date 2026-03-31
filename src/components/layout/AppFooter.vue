<template>
  <footer class="footer">
    <div class="container footer__inner">
      <div class="footer__brand">
        <div class="footer__logo">✈️ Voyage<span>VN</span></div>
        <p class="footer__tagline">{{ t('home.heroDesc') }}</p>
      </div>
      <div class="footer__nav">
        <RouterLink to="/" class="footer__link">{{ t('nav.home') }}</RouterLink>
        <RouterLink to="/tours" class="footer__link">{{ t('nav.tours') }}</RouterLink>
        <RouterLink to="/login" class="footer__link">{{ t('nav.login') }}</RouterLink>
      </div>
    </div>
    <div class="footer__bottom">
      <p>© {{ year }} VoyageVN. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const year = new Date().getFullYear()
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.footer {
  background: rgba(10,10,20,0.95);
  border-top: 1px solid $color-border;
  padding-top: $space-12;

  &__inner {
    display: grid;
    grid-template-columns: 1fr;
    gap: $space-8;
    padding-bottom: $space-12;

    @include md { grid-template-columns: 2fr 1fr; }
  }

  &__logo {
    font-family: $font-heading;
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    margin-bottom: $space-3;
    span { color: $color-accent; }
  }

  &__tagline { color: $color-text-muted; font-size: $font-size-sm; max-width: 300px; }

  &__nav {
    display: flex;
    flex-direction: column;
    gap: $space-3;
  }

  &__link {
    color: $color-text-muted;
    text-decoration: none;
    font-size: $font-size-sm;
    transition: $transition-fast;
    &:hover { color: $color-accent; }
  }

  &__bottom {
    border-top: 1px solid $color-border;
    padding: $space-4;
    text-align: center;
    font-size: $font-size-xs;
    color: $color-text-muted;
  }
}
</style>
