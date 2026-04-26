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
          <!-- Gallery -->
          <div class="gallery">
            <div class="gallery__main">
               <Image :src="tour.imageUrl || defaultCover" alt="Tour chính" preview class="w-full h-full object-cover rounded-xl" />
            </div>
            <div class="gallery__side">
               <div v-for="(img, i) in currentThumbs" :key="i" class="relative group h-full">
                  <Image :src="img" alt="Tour phụ" preview class="w-full h-full object-cover rounded-xl" />
                  <div class="img-overlay opacity-0 group-hover:opacity-100 transition-opacity"></div>
               </div>
            </div>
          </div>

          <!-- Tags & Title -->
          <div class="tags-row mt-4">
            <Tag :value="tour.categoryName" severity="info" rounded />
            <Tag :value="tour.destinationName" severity="secondary" rounded icon="pi pi-map-marker" />
            <div class="rating-badge ml-auto flex items-center gap-2">
               <i class="pi pi-star-fill text-yellow-500"></i>
               <span class="font-bold">{{ tour.rating > 0 ? tour.rating.toFixed(1) : 'Chưa có đánh giá' }}</span>
            </div>
          </div>

          <h1 class="tour-title">{{ tour.title }}</h1>

          <!-- Bảng 4 Khối Thông Tin Đặc Thù -->
          <div class="quick-info-grid">
             <div class="q-item">
                <i class="pi pi-qrcode q-icon"></i>
                <div class="q-content">
                   <span class="q-label">MÃ TOUR</span>
                   <span class="q-val font-bold text-slate-800">{{ tour.tourCode || `TR-${tour.id}` }}</span>
                </div>
             </div>
             <div class="q-item">
                <i class="pi pi-clock q-icon"></i>
                <div class="q-content">
                   <span class="q-label">THỜI GIAN</span>
                   <span class="q-val font-bold text-slate-800">{{ tour.duration || getDuration(tour) }}</span>
                </div>
             </div>
             <div class="q-item">
                <i class="pi pi-map-marker q-icon"></i>
                <div class="q-content">
                   <span class="q-label">KHỞI HÀNH</span>
                   <span class="q-val font-bold text-slate-800">{{ tour.departureLocation || 'Đang cập nhật' }}</span>
                </div>
             </div>
             <div class="q-item">
                <i class="pi pi-send q-icon"></i>
                <div class="q-content">
                   <span class="q-label">PHƯƠNG TIỆN</span>
                   <span class="q-val font-bold text-slate-800">{{ tour.transport || 'Đang cập nhật' }}</span>
                </div>
             </div>
          </div>
          
          <!-- Tabs -->
          <div class="tour-tabs mt-8">
            <Tabs value="0">
              <TabList>
                <Tab value="0"><i class="pi pi-info-circle mr-2"></i>Tổng quan</Tab>
                <Tab value="1"><i class="pi pi-map mr-2"></i>Lịch trình</Tab>
                <Tab value="2"><i class="pi pi-book mr-2"></i>Chính sách</Tab>
                <Tab value="3"><i class="pi pi-calendar-plus mr-2"></i>Lịch khởi hành</Tab>
                <Tab value="4"><i class="pi pi-star mr-2"></i>Đánh giá</Tab>
              </TabList>
              <TabPanels>
                <!-- Overview -->
                <TabPanel value="0">
                  <div class="tab-content py-6 animate-fade-in">
                    <h3 class="mb-4 font-bold text-slate-800">Giới thiệu chuyến đi</h3>
                    <div class="tour-desc mb-8 rich-text" v-html="tour.description || 'Chưa có thông tin giới thiệu cho tour này.'"></div>
                    <div class="tour-highlights">
                      <h3 class="mb-4 font-bold text-slate-800">Điểm nổi bật</h3>
                      <div class="tour-desc rich-text" v-html="tour.highlights || 'Đang cập nhật...'"></div>
                    </div>
                  </div>
                </TabPanel>
                
                <!-- Itinerary -->
                <TabPanel value="1">
                  <div class="tab-content py-6 animate-fade-in">
                    <div class="rich-text" v-html="tour.itinerary || 'Chưa có thông tin chi tiết lịch trình.'"></div>
                  </div>
                </TabPanel>

                <!-- Policies -->
                <TabPanel value="2">
                  <div class="tab-content py-6 animate-fade-in">
                    <div class="rich-text" v-html="tour.policies || 'Đang cập nhật quy định và chính sách hoàn hủy.'"></div>
                  </div>
                </TabPanel>
                
                <!-- Schedules -->
                <TabPanel value="3">
                  <div class="tab-content py-6 animate-fade-in">
                    <div class="schedule-list flex flex-col gap-4">
                       <div v-for="s in tour.schedules" :key="s.id" class="schedule-item">
                          <div class="schedule-dates">
                             <div class="date-box">
                                <span class="label">KHỞI HÀNH</span>
                                <span class="date">{{ formatDate(s.startDate) }}</span>
                             </div>
                             <div class="date-arrow"><i class="pi pi-arrow-right"></i></div>
                             <div class="date-box">
                                <span class="label">TRỞ VỀ</span>
                                <span class="date">{{ formatDate(s.endDate) }}</span>
                             </div>
                          </div>
                          <div class="schedule-info">
                             <div class="seats-left mb-2">
                                <span class="seat-label inline-flex items-center gap-1 font-bold" :class="s.availableSeats < 5 ? 'text-red-500' : 'text-emerald-500'">
                                   <i class="pi pi-users text-sm"></i> Còn {{ s.availableSeats }} chỗ
                                </span>
                                <div class="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                                  <div class="h-1.5 rounded-full" 
                                       :class="s.availableSeats < 5 ? 'bg-red-500' : 'bg-emerald-500'" 
                                       :style="{ width: ((s.totalSeats - s.availableSeats)/s.totalSeats)*100 + '%' }"></div>
                                </div>
                             </div>
                             <div class="schedule-prices mt-3">
                                <div v-for="p in s.pricings" :key="p.passengerType" class="price-chip">
                                   {{ getPassengerTypeName(p.passengerType) }}: <strong>{{ formatPrice(p.price) }} đ</strong>
                                </div>
                             </div>
                          </div>
                          <Button label="Chọn ngày này" icon="pi pi-check" size="small" @click="selectSchedule(s)" />
                       </div>
                    </div>
                  </div>
                </TabPanel>

                <!-- Reviews -->
                <TabPanel value="4">
                  <div class="tab-content py-6 animate-fade-in">
                    <div class="review-section">
                       <h3 class="font-bold text-xl mb-4">Đánh giá từ khách hàng</h3>
                       <div v-if="loadingReviews" class="text-center py-4"><ProgressSpinner style="width:30px;height:30px"/></div>
                       <div v-else>
                          <div v-if="!reviews.length" class="text-slate-500 italic pb-6">Chưa có đánh giá nào cho tour này. Hãy đi tour và trở thành người đầu tiên đánh giá!</div>
                          <div v-else class="review-list flex flex-col gap-4 pb-6">
                             <div v-for="rev in reviews" :key="rev.id" class="review-card">
                               <div class="review-stars">
                                  <i v-for="i in 5" :key="i" class="pi" :class="i <= rev.rating ? 'pi-star-fill' : 'pi-star'"></i>
                               </div>
                               <p class="review-content">"{{ rev.content }}"</p>
                               <div class="review-author">
                                  <div class="author-avatar">{{ (rev.user?.fullName || 'K').charAt(0).toUpperCase() }}</div>
                                  <div>
                                    <div class="author-name">{{ rev.user?.fullName || 'Khách ẩn danh' }}</div>
                                    <div class="author-tour">{{ tour?.name }}</div>
                                  </div>
                               </div>
                             </div>
                          </div>
                          
                          <div class="mt-4 pt-6 border-t border-slate-200">
                             <div v-if="reviewSubmitted" class="review-submitted-msg">
                                <i class="pi pi-check-circle"></i>
                                <div>
                                  <strong>Cảm ơn bạn đã đánh giá!</strong>
                                  <p>Nhận xét của bạn đang chờ phê duyệt và sẽ hiển thị sau khi admin duyệt.</p>
                                </div>
                             </div>
                             <div v-else>
                                <h4 class="font-bold text-lg mb-3">Chia sẻ trải nghiệm của bạn</h4>
                                <p class="text-xs text-slate-500 mb-4">* Chỉ dành cho khách hàng đã đăng nhập và từng mua Tour này.</p>
                                <div class="flex gap-2 mb-4 text-2xl text-slate-300 cursor-pointer">
                                   <i v-for="i in 5" :key="i" class="pi" 
                                      :class="i <= newReview.rating ? 'pi-star-fill text-yellow-500' : 'pi-star'" 
                                      @click="newReview.rating = i"></i>
                                </div>
                                <InputText v-model="newReview.title" placeholder="Tóm tắt đánh giá (Ví dụ: Trải nghiệm tuyệt vời)" class="w-full mb-3" />
                                <Textarea v-model="newReview.content" rows="4" placeholder="Nhận xét chi tiết về lịch trình, hướng dẫn viên, dịch vụ..." class="w-full mb-3" />
                                <Button label="Gửi Đánh Giá" icon="pi pi-send" @click="submitReview" :loading="submittingReview" :disabled="!newReview.content" />
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
              <div class="booking-price">
                <div class="flex flex-col">
                  <span class="text-xs text-slate-400 font-bold uppercase mb-1">Giá chỉ từ</span>
                  <div class="flex items-baseline gap-2">
                    <h2 class="text-red-500">{{ formatPrice(getMinPrice(tour)) }}<span style="font-size: 1.1rem; text-decoration:underline;">đ</span></h2>
                    <span class="per-night">/ người</span>
                  </div>
                </div>
              </div>

              <div class="booking-form">
                <div class="p-field mb-4">
                  <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Chọn ngày khởi hành</label>
                  <Select v-model="bookingForm.schedule" :options="tour.schedules" optionLabel="startDate" placeholder="Chọn ngày khởi hành" class="w-full">
                     <template #value="slotProps">
                        <div v-if="slotProps.value">{{ formatDate(slotProps.value.startDate) }}</div>
                        <span v-else>{{ slotProps.placeholder }}</span>
                     </template>
                     <template #option="slotProps">
                        <div class="flex flex-col">
                           <span class="font-bold">{{ formatDate(slotProps.option.startDate) }}</span>
                           <span class="text-xs text-slate-500">Còn {{ slotProps.option.availableSeats }} chỗ</span>
                        </div>
                     </template>
                  </Select>
                </div>

                <div class="passengers-flex mb-4">
                   <div class="p-field">
                      <label>Người lớn</label>
                      <InputNumber v-model="bookingForm.adults" showButtons :min="1" :max="10" fluid class="mini-spinner" />
                   </div>
                   <div class="p-field">
                      <label>Trẻ em</label>
                      <InputNumber v-model="bookingForm.children" showButtons :min="0" :max="10" fluid class="mini-spinner" />
                   </div>
                   <div class="p-field">
                      <label>Em bé</label>
                      <InputNumber v-model="bookingForm.infants" showButtons :min="0" :max="5" fluid class="mini-spinner" />
                   </div>
                </div>

                <div class="booking-summary mb-6">
                  <div class="summary-row">
                    <span>Số lượng hành khách:</span>
                    <span>{{ totalPax }} người</span>
                  </div>
                  <div class="summary-row" v-if="bookingForm.schedule">
                    <span>Tổng thanh toán</span>
                    <span class="font-bold text-xl text-primary">{{ formatPrice(calculateTotal()) }} đ</span>
                  </div>
                </div>

                <Button label="Yêu Cầu Đặt Tour" icon="pi pi-check-circle" raised class="w-full book-btn py-4 mt-4" @click="goToCheckout" />
                
                <p class="text-center text-[11px] text-slate-400 mt-3 leading-relaxed italic">
                  * Thanh toán bảo mật an toàn 100%. Xác nhận ngay lập tức qua hệ thống.
                </p>
              </div>
            </div>

            <div class="mt-4 p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-4">
               <div class="text-primary text-2xl"><i class="pi pi-shield"></i></div>
               <div>
                 <div class="text-xs font-bold text-slate-700">Đảm Bảo Hài Lòng 100%</div>
                 <div class="text-[11px] text-slate-500">Thanh toán an toàn & Hướng dẫn viên bản địa.</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { tourApi } from '@/api/tourApi'
import { destinationApi } from '@/api/destinationApi'
import reviewApi from '@/api/reviewApi'

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

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const tour = ref(null)
const defaultCover = 'https://images.unsplash.com/photo-1528127269322-539801943592?w=1200'

// Các ảnh nhỏ bên phải (fallback chuẩn)
const currentThumbs = ref([
  'https://images.unsplash.com/photo-1555921015-5532091f6026?w=600',
  'https://images.unsplash.com/photo-1573390016527-19ef6f38ebe3?w=600'
])

const bookingForm = reactive({
  schedule: null,
  adults: 2,
  children: 0,
  infants: 0
})

// Review State
const reviews = ref([])
const loadingReviews = ref(false)
const submittingReview = ref(false)
const newReview = reactive({
  rating: 5,
  title: '',
  content: '',
  bookingId: 1 // Giả định
})
const reviewSubmitted = ref(false)


const totalPax = computed(() => bookingForm.adults + bookingForm.children + bookingForm.infants)

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

function getMinPrice(t) {
  if (!t || !t.schedules?.length) return t?.basePrice || 0
  const activeSchedules = t.schedules.filter(x => x.isActive && x.availableSeats > 0)
  if (!activeSchedules.length) return 0
  
  let min = Infinity
  activeSchedules.forEach(s => {
    s.pricings.forEach(p => {
       if (p.price < min) min = p.price
    })
  })
  return min === Infinity ? 0 : min
}

function findPrice(type) {
  if (!bookingForm.schedule) return 0
  const pricing = bookingForm.schedule.pricings.find(p => p.passengerType === type)
  return pricing ? pricing.price : 0
}

function calculateTotal() {
  if (!bookingForm.schedule) return 0
  let total = 0
  total += bookingForm.adults * findPrice(1) // Adult=1
  total += bookingForm.children * findPrice(2) // Child=2
  total += bookingForm.infants * findPrice(3) // Infant=3
  
  return total
}

function formatPrice(val) {
  if (!val) return '0'
  return new Intl.NumberFormat('vi-VN').format(val)
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('vi-VN')
}

function getPassengerTypeName(type) {
  if (type === 1) return 'Người lớn'
  if (type === 2) return 'Trẻ em'
  if (type === 3) return 'Sơ sinh'
  return 'Pax'
}

function selectSchedule(s) {
  bookingForm.schedule = s
  window.scrollTo({ top: 400, behavior: 'smooth' })
}

async function loadTour() {
  loading.value = true
  try {
    const res = await tourApi.getById(route.params.id)
    console.log('Tải Tour thành công:', res);
    if (res.success) {
      tour.value = res.data
      console.log('ID Tour hiện tại:', tour.value.id);
      
      // Nếu không có ảnh, dùng ảnh của khu vực
      if (!tour.value.imageUrl && tour.value.destinationId) {
         try {
           const destRes = await destinationApi.getById(tour.value.destinationId)
           if (destRes.success && destRes.data.coverImageUrl) {
              tour.value.imageUrl = destRes.data.coverImageUrl
              currentThumbs.value = [
                destRes.data.coverImageUrl,
                'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600'
              ]
           }
         } catch(e) {}
      }

      // Auto select first active schedule
      if (tour.value.schedules?.length) {
         bookingForm.schedule = tour.value.schedules.find(x => x.isActive && x.availableSeats > 0)
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

function goToCheckout() {
  if (!bookingForm.schedule) {
    alert("Vui lòng chọn lịch khởi hành phù hợp.");
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
      infants: bookingForm.infants
    } 
  });
}

async function loadReviews(tourId) {
  if (!tourId) return;
  console.log('Đang tải đánh giá cho tour ID:', tourId);
  loadingReviews.value = true
  try {
     const res = await reviewApi.getByTourId(tourId)
     console.log('Kết quả API Review:', res);
     // apiClient tự unwrap response.data nên res là { success, data }
     if (res && res.success) {
        reviews.value = res.data || []
        console.log('Danh sách đánh giá:', reviews.value);
     } else if (Array.isArray(res)) {
        reviews.value = res
     }
  } catch(e) {
     console.error('Lỗi tải đánh giá:', e)
  } finally {
     loadingReviews.value = false
  }
}

async function submitReview() {
  const token = localStorage.getItem('auth_token')
  if (!token) {
     alert("Vui lòng đăng nhập để gửi đánh giá!")
     return router.push('/login')
  }

  if (!newReview.content || !newReview.title) {
     return alert("Vui lòng nhập đầy đủ tiêu đề và nội dung.");
  }

  submittingReview.value = true
  try {
     const payload = {
        tourId: tour.value.id,
        bookingId: 1, // Để demo
        rating: newReview.rating,
        title: newReview.title,
        content: newReview.content
     }
     const res = await reviewApi.createReview(payload)
     // apiClient tự unwrap, res là { success, data, message }
     if (res && res.success) {
        alert(res.message || 'Gửi đánh giá thành công! Đang chờ admin duyệt.')
        newReview.title = ''
        newReview.content = ''
        newReview.rating = 5
        // Ẩn form sau khi gửi thành công
        reviewSubmitted.value = true
     } else {
        alert(res?.message || 'Có lỗi xảy ra!')
     }
  } catch(e) {
     console.error('Lỗi gửi review', e)
     alert(e.message || "Có lỗi xảy ra khi gửi nhận xét.")
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
  background: #fbfcfd; min-height: 100vh; padding-bottom: $space-24;
}

// Hero
.detail-hero {
  position: relative; height: 320px;
  background: url('https://images.unsplash.com/photo-1518182170546-076616fd6251?w=1920&q=80') center/cover;
  display: flex; align-items: center; justify-content: center; padding-top: $navbar-height;

  &__overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, rgba(35, 87, 137, 0.9), rgba(15, 23, 42, 0.7));
  }

  &__content { position: relative; z-index: 1; text-align: center; color: white; }
  &__title { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800; margin-bottom: $space-4; letter-spacing: -0.02em; }
  &__breadcrumb {
    font-size: 14px; display: flex; align-items: center; justify-content: center; gap: $space-2; color: #cbd5e1;
    a { color: white; &:hover { color: $color-accent; } }
    .current { color: $color-accent; font-weight: 700; }
  }
}

.detail-main { margin-top: -$space-16; position: relative; z-index: 10; }

.detail-layout {
  display: flex; flex-direction: column; gap: $space-8;
  @include lg { flex-direction: row; align-items: flex-start; }
}

.detail-info {
  flex: 1; background: white; border-radius: $border-radius-2xl;
  padding: $space-8; box-shadow: $shadow-xl; border: 1px solid #f1f5f9;
}

.detail-sidebar {
  width: 100%;
  @include lg { width: 360px; }
}

// Gallery
.gallery {
  display: grid; grid-template-columns: 1fr; gap: $space-4; margin-bottom: $space-8;
  @include md { grid-template-columns: 2fr 1fr; }
  
  &__main { height: 420px; :deep(img) { border-radius: 16px; width: 100%; height: 100%; object-fit: cover; } }
  &__side { 
    display: none; 
    @include md { display: grid; grid-template-rows: 1fr 1fr; gap: $space-4; }
    :deep(img) { border-radius: 16px; width: 100%; height: 100%; object-fit: cover; } 
  }
}

.tags-row {
  display: flex; flex-wrap: wrap; gap: $space-3; margin-bottom: $space-4; align-items: center;
  .p-tag { font-size: 11px; padding: 4px 12px; }
}

.tour-title {
  font-size: 2.25rem; font-weight: 800; color: #1e293b; line-height: 1.2; letter-spacing: -0.03em; margin-bottom: $space-6;
}

// Quick Info Grid
.quick-info-grid {
   display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px;
   @include md { grid-template-columns: repeat(4, 1fr); }
   
   .q-item {
      display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: #f8fafc; border-radius: 12px; border: 1px solid #f1f5f9;
      .q-icon { font-size: 1.5rem; color: #1d4ed8; }
      .q-content { display: flex; flex-direction: column; }
      .q-label { font-size: 10px; font-weight: 800; color: #64748b; margin-bottom: 2px; }
      .q-val { font-size: 14px; }
   }
}

// Items
.schedule-item {
  display: grid; grid-template-columns: 1fr; gap: $space-4;
  padding: $space-5; border: 1.5px solid #f1f5f9; border-radius: 16px; margin-bottom: $space-4;
  transition: all 0.3s ease;
  &:hover { border-color: $color-primary; box-shadow: 0 4px 12px rgba($color-primary, 0.08); background: #fbfdff; }
  
  @include sm { grid-template-columns: auto 1fr auto; align-items: center; }
}

.date-box {
  display: flex; flex-direction: column; text-align: center;
  .label { font-size: 10px; font-weight: 800; color: #94a3b8; }
  .date { font-size: 15px; font-weight: 700; color: #1e293b; }
}
.schedule-dates { display: flex; align-items: center; gap: $space-4; }
.date-arrow { color: #cbd5e1; }

.schedule-prices {
   display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;
   .price-chip { font-size: 11px; color: #64748b; background: #f8fafc; padding: 4px 8px; border-radius: 6px; }
}

.seats-left { font-size: 13px; font-weight: 600; color: #10b981; }

// Review
.avg-rating {
   text-align: center;
   .number { font-size: 3rem; font-weight: 800; color: #1e293b; display: block; line-height: 1; }
   .stars { color: #fbbf24; margin: 8px 0; }
   .total { font-size: 12px; color: #64748b; }
}

// Booking Box
.booking-box {
  background: white; border-radius: $border-radius-2xl; padding: $space-8;
  box-shadow: $shadow-2xl; border: 1px solid #f1f5f9;

  .booking-price {
    display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: $space-6;
    h2 { font-size: 32px; font-weight: 800; letter-spacing: -1px; margin: 0; }
    .per-night { font-size: 14px; color: $color-text-secondary; font-weight: 500; }
  }
}

.passengers-flex {
   display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
   label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px; display: block; }
}

.booking-summary {
  background: #f8fafc; padding: $space-6; border-radius: 16px;
  .summary-row {
    display: flex; justify-content: space-between; font-size: 14px; color: #475569; margin-bottom: $space-2;
    &.total { margin-bottom: 0; padding-top: $space-4; color: #1e293b; }
  }
}

.book-btn { background: #1d4ed8; color: white; border: none; height: 56px; font-weight: 800 !important; border-radius: 16px !important; transition: 0.3s; }
.book-btn:hover { background: #1e40af; }

.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.loading-overlay { position: fixed; inset: 0; background: rgba(255,255,255,0.8); z-index: 1000; display: flex; align-items: center; justify-content: center; }

.rich-text {
  font-size: 15px; color: #475569; line-height: 1.8;
  :deep(em) { font-style: italic; }
  :deep(strong) { font-weight: 700; color: #1e293b; }
  :deep(ul), :deep(ol) { margin-left: 1.5rem; margin-bottom: 1rem; }
  :deep(p) { margin-bottom: 1rem; }
}

// Review Cards
.review-card {
  background: white;
  border-radius: 20px;
  padding: $space-6;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  border: 1px solid #f1f5f9;
  transition: transform 0.2s ease;
  &:hover { transform: translateY(-2px); }

  .review-stars {
    color: #fbbf24;
    font-size: 1.1rem;
    margin-bottom: $space-3;
    display: flex; gap: 4px;
  }

  .review-content {
    font-size: 15px;
    color: #475569;
    font-style: italic;
    line-height: 1.7;
    margin-bottom: $space-5;
  }

  .review-author {
    display: flex;
    align-items: center;
    gap: $space-3;

    .author-avatar {
      width: 40px; height: 40px;
      border-radius: 50%;
      background: $color-primary;
      color: white;
      display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 16px;
    }

    .author-name { font-weight: 700; color: #1e293b; font-size: 14px; }
    .author-tour { font-size: 12px; color: #94a3b8; }
  }
}

// Submitted message
.review-submitted-msg {
  display: flex;
  align-items: flex-start;
  gap: $space-4;
  padding: $space-5;
  background: #f0fdf4;
  border: 1.5px solid #bbf7d0;
  border-radius: 16px;
  color: #166534;

  .pi-check-circle { font-size: 1.8rem; color: #22c55e; margin-top: 2px; }
  strong { display: block; font-size: 16px; margin-bottom: 4px; }
  p { font-size: 14px; opacity: 0.8; margin: 0; }
}
</style>

