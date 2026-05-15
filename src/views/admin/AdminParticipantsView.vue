<template>
  <div class="admin-participants-page">
    <div class="admin-page-header">
      <div class="header-left">
        <h1 class="page-title">Hành khách Tour</h1>
        <p class="text-slate-400 text-sm">Quản lý danh sách hành khách theo từng lịch trình khởi hành</p>
      </div>
      <div class="header-actions">
        <Button
          label="Tải lại dữ liệu"
          icon="pi pi-refresh"
          @click="fetchData"
          :loading="loading"
          severity="secondary"
          size="small"
          raised
        />
      </div>
    </div>

    <div class="admin-card main-content-card">
      <DataTable
        :value="filteredParticipants"
        :loading="loading"
        v-model:expandedRows="expandedRows"
        dataKey="departureScheduleId"
        stripedRows
        removableSort
        :rows="10"
        :paginator="filteredParticipants.length > 10"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        :rowsPerPageOptions="[10, 25, 50]"
        tableStyle="min-width: 60rem"
        class="p-datatable-sm custom-table flex-1"
        scrollable
        scrollHeight="calc(100vh - 320px)"
      >
        <template #header>
          <div class="table-header-box">
            <div class="search-wrapper">
              <i class="pi pi-search search-icon"></i>
              <InputText v-model="searchQuery" placeholder="Tìm tên tour hoặc ID lịch trình..." class="search-input" />
            </div>
            <div class="stats-mini">
              <Tag severity="info" :value="`Tổng cộng: ${participants.length} lịch trình`" rounded />
            </div>
          </div>
        </template>

        <template #empty>
          <div class="empty-state">
            <div class="empty-icon-circle">
              <i class="pi pi-users"></i>
            </div>
            <h3>Chưa có dữ liệu hành khách</h3>
            <p>Danh sách sẽ hiển thị khi có tour được đặt thành công.</p>
          </div>
        </template>

        <Column expander style="width: 3rem" />
        
        <Column field="tourName" header="Tên Tour" sortable>
          <template #body="{ data }">
            <div class="tour-info-cell">
              <span class="tour-title">{{ data.tourName }}</span>
              <span class="tour-sub">#SCH-{{ data.departureScheduleId }}</span>
            </div>
          </template>
        </Column>

        <Column field="departureDate" header="Ngày đi" sortable style="width: 15%">
          <template #body="{ data }">
            <div class="date-badge">
              <i class="pi pi-calendar"></i>
              <span>{{ formatDate(data.departureDate) }}</span>
            </div>
          </template>
        </Column>

        <Column field="totalPassengers" header="Sĩ số" sortable style="width: 10%; text-align: center">
          <template #body="{ data }">
            <div class="pax-count">
              <span class="number">{{ data.totalPassengers }}</span>
              <span class="unit">khách</span>
            </div>
          </template>
        </Column>

        <Column header="Trạng thái" style="width: 15%">
          <template #body="{ data }">
             <Tag 
                :value="getDepartureStatus(data.departureDate)" 
                :severity="getDepartureStatusSeverity(data.departureDate)"
                class="status-tag"
             />
          </template>
        </Column>

        <!-- Expanded Row: Premium Booking & Passenger List -->
        <template #expansion="slotProps">
          <div class="expansion-wrapper">
            <div class="expansion-header">
              <i class="pi pi-info-circle"></i>
              <span>Chi tiết hành khách cho chuyến đi ngày {{ formatDate(slotProps.data.departureDate) }}</span>
            </div>
            
            <div class="booking-grid">
              <div v-for="booking in slotProps.data.bookings" :key="booking.bookingId" class="booking-card">
                <div class="booking-card-header">
                  <div class="b-info">
                    <span class="b-id">Mã đơn: #{{ booking.bookingId }}</span>
                    <Tag :value="booking.status" :severity="getBookingStatusSeverity(booking.status)" size="small" rounded />
                  </div>
                  <div class="b-contact">
                    <span class="contact-name"><i class="pi pi-user"></i> {{ booking.contactName }}</span>
                    <span class="contact-phone"><i class="pi pi-phone"></i> {{ booking.contactPhone }}</span>
                  </div>
                </div>

                <div class="passengers-list">
                  <table class="minimal-table">
                    <thead>
                      <tr>
                        <th>Họ tên</th>
                        <th>Giới tính</th>
                        <th>Ngày sinh</th>
                        <th>CMND/Passport</th>
                        <th>Phân loại</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(p, idx) in booking.passengers" :key="idx">
                        <td class="font-semibold text-slate-700">{{ p.fullName }}</td>
                        <td>{{ p.gender }}</td>
                        <td>{{ p.dateOfBirth ? formatDate(p.dateOfBirth) : '-' }}</td>
                        <td class="text-xs font-mono">{{ p.idDocument || '-' }}</td>
                        <td>
                          <span class="type-pill" :class="'type-' + p.type">
                            {{ getPassengerTypeLabel(p.type) }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { bookingApi } from '@/api/bookingApi'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import InputText from 'primevue/inputtext'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const loading = ref(true)
const participants = ref([])
const expandedRows = ref([])
const searchQuery = ref('')

async function fetchData() {
  loading.value = true
  try {
    const res = await bookingApi.getTourParticipants()
    if (res.success) {
      participants.value = res.data
    }
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách', life: 3000 })
  } finally {
    loading.value = false
  }
}

const filteredParticipants = computed(() => {
  if (!searchQuery.value) return participants.value
  const query = searchQuery.value.toLowerCase()
  return participants.value.filter(p => 
    p.tourName.toLowerCase().includes(query) || 
    p.departureScheduleId.toString().includes(query)
  )
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('vi-VN')
}

function getDepartureStatus(dateStr) {
  const depDate = new Date(dateStr)
  const now = new Date()
  return depDate < now ? 'Đã khởi hành' : 'Sắp khởi hành'
}

function getDepartureStatusSeverity(dateStr) {
  return new Date(dateStr) < new Date() ? 'secondary' : 'success'
}

function getBookingStatusSeverity(status) {
  const s = status.toLowerCase()
  if (s === 'confirmed' || s === 'completed') return 'success'
  if (s === 'pending') return 'warn'
  return 'danger'
}

function getPassengerTypeLabel(type) {
  const labels = { 1: 'Người lớn', 2: 'Trẻ em', 3: 'Em bé' }
  return labels[type] || 'Khác'
}

onMounted(fetchData)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.admin-participants-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  animation: fadeIn 0.5s ease-out;
  padding: 0; // Bỏ padding để card sát với các thành phần khác
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.admin-page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  .page-title {
    font-size: 1.75rem;
    font-weight: 800;
    color: #1e293b;
    margin: 0;
    letter-spacing: -0.025em;
  }
}

.main-content-card {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  background: white;
  flex: 1;
  margin-bottom: 0; 
  display: flex;
  flex-direction: column;
}

// Custom Table Styling
.table-header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;

  .search-wrapper {
    position: relative;
    width: 320px;
    
    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
      z-index: 1;
    }
    
    .search-input {
      width: 100%;
      padding-left: 40px;
      border-radius: 10px;
      border: 1px solid #cbd5e1;
      background: white;
      transition: all 0.2s;
      
      &:focus {
        border-color: $color-primary;
        box-shadow: 0 0 0 3px rgba($color-primary, 0.1);
      }
    }
  }
}

.tour-info-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
  .tour-title { font-weight: 700; color: #334155; }
  .tour-sub { font-size: 11px; color: #94a3b8; font-family: monospace; }
}

.date-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #f1f5f9;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #475569;
  i { color: $color-primary; }
}

.pax-count {
  display: flex;
  flex-direction: column;
  align-items: center;
  .number { font-size: 1.125rem; font-weight: 800; color: $color-primary; }
  .unit { font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: 600; }
}

.status-tag {
  font-weight: 700;
  letter-spacing: 0.02em;
}

// Expansion Area
.expansion-wrapper {
  padding: 1.5rem;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.expansion-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1rem;
  color: #64748b;
  font-weight: 600;
  font-size: 0.9rem;
  i { color: $color-primary; }
}

.booking-grid {
  display: grid;
  grid-template-cols: 1fr;
  gap: 1.5rem;
}

.booking-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  overflow: hidden;

  .booking-card-header {
    padding: 12px 20px;
    background: #f1f5f9;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;

    .b-info {
      display: flex;
      align-items: center;
      gap: 12px;
      .b-id { font-weight: 800; color: #1e293b; font-size: 0.9rem; }
    }

    .b-contact {
      display: flex;
      gap: 20px;
      font-size: 0.85rem;
      color: #64748b;
      span { display: flex; align-items: center; gap: 6px; }
      i { font-size: 12px; color: #94a3b8; }
    }
  }
}

.passengers-list {
  padding: 0;
  .minimal-table {
    width: 100%;
    border-collapse: collapse;
    th {
      text-align: left;
      padding: 10px 20px;
      background: #fafafa;
      color: #94a3b8;
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.05em;
    }
    td {
      padding: 12px 20px;
      border-top: 1px solid #f1f5f9;
      font-size: 0.9rem;
      color: #475569;
    }
    tbody tr:hover {
      background-color: #f8fafc;
    }
  }
}

.type-pill {
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  &.type-1 { background: #dcfce7; color: #166534; } // Adult
  &.type-2 { background: #dbeafe; color: #1e40af; } // Child
  &.type-3 { background: #fef9c3; color: #854d0e; } // Infant
}

.empty-state {
  padding: 4rem 0;
  text-align: center;
  .empty-icon-circle {
    width: 80px; height: 80px; background: #f1f5f9;
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1.5rem;
    i { font-size: 2.5rem; color: #cbd5e1; }
  }
  h3 { color: #1e293b; font-weight: 700; margin-bottom: 0.5rem; }
  p { color: #94a3b8; }
}

:deep(.p-datatable-wrapper) {
  &::-webkit-scrollbar { width: 6px; height: 6px; }
  &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
  &::-webkit-scrollbar-track { background: transparent; }
}
</style>
