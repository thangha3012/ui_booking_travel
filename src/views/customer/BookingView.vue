<template>
  <div class="booking-page">
    <div class="booking-header">
      <div class="container relative-header">
        <h1>Chi tiết đặt tour</h1>
        <p class="header-desc">Vui lòng điền thông tin liên hệ và thông tin hành khách.</p>
      </div>
      <div class="booking-header__overlay"></div>
    </div>

    <div class="container content-section">
      <div v-if="loadingTour" class="loading-box">
        <ProgressSpinner strokeWidth="4" />
        <span class="loading-text">Đang tải thông tin tour...</span>
      </div>
      <div v-else-if="!tour || !schedule" class="error-box">
        <i class="pi pi-exclamation-circle error-icon"></i>
        <h2 class="error-title">Không tìm thấy Tour hoặc Lịch trình</h2>
        <Button label="Quay lại danh sách Tour" icon="pi pi-arrow-left" class="back-link" @click="$router.push('/tours')" text />
      </div>
      <div v-else class="booking-layout">
        <!-- LEFT COLUMN: Forms -->
        <div class="booking-forms">
          
          <!-- Contact Info -->
          <div class="booking-card">
            <h2 class="card-title"><i class="pi pi-user card-icon"></i> Thông tin liên hệ</h2>
            <div class="p-fluid contact-form-grid">
              <div class="field">
                <label for="contactName">Họ và tên <span class="required">*</span></label>
                <InputText id="contactName" v-model="form.contactName" placeholder="Nguyễn Văn A" />
              </div>
              <div class="field">
                <label for="contactPhone">Số điện thoại <span class="required">*</span></label>
                <InputText id="contactPhone" v-model="form.contactPhone" placeholder="0912 345 678" />
              </div>
              <div class="field span-full">
                <label for="contactEmail">Địa chỉ Email <span class="required">*</span></label>
                <InputText id="contactEmail" v-model="form.contactEmail" type="email" placeholder="email@example.com" />
              </div>
              <div class="field span-full">
                <label for="notes">Yêu cầu đặc biệt / Ghi chú</label>
                <Textarea id="notes" v-model="form.notes" rows="3" placeholder="Yêu cầu về chế độ ăn uống hoặc yêu cầu đặc biệt khác..." />
              </div>
            </div>
          </div>

          <!-- Passenger Count Selection -->
          <div class="booking-card passenger-section">
            <div class="passenger-header">
              <h2 class="card-title no-margin"><i class="pi pi-users card-icon"></i> Hành khách</h2>
              <Tag :value="`${totalPassengers} Khách`" severity="info" rounded />
            </div>
            
            <div class="passenger-types-list">
               <div class="passenger-type-row">
                 <div>
                   <h4 class="p-type-title">Người lớn</h4>
                   <span class="p-type-desc">Trên 12 tuổi</span>
                 </div>
                 <div class="p-counter">
                   <Button icon="pi pi-minus" @click="updatePassengerCount('Adult', -1)" :disabled="passengerCounts.Adult <= 1" rounded outlined severity="secondary" size="small" />
                   <span class="count-value">{{ passengerCounts.Adult }}</span>
                   <Button icon="pi pi-plus" @click="updatePassengerCount('Adult', 1)" :disabled="totalPassengers >= schedule.availableSeats" rounded outlined severity="secondary" size="small" />
                 </div>
               </div>

               <div class="passenger-type-row">
                 <div>
                   <h4 class="p-type-title">Trẻ em</h4>
                   <span class="p-type-desc">2 - 12 tuổi</span>
                 </div>
                 <div class="p-counter">
                   <Button icon="pi pi-minus" @click="updatePassengerCount('Child', -1)" :disabled="passengerCounts.Child <= 0" rounded outlined severity="secondary" size="small" />
                   <span class="count-value">{{ passengerCounts.Child }}</span>
                   <Button icon="pi pi-plus" @click="updatePassengerCount('Child', 1)" :disabled="totalPassengers >= schedule.availableSeats" rounded outlined severity="secondary" size="small" />
                 </div>
               </div>

               <div class="passenger-type-row">
                 <div>
                   <h4 class="p-type-title">Em bé</h4>
                   <span class="p-type-desc">Dưới 2 tuổi</span>
                 </div>
                 <div class="p-counter">
                   <Button icon="pi pi-minus" @click="updatePassengerCount('Infant', -1)" :disabled="passengerCounts.Infant <= 0" rounded outlined severity="secondary" size="small" />
                   <span class="count-value">{{ passengerCounts.Infant }}</span>
                   <Button icon="pi pi-plus" @click="updatePassengerCount('Infant', 1)" :disabled="totalPassengers >= schedule.availableSeats" rounded outlined severity="secondary" size="small" />
                 </div>
               </div>
            </div>

            <!-- Passenger Details Form -->
            <div class="passenger-forms-list">
              <h3 class="forms-list-title">Thông tin hành khách</h3>
              
              <div v-for="(p, idx) in form.passengers" :key="idx" class="passenger-form-item">
                 <div class="form-item-header">
                   <h4 class="form-type-label">
                      {{ translatePassengerType(p.typeName) }} {{ getPassengerIndexForType(idx) }}
                   </h4>
                 </div>

                 <div class="p-fluid passenger-fields-grid">
                   <div class="field span-full">
                     <label>Họ và tên <span class="required">*</span></label>
                     <InputText v-model="p.fullName" placeholder="Theo hộ chiếu/CCCD" />
                   </div>
                   <div class="field">
                     <label>Giới tính <span class="required">*</span></label>
                     <Dropdown v-model="p.gender" :options="['Nam', 'Nữ', 'Khác']" placeholder="Chọn giới tính" />
                   </div>
                   <div class="field">
                     <label>Ngày sinh</label>
                     <DatePicker v-model="p.dateOfBirth" dateFormat="yy-mm-dd" showIcon :maxDate="new Date()" />
                   </div>
                   <div class="field span-full" v-if="p.type === 1"> <!-- Adult only mostly -->
                     <label>CMND/CCCD/Hộ chiếu <span class="required">*</span></label>
                     <InputText v-model="p.idDocument" placeholder="Số CMND/CCCD" />
                   </div>
                 </div>
              </div>
            </div>

          </div>

        </div>

        <!-- RIGHT COLUMN: Summary -->
        <div class="booking-sidebar">
          <div class="summary-card sticky-sidebar">
            <h3 class="summary-title">{{ $t('booking.summary.title', 'Tóm tắt chuyến đi') }}</h3>
            
            <div class="tour-summary-box">
              <div class="tour-brief-flex">
                <img :src="getFullImageUrl(tour.coverImage || tour.imageUrl || tour.destinationThumbnail) || 'https://images.unsplash.com/photo-1528127269322-539801943592?w=400'" class="tour-thumb" v-if="tour" />
                <div class="tour-main-info">
                  <h4 class="tour-name">{{ tour.title }}</h4>
                  <div class="tour-meta-item">
                    <i class="pi pi-calendar"></i>
                    <span>{{ formatDate(schedule.departureDate) }}</span>
                  </div>
                  <div class="tour-meta-item">
                    <i class="pi pi-map-marker"></i>
                    <span>{{ tour.departureLocation }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="price-details">
               <div class="price-row" v-if="passengerCounts.Adult > 0">
                  <div class="label-group">
                    <span class="pax-label">Người lớn</span>
                    <span class="pax-count"> ({{ passengerCounts.Adult }} khách) x {{ formatPrice(getPriceFor('Adult')) }} đ</span>
                  </div>
                  <span class="pax-total">{{ formatPrice(passengerCounts.Adult * getPriceFor('Adult')) }} đ</span>
               </div>
               
               <div class="price-row" v-if="passengerCounts.Child > 0">
                  <div class="label-group">
                    <span class="pax-label">Trẻ em</span>
                    <span class="pax-count"> ({{ passengerCounts.Child }} khách) x {{ formatPrice(getPriceFor('Child')) }} đ</span>
                  </div>
                  <span class="pax-total">{{ formatPrice(passengerCounts.Child * getPriceFor('Child')) }} đ</span>
               </div>

               <div class="price-row" v-if="passengerCounts.Infant > 0">
                  <div class="label-group">
                    <span class="pax-label">Em bé</span>
                    <span class="pax-count"> ({{ passengerCounts.Infant }} khách) x {{ formatPrice(getPriceFor('Infant')) }} đ</span>
                  </div>
                  <span class="pax-total">{{ formatPrice(passengerCounts.Infant * getPriceFor('Infant')) }} đ</span>
               </div>
               
               <div class="total-summary-section">
                  <div class="total-row">
                    <span class="total-label">Tổng cộng</span>
                    <span class="total-value">{{ formatPrice(totalAmount) }} đ</span>
                  </div>
                  <p class="vat-disclaimer">Đã bao gồm VAT & phí dịch vụ</p>
               </div>
            </div>

            <Button 
              :label="$t('booking.summary.confirm', 'Xác nhận đặt tour')" 
              icon="pi pi-check" 
              class="confirm-booking-btn" 
              @click="submitBooking" 
              :loading="submitting" 
            />
            
            <div class="secure-info">
              <i class="pi pi-lock"></i>
              <span>Thanh toán an toàn & bảo mật</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Toast position="top-right" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { tourApi } from '@/api/tourApi'
import { destinationApi } from '@/api/destinationApi'
import { bookingApi } from '@/api/bookingApi'
import { getFullImageUrl } from '@/utils/imageHelper'
import { useToast } from 'primevue/usetoast'

import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Tag from 'primevue/tag'
import Dropdown from 'primevue/dropdown'
import DatePicker from 'primevue/datepicker'
import ProgressSpinner from 'primevue/progressspinner'
import Toast from 'primevue/toast'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const loadingTour = ref(true)
const submitting = ref(false)

const tour = ref(null)
const schedule = ref(null)

const passengerCounts = reactive({
  Adult: 1,
  Child: 0,
  Infant: 0
})

const totalPassengers = computed(() => passengerCounts.Adult + passengerCounts.Child + passengerCounts.Infant)

const form = reactive({
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  notes: '',
  passengers: []
})

// enum mapping: Adult=1, Child=2, Infant=3
const typeEnumMap = { 'Adult': 1, 'Child': 2, 'Infant': 3 }

function translatePassengerType(type) {
  const map = { 'Adult': 'Người lớn', 'Child': 'Trẻ em', 'Infant': 'Em bé' }
  return map[type] || type
}

function rebuildPassengers() {
  const newPassengers = []
  
  const addP = (typeStr, count) => {
    for(let i=0; i<count; i++) {
       // try to keep existing data if available
       const ex = form.passengers.filter(p => p.type === typeEnumMap[typeStr])[i]
       if (ex) newPassengers.push(ex)
       else newPassengers.push({
          type: typeEnumMap[typeStr],
          typeName: typeStr,
          fullName: '',
          gender: null,
          dateOfBirth: null,
          idDocument: ''
       })
    }
  }

  addP('Adult', passengerCounts.Adult)
  addP('Child', passengerCounts.Child)
  addP('Infant', passengerCounts.Infant)

  form.passengers = newPassengers
}

function updatePassengerCount(type, delta) {
  passengerCounts[type] += delta
  rebuildPassengers()
}

function getPassengerIndexForType(idx) {
   const p = form.passengers[idx]
   const sameTypeArr = form.passengers.filter(x => x.type === p.type)
   return sameTypeArr.indexOf(p) + 1
}

function getPriceFor(typeStr) {
  if (!schedule.value) return 0
  
  // Try to find in schedule pricings
  if (schedule.value.pricings) {
    const enumVal = typeEnumMap[typeStr]
    const p = schedule.value.pricings.find(x => x.passengerType === enumVal)
    if (p) return p.price
  }
  
  // Fallback for Adult to Tour BasePrice
  if (typeStr === 'Adult') return tour.value?.basePrice || 0
  return 0
}

const totalAmount = computed(() => {
   return (passengerCounts.Adult * getPriceFor('Adult')) +
          (passengerCounts.Child * getPriceFor('Child')) +
          (passengerCounts.Infant * getPriceFor('Infant'))
})

function formatPrice(val) {
  if (!val) return '0'
  return new Intl.NumberFormat('vi-VN').format(val)
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('vi-VN')
}

async function loadData() {
  loadingTour.value = true
  try {
    const tourId = route.query.tourId
    const schId = route.params.scheduleId
    
    // Map passenger counts from query
    if (route.query.adults) passengerCounts.Adult = parseInt(route.query.adults)
    if (route.query.children) passengerCounts.Child = parseInt(route.query.children)
    if (route.query.infants) passengerCounts.Infant = parseInt(route.query.infants)
    
    if (!tourId || !schId) {
      toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Liên kết đặt tour không hợp lệ' })
      return
    }

    const res = await tourApi.getById(tourId)
    if (res.success && res.data) {
      tour.value = res.data
      schedule.value = tour.value.schedules?.find(s => String(s.id) === String(schId))
      
      // Nếu không có ảnh, dùng ảnh của khu vực (Destination)
      if ((!tour.value.coverImage && !tour.value.imageUrl) && tour.value.destinationId) {
        try {
          const destRes = await destinationApi.getById(tour.value.destinationId)
          if (destRes.success && destRes.data.coverImageUrl) {
            tour.value.imageUrl = destRes.data.coverImageUrl
          }
        } catch (e) {
          console.warn('Không thể tải ảnh điểm đến:', e)
        }
      }

      if (!schedule.value) {
         toast.add({ severity: 'warn', summary: 'Không tìm thấy', detail: 'Lịch trình đã chọn không tồn tại.' })
      }
    }
  } catch (err) {
    console.error(err)
  } finally {
    loadingTour.value = false
    rebuildPassengers()
  }
}

async function submitBooking() {
  // basic validation
  if (!form.contactName || !form.contactEmail || !form.contactPhone) {
     toast.add({ severity: 'error', summary: 'Thiếu thông tin', detail: 'Vui lòng điền đầy đủ thông tin liên hệ', life: 3000 })
     return
  }

  for (let i = 0; i < form.passengers.length; i++) {
     const p = form.passengers[i]
     if (!p.fullName || !p.gender) {
        toast.add({ severity: 'error', summary: 'Thiếu thông tin', detail: `Vui lòng điền đầy đủ thông tin cho ${p.typeName} ${i+1}`, life: 3000 })
        return
     }
  }

  submitting.value = true

  try {
     const payload = {
        tourId: tour.value.id,
        departureScheduleId: schedule.value.id,
        contactName: form.contactName,
        contactPhone: form.contactPhone,
        contactEmail: form.contactEmail,
        notes: form.notes,
        scheduleRowVersion: schedule.value.rowVersion || null,
        passengers: form.passengers.map(p => {
           let dob = null;
           if (p.dateOfBirth) {
               dob = (p.dateOfBirth instanceof Date) ? p.dateOfBirth.toISOString() : new Date(p.dateOfBirth).toISOString();
           }
           return {
              fullName: p.fullName,
              gender: p.gender,
              dateOfBirth: dob,
              idDocument: p.idDocument,
              type: p.type
           }
        })
     }

     const res = await bookingApi.create(payload)
     if (res.success || (res.data && res.data.bookingId)) {
        toast.add({ severity: 'success', summary: 'Thành công', detail: 'Đặt tour thành công!', life: 3000 })
        // Navigate to checkout
        router.push({ name: 'checkout', query: { bookingId: res.data?.bookingId || res.bookingId } })
     } else {
        toast.add({ severity: 'error', summary: 'Đặt tour thất bại', detail: res.message || 'Đã xảy ra lỗi', life: 4000 })
     }
  } catch(err) {
     toast.add({ severity: 'error', summary: 'Lỗi', detail: err.message || 'Lỗi kết nối tới máy chủ', life: 4000 })
  } finally {
     submitting.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.booking-page {
  background: #f8fafc;
  min-height: 100vh;
}

.booking-header {
  background: #1e293b;
  padding: 6rem 0 4rem;
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;

  h1 {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
  }

  &__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, rgba($color-primary-rgb, 0.1), transparent);
    pointer-events: none;
  }
}

.booking-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: flex-start;
  margin-top: 3rem;

  @include lg {
    grid-template-columns: 1.8fr 1fr;
  }
}

.booking-card {
  background: white;
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: $shadow-sm;
  border: 1px solid #f1f5f9;
  margin-bottom: 2rem;

  .card-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
  }
}

.loading-box, .error-box {
  min-height: 400px;
  @include flex-center;
  flex-direction: column;
  gap: 1rem;
}

.loading-text {
  color: #64748b;
}

.error-icon {
  font-size: 3rem;
  color: #cbd5e1;
  margin-bottom: 1rem;
}

.error-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #334155;
}

.back-link {
  margin-top: 1rem;
}

.card-icon {
  margin-right: 0.5rem;
  color: $color-primary;
}

.contact-form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-top: 1.5rem;
  @include md {
    grid-template-columns: repeat(2, 1fr);
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
      font-size: 0.9rem;
      font-weight: 600;
      color: #475569;
    }

    input, textarea, .p-inputtext, .p-select, .p-datepicker {
      width: 100% !important;
    }
  }
}

.required {
  color: #ef4444;
}

.span-full {
  @include md {
    grid-column: span 2;
  }
}

.passenger-section {
  margin-top: 1.5rem;
}

.passenger-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.no-margin {
  margin: 0;
}

.passenger-types-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.p-type-title {
  font-weight: 700;
  color: #334155;
}

.p-type-desc {
  font-size: 0.75rem;
  color: #64748b;
}

.p-counter {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.count-value {
  width: 1.5rem;
  text-align: center;
  font-weight: 700;
}

.passenger-forms-list {
  margin-top: 2rem;
  border-top: 1px solid #e2e8f0;
  padding-top: 1.5rem;
}

.forms-list-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
}

.passenger-form-item {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
}

.form-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.form-type-label {
  font-weight: 700;
  color: $color-primary;
}

.passenger-fields-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  @include md {
    grid-template-columns: repeat(2, 1fr);
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
      font-size: 0.9rem;
      font-weight: 600;
      color: #475569;
    }

    input, textarea, .p-inputtext, .p-select, .p-datepicker {
      width: 100% !important;
    }
  }
}

.sticky-sidebar {
  position: sticky;
  top: 6rem;
}

.summary-card {
  background: white;
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: $shadow-lg;
  border: 1px solid #f1f5f9;

  .summary-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #f1f5f9;
  }
}

.tour-brief-flex {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;

  .tour-thumb {
    width: 100px;
    height: 70px;
    object-fit: cover;
    border-radius: 12px;
  }

  .tour-name {
    font-size: 1rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }
}

.price-details {
  .price-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.75rem;
    font-size: 0.9rem;
    color: #64748b;

    .pax-total {
      font-weight: 700;
      color: #1e293b;
    }
  }
}

.total-summary-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px dashed #f1f5f9;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .total-label {
    font-weight: 700;
    color: #1e293b;
  }

  .total-value {
    font-size: 1.5rem;
    font-weight: 800;
    color: $color-primary;
  }
}

.secure-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  font-size: 0.8rem;
  color: #94a3b8;
  i {
    color: #10b981;
  }
}

.sticky-sidebar {
  position: sticky;
  top: 6rem;
}

.passenger-type-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
}

.p-counter {
  display: flex;
  align-items: center;
  gap: 1rem;

  .count-value {
    font-size: 1.1rem;
    font-weight: 700;
    min-width: 1.5rem;
    text-align: center;
  }
}

.vat-disclaimer {
  font-size: 10px;
  color: #94a3b8;
  text-align: right;
  margin-top: 0.25rem;
}

.confirm-booking-btn {
  width: 100%;
  margin-top: 2rem;
  background: linear-gradient(135deg, #1d4ed8, #2563eb);
  border: none;
  height: 52px;
  font-weight: 800;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(29, 78, 216, 0.25);
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 15px 20px -5px rgba(29, 78, 216, 0.35);
  }
}

.flex-center { display: flex; justify-content: center; align-items: center; }

</style>
