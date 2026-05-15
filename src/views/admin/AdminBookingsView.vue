<template>
  <div class="admin-bookings-page">
    <div class="admin-page-header">
      <h1 class="page-title">{{ $t('admin.sidebar.bookings') }}</h1>
      <Button icon="pi pi-refresh" :label="$t('admin.dashboard.refresh')" @click="fetchBookings" outlined />
    </div>

    <div class="admin-card">
      <DataTable
        :value="filteredBookings"
        :loading="loading"
        stripedRows
        removableSort
        :rows="10"
        :paginator="filteredBookings.length > 10"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        :globalFilterFields="['id', 'contactName', 'contactEmail', 'contactPhone', 'tourName']"
        tableStyle="min-width: 60rem"
        class="p-datatable-sm"
        scrollable
        scrollHeight="flex"
      >
        <template #header>
          <div class="table-header">
            <IconField>
              <InputIcon class="pi pi-search" />
              <InputText v-model="searchQuery" placeholder="Search bookings..." />
            </IconField>
          </div>
        </template>

        <template #empty>
          <div class="empty-msg">
            <i class="pi pi-inbox" style="font-size: 2rem; opacity: 0.3"></i>
            <p>No bookings found.</p>
          </div>
        </template>

        <Column field="id" header="ID" sortable style="width: 80px">
          <template #body="{ data }">
            <span class="id-badge">#{{ data.id }}</span>
          </template>
        </Column>

        <Column header="Customer" sortable style="min-width: 200px">
          <template #body="{ data }">
            <div class="flex items-center gap-3">
               <div>
                  <div class="font-semibold">{{ data.contactName }}</div>
                  <div class="text-xs text-gray-500">{{ data.contactEmail }} | {{ data.contactPhone }}</div>
               </div>
            </div>
          </template>
        </Column>

        <Column field="tourName" header="Tour" sortable style="min-width: 250px" />

        <Column field="createdAt" header="Date" sortable style="width: 150px">
          <template #body="{ data }">
             {{ new Date(data.createdAt).toLocaleDateString() }}
          </template>
        </Column>

        <Column field="totalAmount" header="Amount" sortable style="width: 140px" class="text-right">
           <template #body="{ data }">
              <span class="font-bold text-slate-800">{{ formatPrice(data.totalAmount) }} đ</span>
           </template>
        </Column>

        <Column field="status" header="Status" sortable style="width: 130px">
          <template #body="{ data }">
            <Tag :value="$t('booking.status.' + getStatusString(data.status).toLowerCase(), getStatusString(data.status))" 
                 :severity="getStatusSeverity(data.status)" rounded />
          </template>
        </Column>

        <Column header="Actions" style="width: 100px" frozen alignFrozen="right">
          <template #body="{ data }">
            <div class="action-btns">
              <Button icon="pi pi-pencil" text rounded aria-label="Edit Status" severity="secondary" size="small" @click="openEditModal(data)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- PrimeVue Dialog: Edit Status -->
    <Dialog v-model:visible="showModal" header="Update Booking Status" modal :style="{ width: '400px' }"
      :breakpoints="{ '640px': '95vw' }" :draggable="false" class="booking-dialog">
      <div v-if="selectedBooking" class="dialog-form">
        <p class="mb-4 text-sm text-gray-600">
           Changing status for booking <strong>#{{ selectedBooking.id }}</strong> ({{ selectedBooking.contactName }})
        </p>

        <div class="form-field">
          <label for="statusSelect">New Status</label>
          <Dropdown id="statusSelect" v-model="form.status" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Select a status" fluid />
        </div>
      </div>

      <template #footer>
        <Button :label="$t('common.cancel')" severity="secondary" text @click="closeModal" />
        <Button label="Update" icon="pi pi-check" @click="submitForm" :loading="saving" raised />
      </template>
    </Dialog>

    <!-- PrimeVue Toast -->
    <Toast position="top-right" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { bookingApi } from '@/api/bookingApi'
import { useI18n } from 'vue-i18n'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Dropdown from 'primevue/dropdown'
import Toast from 'primevue/toast'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import { useToast as usePrimeToast } from 'primevue/usetoast'

const { t } = useI18n()
const primeToast = usePrimeToast()
const bookings = ref([])
const loading = ref(true)
const saving = ref(false)
const searchQuery = ref('')
const showModal = ref(false)
const selectedBooking = ref(null)

const form = ref({ status: 1 })

// Enum mappings: 1: Pending, 2: AwaitingPayment, 3: Confirmed, 4: Cancelled, 5: Completed
const statusOptions = ref([
  { label: 'Pending', value: 1 },
  { label: 'Awaiting Payment', value: 2 },
  { label: 'Confirmed', value: 3 },
  { label: 'Cancelled', value: 4 },
  { label: 'Completed', value: 5 }
])

// Định dạng số tiền sang kiểu VNĐ để hiển thị trong bảng
function formatPrice(val) {
  return new Intl.NumberFormat('vi-VN').format(val)
}

// Lấy tên trạng thái (Label) từ giá trị Enum
function getStatusString(val) {
   const opt = statusOptions.value.find(o => o.value === val);
   return opt ? opt.label : 'Unknown';
}

// Tải danh sách toàn bộ đơn đặt tour từ API
async function fetchBookings() {
  loading.value = true
  try {
    const res = await bookingApi.getAll()
    if (res && res.success) bookings.value = res.data
    else if (res && res.data) bookings.value = res.data
    else bookings.value = res
  } catch {
    primeToast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách đặt chỗ', life: 3000 })
  } finally {
    loading.value = false
  }
}

const filteredBookings = computed(() => {
  if (!searchQuery.value) return bookings.value;
  const q = searchQuery.value.toLowerCase();
  return bookings.value.filter(b => 
    String(b.id).includes(q) || 
    (b.contactName || '').toLowerCase().includes(q) ||
    (b.contactEmail || '').toLowerCase().includes(q) ||
    (b.tourName || '').toLowerCase().includes(q)
  );
})

// Mở cửa sổ cập nhật trạng thái cho một đơn đặt tour cụ thể
function openEditModal(booking) {
  selectedBooking.value = booking
  form.value.status = booking.status
  showModal.value = true
}

// Đóng cửa sổ cập nhật trạng thái
function closeModal() { 
  showModal.value = false 
  selectedBooking.value = null
}

// Gửi yêu cầu cập nhật trạng thái mới về server thông qua API
async function submitForm() {
  saving.value = true
  try {
    const res = await bookingApi.updateStatus(selectedBooking.value.id, form.value.status)
      
    if (res.success || res.message) {
      primeToast.add({ severity: 'success', summary: 'Đã cập nhật', detail: 'Cập nhật trạng thái đặt chỗ thành công', life: 3000 })
      closeModal()
      fetchBookings()
    } else {
      primeToast.add({ severity: 'error', summary: 'Lỗi', detail: res.message || 'Lỗi khi cập nhật', life: 3000 })
    }
  } catch (err) {
    primeToast.add({ severity: 'error', summary: 'Lỗi', detail: err.message || 'Lỗi khi cập nhật', life: 3000 })
  } finally { saving.value = false }
}

// Xác định màu sắc hiển thị cho Tag trạng thái dựa trên giá trị Enum
function getStatusSeverity(status) {
  switch (status) {
    case 3: // Confirmed
    case 5: // Completed
       return 'success'
    case 1: // Pending
    case 2: // Awaiting Payment
       return 'warn'
    case 4: // Cancelled
       return 'danger'
    default: return 'info'
  }
}

onMounted(fetchBookings)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.admin-bookings-page { 
  display: flex;
  flex-direction: column;
  height: 100%;
  animation: fade-in-up 0.4s ease-out; 
}

@keyframes fade-in-up { 0% { opacity: 0; transform: translateY(12px); } 100% { opacity: 1; transform: translateY(0); } }

.table-header {
  display: flex; justify-content: flex-end;
}

.empty-msg {
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  padding: 40px 0; color: $color-text-secondary;
}

.id-badge {
  background: $color-bg-surface; padding: 2px 8px; border-radius: $border-radius-full;
  font-size: 12px; font-weight: 600; color: $color-text-secondary;
}

.action-btns { display: flex; gap: 4px; }

.dialog-form { display: flex; flex-direction: column; gap: 20px; }
.form-field {
  flex: 1; display: flex; flex-direction: column; gap: 6px;
  label { font-size: 12px; font-weight: 600; color: $color-text-secondary; text-transform: uppercase; letter-spacing: 0.04em; }
}

.flex { display: flex; }
.items-center { align-items: center; }
.gap-3 { gap: 12px; }
.font-semibold { font-weight: 600; }
.text-xs { font-size: 12px; }
.text-sm { font-size: 14px; }
.text-gray-500 { color: #6b7280; }
.text-gray-600 { color: #4b5563; }
.mb-4 { margin-bottom: 16px; }
.text-right { text-align: right; }
.font-bold { font-weight: 700; }
.text-slate-800 { color: #1e293b; }
</style>
