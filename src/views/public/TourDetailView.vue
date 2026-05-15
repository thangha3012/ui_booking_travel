<template>
  <div class="tour-detail-page">
    <div v-if="loading" class="loading-overlay">
      <ProgressSpinner />
    </div>

    <!-- HERO SECTION -->
    <div class="detail-hero" v-if="tour">
      <div class="detail-hero__overlay"></div>
      <div class="container detail-hero__content">
        <h1 class="detail-hero__title">{{ tour.title }}</h1>
        <div class="detail-hero__breadcrumb">
          <RouterLink to="/">Trang chủ</RouterLink>
          <i class="pi pi-chevron-right"></i>
          <RouterLink to="/tours">Danh sách Tour</RouterLink>
          <i class="pi pi-chevron-right"></i>
          <span class="current">{{ tour.title }}</span>
        </div>
      </div>
    </div>

    <!-- MAIN CONTENT -->
    <div class="container detail-main" v-if="tour">
      <div class="detail-layout">
        <!-- LEFT COLUMN: Info & Content -->
        <div class="detail-info">
          <!-- Hero Image (Single) -->
          <div class="single-gallery">
            <Image
              :src="getFullImageUrl(tour.imageUrl) || defaultCover"
              alt="Tour chính"
              preview
              class="hero-image-display"
            />
          </div>

          <!-- Tags & Title -->
          <div class="tags-row-container">
            <Tag :value="tour.categoryName" severity="info" rounded />
            <Tag
              :value="tour.destinationName"
              severity="secondary"
              rounded
              icon="pi pi-map-marker"
            />
            <div class="rating-badge-right">
              <i class="pi pi-star-fill star-icon"></i>
              <span class="rating-value">{{
                averageRating > 0 ? averageRating.toFixed(1) : 'Chưa có đánh giá'
              }}</span>
            </div>
          </div>

          <h1 class="tour-title">{{ tour.title }}</h1>

          <!-- Bảng 4 Khối Thông Tin Đặc Thù -->
          <div class="quick-info-grid">
            <div class="q-item">
              <i class="pi pi-qrcode q-icon"></i>
              <div class="q-content">
                <span class="q-label">MÃ TOUR</span>
                <span class="q-val value-bold">{{
                  tour.tourCode || `TR-${tour.id}`
                }}</span>
              </div>
            </div>
            <div class="q-item">
              <i class="pi pi-clock q-icon"></i>
              <div class="q-content">
                <span class="q-label">THỜI GIAN</span>
                <span class="q-val value-bold">{{
                  tour.duration || getDuration(tour)
                }}</span>
              </div>
            </div>
            <div class="q-item">
              <i class="pi pi-map-marker q-icon"></i>
              <div class="q-content">
                <span class="q-label">KHỞI HÀNH</span>
                <span class="q-val value-bold">{{
                  tour.departureLocation || 'Đang cập nhật'
                }}</span>
              </div>
            </div>
            <div class="q-item">
              <i class="pi pi-send q-icon"></i>
              <div class="q-content">
                <span class="q-label">PHƯƠNG TIỆN</span>
                <span class="q-val value-bold">{{
                  tour.transport || 'Đang cập nhật'
                }}</span>
              </div>
            </div>
          </div>

          <!-- Tabs -->
          <div class="tour-tabs-container">
            <Tabs value="0">
              <TabList>
                <Tab value="0"><i class="pi pi-info-circle tab-icon"></i>Tổng quan</Tab>
                <Tab value="1"><i class="pi pi-map tab-icon"></i>Lịch trình</Tab>
                <Tab value="2"><i class="pi pi-book tab-icon"></i>Chính sách</Tab>
                <Tab value="3"><i class="pi pi-calendar-plus tab-icon"></i>Giá & Lịch khởi hành</Tab>
                <Tab value="4"><i class="pi pi-star tab-icon"></i>Đánh giá</Tab>
              </TabList>
              <TabPanels>
                <!-- Overview -->
                <TabPanel value="0">
                  <div class="tab-content-inner animate-fade-in">
                    <h3 class="tab-section-title">Giới thiệu chuyến đi</h3>
                    <div
                      class="tour-desc rich-text description-spacing"
                      v-html="tour.description || 'Chưa có thông tin giới thiệu cho tour này.'"
                    ></div>
                    <div class="tour-highlights">
                      <h3 class="tab-section-title">Điểm nổi bật</h3>
                      <div
                        class="tour-desc rich-text"
                        v-html="tour.highlights || 'Đang cập nhật...'"
                      ></div>
                    </div>
                  </div>
                </TabPanel>

                <!-- Itinerary -->
                <TabPanel value="1">
                  <div class="tab-content-inner animate-fade-in">
                    <div
                      class="rich-text"
                      v-html="tour.itinerary || 'Chưa có thông tin chi tiết lịch trình.'"
                    ></div>
                  </div>
                </TabPanel>

                <!-- Policies -->
                <TabPanel value="2">
                  <div class="tab-content-inner animate-fade-in">
                    <div
                      class="rich-text"
                      v-html="tour.policies || 'Đang cập nhật quy định và chính sách hoàn hủy.'"
                    ></div>
                  </div>
                </TabPanel>

                <!-- Schedules -->
                <TabPanel value="3">
                  <div class="tab-content-inner animate-fade-in">
                    <div class="schedule-list-vertical">
                      <div v-for="s in tour.schedules" :key="s.id" class="schedule-item">
                        <div class="schedule-dates">
                          <div class="date-box">
                            <span class="label">KHỞI HÀNH</span>
                            <span class="date">{{ formatDate(s.departureDate) }}</span>
                          </div>
                          <div class="date-arrow"><i class="pi pi-arrow-right"></i></div>
                          <div class="date-box">
                            <span class="label">TRỞ VỀ</span>
                            <span class="date">{{ formatDate(s.returnDate) }}</span>
                          </div>
                        </div>
                        <div class="schedule-info">
                          <div class="seats-left-status">
                            <span
                              class="seat-label-pill"
                              :class="s.availableSeats < 5 ? 'critical' : 'stable'"
                            >
                              <i class="pi pi-users icon-small"></i> Còn {{ s.availableSeats }} chỗ
                            </span>
                            <div class="progress-bar-container">
                              <div
                                class="progress-bar-fill"
                                :class="s.availableSeats < 5 ? 'critical' : 'stable'"
                                :style="{
                                  width:
                                    ((s.totalSeats - s.availableSeats) / s.totalSeats) * 100 + '%',
                                }"
                              ></div>
                            </div>
                          </div>
                          <div class="schedule-pricings-grid">
                            <div v-for="p in s.pricings" :key="p.passengerType" class="price-chip">
                              {{ getPassengerTypeName(p.passengerType) }}:
                              <strong>{{ formatPrice(p.price) }} đ</strong>
                            </div>
                          </div>
                        </div>
                        <Button
                          label="Chọn ngày này"
                          icon="pi pi-check"
                          size="small"
                          @click="selectSchedule(s)"
                        />
                      </div>
                    </div>
                  </div>
                </TabPanel>

                <!-- Reviews -->
                <TabPanel value="4">
                  <div class="tab-content-inner animate-fade-in">
                    <div class="review-section">
                      <div class="review-summary-header-box">
                        <div
                          class="review-stats-container"
                        >
                          <div class="avg-rating-large">
                            <span class="number">{{ averageRating.toFixed(1) }}</span>
                            <div class="stars">
                              <i
                                v-for="i in 5"
                                :key="i"
                                class="pi"
                                :class="i <= Math.round(averageRating) ? 'pi-star-fill' : 'pi-star'"
                              ></i>
                            </div>
                            <span class="total">Dựa trên {{ reviews.length }} đánh giá</span>
                          </div>
                          <div class="rating-bars-stack">
                            <div v-for="i in [5, 4, 3, 2, 1]" :key="i" class="rating-row">
                              <span class="star-num">{{ i }} sao</span>
                              <div class="bar-bg">
                                <div
                                  class="bar-fill"
                                  :style="{ width: getRatingPercent(i) + '%' }"
                                ></div>
                              </div>
                              <span class="count">{{ getRatingCount(i) }}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div v-if="loadingReviews" class="review-loading-wrap">
                        <ProgressSpinner style="width: 40px; height: 40px" strokeWidth="4" />
                      </div>
                      <div v-else>
                        <div
                          v-if="!reviews.length"
                          class="empty-reviews-box"
                        >
                          <div class="empty-review-icon">
                            <i class="pi pi-comments"></i>
                          </div>
                          <p class="empty-title">
                            Chưa có đánh giá nào cho tour này.
                          </p>
                          <p class="empty-desc">
                            Hãy đi tour và trở thành người đầu tiên đánh giá!
                          </p>
                        </div>

                        <div v-else class="review-list-vertical">
                          <div v-for="rev in reviews" :key="rev.id" class="modern-review-card">
                            <div class="rev-header">
                              <div class="rev-user">
                                <div class="rev-avatar">
                                  {{ (rev.user?.fullName || 'K').charAt(0).toUpperCase() }}
                                </div>
                                <div class="rev-user-info">
                                  <span class="name">{{
                                    rev.user?.fullName || 'Khách ẩn danh'
                                  }}</span>
                                  <span class="date">{{
                                    formatDate(rev.createdAt || new Date())
                                  }}</span>
                                </div>
                              </div>
                              <div class="rev-stars">
                                <i
                                  v-for="i in 5"
                                  :key="i"
                                  class="pi"
                                  :class="i <= rev.rating ? 'pi-star-fill' : 'pi-star'"
                                ></i>
                              </div>
                            </div>
                            <h4 class="rev-title" v-if="rev.title">{{ rev.title }}</h4>
                            <p class="rev-content">{{ rev.content }}</p>
                            <div class="rev-verified" v-if="rev.isVerified">
                              <i class="pi pi-verified"></i> Đã mua tour này
                            </div>
                          </div>
                        </div>

                        <!-- FORM ĐÁNH GIÁ -->
                        <div class="review-form-card">
                          <div v-if="reviewSubmitted" class="review-submitted-msg">
                            <div class="success-icon"><i class="pi pi-check-circle"></i></div>
                            <div class="msg-content">
                              <h4 class="success-msg-title">
                                Cảm ơn bạn đã đánh giá!
                              </h4>
                              <p class="success-msg-desc">
                                Nhận xét của bạn đang chờ phê duyệt và sẽ hiển thị sớm.
                              </p>
                              <Button
                                label="Gửi đánh giá khác"
                                text
                                severity="success"
                                size="small"
                                class="btn-resubmit"
                                @click="reviewSubmitted = false"
                              />
                            </div>
                          </div>

                          <div v-else class="review-form-content">
                            <div class="form-header">
                              <h4 class="form-main-title">
                                Viết nhận xét của bạn
                              </h4>
                              <p class="form-subtitle">
                                Chia sẻ trải nghiệm thực tế để giúp cộng đồng du lịch.
                              </p>
                            </div>

                            <div class="rating-selector-group">
                              <span class="selector-label">Đánh giá của bạn:</span>
                              <div class="stars-input">
                                <i
                                  v-for="i in 5"
                                  :key="i"
                                  class="pi star-item"
                                  :class="[
                                    i <= newReview.rating ? 'pi-star-fill active' : 'pi-star',
                                  ]"
                                  @click="newReview.rating = i"
                                ></i>
                                <span class="rating-text">{{
                                  getRatingLabel(newReview.rating)
                                }}</span>
                              </div>
                            </div>

                            <div class="form-fields-grid">
                              <div class="input-group">
                                <label>Tiêu đề nhận xét</label>
                                <InputText
                                  v-model="newReview.title"
                                  placeholder="Ví dụ: Chuyến đi tuyệt vời, Hướng dẫn viên nhiệt tình..."
                                  class="premium-input"
                                />
                              </div>

                              <div class="input-group">
                                <label>Nội dung chi tiết</label>
                                <Textarea
                                  v-model="newReview.content"
                                  rows="4"
                                  placeholder="Hãy chia sẻ thêm về dịch vụ, khách sạn, đồ ăn và các điểm đến..."
                                  class="premium-input"
                                />
                              </div>

                              <div class="form-footer">
                                <div class="footer-note">
                                  <i class="pi pi-info-circle"></i>
                                  <span
                                    >Chỉ những khách hàng đã mua tour mới có thể để lại đánh giá
                                    thực tế.</span
                                  >
                                </div>
                                <Button
                                  label="Gửi Đánh Giá Ngay"
                                  icon="pi pi-send"
                                  class="submit-button"
                                  @click="submitReview"
                                  :loading="submittingReview"
                                  :disabled="!newReview.content || !newReview.title"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
        </div>

        <!-- RIGHT COLUMN: Booking Sidebar -->
        <div class="detail-sidebar">
          <div class="booking-box-wrap sticky top-24">
            <div class="booking-box">
              <div class="price-header-wrapper">
                <div class="price-content">
                  <span class="price-label">Giá từ</span>
                  <div class="price-main">
                    <span class="price-amount">{{ formatPrice(displayPrice) }}</span>
                    <span class="price-currency">đ</span>
                    <span class="price-unit">/ khách</span>
                  </div>
                </div>
              </div>

              <div class="booking-form">
                <div class="p-field booking-field">
                  <label class="booking-label">Chọn ngày khởi hành</label>
                  <Select
                    v-model="bookingForm.schedule"
                    :options="tour.schedules"
                    optionLabel="departureDate"
                    placeholder="Chọn ngày khởi hành"
                    class="w-full"
                  >
                    <template #value="slotProps">
                      <div v-if="slotProps.value">
                        {{ formatDate(slotProps.value.departureDate) }}
                      </div>
                      <span v-else>{{ slotProps.placeholder }}</span>
                    </template>
                    <template #option="slotProps">
                      <div class="py-1 text-slate-700 font-medium text-sm">
                        {{ formatDate(slotProps.option.departureDate) }}
                      </div>
                    </template>
                  </Select>
                </div>

                <div class="passengers-selection-area">
                  <div class="p-field">
                    <label>Người lớn</label>
                    <InputNumber
                      v-model="bookingForm.adults"
                      showButtons
                      :min="1"
                      :max="20"
                      fluid
                      class="mini-spinner"
                    />
                  </div>
                  <div class="p-field">
                    <label>Trẻ em</label>
                    <InputNumber
                      v-model="bookingForm.children"
                      showButtons
                      :min="0"
                      :max="20"
                      fluid
                      class="mini-spinner"
                    />
                  </div>
                  <div class="p-field">
                    <label>Em bé</label>
                    <InputNumber
                      v-model="bookingForm.infants"
                      showButtons
                      :min="0"
                      :max="10"
                      fluid
                      class="mini-spinner"
                    />
                  </div>
                  <div v-if="bookingForm.schedule" class="seats-left-container">
                    <small
                      class="seats-left-note"
                      :class="{ 'danger-note': totalPax > bookingForm.schedule.availableSeats }"
                    >
                      Còn {{ bookingForm.schedule.availableSeats }} chỗ trống
                    </small>
                  </div>
                </div>

                <div class="booking-summary-box">
                  <div class="summary-row">
                    <span>Số lượng khách:</span>
                    <span>{{ totalPax }} người</span>
                  </div>

                  <div class="price-breakdown-list" v-if="bookingForm.adults > 0 || bookingForm.children > 0 || bookingForm.infants > 0">
                    <div class="breakdown-item" v-if="bookingForm.adults > 0">
                      <div class="item-label-group">
                        <span class="main-label">Người lớn ({{ bookingForm.adults }}x)</span>
                        <span class="sub-label">{{ formatPrice(findPrice(1)) }}đ / khách</span>
                      </div>
                      <span class="item-price">{{ formatPrice(bookingForm.adults * findPrice(1)) }}đ</span>
                    </div>

                    <div class="breakdown-item" v-if="bookingForm.children > 0">
                      <div class="item-label-group">
                        <span class="main-label">Trẻ em ({{ bookingForm.children }}x)</span>
                        <span class="sub-label">{{ formatPrice(findPrice(2)) }}đ / khách</span>
                      </div>
                      <span class="item-price">{{ formatPrice(bookingForm.children * findPrice(2)) }}đ</span>
                    </div>

                    <div class="breakdown-item" v-if="bookingForm.infants > 0">
                      <div class="item-label-group">
                        <span class="main-label">Em bé ({{ bookingForm.infants }}x)</span>
                        <span class="sub-label">{{ formatPrice(findPrice(3)) }}đ / khách</span>
                      </div>
                      <span class="item-price">{{ formatPrice(bookingForm.infants * findPrice(3)) }}đ</span>
                    </div>
                  </div>

                  <div class="total-payment-row" v-if="bookingForm.schedule">
                    <span class="total-label">Tổng thanh toán</span>
                    <span class="total-value">{{ formatPrice(calculateTotal()) }} đ</span>
                  </div>
                </div>

                <div class="booking-button-container">
                  <Button
                    label="TIẾP TỤC ĐẶT TOUR"
                    icon="pi pi-bolt"
                    raised
                    class="book-btn-centered"
                    @click="goToCheckout"
                    :disabled="!bookingForm.schedule"
                  />
                </div>

                <div class="trust-section-new">
                  <div class="trust-item-new">
                    <div class="trust-icon-box trust-icon-blue">
                      <i class="pi pi-shield"></i>
                    </div>
                    <div class="trust-content-new">
                      <span class="trust-title-new">Đảm Bảo Hài Lòng 100%</span>
                      <span class="trust-desc-new">Cam kết dịch vụ chất lượng cao nhất.</span>
                    </div>
                  </div>
                  <div class="trust-item-new">
                    <div class="trust-icon-box trust-icon-green">
                      <i class="pi pi-verified"></i>
                    </div>
                    <div class="trust-content-new">
                      <span class="trust-title-new title-green">Thanh Toán An Toàn</span>
                      <span class="trust-desc-new">Bảo mật giao dịch qua cổng ZaloPay.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Toast position="top-right" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { tourApi } from '@/api/tourApi'
import { destinationApi } from '@/api/destinationApi'
import reviewApi from '@/api/reviewApi'
import { bookingApi } from '@/api/bookingApi'
import { getFullImageUrl } from '@/utils/imageHelper'

// PrimeVue
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import Image from 'primevue/image'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import ProgressSpinner from 'primevue/progressspinner'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const loading = ref(true)
const tour = ref(null)
const defaultCover = 'https://images.unsplash.com/photo-1528127269322-539801943592?w=1200'

// Các ảnh nhỏ bên phải (fallback chuẩn)
const currentThumbs = ref([
  'https://images.unsplash.com/photo-1555921015-5532091f6026?w=600',
  'https://images.unsplash.com/photo-1573390016527-19ef6f38ebe3?w=600',
])

const bookingForm = reactive({
  schedule: null,
  adults: 2,
  children: 0,
  infants: 0,
})

// Review State
const reviews = ref([])
const loadingReviews = ref(false)
const submittingReview = ref(false)
const newReview = reactive({
  rating: 5,
  title: '',
  content: '',
  bookingId: 1, // Giả định
})
const reviewSubmitted = ref(false)

// Lấy số lượng đánh giá theo mức số sao cụ thể
function getRatingCount(stars) {
  return reviews.value.filter((r) => r.rating === stars).length
}

// Tính toán phần trăm đánh giá theo mức số sao
function getRatingPercent(stars) {
  if (!reviews.value.length) return 0
  return (getRatingCount(stars) / reviews.value.length) * 100
}

// Trả về nhãn mô tả mức độ đánh giá dựa trên số sao (ví dụ: Tuyệt vời, Tốt...)
function getRatingLabel(rating) {
  const labels = {
    1: 'Rất tệ',
    2: 'Tệ',
    3: 'Bình thường',
    4: 'Tốt',
    5: 'Tuyệt vời',
  }
  return labels[rating] || ''
}

const totalPax = computed(() => bookingForm.adults + bookingForm.children + bookingForm.infants)

const averageRating = computed(() => {
  if (!reviews.value || reviews.value.length === 0) {
    return tour.value?.rating || 0
  }
  const sum = reviews.value.reduce((acc, rev) => acc + rev.rating, 0)
  return sum / reviews.value.length
})

// Tính toán thời lượng chuyến đi (số ngày số đêm) dựa trên lịch trình
function getDuration(t) {
  if (t?.schedules && t.schedules.length > 0) {
    const s = t.schedules[0]
    const dep = new Date(s.departureDate)
    const ret = new Date(s.returnDate)
    const diffTime = Math.abs(ret - dep)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return `${diffDays + 1}N${diffDays}Đ`
  }
  return 'Đang cập nhật'
}

// Tìm giá thấp nhất hiện có trong tất cả các lịch trình còn chỗ
function getMinPrice(t) {
  if (!t) return 0
  if (!t.schedules?.length) return t.basePrice || 0

  const activeSchedules = t.schedules.filter((x) => x.availableSeats > 0)
  if (!activeSchedules.length) return t.basePrice || 0

  let min = Infinity
  activeSchedules.forEach((s) => {
    if (s.pricings?.length) {
      s.pricings.forEach((p) => {
        if (p.passengerType === 1 && p.price < min) min = p.price
      })
    }
  })

  return min === Infinity ? t.basePrice || 0 : min
}

const displayPrice = computed(() => {
  if (bookingForm.schedule) {
    return findPrice(1)
  }
  return getMinPrice(tour.value)
})

// Tìm giá tiền tương ứng cho một loại hành khách cụ thể trong lịch trình đã chọn
function findPrice(type) {
  if (!bookingForm.schedule || !bookingForm.schedule.pricings) {
    return type === 1 ? tour.value?.basePrice || 0 : 0
  }
  const pricing = bookingForm.schedule.pricings.find((p) => p.passengerType === type)
  if (pricing) return pricing.price

  // Fallback for Adult if no specific pricing found
  if (type === 1) return tour.value?.basePrice || 0
  return 0
}

// Tính tổng tiền dự kiến dựa trên số lượng khách và giá của lịch trình đã chọn
function calculateTotal() {
  if (!bookingForm.schedule) return 0
  let total = 0
  total += bookingForm.adults * findPrice(1) // Adult=1
  total += bookingForm.children * findPrice(2) // Child=2
  total += bookingForm.infants * findPrice(3) // Infant=3

  return total
}

// Định dạng số tiền sang kiểu VNĐ
function formatPrice(val) {
  if (!val) return '0'
  return new Intl.NumberFormat('vi-VN').format(val)
}

// Định dạng ngày tháng sang kiểu Việt Nam
function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('vi-VN')
}

// Chuyển đổi mã loại hành khách sang tên hiển thị (Người lớn, Trẻ em...)
function getPassengerTypeName(type) {
  if (type === 1) return 'Người lớn'
  if (type === 2) return 'Trẻ em'
  if (type === 3) return 'Sơ sinh'
  return 'Pax'
}

// Chọn một lịch trình cụ thể và cuộn lên phần thông tin đặt tour
function selectSchedule(s) {
  bookingForm.schedule = s
  window.scrollTo({ top: 400, behavior: 'smooth' })
}

// Tự động điều chỉnh số lượng khách nếu vượt quá số chỗ còn trống của lịch trình
function correctPassengerCounts() {
  if (bookingForm.schedule && totalPax.value > bookingForm.schedule.availableSeats) {
    if (bookingForm.schedule.availableSeats > 0) {
      bookingForm.adults = Math.min(bookingForm.adults, bookingForm.schedule.availableSeats)
      bookingForm.children = 0
      bookingForm.infants = 0
    }
  }
}

// Tải chi tiết thông tin tour từ API dựa trên ID
async function loadTour() {
  loading.value = true
  try {
    const res = await tourApi.getById(route.params.id)
    console.log('Tải Tour thành công:', res)
    if (res.success) {
      tour.value = res.data
      console.log('ID Tour hiện tại:', tour.value.id)

      // Nếu không có ảnh, dùng ảnh của khu vực
      if (!tour.value.imageUrl && tour.value.destinationId) {
        try {
          const destRes = await destinationApi.getById(tour.value.destinationId)
          if (destRes.success && destRes.data.coverImageUrl) {
            tour.value.imageUrl = destRes.data.coverImageUrl
            currentThumbs.value = [
              destRes.data.coverImageUrl,
              'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600',
            ]
          }
        } catch (e) {}
      }

      // Auto select first available schedule
      if (tour.value.schedules?.length) {
        bookingForm.schedule = tour.value.schedules.find((x) => x.availableSeats > 0)
        // Auto-correct số khách nếu vượt quá chỗ trống
        correctPassengerCounts()
      }

      // Tải reviews sau khi có tour
      loadReviews(tour.value.id)
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Chuyển hướng người dùng sang trang điền thông tin đặt chỗ sau khi đã kiểm tra điều kiện
function goToCheckout() {
  if (!bookingForm.schedule) {
    toast.add({
      severity: 'warn',
      summary: 'Chưa chọn lịch',
      detail: 'Vui lòng chọn lịch khởi hành phù hợp.',
      life: 4000,
    })
    return
  }

  // Kiểm tra số lượng hành khách không vượt quá chỗ trống
  const available = bookingForm.schedule.availableSeats
  if (totalPax.value > available) {
    toast.add({
      severity: 'error',
      summary: 'Không đủ chỗ',
      detail: `Lịch trình này chỉ còn ${available} chỗ trống, không đủ cho ${totalPax.value} hành khách. Vui lòng giảm số lượng khách.`,
      life: 5000,
    })
    return
  }

  if (totalPax.value <= 0) {
    toast.add({
      severity: 'warn',
      summary: 'Thiếu hành khách',
      detail: 'Vui lòng chọn ít nhất 1 hành khách.',
      life: 4000,
    })
    return
  }

  // Pass details to checkout
  router.push({
    name: 'booking',
    params: { scheduleId: bookingForm.schedule.id },
    query: {
      tourId: tour.value.id,
      adults: bookingForm.adults,
      children: bookingForm.children,
      infants: bookingForm.infants,
    },
  })
}

// Tải danh sách đánh giá của tour hiện tại từ API
async function loadReviews(tourId) {
  if (!tourId) return
  console.log('Đang tải đánh giá cho tour ID:', tourId)
  loadingReviews.value = true
  try {
    const res = await reviewApi.getByTourId(tourId)
    console.log('Kết quả API Review:', res)
    // apiClient tự unwrap response.data nên res là { success, data }
    if (res && res.success) {
      reviews.value = res.data || []
      console.log('Danh sách đánh giá:', reviews.value)
    } else if (Array.isArray(res)) {
      reviews.value = res
    }
  } catch (e) {
    console.error('Lỗi tải đánh giá:', e)
  } finally {
    loadingReviews.value = false
  }
}

// Gửi đánh giá mới lên hệ thống và cập nhật lại danh sách hiển thị
async function submitReview() {
  const token = localStorage.getItem('auth_token')
  if (!token) {
    toast.add({
      severity: 'warn',
      summary: 'Yêu cầu đăng nhập',
      detail: 'Vui lòng đăng nhập để gửi đánh giá!',
      life: 3000,
    })
    return router.push('/login')
  }

  if (!newReview.content || !newReview.title) {
    return toast.add({
      severity: 'error',
      summary: 'Thiếu thông tin',
      detail: 'Vui lòng nhập đầy đủ tiêu đề và nội dung.',
      life: 3000,
    })
  }

  submittingReview.value = true
  try {
    // Tìm bookingId thực tế của user cho tour này
    let validBookingId = null
    const bookingsRes = await bookingApi.getMyBookings()
    if (bookingsRes && bookingsRes.success) {
      // Tìm đơn hàng của tour hiện tại
      const myBooking = bookingsRes.data.find((b) => b.tourId === tour.value.id)
      if (myBooking) {
        validBookingId = myBooking.id
      }
    }

    // Nếu không tìm thấy booking nào, báo lỗi cho người dùng
    if (!validBookingId) {
      toast.add({
        severity: 'error',
        summary: 'Yêu cầu mua tour',
        detail: 'Bạn cần hoàn tất mua tour này trước khi đánh giá.',
        life: 5000,
      })
      return
    }

    const payload = {
      tourId: tour.value.id,
      bookingId: validBookingId,
      rating: newReview.rating,
      title: newReview.title,
      content: newReview.content,
    }
    const res = await reviewApi.createReview(payload)
    if (res && res.success) {
      toast.add({
        severity: 'success',
        summary: 'Thành công',
        detail: res.message || 'Gửi đánh giá thành công! Đang chờ admin duyệt.',
        life: 5000,
      })
      newReview.title = ''
      newReview.content = ''
      newReview.rating = 5
      reviewSubmitted.value = true
    } else {
      toast.add({
        severity: 'error',
        summary: 'Thất bại',
        detail: res?.message || 'Có lỗi xảy ra!',
        life: 3000,
      })
    }
  } catch (e) {
    console.error('Lỗi gửi review', e)
    toast.add({
      severity: 'error',
      summary: 'Lỗi hệ thống',
      detail: e.message || 'Có lỗi xảy ra khi gửi nhận xét.',
      life: 3000,
    })
  } finally {
    submittingReview.value = false
  }
}

onMounted(() => {
  loadTour()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.tour-detail-page {
  background: #fbfcfd;
  min-height: 100vh;
  padding-bottom: $space-24;
}

// Hero
.detail-hero {
  position: relative;
  height: 320px;
  background: url('https://images.unsplash.com/photo-1518182170546-076616fd6251?w=1920&q=80')
    center/cover;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: $navbar-height;

  &__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(35, 87, 137, 0.9), rgba(15, 23, 42, 0.7));
  }

  &__content {
    position: relative;
    z-index: 1;
    text-align: center;
    color: white;
  }
  &__title {
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 800;
    margin-bottom: $space-4;
    letter-spacing: -0.02em;
  }
  &__breadcrumb {
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $space-2;
    color: #cbd5e1;
    a {
      color: white;
      &:hover {
        color: $color-accent;
      }
    }
    .current {
      color: $color-accent;
      font-weight: 700;
    }
  }
}

.detail-main {
  margin-top: -$space-16;
  position: relative;
  z-index: 10;
}

.detail-layout {
  display: flex;
  flex-direction: column;
  gap: $space-8;
  @include lg {
    flex-direction: row;
    align-items: flex-start;
  }
}

.detail-info {
  flex: 1;
  background: white;
  border-radius: $border-radius-2xl;
  padding: $space-8;
  box-shadow: $shadow-xl;
  border: 1px solid #f1f5f9;
}

.detail-sidebar {
  width: 100%;
  @include lg {
    width: 360px;
  }
}

// Single Gallery
.single-gallery {
  width: 100%;
  height: 450px;
  margin-bottom: $space-8;

  :deep(.p-image) {
    width: 100%;
    height: 100%;
    .hero-image-display {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 24px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }
  }
}

.tags-row-container {
  display: flex;
  flex-wrap: wrap;
  gap: $space-3;
  margin-top: 1rem;
  margin-bottom: $space-4;
  align-items: center;
  .p-tag {
    font-size: 11px;
    padding: 4px 12px;
  }
}

.rating-badge-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  .star-icon {
    color: #fbbf24;
  }
  .rating-value {
    font-weight: 700;
    color: #1e293b;
  }
}

.tour-title {
  font-size: 2.25rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1.2;
  letter-spacing: -0.03em;
  margin-bottom: $space-6;
}

// Quick Info Grid
.quick-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
  @include md {
    grid-template-columns: repeat(4, 1fr);
  }

  .q-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: #f8fafc;
    border-radius: 12px;
    border: 1px solid #f1f5f9;
    .q-icon {
      font-size: 1.5rem;
      color: #1d4ed8;
    }
    .q-content {
      display: flex;
      flex-direction: column;
    }
    .q-label {
      font-size: 10px;
      font-weight: 800;
      color: #64748b;
      margin-bottom: 2px;
    }
    .q-val {
      font-size: 14px;
      &.value-bold {
        font-weight: 700;
        color: #1e293b;
      }
    }
  }
}

.tour-tabs-container {
  margin-top: 2rem;
  .tab-icon {
    margin-right: 0.5rem;
  }
}

.tab-content-inner {
  padding: 1.5rem 0;
}

.tab-section-title {
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
}

.description-spacing {
  margin-bottom: 2rem;
}

.schedule-list-vertical {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.seats-left-status {
  margin-bottom: 0.5rem;
  .seat-label-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-weight: 700;
    &.critical { color: #ef4444; }
    &.stable { color: #10b981; }
    .icon-small { font-size: 0.875rem; }
  }
}

.progress-bar-container {
  width: 100%;
  background: #e2e8f0;
  border-radius: 9999px;
  height: 0.375rem;
  margin-top: 0.5rem;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 9999px;
  &.critical { background: #ef4444; }
  &.stable { background: #10b981; }
}

.schedule-pricings-grid {
  margin-top: 0.75rem;
}

.review-summary-header-box {
  margin-bottom: 2rem;
}

.review-stats-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid #f1f5f9;
  @media (min-width: 768px) {
    flex-direction: row;
  }
}

.rating-bars-stack {
  flex: 1;
  width: 100%;
  max-width: 24rem;
}

.review-loading-wrap {
  text-align: center;
  padding: 2.5rem 0;
}

.empty-reviews-box {
  text-align: center;
  padding: 3rem 0;
  background: white;
  border: 2px dashed #f1f5f9;
  border-radius: 1rem;
  margin-bottom: 2rem;
  .empty-review-icon {
    color: #cbd5e1;
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  .empty-title {
    color: #64748b;
    font-weight: 500;
  }
  .empty-desc {
    color: #94a3b8;
    font-size: 0.875rem;
  }
}

.review-list-vertical {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.success-msg-title {
  font-weight: 700;
  font-size: 1.25rem;
  color: #15803d;
  margin-bottom: 0.25rem;
}

.success-msg-desc {
  color: #16a34a;
}

.btn-resubmit {
  margin-top: 1rem;
}

.form-main-title {
  font-size: 1.5rem;
  font-weight: 900;
  color: #1e293b;
}

.form-subtitle {
  color: #64748b;
}

.passengers-selection-area {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 1rem;
  label {
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    margin-bottom: 4px;
    display: block;
  }
}

.date-box {
  display: flex;
  flex-direction: column;
  text-align: center;
  .label {
    font-size: 10px;
    font-weight: 800;
    color: #94a3b8;
  }
  .date {
    font-size: 15px;
    font-weight: 700;
    color: #1e293b;
  }
}
.schedule-dates {
  display: flex;
  align-items: center;
  gap: $space-4;
}
.date-arrow {
  color: #cbd5e1;
}

.schedule-prices {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
  .price-chip {
    font-size: 11px;
    color: #64748b;
    background: #f8fafc;
    padding: 4px 8px;
    border-radius: 6px;
  }
}

.seats-left {
  font-size: 13px;
  font-weight: 600;
  color: #10b981;
}

// Review
.avg-rating {
  text-align: center;
  .number {
    font-size: 3rem;
    font-weight: 800;
    color: #1e293b;
    display: block;
    line-height: 1;
  }
  .stars {
    color: #fbbf24;
    margin: 8px 0;
  }
  .total {
    font-size: 12px;
    color: #64748b;
  }
}

// Booking Box
.booking-box {
  background: white;
  border-radius: 20px;
  padding: 1.75rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;

.price-header-wrapper {
  margin-bottom: 1.5rem;
}

.price-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.price-label {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.price-main {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.price-amount {
  font-size: 2.25rem;
  font-weight: 900;
  color: #1d4ed8;
}

.price-currency {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1d4ed8;
}

.price-unit {
  color: #94a3b8;
  font-weight: 500;
  margin-left: 4px;
}

.booking-field {
  margin-bottom: 1rem;
}

.booking-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.passengers-flex {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  label {
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    margin-bottom: 4px;
    display: block;
  }
  .col-span-3 {
    grid-column: span 3;
  }
}

.seats-left-container {
  grid-column: span 3;
  margin-top: 0.25rem;
}

.seats-left-note {
  font-size: 0.75rem;
  color: #94a3b8;
  &.danger-note {
    color: #ef4444;
    font-weight: 700;
  }
}

.booking-summary-box {
  background: #f8fafc;
  padding: 1.25rem;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
  margin-bottom: 1.5rem;

  .summary-row {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: #64748b;
  }
}

.price-breakdown-list {
  border-top: 1px solid #e2e8f0;
  margin-top: 1rem;
  padding-top: 1rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 0.875rem;
}

.item-label-group {
  display: flex;
  flex-direction: column;
}

.main-label {
  color: #334155;
  font-weight: 500;
}

.sub-label {
  font-size: 10px;
  color: #94a3b8;
}

.item-price {
  font-weight: 700;
  color: #334155;
}

.total-payment-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px dashed #cbd5e1;
  padding-top: 0.75rem;
  margin-top: 0.25rem;
}

.total-label {
  color: #334155;
  font-weight: 700;
  font-size: 0.875rem;
}

.total-value {
  font-weight: 900;
  font-size: 1.25rem;
  color: #ef4444;
}

.booking-button-container {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.book-btn-centered {
  background: linear-gradient(135deg, #1d4ed8, #2563eb);
  color: white;
  border: none;
  font-weight: 900 !important;
  border-radius: 12px !important;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px rgba(29, 78, 216, 0.2);
  font-size: 0.875rem;
  letter-spacing: 0.5px;
  padding: 10px 40px !important;
  cursor: pointer;
}

.book-btn-centered:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(29, 78, 216, 0.35);
}

.trust-section-new {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.trust-item-new {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.trust-icon-box {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.trust-icon-blue {
  background: rgba(35, 87, 137, 0.1);
  color: #1d4ed8;
}

.trust-icon-green {
  background: #f0fdf4;
  color: #16a34a;
}

.trust-content-new {
  display: flex;
  flex-direction: column;
}

.trust-title-new {
  font-size: 13px;
  font-weight: 900;
  color: #1d4ed8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  &.title-green {
    color: #16a34a;
  }
}

.trust-desc-new {
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
  margin-top: 2px;
}

}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.8);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rich-text {
  font-size: 15px;
  color: #475569;
  line-height: 1.8;
  :deep(em) {
    font-style: italic;
  }
  :deep(strong) {
    font-weight: 700;
    color: #1e293b;
  }
  :deep(ul),
  :deep(ol) {
    margin-left: 1.5rem;
    margin-bottom: 1rem;
  }
  :deep(p) {
    margin-bottom: 1rem;
  }
}

// Modern Review Card redesign
.modern-review-card {
  background: white;
  border-radius: 24px;
  padding: 1.5rem;
  border: 1px solid #f1f5f9;
  position: relative;

  .rev-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }
  .rev-user {
    display: flex;
    align-items: center;
    gap: 1rem;
    .rev-avatar {
      width: 48px;
      height: 48px;
      border-radius: 16px;
      background: #eff6ff;
      color: $color-primary;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.25rem;
    }
    .rev-user-info {
      display: flex;
      flex-direction: column;
      .name {
        font-weight: 700;
        color: #1e293b;
        font-size: 1rem;
      }
      .date {
        font-size: 0.75rem;
        color: #94a3b8;
      }
    }
  }
  .rev-stars {
    color: #fbbf24;
    font-size: 0.875rem;
    display: flex;
    gap: 2px;
  }
  .rev-title {
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }
  .rev-content {
    color: #475569;
    line-height: 1.6;
    font-size: 0.9375rem;
    margin-bottom: 1rem;
  }
  .rev-verified {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 4px 10px;
    background: #f0fdf4;
    color: #16a34a;
    font-size: 0.7rem;
    font-weight: 700;
    border-radius: 8px;
    i {
      font-size: 0.75rem;
    }
  }
}

.avg-rating-large {
  text-align: center;
  .number {
    font-size: 4rem;
    font-weight: 900;
    color: #1e293b;
    line-height: 1;
    display: block;
    letter-spacing: -2px;
  }
  .stars {
    color: #fbbf24;
    font-size: 1.25rem;
    margin: 0.75rem 0;
    display: flex;
    justify-content: center;
    gap: 4px;
  }
  .total {
    color: #94a3b8;
    font-size: 0.875rem;
    font-weight: 500;
  }
}

.rating-bars {
  .rating-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
    &:last-child {
      margin-bottom: 0;
    }
    .star-num {
      font-size: 0.75rem;
      font-weight: 700;
      color: #64748b;
      white-space: nowrap;
      width: 40px;
    }
    .bar-bg {
      flex: 1;
      height: 8px;
      background: #f1f5f9;
      border-radius: 4px;
      overflow: hidden;
    }
    .bar-fill {
      height: 100%;
      background: #fbbf24;
      border-radius: 4px;
    }
    .count {
      font-size: 0.75rem;
      font-weight: 600;
      color: #94a3b8;
      min-width: 20px;
      text-align: right;
    }
  }
}

// Review Form Card Redesign
.review-form-card {
  background: white;
  padding: 2.5rem;
  border-radius: 32px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.05);

  .form-header {
    margin-bottom: 2rem;
    h4 {
      line-height: 1.2;
    }
    p {
      margin-top: 0.5rem;
    }
  }
}

.rating-selector-group {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 20px;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @include sm {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .selector-label {
    font-weight: 700;
    color: #475569;
    font-size: 15px;
  }

  .stars-input {
    display: flex;
    align-items: center;
    gap: 8px;

    .star-item {
      font-size: 1.75rem;
      cursor: pointer;
      color: #e2e8f0;
      transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);

      &:hover {
        transform: scale(1.2);
      }
      &.active {
        color: #fbbf24;
      }
    }

    .rating-text {
      margin-left: 12px;
      font-weight: 800;
      color: #fbbf24;
      min-width: 100px;
      text-align: right;
    }
  }
}

.form-fields-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 8px;

    label {
      font-weight: 700;
      font-size: 14px;
      color: #334155;
      padding-left: 4px;
    }
  }
}

.form-footer {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f1f5f9;

  @include sm {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .footer-note {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #94a3b8;
    font-size: 12px;
    max-width: 300px;
    line-height: 1.4;
    i {
      font-size: 14px;
      color: #3b82f6;
    }
  }

  .submit-button {
    background: linear-gradient(135deg, #1d4ed8, #1e40af) !important;
    border: none !important;
    border-radius: 16px !important;
    padding: 1rem 2rem !important;
    font-weight: 800 !important;
    box-shadow: 0 10px 20px -5px rgba(29, 78, 216, 0.3) !important;
    height: 54px;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 15px 25px -5px rgba(29, 78, 216, 0.4) !important;
    }
  }
}

.review-submitted-msg {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 2rem 0;

  .success-icon {
    width: 64px;
    height: 64px;
    background: #f0fdf4;
    color: #22c55e;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
  }
}
</style>
