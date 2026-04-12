<template>
  <div class="booking-page">
    <div class="booking-header">
      <div class="container relative z-10">
        <h1>Booking Details</h1>
        <p class="text-white/80">Please fill in your contact information and passenger details.</p>
      </div>
      <div class="booking-header__overlay"></div>
    </div>

    <div class="container py-12">
      <div v-if="loadingTour" class="flex-center py-20 flex-col gap-4">
        <ProgressSpinner strokeWidth="4" />
        <span class="text-slate-500">Loading tour information...</span>
      </div>
      <div v-else-if="!tour || !schedule" class="flex-center py-20 flex-col text-center">
        <i class="pi pi-exclamation-circle text-4xl text-slate-300 mb-4"></i>
        <h2 class="text-xl font-bold text-slate-700">Tour or Schedule not found</h2>
        <Button label="Back to Tours" icon="pi pi-arrow-left" class="mt-4" @click="$router.push('/tours')" text />
      </div>
      <div v-else class="booking-layout">
        <!-- LEFT COLUMN: Forms -->
        <div class="booking-forms">
          
          <!-- Contact Info -->
          <div class="booking-card">
            <h2 class="card-title"><i class="pi pi-user mr-2 text-primary"></i> Contact Information</h2>
            <div class="p-fluid grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div class="field">
                <label for="contactName">Full Name <span class="text-red-500">*</span></label>
                <InputText id="contactName" v-model="form.contactName" placeholder="John Doe" />
              </div>
              <div class="field">
                <label for="contactPhone">Phone Number <span class="text-red-500">*</span></label>
                <InputText id="contactPhone" v-model="form.contactPhone" placeholder="+1 234 567 890" />
              </div>
              <div class="field md:col-span-2">
                <label for="contactEmail">Email Address <span class="text-red-500">*</span></label>
                <InputText id="contactEmail" v-model="form.contactEmail" type="email" placeholder="john@example.com" />
              </div>
              <div class="field md:col-span-2">
                <label for="notes">Special Requests / Notes</label>
                <Textarea id="notes" v-model="form.notes" rows="3" placeholder="Any dietary requirements or special requests..." />
              </div>
            </div>
          </div>

          <!-- Passenger Count Selection -->
          <div class="booking-card mt-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="card-title m-0"><i class="pi pi-users mr-2 text-primary"></i> Passengers</h2>
              <Tag :value="`${totalPassengers} Guests`" severity="info" rounded />
            </div>
            
            <div class="flex flex-col gap-4">
               <div class="passenger-type-row">
                 <div>
                   <h4 class="font-bold text-slate-700">Adults</h4>
                   <span class="text-xs text-slate-500">Over 12 years</span>
                 </div>
                 <div class="flex items-center gap-3">
                   <Button icon="pi pi-minus" @click="updatePassengerCount('Adult', -1)" :disabled="passengerCounts.Adult <= 1" rounded outlined severity="secondary" size="small" />
                   <span class="w-6 text-center font-bold">{{ passengerCounts.Adult }}</span>
                   <Button icon="pi pi-plus" @click="updatePassengerCount('Adult', 1)" :disabled="totalPassengers >= schedule.availableSeats" rounded outlined severity="secondary" size="small" />
                 </div>
               </div>

               <div class="passenger-type-row">
                 <div>
                   <h4 class="font-bold text-slate-700">Children</h4>
                   <span class="text-xs text-slate-500">2 - 12 years</span>
                 </div>
                 <div class="flex items-center gap-3">
                   <Button icon="pi pi-minus" @click="updatePassengerCount('Child', -1)" :disabled="passengerCounts.Child <= 0" rounded outlined severity="secondary" size="small" />
                   <span class="w-6 text-center font-bold">{{ passengerCounts.Child }}</span>
                   <Button icon="pi pi-plus" @click="updatePassengerCount('Child', 1)" :disabled="totalPassengers >= schedule.availableSeats" rounded outlined severity="secondary" size="small" />
                 </div>
               </div>

               <div class="passenger-type-row">
                 <div>
                   <h4 class="font-bold text-slate-700">Infants</h4>
                   <span class="text-xs text-slate-500">Under 2 years</span>
                 </div>
                 <div class="flex items-center gap-3">
                   <Button icon="pi pi-minus" @click="updatePassengerCount('Infant', -1)" :disabled="passengerCounts.Infant <= 0" rounded outlined severity="secondary" size="small" />
                   <span class="w-6 text-center font-bold">{{ passengerCounts.Infant }}</span>
                   <Button icon="pi pi-plus" @click="updatePassengerCount('Infant', 1)" :disabled="totalPassengers >= schedule.availableSeats" rounded outlined severity="secondary" size="small" />
                 </div>
               </div>
            </div>

            <!-- Passenger Details Form -->
            <div class="mt-8 border-t pt-6">
              <h3 class="text-lg font-bold text-slate-800 mb-4">Passenger Details</h3>
              
              <div v-for="(p, idx) in form.passengers" :key="idx" class="passenger-form mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                 <div class="flex justify-between items-center mb-4">
                   <h4 class="font-bold text-primary">
                      {{ p.typeName }} {{ getPassengerIndexForType(idx) }}
                   </h4>
                 </div>

                 <div class="p-fluid grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div class="field md:col-span-2">
                     <label>Full Name <span class="text-red-500">*</span></label>
                     <InputText v-model="p.fullName" placeholder="Passport Name" />
                   </div>
                   <div class="field">
                     <label>Gender <span class="text-red-500">*</span></label>
                     <Dropdown v-model="p.gender" :options="['Male', 'Female', 'Other']" placeholder="Select Gender" />
                   </div>
                   <div class="field">
                     <label>Date of Birth</label>
                     <DatePicker v-model="p.dateOfBirth" dateFormat="yy-mm-dd" showIcon :maxDate="new Date()" />
                   </div>
                   <div class="field md:col-span-2" v-if="p.type === 1"> <!-- Adult only mostly -->
                     <label>Passport / ID Card <span class="text-red-500">*</span></label>
                     <InputText v-model="p.idDocument" placeholder="ID Number" />
                   </div>
                 </div>
              </div>
            </div>

          </div>

        </div>

        <!-- RIGHT COLUMN: Summary -->
        <div class="booking-sidebar">
          <div class="summary-card sticky top-24">
            <h3 class="font-bold border-b pb-4 mb-4">Booking Summary</h3>
            
            <div class="tour-mini mb-6 flex gap-4">
              <img :src="tour.coverImage || 'https://images.unsplash.com/photo-1528127269322-539801943592?w=200'" class="w-16 h-16 object-cover rounded-lg" />
              <div>
                <h4 class="font-bold text-sm text-slate-800 line-clamp-2">{{ tour.title }}</h4>
                <div class="text-xs text-slate-500 mt-1"><i class="pi pi-calendar text-primary mr-1"></i> {{ new Date(schedule.departureDate).toLocaleDateString() }}</div>
              </div>
            </div>

            <div class="summary-details text-sm">
               <div class="flex justify-between mb-3 text-slate-600">
                 <span>Adults ({{ passengerCounts.Adult }}x)</span>
                 <span>${{ (passengerCounts.Adult * getPriceFor('Adult')).toFixed(2) }}</span>
               </div>
               <div class="flex justify-between mb-3 text-slate-600" v-if="passengerCounts.Child > 0">
                 <span>Children ({{ passengerCounts.Child }}x)</span>
                 <span>${{ (passengerCounts.Child * getPriceFor('Child')).toFixed(2) }}</span>
               </div>
               <div class="flex justify-between mb-3 text-slate-600" v-if="passengerCounts.Infant > 0">
                 <span>Infants ({{ passengerCounts.Infant }}x)</span>
                 <span>${{ (passengerCounts.Infant * getPriceFor('Infant')).toFixed(2) }}</span>
               </div>
               
               <div class="border-t my-4"></div>
               
               <div class="flex justify-between text-lg font-bold text-slate-800">
                 <span>Total Amount</span>
                 <span class="text-primary">${{ totalAmount.toFixed(2) }}</span>
               </div>
            </div>

            <Button label="Confirm Booking" icon="pi pi-check" size="large" raised class="w-full mt-6 py-3 font-bold" @click="submitBooking" :loading="submitting" />
            <p class="text-center text-[11px] text-slate-400 mt-4"><i class="pi pi-lock"></i> Secure processing. You'll pay on the next step.</p>
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
import { bookingApi } from '@/api/bookingApi'
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
  if (!schedule.value || !schedule.value.pricings) return 0
  const enumVal = typeEnumMap[typeStr]
  const p = schedule.value.pricings.find(x => x.passengerType === enumVal)
  return p ? p.price : 0
}

const totalAmount = computed(() => {
   return (passengerCounts.Adult * getPriceFor('Adult')) +
          (passengerCounts.Child * getPriceFor('Child')) +
          (passengerCounts.Infant * getPriceFor('Infant'))
})

async function loadData() {
  loadingTour.value = true
  try {
    const tourId = route.query.tourId
    const schId = route.params.scheduleId
    
    if (!tourId || !schId) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Invalid booking link' })
      return
    }

    const res = await tourApi.getById(tourId)
    if (res.success && res.data) {
      tour.value = res.data
      schedule.value = tour.value.schedules?.find(s => String(s.id) === String(schId))
      
      if (!schedule.value) {
         toast.add({ severity: 'warn', summary: 'Missing Schedule', detail: 'The selected schedule was not found.' })
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
     toast.add({ severity: 'error', summary: 'Validation', detail: 'Please fill in all contact information', life: 3000 })
     return
  }

  for (let i = 0; i < form.passengers.length; i++) {
     const p = form.passengers[i]
     if (!p.fullName || !p.gender) {
        toast.add({ severity: 'error', summary: 'Validation', detail: `Please fill in required fields for ${p.typeName} ${i+1}`, life: 3000 })
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
        toast.add({ severity: 'success', summary: 'Success', detail: 'Booking created successfully!', life: 3000 })
        // Navigate to checkout
        router.push({ name: 'checkout', query: { bookingId: res.data?.bookingId || res.bookingId } })
     } else {
        toast.add({ severity: 'error', summary: 'Booking Failed', detail: res.message || 'Error occurred', life: 4000 })
     }
  } catch(err) {
     toast.add({ severity: 'error', summary: 'Error', detail: err.message || 'Error communicating with server', life: 4000 })
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

.booking-page {
  background: $color-bg-page;
  min-height: 100vh;
}

.booking-header {
  position: relative;
  height: 200px;
  background: url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80') center/cover;
  display: flex; align-items: center; justify-content: flex-start;
  padding-top: $navbar-height;
  
  h1 { font-size: 2.5rem; color: white; font-weight: 800; margin: 0 0 4px; letter-spacing: -1px; }

  &__overlay {
    position: absolute; inset: 0;
    background: linear-gradient(90deg, rgba(35,87,137,0.95) 0%, rgba(35,87,137,0.5) 100%);
  }
}

.booking-layout {
  display: flex; flex-direction: column; gap: $space-6;
  @media (min-width: 1024px) { flex-direction: row; align-items: flex-start; }
}

.booking-forms { flex: 1; }
.booking-sidebar { width: 100%; @media (min-width: 1024px) { width: 380px; } }

.booking-card {
  background: white; border-radius: $border-radius-xl; padding: $space-6;
  box-shadow: $shadow-md; border: 1px solid $color-border-light;
  .card-title { font-size: 1.25rem; font-weight: 700; color: $color-text-primary; margin-bottom: 2px; }
}

.summary-card {
  background: white; border-radius: $border-radius-xl; padding: $space-6;
  box-shadow: $shadow-xl; border: 1px solid $color-primary-light;
}

.passenger-type-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 16px; border: 1px solid $color-border-light; border-radius: $border-radius-md;
  background: #f8fafc;
}

.field {
  display: flex; flex-direction: column; gap: 6px;
  label { font-size: 13px; font-weight: 600; color: $color-text-secondary; }
}

.flex-center { display: flex; justify-content: center; align-items: center; }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>
